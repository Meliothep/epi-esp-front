import { useUser } from '../stores/userStore';
import { useNavigate } from '@solidjs/router';

export default function DashboardPage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div class="bg-gray-900 text-white min-h-screen p-8">
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-4xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold transition"
          >
            Logout
          </button>
        </div>

        {user() && (
          <div class="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 class="text-2xl font-bold mb-4">Profil Utilisateur</h2>
            <div class="space-y-2">
              <p><strong>ID:</strong> {user()!.id}</p>
              <p><strong>Nom d'utilisateur:</strong> {user()!.username}</p>
              <p><strong>Email:</strong> {user()!.email}</p>
              <p><strong>Discord ID:</strong> {user()!.discordId}</p>
            </div>
          </div>
        )}

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-gray-800 rounded-lg p-6">
            <h3 class="text-xl font-bold mb-4">🛡️ Routes Protégées</h3>
            <p class="text-gray-300 mb-4">
              Accédez à des sections réservées aux utilisateurs connectés
            </p>
            <button
              onClick={() => navigate('/characters')}
              class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition"
            >
              Voir mes Personnages
            </button>
          </div>

          <div class="bg-gray-800 rounded-lg p-6">
            <h3 class="text-xl font-bold mb-4">🌐 Pages Publiques</h3>
            <p class="text-gray-300 mb-4">
              Retour à la page d'accueil accessible à tous
            </p>
            <button
              onClick={() => navigate('/')}
              class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded font-semibold transition"
            >
              Accueil
            </button>
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-2xl font-bold mb-4">Bienvenue sur DNDiscord!</h2>
          <p class="text-gray-300 mb-4">
            Bienvenue dans votre tableau de bord D&D. Vous êtes maintenant connecté et prêt à commencer votre aventure!
          </p>
          <div class="mt-4">
            <p class="text-sm text-gray-400">Session persistante activée - vous resterez connecté lors de votre prochaine visite.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
