using CajaDGM.Domain.Enums;

namespace CajaDGM.Application.DTOs;

public class ResumenCierreDto
{
    public decimal FondoInicial { get; set; }
    public decimal TotalCobrado { get; set; }
    public decimal TotalEfectivo { get; set; }
    public decimal MontoEsperado { get; set; }
    public decimal MontoContado { get; set; }
    public decimal Diferencia { get; set; }
    public bool Descuadrado { get; set; }

    public List<ResumenPorServicio> PorServicio { get; set; } = [];
    public List<ResumenPorFormaPago> PorFormaPago { get; set; } = [];
}

public class ResumenPorServicio
{
    public TipoServicio TipoServicio { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public int Cantidad { get; set; }
    public decimal Total { get; set; }
}

public class ResumenPorFormaPago
{
    public FormaPago FormaPago { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public int Cantidad { get; set; }
    public decimal Total { get; set; }
}
