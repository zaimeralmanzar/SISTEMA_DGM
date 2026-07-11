using CajaDGM.Domain.Enums;

namespace CajaDGM.Domain.Models;

public class Solicitud
{
    public string NumeroSolicitud { get; set; } = string.Empty;
    public string CedulaPersona { get; set; } = string.Empty;
    public string PasaportePersona { get; set; } = string.Empty;
    public string NombresPersona { get; set; } = string.Empty;
    public string ApellidosPersona { get; set; } = string.Empty;
    public TipoServicio TipoServicio { get; set; }
    public string DescripcionServicio { get; set; } = string.Empty;
    public DateTime FechaSolicitud { get; set; }
    public bool TieneDocumentosPendientes { get; set; }
}
