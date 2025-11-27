import { createSignal } from 'solid-js';
import { discordAuthService } from '../services/discordAuth';

export default function LoginPage() {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Handle login logic here
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleDiscordLogin = () => {
    const authUrl = discordAuthService.getAuthUrl();
    window.location.href = authUrl;
  };

  return (
    <div class="min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center relative">
      {/* Animated background */}
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-purple-700 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style="animation-delay: 2s"></div>
      </div>

      {/* Main container */}
      <div class="relative z-10 w-full max-w-md px-4">
        {/* Decorative elements */}
        <div class="absolute -top-12 left-1/2 transform -translate-x-1/2 text-6xl">⚔️</div>
        
        {/* Login card with medieval aesthetic */}
        <div class="relative">
          {/* Card background with border */}
          <div class="absolute inset-0 bg-gradient-to-b from-purple-900 to-purple-900 rounded-2xl transform -skew-y-2 opacity-20 blur-xl"></div>
          
          <div class="relative bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 border-2 border-purple-700 rounded-2xl p-8 shadow-2xl">
            {/* Top ornament */}
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-transparent via-purple-600 to-transparent"></div>

            {/* Title */}
            <div class="text-center mb-8">
              <h1 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 mb-2 drop-shadow-lg">
                DNDiscord
              </h1>
              <p class="text-purple-200 text-sm italic font-serif">Bienvenue aventurier</p>
              <div class="h-1 w-16 mx-auto bg-gradient-to-r from-purple-600 to-purple-800 mt-3 rounded-full"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} class="space-y-5">
              {/* Email input */}
              <div class="relative">
                <label class="block text-purple-200 text-xs font-bold uppercase tracking-wider mb-2">
                  Email du Chevalier
                </label>
                <div class="relative">
                  <div class="absolute left-3 top-3 text-purple-500">📜</div>
                  <input
                    type="email"
                    value={email()}
                    onInput={(e) => setEmail(e.currentTarget.value)}
                    placeholder="your@email.com"
                    class="w-full pl-10 pr-4 py-3 bg-slate-800 border border-purple-700 text-purple-50 placeholder-purple-300 placeholder-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 font-serif"
                    required
                  />
                </div>
              </div>

              {/* Password input */}
              <div class="relative">
                <label class="block text-purple-200 text-xs font-bold uppercase tracking-wider mb-2">
                  Mot de Passe Sacré
                </label>
                <div class="relative">
                  <div class="absolute left-3 top-3 text-purple-500">🔐</div>
                  <input
                    type="password"
                    value={password()}
                    onInput={(e) => setPassword(e.currentTarget.value)}
                    placeholder="••••••••"
                    class="w-full pl-10 pr-4 py-3 bg-slate-800 border border-purple-700 text-purple-50 placeholder-purple-300 placeholder-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 font-serif"
                    required
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading()}
                class="w-full mt-6 relative group overflow-hidden rounded-lg font-bold text-white uppercase tracking-wider py-3 text-sm transition-all duration-300 disabled:opacity-75"
              >
                {/* Button background */}
                <div class="absolute inset-0 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 transition-all duration-300 group-hover:from-purple-600 group-hover:via-purple-500 group-hover:to-purple-600"></div>
                
                {/* Shine effect */}
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-pulse" style="animation: shimmer 2s infinite"></div>
                
                {/* Border glow */}
                <div class="absolute inset-0 border-2 border-purple-400 opacity-0 group-hover:opacity-100 group-hover:animate-pulse rounded-lg"></div>

                <span class="relative flex items-center justify-center gap-2">
                  {isLoading() ? (
                    <>
                      <span class="animate-spin">⚡</span>
                      Invocation...
                    </>
                  ) : (
                    <>
                      ⚔️ Entrer dans la Taverne
                    </>
                  )}
                </span>
              </button>

              {/* Divider */}
              <div class="flex items-center gap-3 my-6">
                <div class="flex-1 h-px bg-gradient-to-r from-purple-700 to-transparent"></div>
                <span class="text-purple-400 text-xs">ou</span>
                <div class="flex-1 h-px bg-gradient-to-l from-purple-700 to-transparent"></div>
              </div>

              {/* Discord Login Button */}
              <button
                type="button"
                onClick={handleDiscordLogin}
                class="w-full relative group overflow-hidden rounded-lg font-bold text-white uppercase tracking-wider py-3 text-sm transition-all duration-300"
              >
                {/* Button background - Discord Blue */}
                <div class="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 transition-all duration-300 group-hover:from-blue-500 group-hover:via-indigo-500 group-hover:to-blue-500"></div>
                
                {/* Shine effect */}
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-pulse"></div>

                <span class="relative flex items-center justify-center gap-2">
                  🎮 Se connecter avec Discord
                </span>
              </button>

              {/* Register link */}
              <p class="text-center text-purple-200 text-sm mt-6">
                Pas encore de compte?{' '}
                <a href="#" class="text-purple-400 hover:text-purple-300 font-bold transition-colors duration-200">
                  Créer un Personnage
                </a>
              </p>
            </form>

            {/* Bottom ornament */}
            <div class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-transparent via-purple-600 to-transparent"></div>
          </div>
        </div>

        {/* Bottom decorative text */}
        <div class="text-center mt-8 text-purple-400 text-xs italic font-serif opacity-70">
          ✦ Bienvenue dans le Monde des Dragons ✦
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
