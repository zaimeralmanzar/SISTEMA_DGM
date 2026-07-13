using Microsoft.AspNetCore.Mvc;

namespace CajaDGM.IntegrationApi.Controllers;

[Route("api/v1/applications")]
public class ApplicationsController : ProxyControllerBase
{
    public ApplicationsController(IHttpClientFactory httpClientFactory) : base(httpClientFactory) { }

    [HttpPost]
    public Task<IActionResult> Create([FromBody] object body) => ProxyPostAsync("/core/v1/solicitudes", body);

    [HttpGet("mine")]
    public Task<IActionResult> GetMine() => ProxyGetAsync("/core/v1/solicitudes"); // Adjust if CORE has a specific 'mine' endpoint

    [HttpGet("{id}")]
    public Task<IActionResult> GetById(string id) => ProxyGetAsync($"/core/v1/solicitudes/{id}");

    [HttpPost("{id}/documents")]
    public Task<IActionResult> UploadDocument(string id, [FromBody] object body) => ProxyPostAsync($"/core/v1/solicitudes/{id}/documentos", body);
}
