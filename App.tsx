
import React, { useState, useEffect, useCallback } from 'react';
import { Player, Plot, Rarity, Offer } from './types';
import { SEEDS, LAND_COSTS, NPCS } from './constants';
import FarmGrid from './components/FarmGrid';
import BottomNav from './components/BottomNav';
import HUD from './components/HUD';
import Shop from './components/Shop';
import NPCPanel from './components/NPCPanel';
import Fabrication from './components/Fabrication';
import Warehouse from './components/Warehouse';
import EventOverlay from './components/EventOverlay';
import { GoogleGenAI } from "@google/genai";

const OFFER_RESET_INTERVAL = 20 * 60 * 1000; // 20 minutos

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
  coins: 150,
  hashCoins: 0,
  level: 1,
  inventory: createInitialInventory(),
  unlockedPlots: 6,
  reputation: NPCS.reduce((acc, npc) => ({ ...acc, [npc.id]: 0 }), {}),
  unlockedRarities: [Rarity.COMMON]
};

const App: React.FC = () => {
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [activeScreen, setActiveScreen] = useState<'farm' | 'shop' | 'npc' | 'lab' | 'warehouse'>('farm');
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
    
    // REGRAS DE MOEDA: Comuns nunca dão Hash Coins (Cookies)
    const canBeHashCoin = seed.rarity !== Rarity.COMMON && Math.random() > 0.8;
    const currency = canBeHashCoin ? 'hashCoins' : 'coins';
    
    let basePrice = isHash ? seed.baseValue * 5.8 : seed.baseValue * 1.1;
    if (currency === 'hashCoins') {
      basePrice = Math.max(1, Math.floor(basePrice / 120)); // Preço em Cookies é muito menor que em Moedas
    }
    
    const repBonus = 1 + (currentPlayer.reputation[npc.id] || 0) / 2000;
    const price = Math.floor(basePrice * quantity * npc.multiplier * repBonus);

    return {
      id: Math.random().toString(36).substr(2, 9),
      npcId: npc.id,
      itemId,
      quantity,
      price,
      currency,
      reputationAward: currency === 'hashCoins' ? 30 : 10
    };
  }, []);

  useEffect(() => {
    const initialPlots: Plot[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      seedId: null,
      plantedAt: null,
      isWatered: false,
      isPruned: false,
      isUnlocked: i < player.unlockedPlots,
      isFertilized: i >= 10
    }));
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
      } else {
        if (Math.random() > 0.985 && offers.length < 5) {
          const newOffer = generateRandomOffer(player);
          if (newOffer) setOffers(prev => [...prev, newOffer]);
        }
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [offers, player, lastOfferReset, generateRandomOffer]);

  const handlePlant = (plotId: number, seedId: string) => {
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

  const handleWater = (plotId: number) => {
    setPlots(prev => prev.map(p => 
      p.id === plotId ? { ...p, isWatered: true } : p
    ));
  };

  const handlePrune = (plotId: number) => {
    setPlots(prev => prev.map(p => 
      p.id === plotId ? { ...p, isPruned: true } : p
    ));
  };

  const handleHarvest = (plotId: number) => {
    const plot = plots.find(p => p.id === plotId);
    if (!plot || !plot.seedId || !plot.isPruned) return;

    const budId = `${plot.seedId}_bud`;
    const amount = plot.isFertilized ? 2 : 1; 

    setPlayer(prev => ({ 
      ...prev, 
      inventory: { ...prev.inventory, [budId]: (prev.inventory[budId] || 0) + amount },
      level: prev.level + 0.15
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
        inventory: {
          ...prev.inventory,
          [offer.itemId]: currentQty - offer.quantity
        },
        reputation: {
          ...prev.reputation,
          [offer.npcId]: (prev.reputation[offer.npcId] || 0) + offer.reputationAward
        },
        level: prev.level + 0.5
      }));
      setOffers(prev => prev.filter(o => o.id !== offer.id));
    }
  };

  const handleBuyLand = (landId: number, cost: number, useHashCoin: boolean = false) => {
    if (useHashCoin) {
      if (player.hashCoins >= cost) {
        setPlayer(prev => ({
          ...prev,
          hashCoins: prev.hashCoins - cost,
          unlockedPlots: prev.unlockedPlots + 1
        }));
        setPlots(prev => prev.map(p => 
          p.id === landId ? { ...p, isUnlocked: true } : p
        ));
      }
    } else {
      if (player.coins >= cost) {
        setPlayer(prev => ({
          ...prev,
          coins: prev.coins - cost,
          unlockedPlots: prev.unlockedPlots + 1
        }));
        setPlots(prev => prev.map(p => 
          p.id === landId ? { ...p, isUnlocked: true } : p
        ));
      }
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

  const handleGreet = async (npcName: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Greeting from ${npcName}, a mystical character in a psychedelic space farming game. Be brief and high-vibe. Character names: Snoopcat, Gnoweed, Icky deller, ShortyWeed, Zen zeca, Cosmic drugs, Panic.`,
        config: {
          systemInstruction: "You are a chill, mystical cosmic NPC. Keep responses under 15 words. Stay in character.",
        }
      });
      if (response.text) {
        setAiDialogue(response.text);
      }
    } catch (error) {
      setAiDialogue("O universo tem seus próprios segredos...");
    }
  };

  const handleFabricate = (seedId: string) => {
    const budId = `${seedId}_bud`;
    const hashId = `${seedId}_hash`;
    const availableBuds = player.inventory[budId] || 0;
    
    if (availableBuds >= 5) {
      setPlayer(prev => ({
        ...prev,
        inventory: {
          ...prev.inventory,
          [budId]: availableBuds - 5,
          [hashId]: (prev.inventory[hashId] || 0) + 1
        },
        level: prev.level + 0.3
      }));
    }
  };

  return (
    <div className="h-screen w-full psychedelic-bg text-white flex flex-col overflow-hidden select-none">
      <HUD player={player} currentEvent={currentEvent} />
      
      <main className="flex-1 overflow-y-auto pt-4 px-4 custom-scrollbar pb-10">
        {activeScreen === 'farm' && (
          <FarmGrid 
            plots={plots} 
            onPlant={handlePlant} 
            onWater={handleWater} 
            onPrune={handlePrune}
            onHarvest={handleHarvest} 
            inventory={player.inventory}
          />
        )}
        {activeScreen === 'warehouse' && (
          <Warehouse player={player} onBack={() => setActiveScreen('farm')} />
        )}
        {activeScreen === 'shop' && (
          <Shop 
            player={player} 
            onBuy={handleBuy} 
            onBuyLand={handleBuyLand}
            onBack={() => setActiveScreen('farm')} 
          />
        )}
        {activeScreen === 'npc' && (
          <NPCPanel 
            player={player}
            offers={offers}
            onAcceptOffer={handleAcceptOffer}
            onBack={() => setActiveScreen('farm')} 
            aiDialogue={aiDialogue} 
            onGreet={handleGreet}
            offerResetIn={OFFER_RESET_INTERVAL - (Date.now() - lastOfferReset)}
          />
        )}
        {activeScreen === 'lab' && (
          <Fabrication 
            player={player}
            onFabricate={handleFabricate}
            onBack={() => setActiveScreen('farm')}
          />
        )}
      </main>

      <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />
      <EventOverlay currentEvent={currentEvent} />
    </div>
  );
};

export default App;
