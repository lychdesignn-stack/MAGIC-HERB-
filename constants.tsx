
import { Seed, Rarity, NPC, LuxuryItem, Title, Territory, ConsumableItem } from './types';

export const RARITY_DISPLAY: Record<Rarity, string> = {
  [Rarity.COMUM_A]: 'Comum',
  [Rarity.COMUM_B]: 'Comum',
  [Rarity.RARA]: 'Rara',
  [Rarity.LENDARIA]: 'Lendária',
  [Rarity.MISTICA]: 'Mística'
};

export const TERRITORIES: Territory[] = [
  { id: 'suburbio', name: 'Subúrbio Solar', riskLevel: 'low', riskChance: 0.20, priceBonus: 0.70, description: 'Vizinhança tranquila. Baixo risco.', color: '#22c55e', icon: '🏡', requiredRarity: Rarity.COMUM_A },
  { id: 'porto_estelar', name: 'Porto Estelar', riskLevel: 'medium', riskChance: 0.22, priceBonus: 0.75, description: 'Contrabando intergaláctico.', color: '#3b82f6', icon: '🚢', requiredRarity: Rarity.COMUM_B },
  { id: 'centro', name: 'Centro Neon', riskLevel: 'medium', riskChance: 0.25, priceBonus: 0.80, description: 'Movimentado. Policiamento moderado.', color: '#eab308', icon: '🏙️', requiredRarity: Rarity.RARA },
  { id: 'quebrada_astral', name: 'Quebrada Astral', riskLevel: 'high', riskChance: 0.28, priceBonus: 0.85, description: 'Risco alto, lucro compensador.', color: '#ef4444', icon: '🏚️', requiredRarity: Rarity.LENDARIA },
  { id: 'favela_hightech', name: 'Favela High-Tech', riskLevel: 'high', riskChance: 0.30, priceBonus: 0.90, description: 'Zona proibida. Lucro máximo e risco real.', color: '#f472b6', icon: '🧬', requiredRarity: Rarity.MISTICA }
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
  { id: 'truta_local', name: 'Truta da Quebrada', requirement: '100 Reputação', type: 'reputation' },
  { id: 'maos_de_terra', name: 'Mãos de Terra', requirement: '50 Plantas Plantadas', type: 'reputation' },
  { id: 'dedo_verde', name: 'Dedo Verde', requirement: '200 Plantas Plantadas', type: 'reputation' },
  { id: 'influencer', name: 'Influencer de Strain', requirement: 'Comprável', price: 100, type: 'purchasable' },
  { id: 'visionario', name: 'Visionário do Hash', requirement: 'Comprável', price: 500, type: 'purchasable' },
  { id: 'chefao', name: 'Chefão da Estufa', requirement: 'Comprável', price: 2000, type: 'purchasable' },
  { id: 'lenda_viva', name: 'Lenda Viva', requirement: 'Comprável', price: 10000, type: 'purchasable' },
];

