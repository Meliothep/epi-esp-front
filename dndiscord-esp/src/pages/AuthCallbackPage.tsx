import { onMount, createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useUser } from '../stores/userStore';
import { discordAuthService } from '../services/discordAuth';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [error, setError] = createSignal<string | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);

  onMount(async () => {
    try {
      // Récupère l'erreur de Discord si elle existe
      const errorFromUrl = discordAuthService.getErrorFromUrl();
      if (errorFromUrl) {
        console.error('Discord error:', errorFromUrl);
        setError(`Erreur Discord: ${errorFromUrl}`);
        setIsLoading(false);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Récupère le code d'authentification
      const code = discordAuthService.getCodeFromUrl();
      
      if (!code) {
        console.error('No code found in URL');
        setError('Aucun code d\'authentification reçu');
        setIsLoading(false);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }
      
      // Échange le code contre un token
      const response = await discordAuthService.exchangeCodeForToken(code);

      if (!response.user || !response.user.id) {
        console.error('Invalid user data received:', response.user);
        setError('Les données utilisateur n\'ont pas pu être récupérées. Essaie à nouveau.');
        setIsLoading(false);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Crée l'objet utilisateur
      const userData = {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        discordId: response.user.id,
        isAuthenticated: true,
      };

      // Sauvegarde le token et l'utilisateur
      localStorage.setItem('authToken', response.token);
      login(userData);

      // Attends un peu pour que le state se mette à jour
      await new Promise(resolve => setTimeout(resolve, 100));

      setIsLoading(false);

      // Redirige vers le dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Erreur d\'authentification:', err);
      setError(`Erreur lors de l\'authentification: ${err instanceof Error ? err.message : String(err)}`);
      setIsLoading(false);
      setTimeout(() => navigate('/login'), 3000);
    }
  });

  return (
    <div class="min-h-screen w-full bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
      <div class="text-center">
        {error() ? (
          <>
            <div class="text-6xl mb-4">❌</div>
            <h1 class="text-2xl font-bold text-red-400 mb-4">{error()}</h1>
            <p class="text-purple-300">Redirection vers la connexion...</p>
          </>
        ) : isLoading() ? (
          <>
            <div class="text-6xl mb-4 animate-spin">⚙️</div>
            <h1 class="text-2xl font-bold text-purple-300">Authentification Discord...</h1>
            <p class="text-purple-200 mt-2">Veuillez patienter</p>
          </>
        ) : (
          <>
            <div class="text-6xl mb-4">✅</div>
            <h1 class="text-2xl font-bold text-green-400">Connecté!</h1>
            <p class="text-purple-200 mt-2">Redirection...</p>
          </>
        )}
      </div>
    </div>
  );
}
