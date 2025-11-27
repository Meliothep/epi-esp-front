import { Router, Route } from '@solidjs/router';
import { Suspense, lazy } from 'solid-js';
import { UserProvider } from './stores/userStore';
import { CharacterProvider } from './stores/characterStore';
import { GameStoreProvider } from './stores/gameStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import './index.css';

// Lazy load des pages
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CharacterCreationPage = lazy(() => import('./pages/CharacterCreationPage'));
const GameBoardPage = lazy(() => import('./pages/GameBoardPage'));

export default function App() {
  return (
    <UserProvider>
      <CharacterProvider>
        <GameStoreProvider>
          <Router
            root={(props: any) => (
              <Suspense fallback={<div class="flex items-center justify-center h-screen">Chargement...</div>}>
                {props.children}
              </Suspense>
            )}
          >
          <Route path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/auth/callback" component={AuthCallbackPage} />
          
          <Route
            path="/dashboard"
            component={() => (
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            )}
          />
          
          <Route
            path="/characters"
            component={() => (
              <ProtectedRoute>
                <CharacterCreationPage />
              </ProtectedRoute>
            )}
          />
          
          <Route
            path="/game/:campaignId"
            component={() => (
              <ProtectedRoute>
                <GameBoardPage />
              </ProtectedRoute>
            )}
          />
        </Router>
        </GameStoreProvider>
      </CharacterProvider>
    </UserProvider>
  );
}
