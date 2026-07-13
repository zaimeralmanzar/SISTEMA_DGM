using Microsoft.AspNetCore.Mvc;

namespace CajaDGM.IntegrationApi.Controllers;

[Route("api/v1/services")]
public class ServicesController : ProxyControllerBase
{
    public ServicesController(IHttpClientFactory httpClientFactory) : base(httpClientFactory) { }

    [HttpGet]
    public Task<IActionResult> GetAll() => ProxyGetAsync("/core/v1/servicios");

    [HttpGet("{id}")]
    public Task<IActionResult> GetById(int id) => ProxyGetAsync($"/core/v1/servicios/{id}");
}
