using CajaDGM.Domain.Enums;
using CajaDGM.Domain.Models;

namespace CajaDGM.Domain.Interfaces;

/// <summary>
/// Servicio de integración para consulta de tarifas y montos.
/// La Caja NUNCA calcula tarifas; solo consulta al Sistema de Integración.
/// </summary>
public interface ITarifaService
{
    Task<ResultadoConsultaTarifa> ConsultarMontoServicioAsync(TipoServicio tipoServicio, string cedulaPersona);
}
