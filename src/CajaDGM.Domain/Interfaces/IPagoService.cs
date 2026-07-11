using CajaDGM.Domain.Enums;
using CajaDGM.Domain.Models;

namespace CajaDGM.Domain.Interfaces;

/// <summary>
/// Servicio de integración para registro de pagos en el CORE.
/// </summary>
public interface IPagoService
{
    Task<(bool Exito, Guid IdPago, string Mensaje)> RegistrarPagoAsync(Pago pago);
    Task<(bool Exito, string Mensaje)> AnularPagoAsync(Guid idPago, string motivo, string usuarioAutoriza);
    Task SincronizarPagosPendientesAsync();
}
