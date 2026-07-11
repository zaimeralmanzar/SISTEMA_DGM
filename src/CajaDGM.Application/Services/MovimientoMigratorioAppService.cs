using CajaDGM.Domain.Enums;
using CajaDGM.Domain.Interfaces;
using CajaDGM.Domain.Models;

namespace CajaDGM.Application.Services;

public class MovimientoMigratorioAppService
{
    private readonly IMovimientoMigratorioService _movimientoService;
    private readonly IPersonaService _personaService;
    private readonly SesionService _sesionService;

    public MovimientoMigratorioAppService(
        IMovimientoMigratorioService movimientoService,
        IPersonaService personaService,
        SesionService sesionService)
    {
        _movimientoService = movimientoService;
        _personaService = personaService;
        _sesionService = sesionService;
    }

    public async Task<Persona?> BuscarPersonaAsync(string cedula, string pasaporte)
    {
        if (!string.IsNullOrWhiteSpace(cedula))
            return await _personaService.BuscarPorCedulaAsync(cedula);
        if (!string.IsNullOrWhiteSpace(pasaporte))
            return await _personaService.BuscarPorPasaporteAsync(pasaporte);
        return null;
    }

    public async Task<ResultadoSobreestadia> ConsultarSobreestadiaAsync(string pasaporte, string cedula)
    {
        return await _movimientoService.ConsultarSobreestadiaAsync(pasaporte, cedula);
    }

    public async Task RegistrarEntradaAsync(Persona persona, string vuelo, string paisOrigen)
    {
        var sesion = _sesionService.SesionActual
            ?? throw new InvalidOperationException("No hay sesión de caja abierta.");

        var movimiento = new MovimientoMigratorio
        {
            CedulaPersona = persona.Cedula,
            PasaportePersona = persona.Pasaporte,
            NombresPersona = persona.Nombres,
            ApellidosPersona = persona.Apellidos,
            Nacionalidad = persona.Nacionalidad,
            TipoMovimiento = TipoMovimiento.Entrada,
            Terminal = sesion.Terminal,
            Oficina = sesion.Oficina,
            Vuelo = vuelo,
            PaisOrigenDestino = paisOrigen,
        };

        await _movimientoService.RegistrarMovimientoAsync(movimiento);
        sesion.Movimientos.Add(movimiento);
    }

    public async Task<ResultadoSobreestadia> RegistrarSalidaAsync(
        Persona persona, string vuelo, string paisDestino)
    {
        var sesion = _sesionService.SesionActual
            ?? throw new InvalidOperationException("No hay sesión de caja abierta.");

        var sobreestadia = await _movimientoService.ConsultarSobreestadiaAsync(
            persona.Pasaporte, persona.Cedula);

        var movimiento = new MovimientoMigratorio
        {
            CedulaPersona = persona.Cedula,
            PasaportePersona = persona.Pasaporte,
            NombresPersona = persona.Nombres,
            ApellidosPersona = persona.Apellidos,
            Nacionalidad = persona.Nacionalidad,
            TipoMovimiento = TipoMovimiento.Salida,
            Terminal = sesion.Terminal,
            Oficina = sesion.Oficina,
            Vuelo = vuelo,
            PaisOrigenDestino = paisDestino,
            MontoCobradoSobreestadia = sobreestadia.MontoAPagar,
            RequierePagoSobreestadia = sobreestadia.TieneSobreestadia,
        };

        await _movimientoService.RegistrarMovimientoAsync(movimiento);
        sesion.Movimientos.Add(movimiento);

        return sobreestadia;
    }
}
