using CajaDGM.Domain.Enums;
using CajaDGM.Domain.Models;
using CajaDGM.Application.Services;

namespace CajaDGM.UI.Forms;

public class FrmCobro : Form
{
    private readonly CobroService _cobroService;
    private readonly SesionService _sesionService;

    private TextBox _txtCedula = null!;
    private TextBox _txtPasaporte = null!;
    private Button _btnBuscar = null!;
    private DataGridView _dgvPersona = null!;
    private ComboBox _cmbServicio = null!;
    private Button _btnConsultarMonto = null!;
    private Label _lblMontoTarifa = null!;
    private Label _lblPenalidad = null!;
    private Label _lblTotal = null!;
    private ComboBox _cmbFormaPago = null!;
    private Button _btnPagar = null!;
    private Button _btnImprimir = null!;
    private Button _btnAnular = null!;

    private DataGridView _dgvHistorial = null!;
    private Guid? _pagoSeleccionadoId;

    private Persona? _personaActual;
    private ResultadoConsultaTarifa? _tarifaActual;
    private Comprobante? _ultimoComprobante;
    private TipoServicio _servicioSeleccionado;

    public FrmCobro(CobroService cobroService, SesionService sesionService)
    {
        _cobroService = cobroService;
        _sesionService = sesionService;

        Text = "Cobro de Servicios";
        StartPosition = FormStartPosition.CenterParent;
        Size = new Size(780, 660);
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;

        var tabs = new TabControl { Dock = DockStyle.Fill };

        var tabCobro = new TabPage("Cobro");
        InicializarTabCobro(tabCobro);
        tabs.TabPages.Add(tabCobro);

        var tabHistorial = new TabPage("Historial de la sesión");
        InicializarTabHistorial(tabHistorial);
        tabs.TabPages.Add(tabHistorial);

        Controls.Add(tabs);

        var rol = _sesionService.SesionActual?.RolCajero;
        _btnAnular.Visible = rol is RolUsuario.SupervisorCaja or RolUsuario.AdministradorLocal;
    }

