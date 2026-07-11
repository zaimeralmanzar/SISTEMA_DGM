using CajaDGM.Domain.Interfaces;
using CajaDGM.Domain.Models;

namespace CajaDGM.Integration.Services;

public class MockComprobanteService : IComprobanteService
{
    private static int _ultimoCorrelativo = 1000;

    public Task<Comprobante> EmitirComprobanteAsync(Pago pago, string nombreCajero)
    {
        var correlativo = Interlocked.Increment(ref _ultimoCorrelativo);

        var comprobante = new Comprobante
        {
            IdComprobante = Guid.NewGuid(),
            NumeroComprobante = $"CMP-{DateTime.Now:yyyyMMdd}-{correlativo:D6}",
            IdSesion = pago.IdSesion,
            IdPago = pago.IdPago,
            CedulaPagador = pago.CedulaPagador,
            NombresPagador = pago.NombresPagador,
            ApellidosPagador = pago.ApellidosPagador,
            TipoServicio = pago.TipoServicio,
            DescripcionServicio = $"{pago.TipoServicio} - {pago.MontoTotal:C}",
            MontoTotal = pago.MontoTotal,
            FormaPago = pago.FormaPago,
            FechaEmision = DateTime.Now,
            Cajero = nombreCajero,
        };

        return Task.FromResult(comprobante);
    }

    // ============================================================
    //  REEMPLAZAR POR LLAMADA REAL AL SISTEMA DE INTEGRACIÓN:
    //
    //  var response = await _httpClient.PostAsJsonAsync(
    //      "api/v1/comprobantes/emitir", pago);
    //  return await response.Content
    //      .ReadFromJsonAsync<Comprobante>();
    // ============================================================
}
