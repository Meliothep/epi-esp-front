import { createSignal, createContext, useContext, JSX } from 'solid-js';
import { GameBoard, GameEntity, GameRoomState, Campaign } from '../types';

interface GameStoreContextType {
  // Board state
  gameBoard: () => GameBoard | null;
  setGameBoard: (board: GameBoard | null) => void;
  
  // Campaign state
  campaign: () => Campaign | null;
  setCampaign: (campaign: Campaign | null) => void;
  
  // Room state
  roomState: () => GameRoomState | null;
  setRoomState: (state: GameRoomState | null) => void;
  
  // Selected entity
  selectedEntityId: () => string | null;
  setSelectedEntityId: (id: string | null) => void;
  
  // Game entities
  entities: () => GameEntity[];
  setEntities: (entities: GameEntity[]) => void;
  updateEntity: (id: string, updates: Partial<GameEntity>) => void;
  addEntity: (entity: GameEntity) => void;
  removeEntity: (id: string) => void;
  
  // Game state
  isGameActive: () => boolean;
  setIsGameActive: (active: boolean) => void;
  
  // Camera
  cameraPosition: () => { x: number; y: number; z: number };
  setCameraPosition: (pos: { x: number; y: number; z: number }) => void;
}

const initialGameStore: GameStoreContextType = {
  gameBoard: () => null,
  setGameBoard: () => {},
  campaign: () => null,
  setCampaign: () => {},
  roomState: () => null,
  setRoomState: () => {},
  selectedEntityId: () => null,
  setSelectedEntityId: () => {},
  entities: () => [],
  setEntities: () => {},
  updateEntity: () => {},
  addEntity: () => {},
  removeEntity: () => {},
  isGameActive: () => false,
  setIsGameActive: () => {},
  cameraPosition: () => ({ x: 0, y: 10, z: 10 }),
  setCameraPosition: () => {},
};

const GameStoreContext = createContext<GameStoreContextType>(initialGameStore);

type ProviderProps = { children: JSX.Element };

export const GameStoreProvider = (props: ProviderProps): JSX.Element => {
  const [gameBoard, setGameBoard] = createSignal<GameBoard | null>(null);
  const [campaign, setCampaign] = createSignal<Campaign | null>(null);
  const [roomState, setRoomState] = createSignal<GameRoomState | null>(null);
  const [selectedEntityId, setSelectedEntityId] = createSignal<string | null>(null);
  const [entities, setEntities] = createSignal<GameEntity[]>([]);
  const [isGameActive, setIsGameActive] = createSignal<boolean>(false);
  const [cameraPosition, setCameraPosition] = createSignal({ x: 0, y: 10, z: 10 });

  const updateEntity = (id: string, updates: Partial<GameEntity>) => {
    setEntities((prev) =>
      prev.map((entity) => (entity.id === id ? { ...entity, ...updates } : entity))
    );
  };

  const addEntity = (entity: GameEntity) => {
    setEntities((prev) => [...prev, entity]);
  };

  const removeEntity = (id: string) => {
    setEntities((prev) => prev.filter((entity) => entity.id !== id));
  };

  // Sauvegarder le board state dans localStorage quand il change
  // (optionnel, pour la persistance)
  if (typeof window !== 'undefined') {
    const saveState = () => {
      if (gameBoard()) {
        localStorage.setItem('gameBoard', JSON.stringify(gameBoard()));
      }
    };
    
    // Sauvegarder tous les 5 secondes si en jeu
    setInterval(() => {
      if (isGameActive()) {
        saveState();
      }
    }, 5000);
  }

  const value: GameStoreContextType = {
    gameBoard,
    setGameBoard,
    campaign,
    setCampaign,
    roomState,
    setRoomState,
    selectedEntityId,
    setSelectedEntityId,
    entities,
    setEntities,
    updateEntity,
    addEntity,
    removeEntity,
    isGameActive,
    setIsGameActive,
    cameraPosition,
    setCameraPosition,
  };

  return (GameStoreContext.Provider as any)({ value, children: props.children });
};

export const useGameStore = () => {
  const context = useContext(GameStoreContext);
  if (!context) {
    throw new Error('useGameStore must be used within a GameStoreProvider');
  }
  return context;
};
