using CajaDGM.Application.DTOs;
using CajaDGM.Domain.Enums;
using CajaDGM.Domain.Models;

namespace CajaDGM.Application.Services;

public class SesionService
{
    private SesionCaja? _sesionActual;

    public SesionCaja? SesionActual => _sesionActual;

    public bool HaySesionAbierta =>
        _sesionActual is not null && _sesionActual.Estado == EstadoSesion.Abierta;

    public void AbrirSesion(string usuario, string nombreUsuario, RolUsuario rol,
        string oficina, string terminal, ModoTerminal modo, decimal fondoInicial)
    {
        if (HaySesionAbierta)
            throw new InvalidOperationException("Ya hay una sesión abierta. Ciérrela antes de abrir una nueva.");

        _sesionActual = new SesionCaja
        {
            UsuarioCajero = usuario,
            NombreCajero = nombreUsuario,
            RolCajero = rol,
            Oficina = oficina,
            Terminal = terminal,
            ModoTerminal = modo,
            FondoInicial = fondoInicial,
            FechaApertura = DateTime.Now,
            Estado = EstadoSesion.Abierta,
        };
    }

    public ResumenCierreDto CerrarSesion(decimal montoContado)
    {
        if (_sesionActual is null)
            throw new InvalidOperationException("No hay sesión abierta.");

        var totalCobrado = _sesionActual.Pagos
            .Where(p => p.Estado == EstadoPago.Pagado)
            .Sum(p => p.MontoTotal);

        var totalEfectivo = _sesionActual.Pagos
            .Where(p => p.Estado == EstadoPago.Pagado && p.FormaPago == FormaPago.Efectivo)
            .Sum(p => p.MontoTotal);

        var montoEsperado = _sesionActual.FondoInicial + totalEfectivo;

        var resumen = new ResumenCierreDto
        {
            FondoInicial = _sesionActual.FondoInicial,
            TotalCobrado = totalCobrado,
            TotalEfectivo = totalEfectivo,
            MontoEsperado = montoEsperado,
            MontoContado = montoContado,
            Diferencia = montoContado - montoEsperado,
            Descuadrado = Math.Abs(montoContado - montoEsperado) > 0.01m,
            PorServicio = _sesionActual.Pagos
                .Where(p => p.Estado == EstadoPago.Pagado)
                .GroupBy(p => p.TipoServicio)
                .Select(g => new ResumenPorServicio
                {
                    TipoServicio = g.Key,
                    Descripcion = g.Key.ToString(),
                    Cantidad = g.Count(),
                    Total = g.Sum(p => p.MontoTotal),
                })
                .ToList(),
            PorFormaPago = _sesionActual.Pagos
                .Where(p => p.Estado == EstadoPago.Pagado)
                .GroupBy(p => p.FormaPago)
                .Select(g => new ResumenPorFormaPago
                {
                    FormaPago = g.Key,
                    Descripcion = g.Key.ToString(),
                    Cantidad = g.Count(),
                    Total = g.Sum(p => p.MontoTotal),
                })
                .ToList(),
        };

        _sesionActual.Estado = EstadoSesion.Cerrada;
        _sesionActual.FechaCierre = DateTime.Now;

        return resumen;
    }

    public void AnularPago(Guid idPago, string anuladoPor, string motivo)
    {
        if (_sesionActual is null)
            throw new InvalidOperationException("No hay sesión abierta.");

        var pago = _sesionActual.Pagos.FirstOrDefault(p => p.IdPago == idPago)
            ?? throw new InvalidOperationException("Pago no encontrado en la sesión.");

        if (pago.Estado == EstadoPago.Anulado)
            throw new InvalidOperationException("El pago ya se encuentra anulado.");

        pago.Estado = EstadoPago.Anulado;
        pago.FechaAnulacion = DateTime.Now;
        pago.AnuladoPor = anuladoPor;
        pago.MotivoAnulacion = motivo;
    }

    public void AnularSesion()
    {
        if (_sesionActual is null)
            throw new InvalidOperationException("No hay sesión abierta.");
        _sesionActual.Estado = EstadoSesion.Anulada;
    }
}
