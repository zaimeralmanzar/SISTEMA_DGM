using CajaDGM.Domain.Models;

namespace CajaDGM.Domain.Interfaces;

/// <summary>
/// Servicio de integración para emisión y numeración de comprobantes.
/// El número de comprobante es generado/secuenciado por el Sistema de Integración.
/// </summary>
public interface IComprobanteService
{
    Task<Comprobante> EmitirComprobanteAsync(Pago pago, string nombreCajero);
}
