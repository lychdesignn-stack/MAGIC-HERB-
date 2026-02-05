
import React, { useState, useEffect, useCallback } from 'react';
import { Player, Plot, Rarity, Offer } from './types';
import { SEEDS, NPCS, LUXURY_ITEMS, UPGRADE_COSTS, UPGRADE_LIMITS, CONSUMABLES, TITLES } from './constants';
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
import { GoogleGenAI } from "@google/genai";

const OFFER_RESET_INTERVAL = 2 * 60 * 1000; 
const SAVE_KEY = 'HERB_HAVEN_SAVE_V14'; 

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
  stats: { totalPlanted: 0, totalSold: 0, totalEarned: 0 },
  inventory: createInitialInventory(),
  reputation: NPCS.reduce((acc, npc) => ({ ...acc, [npc.id]: 0 }), {}),
  unlockedRarities: [Rarity.COMMON],
  ownedLuxuryItems: ['free_green', 'free_blue', 'free_red', 'free_gray'],
  ownedTitles: ['novato'],
  activeTitle: 'novato',
  activeCosmetics: { cape: null, jewelry: null, luxury: null, hud_theme: null, profile_bg: 'free_green' }
};

const App: React.FC = () => {
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [activeScreen, setActiveScreen] = useState<'farm' | 'shop' | 'npc' | 'lab' | 'warehouse' | 'profile' | 'map'>('farm');
  const [currentEvent, setCurrentEvent] = useState<string | null>(null);
  const [aiDialogue, setAiDialogue] = useState<string>("");
  const [lastOfferReset, setLastOfferReset] = useState<number>(Date.now());

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

  const generateRandomOffer = useCallback((currentPlayer: Player, forceHash: boolean = false): Offer | null => {
    const inventoryItems = Object.entries(currentPlayer.inventory)
      .filter(([id, qty]) => (id.endsWith('_bud') || id.endsWith('_hash')) && qty > 0)
      .map(([id, qty]) => ({ id, qty }));

    let targetItemId: string;
    let availableSeeds = SEEDS.filter(s => currentPlayer.unlockedRarities.includes(s.rarity));

    if (inventoryItems.length > 0) {
      const randomStock = inventoryItems[Math.floor(Math.random() * inventoryItems.length)];
      targetItemId = randomStock.id;
    } else {
      const seed = availableSeeds[Math.floor(Math.random() * availableSeeds.length)];
      targetItemId = Math.random() > 0.8 ? `${seed.id}_hash` : `${seed.id}_bud`;
    }

    const seedId = targetItemId.replace('_bud', '').replace('_hash', '');
    const seed = SEEDS.find(s => s.id === seedId)!;
    const possibleNpcs = NPCS.filter(npc => npc.rarityRequired === null || currentPlayer.unlockedRarities.includes(npc.rarityRequired));
    const npc = possibleNpcs[Math.floor(Math.random() * possibleNpcs.length)];
    const isHash = targetItemId.endsWith('_hash');
    const currentStock = currentPlayer.inventory[targetItemId] || 0;
    
    let quantity: number;
    const levelBonusQty = Math.floor(currentPlayer.level / 5);
    if (currentStock > 0) {
      quantity = Math.max(1, Math.floor(currentStock * (0.4 + Math.random() * 0.6)));
    } else {
      quantity = (isHash ? (Math.floor(Math.random() * 2) + 1) : (Math.floor(Math.random() * 4) + 2)) + levelBonusQty;
    }

    let currency: 'coins' | 'hashCoins' = forceHash ? 'hashCoins' : 'coins';
    if (!forceHash) {
      if (seed.rarity === Rarity.LEGENDARY || seed.rarity === Rarity.MYTHIC) {
        currency = Math.random() > 0.4 ? 'hashCoins' : 'coins';
      } else if (seed.rarity === Rarity.RARE) {
        currency = Math.random() > 0.85 ? 'hashCoins' : 'coins';
      }
    }

    const totalWealth = currentPlayer.coins + (currentPlayer.hashCoins * 1000);
    const wealthFactor = Math.max(0.4, Math.pow(Math.max(1, totalWealth) / 1000, 0.32));

    let baseValue = isHash ? seed.baseValue * 4.8 : seed.baseValue * 1.2;
    let finalPrice: number;

    if (currency === 'hashCoins') {
      const hashBase = (baseValue * quantity * npc.multiplier * wealthFactor) / 850;
      finalPrice = Math.max(1, Math.floor(hashBase));
    } else {
      finalPrice = Math.floor(baseValue * quantity * npc.multiplier * wealthFactor);
    }
    
    return { 
      id: Math.random().toString(36).substr(2, 9), 
      npcId: npc.id, 
      itemId: targetItemId, 
      quantity, 
      price: finalPrice, 
      currency, 
      reputationAward: Math.floor(15 * npc.multiplier) 
    };
  }, []);

  const refreshOffers = useCallback(() => {
    setLastOfferReset(Date.now());
    const newOffers: Offer[] = [];
    const offerCount = player.level >= 10 ? 5 : 4;
    
    for(let i=0; i<offerCount; i++) {
      const o = generateRandomOffer(player);
      if(o) newOffers.push(o);
    }

    if (newOffers.length > 0 && !newOffers.some(o => o.currency === 'hashCoins')) {
      const indexToConvert = Math.floor(Math.random() * newOffers.length);
      const forcedOffer = generateRandomOffer(player, true);
      if (forcedOffer) {
        newOffers[indexToConvert] = forcedOffer;
      }
    }
    
    setOffers(newOffers);
  }, [player, generateRandomOffer]);

  const handleBuyTitle = useCallback((titleId: string, price: number) => {
    if (player.hashCoins >= price && !player.ownedTitles.includes(titleId)) {
      setPlayer(prev => ({
        ...prev,
        hashCoins: prev.hashCoins - price,
        ownedTitles: [...prev.ownedTitles, titleId]
      }));
    }
  }, [player]);

  useEffect(() => {
    const buyHandler = (e: any) => {
      handleBuyTitle(e.detail.id, e.detail.price);
    };
    window.addEventListener('BUY_TITLE', buyHandler);
    return () => window.removeEventListener('BUY_TITLE', buyHandler);
  }, [handleBuyTitle]);

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
          Rarity.COMMON, Rarity.COMMON, Rarity.COMMON, 
          Rarity.COMMON, Rarity.RARE, Rarity.RARE, 
          Rarity.RARE, Rarity.LEGENDARY, Rarity.LEGENDARY, 
          Rarity.MYTHIC, Rarity.MYTHIC, Rarity.MYTHIC
      ];

      const initialPlots: Plot[] = plotConfig.map((type, i) => ({
        id: i,
        type,
        seedId: null,
        plantedAt: null,
        accumulatedGrowth: 0,
        isWatered: false,
        isLightOn: false,
        isPruned: false,
        isUnlocked: true,
        isFertilized: false,
        capacity: 1
      }));
      setPlots(initialPlots);
    }
  }, []);

  useEffect(() => {
    if (offers.length === 0 && player.unlockedRarities.length > 0) {
      refreshOffers();
    }
  }, [offers.length, player.unlockedRarities.length, refreshOffers]);

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
            const increment = 1 / seed.growthTime;
            return { ...plot, accumulatedGrowth: Math.min(1, plot.accumulatedGrowth + increment) };
          }
        }
        return plot;
      }));

      if (Date.now() - lastOfferReset > OFFER_RESET_INTERVAL) {
        refreshOffers();
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [lastOfferReset, refreshOffers]);

  const handlePlant = (plotId: number, seedId: string) => {
    if (player.inventory[seedId] > 0) {
      setPlots(prev => prev.map(p => 
        p.id === plotId ? { ...p, seedId, plantedAt: Date.now(), accumulatedGrowth: 0, isWatered: false, isLightOn: false, isPruned: false } : p
      ));
      setPlayer(prev => ({
        ...prev,
        stats: { ...prev.stats, totalPlanted: (prev.stats?.totalPlanted || 0) + 1 },
        inventory: { ...prev.inventory, [seedId]: prev.inventory[seedId] - 1 }
      }));
    }
  };

  const handleHarvest = (plotId: number) => {
    const plot = plots.find(p => p.id === plotId);
    if (!plot || !plot.seedId || !plot.isPruned) return;
    const budId = `${plot.seedId}_bud`;
    const bonus = calculateTotalBonus();
    const amount = Math.ceil((plot.capacity + (plot.isFertilized ? 1 : 0)) * (1 + bonus)); 
    
    setPlayer(prev => ({ 
      ...prev, 
      inventory: { ...prev.inventory, [budId]: (prev.inventory[budId] || 0) + amount },
      level: prev.level + (0.05 * plot.capacity)
    }));
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
        inventory: { ...prev.inventory, [seedId]: (prev.inventory[seedId] || 0) + 1 },
        unlockedRarities: prev.unlockedRarities.includes(seed.rarity) ? prev.unlockedRarities : [...prev.unlockedRarities, seed.rarity]
      }));
    }
  };

  const handleAcceptOffer = (offer: Offer) => {
    const qty = player.inventory[offer.itemId] || 0;
    if (qty >= offer.quantity) {
      setPlayer(prev => ({
        ...prev,
        coins: offer.currency === 'coins' ? prev.coins + offer.price : prev.coins,
        hashCoins: offer.currency === 'hashCoins' ? prev.hashCoins + offer.price : prev.hashCoins,
        inventory: { ...prev.inventory, [offer.itemId]: qty - offer.quantity },
        reputation: { ...prev.reputation, [offer.npcId]: (prev.reputation[offer.npcId] || 0) + offer.reputationAward },
        stats: {
          ...prev.stats,
          totalSold: (prev.stats?.totalSold || 0) + offer.quantity,
          totalEarned: (prev.stats?.totalEarned || 0) + (offer.currency === 'coins' ? offer.price : 0)
        }
      }));
      setOffers(prev => prev.filter(o => o.id !== offer.id));
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
      setPlayer(prev => ({
        ...prev,
        coins: item.currency === 'coins' ? prev.coins - item.price : prev.coins,
        hashCoins: item.currency === 'hashCoins' ? prev.hashCoins - item.price : prev.hashCoins,
        ownedLuxuryItems: [...prev.ownedLuxuryItems, itemId]
      }));
    }
  };

  const handleBuyConsumable = (itemId: string) => {
    const item = CONSUMABLES.find(i => i.id === itemId);
    if (!item) return;
    const canAfford = item.currency === 'coins' ? player.coins >= item.price : player.hashCoins >= item.price;
    if (canAfford) {
      setPlayer(prev => ({
        ...prev,
        coins: item.currency === 'coins' ? prev.coins - item.price : prev.coins,
        hashCoins: item.currency === 'hashCoins' ? prev.hashCoins - item.price : prev.hashCoins,
        inventory: { ...prev.inventory, [item.id]: (prev.inventory[item.id] || 0) + 1 }
      }));
    }
  };

  const handleToggleCosmetic = (itemId: string) => {
    const item = LUXURY_ITEMS.find(i => i.id === itemId);
    if (!item || !player.ownedLuxuryItems.includes(itemId)) return;
    setPlayer(prev => {
      const current = prev.activeCosmetics[item.category];
      return {
        ...prev,
        activeCosmetics: {
          ...prev.activeCosmetics,
          [item.category]: current === itemId ? null : itemId
        }
      };
    });
  };

  const handleSetAvatar = (avatarId: string, gender: 'male' | 'female') => {
    setPlayer(prev => ({ ...prev, avatarId, gender }));
  };

  const handleSetTitle = (titleId: string) => {
    if (player.ownedTitles.includes(titleId)) {
      setPlayer(prev => ({ ...prev, activeTitle: titleId }));
    }
  };

  const handleGreet = async (npcName: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const npc = NPCS.find(n => n.name === npcName);
      const prompt = `Saudação curta (10 palavras) para o NPC ${npcName}. Estilo: ${npc?.dialogue}.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiDialogue(response.text || "Salve.");
    } catch (e) {
      setAiDialogue("O que tem pra hoje?");
    }
  };

  return (
    <div className="h-screen w-full psychedelic-bg text-white flex flex-col overflow-hidden select-none">
      <HUD player={player} currentEvent={currentEvent} onOpenProfile={() => setActiveScreen('profile')} onOpenMap={() => setActiveScreen('map')} totalBonus={calculateTotalBonus()} />
      <main className="flex-1 overflow-y-auto pt-4 px-4 custom-scrollbar pb-10">
        {activeScreen === 'farm' && <FarmGrid plots={plots} onPlant={handlePlant} onWater={(id) => setPlots(p => p.map(x => x.id === id ? {...x, isWatered: true} : x))} onToggleLight={(id) => setPlots(p => p.map(x => x.id === id ? {...x, isLightOn: !x.isLightOn} : x))} onPrune={(id) => setPlots(p => p.map(x => x.id === id ? {...x, isPruned: true} : x))} onHarvest={handleHarvest} onUpgrade={handleUpgradePlot} inventory={player.inventory} player={player} />}
        {activeScreen === 'warehouse' && <Warehouse player={player} onBack={() => setActiveScreen('farm')} />}
        {activeScreen === 'shop' && <Shop player={player} plots={plots} onBuy={handleBuy} onUpgradePlot={handleUpgradePlot} onBuyLuxury={handleBuyLuxury} onBuyConsumable={handleBuyConsumable} onBack={() => setActiveScreen('farm')} />}
        {activeScreen === 'npc' && <NPCPanel player={player} offers={offers} onAcceptOffer={handleAcceptOffer} onBack={() => setActiveScreen('farm')} aiDialogue={aiDialogue} onGreet={handleGreet} offerResetIn={OFFER_RESET_INTERVAL - (Date.now() - lastOfferReset)} />}
        {activeScreen === 'lab' && <Fabrication player={player} onFabricate={(id) => {
          const budId = `${id}_bud`;
          const hashId = `${id}_hash`;
          if((player.inventory[budId] || 0) >= 10) { 
             setPlayer(prev => ({...prev, inventory: {...prev.inventory, [budId]: (prev.inventory[budId] || 0) - 10, [hashId]: (prev.inventory[hashId] || 0) + 1}}));
          }
        }} onBack={() => setActiveScreen('farm')} />}
        {activeScreen === 'profile' && <ProfileView player={player} onBuyLuxury={handleBuyLuxury} onToggleCosmetic={handleToggleCosmetic} onSetAvatar={handleSetAvatar} onBuyTitle={handleBuyTitle} onSetTitle={handleSetTitle} onUpdateName={(n) => setPlayer(p => ({...p, name: n}))} onBack={() => setActiveScreen('farm')} />}
        {activeScreen === 'map' && <CityMap player={player} onSale={() => {}} onBack={() => setActiveScreen('farm')} offers={offers} />}
      </main>
      <BottomNav activeScreen={activeScreen === 'map' ? 'farm' : activeScreen} onNavigate={setActiveScreen} />
      <EventOverlay currentEvent={currentEvent} />
    </div>
  );
};

export default App;
