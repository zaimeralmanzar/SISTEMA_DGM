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

    protected async Task<IActionResult> ProxyPostAsync(string path, object body = null)
    {
        var client = _httpClientFactory.CreateClient("CoreApi");

        HttpContent bodyContent;
        if (body != null)
        {
            var json = System.Text.Json.JsonSerializer.Serialize(body);
            bodyContent = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
        }
        else
        {
            using var reader = new System.IO.StreamReader(Request.Body);
            var rawBody = await reader.ReadToEndAsync();
            bodyContent = new StringContent(rawBody, System.Text.Encoding.UTF8, "application/json");
        }

        var response = await client.PostAsync(path, bodyContent);
        var content = await response.Content.ReadAsStringAsync();

        return new ContentResult
        {
            Content = content,
            ContentType = "application/json",
            StatusCode = (int)response.StatusCode
        };
    }
}
