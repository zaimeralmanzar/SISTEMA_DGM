using System.Text.Json;
using CajaDGM.Domain.Enums;
using CajaDGM.Domain.Models;

namespace CajaDGM.Application.Services;

public class ConfiguracionTerminalService
{
    private static readonly string _filePath = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
        "DGM",
        "configuracion_terminal.json");

    private ConfiguracionTerminal _config;

    public ConfiguracionTerminalService()
    {
        _config = CargarDesdeArchivo();
    }

    public ConfiguracionTerminal ObtenerConfiguracion()
    {
        return new ConfiguracionTerminal
        {
            CodigoTerminal = _config.CodigoTerminal,
            Oficina = _config.Oficina,
            Modo = _config.Modo,
        };
    }

    public void GuardarConfiguracion(ConfiguracionTerminal config)
    {
        _config.CodigoTerminal = config.CodigoTerminal;
        _config.Oficina = config.Oficina;
        _config.Modo = config.Modo;
        GuardarEnArchivo(_config);
    }

    private static ConfiguracionTerminal CargarDesdeArchivo()
    {
        try
        {
            if (File.Exists(_filePath))
            {
                var json = File.ReadAllText(_filePath);
                var config = JsonSerializer.Deserialize<ConfiguracionTerminal>(json);
                if (config is not null)
                    return config;
            }
        }
        catch
        {
            // Si falla la lectura, se usan los valores por defecto
        }

        return new ConfiguracionTerminal
        {
            CodigoTerminal = "TERM-001",
            Oficina = "OFI-PRINCIPAL",
            Modo = ModoTerminal.Oficina,
        };
    }

    private static void GuardarEnArchivo(ConfiguracionTerminal config)
    {
        try
        {
            var dir = Path.GetDirectoryName(_filePath);
            if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
                Directory.CreateDirectory(dir);

            var json = JsonSerializer.Serialize(config, new JsonSerializerOptions
            {
                WriteIndented = true,
            });
            File.WriteAllText(_filePath, json);
        }
        catch
        {
            // Si falla la escritura, se ignora — la config sigue en memoria
        }
    }
}
