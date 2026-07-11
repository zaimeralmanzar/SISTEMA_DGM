using CajaDGM.Domain.Enums;
using CajaDGM.Domain.Models;
using CajaDGM.Application.Services;

namespace CajaDGM.UI.Forms;

public class FrmAperturaSesion : Form
{
    private readonly ComboBox _cmbTerminal;
    private readonly TextBox _txtOficina;
    private readonly ComboBox _cmbModo;
    private readonly NumericUpDown _nudFondoInicial;
    private readonly Button _btnAbrir;
    private readonly Button _btnCancelar;

    public string Terminal => _cmbTerminal.Text.Trim();
    public string Oficina => _txtOficina.Text.Trim();
    public ModoTerminal Modo => (ModoTerminal)_cmbModo.SelectedItem!;
    public decimal FondoInicial => _nudFondoInicial.Value;

    public FrmAperturaSesion(string nombreUsuario, RolUsuario rol,
        ConfiguracionTerminalService? configService = null)
    {
        Text = $"Apertura de Sesión - {nombreUsuario} ({rol})";
        StartPosition = FormStartPosition.CenterParent;
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;
        MinimizeBox = false;
        Size = new Size(480, 280);

        var pnlForm = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 2,
            RowCount = 5,
            Padding = new Padding(20),
        };
        pnlForm.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 35));
        pnlForm.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 65));

        pnlForm.Controls.Add(new Label { Text = "Terminal:", TextAlign = ContentAlignment.MiddleLeft }, 0, 0);
        _cmbTerminal = new ComboBox
        {
            DropDownStyle = ComboBoxStyle.DropDownList,
            Anchor = AnchorStyles.Left | AnchorStyles.Right,
        };
        var config = configService?.ObtenerConfiguracion();

        _cmbTerminal.Items.AddRange(["TERM-001", "TERM-002", "TERM-003", "TERM-AIR-001", "TERM-FRO-001"]);
        if (config is not null && _cmbTerminal.Items.Contains(config.CodigoTerminal))
            _cmbTerminal.SelectedItem = config.CodigoTerminal;
        else
            _cmbTerminal.SelectedIndex = 0;
        pnlForm.Controls.Add(_cmbTerminal, 1, 0);

        pnlForm.Controls.Add(new Label { Text = "Oficina:", TextAlign = ContentAlignment.MiddleLeft }, 0, 1);
        _txtOficina = new TextBox
        {
            Text = config?.Oficina ?? "OFI-PRINCIPAL",
            Anchor = AnchorStyles.Left | AnchorStyles.Right,
        };
        pnlForm.Controls.Add(_txtOficina, 1, 1);

        pnlForm.Controls.Add(new Label { Text = "Modo:", TextAlign = ContentAlignment.MiddleLeft }, 0, 2);
        _cmbModo = new ComboBox { DropDownStyle = ComboBoxStyle.DropDownList, Anchor = AnchorStyles.Left | AnchorStyles.Right };
        _cmbModo.Items.AddRange(Enum.GetValues<ModoTerminal>().Cast<object>().ToArray());
        if (config is not null)
            _cmbModo.SelectedItem = config.Modo;
        else
            _cmbModo.SelectedIndex = 0;
        pnlForm.Controls.Add(_cmbModo, 1, 2);

        pnlForm.Controls.Add(new Label { Text = "Fondo Inicial (DOP):", TextAlign = ContentAlignment.MiddleLeft }, 0, 3);
        _nudFondoInicial = new NumericUpDown
        {
            Maximum = 1_000_000,
            Minimum = 0,
        };
        pnlForm.Controls.Add(_nudFondoInicial, 1, 3);

        var pnlButtons = new FlowLayoutPanel
        {
            Dock = DockStyle.Bottom,
            FlowDirection = FlowDirection.RightToLeft,
            Height = 45,
            Padding = new Padding(10),
        };
        _btnCancelar = new Button { Text = "Cancelar", Width = 90, Height = 30 };
        _btnCancelar.Click += (_, _) => DialogResult = DialogResult.Cancel;

        _btnAbrir = new Button { Text = "Abrir Sesión", Width = 110, Height = 30 };
        _btnAbrir.Click += BtnAbrir_Click;
        AcceptButton = _btnAbrir;

        pnlButtons.Controls.Add(_btnCancelar);
        pnlButtons.Controls.Add(_btnAbrir);

        Controls.Add(pnlButtons);
        Controls.Add(pnlForm);
    }

    private void BtnAbrir_Click(object? sender, EventArgs e)
    {
        if (string.IsNullOrWhiteSpace(_txtOficina.Text))
        {
            _ = MessageBox.Show("Ingrese la oficina.", "Validación",
                MessageBoxButtons.OK, MessageBoxIcon.Warning);
            _txtOficina.Focus();
            return;
        }

        DialogResult = DialogResult.OK;
    }
}
