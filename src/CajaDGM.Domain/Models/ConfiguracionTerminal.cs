using CajaDGM.Domain.Enums;

namespace CajaDGM.Domain.Models;

public class ConfiguracionTerminal
{
    public string CodigoTerminal { get; set; } = string.Empty;
    public string Oficina { get; set; } = string.Empty;
    public ModoTerminal Modo { get; set; } = ModoTerminal.Oficina;
}
