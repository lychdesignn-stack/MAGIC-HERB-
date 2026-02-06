
import React, { useState } from 'react';
import { Player, Territory, MapOffer, Rarity } from '../types';
import { TERRITORIES, SEEDS } from '../constants';

interface CityMapProps {
  player: Player;
  mapOffers: MapOffer[];
  onSale: (offerId: string, wasBusted: boolean) => void;
  onBack: () => void;
}

const CityMap: React.FC<CityMapProps> = ({ player, mapOffers, onSale, onBack }) => {
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [busted, setBusted] = useState(false);
  const [fineAmount, setFineAmount] = useState(0);

  const checkZoneAccess = (territory: Territory) => {
    const totalRep = player.totalReputation;
    const level = player.level;
    const rarity = territory.requiredRarity;
    
    // REGRA 10: Desbloqueio
    if (rarity === Rarity.COMUM_A) return { locked: false, req: "" };
    if (rarity === Rarity.COMUM_B) return { locked: !(totalRep >= 15 && level >= 2), req: "REP 15 | LVL 2" };
    if (rarity === Rarity.RARA) return { locked: !(totalRep >= 50 && level >= 5), req: "REP 50 | LVL 5" };
    if (rarity === Rarity.LENDARIA) return { locked: !(totalRep >= 120 && level >= 9), req: "REP 120 | LVL 9" };
    if (rarity === Rarity.MISTICA) return { locked: !(totalRep >= 250 && level >= 15), req: "REP 250 | LVL 15" };
    
    return { locked: false, req: "" };
  };

  const handleStartDeal = (offer: MapOffer) => {
    if (!selectedTerritory) return;
    setIsNegotiating(true);
    
    setTimeout(() => {
      const wasBusted = Math.random() < selectedTerritory.riskChance;

      if (wasBusted) {
          const estimatedFine = Math.floor(player.coins * 0.05);
          setFineAmount(estimatedFine);
          setBusted(true);
          onSale(offer.id, true);
          setTimeout(() => {
              setBusted(false);
              setIsNegotiating(false);
              setSelectedTerritory(null);
          }, 3500);
      } else {
          onSale(offer.id, false);
          setIsNegotiating(false);
          setSelectedTerritory(null);
      }
    }, 2500);
  };

  const markerPositions = [
    { top: '25%', left: '20%' }, // Subúrbio
    { top: '15%', left: '60%' }, // Porto
    { top: '50%', left: '70%' }, // Centro
    { top: '80%', left: '30%' }, // Quebrada
    { top: '65%', left: '15%' }  // Favela
  ];

  return (
    <div className="w-full h-full flex flex-col gap-4 animate-in fade-in duration-300 relative pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-cartoon text-3xl text-white">Zonas de Entrega</h2>
          <p className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.2em]">Mercado de Ponto</p>
        </div>
        <button onClick={onBack} className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-white/5 active:scale-95 transition-all">Sair</button>
      </div>

      <div className="flex-1 w-full bg-zinc-950 border-4 border-white/5 rounded-[3.5rem] relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=800")',
          backgroundSize: 'cover', filter: 'hue-rotate(45deg) saturate(1.5)'
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
        
        {TERRITORIES.map((t, i) => {
            const { locked } = checkZoneAccess(t);
            const isSelected = selectedTerritory?.id === t.id;
            const offer = mapOffers.find(o => o.territoryId === t.id);
            
            return (
                <div 
                    key={t.id}
                    className="absolute z-10 flex flex-col items-center"
                    style={{ top: markerPositions[i]?.top, left: markerPositions[i]?.left }}
                >
                    {offer && !locked && (
                      <div className="mb-2 bg-indigo-500 text-white px-2 py-0.5 rounded-lg text-[6px] font-black uppercase shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-bounce border border-indigo-400">
                         PEDIDO
                      </div>
                    )}
                    <button 
                        onClick={() => setSelectedTerritory(t)}
                        className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-95
                            ${isSelected ? 'bg-white text-black shadow-[0_0_35px_white] scale-110' : locked ? 'bg-black/90 text-white/10 border border-white/5 grayscale' : 'bg-black/70 text-white border border-white/20 shadow-xl'}
                        `}
                    >
                        <span className="text-xl">{locked ? '🔒' : isSelected ? '📍' : t.icon}</span>
                        <span className={`text-[5px] font-black uppercase tracking-widest mt-1 text-center leading-none px-1 ${isSelected ? 'text-black' : 'text-white/40'}`}>
                          {t.name}
                        </span>
                    </button>
                </div>
            );
        })}

        {isNegotiating && !busted && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-center p-10">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-6" />
            <h3 className="font-cartoon text-2xl text-white mb-2 uppercase tracking-tighter">Operando Entrega...</h3>
          </div>
        )}

        {busted && (
            <div className="absolute inset-0 bg-red-950/95 backdrop-blur-xl z-[150] flex flex-col items-center justify-center text-center p-10 border-4 border-red-600 animate-in zoom-in duration-300">
                <div className="text-8xl mb-6">👮🚨</div>
                <h3 className="font-cartoon text-4xl text-white mb-4">ENQUADRADO!</h3>
                <div className="bg-black/40 px-6 py-3 rounded-2xl border border-white/10 mb-4">
                  <p className="text-red-400 font-cartoon text-xl">- 🪙 ~5%</p>
                  <p className="text-[10px] text-white/40 uppercase font-black">Multa de 4% a 6% Aplicada</p>
                </div>
            </div>
        )}
      </div>

      {selectedTerritory && !isNegotiating && (
        <div className="fixed inset-x-0 bottom-0 z-[200] bg-zinc-950/98 backdrop-blur-3xl border-t-2 border-white/10 p-7 rounded-t-[3.5rem] animate-in slide-in-from-bottom duration-500 shadow-[0_-20px_60px_rgba(0,0,0,0.8)]">
           {(() => {
             const { locked, req } = checkZoneAccess(selectedTerritory);
             if (locked) {
               return (
                 <div className="flex flex-col gap-6 text-center">
                    <span className="text-5xl">🛑</span>
                    <h3 className="font-cartoon text-xl text-zinc-400">Ponto Restrito</h3>
                    <p className="text-[10px] text-red-400 uppercase font-black">Requisito: {req}</p>
                    <button onClick={() => setSelectedTerritory(null)} className="py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase text-white/40">Sair</button>
                 </div>
               );
             }

             const offer = mapOffers.find(o => o.territoryId === selectedTerritory.id);
             const seed = offer ? SEEDS.find(s => offer.itemId.startsWith(s.id)) : null;
             const playerQty = offer ? player.inventory[offer.itemId] || 0 : 0;
             const hasEnough = offer ? playerQty >= offer.quantity : false;
             const riskPercent = Math.round(selectedTerritory.riskChance * 100);
             
             return (
               <div className="flex flex-col gap-6">
                 <div className="flex justify-between items-start">
                   <div>
                     <h3 className="font-cartoon text-2xl" style={{ color: selectedTerritory.color }}>{selectedTerritory.name}</h3>
                     <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">{selectedTerritory.description}</p>
                   </div>
                   <div className="flex flex-col items-end gap-1">
                     <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${riskPercent >= 20 ? 'bg-red-600 border-red-400 text-white animate-pulse' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                       Risco: {riskPercent}%
                     </span>
                     <span className="bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded text-[8px] font-black border border-indigo-500/20 uppercase">
                       +5 XP / +3 REP
                     </span>
                   </div>
                 </div>

                 {offer && seed ? (
                   <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 flex flex-col gap-5">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-black/40 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-white/5">
                               {offer.itemId.endsWith('_hash') ? '🍫' : '🌿'}
                            </div>
                            <div>
                               <h4 className="font-black text-white uppercase text-sm">{seed.name}</h4>
                               <p className={`text-[10px] font-bold mt-1 ${hasEnough ? 'text-green-400' : 'text-red-400'}`}>
                                 {playerQty} / {offer.quantity} Disponível
                               </p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] text-zinc-500 uppercase font-black">Pagamento</p>
                            <p className="text-xl font-cartoon text-green-400">🪙 {offer.price.toLocaleString()}</p>
                         </div>
                      </div>

                      <button 
                        disabled={!hasEnough}
                        onClick={() => handleStartDeal(offer)}
                        className={`w-full py-5 rounded-[2rem] font-cartoon text-sm shadow-2xl transition-all
                          ${hasEnough ? 'bg-white text-black active:scale-95' : 'bg-zinc-800 text-zinc-600 grayscale'}
                        `}
                      >
                        {hasEnough ? 'EFETUAR ENTREGA' : 'ESTOQUE INSUFICIENTE'}
                      </button>
                   </div>
                 ) : (
                   <div className="py-10 text-center bg-black/40 rounded-[2.5rem] border border-dashed border-white/10">
                      <p className="text-[10px] text-zinc-600 uppercase font-black italic">Buscando novos contatos na área...</p>
                   </div>
                 )}
                 <button onClick={() => setSelectedTerritory(null)} className="py-1 text-zinc-700 text-[9px] font-black uppercase tracking-[0.3em]">Fechar Mapa</button>
               </div>
             );
           })()}
        </div>
      )}
    </div>
  );
};

export default CityMap;
