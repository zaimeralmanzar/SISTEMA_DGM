using CajaDGM.Domain.Enums;

namespace CajaDGM.Domain.Models;

public class Comprobante
{
    public Guid IdComprobante { get; set; } = Guid.NewGuid();
    public string NumeroComprobante { get; set; } = string.Empty;
    public Guid IdSesion { get; set; }
    public Guid IdPago { get; set; }
    public string CedulaPagador { get; set; } = string.Empty;
    public string NombresPagador { get; set; } = string.Empty;
    public string ApellidosPagador { get; set; } = string.Empty;
    public TipoServicio TipoServicio { get; set; }
    public string DescripcionServicio { get; set; } = string.Empty;
    public decimal MontoTotal { get; set; }
    public FormaPago FormaPago { get; set; }
    public DateTime FechaEmision { get; set; } = DateTime.Now;
    public string Cajero { get; set; } = string.Empty;
}
