using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using UpscMentorship.Api.Extensions;
using UpscMentorship.Application.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Secrets live in appsettings.Secrets.json (git-ignored) or environment variables.
builder.Configuration.AddJsonFile("appsettings.Secrets.json", optional: true, reloadOnChange: false);
builder.Configuration.AddEnvironmentVariables();

// Fail fast with a clear message instead of returning 500 on every request.
// On Render: Environment → add e.g. ConnectionStrings__DefaultConnection, JwtSettings__SecretKey.
var missingConfig = new[] { "ConnectionStrings:DefaultConnection", "JwtSettings:SecretKey" }
    .Where(k => string.IsNullOrWhiteSpace(builder.Configuration[k])).ToArray();
if (missingConfig.Length > 0)
    throw new InvalidOperationException(
        $"Missing required configuration: {string.Join(", ", missingConfig)}. " +
        "Set them as environment variables (replace ':' with '__') or in appsettings.Secrets.json.");

// Add Core and Feature Layers Services
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// Add API Specific Infrastructures
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddCorsPolicy(builder.Configuration);
builder.Services.AddApiRateLimiter();

builder.Services.AddControllers();

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "UPSC Mentorship API",
        Version = "v1"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {your JWT token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Behind Render/Vercel proxies: trust X-Forwarded-For so rate limiting & logs see the real client IP.
builder.Services.Configure<Microsoft.AspNetCore.Builder.ForwardedHeadersOptions>(o =>
{
    o.ForwardedHeaders = Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedFor | Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedProto;
    o.ForwardLimit = 1;      // only the proxy directly in front of us
    o.KnownNetworks.Clear();  // Render proxy IPs are dynamic
    o.KnownProxies.Clear();
});

var app = builder.Build();
app.UseForwardedHeaders();

// Database Migration (disable with RunMigrationsOnStartup=false to speed up cold starts)
if (app.Configuration.GetValue("RunMigrationsOnStartup", true))
using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = scope.ServiceProvider
            .GetRequiredService<UpscMentorship.Infrastructure.Persistence.AppDbContext>();

        await context.Database.MigrateAsync();
        await UpscMentorship.Infrastructure.Persistence.BookSeed.SeedAsync(context);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Migration Error: {ex.Message}");
    }
}

// Swagger ON for Production also
app.UseSwagger();

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "UPSC Mentorship API V1");
    c.RoutePrefix = "swagger";
});

// TEMPORARILY DISABLED FOR SMARTERASP
// app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

// After CORS so error responses still carry CORS headers (browser shows the real error, not "Failed to fetch").
app.UseMiddleware<UpscMentorship.Api.Middleware.ExceptionMiddleware>();

app.UseRateLimiter();

app.UseAuthentication();

app.UseAuthorization();

// Lightweight warm-up endpoint: frontend pings this so the server is awake before login/signup.
app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));

app.MapControllers();

app.Run();