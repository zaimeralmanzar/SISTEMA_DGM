namespace CajaDGM.UI.Forms;

public static class PromptDialog
{
    public static string Show(string message, string title, string defaultValue = "")
    {
        var label = new Label { Text = message, Left = 12, Top = 12, Width = 300, AutoSize = true };
        var textBox = new TextBox { Left = 12, Top = 36, Width = 300, Text = defaultValue };
        var okBtn = new Button { Text = "OK", Left = 156, Top = 68, Width = 75, DialogResult = DialogResult.OK };
        var cancelBtn = new Button { Text = "Cancelar", Left = 237, Top = 68, Width = 75, DialogResult = DialogResult.Cancel };

        var form = new Form
        {
            Text = title,
            StartPosition = FormStartPosition.CenterParent,
            FormBorderStyle = FormBorderStyle.FixedDialog,
            MaximizeBox = false,
            MinimizeBox = false,
            ClientSize = new Size(324, 105),
            Controls = { label, textBox, okBtn, cancelBtn },
            AcceptButton = okBtn,
            CancelButton = cancelBtn,
        };

        return form.ShowDialog() == DialogResult.OK ? textBox.Text.Trim() : string.Empty;
    }
}
