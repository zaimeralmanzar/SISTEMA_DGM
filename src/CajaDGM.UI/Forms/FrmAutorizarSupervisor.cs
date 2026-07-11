using CajaDGM.Domain.Enums;

namespace CajaDGM.UI.Forms;

public class FrmAutorizarSupervisor : Form
{
    private readonly TextBox _txtUsuario;
    private readonly TextBox _txtClave;
    private readonly Button _btnAutorizar;
    private readonly Button _btnCancelar;

    public FrmAutorizarSupervisor()
    {
        Text = "Autorización de Supervisor";
        StartPosition = FormStartPosition.CenterParent;
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;
        MinimizeBox = false;
        Size = new Size(360, 200);

        var tlp = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 2,
            RowCount = 3,
            Padding = new Padding(20),
        };
        tlp.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 35));
        tlp.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 65));

        tlp.Controls.Add(new Label { Text = "Usuario Supervisor:", TextAlign = ContentAlignment.MiddleLeft }, 0, 0);
        _txtUsuario = new TextBox { Anchor = AnchorStyles.Left | AnchorStyles.Right };
        tlp.Controls.Add(_txtUsuario, 1, 0);

        tlp.Controls.Add(new Label { Text = "Clave:", TextAlign = ContentAlignment.MiddleLeft }, 0, 1);
        _txtClave = new TextBox { UseSystemPasswordChar = true, Anchor = AnchorStyles.Left | AnchorStyles.Right };
        tlp.Controls.Add(_txtClave, 1, 1);

        var pnlButtons = new FlowLayoutPanel
        {
            Dock = DockStyle.Bottom,
            FlowDirection = FlowDirection.RightToLeft,
            Height = 45,
            Padding = new Padding(10),
        };

        _btnCancelar = new Button { Text = "Cancelar", Width = 90, Height = 30 };
        _btnCancelar.Click += (_, _) => DialogResult = DialogResult.Cancel;

        _btnAutorizar = new Button { Text = "Autorizar", Width = 100, Height = 30 };
        _btnAutorizar.Click += BtnAutorizar_Click;
        AcceptButton = _btnAutorizar;

        pnlButtons.Controls.Add(_btnCancelar);
        pnlButtons.Controls.Add(_btnAutorizar);

        Controls.Add(pnlButtons);
        Controls.Add(tlp);
    }

    private void BtnAutorizar_Click(object? sender, EventArgs e)
    {
        if (string.IsNullOrWhiteSpace(_txtUsuario.Text))
        {
            _ = MessageBox.Show("Ingrese el usuario del supervisor.", "Validación",
                MessageBoxButtons.OK, MessageBoxIcon.Warning);
            _txtUsuario.Focus();
            return;
        }

        // En un entorno real se validaría contra el Sistema de Integración.
        // Simulación: cualquier usuario con "supervisor" en el nombre es válido.
        if (!_txtUsuario.Text.Contains("supervisor", StringComparison.OrdinalIgnoreCase) &&
            !_txtUsuario.Text.Equals("admin", StringComparison.OrdinalIgnoreCase))
        {
            _ = MessageBox.Show("Credenciales de supervisor no válidas.",
                "Autorización Denegada", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            return;
        }

        DialogResult = DialogResult.OK;
    }
}
