namespace CajaDGM.Integration.Data;

public class ServicioEntity
{
    public int Id { get; set; }
    public string TipoServicio { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public decimal Tarifa { get; set; }
}