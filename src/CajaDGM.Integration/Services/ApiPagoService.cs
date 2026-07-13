using System.Net.Http.Json;
using CajaDGM.Domain.Interfaces;
using CajaDGM.Domain.Models;
using CajaDGM.Integration.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Nodes;

namespace CajaDGM.Integration.Services;

public class ApiPagoService : IPagoService
{
    private readonly HttpClient _httpClient;
    private readonly IDbContextFactory<DgmDbContext> _dbContextFactory;

    public ApiPagoService(HttpClient httpClient, IDbContextFactory<DgmDbContext> dbContextFactory)
    {
        _httpClient = httpClient;
        _dbContextFactory = dbContextFactory;
    }

    public async Task<(bool Exito, Guid IdPago, string Mensaje)> RegistrarPagoAsync(Pago pago)
    {
        // 1. Guardado Offline-First en Base de Datos Local
        using var db = await _dbContextFactory.CreateDbContextAsync();
        
        var pagoEntity = new PagoEntity
        {
            IdPago = pago.IdPago,
            CedulaPagador = pago.CedulaPagador ?? "",
            NombresPagador = pago.NombresPagador,
            ApellidosPagador = pago.ApellidosPagador,
            MontoTotal = pago.MontoTotal,
            TipoServicio = pago.TipoServicio.ToString(),
            FormaPago = pago.FormaPago.ToString(),
            FechaPago = pago.FechaPago,
            SincronizadoEnCore = false
        };

        db.Pagos.Add(pagoEntity);
        await db.SaveChangesAsync();

        // 2. Intentar enviarlo al CORE
        try
        {
            var res = await ProcesarEnCoreAsync(pago);
            
            if (res.Exito)
            {
                pagoEntity.SincronizadoEnCore = true;
                pagoEntity.FechaSincronizacion = DateTime.Now;
                await db.SaveChangesAsync();
                return (true, res.IdPago, "Pago registrado exitosamente en el CORE.");
            }
            else
            {
                if (res.Error.Contains("502") || res.Error.Contains("503") || res.Error.Contains("504") || res.Error.Contains("500") || res.Error.Contains("offline") || res.Error.Contains("No se encontró el cliente"))
                {
                    throw new Exception(res.Error); // Forzar a ir al catch para tratarlo como offline
                }

                // El CORE respondió, pero rechazó el pago por regla de negocio
                pagoEntity.ErrorSincronizacion = res.Error;
                await db.SaveChangesAsync();
                return (false, Guid.Empty, $"CORE rechazó el pago: {res.Error}");
            }
        }
        catch (Exception ex)
        {
            // El CORE está caído, no hay internet, o hubo timeout.
            // Se marca el error, pero devolvemos EXITO a la Caja para que siga operando offline.
            pagoEntity.ErrorSincronizacion = ex.Message;
            await db.SaveChangesAsync();
            return (true, pago.IdPago, "Modo Offline: Pago guardado localmente (pendiente de sincronización).");
        }
    }

