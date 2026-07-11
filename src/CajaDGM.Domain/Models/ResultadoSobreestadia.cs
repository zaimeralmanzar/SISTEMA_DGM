namespace CajaDGM.Domain.Models;

public class ResultadoSobreestadia
{
    public bool TieneSobreestadia { get; set; }
    public int DiasExcedidos { get; set; }
    public decimal MontoAPagar { get; set; }
    public string Moneda { get; set; } = "DOP";
    public string Concepto { get; set; } = string.Empty;
    public bool Exito { get; set; }
    public string MensajeError { get; set; } = string.Empty;
}
