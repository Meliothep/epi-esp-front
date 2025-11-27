using System.Text.Json.Serialization;
using DNDiscord.Backend.Models;

namespace DNDiscord.Backend.Services;

public interface IDiscordAuthService
{
    Task<DiscordUserData?> GetUserDataAsync(string accessToken);
    Task<string?> ExchangeCodeForTokenAsync(string code);
}

public class DiscordAuthService : IDiscordAuthService
{
    private readonly HttpClient _httpClient;
    private readonly string _clientId;
    private readonly string _clientSecret;
    private readonly string _redirectUri;
    private readonly ILogger<DiscordAuthService> _logger;

    public DiscordAuthService(HttpClient httpClient, IConfiguration configuration, ILogger<DiscordAuthService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        _clientId = configuration["Discord:ClientId"] ?? throw new InvalidOperationException("Discord:ClientId not configured");
        _clientSecret = configuration["Discord:ClientSecret"] ?? throw new InvalidOperationException("Discord:ClientSecret not configured");
        _redirectUri = configuration["Discord:RedirectUri"] ?? throw new InvalidOperationException("Discord:RedirectUri not configured");
    }

    public async Task<string?> ExchangeCodeForTokenAsync(string code)
    {
        try
        {
            _logger.LogInformation($"[DISCORD_AUTH] Starting code exchange with code: {code.Substring(0, Math.Min(10, code.Length))}...");

            var request = new HttpRequestMessage(HttpMethod.Post, "https://discord.com/api/oauth2/token");
            
            var content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "client_id", _clientId },
                { "client_secret", _clientSecret },
                { "grant_type", "authorization_code" },
                { "code", code },
                { "redirect_uri", _redirectUri },
                { "scope", "identify email guilds" },
            });

            request.Content = content;
            _logger.LogInformation($"[DISCORD_AUTH] Sending request to Discord OAuth token endpoint");
            
            var response = await _httpClient.SendAsync(request);

            _logger.LogInformation($"[DISCORD_AUTH] Discord responded with status: {response.StatusCode}");

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError($"[DISCORD_AUTH] Token exchange failed: {response.StatusCode} - {errorContent}");
                return null;
            }

            var responseString = await response.Content.ReadAsStringAsync();
            _logger.LogInformation($"[DISCORD_AUTH] Raw Discord response: {responseString}");
            
            var oauthResponse = System.Text.Json.JsonSerializer.Deserialize<DiscordOAuthTokenResponse>(responseString);

            if (oauthResponse?.AccessToken == null)
            {
                _logger.LogError($"[DISCORD_AUTH] Failed to extract access token from response");
                return null;
            }

            _logger.LogInformation($"[DISCORD_AUTH] Successfully extracted access token: {oauthResponse.AccessToken.Substring(0, 20)}...");
            return oauthResponse.AccessToken;
        }
        catch (Exception ex)
        {
            _logger.LogError($"[DISCORD_AUTH] Exception in ExchangeCodeForTokenAsync: {ex.Message}\n{ex.StackTrace}");
            return null;
        }
    }

    public async Task<DiscordUserData?> GetUserDataAsync(string accessToken)
    {
        try
        {
            _logger.LogInformation($"[DISCORD_AUTH] Fetching user data with token: {accessToken.Substring(0, 20)}...");

            var request = new HttpRequestMessage(HttpMethod.Get, "https://discord.com/api/users/@me");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

            _logger.LogInformation($"[DISCORD_AUTH] Sending request to Discord /users/@me endpoint");
            var response = await _httpClient.SendAsync(request);

            _logger.LogInformation($"[DISCORD_AUTH] Discord responded with status: {response.StatusCode}");

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError($"[DISCORD_AUTH] User data fetch failed: {response.StatusCode} - {errorContent}");
                return null;
            }

            var responseString = await response.Content.ReadAsStringAsync();
            _logger.LogInformation($"[DISCORD_AUTH] Raw Discord user response: {responseString}");
            
            var userData = System.Text.Json.JsonSerializer.Deserialize<DiscordUserData>(responseString);

            if (userData == null)
            {
                _logger.LogError($"[DISCORD_AUTH] Failed to deserialize user data from response");
                return null;
            }

            _logger.LogInformation($"[DISCORD_AUTH] Successfully deserialized user: Id={userData.Id}, Username={userData.Username}");
            return userData;
        }
        catch (Exception ex)
        {
            _logger.LogError($"[DISCORD_AUTH] Exception in GetUserDataAsync: {ex.Message}\n{ex.StackTrace}");
            return null;
        }
    }
}

public class DiscordOAuthTokenResponse
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; } = string.Empty;

    [JsonPropertyName("token_type")]
    public string TokenType { get; set; } = string.Empty;

    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }

    [JsonPropertyName("refresh_token")]
    public string? RefreshToken { get; set; }

    [JsonPropertyName("scope")]
    public string Scope { get; set; } = string.Empty;
}
