
import React, { useEffect, useRef } from 'react';
import { NPCS, SEEDS } from '../constants';
import { Player, Offer, Rarity } from '../types';

interface NPCPanelProps {
  player: Player;
  offers: Offer[];
  onAcceptOffer: (offer: Offer) => void;
  onBack: () => void;
  aiDialogue: string;
  onGreet: (name: string) => void;
  offerResetIn: number;
}

const NPCPanel: React.FC<NPCPanelProps> = ({ player, offers, onAcceptOffer, onBack, aiDialogue, onGreet, offerResetIn }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unlockedNpcs = NPCS.filter(npc => npc.rarityRequired === null || player.unlockedRarities.includes(npc.rarityRequired));
    if (unlockedNpcs.length > 0) {
      onGreet(unlockedNpcs[Math.floor(Math.random() * unlockedNpcs.length)].name);
    }
  }, []);

  const getReputationLevel = (rep: number) => {
    if (rep >= 1000) return { label: 'Lenda', color: 'text-amber-400', icon: '👑', bg: 'bg-amber-400/10' };
    if (rep >= 500) return { label: 'Elite', color: 'text-pink-500', icon: '💎', bg: 'bg-pink-500/10' };
    if (rep >= 200) return { label: 'Sócio', color: 'text-purple-400', icon: '🏢', bg: 'bg-purple-400/10' };
    if (rep >= 50) return { label: 'Truta', color: 'text-blue-400', icon: '🤙', bg: 'bg-blue-400/10' };
    return { label: 'Estranho', color: 'text-zinc-500', icon: '👤', bg: 'bg-zinc-500/10' };
  };

  const isNpcUnlocked = (npc: typeof NPCS[0]) => {
    return npc.rarityRequired === null || player.unlockedRarities.includes(npc.rarityRequired);
  };

  const formatTime = (ms: number) => {
    const totalSecs = Math.max(0, Math.floor(ms / 1000));
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full flex flex-col gap-5 animate-in slide-in-from-right duration-300">
      {/* Header Compacto */}
      <div className="flex items-end justify-between px-1">
        <div>
          <h2 className="font-cartoon text-2xl text-white tracking-tight">Vendas & Contatos</h2>
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Gerencie sua rede galáctica</p>
        </div>
        <div className="bg-white/5 px-2 py-1 rounded-lg border border-white/10 flex items-center gap-2">
           <span className="text-[10px] text-zinc-400 font-bold uppercase">Reputação Total</span>
           <span className="text-xs font-cartoon text-indigo-400">
             {(Object.values(player.reputation) as number[]).reduce((a, b) => (a as number) + (b as number), 0)}
           </span>
        </div>
      </div>

      {/* Modern Reputation Bar - Touch Enabled Carousel */}
      <section className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-4 shadow-2xl relative overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex flex-nowrap gap-6 overflow-x-auto no-scrollbar py-2 px-1 touch-pan-x scroll-smooth select-none cursor-grab active:cursor-grabbing"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {NPCS.map(npc => {
            const unlocked = isNpcUnlocked(npc);
            const rep = player.reputation[npc.id] || 0;
            const { label, color, icon, bg } = getReputationLevel(rep);
            
            return (
              <div key={npc.id} className="flex-shrink-0 flex flex-col items-center gap-2 w-20 transition-all duration-300">
                <div className={`relative ${!unlocked ? 'grayscale' : ''}`}>
                   <div className={`w-14 h-14 rounded-2xl border border-white/10 overflow-hidden relative z-10 flex items-center justify-center transition-all ${unlocked ? 'bg-zinc-800 shadow-lg' : 'bg-zinc-950/90 border-dashed opacity-40 shadow-inner'}`}>
                     {unlocked ? (
                       <img src={npc.avatar} className="w-full h-full object-cover pointer-events-none" />
                     ) : (
                       <span className="text-xl opacity-60">🔒</span>
                     )}
                   </div>
                   {unlocked && (
                     <div className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 ${bg} backdrop-blur-md rounded-full flex items-center justify-center text-[10px] border border-white/20 z-20 shadow-xl`}>
                       {icon}
                     </div>
                   )}
                </div>
                <div className="text-center w-full">
                  <span className={`text-[9px] font-black block truncate leading-none mb-1 ${unlocked ? 'text-white/80' : 'text-white/20 uppercase'}`}>
                    {unlocked ? npc.name : 'BLOQUEADO'}
                  </span>
                  {unlocked ? (
                    <span className={`text-[7px] font-black uppercase ${color} tracking-tighter`}>{label}</span>
                  ) : (
                    <span className="text-[7px] text-zinc-600 font-bold uppercase tracking-tighter truncate max-w-full block">
                       {npc.rarityRequired}
                    </span>
                  )}
                </div>
                {unlocked && (
                  <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden mt-0.5">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700" 
                      style={{ width: `${Math.min(100, (rep / 1000) * 100)}%` }} 
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Active Offers Section */}
      <div className="flex flex-col gap-4 pb-32">
        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col">
            <h3 className="font-cartoon text-sm text-yellow-400 uppercase tracking-widest">Contratos Ativos</h3>
            <div className="flex items-center gap-2">
              <p className="text-[8px] text-zinc-500 font-bold italic">*Contratos expiram em breve</p>
              <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                 <span className="text-[7px] text-amber-500/60 uppercase font-black">Reset em:</span>
                 <span className="text-[8px] text-amber-500 font-black tabular-nums">{formatTime(offerResetIn)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
            <span className="text-[9px] font-black text-green-500 uppercase tracking-tighter">Mercado Aberto</span>
          </div>
        </div>
        
        {offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10 opacity-30">
             <span className="text-5xl mb-4">🛸</span>
             <p className="text-[10px] font-cartoon uppercase tracking-widest text-center px-10 leading-relaxed">Sintonizando frequências galácticas para novos negócios...</p>
          </div>
        ) : (
          offers.map(offer => {
            const npc = NPCS.find(n => n.id === offer.npcId)!;
            const seed = SEEDS.find(s => offer.itemId.startsWith(s.id))!;
            const isHash = offer.itemId.endsWith('_hash');
            const playerQty = player.inventory[offer.itemId] || 0;
            const hasStock = playerQty >= offer.quantity;
            const isHashCoin = offer.currency === 'hashCoins';

            return (
              <div 
                key={offer.id} 
                className={`
                  bg-zinc-900/90 border border-white/5 p-5 rounded-[2.5rem] flex flex-col gap-4 relative overflow-hidden transition-all shadow-2xl active:scale-[0.98]
                  ${isHashCoin ? 'ring-2 ring-amber-500/30' : 'hover:border-indigo-500/40'}
                `}
              >
                {/* Currency Indicator */}
                <div className={`absolute top-0 right-0 px-5 py-2 rounded-bl-[2rem] flex items-center gap-1.5 z-10 font-cartoon text-xs shadow-xl
                  ${isHashCoin ? 'bg-amber-500 text-black' : 'bg-indigo-600 text-white'}
                `}>
                  {offer.price} {isHashCoin ? '🍪' : '🪙'}
                </div>

                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img src={npc.avatar} className="w-12 h-12 rounded-2xl border border-white/10 bg-zinc-800 p-0.5 shadow-md" />
                    <div>
                      <h4 className="text-xs font-black text-white/95 tracking-tight">{npc.name}</h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-indigo-400 font-black uppercase">+{offer.reputationAward} REP</span>
                        <div className="w-1 h-1 bg-white/20 rounded-full" />
                        <span className="text-[9px] text-zinc-500 font-bold">{getReputationLevel(player.reputation[npc.id] || 0).label}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deal Box */}
                <div className="bg-black/40 rounded-[2rem] p-4 flex items-center justify-between border border-white/5 group relative overflow-hidden">
                  <div className="flex items-center gap-3 relative z-10">
                    <div 
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border border-white/10 shadow-inner transition-all group-hover:scale-110 group-hover:rotate-3`}
                      style={{ backgroundColor: seed.color + '15' }}
                    >
                      {isHash ? '🍫' : '🌿'}
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-white/95">{seed.name}</p>
                      <p className={`text-[9px] font-black uppercase tracking-tighter mb-1.5 ${isHash ? 'text-amber-500' : 'text-green-500'}`}>
                        {isHash ? 'Haxixe Extraído' : 'Flor Curada'}
                      </p>
                      {/* Stock Bar */}
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
                           <div 
                             className={`h-full transition-all duration-700 rounded-full ${hasStock ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} 
                             style={{ width: `${Math.min(100, (playerQty / offer.quantity) * 100)}%` }} 
                           />
                        </div>
                        <span className={`text-[9px] font-black tabular-nums ${hasStock ? 'text-green-500' : 'text-red-400'}`}>
                          {playerQty}/{offer.quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    disabled={!hasStock}
                    onClick={() => onAcceptOffer(offer)}
                    className={`
                      px-6 py-3.5 rounded-2xl font-cartoon text-[10px] uppercase tracking-[0.15em] transition-all relative z-10
                      ${hasStock 
                        ? 'bg-indigo-600 shadow-[0_5px_0_rgb(49,46,129)] text-white hover:brightness-110 active:translate-y-1 active:shadow-none' 
                        : 'bg-zinc-800 text-zinc-600 border border-white/5 cursor-not-allowed grayscale'}
                    `}
                  >
                    Vender
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NPCPanel;
