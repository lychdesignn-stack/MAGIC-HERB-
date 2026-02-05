
import React, { useState, useEffect } from 'react';
import { Plot, Player } from '../types';
import { SEEDS } from '../constants';
import PlotComponent from './Plot';

interface FarmGridProps {
  plots: Plot[];
  onPlant: (id: number, seedId: string) => void;
  onWater: (id: number) => void;
  onToggleLight: (id: number) => void;
  onPrune: (id: number) => void;
  onHarvest: (id: number) => void;
  onUpgrade: (id: number) => void;
  inventory: Record<string, number>;
  player: Player;
}

const FarmGrid: React.FC<FarmGridProps> = ({ plots, onPlant, onWater, onToggleLight, onPrune, onHarvest, onUpgrade, inventory, player }) => {
  const [activeSeedId, setActiveSeedId] = useState<string | null>(null);

  const availableSeeds = SEEDS.filter(s => (inventory[s.id] || 0) > 0);
  const activeSeed = activeSeedId ? SEEDS.find(s => s.id === activeSeedId) : null;

  useEffect(() => {
    if (activeSeedId && (inventory[activeSeedId] || 0) <= 0) {
      setActiveSeedId(null);
    }
  }, [inventory, activeSeedId]);

  const handlePlotClick = (plot: Plot) => {
    if (!plot.seedId && plot.isUnlocked) {
      if (activeSeedId) {
        const seed = SEEDS.find(s => s.id === activeSeedId);
        if (seed && seed.rarity === plot.type) {
          onPlant(plot.id, activeSeedId);
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto relative pb-20">
      <div className="grid grid-cols-3 gap-3 w-full px-1 mb-32">
        {plots.map(plot => (
          <PlotComponent 
            key={plot.id} 
            plot={plot} 
            selectedSeedId={activeSeedId || ""}
            onPlant={() => handlePlotClick(plot)}
            onWater={() => onWater(plot.id)}
            onToggleLight={() => onToggleLight(plot.id)}
            onPrune={() => onPrune(plot.id)}
            onHarvest={() => onHarvest(plot.id)}
            onUpgrade={() => onUpgrade(plot.id)}
            player={player}
          />
        ))}
      </div>

      <div className="fixed bottom-24 inset-x-0 z-[150] px-4 flex flex-col items-center pointer-events-none">
        {activeSeed && (
          <div className="mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <div 
                className="w-2 h-2 rounded-full transition-colors animate-pulse"
                style={{ backgroundColor: activeSeed.color }}
              />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                {activeSeed.name}
              </span>
            </div>
          </div>
        )}

        <div className="bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-2 shadow-[0_20px_60px_rgba(0,0,0,1)] flex items-center gap-2 pointer-events-auto max-w-full">
          {availableSeeds.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 py-1 max-w-[85vw]">
              {availableSeeds.map(seed => {
                const count = inventory[seed.id] || 0;
                const isActive = activeSeedId === seed.id;
                return (
                  <button
                    key={seed.id}
                    onClick={() => setActiveSeedId(isActive ? null : seed.id)}
                    className={`
                      relative flex-shrink-0 w-11 h-11 rounded-2xl border transition-all duration-300 flex items-center justify-center
                      ${isActive 
                        ? 'bg-indigo-600 border-white scale-110 shadow-[0_0_20px_rgba(99,102,241,0.6)]' 
                        : 'bg-zinc-900 border-white/5 active:scale-95'}
                    `}
                  >
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: seed.color + '33' }}
                    >
                      <span className="text-xs">🌱</span>
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 bg-white text-black border border-black/10 rounded-full px-1.5 h-4 min-w-[16px] flex items-center justify-center z-10 shadow-lg">
                      <span className="text-[9px] font-black leading-none">{count}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-2.5 text-white/30 text-[9px] uppercase font-black tracking-widest italic flex items-center gap-2">
               🛒 Loja Vazia
            </div>
          )}
          {activeSeedId && (
            <button 
              onClick={() => setActiveSeedId(null)}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 active:scale-90 transition-transform shrink-0"
            >
              <span className="text-xs font-bold">✕</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmGrid;
