
import React, { useState, useEffect } from 'react';
import { Plot, Seed } from '../types';
import { SEEDS } from '../constants';
import PlotComponent from './Plot';

interface FarmGridProps {
  plots: Plot[];
  onPlant: (id: number, seedId: string) => void;
  onWater: (id: number) => void;
  onPrune: (id: number) => void;
  onHarvest: (id: number) => void;
  inventory: Record<string, number>;
}

const FarmGrid: React.FC<FarmGridProps> = ({ plots, onPlant, onWater, onPrune, onHarvest, inventory }) => {
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
        onPlant(plot.id, activeSeedId);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md relative pb-4">
      {/* Grid de Terrenos - Ajustado para remover espaço excessivo */}
      <div className="grid grid-cols-2 gap-4 w-full px-2 mb-20">
        {plots.map(plot => (
          <PlotComponent 
            key={plot.id} 
            plot={plot} 
            selectedSeedId={activeSeedId || ""}
            onPlant={() => handlePlotClick(plot)}
            onWater={() => onWater(plot.id)}
            onPrune={() => onPrune(plot.id)}
            onHarvest={() => onHarvest(plot.id)}
          />
        ))}
      </div>

      {/* Bandeja de Sementes Flutuante */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[150] w-auto">
        <div className="bg-black/80 backdrop-blur-2xl border border-white/20 rounded-full p-2 shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex items-center gap-1.5">
          {availableSeeds.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 py-0.5 max-w-[70vw]">
              {availableSeeds.map(seed => {
                const count = inventory[seed.id] || 0;
                const isActive = activeSeedId === seed.id;
                
                return (
                  <button
                    key={seed.id}
                    onClick={() => setActiveSeedId(isActive ? null : seed.id)}
                    className={`
                      relative flex-shrink-0 w-12 h-12 rounded-full border transition-all duration-300 flex items-center justify-center
                      ${isActive 
                        ? 'bg-purple-600 border-white/60 scale-110 shadow-lg' 
                        : 'bg-black/40 border-white/10 active:scale-90'}
                    `}
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center shadow-inner"
                      style={{ backgroundColor: seed.color }}
                    >
                      <span className="text-xs filter drop-shadow-md">🌱</span>
                    </div>
                    
                    <div className="absolute -bottom-1 -right-1 bg-zinc-900 border border-white/30 rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center z-10">
                      <span className="text-[9px] font-black text-white leading-none">{count}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-2.5 text-white/30 text-[9px] uppercase font-bold tracking-widest italic">
              Visite a Loja
            </div>
          )}

          {activeSeedId && (
            <button 
              onClick={() => setActiveSeedId(null)}
              className="ml-1 w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 active:scale-90 transition-transform"
            >
              <span className="text-xs">✕</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmGrid;
