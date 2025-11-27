/**
 * Service d'authentification Discord OAuth2
 */

const CLIENT_ID = (import.meta as any).env.VITE_DISCORD_CLIENT_ID;
const REDIRECT_URI = (import.meta as any).env.VITE_DISCORD_REDIRECT_URI;
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

class DiscordAuthService {
  /**
   * Génère l'URL de connexion Discord
   */
  getAuthUrl(): string {
    const scopes = ['identify', 'email', 'guilds'];
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: scopes.join(' '),
    });
    return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  }

  /**
   * Échange le code d'authentification contre un token
   */
  async exchangeCodeForToken(code: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/discord/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'échange du code');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur d\'authentification Discord:', error);
      throw error;
    }
  }

  /**
   * Récupère le code depuis l'URL après redirection
   */
  getCodeFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('code');
  }

  /**
   * Récupère le message d'erreur depuis l'URL
   */
  getErrorFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('error');
  }
}

export const discordAuthService = new DiscordAuthService();
