
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
  const [fineAmount, setFineAmount] = useState(0);

  // NPCs CRÍTICOS: @Cellin, ICKY767, CPXINSANE, IGOWEED, Dancrema
  const ELITE_NPC_IDS = ['n1', 'n2', 'n3', 'n4', 'n6'];
  const ELITE_REQ_VAL = 100;

  const checkEliteAccess = () => {
    const missing = ELITE_NPC_IDS.map(id => {
      const npcRep = player.reputation[id] || 0;
      const npcName = id === 'n1' ? '@Cellin' : 
                     id === 'n2' ? 'ICKY767' : 
                     id === 'n3' ? 'CPXINSANE' : 
                     id === 'n4' ? 'IGOWEED' : 'Dancrema';
      return { 
        id, 
        current: npcRep, 
        target: ELITE_REQ_VAL, 
        name: npcName
      };
    }).filter(m => m.current < m.target);
    
    return { locked: missing.length > 0, missing };
  };

  const checkTerritoryLock = (territoryId: string) => {
    // A Favela High-Tech exige a reputação elite
    if (territoryId === 'favela_hightech') {
      return checkEliteAccess();
    }
    return { locked: false, missing: [] };
  };

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
      
      const baseValue = sellingItem.endsWith('_hash') ? seed.baseValue * 5.5 : seed.baseValue * 1.5;
      const finalPrice = Math.floor(baseValue * amount * selectedTerritory.priceBonus);

      if (wasBusted) {
          // Multa visual de 15%
          const fine = Math.floor(player.coins * 0.15);
          setFineAmount(fine);
          setBusted(true);
          onSale(sellingItem, amount, finalPrice, true);
          setTimeout(() => {
              setBusted(false);
              setIsNegotiating(false);
              setSelectedTerritory(null);
          }, 3500);
      } else {
          onSale(sellingItem, amount, finalPrice, false);
          setIsNegotiating(false);
          setSellingItem(null);
          setSelectedTerritory(null);
      }
    }, 2500);
  };

  const getSeedFromItem = (itemId?: string | null) => {
    if (!itemId) return null;
    const seedId = itemId.replace('_bud', '').replace('_hash', '');
    return SEEDS.find(s => s.id === seedId);
  };

  const selectedSeed = sellingItem ? getSeedFromItem(sellingItem) : null;

  const markerPositions = [
    { top: '25%', left: '20%' }, // Subúrbio
    { top: '15%', left: '60%' }, // Porto
    { top: '50%', left: '70%' }, // Centro
    { top: '80%', left: '30%' }, // Quebrada
    { top: '65%', left: '15%' }  // Favela (Lock)
  ];

  return (
    <div className="w-full h-full flex flex-col gap-4 animate-in fade-in duration-300 relative pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-cartoon text-3xl text-white">Metrópole Neon</h2>
          <p className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.2em]">Mercado Livre de Vendas</p>
        </div>
        <button onClick={onBack} className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-white/5 active:scale-95 transition-all">Sair</button>
      </div>

      <div className="flex-1 w-full bg-zinc-950 border-4 border-white/5 rounded-[3.5rem] relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=800")',
          backgroundSize: 'cover',
          filter: 'hue-rotate(45deg) saturate(1.5)'
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
        
        {TERRITORIES.map((t, i) => {
            const { locked } = checkTerritoryLock(t.id);
            const isSelected = selectedTerritory?.id === t.id;
            return (
                <button 
                    key={t.id}
                    onClick={() => setSelectedTerritory(t)}
                    className={`absolute w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-95 z-10
                        ${isSelected ? 'bg-white text-black shadow-[0_0_35px_white] scale-110' : locked ? 'bg-black/90 text-white/10 border border-white/5 grayscale' : 'bg-black/70 text-white border border-white/20 shadow-xl'}
                    `}
                    style={{ 
                        top: markerPositions[i]?.top || '10%',
                        left: markerPositions[i]?.left || '10%'
                    }}
                >
                    <span className="text-2xl">{locked ? '🔒' : isSelected ? '📍' : t.icon}</span>
                    <span className={`text-[6px] font-black uppercase tracking-widest mt-1 text-center leading-none px-1 ${isSelected ? 'text-black' : 'text-white/40'}`}>
                      {t.name}
                    </span>
                </button>
            );
        })}

        {isNegotiating && !busted && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-center p-10">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-6" />
            <h3 className="font-cartoon text-2xl text-white mb-2 uppercase tracking-tighter">Negociando...</h3>
            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest animate-pulse italic">Fique frio, a grana tá vindo</p>
          </div>
        )}

        {busted && (
            <div className="absolute inset-0 bg-red-950/95 backdrop-blur-xl z-[150] flex flex-col items-center justify-center text-center p-10 border-4 border-red-600 animate-in zoom-in duration-300">
                <div className="text-8xl mb-6">👮‍♂️🚨</div>
                <h3 className="font-cartoon text-4xl text-white mb-4">ENQUADRADO!</h3>
                <div className="bg-black/40 px-6 py-3 rounded-2xl border border-white/10 mb-4">
                  <p className="text-red-400 font-cartoon text-xl">- 🪙 {fineAmount}</p>
                  <p className="text-[10px] text-white/40 uppercase font-black">Multa de 15% aplicada</p>
                </div>
                <p className="text-sm text-red-200 font-black uppercase tracking-widest leading-relaxed">
                    A patrulha confiscou toda a carga <br/>e levou uma fatia do seu lucro!
                </p>
            </div>
        )}
      </div>

      {selectedTerritory && !isNegotiating && (
        <div className="fixed inset-x-0 bottom-0 z-[200] bg-zinc-950/98 backdrop-blur-3xl border-t-2 border-white/10 p-7 rounded-t-[3.5rem] animate-in slide-in-from-bottom duration-500 shadow-[0_-20px_60px_rgba(0,0,0,0.8)]">
           {(() => {
             const { locked, missing } = checkTerritoryLock(selectedTerritory.id);
             if (locked) {
               return (
                 <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <span className="text-3xl">🔐</span>
                         <div>
                            <h3 className="font-cartoon text-xl text-zinc-400">Acesso Restrito</h3>
                            <p className="text-[8px] text-zinc-600 uppercase font-black">Favela High-Tech</p>
                         </div>
                      </div>
                      <button onClick={() => setSelectedTerritory(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 text-xs">✕</button>
                    </div>
                    
                    <div className="bg-black/40 p-5 rounded-3xl border border-white/5">
                      <p className="text-[9px] text-zinc-500 uppercase font-black leading-relaxed mb-4">
                        Este local é dominado pela Elite. <br/>Para entrar, você precisa de <span className="text-indigo-400">Reputação 100+</span> com todos os contatos influentes:
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3">
                         {missing.map(m => (
                           <div key={m.id} className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col gap-2">
                             <div className="flex justify-between items-center">
                               <span className="text-[8px] font-black text-white/60 truncate">{m.name}</span>
                               <span className="text-[8px] font-black text-red-400/80">{Math.floor(m.current)}/100</span>
                             </div>
                             <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                               <div className="h-full bg-red-500/50" style={{ width: `${(m.current / 100) * 100}%` }} />
                             </div>
                           </div>
                         ))}
                      </div>
                    </div>
                 </div>
               );
             }

             return (
               <>
                 <div className="flex justify-between items-start mb-8">
                   <div>
                     <h3 className="font-cartoon text-2xl" style={{ color: selectedTerritory.color }}>{selectedTerritory.name}</h3>
                     <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">{selectedTerritory.description}</p>
                   </div>
                   <div className="flex flex-col items-end gap-1">
                     <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-lg text-[9px] font-black border border-red-500/20 uppercase">Risco: {Math.round(selectedTerritory.riskChance * 100)}%</span>
                     <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-lg text-[9px] font-black border border-green-500/20 uppercase">Lucro: +{Math.round((selectedTerritory.priceBonus - 1) * 100)}%</span>
                   </div>
                 </div>

                 <div className="flex gap-4 overflow-x-auto no-scrollbar mb-8 pb-2">
                   {availableItems.length > 0 ? availableItems.map(item => {
                     const seed = getSeedFromItem(item.id);
                     const isSelected = sellingItem === item.id;
                     return (
                       <button 
                        key={item.id}
                        onClick={() => { setSellingItem(item.id); setAmount(1); }}
                        className={`flex-shrink-0 w-24 h-28 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-2 shadow-xl
                          ${isSelected ? 'bg-white border-white scale-105 shadow-white/10' : 'bg-white/5 border-white/5 hover:bg-white/10'}
                        `}
                       >
                         <span className="text-3xl">{item.id.endsWith('_hash') ? '🍫' : '🌿'}</span>
                         <div className="text-center">
                            <span className={`text-[9px] font-black uppercase block leading-tight px-2 truncate w-20 ${isSelected ? 'text-black' : 'text-white'}`}>
                              {seed?.name}
                            </span>
                            <span className={`text-[7px] font-bold uppercase mt-1 ${isSelected ? 'text-black/40' : 'text-white/20'}`}>
                              {item.qty} un
                            </span>
                         </div>
                       </button>
                     );
                   }) : (
                     <div className="w-full py-8 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <p className="text-[10px] text-zinc-600 italic uppercase font-black">Nenhum produto em estoque.</p>
                     </div>
                   )}
                 </div>

                 {sellingItem && selectedSeed && (
                   <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <div className="flex items-center justify-between bg-black/40 p-4 rounded-3xl border border-white/5">
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase text-white/20 tracking-widest">Ajustar Quantidade</span>
                          <span className="text-xs font-black uppercase text-indigo-400 mt-1">{amount} unidades selecionadas</span>
                       </div>
                       <div className="flex gap-3">
                         <button onClick={() => setAmount(Math.max(1, amount - 1))} className="w-10 h-10 bg-white/5 rounded-xl font-bold text-lg hover:bg-white/10 border border-white/10 transition-all active:scale-90">-</button>
                         <button onClick={() => setAmount(Math.min(player.inventory[sellingItem], amount + 1))} className="w-10 h-10 bg-white/5 rounded-xl font-bold text-lg hover:bg-white/10 border border-white/10 transition-all active:scale-90">+</button>
                         <button onClick={() => setAmount(player.inventory[sellingItem])} className="px-4 h-10 bg-indigo-600/20 text-indigo-400 border border-indigo-400/30 rounded-xl text-[9px] font-black uppercase hover:bg-indigo-600/30 transition-all active:scale-95">Max</button>
                       </div>
                     </div>

                     <button 
                      onClick={handleStartDeal}
                      className="w-full py-5 rounded-[2rem] bg-white text-black font-cartoon text-sm hover:brightness-90 active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3"
                     >
                       FECHAR NEGÓCIO (+{Math.round((selectedTerritory.priceBonus - 1) * 100)}% LUCRO)
                     </button>
                     <button onClick={() => setSelectedTerritory(null)} className="w-full py-1 text-zinc-700 text-[9px] font-black uppercase tracking-[0.3em] hover:text-zinc-500 transition-colors">Cancelar Operação</button>
                   </div>
                 )}
               </>
             );
           })()}
        </div>
      )}
    </div>
  );
};

export default CityMap;
