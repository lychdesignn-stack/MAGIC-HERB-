
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
  secondaryColor?: string; // Para Raras
  gradientColors?: string[]; // Para Lendárias
  glowColor: string;
  hashCoinPrice?: number; // Preço opcional em Hash Coins
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

export interface Player {
  coins: number;
  hashCoins: number;
  level: number;
  inventory: Record<string, number>; // seedId -> quantity
  unlockedPlots: number;
  reputation: Record<string, number>; // npcId -> reputation value
  unlockedRarities: Rarity[]; // Lista de raridades já compradas para desbloquear NPCs
}

export interface Plot {
  id: number;
  seedId: string | null;
  plantedAt: number | null;
  isWatered: boolean;
  isPruned: boolean;
  isUnlocked: boolean;
  isFertilized: boolean; // Se verdadeiro, dá bônus x2
}

export interface NPC {
  id: string;
  name: string;
  avatar: string;
  dialogue: string;
  demand: string[]; // List of seed IDs they want
  multiplier: number;
  rarityRequired: Rarity | null; // Nulo significa que já começa desbloqueado
}
