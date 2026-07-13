using Microsoft.AspNetCore.Mvc;

namespace CajaDGM.IntegrationApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public abstract class ProxyControllerBase : ControllerBase
{
    protected readonly IHttpClientFactory _httpClientFactory;

    protected ProxyControllerBase(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    protected async Task<IActionResult> ProxyGetAsync(string path)
    {
        var client = _httpClientFactory.CreateClient("CoreApi");
        var response = await client.GetAsync(path);
        var content = await response.Content.ReadAsStringAsync();
        
        return new ContentResult
        {
            Content = content,
            ContentType = "application/json",
            StatusCode = (int)response.StatusCode
        };
    }

    protected async Task<IActionResult> ProxyPostAsync(string path, object? body = null)
    {
        var client = _httpClientFactory.CreateClient("CoreApi");
        var response = body != null 
            ? await client.PostAsJsonAsync(path, body)
            : await client.PostAsync(path, null);
            
        var content = await response.Content.ReadAsStringAsync();
        
        return new ContentResult
        {
            Content = content,
            ContentType = "application/json",
            StatusCode = (int)response.StatusCode
        };
    }
}
