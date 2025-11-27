using DNDiscord.Backend.Models;
using DNDiscord.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace DNDiscord.Backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IDiscordAuthService _discordAuthService;
    private readonly ITokenService _tokenService;
    private readonly ILogger<AuthController> _logger;

    // Simple in-memory user store (replace with database in production)
    private static Dictionary<string, User> Users = new();

    public AuthController(
        IDiscordAuthService discordAuthService,
        ITokenService tokenService,
        ILogger<AuthController> logger)
    {
        _discordAuthService = discordAuthService;
        _tokenService = tokenService;
        _logger = logger;
    }

    /// <summary>
    /// OAuth2 callback endpoint for Discord authentication
    /// Exchanges authorization code for access token and creates/updates user
    /// </summary>
    [HttpPost("discord/callback")]
    public async Task<ActionResult<AuthTokenResponse>> DiscordCallback([FromBody] DiscordOAuthRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Code))
            {
                _logger.LogError("Authorization code is missing");
                return BadRequest(new { error = "Authorization code is required" });
            }

            _logger.LogInformation($"[OAUTH] Received Discord authorization code: {request.Code.Substring(0, 10)}...");

            // Exchange code for Discord access token
            var discordAccessToken = await _discordAuthService.ExchangeCodeForTokenAsync(request.Code);

            if (string.IsNullOrEmpty(discordAccessToken))
            {
                _logger.LogError("[OAUTH] Failed to exchange authorization code for Discord access token");
                return BadRequest(new { error = "Failed to authenticate with Discord" });
            }

            _logger.LogInformation($"[OAUTH] Successfully exchanged code for Discord access token");

            // Get user data from Discord
            var discordUser = await _discordAuthService.GetUserDataAsync(discordAccessToken);

            if (discordUser == null)
            {
                _logger.LogError("[OAUTH] Failed to fetch user data from Discord");
                return BadRequest(new { error = "Failed to fetch Discord user data" });
            }

            _logger.LogInformation($"[OAUTH] Successfully fetched Discord user: {discordUser.Username} ({discordUser.Id})");

            // Create or update user in our system
            var user = GetOrCreateUser(discordUser);

            // Generate JWT token for frontend
            var token = _tokenService.GenerateToken(user.Id, user.Username, user.Email);

            _logger.LogInformation($"[OAUTH] Generated JWT token for user: {user.Username}");

            return Ok(new AuthTokenResponse
            {
                Token = token,
                User = user,
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"[OAUTH] Error in Discord callback: {ex.Message}\n{ex.StackTrace}");
            return StatusCode(500, new { error = "An error occurred during authentication", details = ex.Message });
        }
    }

    /// <summary>
    /// Get current authenticated user info
    /// </summary>
    [HttpGet("me")]
    public ActionResult<User> GetCurrentUser()
    {
        var userId = User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userId) || !Users.TryGetValue(userId, out var user))
            return Unauthorized(new { error = "User not found" });

        return Ok(user);
    }

    /// <summary>
    /// Simple logout endpoint (frontend just removes token from localStorage)
    /// </summary>
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // In a real app, you might want to blacklist the token or update a session
        _logger.LogInformation("User logged out");
        return Ok();
    }

    /// <summary>
    /// Helper method to get or create user from Discord data
    /// </summary>
    private User GetOrCreateUser(DiscordUserData discordUser)
    {
        if (Users.TryGetValue(discordUser.Id, out var existingUser))
        {
            // Update existing user
            existingUser.Username = discordUser.Username;
            existingUser.Email = discordUser.Email ?? existingUser.Email;
            existingUser.Avatar = discordUser.Avatar;
            return existingUser;
        }

        // Create new user
        var newUser = new User
        {
            Id = discordUser.Id,
            Username = discordUser.Username,
            Email = discordUser.Email ?? $"{discordUser.Username}@discord.local",
            DiscordId = discordUser.Id,
            Avatar = discordUser.Avatar,
            CreatedAt = DateTime.UtcNow,
        };

        Users[newUser.Id] = newUser;
        _logger.LogInformation($"Created new user: {newUser.Username}");

        return newUser;
    }
}
