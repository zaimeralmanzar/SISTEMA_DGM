using CajaDGM.Domain.Enums;
using CajaDGM.Domain.Interfaces;
using CajaDGM.Domain.Models;

namespace CajaDGM.Integration.Services;

public class MockPagoService : IPagoService
{
    private static readonly HashSet<Guid> _pagosRegistrados = [];

    public Task<(bool Exito, Guid IdPago, string Mensaje)> RegistrarPagoAsync(Pago pago)
    {
        _pagosRegistrados.Add(pago.IdPago);
        return Task.FromResult(
            (true, pago.IdPago, "Pago registrado exitosamente en el CORE."));
    }

    public Task<(bool Exito, string Mensaje)> AnularPagoAsync(Guid idPago, string motivo, string usuarioAutoriza)
    {
        return Task.FromResult((true, "Anulación registrada exitosamente en Mock."));
    }

    public Task SincronizarPagosPendientesAsync()
    {
        return Task.CompletedTask;
    }

    // ============================================================
    //  REEMPLAZAR POR LLAMADAS REALES AL SISTEMA DE INTEGRACIÓN:
    //
    //  var response = await _httpClient.PostAsJsonAsync(
    //      "api/v1/pagos/registrar", pago);
    //  return await response.Content.ReadFromJsonAsync...();
    // ============================================================
}
