using System.Reflection;
using CajaDGM.Domain.Enums;
using CajaDGM.Domain.Models;
using CajaDGM.Application.Services;
using CajaDGM.Application.DTOs;
using Microsoft.Extensions.DependencyInjection;

namespace CajaDGM.UI.Forms;

public class FrmPrincipal : Form
{
    private readonly SesionService _sesionService;
    private readonly CobroService _cobroService;
    private readonly MovimientoMigratorioAppService _movimientoService;
    private readonly ConfiguracionTerminalService _configTerminalService;

    private readonly Button _btnCobro;
    private readonly Button _btnControlMigratorio;
    private readonly Button _btnCierre;
    private readonly Button _btnConfigurarTerminal;
    private readonly ToolStripMenuItem _btnCerrarSesionApp;
    private readonly ToolStripMenuItem _btnConfigurarTerminalMenu;
    private readonly Label _lblEstado;
    private bool _salirAplicacion;

    public bool SalirAplicacion => _salirAplicacion;

    public FrmPrincipal(
        SesionService sesionService,
        CobroService cobroService,
        MovimientoMigratorioAppService movimientoService,
        ConfiguracionTerminalService configTerminalService)
    {
        _sesionService = sesionService;
        _cobroService = cobroService;
        _movimientoService = movimientoService;
        _configTerminalService = configTerminalService;

        Text = "DGM - Módulo de Caja";
        StartPosition = FormStartPosition.CenterScreen;
        WindowState = FormWindowState.Maximized;
        Size = new Size(1024, 768);
        IsMdiContainer = true;

        var menuStrip = new MenuStrip();
        var archivoMenu = new ToolStripMenuItem("&Archivo");
        _btnConfigurarTerminalMenu = new ToolStripMenuItem("Configurar terminal...") { ShortcutKeys = Keys.Control | Keys.T };
        _btnConfigurarTerminalMenu.Click += (_, _) => AbrirConfigurarTerminal();
        archivoMenu.DropDownItems.Add(_btnConfigurarTerminalMenu);
        archivoMenu.DropDownItems.Add(new ToolStripSeparator());
        _btnCerrarSesionApp = new ToolStripMenuItem("Cerrar sesión") { ShortcutKeys = Keys.Control | Keys.L };
        _btnCerrarSesionApp.Click += (_, _) => CerrarSesionApp();
        archivoMenu.DropDownItems.Add(_btnCerrarSesionApp);
        archivoMenu.DropDownItems.Add(new ToolStripSeparator());
        var salirItem = new ToolStripMenuItem("Salir") { ShortcutKeys = Keys.Alt | Keys.F4 };
        salirItem.Click += (_, _) => { _salirAplicacion = true; Close(); };
        archivoMenu.DropDownItems.Add(salirItem);
        
        menuStrip.Items.Add(archivoMenu);
        Controls.Add(menuStrip);

        var pnlTop = new Panel
        {
            Dock = DockStyle.Top,
            Height = 55,
            BackColor = Color.FromArgb(0, 70, 140),
            Padding = new Padding(8, 4, 8, 4),
        };

        var logoStream = Assembly.GetExecutingAssembly()
            .GetManifestResourceStream("CajaDGM.UI.LogoDGM.png");
        var logoImage = logoStream is not null ? Image.FromStream(logoStream) : null;

        var topLayout = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 5,
            RowCount = 2,
        };
        topLayout.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 43));
        topLayout.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 25));
        topLayout.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 25));
        topLayout.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 25));
        topLayout.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 25));
        pnlTop.Controls.Add(topLayout);

        var topLogo = new PictureBox
        {
            Image = logoImage,
            SizeMode = PictureBoxSizeMode.Zoom,
            Dock = DockStyle.Fill,
            BackColor = Color.Transparent,
        };
        topLayout.Controls.Add(topLogo, 0, 0);
        topLayout.SetRowSpan(topLogo, 2);

        var pnlButtons = new FlowLayoutPanel
        {
            Dock = DockStyle.Left,
            Width = 220,
            Padding = new Padding(10),
            BackColor = Color.FromArgb(240, 240, 240),
        };

        var btnStyle = new Font("Segoe UI", 10, FontStyle.Regular);

        _btnCobro = new Button
        {
            Text = "💰  Cobro de Servicios",
            Font = btnStyle,
            Width = 190,
            Height = 50,
            FlatStyle = FlatStyle.Flat,
            TextAlign = ContentAlignment.MiddleLeft,
            Margin = new Padding(0, 5, 0, 5),
        };
        _btnCobro.Click += (_, _) => AbrirCobroAsync();

        _btnControlMigratorio = new Button
        {
            Text = "✈  Control Migratorio",
            Font = btnStyle,
            Width = 190,
            Height = 50,
            FlatStyle = FlatStyle.Flat,
            TextAlign = ContentAlignment.MiddleLeft,
            Margin = new Padding(0, 5, 0, 5),
        };
        _btnControlMigratorio.Click += (_, _) => AbrirControlMigratorioAsync();

        _btnCierre = new Button
        {
            Text = "📊  Cierre de Sesión",
            Font = btnStyle,
            Width = 190,
            Height = 50,
            FlatStyle = FlatStyle.Flat,
            TextAlign = ContentAlignment.MiddleLeft,
            Margin = new Padding(0, 5, 0, 5),
        };
        _btnCierre.Click += (_, _) => AbrirCierreAsync();

        _btnConfigurarTerminal = new Button
        {
            Text = "⚙  Configurar Terminal",
            Font = btnStyle,
            Width = 190,
            Height = 50,
            FlatStyle = FlatStyle.Flat,
            TextAlign = ContentAlignment.MiddleLeft,
            Margin = new Padding(0, 5, 0, 5),
        };
        _btnConfigurarTerminal.Click += (_, _) => AbrirConfigurarTerminal();

        var btnHistorial = new Button
        {
            Text = "📡  Monitor Sincronización",
            Font = btnStyle,
            Width = 190,
            Height = 50,
            FlatStyle = FlatStyle.Flat,
            TextAlign = ContentAlignment.MiddleLeft,
            Margin = new Padding(0, 5, 0, 5),
        };
        btnHistorial.Click += (_, _) => 
        {
            using var frm = new FrmHistorialSincronizacion(Program.ServiceProvider.GetRequiredService<Microsoft.EntityFrameworkCore.IDbContextFactory<CajaDGM.Integration.Data.DgmDbContext>>());
            frm.ShowDialog(this);
        };

        pnlButtons.Controls.Add(_btnCobro);
        pnlButtons.Controls.Add(_btnControlMigratorio);
        pnlButtons.Controls.Add(_btnCierre);
        pnlButtons.Controls.Add(_btnConfigurarTerminal);
        pnlButtons.Controls.Add(btnHistorial);

        Controls.Add(pnlButtons);

        _lblEstado = new Label
        {
            Dock = DockStyle.Bottom,
            Height = 25,
            BackColor = Color.FromArgb(50, 50, 50),
            ForeColor = Color.White,
            Font = new Font("Segoe UI", 9),
            Padding = new Padding(5, 0, 0, 0),
        };
        Controls.Add(_lblEstado);

        Controls.Add(pnlTop);
        MainMenuStrip = menuStrip;

        FormClosed += (_, _) =>
        {
            if (_sesionService.HaySesionAbierta)
                _sesionService.AnularSesion();
        };
    }

    public void Inicializar(SesionCaja sesion)
    {
        var pnlTop = Controls.OfType<Panel>().First(p => p.BackColor == Color.FromArgb(0, 70, 140));
        var topLayout = (TableLayoutPanel)pnlTop.Controls[^1];

        for (int i = topLayout.Controls.Count - 1; i >= 0; i--)
        {
            var pos = topLayout.GetCellPosition(topLayout.Controls[i]);
            if (pos.Column != 0)
                topLayout.Controls.RemoveAt(i);
        }

        var smallFont = new Font("Segoe UI", 8, FontStyle.Regular);
        var valueFont = new Font("Segoe UI", 9, FontStyle.Bold);

        void AddInfo(int col, int row, string label, string value)
        {
            var pnl = new FlowLayoutPanel
            {
                Dock = DockStyle.Fill,
                FlowDirection = FlowDirection.TopDown,
                Margin = new Padding(4, 0, 4, 0),
            };
            pnl.Controls.Add(new Label
            {
                Text = label,
                ForeColor = Color.FromArgb(180, 210, 255),
                Font = smallFont,
                AutoSize = true,
            });
            pnl.Controls.Add(new Label
            {
                Text = value,
                ForeColor = Color.White,
                Font = valueFont,
                AutoSize = true,
            });
            topLayout.Controls.Add(pnl, col, row);
        }

        AddInfo(1, 0, "USUARIO", $"{sesion.NombreCajero} ({sesion.RolCajero})");
        AddInfo(2, 0, "OFICINA", sesion.Oficina);
        AddInfo(3, 0, "TERMINAL", sesion.Terminal);
        AddInfo(4, 0, "MODO", sesion.ModoTerminal.ToString());

        AddInfo(1, 1, "FONDO INICIAL", $"{sesion.FondoInicial:N2} DOP");
        AddInfo(2, 1, "APERTURA", sesion.FechaApertura.ToString("dd/MM/yyyy HH:mm"));
        AddInfo(3, 1, "PAGOS", "0");
        AddInfo(4, 1, "TOTAL COBRADO", "0.00 DOP");

        ActualizarEstado();

        var esCajeroOSupervisor = sesion.RolCajero is RolUsuario.Cajero or RolUsuario.SupervisorCaja or RolUsuario.AdministradorLocal;
        var esOficialMigratorio = sesion.RolCajero is RolUsuario.OficialControlMigratorio;

        var esAdminLocal = sesion.RolCajero is RolUsuario.AdministradorLocal;

        _btnCobro.Visible = esCajeroOSupervisor && sesion.ModoTerminal == ModoTerminal.Oficina;
        _btnControlMigratorio.Visible =
            (esOficialMigratorio || esCajeroOSupervisor) &&
            (sesion.ModoTerminal == ModoTerminal.Aeropuerto || sesion.ModoTerminal == ModoTerminal.Frontera);
        _btnCierre.Visible = esCajeroOSupervisor;
        _btnConfigurarTerminal.Visible = esAdminLocal;
        _btnConfigurarTerminalMenu.Visible = esAdminLocal;
    }

    private void ActualizarEstado()
    {
        if (_sesionService.SesionActual is { } s)
        {
            var pagosHoy = s.Pagos.Count;
            var totalHoy = s.Pagos.Where(p => p.Estado == EstadoPago.Pagado)
                .Sum(p => p.MontoTotal);
            _lblEstado.Text = $"  Sesión activa | Pagos: {pagosHoy} | Total cobrado: {totalHoy:N2} DOP | Movs.: {s.Movimientos.Count}";

            var pnlTop = Controls.OfType<Panel>().FirstOrDefault(p => p.BackColor == Color.FromArgb(0, 70, 140));
            if (pnlTop?.Controls[^1] is TableLayoutPanel tlp && tlp.Controls.Count >= 9)
            {
                if (tlp.Controls[7] is FlowLayoutPanel fp && fp.Controls.Count >= 2)
                    fp.Controls[1].Text = pagosHoy.ToString();

                if (tlp.Controls[8] is FlowLayoutPanel ft && ft.Controls.Count >= 2)
                    ft.Controls[1].Text = $"{totalHoy:N2} DOP";
            }
        }
    }

    private void AbrirCobroAsync()
    {
        using var frm = new FrmCobro(_cobroService, _sesionService);
        frm.ShowDialog(this);
        ActualizarEstado();
    }

    private void AbrirControlMigratorioAsync()
    {
        using var frm = new FrmControlMigratorio(_movimientoService, _cobroService, _sesionService);
        frm.ShowDialog(this);
        ActualizarEstado();
    }

    private void AbrirCierreAsync()
    {
        using var frm = new FrmCierreSesion(_sesionService);
        var result = frm.ShowDialog(this);
        if (result == DialogResult.OK)
        {
            _ = MessageBox.Show("Sesión cerrada correctamente.", "Cierre",
                MessageBoxButtons.OK, MessageBoxIcon.Information);
            Close();
        }
    }

    private void AbrirConfigurarTerminal()
    {
        using var frm = new FrmConfigurarTerminal(_configTerminalService);
        frm.ShowDialog(this);
    }

    private void CerrarSesionApp()
    {
        if (_sesionService.HaySesionAbierta)
        {
            var rta = MessageBox.Show(
                "Hay una sesión abierta. Si cierra sin hacer cierre, la sesión se anulará.\n¿Desea cerrar la sesión de caja?",
                "Confirmar", MessageBoxButtons.YesNo, MessageBoxIcon.Warning);
            if (rta != DialogResult.Yes) return;
            _sesionService.AnularSesion();
        }
        Close();
    }
    
    private System.Windows.Forms.Timer _syncTimer = null!;
    private Label _lblRedEstado = null!;

    protected override void OnLoad(EventArgs e)
    {
        base.OnLoad(e);

        // Agregar indicador de red al Panel Superior
        var pnlTop = Controls.OfType<Panel>().First(p => p.BackColor == Color.FromArgb(0, 70, 140));
        _lblRedEstado = new Label
        {
            Text = "🟢 ONLINE (Core conectado)",
            ForeColor = Color.LimeGreen,
            Font = new Font("Segoe UI", 12, FontStyle.Bold),
            AutoSize = true,
            Dock = DockStyle.Right,
            TextAlign = ContentAlignment.MiddleRight,
            Padding = new Padding(0, 15, 20, 0)
        };
        pnlTop.Controls.Add(_lblRedEstado);

        _syncTimer = new System.Windows.Forms.Timer { Interval = 5000 }; // 5 segundos para que se vea rápido
        _syncTimer.Tick += async (s, ev) => await SincronizarFondoAsync();
        _syncTimer.Start();
    }

    private async Task SincronizarFondoAsync()
    {
        bool isOnline = false;
        try
        {
            var client = Program.ServiceProvider.GetRequiredService<HttpClient>();
            // Petición ligera para probar conexión
            var ping = await client.GetAsync("https://plum-flamingo-960651.hostingersite.com/core/v1/health");
            isOnline = true;
        }
        catch
        {
            isOnline = false;
        }

        if (isOnline)
        {
            _lblRedEstado.Text = "🟢 ONLINE (Core conectado)";
            _lblRedEstado.ForeColor = Color.LimeGreen;

            try
            {
                await _cobroService.SincronizarPagosPendientesAsync();
            }
            catch { }
        }
        else
        {
            _lblRedEstado.Text = "🔴 OFFLINE (Modo Respaldo Local)";
            _lblRedEstado.ForeColor = Color.Salmon;
        }
    }
}
