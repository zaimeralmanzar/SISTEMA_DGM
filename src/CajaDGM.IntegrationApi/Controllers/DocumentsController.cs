using Microsoft.AspNetCore.Mvc;

namespace CajaDGM.IntegrationApi.Controllers;

[Route("api/v1/documents")]
public class DocumentsController : ProxyControllerBase
{
    public DocumentsController(IHttpClientFactory httpClientFactory) : base(httpClientFactory) { }

    [HttpGet("verify/{code}")]
    public Task<IActionResult> Verify(string code) => ProxyGetAsync($"/core/v1/documentos/verificar/{code}");
}
