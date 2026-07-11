using System.Security.Cryptography;

namespace CajaDGM.Integration.Data;

public class ClaveHasher
{
    private const int SaltSize = 16;
    private const int HashSize = 32;
    private const int Iterations = 100_000;

    public string Hash(string clave)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            clave,
            salt,
            Iterations,
            HashAlgorithmName.SHA256,
            HashSize);

        return $"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    public bool Verificar(string clave, string hashAlmacenado)
    {
        var parts = hashAlmacenado.Split('.');
        if (parts.Length != 2)
            return false;

        var salt = Convert.FromBase64String(parts[0]);
        var hashAlmacenadoBytes = Convert.FromBase64String(parts[1]);

        var hashCalculado = Rfc2898DeriveBytes.Pbkdf2(
            clave,
            salt,
            Iterations,
            HashAlgorithmName.SHA256,
            HashSize);

        return CryptographicOperations.FixedTimeEquals(hashAlmacenadoBytes, hashCalculado);
    }
}