
import React, { useState } from 'react';
import { Player, Territory } from '../types';
import { TERRITORIES, SEEDS } from '../constants';

interface CityMapProps {
  player: Player;
  onSale: (itemId: string, quantity: number, price: number, wasBusted: boolean) => void;
  onBack: () => void;
}

const CityMap: React.FC<CityMapProps> = ({ player, onSale, onBack }) => {
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [sellingItem, setSellingItem] = useState<string | null>(null);
  const [amount, setAmount] = useState(1);
  const [isNegotiating, setIsNegotiating] = useState(false);

  // Fix: Cast qty to number to avoid 'unknown' type error in the filter condition
  const availableItems = Object.entries(player.inventory)
    .filter(([id, qty]) => (id.endsWith('_bud') || id.endsWith('_hash')) && (qty as number) > 0)
    .map(([id, qty]) => ({ id, qty: qty as number }));

  const handleStartDeal = () => {
    if (!selectedTerritory || !sellingItem) return;
    
    setIsNegotiating(true);
    
    // Simulação do tempo de "venda"
    setTimeout(() => {
      const roll = Math.random();
      const wasBusted = roll < selectedTerritory.riskChance;
      
      const seedId = sellingItem.replace('_bud', '').replace('_hash', '');
      const seed = SEEDS.find(s => s.id === seedId)!;
      const baseVal = sellingItem.endsWith('_hash') ? seed.baseValue * 6 : seed.baseValue;
      const finalPrice = Math.floor(baseVal * amount * selectedTerritory.priceMultiplier);

      onSale(sellingItem, amount, finalPrice, wasBusted);
      setIsNegotiating(false);
      setSellingItem(null);
      setSelectedTerritory(null);
    }, 2500);
  };

  return (
    <div className="w-full flex flex-col gap-4 animate-in fade-in zoom-in duration-300 relative pb-20">
      <div className="flex items-center justify-between">
        <h2 className="font-cartoon text-3xl text-indigo-400">Cidade Neon</h2>
        <button onClick={onBack} className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase">Voltar</button>
      </div>

      {/* Grid do Mapa Estilizado */}
      <div className="aspect-[4/5] w-full bg-zinc-950 border-4 border-white/5 rounded-[3rem] relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ 
          backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', 
          backgroundSize: '30px 30px' 
        }} />
        
        {/* Pontos de Território */}
        <button 
          onClick={() => setSelectedTerritory(TERRITORIES[0])}
          className={`absolute top-[20%] left-[20%] w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all hover:scale-125 animate-drift
            ${selectedTerritory?.id === 'suburbio' ? 'bg-green-500 shadow-[0_0_30px_#22c55e]' : 'bg-green-500/20 border border-green-500/40'}
          `}
        >
          {TERRITORIES[0].icon}
        </button>

        <button 
          onClick={() => setSelectedTerritory(TERRITORIES[1])}
          className={`absolute top-[45%] left-[55%] w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all hover:scale-125 animate-drift
            ${selectedTerritory?.id === 'centro' ? 'bg-yellow-500 shadow-[0_0_30px_#eab308]' : 'bg-yellow-500/20 border border-yellow-500/40'}
          `}
          style={{ animationDelay: '1s' }}
        >
          {TERRITORIES[1].icon}
        </button>

        <button 
          onClick={() => setSelectedTerritory(TERRITORIES[2])}
          className={`absolute bottom-[20%] right-[15%] w-24 h-24 rounded-full flex items-center justify-center text-5xl transition-all hover:scale-125 animate-drift
            ${selectedTerritory?.id === 'quebrada_astral' ? 'bg-red-500 shadow-[0_0_40px_#ef4444]' : 'bg-red-500/20 border border-red-500/40'}
          `}
          style={{ animationDelay: '2s' }}
        >
          {TERRITORIES[2].icon}
        </button>

        {isNegotiating && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-center p-10">
            <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6" />
            <h3 className="font-cartoon text-2xl text-white mb-2">NEGOCIANDO...</h3>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest animate-pulse">Fique de olho na sirene!</p>
            <div className="flex gap-4 mt-8">
               <div className="w-10 h-10 bg-blue-600 rounded-full animate-[pulse_0.5s_infinite]" />
               <div className="w-10 h-10 bg-red-600 rounded-full animate-[pulse_0.5s_infinite_0.25s]" />
            </div>
          </div>
        )}
      </div>

      {/* Painel de Venda */}
      {selectedTerritory && !isNegotiating && (
        <div className="fixed inset-x-0 bottom-0 z-[200] bg-black/95 backdrop-blur-2xl border-t-4 border-white/10 p-6 rounded-t-[3rem] animate-in slide-in-from-bottom duration-300">
           <div className="flex justify-between items-start mb-6">
             <div>
               <h3 className="font-cartoon text-2xl" style={{ color: selectedTerritory.color }}>{selectedTerritory.name}</h3>
               <p className="text-[10px] text-zinc-500 uppercase font-black">{selectedTerritory.description}</p>
             </div>
             <div className="flex flex-col items-end">
               <span className="text-[10px] text-red-500 font-black uppercase">Risco: {Math.round(selectedTerritory.riskChance * 100)}%</span>
               <span className="text-[10px] text-green-500 font-black uppercase">Lucro: x{selectedTerritory.priceMultiplier}</span>
             </div>
           </div>

           <div className="flex gap-3 overflow-x-auto no-scrollbar mb-6 pb-2">
             {availableItems.length > 0 ? availableItems.map(item => (
               <button 
                key={item.id}
                onClick={() => {
                  setSellingItem(item.id);
                  setAmount(1);
                }}
                className={`flex-shrink-0 p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-1
                  ${sellingItem === item.id ? 'bg-indigo-600 border-white shadow-xl scale-110' : 'bg-white/5 border-white/5'}
                `}
               >
                 <span className="text-3xl">{item.id.endsWith('_hash') ? '🍫' : '🌿'}</span>
                 <span className="text-[10px] font-black text-white/80">{item.qty} un</span>
               </button>
             )) : (
               <p className="text-xs text-zinc-600 italic">Você não tem flores ou extratos para vender.</p>
             )}
           </div>

           {sellingItem && (
             <div className="flex flex-col gap-4">
               <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                 <span className="text-xs font-black uppercase">Quantidade: {amount}</span>
                 <div className="flex gap-2">
                   <button onClick={() => setAmount(Math.max(1, amount - 1))} className="w-10 h-10 bg-white/10 rounded-xl font-bold">-</button>
                   <button onClick={() => setAmount(Math.min(player.inventory[sellingItem], amount + 1))} className="w-10 h-10 bg-white/10 rounded-xl font-bold">+</button>
                   <button onClick={() => setAmount(player.inventory[sellingItem])} className="px-3 h-10 bg-white/10 rounded-xl text-[10px] font-black uppercase">Max</button>
                 </div>
               </div>

               <button 
                onClick={handleStartDeal}
                className="w-full py-5 rounded-[2rem] bg-indigo-600 shadow-[0_10px_0_rgb(49,46,129)] text-white font-cartoon text-xl active:translate-y-2 active:shadow-none transition-all"
               >
                 FECHAR NEGÓCIO
               </button>
               <button onClick={() => setSelectedTerritory(null)} className="w-full py-2 text-zinc-500 text-[10px] font-black uppercase">Cancelar</button>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default CityMap;
