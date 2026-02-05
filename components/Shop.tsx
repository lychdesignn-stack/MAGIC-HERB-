
import React, { useState } from 'react';
import { Player, Rarity, Plot, LuxuryItem, ConsumableItem } from '../types';
import { SEEDS, UPGRADE_COSTS, UPGRADE_LIMITS, LUXURY_ITEMS, CONSUMABLES, TITLES } from '../constants';

interface ShopProps {
  player: Player;
  plots: Plot[];
  onBuy: (seedId: string, cost: number, useHashCoin: boolean) => void;
  onUpgradePlot: (plotId: number) => void;
  onBuyLuxury: (itemId: string) => void;
  onBuyConsumable: (itemId: string) => void;
  getConsumablePrice: (itemId: string, basePrice: number) => number;
  onBack: () => void;
}

const Shop: React.FC<ShopProps> = ({ player, plots, onBuy, onUpgradePlot, onBuyLuxury, onBuyConsumable, getConsumablePrice, onBack }) => {
  const [activeTab, setActiveTab] = useState<'seeds' | 'items' | 'premium' | 'titles' | 'lands'>('seeds');

  const getRarityStyles = (rarity: Rarity) => {
    switch (rarity) {
      case Rarity.MYTHIC: return 'text-green-400 border-green-500/40 bg-green-500/10 shadow-[0_0_10px_rgba(34,197,94,0.3)]';
      case Rarity.LEGENDARY: return 'text-amber-400 border-amber-500/40 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.3)]';
      case Rarity.RARE: return 'text-purple-400 border-purple-500/30 bg-purple-500/5';
      default: return 'text-white/40 border-white/10 bg-white/5';
    }
  };

  const checkUnlock = (item: LuxuryItem): boolean => {
    if (!item.unlockCondition) return true;
    const cond = item.unlockCondition;
    switch (cond.type) {
      case 'level': return player.level >= cond.value;
      case 'reputation': 
        const totalRep = (Object.values(player.reputation) as number[]).reduce((a, b) => a + b, 0);
        return totalRep >= cond.value;
      case 'stats': return (player.stats?.totalPlanted || 0) >= cond.value;
      default: return true;
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return val.toString();
  };

  return (
    <div className="w-full flex flex-col animate-in slide-in-from-right duration-300 pb-32">
      <div className="flex justify-between items-center mb-6 px-1">
        <div>
          <h2 className="font-cartoon text-3xl text-white">Mercado Galáctico</h2>
          <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">Exclusividade & Prestígio</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'seeds', label: 'Sementes', icon: '🌱' },
          { id: 'items', label: 'Utilitários', icon: '🧪' },
          { id: 'premium', label: 'Estilo & Temas', icon: '🎨' },
          { id: 'titles', label: 'Títulos', icon: '🏷️' },
          { id: 'lands', label: 'Lotes', icon: '🚜' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-shrink-0 px-5 py-3 rounded-2xl font-black text-[10px] uppercase transition-all flex items-center gap-2 border shadow-lg
              ${activeTab === tab.id ? `bg-white text-black border-white scale-105 z-10` : 'bg-black/40 border-white/10 text-white/40'}
            `}
          >
            <span>{tab.icon}</span> <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {activeTab === 'seeds' && SEEDS.map(seed => {
            const isPremium = seed.rarity === Rarity.LEGENDARY || seed.rarity === Rarity.MYTHIC;
            const useHashCoin = isPremium && !!seed.hashCoinPrice;
            const price = useHashCoin ? seed.hashCoinPrice! : Math.floor(seed.baseValue * 0.35);
            const canAfford = useHashCoin ? player.hashCoins >= price : player.coins >= price;
            
            return (
              <div key={seed.id} className="bg-black/40 backdrop-blur-xl border border-white/5 p-4 rounded-[2rem] flex items-center gap-4 group shadow-xl">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-black/40 border ${getRarityStyles(seed.rarity)}`}>🌱</div>
                <div className="flex-1">
                  <h3 className="font-black text-xs text-white uppercase">{seed.name}</h3>
                  <div className="flex gap-1.5 items-center mt-1">
                    <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full border ${getRarityStyles(seed.rarity)}`}>
                      {seed.rarity}
                    </span>
                    <span className="text-[7px] text-zinc-500 font-bold">⌚ {seed.growthTime}s</span>
                  </div>
                </div>
                <button onClick={() => onBuy(seed.id, price, useHashCoin)} disabled={!canAfford} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase border transition-all ${canAfford ? 'bg-white text-black border-white' : 'opacity-20 border-white/10 grayscale'}`}>
                  {useHashCoin ? '🍪' : '🪙'} {price}
                </button>
              </div>
            );
          })
        }

        {activeTab === 'items' && CONSUMABLES.map(item => {
            const currentPrice = getConsumablePrice(item.id, item.price);
            const count = player.inventory[item.id] || 0;
            const canAfford = item.currency === 'coins' ? player.coins >= currentPrice : player.hashCoins >= currentPrice;
            
            return (
              <div key={item.id} className="bg-black/40 backdrop-blur-xl border border-white/5 p-4 rounded-[2rem] flex items-center gap-4 shadow-xl">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-black/40 border border-white/10">{item.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-xs text-white uppercase">{item.name}</h3>
                    <span className="bg-indigo-600/30 text-indigo-400 text-[8px] px-2 py-0.5 rounded-md border border-indigo-400/20 font-black">NÍVEL {count}</span>
                  </div>
                  <p className="text-[8px] text-white/30 leading-tight mt-1">{item.description}</p>
                  <p className="text-[9px] text-green-400 font-black uppercase mt-1">Acumulado: {item.passiveBonusLabel}</p>
                </div>
                <button onClick={() => onBuyConsumable(item.id)} disabled={!canAfford} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase border transition-all ${canAfford ? 'bg-white text-black border-white' : 'opacity-20 border-white/10 grayscale'}`}>
                  {item.currency === 'coins' ? '🪙' : '🍪'} {formatCurrency(currentPrice)}
                </button>
              </div>
            );
          })
        }

        {activeTab === 'premium' && LUXURY_ITEMS.map(item => {
            const owned = player.ownedLuxuryItems.includes(item.id);
            const unlocked = checkUnlock(item);
            const canAfford = item.currency === 'coins' ? player.coins >= item.price : player.hashCoins >= item.price;
            
            return (
              <div key={item.id} className={`bg-black/40 backdrop-blur-xl border p-4 rounded-[2rem] flex items-center gap-4 shadow-xl transition-all ${owned ? 'opacity-60 grayscale-[0.5]' : 'border-white/5'} ${!unlocked ? 'grayscale' : ''}`}>
                 <div className={`w-14 h-14 rounded-2xl bg-black/40 border flex items-center justify-center text-3xl relative ${getRarityStyles(item.rarity)}`}>
                   {item.icon}
                   {!unlocked && <span className="absolute inset-0 flex items-center justify-center text-xl bg-black/60 rounded-2xl">🔒</span>}
                 </div>
                 <div className="flex-1">
                   <div className="flex items-center gap-2">
                     <h4 className="text-[10px] font-black text-white uppercase">{item.name}</h4>
                     <span className={`text-[6px] font-black px-1.5 py-0.5 rounded-full border uppercase ${getRarityStyles(item.rarity)}`}>{item.rarity}</span>
                   </div>
                   {!unlocked ? (
                     <p className="text-[8px] text-red-400/80 font-black uppercase mt-1">Requisito: {item.unlockCondition?.label}</p>
                   ) : (
                     <p className="text-[8px] text-white/30 leading-tight mt-1">{item.description}</p>
                   )}
                   <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[8px] font-black text-green-500 uppercase">+{Math.round(item.harvestBonus * 100)}% Colheita</span>
                      <span className="text-[6px] font-black text-zinc-500 uppercase tracking-widest">{item.category.replace('_', ' ')}</span>
                   </div>
                 </div>
                 <button 
                  onClick={() => unlocked && !owned && onBuyLuxury(item.id)} 
                  disabled={!unlocked || owned || !canAfford} 
                  className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase border transition-all min-w-[80px]
                    ${owned ? 'bg-green-600/20 border-green-500 text-green-500' : unlocked && canAfford ? 'bg-white text-black border-white active:scale-95' : 'opacity-20 border-white/10 grayscale'}
                  `}
                >
                   {owned ? 'POSSUÍ' : item.price === 0 ? 'GRÁTIS' : unlocked ? `${item.currency === 'coins' ? '🪙' : '🍪'} ${formatCurrency(item.price)}` : 'FECHADO'}
                 </button>
              </div>
            );
          })
        }

        {activeTab === 'titles' && TITLES.filter(t => t.type === 'purchasable').map(title => {
            const owned = player.ownedTitles.includes(title.id);
            const canAfford = player.hashCoins >= (title.price || 0);
            return (
              <div key={title.id} className={`bg-black/40 backdrop-blur-xl border border-white/5 p-4 rounded-[2rem] flex items-center gap-4 shadow-xl ${owned ? 'opacity-60' : ''}`}>
                 <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-2xl">🏷️</div>
                 <div className="flex-1">
                   <h3 className="font-black text-xs text-white uppercase">{title.name}</h3>
                   <p className="text-[8px] text-white/30 mt-1">Prestígio Social</p>
                 </div>
                 <button 
                  onClick={() => !owned && canAfford && window.dispatchEvent(new CustomEvent('BUY_TITLE', { detail: { id: title.id, price: title.price } }))} 
                  disabled={owned || !canAfford}
                  className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase border transition-all ${owned ? 'bg-indigo-600/20 border-indigo-500 text-indigo-500' : canAfford ? 'bg-white text-black border-white' : 'opacity-20 border-white/10 grayscale'}`}
                 >
                   {owned ? 'POSSUÍ' : `🍪 ${title.price}`}
                 </button>
              </div>
            );
          })
        }

        {activeTab === 'lands' && plots.map(plot => {
            const upgradeCost = UPGRADE_COSTS[plot.type];
            const isMaxed = plot.capacity >= UPGRADE_LIMITS[plot.type];
            const canAfford = player.coins >= upgradeCost.coins && player.hashCoins >= upgradeCost.hash;
            return (
              <div key={plot.id} className="bg-black/40 backdrop-blur-xl border border-white/5 p-4 rounded-[2rem] flex items-center gap-4 shadow-xl">
                <div className={`w-14 h-14 rounded-2xl bg-black/40 border flex items-center justify-center text-xl ${getRarityStyles(plot.type)}`}>🚜</div>
                <div className="flex-1">
                  <h3 className="font-black text-xs text-white uppercase">Lote #{plot.id + 1} ({plot.type})</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] font-cartoon text-white">Capacidade: {plot.capacity} / {UPGRADE_LIMITS[plot.type]}</span>
                  </div>
                </div>
                <button onClick={() => onUpgradePlot(plot.id)} disabled={isMaxed || !canAfford} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all shadow-lg border ${isMaxed ? 'bg-green-600/20 border-green-500 text-green-500' : canAfford ? 'bg-amber-600 border-amber-400 text-white active:scale-95' : 'bg-white/5 border-white/10 text-white/20'}`}>
                  {isMaxed ? 'MÁX' : `${upgradeCost.hash > 0 ? '🍪' : '🪙'} ${upgradeCost.hash > 0 ? upgradeCost.hash : upgradeCost.coins}`}
                </button>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default Shop;
