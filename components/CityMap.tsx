
import React, { useState } from 'react';
import { Player, Territory, Offer } from '../types';
import { TERRITORIES, SEEDS } from '../constants';

interface CityMapProps {
  player: Player;
  onSale: (itemId: string, quantity: number, price: number, wasBusted: boolean) => void;
  onBack: () => void;
  offers: Offer[];
}

const CityMap: React.FC<CityMapProps> = ({ player, onSale, onBack, offers }) => {
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [sellingItem, setSellingItem] = useState<string | null>(null);
  const [amount, setAmount] = useState(1);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [busted, setBusted] = useState(false);

  const availableItems = Object.entries(player.inventory)
    .filter(([id, qty]) => (id.endsWith('_bud') || id.endsWith('_hash')) && (qty as number) > 0)
    .map(([id, qty]) => ({ id, qty: qty as number }));

  const handleStartDeal = () => {
    if (!selectedTerritory || !sellingItem) return;
    
    setIsNegotiating(true);
    
    setTimeout(() => {
      const roll = Math.random();
      const wasBusted = roll < selectedTerritory.riskChance;
      
      const seedId = sellingItem.replace('_bud', '').replace('_hash', '');
      const seed = SEEDS.find(s => s.id === seedId)!;
      
      // Cálculo do preço base no mercado negro é o valor base + bônus de processamento
      const baseValue = sellingItem.endsWith('_hash') ? seed.baseValue * 5.5 : seed.baseValue * 1.5;
      
      // O preço final é multiplicado pelo bônus generoso do território
      const finalPrice = Math.floor(baseValue * amount * selectedTerritory.priceBonus);

      if (wasBusted) {
          setBusted(true);
          onSale(sellingItem, amount, finalPrice, true);
          setTimeout(() => {
              setBusted(false);
              setIsNegotiating(false);
              setSelectedTerritory(null);
          }, 3000);
      } else {
          onSale(sellingItem, amount, finalPrice, false);
          setIsNegotiating(false);
          setSellingItem(null);
          setSelectedTerritory(null);
      }
    }, 2500);
  };

  const getSeedFromItem = (itemId: string) => {
    const seedId = itemId.replace('_bud', '').replace('_hash', '');
    return SEEDS.find(s => s.id === seedId);
  };

  const selectedSeed = sellingItem ? getSeedFromItem(sellingItem) : null;

  return (
    <div className="w-full flex flex-col gap-4 animate-in fade-in duration-300 relative pb-20">
      <div className="flex items-center justify-between">
        <h2 className="font-cartoon text-3xl text-white">Metrópole Neon</h2>
        <button onClick={onBack} className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase">Voltar</button>
      </div>

      <div className="aspect-[4/5] w-full bg-zinc-950 border-4 border-white/5 rounded-[3rem] relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=800")',
          backgroundSize: 'cover'
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
        
        {TERRITORIES.map((t, i) => (
            <button 
                key={t.id}
                onClick={() => setSelectedTerritory(t)}
                className={`absolute w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-95
                    ${selectedTerritory?.id === t.id ? 'bg-white text-black shadow-[0_0_30px_white]' : 'bg-black/60 text-white border border-white/20'}
                `}
                style={{ 
                    top: i === 0 ? '20%' : i === 1 ? '50%' : '75%',
                    left: i === 0 ? '20%' : i === 1 ? '65%' : '25%'
                }}
            >
                <span className="text-3xl">{t.icon}</span>
                <span className="text-[7px] font-black uppercase tracking-widest mt-1">{t.name}</span>
            </button>
        ))}

        {isNegotiating && !busted && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-center p-10">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-6" />
            <h3 className="font-cartoon text-2xl text-white mb-2">NEGOCIANDO...</h3>
            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest animate-pulse">Cuidado com a patrulha</p>
          </div>
        )}

        {busted && (
            <div className="absolute inset-0 bg-red-950/90 backdrop-blur-xl z-[150] flex flex-col items-center justify-center text-center p-10 border-4 border-red-600 animate-in zoom-in duration-300">
                <div className="text-7xl mb-6">🚨</div>
                <h3 className="font-cartoon text-4xl text-white mb-4">ENQUADRADO!</h3>
                <p className="text-sm text-red-200 font-bold uppercase tracking-widest leading-relaxed">
                    A polícia confiscou seu produto e aplicou uma multa pesada.
                </p>
                <div className="flex gap-4 mt-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-full animate-pulse shadow-[0_0_20px_blue]" />
                    <div className="w-12 h-12 bg-red-600 rounded-full animate-pulse delay-75 shadow-[0_0_20px_red]" />
                </div>
            </div>
        )}
      </div>

      {selectedTerritory && !isNegotiating && (
        <div className="fixed inset-x-0 bottom-0 z-[200] bg-zinc-950/95 backdrop-blur-2xl border-t-2 border-white/10 p-6 rounded-t-[2.5rem] animate-in slide-in-from-bottom duration-300">
           <div className="flex justify-between items-start mb-6">
             <div>
               <h3 className="font-cartoon text-xl" style={{ color: selectedTerritory.color }}>{selectedTerritory.name}</h3>
               <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">{selectedTerritory.description}</p>
             </div>
             <div className="flex flex-col items-end">
               <span className="text-[9px] text-red-500 font-black uppercase">Risco: {Math.round(selectedTerritory.riskChance * 100)}%</span>
               <span className="text-[9px] text-green-500 font-black uppercase">Bônus: +{Math.round((selectedTerritory.priceBonus - 1) * 100)}%</span>
             </div>
           </div>

           <div className="flex gap-4 overflow-x-auto no-scrollbar mb-6 pb-2 px-1">
             {availableItems.length > 0 ? availableItems.map(item => {
               const seed = getSeedFromItem(item.id);
               return (
                 <button 
                  key={item.id}
                  onClick={() => { setSellingItem(item.id); setAmount(1); }}
                  className={`flex-shrink-0 w-20 h-24 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1.5
                    ${sellingItem === item.id ? 'bg-white border-white shadow-xl scale-110' : 'bg-white/5 border-white/5'}
                  `}
                 >
                   <span className="text-2xl">{item.id.endsWith('_hash') ? '🍫' : '🌿'}</span>
                   <span className={`text-[8px] font-black uppercase text-center leading-tight px-1 ${sellingItem === item.id ? 'text-black' : 'text-white/60'}`}>
                     {seed?.name}
                   </span>
                   <span className={`text-[7px] font-bold ${sellingItem === item.id ? 'text-black/40' : 'text-white/20'}`}>
                     {item.qty} un
                   </span>
                 </button>
               );
             }) : (
               <p className="text-[10px] text-zinc-600 italic uppercase font-black">Sem mercadoria disponível.</p>
             )}
           </div>

           {sellingItem && selectedSeed && (
             <div className="flex flex-col gap-4">
               <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl">
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase text-white/30">Quantidade</span>
                    <span className="text-[10px] font-black uppercase text-indigo-400">{amount} unidades</span>
                 </div>
                 <div className="flex gap-2">
                   <button onClick={() => setAmount(Math.max(1, amount - 1))} className="w-8 h-8 bg-white/10 rounded-lg font-bold text-xs hover:bg-white/20">-</button>
                   <button onClick={() => setAmount(Math.min(player.inventory[sellingItem], amount + 1))} className="w-8 h-8 bg-white/10 rounded-lg font-bold text-xs hover:bg-white/20">+</button>
                   <button onClick={() => setAmount(player.inventory[sellingItem])} className="px-3 h-8 bg-white/10 rounded-lg text-[8px] font-black uppercase hover:bg-white/20">Max</button>
                 </div>
               </div>

               <button 
                onClick={handleStartDeal}
                className="w-full py-4 rounded-2xl bg-white text-black font-cartoon text-sm hover:brightness-90 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
               >
                 VENDER {selectedSeed.name.toUpperCase()}
               </button>
               <button onClick={() => setSelectedTerritory(null)} className="w-full py-1 text-zinc-600 text-[8px] font-black uppercase tracking-widest">Cancelar</button>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default CityMap;
