using Microsoft.AspNetCore.Mvc;

namespace CajaDGM.IntegrationApi.Controllers;

[Route("api/v1/auth")]
public class AuthController : ProxyControllerBase
{
    public AuthController(IHttpClientFactory httpClientFactory) : base(httpClientFactory) { }

    [HttpPost("login")]
    public Task<IActionResult> Login([FromBody] object body) => ProxyPostAsync("/core/v1/auth/login", body);

    [HttpPost("register")]
    public Task<IActionResult> Register([FromBody] object body) => ProxyPostAsync("/core/v1/auth/register", body);
}
