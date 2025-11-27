// Game types
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface GridPosition {
  row: number;
  col: number;
}

export interface GameEntity {
  id: string;
  name: string;
  type: 'character' | 'object' | 'terrain';
  position: GridPosition;
  health?: number;
  maxHealth?: number;
  rotation?: number;
}

export interface GameBoard {
  id: string;
  campaignId: string;
  name: string;
  width: number;
  height: number;
  entities: GameEntity[];
  tileSize: number;
  backgroundUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  gameMasterId: string;
  players: string[];
  board?: GameBoard;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GameRoomState {
  campaignId: string;
  activeCharacterId?: string;
  isPlaying: boolean;
  currentTurn?: string;
  roundNumber: number;
}

export interface GameAction {
  type: 'move' | 'attack' | 'skill' | 'interact';
  characterId: string;
  targetId?: string;
  position?: GridPosition;
  data?: Record<string, unknown>;
  timestamp: Date;
}
