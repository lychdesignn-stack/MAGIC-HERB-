
import React, { useState, useEffect, useCallback } from 'react';
import { Player, Plot, Rarity, Offer } from './types';
import { SEEDS, NPCS, LUXURY_ITEMS, UPGRADE_COSTS, UPGRADE_LIMITS } from './constants';
import FarmGrid from './components/FarmGrid';
import BottomNav from './components/BottomNav';
import HUD from './components/HUD';
import Shop from './components/Shop';
import NPCPanel from './components/NPCPanel';
import Fabrication from './components/Fabrication';
import Warehouse from './components/Warehouse';
import ProfileView from './components/ProfileView';
import EventOverlay from './components/EventOverlay';
import { GoogleGenAI } from "@google/genai";

const OFFER_RESET_INTERVAL = 20 * 60 * 1000;

const createInitialInventory = () => {
  const inv: Record<string, number> = {};
  SEEDS.forEach(s => {
    inv[s.id] = s.id === 'kush_comum' ? 3 : 0;
    inv[`${s.id}_bud`] = 0;
    inv[`${s.id}_hash`] = 0;
  });
  return inv;
};

const INITIAL_PLAYER: Player = {
  gender: 'male',
  coins: 500,
  hashCoins: 0,
  level: 1,
  inventory: createInitialInventory(),
  reputation: NPCS.reduce((acc, npc) => ({ ...acc, [npc.id]: 0 }), {}),
  unlockedRarities: [Rarity.COMMON],
  ownedLuxuryItems: [],
  activeCosmetics: {
    cape: null,
    jewelry: null,
    luxury: null,
    hud_theme: null
  }
};