export const SEEDS: Seed[] = [
  // Comum I
  { id: 'kush_comum', name: 'Green Kush', rarity: Rarity.COMUM_A, growthTime: 15, baseValue: 50, info: "Resistente e ultra rápida.", color: '#22c55e', glowColor: 'rgba(34, 197, 94, 0.4)' },
  { id: 'lemon_skunk', name: 'Lemon Skunk', rarity: Rarity.COMUM_A, growthTime: 25, baseValue: 90, info: "Cítrica e revigorante.", color: '#facc15', glowColor: 'rgba(250, 204, 21, 0.4)' },
  { id: 'sour_diesel', name: 'Sour Diesel', rarity: Rarity.COMUM_A, growthTime: 40, baseValue: 160, info: "Energia pura.", color: '#a3e635', glowColor: 'rgba(163, 230, 53, 0.4)' },
  { id: 'blueberry_muffin', name: 'Blueberry Muffin', rarity: Rarity.COMUM_A, growthTime: 60, baseValue: 250, info: "Cheiro de padaria.", color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.4)' },
  { id: 'pineapple_chunk', name: 'Pineapple Chunk', rarity: Rarity.COMUM_A, growthTime: 80, baseValue: 380, info: "Tropical.", color: '#fbbf24', glowColor: 'rgba(251, 191, 36, 0.4)' },

  // Comum II
  { id: 'thai_stick', name: 'Thai Stick', rarity: Rarity.COMUM_B, growthTime: 100, baseValue: 520, info: "Clássico oriental.", color: '#d97706', glowColor: 'rgba(217, 119, 6, 0.3)' },
  { id: 'panama_red', name: 'Panama Red', rarity: Rarity.COMUM_B, growthTime: 120, baseValue: 680, info: "Vermelho vibrante.", color: '#ef4444', glowColor: 'rgba(239, 68, 68, 0.3)' },
  { id: 'acapulco_gold', name: 'Acapulco Gold', rarity: Rarity.COMUM_B, growthTime: 140, baseValue: 850, info: "Ouro mexicano.", color: '#eab308', glowColor: 'rgba(234, 179, 8, 0.3)' },
  { id: 'minty_breeze', name: 'Minty Breeze', rarity: Rarity.COMUM_B, growthTime: 160, baseValue: 1050, info: "Refrescante.", color: '#2dd4bf', glowColor: 'rgba(45, 212, 191, 0.3)' },
  { id: 'red_dragon', name: 'Red Dragon', rarity: Rarity.COMUM_B, growthTime: 180, baseValue: 1300, info: "Sopro de fogo.", color: '#dc2626', glowColor: 'rgba(220, 38, 38, 0.3)' },

  // Rara
  { id: 'northern_lights', name: 'Northern Lights', rarity: Rarity.RARA, growthTime: 300, baseValue: 2200, info: "Aurora boreal.", color: '#4d7c0f', secondaryColor: '#84cc16', glowColor: 'rgba(77, 124, 15, 0.6)' },
  { id: 'purple_haze', name: 'Purple Haze', rarity: Rarity.RARA, growthTime: 360, baseValue: 3800, info: "Psicodélica.", color: '#a855f7', secondaryColor: '#ec4899', glowColor: 'rgba(168, 85, 247, 0.6)' },
  { id: 'amnesia_haze', name: 'Amnesia Haze', rarity: Rarity.RARA, growthTime: 420, baseValue: 5500, info: "Esqueça os problemas.", color: '#fbbf24', secondaryColor: '#d97706', glowColor: 'rgba(251, 191, 36, 0.5)' },
  { id: 'jack_herer', name: 'Jack Herer', rarity: Rarity.RARA, growthTime: 480, baseValue: 7200, info: "Homenagem ao mestre.", color: '#10b981', secondaryColor: '#059669', glowColor: 'rgba(16, 185, 129, 0.5)' },
  { id: 'ak47', name: 'AK-47', rarity: Rarity.RARA, growthTime: 540, baseValue: 9000, info: "Um tiro de alegria.", color: '#b45309', secondaryColor: '#78350f', glowColor: 'rgba(180, 83, 9, 0.5)' },
  { id: 'gorilla_glue', name: 'Gorilla Glue', rarity: Rarity.RARA, growthTime: 600, baseValue: 11000, info: "Gruda na mente.", color: '#44403c', secondaryColor: '#1c1917', glowColor: 'rgba(68, 64, 60, 0.5)' },
  { id: 'gsc_cookies', name: 'Girl Scout Cookies', rarity: Rarity.RARA, growthTime: 660, baseValue: 14000, info: "Sobremesa.", color: '#fb923c', secondaryColor: '#f97316', glowColor: 'rgba(249, 115, 22, 0.5)' },
  { id: 'gelato_41', name: 'Gelato #41', rarity: Rarity.RARA, growthTime: 720, baseValue: 18000, info: "Cremosa.", color: '#f472b6', secondaryColor: '#db2777', glowColor: 'rgba(244, 114, 182, 0.5)' },
  { id: 'purple_punch', name: 'Purple Punch', rarity: Rarity.RARA, growthTime: 780, baseValue: 22000, info: "Punch de uva.", color: '#7c3aed', secondaryColor: '#4c1d95', glowColor: 'rgba(124, 58, 237, 0.6)' },
  { id: 'super_silver_haze', name: 'Super Silver', rarity: Rarity.RARA, growthTime: 840, baseValue: 26000, info: "Brilho lunar.", color: '#e2e8f0', secondaryColor: '#94a3b8', glowColor: 'rgba(226, 232, 240, 0.6)' },

  // Lendária
  { id: 'neon_og', name: 'Neon OG', rarity: Rarity.LENDARIA, growthTime: 1200, baseValue: 70000, hashCoinPrice: 80, info: "Luz negra.", color: '#f472b6', gradientColors: ['#f472b6', '#fbbf24'], glowColor: 'rgba(244, 114, 182, 0.8)' },
  { id: 'white_widow', name: 'White Widow', rarity: Rarity.LENDARIA, growthTime: 1400, baseValue: 95000, hashCoinPrice: 150, info: "A Rainha.", color: '#ffffff', gradientColors: ['#ffffff', '#94a3b8'], glowColor: 'rgba(255, 255, 255, 0.8)' },
  { id: 'moon_rock', name: 'Moon Rock', rarity: Rarity.LENDARIA, growthTime: 1600, baseValue: 140000, hashCoinPrice: 300, info: "Fora da Terra.", color: '#4b5563', gradientColors: ['#4b5563', '#111827'], glowColor: 'rgba(75, 85, 99, 0.7)' },
  { id: 'galactic_grape', name: 'Galactic Grape', rarity: Rarity.LENDARIA, growthTime: 1800, baseValue: 200000, hashCoinPrice: 500, info: "Uva estelar.", color: '#7e22ce', gradientColors: ['#7e22ce', '#db2777'], glowColor: 'rgba(126, 34, 206, 0.7)' },
  { id: 'wedding_cake', name: 'Wedding Cake', rarity: Rarity.LENDARIA, growthTime: 2000, baseValue: 280000, hashCoinPrice: 800, info: "Celebração.", color: '#fef3c7', gradientColors: ['#fef3c7', '#f59e0b'], glowColor: 'rgba(253, 230, 138, 0.7)' },
  { id: 'godfather_og', name: 'Godfather OG', rarity: Rarity.LENDARIA, growthTime: 2200, baseValue: 400000, hashCoinPrice: 1200, info: "O Dono.", color: '#111827', gradientColors: ['#111827', '#facc15'], glowColor: 'rgba(250, 204, 21, 0.6)' },
  { id: 'black_widow', name: 'Black Widow', rarity: Rarity.LENDARIA, growthTime: 2400, baseValue: 600000, hashCoinPrice: 2000, info: "Fatal.", color: '#000000', gradientColors: ['#000000', '#ef4444'], glowColor: 'rgba(239, 68, 68, 0.6)' },
  { id: 'sun_walker', name: 'Sun Walker', rarity: Rarity.LENDARIA, growthTime: 2600, baseValue: 800000, hashCoinPrice: 3500, info: "Caminhante solar.", color: '#fbbf24', gradientColors: ['#fbbf24', '#ffffff'], glowColor: 'rgba(251, 191, 36, 0.6)' },

  // Mística
  { id: 'sticky_icky', name: 'Sticky Icky', rarity: Rarity.MISTICA, growthTime: 3600, baseValue: 3500000, hashCoinPrice: 10000, info: "A Lendária.", color: '#22c55e', gradientColors: ['#22c55e', '#ffffff'], glowColor: 'rgba(34, 197, 94, 1)' },
  { id: 'alien_og', name: 'Alien OG', rarity: Rarity.MISTICA, growthTime: 4500, baseValue: 8500000, hashCoinPrice: 25000, info: "DNA Alien.", color: '#10b981', gradientColors: ['#064e3b', '#10b981'], glowColor: 'rgba(16, 185, 129, 0.9)' },
  { id: 'chrono_herb', name: 'Chrono Herb', rarity: Rarity.MISTICA, growthTime: 5400, baseValue: 20000000, hashCoinPrice: 50000, info: "Controla o tempo.", color: '#3b82f6', gradientColors: ['#1e3a8a', '#3b82f6', '#ffffff'], glowColor: 'rgba(59, 130, 246, 1)' },
  { id: 'eternal_bloom', name: 'Eternal Bloom', rarity: Rarity.MISTICA, growthTime: 7200, baseValue: 65000000, hashCoinPrice: 150000, info: "O Fim e o Início.", color: '#ffffff', gradientColors: ['#000000', '#ffffff'], glowColor: 'rgba(255, 255, 255, 1)' },
];

