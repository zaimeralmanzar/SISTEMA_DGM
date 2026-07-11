using CajaDGM.Application.DTOs;
using CajaDGM.Application.Services;
using CajaDGM.Domain.Enums;

namespace CajaDGM.UI.Forms;

public class FrmCierreSesion : Form
{
    private readonly SesionService _sesionService;
    private readonly NumericUpDown _nudMontoContado;
    private readonly Button _btnCerrar;
    private readonly Button _btnCancelar;
    private readonly DataGridView _dgvPorServicio;
    private readonly DataGridView _dgvPorFormaPago;
    private readonly Label _lblFondoInicial;
    private readonly Label _lblTotalCobrado;
    private readonly Label _lblMontoEsperado;
    private readonly Label _lblDiferencia;
    private decimal _montoEsperado;

    public FrmCierreSesion(SesionService sesionService)
    {
        _sesionService = sesionService;

        Text = "Cierre de Sesión";
        StartPosition = FormStartPosition.CenterParent;
        Size = new Size(700, 580);
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;

        var tlp = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 2,
            RowCount = 8,
            Padding = new Padding(15),
        };
        tlp.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 40));
        tlp.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 60));

        var row = 0;

        tlp.Controls.Add(new Label { Text = "RESUMEN DE CIERRE", Font = new Font("Segoe UI", 12, FontStyle.Bold), TextAlign = ContentAlignment.MiddleCenter }, 0, row);
        tlp.SetColumnSpan(tlp.GetControlFromPosition(0, row)!, 2);
        row++;

        tlp.Controls.Add(new Label { Text = "Fondo Inicial:", TextAlign = ContentAlignment.MiddleLeft, Font = new Font("Segoe UI", 10, FontStyle.Bold) }, 0, row);
        _lblFondoInicial = new Label { Text = "0.00 DOP", Font = new Font("Segoe UI", 10) };
        tlp.Controls.Add(_lblFondoInicial, 1, row);
        row++;

        tlp.Controls.Add(new Label { Text = "Total Cobrado:", TextAlign = ContentAlignment.MiddleLeft, Font = new Font("Segoe UI", 10, FontStyle.Bold) }, 0, row);
        _lblTotalCobrado = new Label { Text = "0.00 DOP", Font = new Font("Segoe UI", 10) };
        tlp.Controls.Add(_lblTotalCobrado, 1, row);
        row++;

        tlp.Controls.Add(new Label { Text = "Monto Esperado:", TextAlign = ContentAlignment.MiddleLeft, Font = new Font("Segoe UI", 10, FontStyle.Bold) }, 0, row);
        _lblMontoEsperado = new Label { Text = "0.00 DOP", Font = new Font("Segoe UI", 10) };
        tlp.Controls.Add(_lblMontoEsperado, 1, row);
        row++;

        tlp.Controls.Add(new Label { Text = "Monto Contado:", TextAlign = ContentAlignment.MiddleLeft }, 0, row);
        _nudMontoContado = new NumericUpDown
        {
            Maximum = 9_999_999,
            DecimalPlaces = 2,
            ThousandsSeparator = true,
            Anchor = AnchorStyles.Left | AnchorStyles.Right,
        };
        _nudMontoContado.ValueChanged += (_, _) => RecalcularDiferencia();
        tlp.Controls.Add(_nudMontoContado, 1, row);
        row++;

        tlp.Controls.Add(new Label { Text = "Diferencia:", TextAlign = ContentAlignment.MiddleLeft, Font = new Font("Segoe UI", 10, FontStyle.Bold) }, 0, row);
        _lblDiferencia = new Label { Text = "0.00 DOP", Font = new Font("Segoe UI", 10) };
        tlp.Controls.Add(_lblDiferencia, 1, row);
        row++;

        var tabs = new TabControl { Dock = DockStyle.Fill };
        var tabServicio = new TabPage("Por Servicio");
        _dgvPorServicio = new DataGridView
        {
            Dock = DockStyle.Fill,
            AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill,
            AllowUserToAddRows = false,
            ReadOnly = true,
        };
        tabServicio.Controls.Add(_dgvPorServicio);
        tabs.TabPages.Add(tabServicio);

        var tabFormaPago = new TabPage("Por Forma de Pago");
        _dgvPorFormaPago = new DataGridView
        {
            Dock = DockStyle.Fill,
            AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill,
            AllowUserToAddRows = false,
            ReadOnly = true,
        };
        tabFormaPago.Controls.Add(_dgvPorFormaPago);
        tabs.TabPages.Add(tabFormaPago);

        tlp.Controls.Add(tabs, 0, row);
        tlp.SetColumnSpan(tabs, 2);
        row++;

        var pnlButtons = new FlowLayoutPanel
        {
            Dock = DockStyle.Bottom,
            FlowDirection = FlowDirection.RightToLeft,
            Height = 45,
            Padding = new Padding(10),
        };

        _btnCancelar = new Button { Text = "Cancelar", Width = 90, Height = 30 };
        _btnCancelar.Click += (_, _) => DialogResult = DialogResult.Cancel;

        _btnCerrar = new Button { Text = "Cerrar Sesión", Width = 120, Height = 30 };
        _btnCerrar.Click += BtnCerrar_Click;

        pnlButtons.Controls.Add(_btnCancelar);
        pnlButtons.Controls.Add(_btnCerrar);

        Controls.Add(pnlButtons);
        Controls.Add(tlp);

        CargarDatos();
    }

    private void CargarDatos()
    {
        var s = _sesionService.SesionActual;
        if (s is null) return;

        var totalCobrado = s.Pagos.Where(p => p.Estado == EstadoPago.Pagado)
            .Sum(p => p.MontoTotal);
            
        var totalEfectivo = s.Pagos.Where(p => p.Estado == EstadoPago.Pagado && p.FormaPago == FormaPago.Efectivo)
            .Sum(p => p.MontoTotal);
            
        _montoEsperado = s.FondoInicial + totalEfectivo;

        _lblFondoInicial.Text = $"{s.FondoInicial:N2} DOP";
        _lblTotalCobrado.Text = $"{totalCobrado:N2} DOP (Efectivo: {totalEfectivo:N2})";
        _lblMontoEsperado.Text = $"{_montoEsperado:N2} DOP (Fondo + Efectivo)";
        _nudMontoContado.Value = 0;
        RecalcularDiferencia();

        _dgvPorServicio.DataSource = s.Pagos
            .Where(p => p.Estado == EstadoPago.Pagado)
            .GroupBy(p => p.TipoServicio)
            .Select(g => new
            {
                Servicio = g.Key.ToString(),
                Cantidad = g.Count(),
                Total = g.Sum(p => p.MontoTotal),
            })
            .ToList();

        _dgvPorFormaPago.DataSource = s.Pagos
            .Where(p => p.Estado == EstadoPago.Pagado)
            .GroupBy(p => p.FormaPago)
            .Select(g => new
            {
                FormaPago = g.Key.ToString(),
                Cantidad = g.Count(),
                Total = g.Sum(p => p.MontoTotal),
            })
            .ToList();
    }

    private void RecalcularDiferencia()
    {
        var montoContado = _nudMontoContado.Value;
        var diferencia = montoContado - _montoEsperado;
        _lblDiferencia.Text = $"{diferencia:N2} DOP";
        _lblDiferencia.ForeColor = diferencia >= 0 ? Color.Black : Color.Red;
    }

    private void BtnCerrar_Click(object? sender, EventArgs e)
    {
        if (_nudMontoContado.Value == 0 && _montoEsperado > 0)
        {
            var rta = MessageBox.Show(
                $"El Monto Contado está en 0.00 DOP, pero el Monto Esperado es {_montoEsperado:N2} DOP.\n\n" +
                "¿Confirma que el efectivo contado es realmente 0.00 DOP?",
                "Monto Contado sin especificar",
                MessageBoxButtons.YesNo, MessageBoxIcon.Question);
            if (rta != DialogResult.Yes) return;
        }

        var rtaCierre = MessageBox.Show("¿Está seguro de cerrar la sesión?",
            "Confirmar Cierre", MessageBoxButtons.YesNo, MessageBoxIcon.Question);

        if (rtaCierre != DialogResult.Yes) return;

        try
        {
            var resumen = _sesionService.CerrarSesion(_nudMontoContado.Value);

            if (resumen.Descuadrado)
            {
                var rolActual = _sesionService.SesionActual?.RolCajero;
                var puedeAutorizar = rolActual is RolUsuario.SupervisorCaja or RolUsuario.AdministradorLocal;

                if (puedeAutorizar)
                {
                    var rtaDesc = MessageBox.Show(
                        $"El monto no cuadra.\nEsperado: {resumen.MontoEsperado:N2} DOP\nContado: {resumen.MontoContado:N2} DOP\nDiferencia: {resumen.Diferencia:N2} DOP\n\n¿Desea cerrar de todos modos?",
                        "Descuadre Detectado",
                        MessageBoxButtons.YesNo, MessageBoxIcon.Warning);

                    if (rtaDesc != DialogResult.Yes) return;
                }
                else
                {
                    var rtaDesc = MessageBox.Show(
                        $"El monto no cuadra.\nEsperado: {resumen.MontoEsperado:N2} DOP\nContado: {resumen.MontoContado:N2} DOP\nDiferencia: {resumen.Diferencia:N2} DOP\n\nSe requiere autorización de un supervisor para continuar.",
                        "Descuadre Detectado",
                        MessageBoxButtons.OK, MessageBoxIcon.Warning);

                    if (rtaDesc != DialogResult.OK) return;

                    using var frmAuth = new FrmAutorizarSupervisor();
                    if (frmAuth.ShowDialog(this) != DialogResult.OK)
                        return;
                }
            }

            _ = MessageBox.Show(
                $"Sesión cerrada exitosamente.\nTotal cobrado: {resumen.TotalCobrado:N2} DOP\nDiferencia: {resumen.Diferencia:N2} DOP",
                "Cierre Completado", MessageBoxButtons.OK, MessageBoxIcon.Information);

            try
            {
                var sesionFinal = _sesionService.SesionActual;
                if (sesionFinal != null)
                {
                    CajaDGM.UI.Services.PdfImpresionService.GenerarReporteCierrePdf(resumen, sesionFinal);
                }
            }
            catch (Exception ex)
            {
                _ = MessageBox.Show($"Error al generar el PDF del reporte: {ex.Message}", "Error PDF", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }

            DialogResult = DialogResult.OK;
        }
        catch (Exception ex)
        {
            _ = MessageBox.Show($"Error al cerrar sesión: {ex.Message}",
                "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }
}
