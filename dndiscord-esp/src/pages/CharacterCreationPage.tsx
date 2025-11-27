import { useNavigate } from '@solidjs/router';
import { useUser } from '../stores/userStore';

export default function CharacterCreationPage() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div class="bg-gray-900 text-white min-h-screen p-8">
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-4xl font-bold">Mes Personnages</h1>
          <div class="space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>

        {user() && (
          <div class="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 class="text-2xl font-bold mb-4">🛡️ Route Protégée</h2>
            <p class="text-green-400 mb-4">✓ Vous êtes connecté et autorisé à voir cette page!</p>
            <div class="space-y-2 text-gray-300">
              <p><strong>Votre ID:</strong> {user()!.id}</p>
              <p><strong>Nom d'utilisateur:</strong> {user()!.username}</p>
            </div>
          </div>
        )}

        <div class="bg-gray-800 rounded-lg p-6">
          <h3 class="text-2xl font-bold mb-4">Créer un Personnage</h3>
          <form class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Nom du personnage</label>
              <input
                type="text"
                placeholder="ex: Aragorn l'Intrépide"
                class="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Classe</label>
              <select class="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 outline-none">
                <option>Guerrier</option>
                <option>Magicien</option>
                <option>Voleur</option>
                <option>Prêtre</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Race</label>
              <select class="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 outline-none">
                <option>Humain</option>
                <option>Elfe</option>
                <option>Nain</option>
                <option>Orc</option>
              </select>
            </div>

            <button
              type="submit"
              class="w-full px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded font-semibold transition"
            >
              Créer le Personnage
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
