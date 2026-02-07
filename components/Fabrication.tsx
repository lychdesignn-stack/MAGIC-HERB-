import React, { useState } from 'react';
import { Player } from '../types';
import { SEEDS } from '../constants';

interface FabricationProps {
  player: Player;
  onFabricate: (seedId: string) => void;
  onBack: () => void;
}

const Fabrication: React.FC<FabricationProps> = ({ player, onFabricate, onBack }) => {
  const [isExtracting, setIsExtracting] = useState<string | null>(null);

  const startExtraction = (seedId: string) => {
    // REGRA 2: Validação robusta de extração
    const budsCount = player.inventory[`${seedId}_bud`] || 0;
    if (budsCount < 10) return;

    setIsExtracting(seedId);
    setTimeout(() => {
      onFabricate(seedId);
      setIsExtracting(null);
    }, 2500);
  };

  return (
    <div className="w-full flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-cartoon text-3xl text-yellow-500">O Laboratório</h2>
          <p className="text-[10px] text-amber-200/40 uppercase tracking-tighter">Prensa fria artesanal (Min. 10 Flores)</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 pb-24">
        {SEEDS.map(seed => {
          const budsCount = player.inventory[`${seed.id}_bud`] || 0;
          const hashCount = player.inventory[`${seed.id}_hash`] || 0;
          const canFabricate = budsCount >= 10 && !isExtracting;

          return (
            <div key={seed.id} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden">
              {isExtracting === seed.id && (
                <div className="absolute inset-0 bg-amber-500/10 backdrop-blur-md z-10 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="text-[10px] font-cartoon text-amber-500 uppercase">Processando Extração...</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-xl">🌿</div>
                  <div>
                    <h3 className={`font-bold text-xs ${budsCount >= 10 ? 'text-white' : 'text-white/40'}`}>{seed.name} x{budsCount}</h3>
                    <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest mt-0.5">Haxixe: {hashCount}</p>
                  </div>
                </div>
              </div>

              <button
                disabled={!canFabricate}
                onClick={() => startExtraction(seed.id)}
                className={`
                  w-full py-3 rounded-xl font-cartoon text-xs transition-all active:scale-95
                  ${canFabricate 
                    ? 'bg-gradient-to-r from-amber-600 to-yellow-500 shadow-lg' 
                    : 'bg-white/5 text-white/20'}
                `}
              >
                {budsCount < 10 ? `Faltam ${10 - budsCount} Flores` : 'PRENSAR HAXIXE'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Fabrication;