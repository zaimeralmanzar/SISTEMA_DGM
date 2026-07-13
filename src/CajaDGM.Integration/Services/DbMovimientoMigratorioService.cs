using CajaDGM.Domain.Enums;
using CajaDGM.Domain.Interfaces;
using CajaDGM.Domain.Models;
using CajaDGM.Integration.Data;
using Microsoft.EntityFrameworkCore;

namespace CajaDGM.Integration.Services;

public class DbMovimientoMigratorioService : IMovimientoMigratorioService
{
    private readonly IDbContextFactory<DgmDbContext> _contextFactory;

    public DbMovimientoMigratorioService(IDbContextFactory<DgmDbContext> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    public async Task RegistrarMovimientoAsync(MovimientoMigratorio movimiento)
    {
        await using var db = await _contextFactory.CreateDbContextAsync();

        if (movimiento.TipoMovimiento == TipoMovimiento.Entrada &&
            await TieneEntradaActiva(db, movimiento.PasaportePersona, movimiento.CedulaPersona))
        {
            throw new InvalidOperationException(
                "Esta persona ya tiene un movimiento de entrada activo.");
        }

        var yaExiste = await db.Personas.AnyAsync(p =>
            (!string.IsNullOrWhiteSpace(movimiento.CedulaPersona) && p.Cedula == movimiento.CedulaPersona) ||
            (!string.IsNullOrWhiteSpace(movimiento.PasaportePersona) && p.Pasaporte == movimiento.PasaportePersona));

        if (!yaExiste)
        {
            db.Personas.Add(new PersonaEntity
            {
                Cedula = movimiento.CedulaPersona,
                Pasaporte = movimiento.PasaportePersona,
                Nombres = movimiento.NombresPersona,
                Apellidos = movimiento.ApellidosPersona,
                Nacionalidad = movimiento.Nacionalidad,
            });
        }

        db.MovimientosMigratorios.Add(new MovimientoMigratorioEntity
        {
            CedulaPersona = movimiento.CedulaPersona,
            PasaportePersona = movimiento.PasaportePersona,
            NombresPersona = movimiento.NombresPersona,
            ApellidosPersona = movimiento.ApellidosPersona,
            Nacionalidad = movimiento.Nacionalidad,
            TipoMovimiento = movimiento.TipoMovimiento.ToString(),
            FechaHora = movimiento.FechaHora,
            Terminal = movimiento.Terminal,
            Oficina = movimiento.Oficina,
            Vuelo = movimiento.Vuelo,
            PaisOrigenDestino = movimiento.PaisOrigenDestino,
            MontoCobradoSobreestadia = movimiento.MontoCobradoSobreestadia,
            RequierePagoSobreestadia = movimiento.RequierePagoSobreestadia,
        });

        await db.SaveChangesAsync();
    }

    public async Task<ResultadoSobreestadia> ConsultarSobreestadiaAsync(string pasaporte, string cedula)
    {
        await using var db = await _contextFactory.CreateDbContextAsync();

        var movements = await db.MovimientosMigratorios
            .Where(m =>
                (!string.IsNullOrWhiteSpace(cedula) && m.CedulaPersona == cedula) ||
                (!string.IsNullOrWhiteSpace(pasaporte) && m.PasaportePersona == pasaporte))
            .OrderBy(m => m.FechaHora)
            .ToListAsync();

        MovimientoMigratorioEntity? ultimaEntrada = null;
        foreach (var mov in movements)
        {
            if (mov.TipoMovimiento == nameof(TipoMovimiento.Entrada))
                ultimaEntrada = mov;
            else if (mov.TipoMovimiento == nameof(TipoMovimiento.Salida))
                ultimaEntrada = null;
        }

        if (ultimaEntrada is null)
        {
            return new ResultadoSobreestadia
            {
                TieneSobreestadia = false,
                DiasExcedidos = 0,
                MontoAPagar = 0m,
                Moneda = "DOP",
                Concepto = string.Empty,
                Exito = true,
            };
        }

        var diff = DateTime.Now - ultimaEntrada.FechaHora;
        var diasExcedidos = Math.Max(0, (int)Math.Floor(diff.TotalDays));

        return new ResultadoSobreestadia
        {
            TieneSobreestadia = diasExcedidos > 0,
            DiasExcedidos = diasExcedidos,
            MontoAPagar = diasExcedidos * 500m,
            Moneda = "DOP",
            Concepto = diasExcedidos > 0
                ? $"Multa por sobreestadía - {diasExcedidos} día(s) excedido(s)"
                : string.Empty,
            Exito = true,
        };
    }

    private static async Task<bool> TieneEntradaActiva(DgmDbContext db, string pasaporte, string cedula)
    {
        var movements = await db.MovimientosMigratorios
            .Where(m =>
                (!string.IsNullOrWhiteSpace(cedula) && m.CedulaPersona == cedula) ||
                (!string.IsNullOrWhiteSpace(pasaporte) && m.PasaportePersona == pasaporte))
            .OrderBy(m => m.FechaHora)
            .ToListAsync();

        MovimientoMigratorioEntity? ultimaEntrada = null;
        foreach (var mov in movements)
        {
            if (mov.TipoMovimiento == nameof(TipoMovimiento.Entrada))
                ultimaEntrada = mov;
            else if (mov.TipoMovimiento == nameof(TipoMovimiento.Salida))
                ultimaEntrada = null;
        }

        return ultimaEntrada is not null;
    }
}