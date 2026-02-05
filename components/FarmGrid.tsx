
import React, { useState, useEffect } from 'react';
import { Plot, Player } from '../types';
import { SEEDS } from '../constants';
import PlotComponent from './Plot';

interface FarmGridProps {
  plots: Plot[];
  onPlant: (id: number, seedId: string) => void;
  onWater: (id: number) => void;
  onPrune: (id: number) => void;
  onHarvest: (id: number) => void;
  onUpgrade: (id: number) => void;
  inventory: Record<string, number>;
  player: Player;
}

const FarmGrid: React.FC<FarmGridProps> = ({ plots, onPlant, onWater, onPrune, onHarvest, onUpgrade, inventory, player }) => {
  const [activeSeedId, setActiveSeedId] = useState<string | null>(null);

  const availableSeeds = SEEDS.filter(s => (inventory[s.id] || 0) > 0);

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
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto relative pb-20">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full px-2 mb-24">
        {plots.map(plot => (
          <PlotComponent 
            key={plot.id} 
            plot={plot} 
            selectedSeedId={activeSeedId || ""}
            onPlant={() => handlePlotClick(plot)}
            onWater={() => onWater(plot.id)}
            onPrune={() => onPrune(plot.id)}
            onHarvest={() => onHarvest(plot.id)}
            onUpgrade={() => onUpgrade(plot.id)}
            player={player}
          />
        ))}
      </div>

      {/* Semente Selecionada / HUD de Seleção Otimizado */}
      <div className="fixed bottom-24 inset-x-0 z-[150] px-4 flex justify-center pointer-events-none">
        <div className="bg-black/80 backdrop-blur-3xl border border-white/20 rounded-3xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex items-center gap-2 pointer-events-auto max-w-full overflow-hidden">
          {availableSeeds.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 py-1 max-w-[80vw]">
              {availableSeeds.map(seed => {
                const count = inventory[seed.id] || 0;
                const isActive = activeSeedId === seed.id;
                return (
                  <button
                    key={seed.id}
                    onClick={() => setActiveSeedId(isActive ? null : seed.id)}
                    className={`
                      relative flex-shrink-0 w-12 h-12 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center
                      ${isActive 
                        ? 'bg-indigo-600 border-indigo-400 scale-110 shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                        : 'bg-zinc-900 border-white/5 active:scale-90'}
                    `}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center shadow-inner"
                      style={{ backgroundColor: seed.color + '44' }}
                    >
                      <span className="text-sm filter drop-shadow-md">🌱</span>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-indigo-500 border border-white/20 rounded-full px-1.5 h-5 min-w-[20px] flex items-center justify-center z-10 shadow-lg">
                      <span className="text-[10px] font-black text-white leading-none">{count}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-2.5 text-white/40 text-[10px] uppercase font-black tracking-widest italic flex items-center gap-2">
               <span className="text-lg">🛒</span> Sem Sementes
            </div>
          )}
          {activeSeedId && (
            <button 
              onClick={() => setActiveSeedId(null)}
              className="w-10 h-10 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 active:scale-90 transition-transform shrink-0"
            >
              <span className="text-sm font-bold">✕</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmGrid;
