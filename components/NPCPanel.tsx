
import React, { useEffect, useRef, useMemo } from 'react';
import { NPCS, SEEDS, RARITY_DISPLAY } from '../constants';
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

  const totalReputation = player.totalReputation;
  const currentLevel = player.level;

  const isNpcUnlocked = (npc: typeof NPCS[0]) => {
    const rarity = npc.rarity || Rarity.COMUM_A;
    
    // REGRA 10: Desbloqueio por progressão
    if (rarity === Rarity.COMUM_A) return true;
    if (rarity === Rarity.COMUM_B) return totalReputation >= 15 && currentLevel >= 2;
    if (rarity === Rarity.RARA) return totalReputation >= 50 && currentLevel >= 5;
    if (rarity === Rarity.LENDARIA) return totalReputation >= 120 && currentLevel >= 9;
    if (rarity === Rarity.MISTICA) return totalReputation >= 250 && currentLevel >= 15;
    
    return true;
  };

  const getUnlockRequirementLabel = (npc: typeof NPCS[0]) => {
    const rarity = npc.rarity || Rarity.COMUM_A;
    if (rarity === Rarity.COMUM_B) return "REP 15 | LVL 2";
    if (rarity === Rarity.RARA) return "REP 50 | LVL 5";
    if (rarity === Rarity.LENDARIA) return "REP 120 | LVL 9";
    if (rarity === Rarity.MISTICA) return "REP 250 | LVL 15";
    return "Acesso Livre";
  };

  useEffect(() => {
    const unlockedNpcs = NPCS.filter(npc => isNpcUnlocked(npc));
    if (unlockedNpcs.length > 0) {
      onGreet(unlockedNpcs[Math.floor(Math.random() * unlockedNpcs.length)].name);
    }
  }, []);

  const getReputationLabel = (rep: number) => {
    if (rep >= 1000) return { label: 'Lenda', color: 'text-amber-400', icon: '👑', bg: 'bg-amber-400/10' };
    if (rep >= 500) return { label: 'Elite', color: 'text-pink-500', icon: '💎', bg: 'bg-pink-500/10' };
    if (rep >= 200) return { label: 'Sócio', color: 'text-purple-400', icon: '🏢', bg: 'bg-purple-400/10' };
    if (rep >= 50) return { label: 'Truta', color: 'text-blue-400', icon: '🤙', bg: 'bg-blue-400/10' };
    return { label: 'Estranho', color: 'text-zinc-500', icon: '👤', bg: 'bg-zinc-500/10' };
  };

  const formatTime = (ms: number) => {
    const totalSecs = Math.max(0, Math.floor(ms / 1000));
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return val.toString();
  };

  const getRarityBadgeStyles = (rarity?: Rarity) => {
    switch (rarity) {
      case Rarity.MISTICA:
        return 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse-gold';
      case Rarity.LENDARIA:
        return 'bg-amber-500 border-amber-300 text-black shadow-[0_0_10px_rgba(245,158,11,0.8)]';
      case Rarity.RARA:
        return 'bg-purple-600 border-purple-400 text-white';
      case Rarity.COMUM_B:
        return 'bg-indigo-600 border-indigo-400 text-white';
      default:
        return 'bg-zinc-700 border-zinc-500 text-zinc-300';
    }
  };

  const filteredOffers = offers.filter(offer => {
    const npc = NPCS.find(n => n.id === offer.npcId);
    return npc && isNpcUnlocked(npc);
  });

  return (
    <div className="w-full flex flex-col gap-5 animate-in slide-in-from-right duration-300">
      <div className="flex items-end justify-between px-1">
        <div>
          <h2 className="font-cartoon text-2xl text-white tracking-tight">Vendas & Contatos</h2>
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Mercado de Estufa</p>
        </div>
        <div className="bg-white/5 px-2 py-1 rounded-lg border border-white/10 flex items-center gap-2">
           <span className="text-[10px] text-zinc-400 font-bold uppercase">Reputação Total</span>
           <span className="text-xs font-cartoon text-indigo-400">
             {totalReputation}
           </span>
        </div>
      </div>

      <section className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-4 shadow-2xl relative overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex flex-nowrap gap-6 overflow-x-auto no-scrollbar py-2 px-1 touch-pan-x scroll-smooth select-none cursor-grab active:cursor-grabbing"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {NPCS.map(npc => {
            const unlocked = isNpcUnlocked(npc);
            const rep = player.reputation[npc.id] || 0;
            const { label, color, icon, bg } = getReputationLabel(rep);
            const rarityDisplay = RARITY_DISPLAY[npc.rarity || Rarity.COMUM_A];
            
            return (
              <div key={npc.id} className="flex-shrink-0 flex flex-col items-center gap-2 w-20 transition-all duration-300">
                <div className={`relative ${!unlocked ? 'grayscale-[0.8]' : ''}`}>
                   <div className={`w-14 h-14 rounded-2xl border border-white/10 overflow-hidden relative z-10 flex items-center justify-center transition-all ${unlocked ? 'bg-zinc-800 shadow-lg' : 'bg-zinc-950/90 border-dashed opacity-40 shadow-inner'}`}>
                     {unlocked ? (
                       <img src={npc.avatar} className="w-full h-full object-cover pointer-events-none" />
                     ) : (
                       <span className="text-xl opacity-60">🔒</span>
                     )}
                   </div>
                   
                   {npc.rarity && (
                     <div className="absolute -top-1.5 -left-1.5 z-30 pointer-events-none">
                        <span className={`text-[6px] font-black px-1.5 py-0.5 rounded-md border uppercase tracking-tighter ${getRarityBadgeStyles(npc.rarity)} ${unlocked ? '' : 'opacity-60'}`}>
                          {rarityDisplay}
                        </span>
                     </div>
                   )}

                   {unlocked && (
                     <div className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 ${bg} backdrop-blur-md rounded-full flex items-center justify-center text-[10px] border border-white/20 z-20 shadow-xl`}>
                       {icon}
                     </div>
                   )}
                </div>
                <div className="text-center w-full">
                  <span className={`text-[9px] font-black block truncate leading-none mb-1 ${unlocked ? 'text-white/80' : 'text-white/30 uppercase'}`}>
                    {npc.name}
                  </span>
                  {unlocked ? (
                    <span className={`text-[7px] font-black uppercase ${color} tracking-tighter`}>{label}</span>
                  ) : (
                    <div className="flex flex-col items-center leading-tight">
                       <span className="text-[6px] text-zinc-600 font-bold uppercase tracking-tighter block">BLOQUEADO</span>
                       <span className="text-[5px] text-zinc-500 font-black uppercase">{getUnlockRequirementLabel(npc)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

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
        </div>
        
        {filteredOffers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10 opacity-30">
             <span className="text-5xl mb-4">🛸</span>
             <p className="text-[10px] font-cartoon uppercase tracking-widest text-center px-10 leading-relaxed">Aguardando novos contatos disponíveis...</p>
          </div>
        ) : (
          filteredOffers.map(offer => {
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
                <div className={`absolute top-0 right-0 px-5 py-2 rounded-bl-[2rem] flex items-center gap-1.5 z-10 font-cartoon text-xs shadow-xl
                  ${isHashCoin ? 'bg-amber-500 text-black' : 'bg-indigo-600 text-white'}
                `}>
                  {formatCurrency(offer.price)} {isHashCoin ? '🍪' : '🪙'}
                </div>

                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img src={npc.avatar} className="w-12 h-12 rounded-2xl border border-white/10 bg-zinc-800 p-0.5 shadow-md" />
                    <div>
                      <h4 className="text-xs font-black text-white/95 tracking-tight">{npc.name}</h4>
                      <span className="text-[9px] text-indigo-400 font-black uppercase">+5 XP / +5 REP</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 rounded-[2rem] p-4 flex items-center justify-between border border-white/5 group relative overflow-hidden">
                  <div className="flex items-center gap-3 relative z-10">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border border-white/10 shadow-inner"
                      style={{ backgroundColor: seed.color + '15' }}
                    >
                      {isHash ? '🍫' : '🌿'}
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-white/95">{seed.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
                           <div 
                             className={`h-full transition-all duration-700 rounded-full ${hasStock ? 'bg-green-500' : 'bg-red-500'}`} 
                             style={{ width: `${Math.min(100, (playerQty / offer.quantity) * 100)}%` }} 
                           />
                        </div>
                        <span className={`text-[9px] font-black tabular-nums ${hasStock ? 'text-green-400' : 'text-red-400'}`}>
                          {playerQty}/{offer.quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    disabled={!hasStock}
                    onClick={() => onAcceptOffer(offer)}
                    className={`
                      px-6 py-3.5 rounded-2xl font-cartoon text-[10px] uppercase tracking-[0.15em] transition-all
                      ${hasStock 
                        ? 'bg-indigo-600 text-white active:translate-y-1' 
                        : 'bg-zinc-800 text-zinc-600 grayscale'}
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
