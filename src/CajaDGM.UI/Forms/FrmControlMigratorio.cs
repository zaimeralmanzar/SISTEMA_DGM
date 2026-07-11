using CajaDGM.Domain.Enums;
using CajaDGM.Domain.Models;
using CajaDGM.Application.Services;

namespace CajaDGM.UI.Forms;

public class FrmControlMigratorio : Form
{
    private readonly MovimientoMigratorioAppService _movimientoService;
    private readonly CobroService _cobroService;
    private readonly SesionService _sesionService;

    private readonly TextBox _txtCedula;
    private readonly TextBox _txtPasaporte;
    private readonly Button _btnBuscar;
    private readonly DataGridView _dgvPersona;
    private readonly GroupBox _gbMovimiento;
    private readonly RadioButton _rbEntrada;
    private readonly RadioButton _rbSalida;
    private readonly TextBox _txtVuelo;
    private readonly TextBox _txtPaisOrigenDestino;
    private readonly Button _btnRegistrar;

    private readonly GroupBox _gbSobreestadia;
    private readonly Label _lblSobreestadiaInfo;
    private readonly Label _lblMontoSobreestadia;
    private readonly ComboBox _cmbFormaPago;
    private readonly Button _btnCobrarSobreestadia;

    private Persona? _personaActual;
    private ResultadoSobreestadia? _sobreestadiaActual;