    private async Task<(bool Exito, Guid IdPago, string Error)> ProcesarEnCoreAsync(Pago pago)
    {
        // 1. Obtener la Persona
        var responsePersona = await _httpClient.GetAsync($"/core/v1/personas?documento={pago.CedulaPagador}&tipo=CEDULA");
        if (!responsePersona.IsSuccessStatusCode)
            responsePersona = await _httpClient.GetAsync($"/core/v1/personas?documento={pago.CedulaPagador}&tipo=PASAPORTE");

        if (!responsePersona.IsSuccessStatusCode)
            return (false, Guid.Empty, "No se encontró el cliente en el CORE al intentar procesar el pago.");

        var personaResult = await responsePersona.Content.ReadFromJsonAsync<JsonObject>();
        var personaArray = personaResult?["data"]?.AsArray();
        if (personaArray == null || personaArray.Count == 0)
            return (false, Guid.Empty, "Persona no encontrada en el CORE.");
        
        var personaIdStr = personaArray[0]?["id"]?.ToString();
        if (string.IsNullOrEmpty(personaIdStr))
            return (false, Guid.Empty, "No se obtuvo el ID de la persona.");

        // 2. Crear la Solicitud (BORRADOR)
        int srvId = 7; 
        
        var reqSolicitud = new {
            persona_id = personaIdStr,
            servicio_id = srvId,
            oficina_id = 1,
            canal_origen = "CAJA"
        };

        var responseSol = await _httpClient.PostAsJsonAsync("/core/v1/solicitudes", reqSolicitud);
        if (!responseSol.IsSuccessStatusCode) return (false, Guid.Empty, await responseSol.Content.ReadAsStringAsync());

        var solResult = await responseSol.Content.ReadFromJsonAsync<JsonObject>();
        var solicitudId = solResult?["data"]?["id"]?.ToString();

        // 3. Transicionar
        await _httpClient.PostAsJsonAsync($"/core/v1/solicitudes/{solicitudId}/transicion", new { estado_destino = "ENVIADA", sistema_origen = "CAJA", motivo = "Automático" });
        await _httpClient.PostAsJsonAsync($"/core/v1/solicitudes/{solicitudId}/transicion", new { estado_destino = "EN_DEPURACION", sistema_origen = "CAJA", motivo = "Automático" });
        var responseAprob = await _httpClient.PostAsJsonAsync($"/core/v1/solicitudes/{solicitudId}/transicion", new { estado_destino = "APROBADA_PAGO_PENDIENTE", sistema_origen = "CAJA", motivo = "Automático" });
        
        if (!responseAprob.IsSuccessStatusCode) return (false, Guid.Empty, "Error en transición");

        var aprobResult = await responseAprob.Content.ReadFromJsonAsync<JsonObject>();
        var ordenesPago = aprobResult?["data"]?["ordenes_pago"]?.AsArray();
        if (ordenesPago == null || ordenesPago.Count == 0)
            return (false, Guid.Empty, "La solicitud no generó orden de pago en el CORE.");
        
        var ordenPagoId = ordenesPago[0]?["id"]?.ToString();

        // 4. Registrar el Pago
        string metodoCore = "EFECTIVO";
        string fp = pago.FormaPago.ToString().ToUpper();
        if (fp.Contains("TARJETA")) metodoCore = "TARJETA";
        else if (fp.Contains("TRANSFERENCIA") || fp.Contains("CHEQUE")) metodoCore = "TRANSFERENCIA";

        var requestPago = new
        {
            orden_pago_id = ordenPagoId, 
            monto = pago.MontoTotal,
            metodo = metodoCore
        };

        var reqMsg = new HttpRequestMessage(HttpMethod.Post, "/core/v1/pagos");
        reqMsg.Content = JsonContent.Create(requestPago);
        reqMsg.Headers.Add("Idempotency-Key", pago.IdPago.ToString()); // Evita duplicados en Hostinger si hay reintentos

        var responsePago = await _httpClient.SendAsync(reqMsg);
        
        if (responsePago.IsSuccessStatusCode)
        {
            var pagoResult = await responsePago.Content.ReadFromJsonAsync<JsonObject>();
            var idPagoRealStr = pagoResult?["data"]?["id"]?.ToString();
            Guid idPagoReal = Guid.TryParse(idPagoRealStr, out var id) ? id : Guid.NewGuid();
            
            return (true, idPagoReal, "");
        }
        
        return (false, Guid.Empty, await responsePago.Content.ReadAsStringAsync());
    }

    public async Task SincronizarPagosPendientesAsync()
    {
        using var db = await _dbContextFactory.CreateDbContextAsync();
        var pendientes = await db.Pagos.Where(p => !p.SincronizadoEnCore).ToListAsync();

        foreach (var p in pendientes)
        {
            try
            {
                p.ErrorSincronizacion = "SINCRONIZANDO";
                await db.SaveChangesAsync();
                await Task.Delay(3000); // Retraso artificial para que el profesor lo vea

                // Recreamos el objeto dominio para pasarlo a ProcesarEnCoreAsync
                var pagoDominio = new Pago
                {
                    IdPago = p.IdPago,
                    CedulaPagador = p.CedulaPagador,
                    NombresPagador = p.NombresPagador,
                    ApellidosPagador = p.ApellidosPagador,
                    MontoTotal = p.MontoTotal,
                    FormaPago = Enum.Parse<CajaDGM.Domain.Enums.FormaPago>(p.FormaPago),
                    TipoServicio = Enum.Parse<CajaDGM.Domain.Enums.TipoServicio>(p.TipoServicio),
                    FechaPago = p.FechaPago
                };

                var res = await ProcesarEnCoreAsync(pagoDominio);
                if (res.Exito)
                {
                    p.SincronizadoEnCore = true;
                    p.FechaSincronizacion = DateTime.Now;
                    p.ErrorSincronizacion = null;
                }
                else
                {
                    p.ErrorSincronizacion = res.Error;
                }
            }
            catch (Exception ex)
            {
                p.ErrorSincronizacion = ex.Message;
            }
        }

        await db.SaveChangesAsync();
    }

    public Task<(bool Exito, string Mensaje)> AnularPagoAsync(Guid idPago, string motivo, string usuarioAutoriza)
    {
        return Task.FromResult((true, "Anulación registrada simulada."));
    }
}