    private void InicializarTabCobro(Control parent)
    {
        var tlp = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 2,
            RowCount = 13,
            Padding = new Padding(15),
        };
        tlp.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 28));
        tlp.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 72));

        var row = 0;

        tlp.Controls.Add(new Label { Text = "Cédula:", TextAlign = ContentAlignment.MiddleLeft }, 0, row);
        _txtCedula = new TextBox { Dock = DockStyle.Fill };
        tlp.Controls.Add(_txtCedula, 1, row);
        row++;

        tlp.Controls.Add(new Label { Text = "Pasaporte:", TextAlign = ContentAlignment.MiddleLeft }, 0, row);
        _txtPasaporte = new TextBox { Dock = DockStyle.Fill };
        tlp.Controls.Add(_txtPasaporte, 1, row);
        row++;

        tlp.Controls.Add(new Label(), 0, row);
        _btnBuscar = new Button { Text = "Buscar", Width = 100, Height = 28, Anchor = AnchorStyles.Left };
        _btnBuscar.Click += async (_, _) => await BuscarPersonaAsync();
        tlp.Controls.Add(_btnBuscar, 1, row);
        row++;

        _dgvPersona = new DataGridView
        {
            Dock = DockStyle.Fill,
            AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill,
            AutoSizeRowsMode = DataGridViewAutoSizeRowsMode.AllCells,
            RowHeadersVisible = false,
            AllowUserToAddRows = false,
            AllowUserToDeleteRows = false,
            ReadOnly = true,
            MinimumSize = new Size(0, 120),
        };
        tlp.Controls.Add(new Label { Text = "Persona:", TextAlign = ContentAlignment.TopLeft }, 0, row);
        tlp.Controls.Add(_dgvPersona, 1, row);
        tlp.SetRowSpan(_dgvPersona, 3);
        row += 3;

        tlp.Controls.Add(new Label { Text = "Servicio:", TextAlign = ContentAlignment.MiddleLeft }, 0, row);
        _cmbServicio = new ComboBox
        {
            DropDownStyle = ComboBoxStyle.DropDownList,
            Anchor = AnchorStyles.Left | AnchorStyles.Right,
        };
        _cmbServicio.Items.AddRange(Enum.GetValues<TipoServicio>().Cast<object>().ToArray());
        _cmbServicio.SelectedIndex = 0;
        tlp.Controls.Add(_cmbServicio, 1, row);
        row++;

        _btnConsultarMonto = new Button { Text = "Consultar Monto", Width = 140, Height = 30, Anchor = AnchorStyles.Left };
        _btnConsultarMonto.Click += async (_, _) => await ConsultarMontoAsync();
        tlp.Controls.Add(new Label(), 0, row);
        tlp.Controls.Add(_btnConsultarMonto, 1, row);
        row++;

        tlp.Controls.Add(new Label { Text = "Monto Tarifa:", TextAlign = ContentAlignment.MiddleLeft, Font = new Font("Segoe UI", 10) }, 0, row);
        _lblMontoTarifa = new Label { Text = "---", Font = new Font("Segoe UI", 10, FontStyle.Bold), ForeColor = Color.Blue };
        tlp.Controls.Add(_lblMontoTarifa, 1, row);
        row++;

        tlp.Controls.Add(new Label { Text = "Penalidad:", TextAlign = ContentAlignment.MiddleLeft, Font = new Font("Segoe UI", 10) }, 0, row);
        _lblPenalidad = new Label { Text = "---", Font = new Font("Segoe UI", 10, FontStyle.Bold), ForeColor = Color.Red };
        tlp.Controls.Add(_lblPenalidad, 1, row);
        row++;

        tlp.Controls.Add(new Label { Text = "Monto Total:", TextAlign = ContentAlignment.MiddleLeft, Font = new Font("Segoe UI", 12, FontStyle.Bold) }, 0, row);
        _lblTotal = new Label { Text = "---", Font = new Font("Segoe UI", 12, FontStyle.Bold), ForeColor = Color.Green };
        tlp.Controls.Add(_lblTotal, 1, row);
        row++;

        tlp.Controls.Add(new Label { Text = "Forma de Pago:", TextAlign = ContentAlignment.MiddleLeft }, 0, row);
        _cmbFormaPago = new ComboBox
        {
            DropDownStyle = ComboBoxStyle.DropDownList,
            Anchor = AnchorStyles.Left | AnchorStyles.Right,
        };
        _cmbFormaPago.Items.AddRange(Enum.GetValues<FormaPago>().Cast<object>().ToArray());
        _cmbFormaPago.SelectedIndex = 0;
        tlp.Controls.Add(_cmbFormaPago, 1, row);
        row++;

        var pnlAcciones = new FlowLayoutPanel
        {
            FlowDirection = FlowDirection.LeftToRight,
            Dock = DockStyle.Fill,
        };
        _btnPagar = new Button { Text = "Registrar Pago", Width = 130, Height = 35, BackColor = Color.FromArgb(0, 150, 0), ForeColor = Color.White, FlatStyle = FlatStyle.Flat };
        _btnPagar.Click += async (_, _) => await RegistrarPagoAsync();

        _btnImprimir = new Button { Text = "Imprimir Comprobante", Width = 160, Height = 35, Enabled = false };
        _btnImprimir.Click += (_, _) => ImprimirComprobante();

        _btnAnular = new Button { Text = "Anular Pago", Width = 110, Height = 35, BackColor = Color.FromArgb(200, 0, 0), ForeColor = Color.White, FlatStyle = FlatStyle.Flat };
        _btnAnular.Enabled = false;
        _btnAnular.Click += (_, _) => AnularPago();

        pnlAcciones.Controls.Add(_btnPagar);
        pnlAcciones.Controls.Add(_btnImprimir);
        pnlAcciones.Controls.Add(_btnAnular);
        tlp.Controls.Add(new Label(), 0, row);
        tlp.Controls.Add(pnlAcciones, 1, row);

        parent.Controls.Add(tlp);
    }

    private void InicializarTabHistorial(Control parent)
    {
        _dgvHistorial = new DataGridView
        {
            Dock = DockStyle.Fill,
            AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.None,
            AllowUserToAddRows = false,
            ReadOnly = true,
            RowHeadersVisible = false,
            MultiSelect = false,
            SelectionMode = DataGridViewSelectionMode.FullRowSelect,
        };

        RefrescarHistorial();

        _dgvHistorial.SelectionChanged += (_, _) =>
        {
            if (_dgvHistorial.SelectedRows.Count > 0)
            {
                var row = _dgvHistorial.SelectedRows[0];
                if (row.Cells["_idFull"]?.Value is Guid idPago)
                {
                    _pagoSeleccionadoId = idPago;
                    var pago = _sesionService.SesionActual?.Pagos
                        .FirstOrDefault(p => p.IdPago == idPago);
                    _btnAnular.Enabled = _btnAnular.Visible &&
                        pago?.Estado == EstadoPago.Pagado;
                    return;
                }
            }
            _pagoSeleccionadoId = null;
            _btnAnular.Enabled = false;
        };

        _dgvHistorial.CellFormatting += (_, e) =>
        {
            if (e.RowIndex < 0) return;
            var row = _dgvHistorial.Rows[e.RowIndex];

            if (e.ColumnIndex == _dgvHistorial.Columns["Id"]!.Index &&
                row.Cells["_idFull"]?.Value is Guid idFull)
                row.Cells[e.ColumnIndex].ToolTipText = idFull.ToString();

            if (e.ColumnIndex == _dgvHistorial.Columns["Comprobante"]!.Index &&
                row.Cells["_compFull"]?.Value is Guid compFull)
                row.Cells[e.ColumnIndex].ToolTipText = compFull.ToString();

            var estado = row.Cells["Estado"]?.Value?.ToString();
            if (estado == "Anulado")
            {
                row.DefaultCellStyle.Font = new Font("Segoe UI", 9, FontStyle.Strikeout);
                row.DefaultCellStyle.ForeColor = Color.Gray;
            }
        };

        parent.Controls.Add(_dgvHistorial);
    }

    private void RefrescarHistorial()
    {
        if (_dgvHistorial is null || _sesionService.SesionActual is not { } s)
            return;

        var data = s.Pagos
            .Select(p => new
            {
                Id = p.IdPago.ToString()[..8] + "…",
                p.NombresPagador,
                p.ApellidosPagador,
                p.CedulaPagador,
                Servicio = p.TipoServicio.ToString(),
                p.MontoTotal,
                Pago = p.FormaPago.ToString(),
                Fecha = p.FechaPago.ToString("dd/MM/yy HH:mm"),
                Comprobante = p.IdComprobante.ToString()[..8] + "…",
                Estado = p.Estado.ToString(),
                _idFull = p.IdPago,
                _compFull = p.IdComprobante,
            })
            .OrderByDescending(x => x.Fecha)
            .ToList();

        _dgvHistorial.DataSource = data;

        if (_dgvHistorial.Columns.Count > 0)
        {
            _dgvHistorial.Columns["_idFull"]!.Visible = false;
            _dgvHistorial.Columns["_compFull"]!.Visible = false;

            _dgvHistorial.Columns["Id"]!.HeaderText = "ID Pago";
            _dgvHistorial.Columns["NombresPagador"]!.HeaderText = "Nombres";
            _dgvHistorial.Columns["ApellidosPagador"]!.HeaderText = "Apellidos";
            _dgvHistorial.Columns["CedulaPagador"]!.HeaderText = "Cédula";
            _dgvHistorial.Columns["MontoTotal"]!.HeaderText = "Monto";
            _dgvHistorial.Columns["Fecha"]!.HeaderText = "Fecha";

            var widths = new (string Name, int Width)[]
            {
                ("Id", 80),
                ("NombresPagador", 130),
                ("ApellidosPagador", 130),
                ("CedulaPagador", 100),
                ("Servicio", 120),
                ("MontoTotal", 80),
                ("Pago", 80),
                ("Fecha", 110),
                ("Comprobante", 90),
                ("Estado", 80),
            };
            foreach (var (name, width) in widths)
                if (_dgvHistorial.Columns.Contains(name))
                    _dgvHistorial.Columns[name]!.Width = width;

            _dgvHistorial.AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill;
        }
    }

    private async Task BuscarPersonaAsync()
    {
        _personaActual = null;
        _dgvPersona.DataSource = null;

        var cedula = _txtCedula.Text.Trim();
        var pasaporte = _txtPasaporte.Text.Trim();

        if (string.IsNullOrWhiteSpace(cedula) && string.IsNullOrWhiteSpace(pasaporte))
        {
            _ = MessageBox.Show("Ingrese cédula o pasaporte.", "Validación",
                MessageBoxButtons.OK, MessageBoxIcon.Warning);
            return;
        }

        try
        {
            _personaActual = await _cobroService.BuscarPersonaAsync(cedula, pasaporte);

            if (_personaActual is null)
            {
                _ = MessageBox.Show("Persona no encontrada.", "Resultado",
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
                return;
            }

            var dt = new System.Data.DataTable();
            dt.Columns.Add("Campo");
            dt.Columns.Add("Valor");
            dt.Rows.Add("Cédula", _personaActual.Cedula);
            dt.Rows.Add("Pasaporte", _personaActual.Pasaporte);
            dt.Rows.Add("Nombres", _personaActual.Nombres);
            dt.Rows.Add("Apellidos", _personaActual.Apellidos);
            dt.Rows.Add("Nacionalidad", _personaActual.Nacionalidad);
            _dgvPersona.DataSource = dt;
        }
        catch (Exception ex)
        {
            _ = MessageBox.Show($"Error de conexión con el integrador: {ex.Message}",
                "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    private async Task ConsultarMontoAsync()
    {
        if (_personaActual is null)
        {
            _ = MessageBox.Show("Primero busque una persona.", "Validación",
                MessageBoxButtons.OK, MessageBoxIcon.Warning);
            return;
        }

        _servicioSeleccionado = (TipoServicio)_cmbServicio.SelectedItem!;

        try
        {
            _tarifaActual = await _cobroService.ConsultarMontoAsync(
                _servicioSeleccionado, _personaActual.Cedula);

            if (!_tarifaActual.Exito)
            {
                _ = MessageBox.Show($"Error al consultar tarifa: {_tarifaActual.MensajeError}",
                    "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            _lblMontoTarifa.Text = $"{_tarifaActual.MontoTarifa:N2} DOP";
            _lblPenalidad.Text = _tarifaActual.MontoPenalidad > 0
                ? $"{_tarifaActual.MontoPenalidad:N2} DOP"
                : "Sin penalidad";
            _lblTotal.Text = $"{_tarifaActual.MontoTotal:N2} DOP";
        }
        catch (Exception ex)
        {
            _ = MessageBox.Show($"Error de conexión con el integrador: {ex.Message}",
                "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    private async Task RegistrarPagoAsync()
    {
        if (_personaActual is null || _tarifaActual is null)
        {
            _ = MessageBox.Show("Debe buscar una persona y consultar el monto primero.",
                "Validación", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            return;
        }

        try
        {
            _ultimoComprobante = await _cobroService.ProcesarPagoAsync(
                _personaActual,
                _servicioSeleccionado,
                _tarifaActual.MontoTarifa,
                _tarifaActual.MontoPenalidad,
                _tarifaActual.MontoTotal,
                (FormaPago)_cmbFormaPago.SelectedItem!);

            _ = MessageBox.Show(
                $"Pago registrado exitosamente.\nComprobante: {_ultimoComprobante.NumeroComprobante}",
                "Éxito", MessageBoxButtons.OK, MessageBoxIcon.Information);

            _btnImprimir.Enabled = true;
            _btnPagar.Enabled = false;
            RefrescarHistorial();
        }
        catch (Exception ex)
        {
            _ = MessageBox.Show($"Error al procesar el pago: {ex.Message}",
                "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    private void AnularPago()
    {
        if (_pagoSeleccionadoId is null) return;

        var pago = _sesionService.SesionActual?.Pagos
            .FirstOrDefault(p => p.IdPago == _pagoSeleccionadoId);
        if (pago is null || pago.Estado != EstadoPago.Pagado) return;

        var motivo = PromptDialog.Show("Motivo de la anulación:", "Anular Pago", "Error en el cobro");

        if (string.IsNullOrWhiteSpace(motivo))
        {
            _ = MessageBox.Show("Debe ingresar un motivo para anular el pago.",
                "Validación", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            return;
        }

        var rta = MessageBox.Show(
            $"¿Está seguro de anular el pago {pago.IdPago.ToString()[..8]}…\n" +
            $"Pagador: {pago.NombresPagador} {pago.ApellidosPagador}\n" +
            $"Monto: {pago.MontoTotal:N2} DOP\n" +
            $"Motivo: {motivo}",
            "Confirmar Anulación",
            MessageBoxButtons.YesNo, MessageBoxIcon.Warning);

        if (rta != DialogResult.Yes) return;

        try
        {
            var supervisor = _sesionService.SesionActual?.NombreCajero ?? "Sistema";
            _sesionService.AnularPago(pago.IdPago, supervisor, motivo);

            _ = MessageBox.Show("Pago anulado exitosamente.", "Anulación Completada",
                MessageBoxButtons.OK, MessageBoxIcon.Information);

            _pagoSeleccionadoId = null;
            _btnAnular.Enabled = false;
            RefrescarHistorial();
        }
        catch (Exception ex)
        {
            _ = MessageBox.Show($"Error al anular el pago: {ex.Message}",
                "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    private void ImprimirComprobante()
    {
        if (_ultimoComprobante is null) return;

        try
        {
            CajaDGM.UI.Services.PdfImpresionService.GenerarComprobantePdf(_ultimoComprobante);
        }
        catch (Exception ex)
        {
            _ = MessageBox.Show($"Error al generar el comprobante PDF: {ex.Message}",
                "Error de Impresión", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }
}
