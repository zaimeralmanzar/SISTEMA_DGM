using CajaDGM.Domain.Enums;
using CajaDGM.Domain.Interfaces;
using CajaDGM.Domain.Models;
using CajaDGM.Integration.Data;
using Microsoft.EntityFrameworkCore;

namespace CajaDGM.Integration.Services;

public class ApiTarifaService : ITarifaService
{
    private readonly HttpClient _httpClient;
    private readonly IDbContextFactory<DgmDbContext> _dbContextFactory;

    public ApiTarifaService(HttpClient httpClient, IDbContextFactory<DgmDbContext> dbContextFactory)
    {
        _httpClient = httpClient;
        _dbContextFactory = dbContextFactory;
    }

    public async Task<ResultadoConsultaTarifa> ConsultarMontoServicioAsync(TipoServicio tipoServicio, string cedulaPersona)
    {
        // Al no existir un endpoint en el CORE para consultar montos dinámicos en este prototipo, 
        // utilizamos directamente la base de datos local para la tarifa (offline-first para tarifas).
        
        using var db = await _dbContextFactory.CreateDbContextAsync();
        var tipoStr = tipoServicio.ToString();
        var servicio = await db.Servicios.FirstOrDefaultAsync(s => s.TipoServicio == tipoStr);
        
        var tarifa = servicio?.Tarifa ?? 2500m; // Fallback
        var desc = servicio?.Descripcion ?? tipoStr;

        return new ResultadoConsultaTarifa
        {
            Exito = true,
            MontoTarifa = tarifa,
            MontoPenalidad = 0m,
            MontoTotal = tarifa,
            DescripcionServicio = desc,
            Concepto = "Servicio migratorio"
        };
    }
}
