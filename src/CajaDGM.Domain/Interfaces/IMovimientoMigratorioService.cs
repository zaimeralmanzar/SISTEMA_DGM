using CajaDGM.Domain.Models;

namespace CajaDGM.Domain.Interfaces;

/// <summary>
/// Servicio de integración para registro de movimientos migratorios (entrada/salida).
/// </summary>
public interface IMovimientoMigratorioService
{
    Task RegistrarMovimientoAsync(MovimientoMigratorio movimiento);
    Task<ResultadoSobreestadia> ConsultarSobreestadiaAsync(string pasaporte, string cedula);
}
