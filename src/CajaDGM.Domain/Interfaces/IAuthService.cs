using CajaDGM.Domain.Enums;

namespace CajaDGM.Domain.Interfaces;

public interface IAuthService
{
    Task<(bool Exito, string? NombreUsuario, RolUsuario? Rol)> LoginAsync(string usuario, string clave);
}