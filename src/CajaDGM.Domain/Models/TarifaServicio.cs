using CajaDGM.Domain.Enums;

namespace CajaDGM.Domain.Models;

public class TarifaServicio
{
    public TipoServicio TipoServicio { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public decimal MontoTarifa { get; set; }
    public string Moneda { get; set; } = "DOP";
}
