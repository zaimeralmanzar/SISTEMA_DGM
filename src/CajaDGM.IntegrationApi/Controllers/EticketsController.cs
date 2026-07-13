using Microsoft.AspNetCore.Mvc;

namespace CajaDGM.IntegrationApi.Controllers;

[Route("api/v1/etickets")]
public class EticketsController : ProxyControllerBase
{
    public EticketsController(IHttpClientFactory httpClientFactory) : base(httpClientFactory) { }

    [HttpPost]
    public Task<IActionResult> Create() => ProxyPostAsync("/core/v1/etickets");
}
