
import { Seed, Rarity, NPC, LuxuryItem } from './types';

export const SEEDS: Seed[] = [
  // --- COMUNS ---
  { id: 'kush_comum', name: 'Green Kush', rarity: Rarity.COMMON, growthTime: 15, baseValue: 12, color: '#22c55e', glowColor: 'rgba(34, 197, 94, 0.5)' },
  { id: 'lemon_skunk', name: 'Lemon Skunk', rarity: Rarity.COMMON, growthTime: 25, baseValue: 24, color: '#facc15', glowColor: 'rgba(250, 204, 21, 0.5)' },
  { id: 'blueberry_bliss', name: 'Blueberry Bliss', rarity: Rarity.COMMON, growthTime: 40, baseValue: 50, color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.5)' },
  { id: 'minty_breeze', name: 'Minty Breeze', rarity: Rarity.COMMON, growthTime: 30, baseValue: 35, color: '#2dd4bf', glowColor: 'rgba(45, 212, 191, 0.5)' },
  { id: 'red_fire', name: 'Red Fire', rarity: Rarity.COMMON, growthTime: 45, baseValue: 60, color: '#ef4444', glowColor: 'rgba(239, 68, 68, 0.5)' },
  
  // --- RARAS (Medianas - 2 cores) ---
  { id: 'purple_haze', name: 'Purple Haze', rarity: Rarity.RARE, growthTime: 90, baseValue: 300, color: '#a855f7', secondaryColor: '#ec4899', glowColor: 'rgba(168, 85, 247, 0.6)' },
  { id: 'white_widow', name: 'White Widow', rarity: Rarity.RARE, growthTime: 180, baseValue: 1800, color: '#cbd5e1', secondaryColor: '#f8fafc', glowColor: 'rgba(203, 213, 225, 0.7)' },
  { id: 'golden_goat', name: 'Golden Goat', rarity: Rarity.RARE, growthTime: 120, baseValue: 800, color: '#fbbf24', secondaryColor: '#f59e0b', glowColor: 'rgba(251, 191, 36, 0.6)' },
  { id: 'blue_dream', name: 'Blue Dream', rarity: Rarity.RARE, growthTime: 150, baseValue: 1200, color: '#60a5fa', secondaryColor: '#1d4ed8', glowColor: 'rgba(96, 165, 250, 0.6)' },
  { id: 'strawberry_cough', name: 'Strawberry Cough', rarity: Rarity.RARE, growthTime: 200, baseValue: 2200, color: '#fb7185', secondaryColor: '#e11d48', glowColor: 'rgba(251, 113, 133, 0.6)' },

  // --- LENDÁRIAS (Degrade complexo + efeitos) ---
  { id: 'neon_og', name: 'Neon OG', rarity: Rarity.LEGENDARY, growthTime: 300, baseValue: 8000, hashCoinPrice: 5, color: '#f472b6', gradientColors: ['#f472b6', '#fbbf24', '#f59e0b'], glowColor: 'rgba(244, 114, 182, 0.8)' },
  { id: 'cosmic_afghan', name: 'Cosmic Afghan', rarity: Rarity.LEGENDARY, growthTime: 900, baseValue: 120000, hashCoinPrice: 200, color: '#8b5cf6', gradientColors: ['#8b5cf6', '#06b6d4', '#22d3ee', '#ffffff'], glowColor: 'rgba(139, 92, 246, 1)' },
  { id: 'supernova_kush', name: 'Supernova Kush', rarity: Rarity.LEGENDARY, growthTime: 600, baseValue: 45000, hashCoinPrice: 40, color: '#312e81', gradientColors: ['#312e81', '#4338ca', '#818cf8', '#c7d2fe'], glowColor: 'rgba(67, 56, 202, 0.9)' },
  { id: 'phoenix_flame', name: 'Phoenix Flame', rarity: Rarity.LEGENDARY, growthTime: 750, baseValue: 75000, hashCoinPrice: 80, color: '#b91c1c', gradientColors: ['#b91c1c', '#ea580c', '#facc15', '#ffffff'], glowColor: 'rgba(234, 88, 12, 1)' },
  { id: 'galactic_frost', name: 'Galactic Frost', rarity: Rarity.LEGENDARY, growthTime: 1200, baseValue: 250000, hashCoinPrice: 350, color: '#94a3b8', gradientColors: ['#94a3b8', '#e2e8f0', '#7dd3fc', '#ffffff'], glowColor: 'rgba(148, 163, 184, 1)' },
  { id: 'chrono_root', name: 'Chrono Root', rarity: Rarity.LEGENDARY, growthTime: 1500, baseValue: 500000, hashCoinPrice: 600, color: '#166534', gradientColors: ['#166534', '#a3e635', '#fde047', '#4ade80'], glowColor: 'rgba(22, 101, 52, 1)' },
  { id: 'rainbow_belt', name: 'Rainbow Belt', rarity: Rarity.LEGENDARY, growthTime: 1800, baseValue: 1000000, hashCoinPrice: 1000, color: '#ff0000', gradientColors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee'], glowColor: 'rgba(255, 255, 255, 1)' }
];

export const UPGRADE_LIMITS = { [Rarity.COMMON]: 2, [Rarity.RARE]: 4, [Rarity.LEGENDARY]: 6 };
export const UPGRADE_COSTS = {
  [Rarity.COMMON]: { coins: 800, hash: 0 },
  [Rarity.RARE]: { coins: 8000, hash: 10 },
  [Rarity.LEGENDARY]: { coins: 80000, hash: 100 }
};

export const NPCS: NPC[] = [
  { id: 'snoopcat', name: 'Snoopcat', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=snoopcat&backgroundColor=b6e3f4', dialogue: "Drop it like it's hot, man.", demand: ['kush_comum', 'purple_haze'], multiplier: 1.2, rarityRequired: null },
  { id: 'dr_greenthumb', name: 'Dr. Greenthumb', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=scientist&backgroundColor=d1fae5', dialogue: "A ciência do cultivo é sagrada.", demand: ['minty_breeze', 'lemon_skunk'], multiplier: 1.3, rarityRequired: null },
  { id: 'stellar_selene', name: 'Stellar Selene', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=selene&backgroundColor=fdf2f8', dialogue: "As estrelas me guiaram até aqui.", demand: ['blue_dream', 'golden_goat'], multiplier: 1.5, rarityRequired: Rarity.RARE },
  { id: 'orbit_bot', name: 'Orbit-42', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=orbit&backgroundColor=e0f2fe', dialogue: "BEEP. PROCESSANDO TRANSAÇÃO.", demand: ['white_widow', 'strawberry_cough'], multiplier: 1.6, rarityRequired: Rarity.RARE },
  { id: 'madame_nebula', name: 'Madame Nebula', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nebula&backgroundColor=fae8ff', dialogue: "Eu já previ nossa negociação.", demand: ['neon_og', 'purple_haze'], multiplier: 1.8, rarityRequired: Rarity.RARE },
  { id: 'baron_bong', name: 'Barão Bong', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=baron&backgroundColor=fef3c7', dialogue: "Investimentos de alto nível apenas.", demand: ['supernova_kush', 'galactic_frost'], multiplier: 2.2, rarityRequired: Rarity.LEGENDARY },
  { id: 'captain_canna', name: 'Capitão Canna', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pirate&backgroundColor=fee2e2', dialogue: "Argh! Me dê o melhor tesouro verde.", demand: ['phoenix_flame'], multiplier: 2.5, rarityRequired: Rarity.LEGENDARY },
  { id: 'luna_leaf', name: 'Luna Leaf', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luna&backgroundColor=ecfdf5', dialogue: "Paz, amor e ótimas colheitas.", demand: ['chrono_root'], multiplier: 2.8, rarityRequired: Rarity.LEGENDARY },
  { id: 'xenon', name: 'Xenon X', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=xenon&backgroundColor=f5f3ff', dialogue: "Matéria orgânica superior detectada.", demand: ['cosmic_afghan'], multiplier: 3.0, rarityRequired: Rarity.LEGENDARY },
  { id: 'misty_ai', name: 'Misty AI', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=misty&backgroundColor=ccfbf1', dialogue: "Otimizando lucros galácticos.", demand: ['rainbow_belt'], multiplier: 3.5, rarityRequired: Rarity.LEGENDARY },
  { id: 'chronic_chronos', name: 'Chronos', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chronos&backgroundColor=fef2f2', dialogue: "Vim do futuro para colher isso.", demand: ['chrono_root', 'supernova_kush'], multiplier: 4.0, rarityRequired: Rarity.LEGENDARY },
  { id: 'cosmic_drugs', name: 'Cosmic Agent', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmic&backgroundColor=f5d0fe', dialogue: "Intergalactic business is booming.", demand: ['cosmic_afghan', 'rainbow_belt'], multiplier: 2.0, rarityRequired: Rarity.LEGENDARY }
];

export const LUXURY_ITEMS: LuxuryItem[] = [
  { id: 'neon_cape', name: 'Capa Neon Pulsante', category: 'cape', price: 50000, currency: 'coins', icon: '🧥', description: 'Estilo neon para seu cultivador.' },
  { id: 'gold_crown', name: 'Coroa Imperial', category: 'luxury', price: 500, currency: 'hashCoins', icon: '👑', description: 'Mostre quem manda na galáxia.' },
  { id: 'diamond_chain', name: 'Ice Galáctico', category: 'jewelry', price: 150000, currency: 'coins', icon: '💎', description: 'Puro brilho estelar.' },
  { id: 'theme_emerald', name: 'Barra Esmeralda', category: 'hud_theme', price: 25000, currency: 'coins', icon: '🎨', description: 'Um visual verde luxuoso.', style: { bg: 'bg-emerald-950/90', border: 'border-emerald-500/40', text: 'text-emerald-400', accent: 'bg-emerald-500' } },
  { id: 'theme_ruby', name: 'Barra Rubi', category: 'hud_theme', price: 150, currency: 'hashCoins', icon: '🎨', description: 'Puro luxo avermelhado.', style: { bg: 'bg-rose-950/90', border: 'border-rose-500/40', text: 'text-rose-400', accent: 'bg-rose-500' } },
  { id: 'theme_gold', name: 'Barra de Ouro', category: 'hud_theme', price: 500, currency: 'hashCoins', icon: '🎨', description: 'Interface banhada a ouro.', style: { bg: 'bg-amber-950/90', border: 'border-amber-400/50', text: 'text-amber-400', accent: 'bg-amber-400' } }
];
