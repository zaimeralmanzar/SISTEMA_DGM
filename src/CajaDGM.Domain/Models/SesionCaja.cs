using CajaDGM.Domain.Enums;

namespace CajaDGM.Domain.Models;

public class SesionCaja
{
    public Guid IdSesion { get; set; } = Guid.NewGuid();
    public string UsuarioCajero { get; set; } = string.Empty;
    public string NombreCajero { get; set; } = string.Empty;
    public RolUsuario RolCajero { get; set; }
    public string Oficina { get; set; } = string.Empty;
    public string Terminal { get; set; } = string.Empty;
    public ModoTerminal ModoTerminal { get; set; }
    public decimal FondoInicial { get; set; }
    public DateTime FechaApertura { get; set; } = DateTime.Now;
    public DateTime? FechaCierre { get; set; }
    public EstadoSesion Estado { get; set; } = EstadoSesion.Abierta;
    public List<Pago> Pagos { get; set; } = [];
    public List<Comprobante> Comprobantes { get; set; } = [];
    public List<MovimientoMigratorio> Movimientos { get; set; } = [];
}