    public FrmControlMigratorio(
        MovimientoMigratorioAppService movimientoService,
        CobroService cobroService,
        SesionService sesionService)
    {
        _movimientoService = movimientoService;
        _cobroService = cobroService;
        _sesionService = sesionService;

        Text = "Control Migratorio - Terminal " + sesionService.SesionActual?.Terminal;
        StartPosition = FormStartPosition.CenterParent;
        Size = new Size(750, 680);
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;

        var tlp = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 2,
            RowCount = 7,
            Padding = new Padding(15),
        };
        tlp.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 28));
        tlp.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 72));

        var row = 0;

        tlp.Controls.Add(new Label { Text = "Búsqueda de persona:", TextAlign = ContentAlignment.MiddleLeft, Font = new Font("Segoe UI", 10, FontStyle.Bold) }, 0, row);
        tlp.SetColumnSpan(tlp.GetControlFromPosition(0, row)!, 2);
        row++;

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
            ReadOnly = true,
            MinimumSize = new Size(0, 100),
        };
        tlp.Controls.Add(new Label { Text = "Datos:", TextAlign = ContentAlignment.TopLeft }, 0, row);
        tlp.Controls.Add(_dgvPersona, 1, row);
        tlp.SetRowSpan(_dgvPersona, 2);
        row += 2;

        _gbMovimiento = new GroupBox { Text = "Registrar Movimiento", Dock = DockStyle.Fill };
        var tlpMov = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 2,
            RowCount = 4,
            Padding = new Padding(10),
        };
        tlpMov.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 25));
        tlpMov.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 75));

        _rbEntrada = new RadioButton { Text = "Entrada", Checked = true };
        _rbSalida = new RadioButton { Text = "Salida" };
        _rbSalida.CheckedChanged += (_, _) => ActualizarVisibilidadSobreestadia();
        _rbEntrada.CheckedChanged += (_, _) => ActualizarTextoBoton();
        _rbSalida.CheckedChanged += (_, _) => ActualizarTextoBoton();

        var pnlTipo = new FlowLayoutPanel { FlowDirection = FlowDirection.LeftToRight };
        pnlTipo.Controls.Add(_rbEntrada);
        pnlTipo.Controls.Add(_rbSalida);
        tlpMov.Controls.Add(new Label { Text = "Tipo:", TextAlign = ContentAlignment.MiddleLeft }, 0, 0);
        tlpMov.Controls.Add(pnlTipo, 1, 0);

        tlpMov.Controls.Add(new Label { Text = "Vuelo:", TextAlign = ContentAlignment.MiddleLeft }, 0, 1);
        _txtVuelo = new TextBox { Text = "AA1234", Anchor = AnchorStyles.Left | AnchorStyles.Right };
        tlpMov.Controls.Add(_txtVuelo, 1, 1);

        tlpMov.Controls.Add(new Label { Text = "País Origen/Destino:", TextAlign = ContentAlignment.MiddleLeft }, 0, 2);
        _txtPaisOrigenDestino = new TextBox { Text = "Estados Unidos", Anchor = AnchorStyles.Left | AnchorStyles.Right };
        tlpMov.Controls.Add(_txtPaisOrigenDestino, 1, 2);

        _btnRegistrar = new Button { Text = "Registrar Entrada", Width = 180, Height = 35, BackColor = Color.FromArgb(0, 100, 180), ForeColor = Color.White, FlatStyle = FlatStyle.Flat, Enabled = false };
        _btnRegistrar.Click += async (_, _) => await RegistrarMovimientoAsync();
        tlpMov.Controls.Add(new Label(), 0, 3);
        tlpMov.Controls.Add(_btnRegistrar, 1, 3);

        _gbMovimiento.Controls.Add(tlpMov);
        tlp.Controls.Add(_gbMovimiento, 0, row);
        tlp.SetColumnSpan(_gbMovimiento, 2);
        tlp.SetRowSpan(_gbMovimiento, 2);
        row += 2;

        _gbSobreestadia = new GroupBox { Text = "Sobreestadía", Dock = DockStyle.Fill, Visible = false };
        var tlpSobre = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 2,
            RowCount = 4,
            Padding = new Padding(10),
        };
        tlpSobre.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 35));
        tlpSobre.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 65));

        _lblSobreestadiaInfo = new Label { Text = "---", Font = new Font("Segoe UI", 10), AutoSize = true, AutoEllipsis = false };
        tlpSobre.Controls.Add(new Label { Text = "Información:", TextAlign = ContentAlignment.MiddleLeft }, 0, 0);
        tlpSobre.Controls.Add(_lblSobreestadiaInfo, 1, 0);

        _lblMontoSobreestadia = new Label { Text = "---", Font = new Font("Segoe UI", 12, FontStyle.Bold), ForeColor = Color.Red };
        tlpSobre.Controls.Add(new Label { Text = "Monto a cobrar:", TextAlign = ContentAlignment.MiddleLeft }, 0, 1);
        tlpSobre.Controls.Add(_lblMontoSobreestadia, 1, 1);

        tlpSobre.Controls.Add(new Label { Text = "Forma de pago:", TextAlign = ContentAlignment.MiddleLeft }, 0, 2);
        _cmbFormaPago = new ComboBox
        {
            DropDownStyle = ComboBoxStyle.DropDownList,
            Anchor = AnchorStyles.Left | AnchorStyles.Right,
        };
        _cmbFormaPago.Items.AddRange(Enum.GetValues<FormaPago>().Cast<object>().ToArray());
        _cmbFormaPago.SelectedIndex = 0;
        tlpSobre.Controls.Add(_cmbFormaPago, 1, 2);

        _btnCobrarSobreestadia = new Button { Text = "Cobrar Sobreestadía y Registrar Salida", Width = 290, Height = 35, BackColor = Color.FromArgb(180, 80, 0), ForeColor = Color.White, FlatStyle = FlatStyle.Flat };
        _btnCobrarSobreestadia.Click += async (_, _) => await CobrarSobreestadiaAsync();
        tlpSobre.Controls.Add(new Label(), 0, 3);
        tlpSobre.Controls.Add(_btnCobrarSobreestadia, 1, 3);

        _gbSobreestadia.Controls.Add(tlpSobre);
        tlp.Controls.Add(_gbSobreestadia, 0, row);
        tlp.SetColumnSpan(_gbSobreestadia, 2);

        Controls.Add(tlp);
    }

    private void ActualizarTextoBoton()
    {
        _btnRegistrar.Text = _rbSalida.Checked ? "Registrar Salida" : "Registrar Entrada";
    }

    private async Task BuscarPersonaAsync()
    {
        _personaActual = null;
        _sobreestadiaActual = null;
        _dgvPersona.DataSource = null;
        _gbSobreestadia.Visible = false;
        _btnRegistrar.Enabled = false;

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
            _personaActual = await _movimientoService.BuscarPersonaAsync(cedula, pasaporte);

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

            _btnRegistrar.Enabled = true;

            if (_rbSalida.Checked)
                await ConsultarSobreestadiaAsync();
        }
        catch (Exception ex)
        {
            _ = MessageBox.Show($"Error de conexión con el integrador: {ex.Message}",
                "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    private async Task ConsultarSobreestadiaAsync()
    {
        if (_personaActual is null) return;

        try
        {
            _sobreestadiaActual = await _movimientoService.ConsultarSobreestadiaAsync(
                _personaActual.Pasaporte, _personaActual.Cedula);

            if (_sobreestadiaActual.TieneSobreestadia)
            {
                _gbSobreestadia.Visible = true;
                _lblSobreestadiaInfo.Text = $"El viajero tiene {_sobreestadiaActual.DiasExcedidos} días de sobreestadía.";
                _lblMontoSobreestadia.Text = $"{_sobreestadiaActual.MontoAPagar:N2} {_sobreestadiaActual.Moneda}";
                _gbSobreestadia.PerformLayout();
            }
            else
            {
                _gbSobreestadia.Visible = false;
            }
        }
        catch (Exception ex)
        {
            _ = MessageBox.Show($"Error al consultar sobreestadía: {ex.Message}",
                "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    private void ActualizarVisibilidadSobreestadia()
    {
        if (!_rbSalida.Checked)
        {
            _gbSobreestadia.Visible = false;
        }
        else if (_personaActual is not null)
        {
            _ = ConsultarSobreestadiaAsync();
        }
    }

    private async Task RegistrarMovimientoAsync()
    {
        if (_personaActual is null)
        {
            _ = MessageBox.Show("Primero busque una persona.", "Validación",
                MessageBoxButtons.OK, MessageBoxIcon.Warning);
            return;
        }

        if (_rbSalida.Checked)
        {
            // Si hay sobreestadía, debe cobrarse antes de registrar salida.
            if (_sobreestadiaActual?.TieneSobreestadia == true)
            {
                _ = MessageBox.Show("Esta persona tiene sobreestadía pendiente de cobro. Use el botón 'Cobrar Sobreestadía y Registrar Salida'.",
                    "Sobreestadía Pendiente", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            try
            {
                await _movimientoService.RegistrarSalidaAsync(_personaActual, _txtVuelo.Text, _txtPaisOrigenDestino.Text);
                _ = MessageBox.Show("Salida registrada exitosamente.", "Éxito",
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
                LimpiarFormulario();
            }
            catch (Exception ex)
            {
                _ = MessageBox.Show($"Error al registrar salida: {ex.Message}",
                    "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
        else
        {
            try
            {
                await _movimientoService.RegistrarEntradaAsync(_personaActual, _txtVuelo.Text, _txtPaisOrigenDestino.Text);
                _ = MessageBox.Show("Entrada registrada exitosamente.", "Éxito",
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
                LimpiarFormulario();
            }
            catch (Exception ex)
            {
                _ = MessageBox.Show($"Error al registrar entrada: {ex.Message}",
                    "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }

    private async Task CobrarSobreestadiaAsync()
    {
        if (_personaActual is null || _sobreestadiaActual is null) return;

        var rta = MessageBox.Show(
            $"Va a cobrar {_sobreestadiaActual.MontoAPagar:N2} {_sobreestadiaActual.Moneda} por sobreestadía a:\n" +
            $"{_personaActual.Nombres} {_personaActual.Apellidos}\n\n" +
            $"Forma de pago: {_cmbFormaPago.SelectedItem}\n\n¿Confirmar cobro y registrar salida?",
            "Confirmar Cobro de Sobreestadía",
            MessageBoxButtons.YesNo, MessageBoxIcon.Question);

        if (rta != DialogResult.Yes) return;

        try
        {
            // La Caja solo registra el cobro de lo que el integrador indica.
            // Se reusa CobroService para registrar el pago.
            var comprobante = await _cobroService.ProcesarPagoAsync(
                _personaActual,
                TipoServicio.ExenciónMulta,
                0,
                _sobreestadiaActual.MontoAPagar,
                _sobreestadiaActual.MontoAPagar,
                (FormaPago)_cmbFormaPago.SelectedItem!);

            // Luego registrar la salida
            await _movimientoService.RegistrarSalidaAsync(_personaActual, _txtVuelo.Text, _txtPaisOrigenDestino.Text);

            _ = MessageBox.Show(
                $"Sobreestadía cobrada y salida registrada.\nComprobante: {comprobante.NumeroComprobante}",
                "Éxito", MessageBoxButtons.OK, MessageBoxIcon.Information);

            LimpiarFormulario();
        }
        catch (Exception ex)
        {
            _ = MessageBox.Show($"Error al procesar sobreestadía: {ex.Message}",
                "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    private void LimpiarFormulario()
    {
        _personaActual = null;
        _sobreestadiaActual = null;
        _dgvPersona.DataSource = null;
        _gbSobreestadia.Visible = false;
        _lblSobreestadiaInfo.Text = "---";
        _lblMontoSobreestadia.Text = "---";
        _btnRegistrar.Enabled = false;
    }
}
