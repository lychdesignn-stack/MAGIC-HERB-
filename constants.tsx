
import React from 'react';
import { Seed, Rarity, NPC } from './types';

export const SEEDS: Seed[] = [
  {
    id: 'kush_comum',
    name: 'Green Kush',
    rarity: Rarity.COMMON,
    growthTime: 15,
    baseValue: 12,
    color: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.5)',
  },
  {
    id: 'lemon_skunk',
    name: 'Lemon Skunk',
    rarity: Rarity.COMMON,
    growthTime: 25,
    baseValue: 24,
    color: '#facc15',
    glowColor: 'rgba(250, 204, 21, 0.5)',
  },
  {
    id: 'blueberry_bliss',
    name: 'Blueberry Bliss',
    rarity: Rarity.COMMON,
    growthTime: 40,
    baseValue: 50,
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.5)',
  },
  {
    id: 'mazar_sharp',
    name: 'Mazar Sharp',
    rarity: Rarity.COMMON,
    growthTime: 55,
    baseValue: 90,
    color: '#4ade80',
    glowColor: 'rgba(74, 222, 128, 0.5)',
  },
  {
    id: 'purple_haze',
    name: 'Purple Haze',
    rarity: Rarity.RARE,
    growthTime: 90,
    baseValue: 300,
    color: '#a855f7',
    secondaryColor: '#ec4899',
    glowColor: 'rgba(168, 85, 247, 0.6)',
  },
  {
    id: 'blue_dream',
    name: 'Blue Dream',
    rarity: Rarity.RARE,
    growthTime: 120,
    baseValue: 650,
    color: '#3b82f6',
    secondaryColor: '#60a5fa',
    glowColor: 'rgba(59, 130, 246, 0.6)',
  },
  {
    id: 'strawberry_cough',
    name: 'Strawberry Cough',
    rarity: Rarity.RARE,
    growthTime: 150,
    baseValue: 1100,
    color: '#f43f5e',
    secondaryColor: '#fb7185',
    glowColor: 'rgba(244, 63, 94, 0.6)',
  },
  {
    id: 'white_widow',
    name: 'White Widow',
    rarity: Rarity.RARE,
    growthTime: 180,
    baseValue: 1800,
    color: '#cbd5e1',
    secondaryColor: '#f8fafc',
    glowColor: 'rgba(203, 213, 225, 0.7)',
  },
  {
    id: 'jack_herer',
    name: 'Jack Herer',
    rarity: Rarity.RARE,
    growthTime: 220,
    baseValue: 2800,
    color: '#a3e635',
    secondaryColor: '#d9f99d',
    glowColor: 'rgba(163, 230, 53, 0.6)',
  },
  {
    id: 'neon_og',
    name: 'Neon OG',
    rarity: Rarity.LEGENDARY,
    growthTime: 300,
    baseValue: 8000,
    hashCoinPrice: 5,
    color: '#f472b6',
    gradientColors: ['#f472b6', '#fbbf24', '#f59e0b'],
    glowColor: 'rgba(244, 114, 182, 0.8)',
  },
  {
    id: 'northern_lights',
    name: 'Northern Lights',
    rarity: Rarity.LEGENDARY,
    growthTime: 450,
    baseValue: 18000,
    hashCoinPrice: 15,
    color: '#10b981',
    gradientColors: ['#10b981', '#6366f1', '#a855f7'],
    glowColor: 'rgba(16, 185, 129, 0.8)',
  },
  {
    id: 'og_platinum',
    name: 'OG Platinum',
    rarity: Rarity.LEGENDARY,
    growthTime: 600,
    baseValue: 45000,
    hashCoinPrice: 50,
    color: '#e2e8f0',
    gradientColors: ['#e2e8f0', '#94a3b8', '#38bdf8'],
    glowColor: 'rgba(226, 232, 240, 0.9)',
  },
  {
    id: 'cosmic_afghan',
    name: 'Cosmic Afghan',
    rarity: Rarity.LEGENDARY,
    growthTime: 900, // 15 minutos
    baseValue: 120000,
    hashCoinPrice: 200,
    color: '#8b5cf6',
    gradientColors: ['#8b5cf6', '#06b6d4', '#22d3ee', '#ffffff'],
    glowColor: 'rgba(139, 92, 246, 1)',
  }
];

export const NPCS: NPC[] = [
  {
    id: 'snoopcat',
    name: 'Snoopcat',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=snoopcat&backgroundColor=b6e3f4',
    dialogue: "Drop it like it's hot, man. Essas flores estão on fire!",
    demand: ['kush_comum', 'purple_haze'],
    multiplier: 1.2,
    rarityRequired: null
  },
  {
    id: 'zen_zeca',
    name: 'Zen zeca',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zeca&backgroundColor=d1f4f9',
    dialogue: "Paciência... a planta cresce no tempo do universo.",
    demand: ['white_widow', 'mazar_sharp'],
    multiplier: 1.25,
    rarityRequired: null
  },
  {
    id: 'shortyweed',
    name: 'ShortyWeed',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shorty&backgroundColor=ffd5dc',
    dialogue: "Pequeno no tamanho, gigante no estoque!",
    demand: ['blueberry_bliss', 'blue_dream'],
    multiplier: 1.3,
    rarityRequired: Rarity.COMMON
  },
  {
    id: 'panic',
    name: 'Panic',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=panic&backgroundColor=fca5a5',
    dialogue: "Rápido! Preciso disso antes que a lua mude de fase!",
    demand: ['northern_lights', 'lemon_skunk'],
    multiplier: 1.6,
    rarityRequired: Rarity.RARE
  },
  {
    id: 'icky_deller',
    name: 'Icky deller',
    // Avatar masculino: top=shortHair, beard=moustachMagnum etc para reforçar que é homem
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=IckyDellerMan&top=shortHair&facialHair=moustachMagnum&accessories=shades&backgroundColor=c0aede',
    dialogue: "Negócios são negócios, mas a vibe tem que estar certa.",
    demand: ['lemon_skunk', 'jack_herer'],
    multiplier: 1.4,
    rarityRequired: Rarity.RARE
  },
  {
    id: 'gnoweed',
    name: 'Gnoweed',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gnoweed&backgroundColor=ffdfbf',
    dialogue: "Eu conheço a erva, eu conheço o caminho.",
    demand: ['neon_og', 'strawberry_cough'],
    multiplier: 1.5,
    rarityRequired: Rarity.RARE
  },
  {
    id: 'cosmic_drugs',
    name: 'Cosmic drugs',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmic&backgroundColor=f5d0fe',
    dialogue: "Minhas naves precisam de combustível de alta octanagem.",
    demand: ['cosmic_afghan', 'og_platinum'],
    multiplier: 1.8,
    rarityRequired: Rarity.LEGENDARY
  }
];

export const LAND_COSTS = [
  { id: 6, cost: 500, label: 'Expansão 1' },
  { id: 7, cost: 2000, label: 'Expansão 2' },
  { id: 8, cost: 8000, label: 'Expansão 3' },
  { id: 9, cost: 25000, label: 'Expansão 4' },
  { id: 10, cost: 10, label: 'Terra Lendária A', fertilized: true, hashCoin: true },
  { id: 11, cost: 50, label: 'Terra Lendária B', fertilized: true, hashCoin: true },
];

export const UPGRADES = [
  { id: 'golden_scissors', name: 'Tesoura de Ouro', cost: 1500, description: 'Poda instantânea', effect: 1 },
  { id: 'hydro_system', name: 'Sistema Hidropônico', cost: 5000, description: 'Crescimento 2x mais rápido', effect: 2 },
];
