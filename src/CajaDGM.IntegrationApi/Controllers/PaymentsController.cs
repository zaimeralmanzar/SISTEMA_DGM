using Microsoft.AspNetCore.Mvc;

namespace CajaDGM.IntegrationApi.Controllers;

[Route("api/v1/payments")]
public class PaymentsController : ProxyControllerBase
{
    public PaymentsController(IHttpClientFactory httpClientFactory) : base(httpClientFactory) { }

    [HttpGet]
    public Task<IActionResult> GetAll() => ProxyGetAsync("/core/v1/pagos");

    [HttpPost]
    public Task<IActionResult> Create([FromBody] object body) => ProxyPostAsync("/core/v1/pagos", body);
}
