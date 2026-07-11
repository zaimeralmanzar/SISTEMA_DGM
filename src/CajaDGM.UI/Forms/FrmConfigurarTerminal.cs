using CajaDGM.Domain.Enums;
using CajaDGM.Domain.Models;
using CajaDGM.Application.Services;

namespace CajaDGM.UI.Forms;

public class FrmConfigurarTerminal : Form
{
    private readonly TextBox _txtCodigoTerminal;
    private readonly TextBox _txtOficina;
    private readonly ComboBox _cmbModo;
    private readonly Button _btnGuardar;
    private readonly Button _btnCancelar;
    private readonly ConfiguracionTerminalService _configService;

    public FrmConfigurarTerminal(ConfiguracionTerminalService configService)
    {
        _configService = configService;

        Text = "Configurar Terminal";
        StartPosition = FormStartPosition.CenterParent;
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;
        MinimizeBox = false;
        Size = new Size(480, 260);

        var pnlForm = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 2,
            RowCount = 4,
            Padding = new Padding(20),
        };
        pnlForm.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 35));
        pnlForm.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 65));

        pnlForm.Controls.Add(new Label
        {
            Text = "Código de Terminal:",
            TextAlign = ContentAlignment.MiddleLeft,
        }, 0, 0);
        _txtCodigoTerminal = new TextBox
        {
            Anchor = AnchorStyles.Left | AnchorStyles.Right,
        };
        pnlForm.Controls.Add(_txtCodigoTerminal, 1, 0);

        pnlForm.Controls.Add(new Label
        {
            Text = "Oficina:",
            TextAlign = ContentAlignment.MiddleLeft,
        }, 0, 1);
        _txtOficina = new TextBox
        {
            Anchor = AnchorStyles.Left | AnchorStyles.Right,
        };
        pnlForm.Controls.Add(_txtOficina, 1, 1);

        pnlForm.Controls.Add(new Label
        {
            Text = "Modo de operación:",
            TextAlign = ContentAlignment.MiddleLeft,
        }, 0, 2);
        _cmbModo = new ComboBox
        {
            DropDownStyle = ComboBoxStyle.DropDownList,
            Anchor = AnchorStyles.Left | AnchorStyles.Right,
        };
        _cmbModo.Items.AddRange(Enum.GetValues<ModoTerminal>().Cast<object>().ToArray());
        pnlForm.Controls.Add(_cmbModo, 1, 2);

        var pnlButtons = new FlowLayoutPanel
        {
            Dock = DockStyle.Bottom,
            FlowDirection = FlowDirection.RightToLeft,
            Height = 45,
            Padding = new Padding(10),
        };

        _btnCancelar = new Button { Text = "Cancelar", Width = 90, Height = 30 };
        _btnCancelar.Click += (_, _) => DialogResult = DialogResult.Cancel;

        _btnGuardar = new Button { Text = "Guardar", Width = 110, Height = 30 };
        _btnGuardar.Click += BtnGuardar_Click;
        AcceptButton = _btnGuardar;

        pnlButtons.Controls.Add(_btnCancelar);
        pnlButtons.Controls.Add(_btnGuardar);

        Controls.Add(pnlButtons);
        Controls.Add(pnlForm);

        var config = _configService.ObtenerConfiguracion();
        _txtCodigoTerminal.Text = config.CodigoTerminal;
        _txtOficina.Text = config.Oficina;
        _cmbModo.SelectedItem = config.Modo;
    }

    private void BtnGuardar_Click(object? sender, EventArgs e)
    {
        if (string.IsNullOrWhiteSpace(_txtCodigoTerminal.Text))
        {
            _ = MessageBox.Show("Ingrese el código de terminal.", "Validación",
                MessageBoxButtons.OK, MessageBoxIcon.Warning);
            _txtCodigoTerminal.Focus();
            return;
        }

        if (string.IsNullOrWhiteSpace(_txtOficina.Text))
        {
            _ = MessageBox.Show("Ingrese la oficina.", "Validación",
                MessageBoxButtons.OK, MessageBoxIcon.Warning);
            _txtOficina.Focus();
            return;
        }

        var config = new ConfiguracionTerminal
        {
            CodigoTerminal = _txtCodigoTerminal.Text.Trim(),
            Oficina = _txtOficina.Text.Trim(),
            Modo = (ModoTerminal)_cmbModo.SelectedItem!,
        };

        _configService.GuardarConfiguracion(config);

        _ = MessageBox.Show("Configuración de terminal guardada correctamente.",
            "Configurar Terminal", MessageBoxButtons.OK, MessageBoxIcon.Information);

        DialogResult = DialogResult.OK;
    }
}
