using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace DNDiscord.Backend.Services;

public interface ITokenService
{
    string GenerateToken(string userId, string username, string email);
    ClaimsPrincipal? ValidateToken(string token);
}

public class TokenService : ITokenService
{
    private readonly string _secretKey;
    private readonly int _expirationMinutes;

    public TokenService(IConfiguration configuration)
    {
        _secretKey = configuration["Jwt:SecretKey"] ?? "your-super-secret-key-change-this-in-production";
        _expirationMinutes = int.Parse(configuration["Jwt:ExpirationMinutes"] ?? "10080"); // 7 days
    }

    public string GenerateToken(string userId, string username, string email)
    {
        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim("sub", userId),
            new Claim("username", username),
            new Claim("email", email),
            new Claim(ClaimTypes.NameIdentifier, userId),
        };

        var token = new JwtSecurityToken(
            issuer: "dndiscord-backend",
            audience: "dndiscord-frontend",
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_expirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public ClaimsPrincipal? ValidateToken(string token)
    {
        try
        {
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_secretKey));
            var tokenHandler = new JwtSecurityTokenHandler();

            var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = true,
                ValidIssuer = "dndiscord-backend",
                ValidateAudience = true,
                ValidAudience = "dndiscord-frontend",
                ValidateLifetime = true,
            }, out SecurityToken validatedToken);

            return principal;
        }
        catch
        {
            return null;
        }
    }
}
