using CajaDGM.Domain.Interfaces;
using CajaDGM.Domain.Models;
using CajaDGM.Integration.Data;
using Microsoft.EntityFrameworkCore;

namespace CajaDGM.Integration.Services;

public class DbPersonaService : IPersonaService
{
    private readonly IDbContextFactory<DgmDbContext> _contextFactory;

    public DbPersonaService(IDbContextFactory<DgmDbContext> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    public async Task<Persona?> BuscarPorCedulaAsync(string cedula)
    {
        await using var db = await _contextFactory.CreateDbContextAsync();

        var entity = await db.Personas
            .FirstOrDefaultAsync(p => p.Cedula == cedula);

        if (entity is null)
            return null;

        return MapToPersona(entity);
    }

    public async Task<Persona?> BuscarPorPasaporteAsync(string pasaporte)
    {
        await using var db = await _contextFactory.CreateDbContextAsync();

        var entity = await db.Personas
            .FirstOrDefaultAsync(p => p.Pasaporte == pasaporte);

        if (entity is null)
            return null;

        return MapToPersona(entity);
    }

    private static Persona MapToPersona(PersonaEntity entity)
    {
        return new Persona
        {
            Cedula = entity.Cedula ?? string.Empty,
            Pasaporte = entity.Pasaporte ?? string.Empty,
            Nombres = entity.Nombres,
            Apellidos = entity.Apellidos,
            Nacionalidad = entity.Nacionalidad,
            Email = $"{entity.Nombres.ToLower().Replace(" ", ".")}@example.com",
            Telefono = string.IsNullOrEmpty(entity.Cedula) ? "809-555-0202" : "809-555-0101",
        };
    }
}