export const NPCS: NPC[] = [
  { id: 'n1', name: '@Cellin', avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Toby&backgroundColor=b6e3f4', dialogue: "Qualidade é a única moeda que importa.", demand: ['godfather_og', 'sun_walker'], multiplier: 1.6, rarityRequired: null, rarity: Rarity.LENDARIA },
  { id: 'n2', name: 'ICKY767', avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Leo&backgroundColor=b6e3f4', dialogue: "Icky in the house!", demand: ['sticky_icky', 'kush_comum'], multiplier: 1.25, rarityRequired: null, rarity: Rarity.COMUM_A },
  { id: 'n3', name: 'CPXINS4NE', avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Max&backgroundColor=b6e3f4', dialogue: "Bora dominar o mapa.", demand: ['lemon_skunk', 'ak47'], multiplier: 1.3, rarityRequired: null, rarity: Rarity.RARA },
  { id: 'n4', name: 'IGOWEED', avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Finn&backgroundColor=b6e3f4', dialogue: "Só o puro aroma.", demand: ['purple_haze', 'amnesia_haze'], multiplier: 1.2, rarityRequired: null, rarity: Rarity.RARA },
  { id: 'n5', name: 'Vovó Maria', avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Luna&backgroundColor=b6e3f4', dialogue: "Para o meu chá...", demand: ['lemon_skunk', 'acapulco_gold'], multiplier: 1.05, rarityRequired: null, rarity: Rarity.COMUM_A },
  { id: 'n6', name: 'Dan Crema', avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Xavier&backgroundColor=b6e3f4', dialogue: "Negócios de alto nível exigem produtos de alto nível.", demand: ['white_widow', 'moon_rock'], multiplier: 2.0, rarityRequired: null, rarity: Rarity.LENDARIA },
  { id: 'n7', name: 'PX', avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Milo&backgroundColor=b6e3f4', dialogue: "Qualidade é o meu foco.", demand: ['lemon_skunk', 'northern_lights'], multiplier: 1.15, rarityRequired: null, rarity: Rarity.RARA },
  { id: 'n8', name: 'Chrono-Sage', avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Sage&backgroundColor=b6e3f4', dialogue: "O tempo flui através do bloom.", demand: ['eternal_bloom', 'chrono_herb'], multiplier: 2.5, rarityRequired: null, rarity: Rarity.MISTICA },
];

export const UPGRADE_LIMITS = { [Rarity.COMUM_A]: 3, [Rarity.COMUM_B]: 3, [Rarity.RARA]: 5, [Rarity.LENDARIA]: 8, [Rarity.MISTICA]: 12 };
export const UPGRADE_COSTS = {
  [Rarity.COMUM_A]: { coins: 1500, hash: 0 },
  [Rarity.COMUM_B]: { coins: 5000, hash: 0 },
  [Rarity.RARA]: { coins: 45000, hash: 100 },
  [Rarity.LENDARIA]: { coins: 350000, hash: 1200 },
  [Rarity.MISTICA]: { coins: 2500000, hash: 8000 }
};

export const CONSUMABLES: ConsumableItem[] = [
  { id: 'fertilizante_bio', name: 'Fertilizante Bio', price: 200, currency: 'coins', description: 'Bônus passivo de colheita.', icon: '🧪', effect: 'fertilize', passiveBonusLabel: '+0.5 Bud/Colheita' },
  { id: 'hidro_boost', name: 'Hidro Boost', price: 50, currency: 'hashCoins', description: 'Aumenta velocidade de crescimento global.', icon: '💧', effect: 'water_all', passiveBonusLabel: '+10% Speed' },
  { id: 'chrono_trigger', name: 'Chrono Trigger', price: 200, currency: 'hashCoins', description: 'Alta aceleração temporal constante.', icon: '⚡', effect: 'speed_up', passiveBonusLabel: '+25% Speed' }
];

export const LUXURY_ITEMS: LuxuryItem[] = [
  { id: 'free_green', name: 'Verde Natural', category: 'profile_bg', rarity: Rarity.COMUM_A, price: 0, currency: 'coins', icon: '🟢', description: 'O clássico cultivo.', harvestBonus: 0, style: { bg: 'from-green-800 to-green-950', border: 'border-green-500/30', text: 'text-green-400', accent: 'bg-green-500' } },
  { id: 'free_blue', name: 'Azul Celeste', category: 'profile_bg', rarity: Rarity.COMUM_A, price: 0, currency: 'coins', icon: '🔵', description: 'Céu limpo para colheita.', harvestBonus: 0, style: { bg: 'from-blue-800 to-blue-950', border: 'border-blue-500/30', text: 'text-blue-400', accent: 'bg-blue-500' } },
  { id: 'free_red', name: 'Fogo Sativa', category: 'profile_bg', rarity: Rarity.COMUM_A, price: 0, currency: 'coins', icon: '🔴', description: 'Paixão pelo plantio.', harvestBonus: 0, style: { bg: 'from-red-800 to-red-950', border: 'border-red-500/30', text: 'text-red-400', accent: 'bg-red-500' } },
  { id: 'free_gray', name: 'Concreto Urbano', category: 'profile_bg', rarity: Rarity.COMUM_A, price: 0, currency: 'coins', icon: '🔘', description: 'Foco no asfalto.', harvestBonus: 0, style: { bg: 'from-zinc-800 to-zinc-950', border: 'border-zinc-500/30', text: 'text-zinc-400', accent: 'bg-zinc-500' } },

  { id: 'silk_24k', name: 'Seda de Ouro 24k', category: 'jewelry', rarity: Rarity.RARA, price: 20000, currency: 'coins', icon: '📜', description: 'Papel de enrolar banhado a ouro puro.', harvestBonus: 0.05 },
  { id: 'diamond_grinder', name: 'Dichavador de Diamante', category: 'jewelry', rarity: Rarity.LENDARIA, price: 6500, currency: 'hashCoins', icon: '⚙️', description: 'Corta até as strains mais densas.', harvestBonus: 0.10 },
  { id: 'crystal_bong', name: 'Bong de Andrômeda', category: 'luxury', rarity: Rarity.MISTICA, price: 35000, currency: 'hashCoins', icon: '🏺', description: 'Esculpido em cristal estelar.', harvestBonus: 0.20 },
  { id: 'thc_ring', name: 'Anel do Tetrahidro', category: 'jewelry', rarity: Rarity.RARA, price: 10000, currency: 'coins', icon: '💍', description: 'Brilho verde no dedo.', harvestBonus: 0.03 },
  { id: 'smoke_cape', name: 'Capa Nebulosa', category: 'cape', rarity: Rarity.LENDARIA, price: 15000, currency: 'hashCoins', icon: '🧣', description: 'Deixa um rastro de resina estelar.', harvestBonus: 0.12 },
  { id: 'emerald_pipe', name: 'Pipe de Esmeralda', category: 'jewelry', rarity: Rarity.RARA, price: 35000, currency: 'coins', icon: '💎', description: 'Elegância em cada tragada.', harvestBonus: 0.04 },
  { id: 'golden_scale', name: 'Balança de Ouro', category: 'luxury', rarity: Rarity.LENDARIA, price: 65000, currency: 'coins', icon: '⚖️', description: 'Precisão real.', harvestBonus: 0.06 },
  { id: 'hash_scepter', name: 'Cetro do Mestre', category: 'luxury', rarity: Rarity.MISTICA, price: 55000, currency: 'hashCoins', icon: '🪄', description: 'Poder total sobre o Hash.', harvestBonus: 0.25 },
  { id: 'kush_crown', name: 'Coroa de Sativa', category: 'luxury', rarity: Rarity.LENDARIA, price: 250000, currency: 'coins', icon: '👑', description: 'O rei do cultivo.', harvestBonus: 0.15 },
  { id: 'terpene_essence', name: 'Essência de Terpeno', category: 'luxury', rarity: Rarity.RARA, price: 25000, currency: 'coins', icon: '🧪', description: 'Aroma que vicia.', harvestBonus: 0.05 },
  { id: 'ganja_sandals', name: 'Havaianas de Cânhamo', category: 'luxury', rarity: Rarity.COMUM_A, price: 5000, currency: 'coins', icon: '🩴', description: 'Conforto natural.', harvestBonus: 0.01 },
  { id: 'chronic_watch', name: 'Relógio 4:20', category: 'jewelry', rarity: Rarity.RARA, price: 18000, currency: 'coins', icon: '⌚', description: 'Sempre na hora certa.', harvestBonus: 0.03 },
  { id: 'cbd_oil_vial', name: 'Frasco de CBD Puro', category: 'jewelry', rarity: Rarity.RARA, price: 22500, currency: 'coins', icon: '🧪', description: 'Calma concentrada.', harvestBonus: 0.04 },
  { id: 'leafy_backpack', name: 'Mochila de Folhas', category: 'luxury', rarity: Rarity.COMUM_A, price: 8000, currency: 'coins', icon: '🎒', description: 'Leve seus buds com estilo.', harvestBonus: 0.02 },
  { id: 'neon_shades', name: 'Óculos Neon 80s', category: 'jewelry', rarity: Rarity.RARA, price: 15000, currency: 'coins', icon: '🕶️', description: 'Visão psicodélica.', harvestBonus: 0.03 },

  { id: 'theme_purple_haze', name: 'Tema Purple Haze', category: 'hud_theme', rarity: Rarity.RARA, price: 25000, currency: 'coins', icon: '🟣', description: 'Interface roxa vibrante.', harvestBonus: 0.02, style: { bg: 'bg-purple-900/80', border: 'border-purple-400', text: 'text-purple-300', accent: 'bg-purple-500' } },
  { id: 'theme_lemon_skunk', name: 'Tema Lemon Skunk', category: 'hud_theme', rarity: Rarity.RARA, price: 25000, currency: 'coins', icon: '🟡', description: 'Cítrico e brilhante.', harvestBonus: 0.02, style: { bg: 'bg-yellow-900/80', border: 'border-yellow-400', text: 'text-yellow-300', accent: 'bg-yellow-500' } },
  { id: 'theme_sour_diesel', name: 'Tema Sour Diesel', category: 'hud_theme', rarity: Rarity.RARA, price: 25000, currency: 'coins', icon: '🟢', description: 'Verde industrial.', harvestBonus: 0.02, style: { bg: 'bg-emerald-900/80', border: 'border-emerald-400', text: 'text-emerald-300', accent: 'bg-emerald-500' } },
  { id: 'theme_blue_dream', name: 'Tema Blue Dream', category: 'hud_theme', rarity: Rarity.RARA, price: 30000, currency: 'coins', icon: '🔵', description: 'Calmaria azulada.', harvestBonus: 0.02, style: { bg: 'bg-blue-900/80', border: 'border-blue-400', text: 'text-blue-300', accent: 'bg-blue-500' } },
  { id: 'theme_galactic_gold', name: 'Tema Ouro Estelar', category: 'hud_theme', rarity: Rarity.LENDARIA, price: 8000, currency: 'hashCoins', icon: '✨', description: 'Luxo espacial.', harvestBonus: 0.08, style: { bg: 'bg-amber-900/90', border: 'border-yellow-500', text: 'text-yellow-200', accent: 'bg-yellow-600' } },
  { id: 'theme_black_widow', name: 'Tema Black Widow', category: 'hud_theme', rarity: Rarity.MISTICA, price: 25000, currency: 'hashCoins', icon: '🖤', description: 'Elegância fatal.', harvestBonus: 0.15, style: { bg: 'bg-black/90', border: 'border-red-600', text: 'text-red-500', accent: 'bg-red-800' } },

  { id: 'bg_nebula', name: 'Nebulosa Sativa', category: 'profile_bg', rarity: Rarity.LENDARIA, price: 5000, currency: 'hashCoins', icon: '🖼️', description: 'O cosmos em forma de folha.', harvestBonus: 0.05, style: { bg: 'from-green-900 via-purple-900 to-black', border: 'border-green-400', text: 'text-green-300', accent: 'bg-green-600' } },
  { id: 'bg_jungle', name: 'Selva Profunda', category: 'profile_bg', rarity: Rarity.RARA, price: 45000, currency: 'coins', icon: '🌴', description: 'Densidade tropical.', harvestBonus: 0.03, style: { bg: 'from-emerald-900 to-teal-950', border: 'border-emerald-500', text: 'text-emerald-200', accent: 'bg-emerald-600' } },
  { id: 'bg_sunset', name: 'Pôr do Sol Indica', category: 'profile_bg', rarity: Rarity.RARA, price: 38000, currency: 'coins', icon: '🌇', description: 'Cores quentes e relaxantes.', harvestBonus: 0.03, style: { bg: 'from-orange-800 to-red-950', border: 'border-orange-500', text: 'text-orange-200', accent: 'bg-orange-600' } },
  { id: 'bg_cyber_lab', name: 'Laboratório Cyber', category: 'profile_bg', rarity: Rarity.LENDARIA, price: 85000, currency: 'coins', icon: '🤖', description: 'Extração futurista.', harvestBonus: 0.06, style: { bg: 'bg-slate-900', border: 'border-cyan-500', text: 'text-cyan-400', accent: 'bg-cyan-600' } },
  { id: 'bg_zen_garden', name: 'Jardim Zen', category: 'profile_bg', rarity: Rarity.COMUM_A, price: 15000, currency: 'coins', icon: '⛩️', description: 'Paz no cultivo.', harvestBonus: 0.01, style: { bg: 'from-slate-700 to-slate-900', border: 'border-slate-500', text: 'text-slate-300', accent: 'bg-slate-600' } },
];
