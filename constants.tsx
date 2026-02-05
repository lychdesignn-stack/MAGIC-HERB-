
import { Seed, Rarity, NPC, LuxuryItem, Title } from './types';

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
  { id: 'truta_local', name: 'Truta da Quebrada', requirement: '50 Reputação com Snoopcat', type: 'reputation' },
  { id: 'alquimista', name: 'Alquimista Astral', requirement: 'Desbloquear Raro', type: 'reputation' },
  { id: 'magnata', name: 'Magnata do Hash', requirement: '100 HashCoins', price: 100, type: 'purchasable' },
  { id: 'deus_verde', name: 'Deus da Colheita', requirement: '1000 Reputação Total', type: 'reputation' },
  { id: 'viajante', name: 'Viajante Dimensional', requirement: 'Comprar com 500 HashCoins', price: 500, type: 'purchasable' },
  { id: 'imperador', name: 'Imperador Galáctico', requirement: 'Item de Luxo Supremo', price: 2000, type: 'purchasable' },
];

export const SEEDS: Seed[] = [
  { id: 'kush_comum', name: 'Green Kush', rarity: Rarity.COMMON, growthTime: 15, baseValue: 12, color: '#22c55e', glowColor: 'rgba(34, 197, 94, 0.4)' },
  { id: 'lemon_skunk', name: 'Lemon Skunk', rarity: Rarity.COMMON, growthTime: 25, baseValue: 24, color: '#facc15', glowColor: 'rgba(250, 204, 21, 0.4)' },
  { id: 'blueberry_bliss', name: 'Blueberry Bliss', rarity: Rarity.COMMON, growthTime: 40, baseValue: 50, color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.4)' },
  { id: 'minty_breeze', name: 'Minty Breeze', rarity: Rarity.COMMON, growthTime: 30, baseValue: 35, color: '#2dd4bf', glowColor: 'rgba(45, 212, 191, 0.4)' },
  { id: 'red_fire', name: 'Red Fire', rarity: Rarity.COMMON, growthTime: 45, baseValue: 60, color: '#ef4444', glowColor: 'rgba(239, 68, 68, 0.4)' },
  
  { id: 'purple_haze', name: 'Purple Haze', rarity: Rarity.RARE, growthTime: 90, baseValue: 300, color: '#a855f7', secondaryColor: '#ec4899', glowColor: 'rgba(168, 85, 247, 0.6)' },
  { id: 'white_widow', name: 'White Widow', rarity: Rarity.RARE, growthTime: 180, baseValue: 1800, color: '#cbd5e1', secondaryColor: '#f8fafc', glowColor: 'rgba(203, 213, 225, 0.6)' },
  { id: 'golden_goat', name: 'Golden Goat', rarity: Rarity.RARE, growthTime: 120, baseValue: 800, color: '#fbbf24', secondaryColor: '#f59e0b', glowColor: 'rgba(251, 191, 36, 0.6)' },
  { id: 'blue_dream', name: 'Blue Dream', rarity: Rarity.RARE, growthTime: 150, baseValue: 1200, color: '#60a5fa', secondaryColor: '#1d4ed8', glowColor: 'rgba(96, 165, 250, 0.6)' },
  { id: 'strawberry_cough', name: 'Strawberry Cough', rarity: Rarity.RARE, growthTime: 200, baseValue: 2200, color: '#fb7185', secondaryColor: '#e11d48', glowColor: 'rgba(251, 113, 133, 0.6)' },

  { id: 'neon_og', name: 'Neon OG', rarity: Rarity.LEGENDARY, growthTime: 300, baseValue: 8000, hashCoinPrice: 5, color: '#f472b6', gradientColors: ['#f472b6', '#fbbf24', '#f59e0b'], glowColor: 'rgba(244, 114, 182, 0.8)' },
  { id: 'cosmic_afghan', name: 'Cosmic Afghan', rarity: Rarity.LEGENDARY, growthTime: 900, baseValue: 120000, hashCoinPrice: 200, color: '#8b5cf6', gradientColors: ['#8b5cf6', '#06b6d4', '#22d3ee', '#ffffff'], glowColor: 'rgba(139, 92, 246, 1)' },
  { id: 'supernova_kush', name: 'Supernova Kush', rarity: Rarity.LEGENDARY, growthTime: 600, baseValue: 45000, hashCoinPrice: 40, color: '#312e81', gradientColors: ['#312e81', '#4338ca', '#818cf8', '#c7d2fe'], glowColor: 'rgba(67, 56, 202, 0.9)' },
  { id: 'phoenix_flame', name: 'Phoenix Flame', rarity: Rarity.LEGENDARY, growthTime: 750, baseValue: 75000, hashCoinPrice: 80, color: '#b91c1c', gradientColors: ['#b91c1c', '#ea580c', '#facc15', '#ffffff'], glowColor: 'rgba(234, 88, 12, 1)' },
  { id: 'galactic_frost', name: 'Galactic Frost', rarity: Rarity.LEGENDARY, growthTime: 1200, baseValue: 250000, hashCoinPrice: 350, color: '#94a3b8', gradientColors: ['#94a3b8', '#e2e8f0', '#7dd3fc', '#ffffff'], glowColor: 'rgba(148, 163, 184, 1)' },
  { id: 'chrono_root', name: 'Chrono Root', rarity: Rarity.LEGENDARY, growthTime: 1500, baseValue: 500000, hashCoinPrice: 600, color: '#166534', gradientColors: ['#166534', '#a3e635', '#fde047', '#4ade80'], glowColor: 'rgba(22, 101, 52, 1)' },
  { id: 'rainbow_belt', name: 'Rainbow Belt', rarity: Rarity.LEGENDARY, growthTime: 1800, baseValue: 1000000, hashCoinPrice: 1000, color: '#ff0000', gradientColors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee'], glowColor: 'rgba(255, 255, 255, 1)' }
];

export const NPCS: NPC[] = [
  { id: 'snoopcat', name: 'Snoopcat', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=snoopcat&backgroundColor=b6e3f4', dialogue: "Drop it like it's hot, man.", demand: ['kush_comum', 'purple_haze'], multiplier: 1.2, rarityRequired: null },
  { id: 'dr_greenthumb', name: 'Dr. Greenthumb', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=scientist&backgroundColor=d1fae5', dialogue: "A ciência do cultivo é sagrada.", demand: ['minty_breeze', 'lemon_skunk'], multiplier: 1.5, rarityRequired: null },
  { id: 'stellar_selene', name: 'Stellar Selene', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=selene&backgroundColor=fdf2f8', dialogue: "As estrelas me guiaram até aqui.", demand: ['blue_dream', 'golden_goat'], multiplier: 2.2, rarityRequired: Rarity.RARE },
  { id: 'madame_nebula', name: 'Madame Nebula', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nebula&backgroundColor=fae8ff', dialogue: "Eu já previ nossa negociação.", demand: ['neon_og', 'purple_haze'], multiplier: 3.5, rarityRequired: Rarity.RARE },
  { id: 'baron_bong', name: 'Barão Bong', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=baron&backgroundColor=fef3c7', dialogue: "Investimentos de alto nível apenas.", demand: ['supernova_kush', 'galactic_frost'], multiplier: 5.0, rarityRequired: Rarity.LEGENDARY },
  { id: 'xenon', name: 'Xenon X', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=xenon&backgroundColor=f5f3ff', dialogue: "Matéria orgânica superior detectada.", demand: ['cosmic_afghan'], multiplier: 6.5, rarityRequired: Rarity.LEGENDARY },
  { id: 'misty_ai', name: 'Misty AI', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=misty&backgroundColor=ccfbf1', dialogue: "Otimizando lucros galácticos.", demand: ['rainbow_belt'], multiplier: 8.0, rarityRequired: Rarity.LEGENDARY }
];

export const UPGRADE_LIMITS = { [Rarity.COMMON]: 2, [Rarity.RARE]: 4, [Rarity.LEGENDARY]: 6 };
export const UPGRADE_COSTS = {
  [Rarity.COMMON]: { coins: 800, hash: 0 },
  [Rarity.RARE]: { coins: 8000, hash: 10 },
  [Rarity.LEGENDARY]: { coins: 80000, hash: 100 }
};

export const LUXURY_ITEMS: LuxuryItem[] = [
  // ITENS / ACESSÓRIOS (MUITO BARATOS)
  { id: 'silver_ring', name: 'Anel de Prata Astral', category: 'jewelry', price: 150, currency: 'coins', icon: '💍', description: 'Simples, mas brilha: +1% colheita.', harvestBonus: 0.01 },
  { id: 'shades_neon', name: 'Óculos Psicodélicos', category: 'jewelry', price: 420, currency: 'coins', icon: '🕶️', description: 'Visão além: +2% colheita.', harvestBonus: 0.02 },
  { id: 'neon_band', name: 'Bracelete Cibernético', category: 'jewelry', price: 1500, currency: 'coins', icon: '⌚', description: 'Estilo tech: +4% colheita.', harvestBonus: 0.04 },
  { id: 'straw_hat', name: 'Chapéu de Palha Astral', category: 'luxury', price: 4500, currency: 'coins', icon: '👒', description: 'Tradição: +6% colheita.', harvestBonus: 0.06 },
  
  // ITENS / ACESSÓRIOS (ELITE)
  { id: 'neon_cape', name: 'Capa Neon Pulsante', category: 'cape', price: 50000, currency: 'coins', icon: '🧥', description: 'Estilo e +12% de colheita.', harvestBonus: 0.12 },
  { id: 'gold_crown', name: 'Coroa Imperial', category: 'luxury', price: 450, currency: 'hashCoins', icon: '👑', description: 'Poder real: +30% de colheita.', harvestBonus: 0.30 },
  { id: 'diamond_chain', name: 'Ice Galáctico', category: 'jewelry', price: 120000, currency: 'coins', icon: '💎', description: 'Puro brilho e +18% de colheita.', harvestBonus: 0.18 },

  // TEMAS (MUITO BARATOS)
  { id: 'theme_basic', name: 'Tema Cinza', category: 'hud_theme', price: 100, currency: 'coins', icon: '🎨', description: 'Básico: +1% colheita.', harvestBonus: 0.01, style: { bg: 'bg-zinc-800/90', border: 'border-white/5', text: 'text-zinc-500', accent: 'bg-zinc-600' } },
  { id: 'theme_minimal', name: 'Tema Minimalista', category: 'hud_theme', price: 800, currency: 'coins', icon: '🎨', description: 'Menos é mais: +2% colheita.', harvestBonus: 0.02, style: { bg: 'bg-zinc-950/90', border: 'border-white/10', text: 'text-zinc-300', accent: 'bg-zinc-100' } },
  { id: 'theme_eco', name: 'Tema Eco-Cultivo', category: 'hud_theme', price: 1200, currency: 'coins', icon: '🎨', description: 'Simples e eficiente: +3% colheita.', harvestBonus: 0.03, style: { bg: 'bg-stone-900/90', border: 'border-green-800/40', text: 'text-green-600', accent: 'bg-green-700' } },
  { id: 'theme_solar', name: 'Tema Solar', category: 'hud_theme', price: 2800, currency: 'coins', icon: '🎨', description: 'Brilho do sol: +5% colheita.', harvestBonus: 0.05, style: { bg: 'bg-orange-950/90', border: 'border-amber-500/40', text: 'text-amber-500', accent: 'bg-amber-600' } },
  { id: 'theme_starlight', name: 'Noite Estrelada', category: 'hud_theme', price: 5000, currency: 'coins', icon: '🎨', description: 'Puro brilho: +8% colheita.', harvestBonus: 0.08, style: { bg: 'bg-slate-950/90', border: 'border-indigo-400/30', text: 'text-indigo-200', accent: 'bg-indigo-400' } },

  // TEMAS (ELITE)
  { id: 'theme_emerald', name: 'Barra Esmeralda', category: 'hud_theme', price: 22000, currency: 'coins', icon: '🎨', description: 'Luxo verde: +15% colheita.', harvestBonus: 0.15, style: { bg: 'bg-emerald-950/90', border: 'border-emerald-500/40', text: 'text-emerald-400', accent: 'bg-emerald-500' } },
  { id: 'theme_ruby', name: 'Barra Rubi', category: 'hud_theme', price: 120, currency: 'hashCoins', icon: '🎨', description: 'Elite Rubi: +22% colheita.', harvestBonus: 0.22, style: { bg: 'bg-rose-950/90', border: 'border-rose-500/40', text: 'text-rose-400', accent: 'bg-rose-500' } },
  { id: 'theme_gold', name: 'Barra de Ouro', category: 'hud_theme', price: 420, currency: 'hashCoins', icon: '🎨', description: 'Ouro Puro: +40% colheita.', harvestBonus: 0.40, style: { bg: 'bg-amber-950/90', border: 'border-amber-400/50', text: 'text-amber-400', accent: 'bg-amber-400' } }
];
