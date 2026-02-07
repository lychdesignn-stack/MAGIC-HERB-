
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Player, Plot, Rarity, Offer, MapOffer } from './types';
import { SEEDS, NPCS, LUXURY_ITEMS, UPGRADE_COSTS, TERRITORIES, CONSUMABLES, TITLES, RARITY_DISPLAY } from './constants';
import FarmGrid from './components/FarmGrid';
import BottomNav from './components/BottomNav';
import HUD from './components/HUD';
import Shop from './components/Shop';
import NPCPanel from './components/NPCPanel';
import Fabrication from './components/Fabrication';
import Warehouse from './components/Warehouse';
import ProfileView from './components/ProfileView';
import CityMap from './components/CityMap';
import EventOverlay from './components/EventOverlay';

const OFFER_RESET_INTERVAL = 1 * 60 * 1000; 
const MAP_OFFER_RESET_INTERVAL = 8 * 60 * 1000; 
const SAVE_KEY = 'HERB_HAVEN_SAVE_V19_FINAL'; 

const MIN_MAP_OFFERS = 3;
const MIN_NPC_OFFERS = 8; 

const createInitialInventory = () => {
  const inv: Record<string, number> = {};
  SEEDS.forEach(s => {
    inv[s.id] = s.id === 'kush_comum' ? 5 : 0;
    inv[`${s.id}_bud`] = 0;
    inv[`${s.id}_hash`] = 0;
  });
  CONSUMABLES.forEach(c => { inv[c.id] = 0; });
  return inv;
};

const INITIAL_PLAYER: Player = {
  name: 'Viajante',
  gender: 'male',
  avatarId: 'm1',
  coins: 500, 
  hashCoins: 0,
  level: 1,
  experience: 0,
  totalReputation: 0,
  stats: { totalPlanted: 0, totalSold: 0, totalEarned: 0 },
  inventory: createInitialInventory(),
  reputation: NPCS.reduce((acc, npc) => ({ ...acc, [npc.id]: 0 }), {}),
  unlockedRarities: [Rarity.COMUM_A], 
  ownedLuxuryItems: ['free_green', 'free_blue', 'free_red', 'free_gray'],
  ownedTitles: ['novato'],
  activeTitle: 'novato',
  activeCosmetics: { cape: null, jewelry: null, luxury: null, hud_theme: null, profile_bg: 'free_green' }
};

