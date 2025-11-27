import { JSX, Suspense, createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useUser } from '../stores/userStore';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Utilise createEffect pour gérer la redirection
  createEffect(() => {
    if (!user()?.isAuthenticated) {
      setTimeout(() => navigate('/login'), 0);
    }
  });

  return (
    <Suspense fallback={<div class="flex items-center justify-center h-screen">Chargement...</div>}>
      {user()?.isAuthenticated ? (
        props.children
      ) : (
        <div class="flex items-center justify-center h-screen">
          <div class="text-center">
            <div class="text-6xl mb-4 animate-spin">⚙️</div>
            <h1 class="text-2xl font-bold text-purple-300">Vérification de l'authentification...</h1>
          </div>
        </div>
      )}
    </Suspense>
  );
};
