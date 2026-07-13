using Microsoft.AspNetCore.Mvc;

namespace CajaDGM.IntegrationApi.Controllers;

[Route("api/v1/applications")]
public class ApplicationsController : ProxyControllerBase
{
    public ApplicationsController(IHttpClientFactory httpClientFactory) : base(httpClientFactory) { }

    [HttpPost]
    public Task<IActionResult> Create() => ProxyPostAsync("/core/v1/solicitudes");

    [HttpGet("mine")]
    public Task<IActionResult> GetMine() => ProxyGetAsync("/core/v1/solicitudes");

    [HttpGet("{id}")]
    public Task<IActionResult> GetById(string id) => ProxyGetAsync($"/core/v1/solicitudes/{id}");

    [HttpPost("{id}/documents")]
    public Task<IActionResult> UploadDocument(string id) => ProxyPostAsync($"/core/v1/solicitudes/{id}/documentos");
}
