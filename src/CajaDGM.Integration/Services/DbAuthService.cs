using CajaDGM.Domain.Enums;
using CajaDGM.Domain.Interfaces;
using CajaDGM.Domain.Models;
using CajaDGM.Integration.Data;
using Microsoft.EntityFrameworkCore;

namespace CajaDGM.Integration.Services;

public class DbAuthService : IAuthService
{
    private readonly IDbContextFactory<DgmDbContext> _contextFactory;
    private readonly ClaveHasher _hasher;

    public DbAuthService(IDbContextFactory<DgmDbContext> contextFactory)
    {
        _contextFactory = contextFactory;
        _hasher = new ClaveHasher();
    }

    public async Task<(bool Exito, string? NombreUsuario, RolUsuario? Rol)> LoginAsync(string usuario, string clave)
    {
        await using var db = await _contextFactory.CreateDbContextAsync();

        var user = await db.Usuarios
            .FirstOrDefaultAsync(u => u.NombreUsuario == usuario);

        if (user is null)
            return (false, null, null);

        if (!_hasher.Verificar(clave, user.ClaveHash))
            return (false, null, null);

        if (!Enum.TryParse<RolUsuario>(user.Rol, out var rol))
            return (false, null, null);

        return (true, user.NombreUsuario, rol);
    }
}