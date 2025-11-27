// Character types
export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  weight?: number;
  description?: string;
}

export interface Character {
  id: string;
  name: string;
  class: string;
  race: string;
  level: number;
  experience: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  armor: number;
  stats: CharacterStats;
  skills: Skill[];
  inventory: InventoryItem[];
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCharacterRequest {
  name: string;
  class: string;
  race: string;
  stats: CharacterStats;
}

export interface UpdateCharacterRequest {
  name?: string;
  level?: number;
  health?: number;
  mana?: number;
  skills?: Skill[];
  inventory?: InventoryItem[];
}
