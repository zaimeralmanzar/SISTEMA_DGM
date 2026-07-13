using System.Data;
using CajaDGM.Application.Services;
using CajaDGM.Domain.Interfaces;
using CajaDGM.Integration.Data;
using CajaDGM.Integration.Services;
using CajaDGM.UI.Forms;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CajaDGM.UI;

internal static class Program
{
    public static IServiceProvider ServiceProvider { get; private set; } = null!;

    [STAThread]
    private static void Main()
    {
        System.Windows.Forms.Application.EnableVisualStyles();
        System.Windows.Forms.Application.SetCompatibleTextRenderingDefault(false);
        System.Windows.Forms.Application.SetHighDpiMode(HighDpiMode.SystemAware);

        var services = new ServiceCollection();
        ConfigurarServicios(services);
        ServiceProvider = services.BuildServiceProvider();

        if (!InicializarBaseDatos())
            return;

        var sesionService = ServiceProvider.GetRequiredService<SesionService>();

        while (true)
        {
            using var frmLogin = new FrmLogin();
            if (frmLogin.ShowDialog() != DialogResult.OK)
                return;

            var configTerminalService = ServiceProvider.GetRequiredService<ConfiguracionTerminalService>();

            using var frmApertura = new FrmAperturaSesion(
                frmLogin.Usuario, frmLogin.RolSeleccionado, configTerminalService);

            if (frmApertura.ShowDialog() != DialogResult.OK)
                continue;

            sesionService.AbrirSesion(
                frmLogin.Usuario,
                frmLogin.Usuario,
                frmLogin.RolSeleccionado,
                frmApertura.Oficina,
                frmApertura.Terminal,
                frmApertura.Modo,
                frmApertura.FondoInicial);

            using var frmPrincipal = new FrmPrincipal(
                sesionService,
                ServiceProvider.GetRequiredService<CobroService>(),
                ServiceProvider.GetRequiredService<MovimientoMigratorioAppService>(),
                configTerminalService);

            frmPrincipal.Inicializar(sesionService.SesionActual!);
            System.Windows.Forms.Application.Run(frmPrincipal);
            if (frmPrincipal.SalirAplicacion) break;
        }
    }

    private static bool InicializarBaseDatos()
    {
        using var scope = ServiceProvider.CreateScope();
        var factory = scope.ServiceProvider.GetRequiredService<IDbContextFactory<DgmDbContext>>();

        try
        {
            using var db = factory.CreateDbContext();
            db.Database.EnsureDeleted(); // Agregar para recrear esquema
            db.Database.EnsureCreated();
            return true;
        }
        catch (Microsoft.Data.SqlClient.SqlException ex) when (ex.Number == 1801)
        {
            var msg = $"Se detectó una base de datos 'CajaDGM' huérfana en LocalDB.\n\n" +
                      $"Detalle: {ex.Message}\n\n" +
                      "Se cerrará esta instancia huérfana para poder crear la base de datos correcta en la carpeta del proyecto.\n" +
                      "La aplicación se reiniciará automáticamente.";

            _ = MessageBox.Show(msg, "Conflicto de base de datos",
                MessageBoxButtons.OK, MessageBoxIcon.Warning);

            try
            {
                using var cleanConn = new Microsoft.Data.SqlClient.SqlConnection(
                    @"Server=(localdb)\MSSQLLocalDB;Trusted_Connection=True;");
                cleanConn.Open();
                using var cmd = cleanConn.CreateCommand();
                cmd.CommandText = @"
                    IF EXISTS (SELECT name FROM sys.databases WHERE name = 'CajaDGM')
                    BEGIN
                        ALTER DATABASE [CajaDGM] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
                        DROP DATABASE [CajaDGM];
                    END";
                cmd.ExecuteNonQuery();
                cleanConn.Close();
            }
            catch (Exception cleanEx)
            {
                _ = MessageBox.Show(
                    $"No se pudo limpiar automáticamente la base de datos huérfana.\n\n{cleanEx.Message}\n\n" +
                    "Por favor, abre una terminal como administrador y ejecuta:\n\n" +
                    "    sqlcmd -S \"(localdb)\\MSSQLLocalDB\" -Q \"ALTER DATABASE CajaDGM SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE CajaDGM;\"\n\n" +
                    "Luego vuelve a abrir la aplicación.",
                    "Error de base de datos",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
                return false;
            }

            try
            {
                using var db2 = factory.CreateDbContext();
                db2.Database.EnsureCreated();
                return true;
            }
            catch (Exception ex2)
            {
                _ = MessageBox.Show(
                    $"Error al crear la base de datos después de limpiar la instancia huérfana:\n\n{ex2.Message}",
                    "Error de base de datos",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
                return false;
            }
        }
        catch (Exception ex)
        {
            _ = MessageBox.Show(
                $"Error al inicializar la base de datos:\n\n{ex.Message}",
                "Error de base de datos",
                MessageBoxButtons.OK, MessageBoxIcon.Error);
            return false;
        }
    }

    private static void ConfigurarServicios(IServiceCollection services)
    {
        var solutionDir = Path.GetFullPath(
            Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", ".."));

        var dataDir = Path.Combine(solutionDir, "Data");
        if (!Directory.Exists(dataDir))
            Directory.CreateDirectory(dataDir);

        var mdfPath = Path.Combine(dataDir, "CajaDGM.mdf");

        var connectionString = $@"
            Server=(localdb)\MSSQLLocalDB;
            AttachDbFilename={mdfPath};
            Database=CajaDGM;
            Trusted_Connection=True;
            MultipleActiveResultSets=True;";

        services.AddDbContextFactory<DgmDbContext>(options =>
            options.UseSqlServer(connectionString));

        // Configurar HttpClient para el CORE API
        services.AddTransient<HttpClient>(sp => {
            var client = new HttpClient();
            client.BaseAddress = new Uri("https://plum-flamingo-960651.hostingersite.com");
            client.DefaultRequestHeaders.Add("Authorization", "Bearer 3neQlzKj9czTMNPkAToJ1yUbGN38yeDtIKCqUTTfac3ee613");
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            return client;
        });

        services.AddSingleton<IAuthService, DbAuthService>();
        
        // --- SERVICIOS DE INTEGRACIÓN CON DGM CORE ---
        services.AddTransient<IPersonaService, ApiPersonaService>();
        services.AddTransient<ITarifaService, ApiTarifaService>();
        services.AddTransient<IPagoService, ApiPagoService>();
        services.AddTransient<IMovimientoMigratorioService, ApiMovimientoMigratorioService>();
        
        services.AddSingleton<IComprobanteService, MockComprobanteService>();

        services.AddSingleton<SesionService>();
        services.AddSingleton<ConfiguracionTerminalService>();
        services.AddTransient<CobroService>();
        services.AddTransient<MovimientoMigratorioAppService>();
    }
}