using CajaDGM.Domain.Enums;
using CajaDGM.Domain.Interfaces;
using CajaDGM.Domain.Models;
using CajaDGM.Integration.Data;

namespace CajaDGM.Integration.Services;

public class MockTarifaService : ITarifaService
{
    private static readonly Random _rng = new();

    public Task<ResultadoConsultaTarifa> ConsultarMontoServicioAsync(TipoServicio tipoServicio, string cedulaPersona)
    {
        if (!CatalogoServiciosMock.Servicios.TryGetValue(tipoServicio, out var svc))
        {
            return Task.FromResult(new ResultadoConsultaTarifa
            {
                Exito = false,
                MensajeError = $"Servicio {tipoServicio} no encontrado en el catálogo.",
            });
        }

        var penalidad = tipoServicio == TipoServicio.PrórrogaEstancia
            ? Math.Round((decimal)_rng.NextDouble() * 2000, 2)
            : 0m;

        return Task.FromResult(new ResultadoConsultaTarifa
        {
            MontoTarifa = svc.Tarifa,
            MontoPenalidad = penalidad,
            MontoTotal = svc.Tarifa + penalidad,
            Moneda = "DOP",
            DescripcionServicio = svc.Descripcion,
            Concepto = svc.Descripcion,
            Exito = true,
        });
    }

    // ============================================================
    //  REEMPLAZAR POR LLAMADA REAL AL SISTEMA DE INTEGRACIÓN:
    //
    //  var request = new { TipoServicio = tipoServicio.ToString(),
    //                      CedulaPersona = cedulaPersona };
    //  var response = await _httpClient.PostAsJsonAsync(
    //      "api/v1/tarifas/consultar", request);
    //  return await response.Content.ReadFromJsonAsync
    //      <ResultadoConsultaTarifa>();
    // ============================================================
}