const App: React.FC = () => {
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [mapOffers, setMapOffers] = useState<MapOffer[]>([]);
  const [activeScreen, setActiveScreen] = useState<'farm' | 'shop' | 'npc' | 'lab' | 'warehouse' | 'profile' | 'map'>('farm');
  const [currentEvent, setCurrentEvent] = useState<string | null>(null);
  const [aiDialogue, setAiDialogue] = useState<string>("");
  const [lastOfferReset, setLastOfferReset] = useState<number>(Date.now());
  const [lastMapReset, setLastMapReset] = useState<number>(Date.now());
  const [notification, setNotification] = useState<string | null>(null);

  // Sistema de Códigos
  const handleActivateCode = (code: string) => {
    const cleanCode = code.toUpperCase().trim();
    if (cleanCode === 'EOLU') {
      setPlayer(p => ({
        ...p,
        unlockedRarities: [Rarity.COMUM_A, Rarity.COMUM_B, Rarity.RARA, Rarity.LENDARIA, Rarity.MISTICA],
        totalReputation: Math.max(p.totalReputation, 500),
        level: Math.max(p.level, 35)
      }));
      return "CONTEÚDO TOTAL DESBLOQUEADO!";
    }
    if (cleanCode === 'GNORICH') {
      setPlayer(p => ({ ...p, coins: 999999999 }));
      return "MOEDAS INFINITAS ATIVADAS!";
    }
    if (cleanCode === 'HASC') {
      setPlayer(p => ({ ...p, hashCoins: 999999999 }));
      return "HASH COINS INFINITOS ATIVADOS!";
    }
    return "CÓDIGO INVÁLIDO";
  };

  useEffect(() => {
    const { totalReputation, level } = player;
    const newUnlocked: Rarity[] = [Rarity.COMUM_A];

    // REGRA 3: Aumento de requisitos das zonas (raridades)
    if (totalReputation >= 18 && level >= 3) newUnlocked.push(Rarity.COMUM_B);
    if (totalReputation >= 75 && level >= 7) newUnlocked.push(Rarity.RARA);
    if (totalReputation >= 180 && level >= 12) newUnlocked.push(Rarity.LENDARIA);
    if (totalReputation >= 450 && level >= 23) newUnlocked.push(Rarity.MISTICA);

    if (JSON.stringify(newUnlocked) !== JSON.stringify(player.unlockedRarities)) {
      setPlayer(prev => ({ ...prev, unlockedRarities: newUnlocked }));
    }
  }, [player.totalReputation, player.level]);

  // Sistema de Recompensas por Nível
  useEffect(() => {
    if (player.experience >= 100) {
      const nextLevel = player.level + 1;
      let rewardSeedId = 'kush_comum';
      let qty = 1;
      let rewardMsg = "Você ganhou uma semente comum!";

      if (nextLevel >= 51) {
        rewardSeedId = 'sticky_icky';
        rewardMsg = "BÔNUS MÍSTICO: Sticky Icky recebida!";
      } else if (nextLevel >= 35) {
        rewardSeedId = 'neon_og';
        rewardMsg = "RECOMPENSA LENDÁRIA: Neon OG recebida!";
      } else if (nextLevel >= 21) {
        rewardSeedId = 'northern_lights';
        qty = 3;
        rewardMsg = "BÔNUS RARO: 3x Northern Lights recebidas!";
      } else if (nextLevel >= 11) {
        rewardSeedId = 'northern_lights';
        rewardMsg = "RECOMPENSA RARA: Northern Lights recebida!";
      } else {
        rewardSeedId = 'lemon_skunk';
        rewardMsg = "Recompensa de nível: Lemon Skunk recebida!";
      }

      setPlayer(prev => ({
        ...prev,
        level: nextLevel,
        experience: prev.experience - 100,
        inventory: {
          ...prev.inventory,
          [rewardSeedId]: (prev.inventory[rewardSeedId] || 0) + qty
        }
      }));

      setNotification(`LEVEL UP! Nível ${nextLevel}. ${rewardMsg}`);
      setTimeout(() => setNotification(null), 4000);
    }
  }, [player.experience]);

  const passiveBonuses = useMemo(() => {
    const fertCount = player.inventory['fertilizante_bio'] || 0;
    const hidroCount = player.inventory['hidro_boost'] || 0;
    const chronoCount = player.inventory['chrono_trigger'] || 0;

    return {
      extraBuds: fertCount * 0.5,
      growthSpeedMultiplier: 1 + (hidroCount * 0.10) + (chronoCount * 0.25)
    };
  }, [player.inventory]);

  const calculateTotalBonus = useCallback(() => {
    let bonus = 0;
    Object.values(player.activeCosmetics).forEach(itemId => {
      if (itemId) {
        const item = LUXURY_ITEMS.find(i => i.id === itemId);
        if (item?.harvestBonus) bonus += item.harvestBonus;
      }
    });
    return bonus;
  }, [player.activeCosmetics]);

  const getZoneMultiplier = (rarity: Rarity): number => {
    switch (rarity) {
      case Rarity.COMUM_B: return 1.1;
      case Rarity.RARA: return 1.3;
      case Rarity.LENDARIA: return 1.6;
      case Rarity.MISTICA: return 2.0;
      default: return 1.0;
    }
  };

  const generateMapOffer = useCallback((territoryId: string, currentPlayer: Player): MapOffer | null => {
    const territory = TERRITORIES.find(t => t.id === territoryId)!;
    const stock = Object.entries(currentPlayer.inventory)
      .filter(([id, qty]) => (id.endsWith('_bud') || id.endsWith('_hash')) && (qty as number) > 0);
    
    let itemId: string;
    if (stock.length > 0) {
      itemId = stock[Math.floor(Math.random() * stock.length)][0];
    } else {
      const seed = SEEDS[0];
      itemId = `${seed.id}_bud`;
    }

    const seedId = itemId.replace('_bud', '').replace('_hash', '');
    const seed = SEEDS.find(s => s.id === seedId)!;
    const isHash = itemId.endsWith('_hash');
    const qty = Math.floor(Math.random() * 3) + 1;

    const seedShopPrice = Math.floor(seed.baseValue * 0.35);
    const itemBaseValue = isHash ? seedShopPrice * 10 : seedShopPrice;
    
    const typeMult = 1.2;
    const zoneMult = getZoneMultiplier(seed.rarity);
    
    let finalPrice = Math.floor(itemBaseValue * qty * typeMult * zoneMult);

    const isPremium = seed.rarity === Rarity.LENDARIA || seed.rarity === Rarity.MISTICA;
    if (!isPremium) {
      finalPrice = Math.min(1000, finalPrice);
    }
    
    const minPrice = itemBaseValue * qty;
    finalPrice = Math.max(minPrice, finalPrice);

    return {
      id: Math.random().toString(36).substr(2, 9),
      territoryId,
      itemId,
      quantity: qty,
      price: finalPrice
    };
  }, []);

  const replenishMapOffers = useCallback(() => {
    setMapOffers(prev => {
      if (prev.length >= MIN_MAP_OFFERS) return prev;
      
      const currentTerritoriesWithOffers = prev.map(o => o.territoryId);
      const availableTerritories = TERRITORIES.filter(t => !currentTerritoriesWithOffers.includes(t.id));
      
      if (availableTerritories.length === 0) return prev;
      
      const newOffers = [...prev];
      const countToAdd = Math.min(availableTerritories.length, MIN_MAP_OFFERS - prev.length);
      
      for(let i=0; i<countToAdd; i++) {
        const targetTerritory = availableTerritories[i];
        const offer = generateMapOffer(targetTerritory.id, player);
        if (offer) newOffers.push(offer);
      }
      return newOffers;
    });
  }, [player, generateMapOffer]);

  const refreshMapOffers = useCallback(() => {
    setLastMapReset(Date.now());
    const newMapOffers: MapOffer[] = [];
    TERRITORIES.forEach(t => {
      const offer = generateMapOffer(t.id, player);
      if (offer) newMapOffers.push(offer);
    });
    setMapOffers(newMapOffers);
  }, [player, generateMapOffer]);

  const generateRandomOffer = useCallback((currentPlayer: Player, forceHash: boolean = false): Offer | null => {
    const inventoryItems = Object.entries(currentPlayer.inventory)
      .filter(([id, qty]) => (id.endsWith('_bud') || id.endsWith('_hash')) && qty > 0)
      .map(([id, qty]) => ({ id, qty }));

    let targetItemId: string;
    let availableSeeds = SEEDS.filter(s => currentPlayer.unlockedRarities.includes(s.rarity));

    if (inventoryItems.length > 0) {
      targetItemId = inventoryItems[Math.floor(Math.random() * inventoryItems.length)].id;
    } else {
      const seed = availableSeeds[Math.floor(Math.random() * availableSeeds.length)];
      if (!seed) return null;
      targetItemId = Math.random() > 0.8 ? `${seed.id}_hash` : `${seed.id}_bud`;
    }

    const seedId = targetItemId.replace('_bud', '').replace('_hash', '');
    const seed = SEEDS.find(s => s.id === seedId)!;
    
    // REGRA 4: Só gera ofertas de compra se o NPC não for sócio (rep < 200)
    const possibleNpcs = NPCS.filter(npc => {
      const isUnlocked = npc.rarityRequired === null || currentPlayer.unlockedRarities.includes(npc.rarityRequired);
      const rep = currentPlayer.reputation[npc.id] || 0;
      return isUnlocked && rep < 200;
    });
    
    if (possibleNpcs.length === 0) return null;
    
    const npc = possibleNpcs[Math.floor(Math.random() * possibleNpcs.length)];
    const isHash = targetItemId.endsWith('_hash');
    
    const currentStock = currentPlayer.inventory[targetItemId] || 0;
    const quantity = currentStock > 0 ? Math.max(1, Math.floor(currentStock * (0.2 + Math.random() * 0.3))) : (isHash ? 1 : 3);

    let currency: 'coins' | 'hashCoins' = forceHash ? 'hashCoins' : 'coins';
    const roll = Math.random();
    if (!forceHash) {
      if (seed.rarity === Rarity.MISTICA) currency = roll < 0.9 ? 'hashCoins' : 'coins';
      else if (seed.rarity === Rarity.LENDARIA) currency = roll < 0.6 ? 'hashCoins' : 'coins';
      else if (seed.rarity === Rarity.RARA) currency = roll < 0.4 ? 'hashCoins' : 'coins';
      else currency = roll < 0.1 ? 'hashCoins' : 'coins';
    }

    const seedShopPrice = Math.floor(seed.baseValue * 0.35);
    const itemBaseValue = isHash ? seedShopPrice * 10 : seedShopPrice;
    const minPrice = itemBaseValue * quantity;

    const isContract = Math.random() > 0.5;
    const typeMult = isContract ? 1.3 : 1.1;
    const zoneMult = getZoneMultiplier(seed.rarity);

    let finalPriceInCoins = Math.floor(itemBaseValue * quantity * typeMult * zoneMult);

    if (currency === 'hashCoins') {
      let finalPrice = Math.max(1, Math.floor(finalPriceInCoins / 800));
      if (seed.rarity === Rarity.MISTICA) finalPrice = Math.max(finalPrice, 50 + Math.floor(Math.random() * 150));
      else if (seed.rarity === Rarity.LENDARIA) finalPrice = Math.max(finalPrice, 20 + Math.floor(Math.random() * 80));
      
      return { 
        id: Math.random().toString(36).substr(2, 9), 
        npcId: npc.id, 
        itemId: targetItemId, 
        quantity, 
        price: finalPrice, 
        currency, 
        reputationAward: 1 // Será recalculado na aceitação
      };
    } else {
      const isPremium = seed.rarity === Rarity.LENDARIA || seed.rarity === Rarity.MISTICA;
      if (!isPremium) {
        finalPriceInCoins = Math.min(1000, finalPriceInCoins);
      }
      finalPriceInCoins = Math.max(minPrice, finalPriceInCoins);

      return { 
        id: Math.random().toString(36).substr(2, 9), 
        npcId: npc.id, 
        itemId: targetItemId, 
        quantity, 
        price: finalPriceInCoins, 
        currency, 
        reputationAward: 1 // Será recalculado na aceitação
      };
    }
  }, []);

  const replenishOffers = useCallback(() => {
    if (player.unlockedRarities.length === 0) return;
    setOffers(prev => {
      if (prev.length >= MIN_NPC_OFFERS) return prev;
      const countToAdd = MIN_NPC_OFFERS - prev.length;
      const newEntries: Offer[] = [];
      for(let i=0; i<countToAdd; i++) {
        const o = generateRandomOffer(player);
        if(o) newEntries.push(o);
      }
      return [...prev, ...newEntries];
    });
  }, [player, generateRandomOffer]);

  const refreshOffers = useCallback(() => {
    setLastOfferReset(Date.now());
    const newOffers: Offer[] = [];
    const offerCount = Math.floor(Math.random() * 3) + MIN_NPC_OFFERS; 
    for(let i=0; i<offerCount; i++) {
      const o = generateRandomOffer(player);
      if(o) newOffers.push(o);
    }
    setOffers(newOffers);
  }, [player, generateRandomOffer]);

  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPlayer(parsed.player);
        setPlots(parsed.plots);
      } catch (e) { console.error("Load failed", e); }
    } else {
      const plotConfig = [
          Rarity.COMUM_A, Rarity.COMUM_A, Rarity.COMUM_A, 
          Rarity.COMUM_B, Rarity.RARA, Rarity.RARA, 
          Rarity.RARA, Rarity.LENDARIA, Rarity.LENDARIA, 
          Rarity.MISTICA, Rarity.MISTICA, Rarity.MISTICA
      ];
      setPlots(plotConfig.map((type, i) => ({
        id: i, type, seedId: null, plantedAt: null, accumulatedGrowth: 0, isWatered: false, isLightOn: false, isPruned: false, isUnlocked: true, isFertilized: false, capacity: 1
      })));
    }
  }, []);

  useEffect(() => {
    if (offers.length < MIN_NPC_OFFERS && player.unlockedRarities.length > 0) replenishOffers();
    if (mapOffers.length < MIN_MAP_OFFERS) replenishMapOffers();
  }, [offers.length, mapOffers.length, player.unlockedRarities, replenishOffers, replenishMapOffers]);

  useEffect(() => {
    if (plots.length > 0) {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ player, plots }));
    }
  }, [player, plots]);

  useEffect(() => {
    const tick = setInterval(() => {
      setPlots(prev => prev.map(plot => {
        if (plot.seedId && plot.isWatered && plot.isLightOn && !plot.isPruned && plot.accumulatedGrowth < 1) {
          const seed = SEEDS.find(s => s.id === plot.seedId);
          if (seed) {
            const increment = (1 / seed.growthTime) * passiveBonuses.growthSpeedMultiplier;
            return { ...plot, accumulatedGrowth: Math.min(1, plot.accumulatedGrowth + increment) };
          }
        }
        return plot;
      }));

      if (Date.now() - lastOfferReset > OFFER_RESET_INTERVAL) refreshOffers();
      if (Date.now() - lastMapReset > MAP_OFFER_RESET_INTERVAL) refreshMapOffers();
    }, 1000);
    return () => clearInterval(tick);
  }, [lastOfferReset, lastMapReset, refreshOffers, refreshMapOffers, passiveBonuses.growthSpeedMultiplier]);

  // REGRA 2: Rebalanceamento Reputação (-40% base e curva por nível/8)
  const calculateReputationGain = (base: number, level: number) => {
    const reducedBase = base * 0.6; // Reduz em 40% (sobra 60%)
    return Math.max(1, Math.floor(reducedBase * (1 / (1 + level / 8))));
  };

  const handleMapSale = (offerId: string, wasBusted: boolean) => {
    const offer = mapOffers.find(o => o.id === offerId);
    if (!offer) return;

    setPlayer(prev => {
      const newInventory = { ...prev.inventory };
      newInventory[offer.itemId] = Math.max(0, (newInventory[offer.itemId] || 0) - offer.quantity);

      if (wasBusted) {
        const lossPercent = 0.04 + (Math.random() * 0.02);
        const fine = Math.floor(prev.coins * lossPercent);
        return { ...prev, coins: Math.max(0, prev.coins - fine), inventory: newInventory };
      }

      const repGain = calculateReputationGain(3, prev.level);

      return {
        ...prev,
        coins: prev.coins + offer.price,
        totalReputation: prev.totalReputation + repGain,
        experience: prev.experience + 5,
        inventory: newInventory,
        stats: {
          ...prev.stats,
          totalSold: (prev.stats.totalSold || 0) + offer.quantity,
          totalEarned: (prev.stats.totalEarned || 0) + offer.price
        }
      };
    });
    setMapOffers(prev => prev.filter(o => o.id !== offerId));
  };

  // REGRA 1: Terrenos por Raridade
  const handlePlant = (plotId: number, seedId: string) => {
    const plot = plots.find(p => p.id === plotId);
    const seed = SEEDS.find(s => s.id === seedId);
    
    if (!plot || !seed) return;

    // Ajuste de raridade simplificado para terrenos comuns
    const isCommonPlot = plot.type === Rarity.COMUM_A || plot.type === Rarity.COMUM_B;
    const isCommonSeed = seed.rarity === Rarity.COMUM_A || seed.rarity === Rarity.COMUM_B;

    const matches = (isCommonPlot && isCommonSeed) || (plot.type === seed.rarity);

    if (!matches) {
      setNotification(`ESTE TERRENO SÓ ACEITA PLANTAS ${RARITY_DISPLAY[plot.type].toUpperCase()}!`);
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (player.inventory[seedId] > 0) {
      setPlots(prev => prev.map(p => p.id === plotId ? { ...p, seedId, plantedAt: Date.now(), accumulatedGrowth: 0, isWatered: false, isLightOn: false, isPruned: false } : p));
      setPlayer(prev => ({ ...prev, stats: { ...prev.stats, totalPlanted: (prev.stats?.totalPlanted || 0) + 1 }, inventory: { ...prev.inventory, [seedId]: prev.inventory[seedId] - 1 } }));
    }
  };

  const handleHarvest = (plotId: number) => {
    const plot = plots.find(p => p.id === plotId);
    if (!plot || !plot.seedId || !plot.isPruned) return;
    const budId = `${plot.seedId}_bud`;
    const bonus = calculateTotalBonus();
    const amount = Math.ceil((plot.capacity + (plot.isFertilized ? 1 : 0) + passiveBonuses.extraBuds) * (1 + bonus)); 
    setPlayer(prev => ({ ...prev, inventory: { ...prev.inventory, [budId]: (prev.inventory[budId] || 0) + amount } }));
    setPlots(prev => prev.map(p => p.id === plotId ? { ...p, seedId: null, plantedAt: null, accumulatedGrowth: 0, isWatered: false, isLightOn: false, isPruned: false, isFertilized: false } : p));
  };

  const handleBuy = (seedId: string, cost: number, useHashCoin: boolean = false) => {
    const seed = SEEDS.find(s => s.id === seedId);
    if (!seed) return;
    if (useHashCoin ? player.hashCoins >= cost : player.coins >= cost) {
      setPlayer(prev => ({
        ...prev,
        coins: useHashCoin ? prev.coins : prev.coins - cost,
        hashCoins: useHashCoin ? prev.hashCoins - cost : prev.hashCoins,
        inventory: { ...prev.inventory, [seedId]: (prev.inventory[seedId] || 0) + 1 }
      }));
    }
  };

  // Lógica de compra de NPCs sócios (venda do NPC para o player)
  const handleBuyFromNPC = (offer: Offer) => {
    const canAfford = offer.currency === 'coins' ? player.coins >= offer.price : player.hashCoins >= offer.price;
    if (canAfford) {
      setPlayer(prev => ({
        ...prev,
        coins: offer.currency === 'coins' ? prev.coins - offer.price : prev.coins,
        hashCoins: offer.currency === 'hashCoins' ? prev.hashCoins - offer.price : prev.hashCoins,
        inventory: { ...prev.inventory, [offer.itemId]: (prev.inventory[offer.itemId] || 0) + offer.quantity }
      }));
    }
  };

  const handleAcceptOffer = (offer: Offer) => {
    const qty = player.inventory[offer.itemId] || 0;
    if (qty >= offer.quantity) {
      const repGain = calculateReputationGain(5, player.level);
      
      setPlayer(prev => ({
        ...prev,
        coins: offer.currency === 'coins' ? prev.coins + offer.price : prev.coins,
        hashCoins: offer.currency === 'hashCoins' ? prev.hashCoins + offer.price : prev.hashCoins,
        totalReputation: prev.totalReputation + repGain,
        experience: prev.experience + 10,
        inventory: { ...prev.inventory, [offer.itemId]: qty - offer.quantity },
        reputation: { ...prev.reputation, [offer.npcId]: (prev.reputation[offer.npcId] || 0) + repGain },
        stats: { ...prev.stats, totalSold: (prev.stats?.totalSold || 0) + offer.quantity, totalEarned: (prev.stats?.totalEarned || 0) + (offer.currency === 'coins' ? offer.price : 0) }
      }));
      setOffers(prevOffers => prevOffers.filter(o => o.id !== offer.id));
    }
  };

  const handleUpgradePlot = (id: number) => {
    const plot = plots.find(p => p.id === id);
    if(!plot) return;
    const cost = UPGRADE_COSTS[plot.type];
    if(player.coins >= cost.coins && player.hashCoins >= cost.hash) {
      setPlayer(prev => ({...prev, coins: prev.coins - cost.coins, hashCoins: prev.hashCoins - cost.hash}));
      setPlots(p => p.map(x => x.id === id ? {...x, capacity: x.capacity + 1} : x));
    }
  };

  const handleBuyLuxury = (itemId: string) => {
    const item = LUXURY_ITEMS.find(i => i.id === itemId);
    if (!item || player.ownedLuxuryItems.includes(itemId)) return;
    const canAfford = item.currency === 'coins' ? player.coins >= item.price : player.hashCoins >= item.price;
    if (canAfford) {
      setPlayer(prev => ({ ...prev, coins: item.currency === 'coins' ? prev.coins - item.price : prev.coins, hashCoins: item.currency === 'hashCoins' ? prev.hashCoins - item.price : prev.hashCoins, ownedLuxuryItems: [...prev.ownedLuxuryItems, itemId] }));
    }
  };

  const getConsumablePrice = useCallback((itemId: string, basePrice: number) => {
    const count = player.inventory[itemId] || 0;
    return Math.floor(basePrice * Math.pow(2.2, count)); 
  }, [player.inventory]);

  const handleBuyConsumable = (itemId: string) => {
    const item = CONSUMABLES.find(i => i.id === itemId);
    if (!item) return;
    
    const count = player.inventory[item.id] || 0;
    if (count >= 20) {
      setNotification("NÍVEL MÁXIMO ATINGIDO!");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const currentPrice = getConsumablePrice(item.id, item.price);
    const canAfford = item.currency === 'coins' ? player.coins >= currentPrice : player.hashCoins >= currentPrice;
    if (canAfford) {
      setPlayer(prev => ({ ...prev, coins: item.currency === 'coins' ? prev.coins - currentPrice : prev.coins, hashCoins: item.currency === 'hashCoins' ? prev.hashCoins - currentPrice : prev.hashCoins, inventory: { ...prev.inventory, [item.id]: (prev.inventory[item.id] || 0) + 1 } }));
    }
  };

  const handleToggleCosmetic = (itemId: string) => {
    const item = LUXURY_ITEMS.find(i => i.id === itemId);
    if (!item || !player.ownedLuxuryItems.includes(itemId)) return;
    setPlayer(prev => ({ ...prev, activeCosmetics: { ...prev.activeCosmetics, [item.category]: prev.activeCosmetics[item.category] === itemId ? null : itemId } }));
  };

  const handleUpdateName = (name: string) => {
    const isFemale = name.toLowerCase().endsWith('a') || name.toLowerCase().endsWith('ia') || name.toLowerCase().endsWith('na');
    const gender = isFemale ? 'female' : 'male';
    const avatarId = isFemale ? 'f1' : 'm1';
    setPlayer(p => ({...p, name, gender, avatarId}));
  };

  return (
    <div className="h-screen w-full psychedelic-bg text-white flex flex-col overflow-hidden select-none">
      <HUD player={player} currentEvent={currentEvent} onOpenProfile={() => setActiveScreen('profile')} onOpenMap={() => setActiveScreen('map')} totalBonus={calculateTotalBonus()} passiveBonuses={passiveBonuses} onActivateCode={handleActivateCode} />
      
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-indigo-600/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-[0_0_30px_rgba(99,102,241,0.5)] animate-in slide-in-from-top duration-500">
           <p className="font-cartoon text-xs text-center">{notification}</p>
        </div>
      )}

      <main className="flex-1 overflow-y-auto pt-4 px-4 custom-scrollbar pb-10">
        {activeScreen === 'farm' && <FarmGrid plots={plots} onPlant={handlePlant} onWater={(id) => setPlots(p => p.map(x => x.id === id ? {...x, isWatered: true} : x))} onToggleLight={(id) => setPlots(p => p.map(x => x.id === id ? {...x, isLightOn: !x.isLightOn} : x))} onPrune={(id) => setPlots(p => p.map(x => x.id === id ? {...x, isPruned: true} : x))} onHarvest={handleHarvest} onUpgrade={handleUpgradePlot} inventory={player.inventory} player={player} />}
        {activeScreen === 'warehouse' && <Warehouse player={player} onBack={() => setActiveScreen('farm')} />}
        {activeScreen === 'shop' && <Shop player={player} plots={plots} onBuy={handleBuy} onUpgradePlot={handleUpgradePlot} onBuyLuxury={handleBuyLuxury} onBuyConsumable={handleBuyConsumable} getConsumablePrice={getConsumablePrice} onBack={() => setActiveScreen('farm')} />}
        {activeScreen === 'npc' && <NPCPanel player={player} offers={offers} onAcceptOffer={handleAcceptOffer} onBuyFromNPC={handleBuyFromNPC} onBack={() => setActiveScreen('farm')} aiDialogue={aiDialogue} onGreet={(n) => {}} offerResetIn={OFFER_RESET_INTERVAL - (Date.now() - lastOfferReset)} />}
        {activeScreen === 'lab' && <Fabrication player={player} onFabricate={(id) => {
          // REGRA 2: Extração garantindo produto correto e inventário atualizado
          const budId = `${id}_bud`;
          const hashId = `${id}_hash`;
          const qty = player.inventory[budId] || 0;
          if(qty >= 10) {
            setPlayer(prev => ({
              ...prev, 
              inventory: {
                ...prev.inventory, 
                [budId]: qty - 10, 
                [hashId]: (prev.inventory[hashId] || 0) + 1
              }
            }));
            setNotification("EXTRAÇÃO CONCLUÍDA!");
            setTimeout(() => setNotification(null), 2000);
          }
        }} onBack={() => setActiveScreen('farm')} />}
        {activeScreen === 'profile' && <ProfileView player={player} onBuyLuxury={handleBuyLuxury} onToggleCosmetic={handleToggleCosmetic} onSetAvatar={(a, g) => setPlayer(p => ({...p, avatarId: a, gender: g}))} onBuyTitle={(t, p) => {}} onSetTitle={(t) => setPlayer(p => ({...p, activeTitle: t}))} onUpdateName={handleUpdateName} onBack={() => setActiveScreen('farm')} />}
        {activeScreen === 'map' && <CityMap player={player} mapOffers={mapOffers} onSale={handleMapSale} onBack={() => setActiveScreen('farm')} />}
      </main>
      <BottomNav activeScreen={activeScreen === 'map' ? 'farm' : activeScreen} onNavigate={setActiveScreen} />
      <EventOverlay currentEvent={currentEvent} />
    </div>
  );
};

export default App;
