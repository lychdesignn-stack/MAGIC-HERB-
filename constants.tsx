
import { Seed, Rarity, NPC, LuxuryItem, Title, Territory, ConsumableItem } from './types';

export const TERRITORIES: Territory[] = [
  { 
    id: 'suburbio', 
    name: 'Subúrbio Solar', 
    riskLevel: 'low', 
    riskChance: 0.02, 
    priceBonus: 1.40, // 40% mais que o valor base
    description: 'Vizinhança tranquila. Baixo risco.', 
    color: '#22c55e',
    icon: '🏡'
  },
  { 
    id: 'centro', 
    name: 'Centro Neon', 
    riskLevel: 'medium', 
    riskChance: 0.12, 
    priceBonus: 2.10, // 110% mais que o valor base
    description: 'Movimentado. Policiamento moderado.', 
    color: '#eab308',
    icon: '🏙️'
  },
  { 
    id: 'quebrada_astral', 
    name: 'Quebrada Astral', 
    riskLevel: 'high', 
    riskChance: 0.30, 
    priceBonus: 3.20, // 220% mais que o valor base
    description: 'Risco alto, lucro astronômico.', 
    color: '#ef4444',
    icon: '🏚️'
  }
];

export const AVATAR_OPTIONS = [
  { id: 'm1', gender: 'male' as const, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Avery&backgroundColor=b6e3f4' },
  { id: 'm2', gender: 'male' as const, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Caleb&backgroundColor=c0aede' },
  { id: 'm3', gender: 'male' as const, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Jace&backgroundColor=d1fae5' },
  { id: 'f1', gender: 'female' as const, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Bella&backgroundColor=ffdfbf' },
  { id: 'f2', gender: 'female' as const, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Daisy&backgroundColor=fbcfe8' },
  { id: 'f3', gender: 'female' as const, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Maya&backgroundColor=fef3c7' },
];

export const TITLES: Title[] = [
  { id: 'novato', name: 'Fazendeiro Novato', requirement: 'Nível Inicial', type: 'reputation' },
  { id: 'truta_local', name: 'Truta da Quebrada', requirement: '100 Reputação com Snoopcat', type: 'reputation' },
  { id: 'magnata', name: 'Magnata do Hash', requirement: '10k HashCoins', price: 10000, type: 'purchasable' },
  { id: 'viajante', name: 'Mestre Dimensional', requirement: '50k HashCoins', price: 50000, type: 'purchasable' },
];

export const SEEDS: Seed[] = [
  // COMMON (15s - 60s)
  { id: 'kush_comum', name: 'Green Kush', rarity: Rarity.COMMON, growthTime: 15, baseValue: 50, info: "Resistente e ultra rápida.", color: '#22c55e', glowColor: 'rgba(34, 197, 94, 0.4)' },
  { id: 'lemon_skunk', name: 'Lemon Skunk', rarity: Rarity.COMMON, growthTime: 25, baseValue: 90, info: "Cítrica e revigorante.", color: '#facc15', glowColor: 'rgba(250, 204, 21, 0.4)' },
  { id: 'sticky_comum', name: 'Sticky Leaf', rarity: Rarity.COMMON, growthTime: 35, baseValue: 140, info: "Resinosa e pegajosa.", color: '#4ade80', glowColor: 'rgba(74, 222, 128, 0.4)' },
  { id: 'cherry_pie', name: 'Cherry Pie', rarity: Rarity.COMMON, growthTime: 45, baseValue: 200, info: "Doce e potente.", color: '#ef4444', glowColor: 'rgba(239, 68, 68, 0.4)' },
  { id: 'minty_breeze', name: 'Minty Breeze', rarity: Rarity.COMMON, growthTime: 60, baseValue: 280, info: "Refrescante como o ártico.", color: '#2dd4bf', glowColor: 'rgba(45, 212, 191, 0.4)' },
  
  // RARE (2m - 5m)
  { id: 'northern_lights', name: 'Northern Lights', rarity: Rarity.RARE, growthTime: 120, baseValue: 1200, info: "A aurora boreal no pote.", color: '#4d7c0f', secondaryColor: '#84cc16', glowColor: 'rgba(77, 124, 15, 0.6)' },
  { id: 'purple_haze', name: 'Purple Haze', rarity: Rarity.RARE, growthTime: 180, baseValue: 2100, info: "Clássica e psicodélica.", color: '#a855f7', secondaryColor: '#ec4899', glowColor: 'rgba(168, 85, 247, 0.6)' },
  { id: 'ak_47', name: 'AK-47', rarity: Rarity.RARE, growthTime: 240, baseValue: 3500, info: "Potência garantida.", color: '#713f12', secondaryColor: '#a16207', glowColor: 'rgba(113, 63, 18, 0.6)' },
  { id: 'blue_dream', name: 'Blue Dream', rarity: Rarity.RARE, growthTime: 300, baseValue: 5000, info: "Um sonho lúcido azul.", color: '#60a5fa', secondaryColor: '#1d4ed8', glowColor: 'rgba(96, 165, 250, 0.6)' },

  // LEGENDARY (7m - 10m)
  { id: 'neon_og', name: 'Neon OG', rarity: Rarity.LEGENDARY, growthTime: 420, baseValue: 18000, hashCoinPrice: 80, info: "Brilha no escuro.", color: '#f472b6', gradientColors: ['#f472b6', '#fbbf24', '#f59e0b'], glowColor: 'rgba(244, 114, 182, 0.8)' },
  { id: 'galaxy_gas', name: 'Galaxy Gas', rarity: Rarity.LEGENDARY, growthTime: 480, baseValue: 32000, hashCoinPrice: 150, info: "Combustível estelar.", color: '#312e81', gradientColors: ['#312e81', '#4338ca', '#818cf8'], glowColor: 'rgba(67, 56, 202, 0.8)' },
  { id: 'rainbow_belt', name: 'Rainbow Belt', rarity: Rarity.LEGENDARY, growthTime: 540, baseValue: 55000, hashCoinPrice: 280, info: "O espectro completo.", color: '#ff0000', gradientColors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff'], glowColor: 'rgba(255, 255, 255, 1)' },
  { id: 'moon_rock', name: 'Moon Rock', rarity: Rarity.LEGENDARY, growthTime: 600, baseValue: 85000, hashCoinPrice: 450, info: "Densidade lunar.", color: '#52525b', gradientColors: ['#52525b', '#a1a1aa', '#f8fafc'], glowColor: 'rgba(248, 250, 252, 0.8)' },

  // MYTHIC (12m - 15m)
  { id: 'sticky_icky', name: 'Sticky Icky OG', rarity: Rarity.MYTHIC, growthTime: 720, baseValue: 180000, hashCoinPrice: 1200, info: "A lendária Snoop Herb.", color: '#22c55e', gradientColors: ['#22c55e', '#84cc16', '#bef264', '#ffffff'], glowColor: 'rgba(132, 204, 22, 1)' },
  { id: 'stellar_void', name: 'Stellar Void', rarity: Rarity.MYTHIC, growthTime: 900, baseValue: 450000, hashCoinPrice: 3500, info: "O ápice do tempo-espaço.", color: '#000000', gradientColors: ['#000000', '#1e1b4b', '#4c1d95', '#ffffff'], glowColor: 'rgba(76, 29, 149, 1)' },
];

export const CONSUMABLES: ConsumableItem[] = [
  { id: 'super_fertilizer', name: 'Super Adubo', price: 1500, currency: 'coins', description: 'Aumenta colheita em +1 permanentemente.', icon: '🧪', effect: 'fertilize' },
  { id: 'growth_booster', name: 'Bio-Acelerador', price: 100, currency: 'hashCoins', description: 'Corta 50% do tempo atual.', icon: '⚡', effect: 'speed_up' },
  { id: 'mega_sprinkler', name: 'Mega Regador', price: 8000, currency: 'coins', description: 'Rega tudo instantaneamente.', icon: '🚿', effect: 'water_all' },
];

export const LUXURY_ITEMS: LuxuryItem[] = [
  { id: 'silver_ring', name: 'Anel de Prata', category: 'jewelry', price: 5000, currency: 'coins', icon: '💍', description: '+2% colheita.', harvestBonus: 0.02 },
  { id: 'shades_neon', name: 'Óculos Neon', category: 'jewelry', price: 15000, currency: 'coins', icon: '🕶️', description: '+5% colheita.', harvestBonus: 0.05 },
  { id: 'gold_crown', name: 'Coroa de Ouro', category: 'luxury', price: 3000, currency: 'hashCoins', icon: '👑', description: '+25% colheita.', harvestBonus: 0.25 },
  { id: 'cape_cosmic', name: 'Capa Estelar', category: 'cape', price: 10000, currency: 'hashCoins', icon: '🌌', description: '+50% colheita.', harvestBonus: 0.50 },
  { id: 'theme_minimal', name: 'Tema Clean', category: 'hud_theme', price: 100000, currency: 'coins', icon: '🎨', description: '+10% colheita.', harvestBonus: 0.10, style: { bg: 'bg-zinc-950/90', border: 'border-white/10', text: 'text-zinc-300', accent: 'bg-zinc-100' } },
];

export const NPCS: NPC[] = [
  { id: 'snoopcat', name: 'Snoopcat', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=snoopcat', dialogue: "Keep it green, homie.", demand: ['kush_comum', 'lemon_skunk', 'cherry_pie', 'purple_haze'], multiplier: 1.1, rarityRequired: null },
  { id: 'cky767', name: 'ICKY767', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=icky767', dialogue: "Só aceito qualidade pura.", demand: ['sticky_icky', 'northern_lights', 'blue_dream', 'ak_47'], multiplier: 1.3, rarityRequired: Rarity.RARE },
  { id: 'cpxinsane', name: 'CPXINSANE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cpx', dialogue: "O corre não para.", demand: ['neon_og', 'rainbow_belt', 'galaxy_gas'], multiplier: 1.6, rarityRequired: Rarity.LEGENDARY },
  { id: 'igoweed', name: 'IGOWEED', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=igoweed', dialogue: "Investindo no futuro galáctico.", demand: ['sticky_icky', 'moon_rock', 'stellar_void'], multiplier: 2.2, rarityRequired: Rarity.MYTHIC }
];

export const UPGRADE_LIMITS = { [Rarity.COMMON]: 3, [Rarity.RARE]: 5, [Rarity.LEGENDARY]: 8, [Rarity.MYTHIC]: 12 };
export const UPGRADE_COSTS = {
  [Rarity.COMMON]: { coins: 1500, hash: 0 },
  [Rarity.RARE]: { coins: 15000, hash: 40 },
  [Rarity.LEGENDARY]: { coins: 120000, hash: 400 },
  [Rarity.MYTHIC]: { coins: 800000, hash: 2000 }
};
