using CajaDGM.Domain.Enums;

namespace CajaDGM.Domain.Models;

public class MovimientoMigratorio
{
    public Guid IdMovimiento { get; set; } = Guid.NewGuid();
    public string CedulaPersona { get; set; } = string.Empty;
    public string PasaportePersona { get; set; } = string.Empty;
    public string NombresPersona { get; set; } = string.Empty;
    public string ApellidosPersona { get; set; } = string.Empty;
    public string Nacionalidad { get; set; } = string.Empty;
    public TipoMovimiento TipoMovimiento { get; set; }
    public DateTime FechaHora { get; set; } = DateTime.Now;
    public string Terminal { get; set; } = string.Empty;
    public string Oficina { get; set; } = string.Empty;
    public string Vuelo { get; set; } = string.Empty;
    public string PaisOrigenDestino { get; set; } = string.Empty;
    public decimal MontoCobradoSobreestadia { get; set; }
    public bool RequierePagoSobreestadia { get; set; }
}
