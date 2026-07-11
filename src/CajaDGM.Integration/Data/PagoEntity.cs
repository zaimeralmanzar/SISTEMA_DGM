using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CajaDGM.Integration.Data;

[Table("Pagos")]
public class PagoEntity
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public Guid IdPago { get; set; }

    [Required]
    [MaxLength(20)]
    public string CedulaPagador { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string NombresPagador { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string ApellidosPagador { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal MontoTotal { get; set; }

    [Required]
    [MaxLength(50)]
    public string TipoServicio { get; set; } = string.Empty;

    [Required]
    public DateTime FechaPago { get; set; }

    [Required]
    [MaxLength(50)]
    public string FormaPago { get; set; } = string.Empty;

    [Required]
    public bool SincronizadoEnCore { get; set; } = false;

    public DateTime? FechaSincronizacion { get; set; }
    
    public string? ErrorSincronizacion { get; set; }
}
