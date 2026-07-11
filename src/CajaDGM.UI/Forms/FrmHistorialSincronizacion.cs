using CajaDGM.Integration.Data;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.Data;
using System.Drawing;

namespace CajaDGM.UI.Forms;

public class FrmHistorialSincronizacion : Form
{
    private readonly IDbContextFactory<DgmDbContext> _dbContextFactory;
    private readonly DataGridView _dgvHistorial;
    private readonly System.Windows.Forms.Timer _refreshTimer;

    public FrmHistorialSincronizacion(IDbContextFactory<DgmDbContext> dbContextFactory)
    {
        _dbContextFactory = dbContextFactory;

        Text = "Historial de Sincronización Local";
        Size = new Size(900, 500);
        StartPosition = FormStartPosition.CenterParent;
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;

        var lblTitulo = new Label
        {
            Text = "Monitor de Pagos Locales (Offline-First)",
            Font = new Font("Segoe UI", 14, FontStyle.Bold),
            Dock = DockStyle.Top,
            Height = 40,
            TextAlign = ContentAlignment.MiddleCenter,
            BackColor = Color.FromArgb(0, 70, 140),
            ForeColor = Color.White
        };
        Controls.Add(lblTitulo);

        _dgvHistorial = new DataGridView
        {
            Dock = DockStyle.Fill,
            AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill,
            AllowUserToAddRows = false,
            AllowUserToDeleteRows = false,
            ReadOnly = true,
            SelectionMode = DataGridViewSelectionMode.FullRowSelect,
            RowHeadersVisible = false,
            BackgroundColor = Color.White,
            AlternatingRowsDefaultCellStyle = new DataGridViewCellStyle { BackColor = Color.WhiteSmoke }
        };

        // Formato para que los colores se apliquen según el contenido
        _dgvHistorial.CellFormatting += DgvHistorial_CellFormatting;

        Controls.Add(_dgvHistorial);
        _dgvHistorial.BringToFront();

        // Configurar temporizador para recarga automática cada 2 segundos
        _refreshTimer = new System.Windows.Forms.Timer { Interval = 2000 };
        _refreshTimer.Tick += async (s, e) => await CargarDatosAsync();
    }

    protected override async void OnLoad(EventArgs e)
    {
        base.OnLoad(e);
        await CargarDatosAsync();
        _refreshTimer.Start();
    }

    protected override void OnFormClosing(FormClosingEventArgs e)
    {
        _refreshTimer.Stop();
        base.OnFormClosing(e);
    }

    private async Task CargarDatosAsync()
    {
        try
        {
            using var db = await _dbContextFactory.CreateDbContextAsync();
            var pagos = await db.Pagos
                .OrderByDescending(p => p.FechaPago)
                .ToListAsync();

            var list = pagos.Select(p => new
            {
                p.IdPago,
                Cliente = $"{p.NombresPagador} {p.ApellidosPagador}",
                Cédula = p.CedulaPagador,
                Fecha = p.FechaPago.ToString("HH:mm:ss"),
                Servicio = p.TipoServicio,
                Total = p.MontoTotal,
                EstadoCore = p.SincronizadoEnCore ? "✅ Sincronizado" : 
                            (string.IsNullOrEmpty(p.ErrorSincronizacion) ? "⏳ Pendiente" : "❌ Error"),
                DetalleError = p.ErrorSincronizacion
            }).ToList();

            // Evitar parpadeos al refrescar
            var firstRowIndex = _dgvHistorial.FirstDisplayedScrollingRowIndex;
            var selectedRows = _dgvHistorial.SelectedRows.Count > 0 ? _dgvHistorial.SelectedRows[0].Index : -1;

            _dgvHistorial.DataSource = list;

            if (firstRowIndex >= 0 && firstRowIndex < _dgvHistorial.Rows.Count)
                _dgvHistorial.FirstDisplayedScrollingRowIndex = firstRowIndex;
            
            if (selectedRows >= 0 && selectedRows < _dgvHistorial.Rows.Count)
            {
                _dgvHistorial.ClearSelection();
                _dgvHistorial.Rows[selectedRows].Selected = true;
            }

            if (_dgvHistorial.Columns.Count > 0)
            {
                _dgvHistorial.Columns["IdPago"].Visible = false;
                _dgvHistorial.Columns["Total"].DefaultCellStyle.Format = "N2";
                _dgvHistorial.Columns["EstadoCore"].DefaultCellStyle.Font = new Font("Segoe UI", 10, FontStyle.Bold);
            }
        }
        catch (Exception ex)
        {
            // Fallo silencioso del timer
            Console.WriteLine(ex.Message);
        }
    }

    private void DgvHistorial_CellFormatting(object? sender, DataGridViewCellFormattingEventArgs e)
    {
        if (_dgvHistorial.Columns[e.ColumnIndex].Name == "EstadoCore" && e.Value != null)
        {
            var val = e.Value.ToString();
            if (val!.Contains("✅"))
            {
                e.CellStyle!.ForeColor = Color.DarkGreen;
                e.CellStyle.BackColor = Color.LightGreen;
            }
            else if (val.Contains("⏳"))
            {
                e.CellStyle!.ForeColor = Color.DarkOrange;
                e.CellStyle.BackColor = Color.LightYellow;
            }
            else if (val.Contains("❌"))
            {
                e.CellStyle!.ForeColor = Color.DarkRed;
                e.CellStyle.BackColor = Color.LightPink;
            }
        }
    }
}
