namespace CajaDGM.Integration.Data;

public class PersonaEntity
{
    public int Id { get; set; }
    public string? Cedula { get; set; }
    public string? Pasaporte { get; set; }
    public string Nombres { get; set; } = string.Empty;
    public string Apellidos { get; set; } = string.Empty;
    public string Nacionalidad { get; set; } = string.Empty;
}