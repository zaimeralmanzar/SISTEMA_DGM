using Microsoft.AspNetCore.Mvc;

namespace CajaDGM.IntegrationApi.Controllers;

[Route("api/v1/appointments")]
public class AppointmentsController : ProxyControllerBase
{
    public AppointmentsController(IHttpClientFactory httpClientFactory) : base(httpClientFactory) { }

    [HttpGet("availability")]
    public Task<IActionResult> GetAvailability([FromQuery] int? serviceId) 
    {
        var path = serviceId.HasValue ? $"/core/v1/citas/disponibilidad?servicio_id={serviceId}" : "/core/v1/citas/disponibilidad";
        return ProxyGetAsync(path);
    }

    [HttpPost]
    public Task<IActionResult> Schedule([FromBody] object body) => ProxyPostAsync("/core/v1/citas", body);
}
