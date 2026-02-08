export enum Rarity {
  COMUM_A = 'comumA',
  COMUM_B = 'comumB',
  RARA = 'rara',
  LENDARIA = 'lendaria',
  MISTICA = 'mistica'
}

export type RiskLevel = 'low' | 'medium' | 'high';

export interface Territory {
  id: string;
  name: string;
  riskLevel: RiskLevel;
  riskChance: number;
  priceBonus: number; 
  description: string;
  color: string;
  icon: string;
  requiredRarity: Rarity;
}

export interface Title {
  id: string;
  name: string;
  requirement: string;
  price?: number;
  type: 'reputation' | 'purchasable';
}

export interface Seed {
  id: string;
  name: string;
  rarity: Rarity;
  growthTime: number; 
  baseValue: number;
  info: string;
  color: string;
  secondaryColor?: string;
  gradientColors?: string[];
  glowColor: string;
  hashCoinPrice?: number;
}

export interface ConsumableItem {
  id: string;
  name: string;
  price: number;
  currency: 'coins' | 'hashCoins';
  description: string;
  icon: string;
  effect: 'fertilize' | 'speed_up' | 'water_all';
  passiveBonusLabel: string;
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

export interface MapOffer {
  id: string;
  territoryId: string;
  itemId: string;
  quantity: number;
  price: number;
}

export interface LuxuryItem {
  id: string;
  name: string;
  category: 'cape' | 'jewelry' | 'luxury' | 'hud_theme' | 'profile_bg';
  rarity: Rarity;
  price: number;
  currency: 'coins' | 'hashCoins';
  icon: string;
  description: string;
  harvestBonus: number;
  unlockCondition?: {
    type: 'level' | 'reputation' | 'stats';
    value: number;
    npcId?: string;
    label: string;
  };
  style?: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    effectClass?: string;
  };
}

export interface Player {
  name: string;
  gender: 'male' | 'female';
  avatarId: string;
  coins: number;
  hashCoins: number;
  level: number;
  experience: number;
  totalReputation: number;
  totalReputationXP: number;
  stats: {
    totalPlanted: number;
    totalSold: number;
    totalEarned: number;
  };
  inventory: Record<string, number>;
  reputation: Record<string, number>;
  unlockedRarities: Rarity[]; 
  ownedLuxuryItems: string[];
  ownedTitles: string[];
  activeTitle: string | null;
  activeCosmetics: Record<'cape' | 'jewelry' | 'luxury' | 'hud_theme' | 'profile_bg', string | null>;
}

export interface Plot {
  id: number;
  type: Rarity;
  seedId: string | null;
  plantedAt: number | null;
  accumulatedGrowth: number; 
  isWatered: boolean;
  isLightOn: boolean;
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
  rarity?: Rarity;
}