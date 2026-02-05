
import React, { useState } from 'react';
import { Player, Rarity, Plot } from '../types';
import { SEEDS, UPGRADE_COSTS, UPGRADE_LIMITS, LUXURY_ITEMS } from '../constants';

interface ShopProps {
  player: Player;
  plots: Plot[];
  onBuy: (seedId: string, cost: number, useHashCoin: boolean) => void;
  onUpgradePlot: (plotId: number) => void;
  onBack: () => void;
}

const Shop: React.FC<ShopProps> = ({ player, plots, onBuy, onUpgradePlot, onBack }) => {
  const [activeTab, setActiveTab] = useState<'seeds' | 'lands' | 'items' | 'themes'>('seeds');

  return (
    <div className="w-full flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-cartoon text-3xl text-green-400 drop-shadow-lg leading-none">Botânica Astral</h2>
          <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Loja Galáctica</p>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <div className="bg-yellow-500/10 px-3 py-1 rounded-xl border border-yellow-500/20 flex items-center gap-2">
            <span className="text-[10px] font-cartoon text-yellow-400">🪙 {Math.floor(player.coins)}</span>
          </div>
          <div className="bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20 flex items-center gap-2">
            <span className="text-[10px] font-cartoon text-amber-500">🍪 {Math.floor(player.hashCoins)}</span>
          </div>
        </div>
      </div>

      {/* Tabs Otimizadas */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto no-scrollbar py-2 sticky top-0 bg-black/5 z-20">
        {[
          { id: 'seeds', label: 'Sementes', icon: '🌱', color: 'bg-emerald-600' },
          { id: 'lands', label: 'Lotes', icon: '🚜', color: 'bg-amber-600' },
          { id: 'items', label: 'Acessórios', icon: '🎒', color: 'bg-purple-600' },
          { id: 'themes', label: 'Temas', icon: '🎨', color: 'bg-cyan-600' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex-1 px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-tighter border transition-all whitespace-nowrap flex items-center justify-center gap-2
              ${activeTab === tab.id ? `${tab.color} border-white/20 text-white shadow-xl scale-105` : 'bg-white/5 border-white/10 text-white/40'}
            `}
          >
            <span>{tab.icon}</span> <span className="hidden xs:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 pb-32">
        {activeTab === 'seeds' && SEEDS.map(seed => {
            const isLegendary = seed.rarity === Rarity.LEGENDARY;
            const useHashCoin = isLegendary && !!seed.hashCoinPrice;
            const price = useHashCoin ? seed.hashCoinPrice! : Math.floor(seed.baseValue * 0.5);
            const canAfford = useHashCoin ? player.hashCoins >= price : player.coins >= price;
            
            return (
              <div key={seed.id} className="bg-zinc-900/40 border border-white/5 p-4 rounded-3xl flex items-center gap-4 active:scale-98 transition-all">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border border-white/10 shadow-xl" style={{ backgroundColor: seed.color + '15' }}>
                  <span className="filter drop-shadow-lg">🌱</span>
                </div>
                <div className="flex-1">
                  <h3 className={`font-black text-sm ${isLegendary ? 'text-yellow-400' : 'text-white'}`}>{seed.name}</h3>
                  <div className="flex gap-1 mt-1">
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase ${seed.rarity === Rarity.LEGENDARY ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                      {seed.rarity}
                    </span>
                  </div>
                </div>
                <button onClick={() => onBuy(seed.id, price, useHashCoin)} disabled={!canAfford} className={`flex flex-col items-center justify-center min-w-[80px] py-2.5 rounded-2xl border transition-all ${canAfford ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg active:translate-y-0.5' : 'bg-white/5 opacity-30 cursor-not-allowed text-white/20'}`}>
                  <span className="text-[9px] font-black uppercase">Comprar</span>
                  <span className="text-[11px] font-cartoon mt-0.5">{useHashCoin ? '🍪' : '🪙'} {price}</span>
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
              <div key={plot.id} className="bg-zinc-900/40 border border-white/5 p-4 rounded-3xl flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-3xl shadow-inner">{plot.type === Rarity.COMMON ? '🟢' : plot.type === Rarity.RARE ? '🟣' : '🟡'}</div>
                <div className="flex-1">
                  <h3 className="font-black text-sm text-white">Lote #{plot.id + 1}</h3>
                  <p className="text-[10px] text-white/40 uppercase font-black">Capacidade: <span className="text-white/80">{plot.capacity}/{UPGRADE_LIMITS[plot.type]}</span></p>
                </div>
                <button onClick={() => onUpgradePlot(plot.id)} disabled={isMaxed || !canAfford} className={`flex flex-col items-center justify-center min-w-[90px] py-2.5 rounded-2xl border transition-all ${isMaxed ? 'bg-green-600/10 border-green-500/20 text-green-500/50' : canAfford ? 'bg-amber-600 border-amber-400 text-white shadow-lg active:translate-y-0.5' : 'bg-white/5 opacity-30 cursor-not-allowed'}`}>
                  <span className="text-[10px] font-black uppercase">{isMaxed ? 'MÁXIMO' : 'UPGRADE'}</span>
                </button>
              </div>
            );
          })
        }

        {(activeTab === 'items' || activeTab === 'themes') && LUXURY_ITEMS.filter(i => activeTab === 'items' ? i.category !== 'hud_theme' : i.category === 'hud_theme').map(item => {
            const owned = player.ownedLuxuryItems.includes(item.id);
            const canAfford = item.currency === 'coins' ? player.coins >= item.price : player.hashCoins >= player.hashCoins; // use props
            // Note: handleBuyLuxury logic remains in ProfileView normally, but let's make it consistent.
            return (
              <div key={item.id} className={`bg-zinc-900/60 border border-white/5 p-5 rounded-[2.5rem] flex items-center gap-5 transition-all ${owned ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                 <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-4xl shrink-0 shadow-2xl">{item.icon}</div>
                 <div className="flex-1">
                   <div className="flex items-center gap-2 flex-wrap">
                     <h4 className="text-[11px] font-black text-white uppercase leading-tight">{item.name}</h4>
                     {item.harvestBonus && <span className="bg-emerald-500/20 text-emerald-400 text-[8px] px-1.5 py-0.5 rounded-full font-black">+{Math.round(item.harvestBonus * 100)}% Prod.</span>}
                   </div>
                   <p className="text-[9px] text-zinc-500 font-bold mb-3 mt-1 leading-relaxed">{item.description}</p>
                   {!owned && (
                     <div className="text-[9px] font-black text-amber-500 uppercase flex items-center gap-1">
                       {item.price} {item.currency === 'coins' ? '🪙' : '🍪'}
                       <span className="text-[8px] text-white/20 ml-2 italic">Compre no Perfil ➔</span>
                     </div>
                   )}
                 </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default Shop;
