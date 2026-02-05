
export enum Rarity {
  COMMON = 'Common',
  RARE = 'Rare',
  LEGENDARY = 'Legendary'
}

export interface Seed {
  id: string;
  name: string;
  rarity: Rarity;
  growthTime: number; // in seconds
  baseValue: number;
  color: string;
  secondaryColor?: string;
  gradientColors?: string[];
  glowColor: string;
  hashCoinPrice?: number;
}

export interface Offer {
  id: string;
  npcId: string;
  itemId: string;
  quantity: number;
  price: number;
  currency: 'coins' | 'hashCoins';
  reputationAward: number;
}

export interface LuxuryItem {
  id: string;
  name: string;
  category: 'cape' | 'jewelry' | 'luxury' | 'hud_theme';
  price: number;
  currency: 'coins' | 'hashCoins';
  icon: string;
  description: string;
  style?: {
    bg: string;
    border: string;
    text: string;
    accent: string;
  };
}

export interface Player {
  gender: 'male' | 'female';
  coins: number;
  hashCoins: number;
  level: number;
  inventory: Record<string, number>;
  reputation: Record<string, number>;
  unlockedRarities: Rarity[]; 
  ownedLuxuryItems: string[];
  activeCosmetics: Record<'cape' | 'jewelry' | 'luxury' | 'hud_theme', string | null>;
}

export interface Plot {
  id: number;
  type: Rarity;
  seedId: string | null;
  plantedAt: number | null;
  isWatered: boolean;
  isPruned: boolean;
  isUnlocked: boolean;
  isFertilized: boolean;
  capacity: number; 
}

export interface NPC {
  id: string;
  name: string;
  avatar: string;
  dialogue: string;
  demand: string[];
  multiplier: number;
  rarityRequired: Rarity | null;
}
