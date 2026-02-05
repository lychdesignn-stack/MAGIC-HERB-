
import React, { useState } from 'react';
import { Player, Rarity, Plot } from '../types';
import { SEEDS, UPGRADE_COSTS, UPGRADE_LIMITS } from '../constants';

interface ShopProps {
  player: Player;
  plots: Plot[];
  onBuy: (seedId: string, cost: number, useHashCoin: boolean) => void;
  onUpgradePlot: (plotId: number) => void;
  onBack: () => void;
}

const Shop: React.FC<ShopProps> = ({ player, plots, onBuy, onUpgradePlot, onBack }) => {
  const [activeTab, setActiveTab] = useState<'seeds' | 'lands'>('seeds');

  return (
    <div className="w-full flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-cartoon text-3xl text-green-400 drop-shadow-lg">Botânica Astral</h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Upgrades & Insumos</p>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <div className="bg-yellow-500/20 px-3 py-1 rounded-xl border border-yellow-500/30">
            <span className="text-[10px] font-cartoon text-yellow-400">🪙 {Math.floor(player.coins)}</span>
          </div>
          <div className="bg-amber-500/20 px-3 py-1 rounded-xl border border-amber-500/30">
            <span className="text-[10px] font-cartoon text-amber-500">🍪 {Math.floor(player.hashCoins)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setActiveTab('seeds')}
          className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${activeTab === 'seeds' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}
        >
          Sementes 🌱
        </button>
        <button 
          onClick={() => setActiveTab('lands')}
          className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${activeTab === 'lands' ? 'bg-amber-600 border-amber-400 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}
        >
          Terras 🚜
        </button>
      </div>

      <div className="flex flex-col gap-4 pb-32">
        {activeTab === 'seeds' ? (
          SEEDS.map(seed => {
            const isLegendary = seed.rarity === Rarity.LEGENDARY;
            const useHashCoin = isLegendary && !!seed.hashCoinPrice;
            const price = useHashCoin ? seed.hashCoinPrice! : Math.floor(seed.baseValue * 0.5);
            const canAfford = useHashCoin ? player.hashCoins >= price : player.coins >= price;
            const isRare = seed.rarity === Rarity.RARE;
            
            return (
              <div 
                key={seed.id} 
                className={`bg-zinc-900/60 border border-white/5 p-4 rounded-[2rem] flex items-center gap-4 transition-all active:scale-95
                  ${isLegendary ? 'ring-1 ring-yellow-500/20' : ''}
                `}
              >
                <div 
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border shadow-xl`}
                  style={{ 
                    backgroundColor: seed.color + '22',
                    borderColor: seed.color + '44'
                  }}
                >
                  <span className="filter drop-shadow-lg">🌱</span>
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-bold text-xs ${isLegendary ? 'text-yellow-400' : 'text-white'}`}>{seed.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-[7px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      isLegendary ? 'bg-yellow-500/10 text-yellow-500' : 
                      isRare ? 'bg-purple-500/10 text-purple-400' : 'bg-green-500/10 text-green-500'
                    }`}>
                      {seed.rarity}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => onBuy(seed.id, price, useHashCoin)}
                  disabled={!canAfford}
                  className={`flex flex-col items-center justify-center min-w-[70px] py-2 rounded-xl border transition-all
                    ${canAfford ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 opacity-30 cursor-not-allowed'}
                  `}
                >
                  <span className="text-[8px] font-black uppercase">Comprar</span>
                  <span className="text-[10px] font-cartoon mt-0.5">
                    {useHashCoin ? '🍪' : '🪙'} {price}
                  </span>
                </button>
              </div>
            );
          })
        ) : (
          plots.map(plot => {
            const upgradeCost = UPGRADE_COSTS[plot.type];
            const upgradeLimit = UPGRADE_LIMITS[plot.type];
            const isMaxed = plot.capacity >= upgradeLimit;
            const canAfford = player.coins >= upgradeCost.coins && player.hashCoins >= upgradeCost.hash;
            
            const getRarityIcon = () => {
               if (plot.type === Rarity.COMMON) return '🟢';
               if (plot.type === Rarity.RARE) return '🟣';
               return '🟡';
            };

            return (
              <div 
                key={plot.id} 
                className="bg-zinc-900/60 border border-white/5 p-4 rounded-[2rem] flex items-center gap-4 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                  {getRarityIcon()}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-xs text-white">Lote #{plot.id + 1} - {plot.type}</h3>
                  <p className="text-[9px] text-white/40 uppercase font-black tracking-widest mt-0.5">
                    Capacidade Atual: <span className="text-indigo-400">{plot.capacity}/{upgradeLimit}</span>
                  </p>
                </div>

                <button 
                  onClick={() => onUpgradePlot(plot.id)}
                  disabled={isMaxed || !canAfford}
                  className={`flex flex-col items-center justify-center min-w-[80px] py-2 rounded-xl border transition-all
                    ${isMaxed ? 'bg-green-600/20 border-green-500/20 text-green-500/40 cursor-not-allowed' :
                      canAfford ? 'bg-amber-600 border-amber-400 text-white active:translate-y-1' : 'bg-white/5 opacity-30 cursor-not-allowed'}
                  `}
                >
                  <span className="text-[8px] font-black uppercase">{isMaxed ? 'MÁXIMO' : 'UPGRADE'}</span>
                  {!isMaxed && (
                    <span className="text-[9px] font-cartoon mt-0.5">
                      {upgradeCost.coins > 0 ? `🪙 ${upgradeCost.coins}` : ''}
                      {upgradeCost.hash > 0 ? ` 🍪 ${upgradeCost.hash}` : ''}
                    </span>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Shop;
