using System.Net.Http.Json;
using System.Text.Json.Serialization;
using CajaDGM.Domain.Interfaces;
using CajaDGM.Domain.Models;
using CajaDGM.Integration.Data;
using Microsoft.EntityFrameworkCore;

namespace CajaDGM.Integration.Services;

public class ApiPersonaService : IPersonaService
{
    private readonly HttpClient _httpClient;
    private readonly IDbContextFactory<DgmDbContext> _dbContextFactory;

    public ApiPersonaService(HttpClient httpClient, IDbContextFactory<DgmDbContext> dbContextFactory)
    {
        _httpClient = httpClient;
        _dbContextFactory = dbContextFactory;
    }

    public async Task<Persona?> BuscarPorCedulaAsync(string cedula)
    {
        return await BuscarPersonaAsync(cedula, "CEDULA"); 
    }

    public async Task<Persona?> BuscarPorPasaporteAsync(string pasaporte)
    {
        return await BuscarPersonaAsync(pasaporte, "PASAPORTE"); 
    }

    private async Task<Persona?> BuscarPersonaAsync(string documento, string tipo)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/core/v1/personas?documento={documento}&tipo={tipo}");
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<PersonaApiResponse>();
                var personaDto = result?.Data?.FirstOrDefault();
                if (personaDto != null)
                {
                    // Guardar/Actualizar en caché local
                    using var cacheDb = await _dbContextFactory.CreateDbContextAsync();
                    var existing = await cacheDb.Personas.FirstOrDefaultAsync(x => 
                        (tipo == "CEDULA" && x.Cedula == documento) || 
                        (tipo == "PASAPORTE" && x.Pasaporte == documento));
                        
                    if (existing == null)
                    {
                        cacheDb.Personas.Add(new PersonaEntity
                        {
                            Nombres = personaDto.Nombres ?? "",
                            Apellidos = personaDto.Apellidos ?? "",
                            Cedula = tipo == "CEDULA" ? documento : "",
                            Pasaporte = tipo == "PASAPORTE" ? documento : "",
                            Nacionalidad = personaDto.Nacionalidad ?? "Dominicana"
                        });
                    }
                    else
                    {
                        existing.Nombres = personaDto.Nombres ?? existing.Nombres;
                        existing.Apellidos = personaDto.Apellidos ?? existing.Apellidos;
                        if (!string.IsNullOrEmpty(personaDto.Nacionalidad))
                            existing.Nacionalidad = personaDto.Nacionalidad;
                    }
                    await cacheDb.SaveChangesAsync();

                    return new Persona
                    {
                        Nombres = personaDto.Nombres ?? "",
                        Apellidos = personaDto.Apellidos ?? "",
                        Cedula = tipo == "CEDULA" ? documento : "",
                        Pasaporte = tipo == "PASAPORTE" ? documento : "",
                        Nacionalidad = personaDto.Nacionalidad ?? "",
                        Email = "",
                        Telefono = ""
                    };
                }
            }
        }
        catch
        {
            // Fallback offline
        }

        // Búsqueda en base de datos local (Fallback)
        using var db = await _dbContextFactory.CreateDbContextAsync();
        var p = await db.Personas.FirstOrDefaultAsync(x => 
            (tipo == "CEDULA" && x.Cedula == documento) || 
            (tipo == "PASAPORTE" && x.Pasaporte == documento));
            
        if (p != null)
        {
            return new Persona
            {
                Nombres = p.Nombres,
                Apellidos = p.Apellidos,
                Cedula = p.Cedula ?? "",
                Pasaporte = p.Pasaporte ?? "",
                Nacionalidad = p.Nacionalidad,
                Email = "",
                Telefono = ""
            };
        }

        return null;
    }
    
    private class PersonaApiResponse
    {
        [JsonPropertyName("data")]
        public List<PersonaDto>? Data { get; set; }
    }
    
    private class PersonaDto
    {
        [JsonPropertyName("id")]
        public Guid Id { get; set; }
        [JsonPropertyName("nombres")]
        public string? Nombres { get; set; }
        [JsonPropertyName("apellidos")]
        public string? Apellidos { get; set; }
        [JsonPropertyName("numero_documento")]
        public string? NumeroDocumento { get; set; }
        [JsonPropertyName("nacionalidad")]
        public string? Nacionalidad { get; set; }
    }
}
