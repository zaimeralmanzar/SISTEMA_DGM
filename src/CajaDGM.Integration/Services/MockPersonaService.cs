using CajaDGM.Domain.Interfaces;
using CajaDGM.Domain.Models;
using CajaDGM.Integration.Data;

namespace CajaDGM.Integration.Services;

public class MockPersonaService : IPersonaService
{
    public Task<Persona?> BuscarPorCedulaAsync(string cedula)
    {
        if (CatalogoServiciosMock.PersonasMock.TryGetValue(cedula, out var data))
        {
            return Task.FromResult<Persona?>(new Persona
            {
                Cedula = cedula,
                Nombres = data.Nombres,
                Apellidos = data.Apellidos,
                Nacionalidad = data.Nacionalidad,
                Email = $"{data.Nombres.ToLower().Replace(" ", ".")}@example.com",
                Telefono = "809-555-0101",
            });
        }

        return Task.FromResult<Persona?>(null);
    }

    public Task<Persona?> BuscarPorPasaporteAsync(string pasaporte)
    {
        if (CatalogoServiciosMock.ExtranjerosMock.TryGetValue(pasaporte, out var data))
        {
            return Task.FromResult<Persona?>(new Persona
            {
                Pasaporte = pasaporte,
                Nombres = data.Nombres,
                Apellidos = data.Apellidos,
                Nacionalidad = data.Nacionalidad,
                Email = $"{data.Nombres.ToLower().Replace(" ", ".")}@example.com",
                Telefono = "809-555-0202",
            });
        }

        return Task.FromResult<Persona?>(null);
    }

    // ============================================================
    //  REEMPLAZAR ESTAS IMPLEMENTACIONES MOCK POR LLAMADAS REALES
    //  AL SISTEMA DE INTEGRACIÓN VÍA HTTP:
    //
    //  var response = await _httpClient.GetAsync(
    //      $"api/v1/personas/cedula/{cedula}");
    //  return await response.Content.ReadFromJsonAsync<Persona>();
    // ============================================================
}
