using System.Reflection;
using CajaDGM.Domain.Enums;
using CajaDGM.Domain.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace CajaDGM.UI.Forms;

public class FrmLogin : Form
{
    private readonly TextBox _txtUsuario;
    private readonly TextBox _txtClave;
    private readonly ComboBox _cmbRol;
    private readonly Button _btnIngresar;
    private readonly Button _btnSalir;

    public string Usuario { get; private set; } = string.Empty;
    public RolUsuario RolSeleccionado { get; private set; }

    public FrmLogin()
    {
        Text = "DGM - Sistema de Caja - Inicio de Sesión";
        StartPosition = FormStartPosition.CenterScreen;
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;
        MinimizeBox = false;
        Size = new Size(420, 480);

        var logoStream = Assembly.GetExecutingAssembly()
            .GetManifestResourceStream("CajaDGM.UI.LogoDGM.png");
        var logoImage = logoStream is not null ? Image.FromStream(logoStream) : null;

        var picLogo = new PictureBox
        {
            Image = logoImage,
            SizeMode = PictureBoxSizeMode.Zoom,
            Dock = DockStyle.Top,
            Height = 120,
            BackColor = Color.Transparent,
            Margin = new Padding(0, 20, 0, 0),
        };

        var lblIniciarSesion = new Label
        {
            Text = "Iniciar Sesión",
            Font = new Font("Segoe UI", 18, FontStyle.Bold),
            TextAlign = ContentAlignment.MiddleCenter,
            Dock = DockStyle.Top,
            Height = 35,
            ForeColor = Color.FromArgb(0, 70, 140),
        };

        var pnlForm = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 2,
            RowCount = 4,
            Padding = new Padding(20),
            AutoSize = true,
        };
        pnlForm.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 30));
        pnlForm.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 70));

        pnlForm.Controls.Add(new Label { Text = "Usuario:", TextAlign = ContentAlignment.MiddleLeft, Anchor = AnchorStyles.Left }, 0, 0);
        _txtUsuario = new TextBox { Anchor = AnchorStyles.Left | AnchorStyles.Right, Width = 220 };
        pnlForm.Controls.Add(_txtUsuario, 1, 0);

        pnlForm.Controls.Add(new Label { Text = "Clave:", TextAlign = ContentAlignment.MiddleLeft, Anchor = AnchorStyles.Left }, 0, 1);
        _txtClave = new TextBox { Anchor = AnchorStyles.Left | AnchorStyles.Right, Width = 220, UseSystemPasswordChar = true };
        pnlForm.Controls.Add(_txtClave, 1, 1);

        pnlForm.Controls.Add(new Label { Text = "Rol (demo):", TextAlign = ContentAlignment.MiddleLeft, Anchor = AnchorStyles.Left }, 0, 2);
        _cmbRol = new ComboBox
        {
            DropDownStyle = ComboBoxStyle.DropDownList,
            Anchor = AnchorStyles.Left | AnchorStyles.Right,
            Width = 220,
        };
        _cmbRol.Items.AddRange(Enum.GetValues<RolUsuario>().Cast<object>().ToArray());
        _cmbRol.SelectedIndex = 0;
        pnlForm.Controls.Add(_cmbRol, 1, 2);

        var pnlButtons = new FlowLayoutPanel
        {
            Dock = DockStyle.Bottom,
            FlowDirection = FlowDirection.RightToLeft,
            Height = 45,
            Padding = new Padding(10),
        };

        _btnSalir = new Button { Text = "Salir", Width = 90, Height = 30 };
        _btnSalir.Click += (_, _) => DialogResult = DialogResult.Cancel;

        _btnIngresar = new Button { Text = "Ingresar", Width = 90, Height = 30 };
        _btnIngresar.Click += BtnIngresar_Click;
        AcceptButton = _btnIngresar;

        pnlButtons.Controls.Add(_btnSalir);
        pnlButtons.Controls.Add(_btnIngresar);

        Controls.Add(pnlButtons);
        Controls.Add(pnlForm);
        Controls.Add(lblIniciarSesion);
        Controls.Add(picLogo);
    }

    private async void BtnIngresar_Click(object? sender, EventArgs e)
    {
        if (string.IsNullOrWhiteSpace(_txtUsuario.Text))
        {
            _ = MessageBox.Show("Ingrese el nombre de usuario.", "Validación",
                MessageBoxButtons.OK, MessageBoxIcon.Warning);
            _txtUsuario.Focus();
            return;
        }

        var authService = Program.ServiceProvider.GetRequiredService<IAuthService>();

        var (exito, nombreUsuario, rol) = await authService.LoginAsync(
            _txtUsuario.Text.Trim(), _txtClave.Text.Trim());

        if (!exito || nombreUsuario is null || rol is null)
        {
            _ = MessageBox.Show("Usuario o contraseña incorrectos.", "Acceso denegado",
                MessageBoxButtons.OK, MessageBoxIcon.Error);
            _txtClave.Clear();
            _txtClave.Focus();
            return;
        }

        Usuario = nombreUsuario;
        RolSeleccionado = rol.Value;
        DialogResult = DialogResult.OK;
    }
}
