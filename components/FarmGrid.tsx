import React, { useState, useEffect } from 'react';
import { Plot, Player, Rarity } from '../types';
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
    if (!plot.seedId && plot.isUnlocked && activeSeedId) {
      onPlant(plot.id, activeSeedId);
    }
  };

  const getRarityRimClass = (rarity: Rarity) => {
    switch(rarity) {
      case Rarity.MISTICA: return 'rim-mistica';
      case Rarity.LENDARIA: return 'rim-lendaria';
      case Rarity.RARA: return 'rim-rara';
      default: return 'rim-comum';
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto relative pb-48">
      {/* Grade de Lotes */}
      <div className="grid grid-cols-2 gap-5 w-full px-2">
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
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-2xl">
              <div 
                className="w-3 h-3 rounded-full transition-colors animate-pulse"
                style={{ backgroundColor: activeSeed.color, boxShadow: `0 0 10px ${activeSeed.color}` }}
              />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                {activeSeed.name} x{inventory[activeSeed.id] || 0}
              </span>
            </div>
          </div>
        )}

        <div className="bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-2 shadow-[0_20px_60px_rgba(0,0,0,1)] flex items-center gap-2 pointer-events-auto max-w-full overflow-hidden">
          {availableSeeds.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto no-scrollbar px-2 py-1 max-w-[85vw]">
              {availableSeeds.map(seed => {
                const isActive = activeSeedId === seed.id;
                const rimClass = getRarityRimClass(seed.rarity);
                
                return (
                  <button
                    key={seed.id}
                    onClick={() => setActiveSeedId(isActive ? null : seed.id)}
                    className={`
                      selection-rim relative flex-shrink-0 w-12 h-12 rounded-2xl transition-all duration-300 flex items-center justify-center
                      ${isActive 
                        ? `selection-active ${rimClass}` 
                        : 'bg-zinc-900 border border-white/5 opacity-60'}
                    `}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: seed.color + '33' }}
                    >
                      <span className="text-sm">🌱</span>
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
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 active:scale-90 transition-transform shrink-0"
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