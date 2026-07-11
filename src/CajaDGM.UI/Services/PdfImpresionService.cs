using System.Diagnostics;
using CajaDGM.Application.DTOs;
using CajaDGM.Domain.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace CajaDGM.UI.Services;

public static class PdfImpresionService
{
    static PdfImpresionService()
    {
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public static void GenerarComprobantePdf(Comprobante comprobante)
    {
        var tempFile = Path.Combine(Path.GetTempPath(), $"Comprobante_{comprobante.NumeroComprobante}.pdf");

        Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A5);
                page.Margin(1, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10).FontFamily(Fonts.Arial));

                page.Header().Element(ComposeHeader);
                page.Content().Element(x => ComposeContent(x, comprobante));
                page.Footer().Element(ComposeFooter);
            });
        })
        .GeneratePdf(tempFile);

        AbrirPdf(tempFile);
    }

    private static void ComposeHeader(IContainer container)
    {
        container.Column(column =>
        {
            column.Item().AlignCenter().Text("DIRECCIÓN GENERAL DE MIGRACIÓN").FontSize(14).SemiBold();
            column.Item().AlignCenter().Text("COMPROBANTE DE PAGO").FontSize(12).SemiBold();
            column.Item().PaddingBottom(5).LineHorizontal(1);
        });
    }

    private static void ComposeContent(IContainer container, Comprobante comp)
    {
        container.PaddingVertical(10).Column(column =>
        {
            column.Item().Row(row =>
            {
                row.RelativeItem().Text($"No.: {comp.NumeroComprobante}").SemiBold();
                row.RelativeItem().AlignRight().Text($"Fecha: {comp.FechaEmision:dd/MM/yyyy HH:mm}");
            });

            column.Item().Text($"Cajero: {comp.Cajero}");
            column.Item().PaddingVertical(5).LineHorizontal(1);

            column.Item().Text($"Pagador: {comp.NombresPagador} {comp.ApellidosPagador}");
            column.Item().Text($"Cédula/Pasaporte: {comp.CedulaPagador}");
            column.Item().Text($"Concepto: {comp.DescripcionServicio}");
            column.Item().Text($"Forma de pago: {comp.FormaPago}");
            
            column.Item().PaddingVertical(5).LineHorizontal(1);
            
            column.Item().AlignRight().Text($"TOTAL: {comp.MontoTotal:N2} DOP").FontSize(14).Bold();
        });
    }

    private static void ComposeFooter(IContainer container)
    {
        container.AlignCenter().Text("** Comprobante sin valor fiscal **").FontSize(9).Italic();
    }

    public static void GenerarReporteCierrePdf(ResumenCierreDto resumen, SesionCaja sesion)
    {
        var tempFile = Path.Combine(Path.GetTempPath(), $"ReporteZ_{DateTime.Now:yyyyMMdd_HHmmss}.pdf");

        Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(11).FontFamily(Fonts.Arial));

                page.Header().Element(ComposeHeaderReporte);
                page.Content().Element(x => ComposeContentReporte(x, resumen, sesion));
                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Página ");
                    x.CurrentPageNumber();
                    x.Span(" de ");
                    x.TotalPages();
                });
            });
        })
        .GeneratePdf(tempFile);

        AbrirPdf(tempFile);
    }

    private static void ComposeHeaderReporte(IContainer container)
    {
        container.Column(column =>
        {
            column.Item().AlignCenter().Text("DIRECCIÓN GENERAL DE MIGRACIÓN").FontSize(16).Bold();
            column.Item().AlignCenter().Text("REPORTE Z - CIERRE DE CAJA").FontSize(14).SemiBold();
            column.Item().PaddingBottom(10).LineHorizontal(1);
        });
    }

    private static void ComposeContentReporte(IContainer container, ResumenCierreDto resumen, SesionCaja sesion)
    {
        container.PaddingVertical(10).Column(column =>
        {
            column.Item().Row(row =>
            {
                row.RelativeItem().Text($"Cajero: {sesion.NombreCajero}");
                row.RelativeItem().AlignRight().Text($"Fecha Cierre: {sesion.FechaCierre?.ToString("dd/MM/yyyy HH:mm") ?? DateTime.Now.ToString("dd/MM/yyyy HH:mm")}");
            });

            column.Item().PaddingVertical(10).LineHorizontal(1);
            
            column.Item().Text("RESUMEN GENERAL").FontSize(12).Bold();
            column.Item().Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn();
                    columns.RelativeColumn();
                });

                table.Cell().Text("Fondo Inicial:");
                table.Cell().AlignRight().Text($"{sesion.FondoInicial:N2} DOP");

                table.Cell().Text("Total Cobrado:");
                table.Cell().AlignRight().Text($"{resumen.TotalCobrado:N2} DOP");

                table.Cell().Text("Monto Esperado:");
                table.Cell().AlignRight().Text($"{resumen.MontoEsperado:N2} DOP");

                table.Cell().Text("Monto Contado:");
                table.Cell().AlignRight().Text($"{resumen.MontoContado:N2} DOP");
                
                table.Cell().PaddingTop(5).Text("Diferencia:").Bold();
                table.Cell().PaddingTop(5).AlignRight().Text($"{resumen.Diferencia:N2} DOP")
                     .Bold().FontColor(resumen.Diferencia >= 0 ? Colors.Black : Colors.Red.Darken2);
            });

            column.Item().PaddingVertical(10).LineHorizontal(1);

            var pagosExitosos = sesion.Pagos.Where(p => p.Estado == CajaDGM.Domain.Enums.EstadoPago.Pagado).ToList();

            column.Item().Text("DESGLOSE POR SERVICIO").FontSize(12).Bold();
            column.Item().PaddingTop(5).Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn(3);
                    columns.RelativeColumn(1);
                    columns.RelativeColumn(2);
                });

                table.Header(header =>
                {
                    header.Cell().BorderBottom(1).PaddingBottom(2).Text("Servicio").SemiBold();
                    header.Cell().BorderBottom(1).PaddingBottom(2).AlignRight().Text("Cant.").SemiBold();
                    header.Cell().BorderBottom(1).PaddingBottom(2).AlignRight().Text("Total").SemiBold();
                });

                var agrupados = pagosExitosos.GroupBy(p => p.TipoServicio).ToList();
                foreach (var grupo in agrupados)
                {
                    table.Cell().Text(grupo.Key.ToString());
                    table.Cell().AlignRight().Text(grupo.Count().ToString());
                    table.Cell().AlignRight().Text($"{grupo.Sum(p => p.MontoTotal):N2}");
                }
            });

            column.Item().PaddingVertical(10).LineHorizontal(1);

            column.Item().Text("DESGLOSE POR FORMA DE PAGO").FontSize(12).Bold();
            column.Item().PaddingTop(5).Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn(3);
                    columns.RelativeColumn(1);
                    columns.RelativeColumn(2);
                });

                table.Header(header =>
                {
                    header.Cell().BorderBottom(1).PaddingBottom(2).Text("Forma Pago").SemiBold();
                    header.Cell().BorderBottom(1).PaddingBottom(2).AlignRight().Text("Cant.").SemiBold();
                    header.Cell().BorderBottom(1).PaddingBottom(2).AlignRight().Text("Total").SemiBold();
                });

                var agrupadosFP = pagosExitosos.GroupBy(p => p.FormaPago).ToList();
                foreach (var grupo in agrupadosFP)
                {
                    table.Cell().Text(grupo.Key.ToString());
                    table.Cell().AlignRight().Text(grupo.Count().ToString());
                    table.Cell().AlignRight().Text($"{grupo.Sum(p => p.MontoTotal):N2}");
                }
            });
        });
    }

    private static void AbrirPdf(string ruta)
    {
        try
        {
            var p = new Process
            {
                StartInfo = new ProcessStartInfo(ruta)
                {
                    UseShellExecute = true
                }
            };
            p.Start();
        }
        catch (Exception ex)
        {
            System.Windows.Forms.MessageBox.Show(
                $"Se generó el PDF en:\n{ruta}\n\nPero no se pudo abrir automáticamente: {ex.Message}",
                "PDF Generado",
                System.Windows.Forms.MessageBoxButtons.OK,
                System.Windows.Forms.MessageBoxIcon.Information);
        }
    }
}
