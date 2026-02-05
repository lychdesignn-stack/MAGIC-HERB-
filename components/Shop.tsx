
import React, { useState } from 'react';
import { Player, Rarity, Plot } from '../types';
import { SEEDS, UPGRADE_COSTS, UPGRADE_LIMITS, LUXURY_ITEMS, CONSUMABLES } from '../constants';

interface ShopProps {
  player: Player;
  plots: Plot[];
  onBuy: (seedId: string, cost: number, useHashCoin: boolean) => void;
  onUpgradePlot: (plotId: number) => void;
  onBuyLuxury: (itemId: string) => void;
  onBuyConsumable: (itemId: string) => void;
  onBack: () => void;
}

const Shop: React.FC<ShopProps> = ({ player, plots, onBuy, onUpgradePlot, onBuyLuxury, onBuyConsumable, onBack }) => {
  const [activeTab, setActiveTab] = useState<'seeds' | 'items' | 'premium' | 'lands'>('seeds');

  return (
    <div className="w-full flex flex-col animate-in slide-in-from-right duration-300 pb-32">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-cartoon text-3xl text-white">Mercado Galáctico</h2>
          <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">Equilíbrio & Gestão</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'seeds', label: 'Sementes', icon: '🌱' },
          { id: 'items', label: 'Utilitários', icon: '🧪' },
          { id: 'premium', label: 'Grifes', icon: '💍' },
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
            // ROI Base: Semente custa ~35% do valor base da colheita
            const price = useHashCoin ? seed.hashCoinPrice! : Math.floor(seed.baseValue * 0.35);
            const canAfford = useHashCoin ? player.hashCoins >= price : player.coins >= price;
            
            return (
              <div key={seed.id} className="bg-black/40 backdrop-blur-xl border border-white/5 p-4 rounded-[2rem] flex items-center gap-4 group shadow-xl">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-black/40 border border-white/10">🌱</div>
                <div className="flex-1">
                  <h3 className="font-black text-xs text-white uppercase">{seed.name}</h3>
                  <div className="flex gap-1.5 items-center mt-1">
                    <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full border
                      ${seed.rarity === Rarity.MYTHIC ? 'text-green-400 border-green-500/20' : 
                        seed.rarity === Rarity.LEGENDARY ? 'text-yellow-500 border-yellow-500/20' : 
                        seed.rarity === Rarity.RARE ? 'text-purple-400 border-purple-500/20' : 
                        'text-white/40 border-white/5'}`}>
                      {seed.rarity}
                    </span>
                    <span className="text-[7px] text-zinc-500 font-bold">⌚ {Math.floor(seed.growthTime / 60) > 0 ? `${Math.floor(seed.growthTime / 60)}m` : `${seed.growthTime}s`}</span>
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
            const canAfford = item.currency === 'coins' ? player.coins >= item.price : player.hashCoins >= item.price;
            return (
              <div key={item.id} className="bg-black/40 backdrop-blur-xl border border-white/5 p-4 rounded-[2rem] flex items-center gap-4 shadow-xl">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-black/40 border border-white/10">{item.icon}</div>
                <div className="flex-1">
                  <h3 className="font-black text-xs text-white uppercase">{item.name}</h3>
                  <p className="text-[8px] text-white/30 leading-tight mt-1">{item.description}</p>
                </div>
                <button onClick={() => onBuyConsumable(item.id)} disabled={!canAfford} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase border transition-all ${canAfford ? 'bg-white text-black border-white' : 'opacity-20 border-white/10 grayscale'}`}>
                  {item.currency === 'coins' ? '🪙' : '🍪'} {item.price}
                </button>
              </div>
            );
          })
        }

        {activeTab === 'premium' && LUXURY_ITEMS.map(item => {
            const owned = player.ownedLuxuryItems.includes(item.id);
            const canAfford = item.currency === 'coins' ? player.coins >= item.price : player.hashCoins >= item.price;
            return (
              <div key={item.id} className="bg-black/40 backdrop-blur-xl border border-white/5 p-4 rounded-[2rem] flex items-center gap-4 shadow-xl">
                 <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-3xl">{item.icon}</div>
                 <div className="flex-1">
                   <h4 className="text-[10px] font-black text-white uppercase">{item.name}</h4>
                   <p className="text-[8px] text-white/30 leading-tight mt-1">{item.description}</p>
                 </div>
                 <button 
                  onClick={() => !owned && onBuyLuxury(item.id)} 
                  disabled={!owned && !canAfford} 
                  className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase border transition-all
                    ${owned ? 'bg-green-600 border-green-400 text-white' : canAfford ? 'bg-white text-black border-white' : 'opacity-20 border-white/10 grayscale'}
                  `}
                >
                   {owned ? 'OK' : `${item.currency === 'coins' ? '🪙' : '🍪'} ${item.price}`}
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
                <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-xl">🚜</div>
                <div className="flex-1">
                  <h3 className="font-black text-xs text-white uppercase">Lote #{plot.id + 1}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] font-cartoon text-white">{plot.capacity} / {UPGRADE_LIMITS[plot.type]}</span>
                  </div>
                </div>
                <button onClick={() => onUpgradePlot(plot.id)} disabled={isMaxed || !canAfford} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all shadow-lg border ${isMaxed ? 'bg-green-600/20 border-green-500 text-green-500' : canAfford ? 'bg-amber-600 border-amber-400 text-white' : 'bg-white/5 border-white/10 text-white/20'}`}>
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
