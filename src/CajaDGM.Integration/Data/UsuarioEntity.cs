namespace CajaDGM.Integration.Data;

public class UsuarioEntity
{
    public int Id { get; set; }
    public string NombreUsuario { get; set; } = string.Empty;
    public string ClaveHash { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
}