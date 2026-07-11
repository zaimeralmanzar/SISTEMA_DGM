using CajaDGM.Domain.Models;

namespace CajaDGM.Domain.Interfaces;

/// <summary>
/// Servicio de integración para consulta de personas.
/// </summary>
public interface IPersonaService
{
    Task<Persona?> BuscarPorCedulaAsync(string cedula);
    Task<Persona?> BuscarPorPasaporteAsync(string pasaporte);
}
