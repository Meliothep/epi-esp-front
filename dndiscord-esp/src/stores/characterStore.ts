import { createSignal, createContext, useContext, JSX } from 'solid-js';
import { Character } from '../types';

interface CharacterContextType {
  characters: () => Character[];
  setCharacters: (characters: Character[]) => void;
  currentCharacter: () => Character | null;
  setCurrentCharacter: (character: Character | null) => void;
  addCharacter: (character: Character) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  removeCharacter: (id: string) => void;
}

const initialContext: CharacterContextType = {
  characters: () => [],
  setCharacters: () => {},
  currentCharacter: () => null,
  setCurrentCharacter: () => {},
  addCharacter: () => {},
  updateCharacter: () => {},
  removeCharacter: () => {},
};

const CharacterContext = createContext<CharacterContextType>(initialContext);

type ProviderProps = { children: JSX.Element };

export const CharacterProvider = (props: ProviderProps): JSX.Element => {
  const [characters, setCharacters] = createSignal<Character[]>([]);
  const [currentCharacter, setCurrentCharacter] = createSignal<Character | null>(null);

  const addCharacter = (character: Character) => {
    const updated = [...characters(), character];
    setCharacters(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('characters', JSON.stringify(updated));
    }
  };

  const updateCharacter = (id: string, updates: Partial<Character>) => {
    const updated = characters().map(char =>
      char.id === id ? { ...char, ...updates } : char
    );
    setCharacters(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('characters', JSON.stringify(updated));
    }
  };

  const removeCharacter = (id: string) => {
    const filtered = characters().filter(char => char.id !== id);
    setCharacters(filtered);
    if (typeof window !== 'undefined') {
      localStorage.setItem('characters', JSON.stringify(filtered));
    }
  };

  // Restaurer les personnages au chargement
  if (characters().length === 0 && typeof window !== 'undefined') {
    const savedCharacters = localStorage.getItem('characters');
    if (savedCharacters) {
      try {
        setCharacters(JSON.parse(savedCharacters));
      } catch (e) {
        console.error('Erreur lors de la restauration des personnages', e);
      }
    }
  }

  const value: CharacterContextType = {
    characters,
    setCharacters,
    currentCharacter,
    setCurrentCharacter,
    addCharacter,
    updateCharacter,
    removeCharacter,
  };

  return (CharacterContext.Provider as any)({ value, children: props.children });
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};
