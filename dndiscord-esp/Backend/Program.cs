using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using DNDiscord.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Add HTTP client
builder.Services.AddHttpClient();

// Add authentication services
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IDiscordAuthService, DiscordAuthService>();

// Add JWT authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["SecretKey"] ?? "your-super-secret-key-change-this-in-production";
var key = System.Text.Encoding.UTF8.GetBytes(secretKey);

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidIssuer = "dndiscord-backend",
            ValidateAudience = true,
            ValidAudience = "dndiscord-frontend",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Log startup info
app.Lifetime.ApplicationStarted.Register(() =>
{
    Console.WriteLine("\n╔════════════════════════════════════════╗");
    Console.WriteLine("║  DNDiscord Backend - Running!          ║");
    Console.WriteLine("║  API: http://localhost:5000            ║");
    Console.WriteLine("║  Swagger: http://localhost:5000/swagger║");
    Console.WriteLine("╚════════════════════════════════════════╝\n");
});

app.Run();
