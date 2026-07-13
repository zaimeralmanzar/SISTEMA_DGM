using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CajaDGM.IntegrationApi.Controllers;

[Route("api/v1/auth")]
public class AuthController : ProxyControllerBase
{
    public AuthController(IHttpClientFactory httpClientFactory) : base(httpClientFactory) { }

    [HttpPost("login")]
    public Task<IActionResult> Login() => ProxyPostAsync("/core/v1/auth/login");

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] JsonElement body)
    {
        // 1. Enviar el registro al CORE (crea el usuario web)
        var result = await ProxyPostAsync("/core/v1/auth/register", body);

        // 2. Si el registro fue exitoso (200 OK o 201 Created), creamos la Persona automáticamente
        if (result is ContentResult contentResult && contentResult.StatusCode >= 200 && contentResult.StatusCode < 300)
        {
            try
            {
                var docType = body.GetProperty("documentType").GetString()?.ToUpper() == "CEDULA" ? "CEDULA" : "PASAPORTE";
                
                var personaPayload = new
                {
                    tipo_documento = docType,
                    numero_documento = body.GetProperty("documentNumber").GetString(),
                    nombres = body.GetProperty("firstName").GetString(),
                    apellidos = body.GetProperty("lastName").GetString(),
                    nacionalidad = body.GetProperty("nationality").GetString(),
                    fecha_nacimiento = body.GetProperty("birthDate").GetString()
                };

                var client = _httpClientFactory.CreateClient("CoreApi");
                await client.PostAsJsonAsync("/core/v1/personas", personaPayload);
            }
            catch
            {
                // Ignorar error si falta algún campo o la persona ya existe
            }
        }

        return result;
    }
}
