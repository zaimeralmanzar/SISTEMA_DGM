using CajaDGM.Domain.Enums;

namespace CajaDGM.Integration.Data;

public static class CatalogoServiciosMock
{
    public static Dictionary<TipoServicio, (string Descripcion, decimal Tarifa)> Servicios =>
        new()
        {
            [TipoServicio.PasaporteOrdinario] = ("Pasaporte Ordinario (6 años)", 2500m),
            [TipoServicio.PasaporteExpress] = ("Pasaporte Express (24h)", 4500m),
            [TipoServicio.PrórrogaEstancia] = ("Prórroga de Estancia (90 días)", 1500m),
            [TipoServicio.ResidenciaTemporal] = ("Solicitud Residencia Temporal", 8000m),
            [TipoServicio.ResidenciaPermanente] = ("Solicitud Residencia Permanente", 15000m),
            [TipoServicio.CertificadoMovMigratorio] = ("Certificado de Movimiento Migratorio", 1200m),
            [TipoServicio.CertificadoResidencia] = ("Certificado de Residencia", 1000m),
            [TipoServicio.ReposiciónCarnet] = ("Reposición de Carnet", 800m),
            [TipoServicio.ExenciónMulta] = ("Exención de Multa por Sobreestadía", 500m),
            [TipoServicio.Otro] = ("Otro servicio", 0m),
        };

    public static Dictionary<string, (string Nombres, string Apellidos, string Nacionalidad)> PersonasMock =>
        new()
        {
            ["001-0000001-1"] = ("Juan Carlos", "Pérez Rodríguez", "Dominicana"),
            ["001-0000002-2"] = ("María Elena", "González Fernández", "Dominicana"),
            ["001-0000003-3"] = ("Carlos Manuel", "Martínez López", "Dominicana"),
            ["002-0000004-4"] = ("Ana Patricia", "Ramírez Castillo", "Dominicana"),
            ["001-0000005-5"] = ("Pedro Antonio", "Santos Jiménez", "Dominicana"),
        };

    public static Dictionary<string, (string Nombres, string Apellidos, string Nacionalidad)> ExtranjerosMock =>
        new()
        {
            ["P1234567"] = ("John", "Smith Doe", "Estadounidense"),
            ["P7654321"] = ("María", "García López", "Española"),
            ["P9876543"] = ("Pierre", "Dupont Lefevre", "Francesa"),
            ["P4567890"] = ("Hans", "Mueller Schmidt", "Alemana"),
            ["P1112223"] = ("Luisa", "Rossi Bianchi", "Italiana"),
        };
}
