using CajaDGM.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CajaDGM.Integration.Data;

public class DgmDbContext : DbContext
{
    public DbSet<UsuarioEntity> Usuarios => Set<UsuarioEntity>();
    public DbSet<PersonaEntity> Personas => Set<PersonaEntity>();
    public DbSet<ServicioEntity> Servicios => Set<ServicioEntity>();
    public DbSet<MovimientoMigratorioEntity> MovimientosMigratorios => Set<MovimientoMigratorioEntity>();
    public DbSet<PagoEntity> Pagos => Set<PagoEntity>();

    public DgmDbContext(DbContextOptions<DgmDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UsuarioEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.NombreUsuario).IsUnique();
            entity.Property(e => e.NombreUsuario).HasMaxLength(50).IsRequired();
            entity.Property(e => e.ClaveHash).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Rol).HasConversion<string>().HasMaxLength(30).IsRequired();
        });

        modelBuilder.Entity<PersonaEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Cedula).HasMaxLength(20);
            entity.Property(e => e.Pasaporte).HasMaxLength(20);
            entity.Property(e => e.Nombres).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Apellidos).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Nacionalidad).HasMaxLength(50).IsRequired();
        });

        modelBuilder.Entity<ServicioEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TipoServicio).HasConversion<string>().HasMaxLength(40).IsRequired();
            entity.Property(e => e.Descripcion).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Tarifa).HasColumnType("decimal(18,2)").IsRequired();
        });

        modelBuilder.Entity<MovimientoMigratorioEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CedulaPersona).HasMaxLength(20);
            entity.Property(e => e.PasaportePersona).HasMaxLength(20);
            entity.Property(e => e.NombresPersona).HasMaxLength(100);
            entity.Property(e => e.ApellidosPersona).HasMaxLength(100);
            entity.Property(e => e.Nacionalidad).HasMaxLength(50);
            entity.Property(e => e.TipoMovimiento).HasConversion<string>().HasMaxLength(20).IsRequired();
            entity.Property(e => e.Terminal).HasMaxLength(50);
            entity.Property(e => e.Oficina).HasMaxLength(50);
            entity.Property(e => e.Vuelo).HasMaxLength(20);
            entity.Property(e => e.PaisOrigenDestino).HasMaxLength(50);
            entity.Property(e => e.MontoCobradoSobreestadia).HasColumnType("decimal(18,2)");
        });

        modelBuilder.Entity<PagoEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.IdPago).IsUnique();
            entity.Property(e => e.MontoTotal).HasColumnType("decimal(18,2)").IsRequired();
            entity.Property(e => e.SincronizadoEnCore).IsRequired();
        });

        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        var hasher = new ClaveHasher();

        modelBuilder.Entity<UsuarioEntity>().HasData(
            new UsuarioEntity { Id = 1, NombreUsuario = "cajero1", ClaveHash = hasher.Hash("cajero1"), Rol = nameof(RolUsuario.Cajero) },
            new UsuarioEntity { Id = 2, NombreUsuario = "cajero2", ClaveHash = hasher.Hash("cajero2"), Rol = nameof(RolUsuario.Cajero) },
            new UsuarioEntity { Id = 3, NombreUsuario = "supervisor1", ClaveHash = hasher.Hash("supervisor1"), Rol = nameof(RolUsuario.SupervisorCaja) },
            new UsuarioEntity { Id = 4, NombreUsuario = "oficial1", ClaveHash = hasher.Hash("oficial1"), Rol = nameof(RolUsuario.OficialControlMigratorio) },
            new UsuarioEntity { Id = 5, NombreUsuario = "admin1", ClaveHash = hasher.Hash("admin1"), Rol = nameof(RolUsuario.AdministradorLocal) }
        );

        modelBuilder.Entity<PersonaEntity>().HasData(
            new PersonaEntity { Id = 1, Cedula = "001-0000001-1", Nombres = "Juan Carlos", Apellidos = "Pérez Rodríguez", Nacionalidad = "Dominicana" },
            new PersonaEntity { Id = 2, Cedula = "001-0000002-2", Nombres = "María Elena", Apellidos = "González Fernández", Nacionalidad = "Dominicana" },
            new PersonaEntity { Id = 3, Cedula = "001-0000003-3", Nombres = "Carlos Manuel", Apellidos = "Martínez López", Nacionalidad = "Dominicana" },
            new PersonaEntity { Id = 4, Cedula = "002-0000004-4", Nombres = "Ana Patricia", Apellidos = "Ramírez Castillo", Nacionalidad = "Dominicana" },
            new PersonaEntity { Id = 5, Cedula = "001-0000005-5", Nombres = "Pedro Antonio", Apellidos = "Santos Jiménez", Nacionalidad = "Dominicana" },
            new PersonaEntity { Id = 6, Pasaporte = "P1234567", Nombres = "John", Apellidos = "Smith Doe", Nacionalidad = "Estadounidense" },
            new PersonaEntity { Id = 7, Pasaporte = "P7654321", Nombres = "María", Apellidos = "García López", Nacionalidad = "Española" },
            new PersonaEntity { Id = 8, Pasaporte = "P9876543", Nombres = "Pierre", Apellidos = "Dupont Lefevre", Nacionalidad = "Francesa" },
            new PersonaEntity { Id = 9, Pasaporte = "P4567890", Nombres = "Hans", Apellidos = "Mueller Schmidt", Nacionalidad = "Alemana" },
            new PersonaEntity { Id = 10, Pasaporte = "P1112223", Nombres = "Luisa", Apellidos = "Rossi Bianchi", Nacionalidad = "Italiana" }
        );

        modelBuilder.Entity<ServicioEntity>().HasData(
            new ServicioEntity { Id = 1, TipoServicio = nameof(TipoServicio.PasaporteOrdinario), Descripcion = "Pasaporte Ordinario (6 años)", Tarifa = 2500m },
            new ServicioEntity { Id = 2, TipoServicio = nameof(TipoServicio.PasaporteExpress), Descripcion = "Pasaporte Express (24h)", Tarifa = 4500m },
            new ServicioEntity { Id = 3, TipoServicio = nameof(TipoServicio.PrórrogaEstancia), Descripcion = "Prórroga de Estancia (90 días)", Tarifa = 1500m },
            new ServicioEntity { Id = 4, TipoServicio = nameof(TipoServicio.ResidenciaTemporal), Descripcion = "Solicitud Residencia Temporal", Tarifa = 8000m },
            new ServicioEntity { Id = 5, TipoServicio = nameof(TipoServicio.ResidenciaPermanente), Descripcion = "Solicitud Residencia Permanente", Tarifa = 15000m },
            new ServicioEntity { Id = 6, TipoServicio = nameof(TipoServicio.CertificadoMovMigratorio), Descripcion = "Certificado de Movimiento Migratorio", Tarifa = 1200m },
            new ServicioEntity { Id = 7, TipoServicio = nameof(TipoServicio.CertificadoResidencia), Descripcion = "Certificado de Residencia", Tarifa = 1000m },
            new ServicioEntity { Id = 8, TipoServicio = nameof(TipoServicio.ReposiciónCarnet), Descripcion = "Reposición de Carnet", Tarifa = 800m },
            new ServicioEntity { Id = 9, TipoServicio = nameof(TipoServicio.ExenciónMulta), Descripcion = "Exención de Multa por Sobreestadía", Tarifa = 500m },
            new ServicioEntity { Id = 10, TipoServicio = nameof(TipoServicio.Otro), Descripcion = "Otro servicio", Tarifa = 0m }
        );

        var now = DateTime.Now;
        modelBuilder.Entity<MovimientoMigratorioEntity>().HasData(
            new MovimientoMigratorioEntity
            {
                Id = 1,
                CedulaPersona = "001-0000003-3",
                PasaportePersona = "",
                NombresPersona = "Carlos Manuel",
                ApellidosPersona = "Martínez López",
                Nacionalidad = "Dominicana",
                TipoMovimiento = nameof(TipoMovimiento.Entrada),
                FechaHora = now.AddDays(-100),
                Terminal = "MOCK",
                Oficina = "MOCK",
                Vuelo = "AA100",
                PaisOrigenDestino = "Estados Unidos",
            },
            new MovimientoMigratorioEntity
            {
                Id = 2,
                CedulaPersona = "001-0000005-5",
                PasaportePersona = "",
                NombresPersona = "Pedro Antonio",
                ApellidosPersona = "Santos Jiménez",
                Nacionalidad = "Dominicana",
                TipoMovimiento = nameof(TipoMovimiento.Entrada),
                FechaHora = now.AddDays(-10),
                Terminal = "MOCK",
                Oficina = "MOCK",
                Vuelo = "BA200",
                PaisOrigenDestino = "España",
            }
        );
    }
}