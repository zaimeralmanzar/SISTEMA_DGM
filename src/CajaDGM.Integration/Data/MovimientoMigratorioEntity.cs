namespace CajaDGM.Integration.Data;

public class MovimientoMigratorioEntity
{
    public int Id { get; set; }
    public string CedulaPersona { get; set; } = string.Empty;
    public string PasaportePersona { get; set; } = string.Empty;
    public string NombresPersona { get; set; } = string.Empty;
    public string ApellidosPersona { get; set; } = string.Empty;
    public string Nacionalidad { get; set; } = string.Empty;
    public string TipoMovimiento { get; set; } = string.Empty;
    public DateTime FechaHora { get; set; }
    public string Terminal { get; set; } = string.Empty;
    public string Oficina { get; set; } = string.Empty;
    public string Vuelo { get; set; } = string.Empty;
    public string PaisOrigenDestino { get; set; } = string.Empty;
    public decimal MontoCobradoSobreestadia { get; set; }
    public bool RequierePagoSobreestadia { get; set; }
}