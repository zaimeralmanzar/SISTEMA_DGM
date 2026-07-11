using CajaDGM.Domain.Enums;

namespace CajaDGM.Domain.Models;

public class Pago
{
    public Guid IdPago { get; set; } = Guid.NewGuid();
    public Guid IdSesion { get; set; }
    public string NumeroSolicitud { get; set; } = string.Empty;
    public string CedulaPagador { get; set; } = string.Empty;
    public string NombresPagador { get; set; } = string.Empty;
    public string ApellidosPagador { get; set; } = string.Empty;
    public TipoServicio TipoServicio { get; set; }
    public decimal MontoTarifa { get; set; }
    public decimal MontoPenalidad { get; set; }
    public decimal MontoTotal { get; set; }
    public FormaPago FormaPago { get; set; }
    public EstadoPago Estado { get; set; } = EstadoPago.Pagado;
    public DateTime FechaPago { get; set; } = DateTime.Now;
    public Guid IdComprobante { get; set; }
    public DateTime? FechaAnulacion { get; set; }
    public string? AnuladoPor { get; set; }
    public string? MotivoAnulacion { get; set; }
}
