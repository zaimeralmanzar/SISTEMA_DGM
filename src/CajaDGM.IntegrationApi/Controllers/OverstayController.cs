using Microsoft.AspNetCore.Mvc;

namespace CajaDGM.IntegrationApi.Controllers;

[Route("api/v1/overstay")]
public class OverstayController : ProxyControllerBase
{
    public OverstayController(IHttpClientFactory httpClientFactory) : base(httpClientFactory) { }

    [HttpPost("calculate")]
    public Task<IActionResult> Calculate() => ProxyPostAsync("/core/v1/estadia/calculo");
}
