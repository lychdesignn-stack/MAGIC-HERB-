
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

const OFFER_RESET_INTERVAL = 5 * 60 * 1000; 
const SAVE_KEY = 'HERB_HAVEN_SAVE_V8'; 

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
  ownedLuxuryItems: [],
  ownedTitles: ['novato'],
  activeTitle: 'novato',
  activeCosmetics: { cape: null, jewelry: null, luxury: null, hud_theme: null }
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

  const generateRandomOffer = useCallback((currentPlayer: Player): Offer | null => {
    const unlockedNpcs = NPCS.filter(npc => npc.rarityRequired === null || currentPlayer.unlockedRarities.includes(npc.rarityRequired));
    if (unlockedNpcs.length === 0) return null;
    
    const npc = unlockedNpcs[Math.floor(Math.random() * unlockedNpcs.length)];
    const availableSeeds = SEEDS.filter(s => currentPlayer.unlockedRarities.includes(s.rarity));
    const seed = availableSeeds[Math.floor(Math.random() * availableSeeds.length)];
    
    const isHash = Math.random() > 0.75;
    const itemId = isHash ? `${seed.id}_hash` : `${seed.id}_bud`;
    
    let quantity = isHash ? (Math.floor(Math.random() * 2) + 1) : (Math.floor(Math.random() * 6) + 3);
    
    let currency: 'coins' | 'hashCoins' = 'coins';
    if (seed.rarity === Rarity.LEGENDARY || seed.rarity === Rarity.MYTHIC) {
      currency = Math.random() > 0.4 ? 'hashCoins' : 'coins';
    } else if (seed.rarity === Rarity.RARE) {
      currency = Math.random() > 0.9 ? 'hashCoins' : 'coins';
    }

    let baseValue = isHash ? seed.baseValue * 4.5 : seed.baseValue;
    let finalPrice: number;

    if (currency === 'hashCoins') {
      finalPrice = Math.max(1, Math.floor((baseValue * quantity * npc.multiplier) / 500));
    } else {
      finalPrice = Math.floor(baseValue * quantity * npc.multiplier);
    }
    
    return { 
      id: Math.random().toString(36).substr(2, 9), 
      npcId: npc.id, 
      itemId, 
      quantity, 
      price: finalPrice, 
      currency, 
      reputationAward: Math.floor(12 * npc.multiplier) 
    };
  }, []);

  const refreshOffers = useCallback(() => {
    setLastOfferReset(Date.now());
    const newOffers: Offer[] = [];
    for(let i=0; i<4; i++) {
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
      const initialPlots: Plot[] = Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        type: i < 2 ? Rarity.COMMON : i < 4 ? Rarity.RARE : i < 6 ? Rarity.LEGENDARY : Rarity.MYTHIC,
        seedId: null,
        plantedAt: null,
        isWatered: false,
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
      setPlots(prev => [...prev]);
      if (Date.now() - lastOfferReset > OFFER_RESET_INTERVAL) {
        refreshOffers();
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [lastOfferReset, refreshOffers]);

  const handlePlant = (plotId: number, seedId: string) => {
    if (player.inventory[seedId] > 0) {
      setPlots(prev => prev.map(p => 
        p.id === plotId ? { ...p, seedId, plantedAt: Date.now(), isWatered: false, isPruned: false } : p
      ));
      setPlayer(prev => ({
        ...prev,
        stats: { ...prev.stats, totalPlanted: prev.stats.totalPlanted + 1 },
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
      level: prev.level + (0.04 * plot.capacity)
    }));
    setPlots(prev => prev.map(p => p.id === plotId ? { ...p, seedId: null, plantedAt: null, isWatered: false, isPruned: false, isFertilized: false } : p));
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

  const handleStreetSale = (itemId: string, quantity: number, price: number, wasBusted: boolean) => {
    if (wasBusted) {
      const penalty = Math.floor(player.coins * 0.15);
      setPlayer(prev => ({
        ...prev,
        coins: Math.max(0, prev.coins - penalty),
        inventory: { ...prev.inventory, [itemId]: (prev.inventory[itemId] || 0) - quantity }
      }));
    } else {
      setPlayer(prev => ({
        ...prev,
        coins: prev.coins + price,
        inventory: { ...prev.inventory, [itemId]: (prev.inventory[itemId] || 0) - quantity },
        stats: { ...prev.stats, totalSold: prev.stats.totalSold + quantity, totalEarned: prev.stats.totalEarned + price },
        level: prev.level + 0.1
      }));
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
        inventory: { ...prev.inventory, [itemId]: (prev.inventory[itemId] || 0) + 1 }
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
          totalSold: prev.stats.totalSold + offer.quantity,
          totalEarned: prev.stats.totalEarned + (offer.currency === 'coins' ? offer.price : 0)
        }
      }));
      setOffers(prev => prev.filter(o => o.id !== offer.id));
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

  const handleBuyTitle = (titleId: string, price: number) => {
    if (player.hashCoins >= price && !player.ownedTitles.includes(titleId)) {
      setPlayer(prev => ({
        ...prev,
        hashCoins: prev.hashCoins - price,
        ownedTitles: [...prev.ownedTitles, titleId]
      }));
    }
  };

  const handleSetTitle = (titleId: string) => {
    if (player.ownedTitles.includes(titleId)) {
      setPlayer(prev => ({ ...prev, activeTitle: titleId }));
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
        {activeScreen === 'farm' && <FarmGrid plots={plots} onPlant={handlePlant} onWater={(id) => setPlots(p => p.map(x => x.id === id ? {...x, isWatered: true} : x))} onPrune={(id) => setPlots(p => p.map(x => x.id === id ? {...x, isPruned: true} : x))} onHarvest={handleHarvest} onUpgrade={handleUpgradePlot} inventory={player.inventory} player={player} />}
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
        {activeScreen === 'map' && <CityMap player={player} onSale={handleStreetSale} onBack={() => setActiveScreen('farm')} offers={offers} />}
      </main>
      <BottomNav activeScreen={activeScreen === 'map' ? 'farm' : activeScreen} onNavigate={setActiveScreen} />
      <EventOverlay currentEvent={currentEvent} />
    </div>
  );
};

export default App;
