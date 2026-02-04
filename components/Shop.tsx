
import React, { useState } from 'react';
import { Player, Rarity } from '../types';
import { SEEDS, LAND_COSTS } from '../constants';

interface ShopProps {
  player: Player;
  onBuy: (seedId: string, cost: number, useHashCoin: boolean) => void;
  onBuyLand: (landId: number, cost: number, useHashCoin: boolean) => void;
  onBack: () => void;
}

const Shop: React.FC<ShopProps> = ({ player, onBuy, onBuyLand, onBack }) => {
  const [tab, setTab] = useState<'seeds' | 'lands'>('seeds');

  return (
    <div className="w-full flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-cartoon text-3xl text-green-400 drop-shadow-lg">Botânica Astral</h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Mercado Galáctico</p>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <div className="bg-yellow-500/20 px-3 py-1 rounded-xl border border-yellow-500/30 shadow-inner">
            <span className="text-[10px] font-cartoon text-yellow-400">🪙 {Math.floor(player.coins)}</span>
          </div>
          <div className="bg-amber-500/20 px-3 py-1 rounded-xl border border-amber-500/30 shadow-inner">
            <span className="text-[10px] font-cartoon text-amber-500">🍪 {Math.floor(player.hashCoins)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setTab('seeds')}
          className={`flex-1 py-2 rounded-xl font-bold text-xs uppercase tracking-widest border transition-all ${tab === 'seeds' ? 'bg-purple-600 border-purple-400 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}
        >
          Sementes
        </button>
        <button 
          onClick={() => setTab('lands')}
          className={`flex-1 py-2 rounded-xl font-bold text-xs uppercase tracking-widest border transition-all ${tab === 'lands' ? 'bg-amber-600 border-amber-400 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}
        >
          Terras
        </button>
      </div>

      <div className="flex flex-col gap-4 pb-32">
        {tab === 'seeds' ? (
          SEEDS.map(seed => {
            const isLegendary = seed.rarity === Rarity.LEGENDARY;
            const useHashCoin = isLegendary && !!seed.hashCoinPrice;
            const price = useHashCoin ? seed.hashCoinPrice! : Math.floor(seed.baseValue * 0.5);
            const canAfford = useHashCoin ? player.hashCoins >= price : player.coins >= price;
            const isRare = seed.rarity === Rarity.RARE;
            
            return (
              <div 
                key={seed.id} 
                className={`
                  bg-white/5 border border-white/10 p-4 rounded-[2rem] flex items-center gap-4 transition-all active:scale-95
                  ${isLegendary ? 'ring-1 ring-yellow-500/30 bg-yellow-500/5' : ''}
                `}
              >
                <div 
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border shadow-2xl transition-transform`}
                  style={{ 
                    background: isLegendary && seed.gradientColors 
                      ? `linear-gradient(45deg, ${seed.gradientColors.join(', ')})` 
                      : isRare && seed.secondaryColor
                      ? `radial-gradient(circle, ${seed.secondaryColor}, ${seed.color})`
                      : seed.color,
                    borderColor: 'rgba(255,255,255,0.2)',
                    boxShadow: `0 10px 20px ${seed.glowColor}`
                  }}
                >
                  <span className="filter drop-shadow-lg">🌱</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col mb-1">
                    <h3 className={`font-bold text-sm ${isLegendary ? 'text-yellow-400' : 'text-white'}`}>{seed.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isLegendary ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 
                        isRare ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-green-500/20 text-green-500 border border-green-500/30'
                      }`}>
                        {seed.rarity}
                      </span>
                      <span className="text-[9px] text-white/40 font-semibold italic">⏳ {seed.growthTime}s</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => onBuy(seed.id, price, useHashCoin)}
                  disabled={!canAfford}
                  className={`
                    flex flex-col items-center justify-center min-w-[80px] py-3 rounded-2xl border transition-all
                    ${canAfford 
                      ? isLegendary 
                        ? 'bg-yellow-600 border-yellow-400 text-white shadow-[0_5px_0_rgb(161,98,7)] active:translate-y-1 active:shadow-none'
                        : 'bg-purple-600 border-purple-400 text-white shadow-[0_5px_0_rgb(126,34,206)] active:translate-y-1 active:shadow-none' 
                      : 'bg-white/5 border-white/5 opacity-30 text-white/50'}
                  `}
                >
                  <span className="text-[9px] font-black tracking-tighter uppercase">Comprar</span>
                  <span className="text-xs font-cartoon leading-none mt-1">
                    {useHashCoin ? '🍪' : '🪙'} {price}
                  </span>
                </button>
              </div>
            );
          })
        ) : (
          LAND_COSTS.map(land => {
            const isUnlocked = player.unlockedPlots > land.id;
            const canBuyNext = player.unlockedPlots === land.id;
            const useHashCoin = (land as any).hashCoin === true;
            const canAfford = useHashCoin ? player.hashCoins >= land.cost : player.coins >= land.cost;

            return (
              <div 
                key={land.id} 
                className={`
                  bg-white/5 border border-white/10 p-4 rounded-[2rem] flex items-center gap-4 transition-all
                  ${land.fertilized ? 'border-yellow-500/30 bg-yellow-500/5' : ''}
                  ${isUnlocked ? 'opacity-40 grayscale pointer-events-none' : ''}
                `}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border shadow-xl ${land.fertilized ? 'bg-gradient-to-br from-yellow-600 to-amber-900 border-yellow-400' : 'bg-amber-900 border-amber-700'}`}>
                   {land.fertilized ? '✨' : '🟫'}
                </div>

                <div className="flex-1">
                  <h3 className={`font-bold text-sm ${land.fertilized ? 'text-yellow-400' : 'text-white'}`}>
                    {land.label} {land.fertilized && '(x2)'}
                  </h3>
                  <p className="text-[9px] text-white/40">
                    {land.fertilized ? 'Solo enriquecido com poeira estelar.' : 'Expanda sua área de cultivo.'}
                  </p>
                </div>

                {!isUnlocked && (
                  <button 
                    onClick={() => onBuyLand(land.id, land.cost, useHashCoin)}
                    disabled={!canBuyNext || !canAfford}
                    className={`
                      flex flex-col items-center justify-center min-w-[80px] py-3 rounded-2xl border transition-all
                      ${canBuyNext && canAfford
                        ? useHashCoin 
                           ? 'bg-amber-600 border-amber-400 text-white shadow-[0_5px_0_rgb(120,53,15)] active:translate-y-1 active:shadow-none'
                           : 'bg-indigo-600 border-indigo-400 text-white shadow-[0_5px_0_rgb(49,46,129)] active:translate-y-1 active:shadow-none'
                        : 'bg-white/5 border-white/5 opacity-30 text-white/50'}
                    `}
                  >
                    <span className="text-[9px] font-black tracking-tighter uppercase">Expandir</span>
                    <span className="text-xs font-cartoon leading-none mt-1">
                       {useHashCoin ? '🍪' : '🪙'} {land.cost}
                    </span>
                  </button>
                )}
                {isUnlocked && <span className="text-xs font-cartoon text-green-500 mr-4">ADQUIRIDA</span>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Shop;
