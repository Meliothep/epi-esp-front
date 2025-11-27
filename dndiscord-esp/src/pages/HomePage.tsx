import { useNavigate } from '@solidjs/router';
import { useUser } from '../stores/userStore';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div class="bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 min-h-screen text-white">
      <nav class="bg-slate-900 border-b border-purple-500 p-4">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
          <h1 class="text-2xl font-bold">🐉 DNDiscord</h1>
          <div class="space-x-4">
            {user()?.isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/characters')}
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                >
                  Personnages
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition"
              >
                Connexion
              </button>
            )}
          </div>
        </div>
      </nav>

      <div class="max-w-6xl mx-auto px-4 py-16">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-bold mb-4 text-purple-300">Bienvenue sur DNDiscord</h2>
          <p class="text-xl text-gray-300">La plateforme ultime pour vos aventures D&D en ligne</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div class="bg-slate-800 rounded-lg p-6 border border-purple-500">
            <h3 class="text-2xl font-bold mb-4 text-purple-300">🎲 Jeu Interactif</h3>
            <p class="text-gray-300">Jouez des aventures D&D en temps réel avec vos amis</p>
          </div>

          <div class="bg-slate-800 rounded-lg p-6 border border-purple-500">
            <h3 class="text-2xl font-bold mb-4 text-purple-300">👥 Intégration Discord</h3>
            <p class="text-gray-300">Connectez-vous facilement avec votre compte Discord</p>
          </div>

          <div class="bg-slate-800 rounded-lg p-6 border border-purple-500">
            <h3 class="text-2xl font-bold mb-4 text-purple-300">🗺️ Cartes Dynamiques</h3>
            <p class="text-gray-300">Explorez des mondes générés en 3D</p>
          </div>
        </div>

        <div class="bg-slate-800 rounded-lg p-8 border border-purple-500 text-center">
          {user()?.isAuthenticated ? (
            <div>
              <p class="text-lg mb-4">
                Bienvenue <span class="font-bold text-purple-300">{user()!.username}</span>! 
                Vous êtes connecté.
              </p>
              <div class="space-x-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  class="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded text-lg font-semibold transition"
                >
                  Aller au Dashboard
                </button>
                <button
                  onClick={() => navigate('/characters')}
                  class="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded text-lg font-semibold transition"
                >
                  Mes Personnages
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p class="text-lg mb-6 text-gray-300">Prêt à commencer votre aventure?</p>
              <button
                onClick={() => navigate('/login')}
                class="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded text-lg font-semibold transition"
              >
                Se connecter avec Discord
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
