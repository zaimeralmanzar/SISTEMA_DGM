namespace CajaDGM.Domain.Models;

public class ResultadoConsultaTarifa
{
    public decimal MontoTarifa { get; set; }
    public decimal MontoPenalidad { get; set; }
    public decimal MontoTotal { get; set; }
    public string Moneda { get; set; } = "DOP";
    public string DescripcionServicio { get; set; } = string.Empty;
    public string Concepto { get; set; } = string.Empty;
    public bool Exito { get; set; }
    public string MensajeError { get; set; } = string.Empty;
}