const App: React.FC = () => {
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [activeScreen, setActiveScreen] = useState<'farm' | 'shop' | 'npc' | 'lab' | 'warehouse' | 'profile'>('farm');
  const [currentEvent, setCurrentEvent] = useState<string | null>(null);
  const [aiDialogue, setAiDialogue] = useState<string>("");
  const [lastOfferReset, setLastOfferReset] = useState<number>(Date.now());

  const generateRandomOffer = useCallback((currentPlayer: Player): Offer | null => {
    const unlockedNpcs = NPCS.filter(npc => 
      npc.rarityRequired === null || currentPlayer.unlockedRarities.includes(npc.rarityRequired)
    );
    if (unlockedNpcs.length === 0) return null;
    const availableSeeds = SEEDS.filter(s => currentPlayer.unlockedRarities.includes(s.rarity));
    if (availableSeeds.length === 0) return null;

    const npc = unlockedNpcs[Math.floor(Math.random() * unlockedNpcs.length)];
    const seed = availableSeeds[Math.floor(Math.random() * availableSeeds.length)];
    const isHash = Math.random() > 0.6;
    const itemId = isHash ? `${seed.id}_hash` : `${seed.id}_bud`;
    const quantity = isHash ? (Math.floor(Math.random() * 2) + 1) : (Math.floor(Math.random() * 6) + 2);
    const canBeHashCoin = seed.rarity !== Rarity.COMMON && Math.random() > 0.8;
    const currency = canBeHashCoin ? 'hashCoins' : 'coins';
    
    let basePrice = isHash ? seed.baseValue * 5.8 : seed.baseValue * 1.1;
    if (currency === 'hashCoins') basePrice = Math.max(1, Math.floor(basePrice / 120));
    
    const repBonus = 1 + (currentPlayer.reputation[npc.id] || 0) / 2000;
    const price = Math.floor(basePrice * quantity * npc.multiplier * repBonus);

    return { id: Math.random().toString(36).substr(2, 9), npcId: npc.id, itemId, quantity, price, currency, reputationAward: currency === 'hashCoins' ? 30 : 10 };
  }, []);

  useEffect(() => {
    const initialPlots: Plot[] = [
      { id: 0, type: Rarity.COMMON, seedId: null, plantedAt: null, isWatered: false, isPruned: false, isUnlocked: true, isFertilized: false, capacity: 1 },
      { id: 1, type: Rarity.COMMON, seedId: null, plantedAt: null, isWatered: false, isPruned: false, isUnlocked: true, isFertilized: false, capacity: 1 },
      { id: 2, type: Rarity.RARE, seedId: null, plantedAt: null, isWatered: false, isPruned: false, isUnlocked: true, isFertilized: false, capacity: 1 },
      { id: 3, type: Rarity.RARE, seedId: null, plantedAt: null, isWatered: false, isPruned: false, isUnlocked: true, isFertilized: false, capacity: 1 },
      { id: 4, type: Rarity.LEGENDARY, seedId: null, plantedAt: null, isWatered: false, isPruned: false, isUnlocked: true, isFertilized: false, capacity: 1 },
      { id: 5, type: Rarity.LEGENDARY, seedId: null, plantedAt: null, isWatered: false, isPruned: false, isUnlocked: true, isFertilized: false, capacity: 1 },
    ];
    setPlots(initialPlots);
    
    const initialOffers: Offer[] = [];
    for(let i=0; i<3; i++) {
        const o = generateRandomOffer(player);
        if(o) initialOffers.push(o);
    }
    setOffers(initialOffers);
  }, []);

  useEffect(() => {
    const tick = setInterval(() => {
      setPlots(prev => [...prev]);
      const timeSinceReset = Date.now() - lastOfferReset;
      if (timeSinceReset > OFFER_RESET_INTERVAL) {
        setLastOfferReset(Date.now());
        const newOffers: Offer[] = [];
        for(let i=0; i<3; i++) {
          const o = generateRandomOffer(player);
          if(o) newOffers.push(o);
        }
        setOffers(newOffers);
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [offers, player, lastOfferReset, generateRandomOffer]);

  const handlePlant = (plotId: number, seedId: string) => {
    const seed = SEEDS.find(s => s.id === seedId);
    const plot = plots.find(p => p.id === plotId);
    if (seed && plot && seed.rarity !== plot.type) return;

    if (player.inventory[seedId] > 0) {
      setPlots(prev => prev.map(p => 
        p.id === plotId ? { ...p, seedId, plantedAt: Date.now(), isWatered: false, isPruned: false } : p
      ));
      setPlayer(prev => ({
        ...prev,
        inventory: { ...prev.inventory, [seedId]: prev.inventory[seedId] - 1 }
      }));
    }
  };

  const handleUpgradePlot = (plotId: number) => {
    const plot = plots.find(p => p.id === plotId);
    if (!plot) return;
    const max = UPGRADE_LIMITS[plot.type];
    if (plot.capacity >= max) return;

    const costs = UPGRADE_COSTS[plot.type];
    if (player.coins >= costs.coins && player.hashCoins >= costs.hash) {
      setPlayer(prev => ({
        ...prev,
        coins: prev.coins - costs.coins,
        hashCoins: prev.hashCoins - costs.hash
      }));
      setPlots(prev => prev.map(p => 
        p.id === plotId ? { ...p, capacity: p.capacity + 1 } : p
      ));
    }
  };

  const handleWater = (plotId: number) => {
    setPlots(prev => prev.map(p => p.id === plotId ? { ...p, isWatered: true } : p));
  };

  const handlePrune = (plotId: number) => {
    setPlots(prev => prev.map(p => p.id === plotId ? { ...p, isPruned: true } : p));
  };

  const handleHarvest = (plotId: number) => {
    const plot = plots.find(p => p.id === plotId);
    if (!plot || !plot.seedId || !plot.isPruned) return;
    const budId = `${plot.seedId}_bud`;
    const amount = plot.capacity * (plot.isFertilized ? 2 : 1); 

    setPlayer(prev => ({ 
      ...prev, 
      inventory: { ...prev.inventory, [budId]: (prev.inventory[budId] || 0) + amount },
      level: prev.level + (0.15 * plot.capacity)
    }));
    
    setPlots(prev => prev.map(p => 
      p.id === plotId ? { ...p, seedId: null, plantedAt: null, isWatered: false, isPruned: false } : p
    ));
  };

  const handleAcceptOffer = (offer: Offer) => {
    const currentQty = player.inventory[offer.itemId] || 0;
    if (currentQty >= offer.quantity) {
      setPlayer(prev => ({
        ...prev,
        coins: offer.currency === 'coins' ? prev.coins + offer.price : prev.coins,
        hashCoins: offer.currency === 'hashCoins' ? prev.hashCoins + offer.price : prev.hashCoins,
        inventory: { ...prev.inventory, [offer.itemId]: currentQty - offer.quantity },
        reputation: { ...prev.reputation, [offer.npcId]: (prev.reputation[offer.npcId] || 0) + offer.reputationAward },
        level: prev.level + 0.5
      }));
      setOffers(prev => prev.filter(o => o.id !== offer.id));
    }
  };

  const handleBuy = (seedId: string, cost: number, useHashCoin: boolean = false) => {
    const seed = SEEDS.find(s => s.id === seedId);
    if (!seed) return;
    if (useHashCoin) {
      if (player.hashCoins >= cost) {
        setPlayer(prev => ({
          ...prev,
          hashCoins: prev.hashCoins - cost,
          inventory: { ...prev.inventory, [seedId]: (prev.inventory[seedId] || 0) + 1 },
          unlockedRarities: prev.unlockedRarities.includes(seed.rarity) ? prev.unlockedRarities : [...prev.unlockedRarities, seed.rarity]
        }));
      }
    } else {
      if (player.coins >= cost) {
        setPlayer(prev => ({
          ...prev,
          coins: prev.coins - cost,
          inventory: { ...prev.inventory, [seedId]: (prev.inventory[seedId] || 0) + 1 },
          unlockedRarities: prev.unlockedRarities.includes(seed.rarity) ? prev.unlockedRarities : [...prev.unlockedRarities, seed.rarity]
        }));
      }
    }
  };

  const handleBuyLuxury = (itemId: string) => {
    const item = LUXURY_ITEMS.find(i => i.id === itemId);
    if (!item || player.ownedLuxuryItems.includes(itemId)) return;
    if (item.currency === 'coins' && player.coins >= item.price) {
      setPlayer(prev => ({ ...prev, coins: prev.coins - item.price, ownedLuxuryItems: [...prev.ownedLuxuryItems, itemId] }));
    } else if (item.currency === 'hashCoins' && player.hashCoins >= item.price) {
      setPlayer(prev => ({ ...prev, hashCoins: prev.hashCoins - item.price, ownedLuxuryItems: [...prev.ownedLuxuryItems, itemId] }));
    }
  };

  const handleToggleCosmetic = (itemId: string) => {
    const item = LUXURY_ITEMS.find(i => i.id === itemId);
    if (!item || !player.ownedLuxuryItems.includes(itemId)) return;
    setPlayer(prev => ({
      ...prev,
      activeCosmetics: { ...prev.activeCosmetics, [item.category]: prev.activeCosmetics[item.category] === itemId ? null : itemId }
    }));
  };

  const handleSetGender = (gender: 'male' | 'female') => setPlayer(prev => ({ ...prev, gender }));

  const handleGreet = async (npcName: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Greeting from ${npcName}, a character in a space farm. Be brief. Character names: Snoopcat, Gnoweed, Icky deller, ShortyWeed, Zen zeca, Cosmic drugs, Panic.`,
        config: { systemInstruction: "Brief cosmic NPC greeting, max 10 words." }
      });
      if (response.text) setAiDialogue(response.text);
    } catch (error) {
      setAiDialogue("O cosmos saúda você.");
    }
  };

  const handleFabricate = (seedId: string) => {
    const budId = `${seedId}_bud`;
    const hashId = `${seedId}_hash`;
    const availableBuds = player.inventory[budId] || 0;
    if (availableBuds >= 5) {
      setPlayer(prev => ({
        ...prev,
        inventory: { ...prev.inventory, [budId]: availableBuds - 5, [hashId]: (prev.inventory[hashId] || 0) + 1 },
        level: prev.level + 0.3
      }));
    }
  };

  return (
    <div className="h-screen w-full psychedelic-bg text-white flex flex-col overflow-hidden select-none">
      <HUD player={player} currentEvent={currentEvent} onOpenProfile={() => setActiveScreen('profile')} />
      <main className="flex-1 overflow-y-auto pt-4 px-4 custom-scrollbar pb-10">
        {activeScreen === 'farm' && (
          <FarmGrid 
            plots={plots} 
            onPlant={handlePlant} 
            onWater={handleWater} 
            onPrune={handlePrune}
            onHarvest={handleHarvest}
            onUpgrade={handleUpgradePlot}
            inventory={player.inventory}
            player={player}
          />
        )}
        {activeScreen === 'warehouse' && <Warehouse player={player} onBack={() => setActiveScreen('farm')} />}
        {activeScreen === 'shop' && (
          <Shop 
            player={player} 
            plots={plots}
            onBuy={handleBuy} 
            onUpgradePlot={handleUpgradePlot}
            onBuyLand={() => {}} 
            onBack={() => setActiveScreen('farm')} 
          />
        )}
        {activeScreen === 'npc' && <NPCPanel player={player} offers={offers} onAcceptOffer={handleAcceptOffer} onBack={() => setActiveScreen('farm')} aiDialogue={aiDialogue} onGreet={handleGreet} offerResetIn={OFFER_RESET_INTERVAL - (Date.now() - lastOfferReset)} />}
        {activeScreen === 'lab' && <Fabrication player={player} onFabricate={handleFabricate} onBack={() => setActiveScreen('farm')} />}
        {activeScreen === 'profile' && <ProfileView player={player} onBuyLuxury={handleBuyLuxury} onToggleCosmetic={handleToggleCosmetic} onSetGender={handleSetGender} onBack={() => setActiveScreen('farm')} />}
      </main>
      <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />
      <EventOverlay currentEvent={currentEvent} />
    </div>
  );
};

export default App;
