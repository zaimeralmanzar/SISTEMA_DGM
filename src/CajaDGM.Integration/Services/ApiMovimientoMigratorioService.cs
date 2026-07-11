using System.Net.Http.Json;
using CajaDGM.Domain.Interfaces;
using CajaDGM.Domain.Models;

namespace CajaDGM.Integration.Services;

public class ApiMovimientoMigratorioService : IMovimientoMigratorioService
{
    private readonly HttpClient _httpClient;

    public ApiMovimientoMigratorioService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task RegistrarMovimientoAsync(MovimientoMigratorio movimiento)
    {
        // 1. Obtener el persona_id real
        var resPersona = await _httpClient.GetAsync($"/core/v1/personas?documento={movimiento.CedulaPersona}&tipo=CEDULA");
        if (!resPersona.IsSuccessStatusCode)
            resPersona = await _httpClient.GetAsync($"/core/v1/personas?documento={movimiento.CedulaPersona}&tipo=PASAPORTE");

        string personaId = movimiento.CedulaPersona;
        if (resPersona.IsSuccessStatusCode)
        {
            var pData = await resPersona.Content.ReadFromJsonAsync<System.Text.Json.Nodes.JsonObject>();
            var pArray = pData?["data"]?.AsArray();
            if (pArray != null && pArray.Count > 0)
                personaId = pArray[0]?["id"]?.ToString() ?? personaId;
        }

        var request = new
        {
            persona_id = personaId,
            tipo = movimiento.TipoMovimiento.ToString().StartsWith("E") ? "E" : "S", 
            fecha_hora = movimiento.FechaHora.ToString("yyyy-MM-dd HH:mm:ss"),
            punto_control_id = 1 
        };
        var response = await _httpClient.PostAsJsonAsync("/core/v1/movimientos", request);
        
        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new Exception($"Error del CORE ({response.StatusCode}): {errorContent}");
        }
    }

    public async Task<ResultadoSobreestadia> ConsultarSobreestadiaAsync(string pasaporte, string cedula)
    {
        return new ResultadoSobreestadia();
    }
}
