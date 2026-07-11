using CajaDGM.Domain.Enums;
using CajaDGM.Domain.Interfaces;
using CajaDGM.Domain.Models;

namespace CajaDGM.Integration.Services;

public class MockMovimientoMigratorioService : IMovimientoMigratorioService
{
    private static readonly List<MovimientoMigratorio> _movimientos = [];

    static MockMovimientoMigratorioService()
    {
        _movimientos.AddRange(SeedData());
    }

    public Task RegistrarMovimientoAsync(MovimientoMigratorio movimiento)
    {
        if (movimiento.TipoMovimiento == TipoMovimiento.Entrada &&
            TieneEntradaActiva(movimiento.PasaportePersona, movimiento.CedulaPersona))
        {
            throw new InvalidOperationException(
                "Esta persona ya tiene un movimiento de entrada activo.");
        }

        _movimientos.Add(movimiento);
        return Task.CompletedTask;
    }

    public Task<ResultadoSobreestadia> ConsultarSobreestadiaAsync(string pasaporte, string cedula)
    {
        var movements = _movimientos
            .Where(m =>
                (!string.IsNullOrWhiteSpace(cedula) && m.CedulaPersona == cedula) ||
                (!string.IsNullOrWhiteSpace(pasaporte) && m.PasaportePersona == pasaporte))
            .OrderBy(m => m.FechaHora)
            .ToList();

        MovimientoMigratorio? ultimaEntrada = null;
        foreach (var mov in movements)
        {
            if (mov.TipoMovimiento == TipoMovimiento.Entrada)
                ultimaEntrada = mov;
            else if (mov.TipoMovimiento == TipoMovimiento.Salida)
                ultimaEntrada = null;
        }

        if (ultimaEntrada is null)
        {
            return Task.FromResult(new ResultadoSobreestadia
            {
                TieneSobreestadia = false,
                DiasExcedidos = 0,
                MontoAPagar = 0m,
                Moneda = "DOP",
                Concepto = string.Empty,
                Exito = true,
            });
        }

        var diff = DateTime.Now - ultimaEntrada.FechaHora;
        var diasExcedidos = Math.Max(0, (int)Math.Floor(diff.TotalDays));

        return Task.FromResult(new ResultadoSobreestadia
        {
            TieneSobreestadia = diasExcedidos > 0,
            DiasExcedidos = diasExcedidos,
            MontoAPagar = diasExcedidos * 500m,
            Moneda = "DOP",
            Concepto = diasExcedidos > 0
                ? $"Multa por sobreestadía - {diasExcedidos} día(s) excedido(s)"
                : string.Empty,
            Exito = true,
        });
    }

    private static bool TieneEntradaActiva(string pasaporte, string cedula)
    {
        var movements = _movimientos
            .Where(m =>
                (!string.IsNullOrWhiteSpace(cedula) && m.CedulaPersona == cedula) ||
                (!string.IsNullOrWhiteSpace(pasaporte) && m.PasaportePersona == pasaporte))
            .OrderBy(m => m.FechaHora)
            .ToList();

        MovimientoMigratorio? ultimaEntrada = null;
        foreach (var mov in movements)
        {
            if (mov.TipoMovimiento == TipoMovimiento.Entrada)
                ultimaEntrada = mov;
            else if (mov.TipoMovimiento == TipoMovimiento.Salida)
                ultimaEntrada = null;
        }

        return ultimaEntrada is not null;
    }

    private static List<MovimientoMigratorio> SeedData()
    {
        return
        [
            new()
            {
                CedulaPersona = "001-0000003-3",
                PasaportePersona = "",
                NombresPersona = "Carlos Manuel",
                ApellidosPersona = "Martínez López",
                Nacionalidad = "Dominicana",
                TipoMovimiento = TipoMovimiento.Entrada,
                FechaHora = DateTime.Now.AddDays(-100),
                Terminal = "MOCK",
                Oficina = "MOCK",
                Vuelo = "AA100",
                PaisOrigenDestino = "Estados Unidos",
            },
            new()
            {
                CedulaPersona = "001-0000005-5",
                PasaportePersona = "",
                NombresPersona = "Pedro Antonio",
                ApellidosPersona = "Santos Jiménez",
                Nacionalidad = "Dominicana",
                TipoMovimiento = TipoMovimiento.Entrada,
                FechaHora = DateTime.Now.AddDays(-10),
                Terminal = "MOCK",
                Oficina = "MOCK",
                Vuelo = "BA200",
                PaisOrigenDestino = "España",
            },
        ];
    }

    // ============================================================
    //  REEMPLAZAR POR LLAMADAS REALES AL SISTEMA DE INTEGRACIÓN:
    //
    //  var response = await _httpClient.PostAsJsonAsync(
    //      "api/v1/movimientos/registrar", movimiento);
    //
    //  var sobreResponse = await _httpClient.GetAsync(
    //      $"api/v1/movimientos/sobreestadia?pasaporte={pasaporte}&cedula={cedula}");
    //  return await sobreResponse.Content
    //      .ReadFromJsonAsync<ResultadoSobreestadia>();
    // ============================================================
}
