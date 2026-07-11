using CajaDGM.Domain.Enums;
using CajaDGM.Domain.Interfaces;
using CajaDGM.Domain.Models;

namespace CajaDGM.Application.Services;

public class CobroService
{
    private readonly IPersonaService _personaService;
    private readonly ITarifaService _tarifaService;
    private readonly IPagoService _pagoService;
    private readonly IComprobanteService _comprobanteService;
    private readonly SesionService _sesionService;

    public CobroService(
        IPersonaService personaService,
        ITarifaService tarifaService,
        IPagoService pagoService,
        IComprobanteService comprobanteService,
        SesionService sesionService)
    {
        _personaService = personaService;
        _tarifaService = tarifaService;
        _pagoService = pagoService;
        _comprobanteService = comprobanteService;
        _sesionService = sesionService;
    }

    public async Task<Persona?> BuscarPersonaAsync(string cedula, string pasaporte)
    {
        if (!string.IsNullOrWhiteSpace(cedula))
            return await _personaService.BuscarPorCedulaAsync(cedula);
        if (!string.IsNullOrWhiteSpace(pasaporte))
            return await _personaService.BuscarPorPasaporteAsync(pasaporte);
        return null;
    }

    public async Task<ResultadoConsultaTarifa> ConsultarMontoAsync(TipoServicio tipoServicio, string cedulaPersona)
    {
        return await _tarifaService.ConsultarMontoServicioAsync(tipoServicio, cedulaPersona);
    }

    public async Task<Comprobante> ProcesarPagoAsync(
        Persona persona, TipoServicio servicio, decimal montoTarifa,
        decimal montoPenalidad, decimal montoTotal, FormaPago formaPago)
    {
        var sesion = _sesionService.SesionActual
            ?? throw new InvalidOperationException("No hay sesión de caja abierta.");

        var pago = new Pago
        {
            IdSesion = sesion.IdSesion,
            CedulaPagador = persona.Cedula,
            NombresPagador = persona.Nombres,
            ApellidosPagador = persona.Apellidos,
            TipoServicio = servicio,
            MontoTarifa = montoTarifa,
            MontoPenalidad = montoPenalidad,
            MontoTotal = montoTotal,
            FormaPago = formaPago,
            FechaPago = DateTime.Now,
        };

        var (exito, idPago, mensaje) = await _pagoService.RegistrarPagoAsync(pago);
        if (!exito)
            throw new InvalidOperationException($"Error al registrar pago en el CORE: {mensaje}");

        pago.IdPago = idPago;
        var comprobante = await _comprobanteService.EmitirComprobanteAsync(pago, sesion.NombreCajero);
        pago.IdComprobante = comprobante.IdComprobante;

        sesion.Pagos.Add(pago);
        sesion.Comprobantes.Add(comprobante);

        return comprobante;
    }

    public async Task SincronizarPagosPendientesAsync()
    {
        await _pagoService.SincronizarPagosPendientesAsync();
    }
}
