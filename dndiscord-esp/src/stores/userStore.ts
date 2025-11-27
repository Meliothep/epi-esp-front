import { createSignal, createContext, useContext, JSX } from 'solid-js';

interface User {
  id: string;
  username: string;
  email: string;
  discordId?: string;
  isAuthenticated: boolean;
}

interface UserContextType {
  user: () => User | null;
  setUser: (user: User | null) => void;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: () => boolean;
  setIsLoading: (loading: boolean) => void;
}

// Créer les signaux GLOBALEMENT, en dehors du contexte
const [globalUser, setGlobalUser] = createSignal<User | null>(null);
const [globalIsLoading, setGlobalIsLoading] = createSignal<boolean>(false);
const [restored, setRestored] = createSignal(false);

// Fonctions globales
const globalLogin = (userData: User) => {
  setGlobalUser(userData);
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(userData));
  }
};

const globalLogout = () => {
  setGlobalUser(null);
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  }
};

// Restaurer l'utilisateur au démarrage
if (typeof window !== 'undefined' && !restored()) {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      const parsed = JSON.parse(savedUser) as User;
      if (parsed.id && parsed.username && parsed.isAuthenticated) {
        setGlobalUser(parsed);
      }
    } catch (e) {
      console.error('[UserStore] Error parsing saved user:', e);
    }
  }
  setRestored(true);
}

// Créer le contexte avec les signaux globaux
const UserContext = createContext<UserContextType>({
  user: globalUser,
  setUser: setGlobalUser,
  login: globalLogin,
  logout: globalLogout,
  isLoading: globalIsLoading,
  setIsLoading: setGlobalIsLoading,
});

type ProviderProps = { children: JSX.Element };

export const UserProvider = (props: ProviderProps): JSX.Element => {
  return (UserContext.Provider as any)({
    value: {
      user: globalUser,
      setUser: setGlobalUser,
      login: globalLogin,
      logout: globalLogout,
      isLoading: globalIsLoading,
      setIsLoading: setGlobalIsLoading,
    },
    children: props.children,
  });
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  return context;
};
