var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure the HttpClient that will connect to the CORE
builder.Services.AddHttpClient("CoreApi", client =>
{
    client.BaseAddress = new Uri("https://plum-flamingo-960651.hostingersite.com");
    client.DefaultRequestHeaders.Add("Authorization", "Bearer 3neQlzKj9czTMNPkAToJ1yUbGN38yeDtIKCqUTTfac3ee613");
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
