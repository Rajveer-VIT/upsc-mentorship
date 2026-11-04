using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using UpscMentorship.Api.Extensions;
using UpscMentorship.Application.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Secrets live in appsettings.Secrets.json (git-ignored) or environment variables.
builder.Configuration.AddJsonFile("appsettings.Secrets.json", optional: true, reloadOnChange: false);
builder.Configuration.AddEnvironmentVariables();

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

var app = builder.Build();

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

app.UseRateLimiter();

app.UseAuthentication();

app.UseAuthorization();

// Lightweight warm-up endpoint: frontend pings this so the server is awake before login/signup.
app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));

app.MapControllers().RequireRateLimiting("fixed");

app.Run();