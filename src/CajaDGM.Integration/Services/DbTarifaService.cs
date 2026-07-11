using CajaDGM.Domain.Enums;
using CajaDGM.Domain.Interfaces;
using CajaDGM.Domain.Models;
using CajaDGM.Integration.Data;
using Microsoft.EntityFrameworkCore;

namespace CajaDGM.Integration.Services;

public class DbTarifaService : ITarifaService
{
    private readonly IDbContextFactory<DgmDbContext> _contextFactory;
    private static readonly Random _rng = new();

    public DbTarifaService(IDbContextFactory<DgmDbContext> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    public async Task<ResultadoConsultaTarifa> ConsultarMontoServicioAsync(TipoServicio tipoServicio, string cedulaPersona)
    {
        await using var db = await _contextFactory.CreateDbContextAsync();

        var tipoStr = tipoServicio.ToString();
        var svc = await db.Servicios
            .FirstOrDefaultAsync(s => s.TipoServicio == tipoStr);

        if (svc is null)
        {
            return new ResultadoConsultaTarifa
            {
                Exito = false,
                MensajeError = $"Servicio {tipoServicio} no encontrado en el catálogo.",
            };
        }

        var penalidad = tipoServicio == TipoServicio.PrórrogaEstancia
            ? Math.Round((decimal)_rng.NextDouble() * 2000, 2)
            : 0m;

        return new ResultadoConsultaTarifa
        {
            MontoTarifa = svc.Tarifa,
            MontoPenalidad = penalidad,
            MontoTotal = svc.Tarifa + penalidad,
            Moneda = "DOP",
            DescripcionServicio = svc.Descripcion,
            Concepto = svc.Descripcion,
            Exito = true,
        };
    }
}