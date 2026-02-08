import React, { useEffect, useRef, useMemo, useState } from 'react';
import { NPCS, SEEDS, RARITY_DISPLAY } from '../constants';
import { Player, Offer, Rarity, NPC } from '../types';

interface NPCPanelProps {
  player: Player;
  offers: Offer[];
  onAcceptOffer: (offer: Offer) => void;
  onBuyFromNPC: (offer: Offer) => void;
  onBack: () => void;
  aiDialogue: string;
  onGreet: (name: string) => void;
  offerResetIn: number;
}

const NPCPanel: React.FC<NPCPanelProps> = ({ player, offers, onAcceptOffer, onBuyFromNPC, onBack, aiDialogue, onGreet, offerResetIn }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedNpcForRep, setSelectedNpcForRep] = useState<NPC | null>(null);

  const totalReputation = player.totalReputation;
  const currentLevel = player.level;

  const isNpcUnlocked = (npc: NPC) => {
    const rarity = npc.rarity || Rarity.COMUM_A;
    
    if (rarity === Rarity.COMUM_A) return true;
    // REQUISITOS AJUSTADOS: Redução de 50% e Caps aplicados (100 Rep / 15 LVL)
    if (rarity === Rarity.COMUM_B) return totalReputation >= 10 && currentLevel >= 2;
    if (rarity === Rarity.RARA) return totalReputation >= 35 && currentLevel >= 5;
    if (rarity === Rarity.LENDARIA) return totalReputation >= 70 && currentLevel >= 10;
    if (rarity === Rarity.MISTICA) return totalReputation >= 100 && currentLevel >= 15;
    
    return true;
  };

  const getUnlockRequirementLabel = (npc: NPC) => {
    const rarity = npc.rarity || Rarity.COMUM_A;
    if (rarity === Rarity.COMUM_B) return "REP 10 | LVL 2";
    if (rarity === Rarity.RARA) return "REP 35 | LVL 5";
    if (rarity === Rarity.LENDARIA) return "REP 70 | LVL 10";
    if (rarity === Rarity.MISTICA) return "REP 100 | LVL 15";
    return "Acesso Livre";
  };

  useEffect(() => {
    const unlockedNpcs = NPCS.filter(npc => isNpcUnlocked(npc));
    if (unlockedNpcs.length > 0) {
      onGreet(unlockedNpcs[Math.floor(Math.random() * unlockedNpcs.length)].name);
    }
  }, []);

  // AJUSTE: Categorias de Status solicitadas (Iniciante, Parceiro, Sócio, Mestre)
  const getReputationDetails = (rep: number) => {
    if (rep >= 600) return { label: 'Mestre', color: 'text-amber-400', icon: '👑', bg: 'bg-amber-400/10', next: 'Lenda', reqNext: 1000 };
    if (rep >= 200) return { label: 'Sócio', color: 'text-purple-400', icon: '🏢', bg: 'bg-purple-400/10', next: 'Mestre', reqNext: 600 };
    if (rep >= 100) return { label: 'Parceiro', color: 'text-blue-400', icon: '🤙', bg: 'bg-blue-400/10', next: 'Sócio', reqNext: 200 };
    return { label: 'Iniciante', color: 'text-zinc-500', icon: '👤', bg: 'bg-zinc-500/10', next: 'Parceiro', reqNext: 100 };
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
        return 'bg-purple-600 border-purple-400 text-white shadow-[0_0_10px_rgba(168,85,247,0.8)] animate-pulse';
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

  // NPCs com nível Sócio (Rep >= 200) vendem itens para o player
  const socioOffers = useMemo(() => {
    const partners = NPCS.filter(npc => (player.reputation[npc.id] || 0) >= 200 && isNpcUnlocked(npc));
    return partners.map(npc => {
      // NPC Sócio vende sementes que ele costuma demandar
      const seedId = npc.demand[0];
      const seed = SEEDS.find(s => s.id === seedId)!;
      // Preços baseados na raridade conforme regra 4
      let price = Math.floor(seed.baseValue * 0.5);
      if (seed.rarity === Rarity.RARA) price *= 2;
      if (seed.rarity === Rarity.LENDARIA) price *= 5;
      if (seed.rarity === Rarity.MISTICA) price *= 10;

      return {
        id: `socio-${npc.id}`,
        npcId: npc.id,
        itemId: seedId,
        quantity: 1,
        price,
        currency: (seed.rarity === Rarity.LENDARIA || seed.rarity === Rarity.MISTICA) ? 'hashCoins' as const : 'coins' as const,
        reputationAward: 0
      };
    });
  }, [player.reputation, player.unlockedRarities]);

  const filteredOffers = offers.filter(offer => {
    const npc = NPCS.find(n => n.id === offer.npcId);
    const rep = player.reputation[offer.npcId] || 0;
    return npc && isNpcUnlocked(npc) && rep < 200; // Só mostra compra de NPCs não sócios
  });

  return (
    <div className="w-full flex flex-col gap-5 animate-in slide-in-from-right duration-300">
      {/* Modal de Detalhes de Reputação */}
      {selectedNpcForRep && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl relative">
            <button onClick={() => setSelectedNpcForRep(null)} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">✕</button>
            <div className="flex flex-col items-center gap-4">
              <img src={selectedNpcForRep.avatar} className="w-24 h-24 rounded-3xl border-2 border-indigo-500 bg-zinc-800 p-1 shadow-2xl" />
              <h3 className="font-cartoon text-xl text-white">{selectedNpcForRep.name}</h3>
              
              {(() => {
                const repValue = player.reputation[selectedNpcForRep.id] || 0;
                const { label, color, icon, next, reqNext } = getReputationDetails(repValue);
                const progress = Math.min(100, (repValue / reqNext) * 100);
                
                return (
                  <div className="w-full flex flex-col gap-4 bg-black/40 p-5 rounded-3xl border border-white/5 mt-2">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] text-zinc-500 font-black uppercase">Status Atual</span>
                       <span className={`text-xs font-cartoon ${color} flex items-center gap-1`}>{icon} {label}</span>
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                       <div className="flex justify-between text-[9px] font-black uppercase text-white/30">
                          <span>Progresso</span>
                          <span>{repValue} / {reqNext}</span>
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full border border-white/5 overflow-hidden">
                          <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
                       </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                       <span className="text-[9px] text-zinc-500 font-black uppercase">Próximo Status</span>
                       <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{next}</span>
                    </div>
                  </div>
                );
              })()}
              
              <button onClick={() => setSelectedNpcForRep(null)} className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-cartoon text-xs uppercase tracking-widest mt-4">Fechar</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-end justify-between px-1">
        <div>
          <h2 className="font-cartoon text-2xl text-white tracking-tight">Vendas & Contatos</h2>
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Mercado de Estufa</p>
        </div>
        <div className="bg-white/5 px-2 py-1 rounded-lg border border-white/10 flex items-center gap-2">
           <span className="text-[10px] text-zinc-400 font-bold uppercase">Reputação Total</span>
           <span className="text-xs font-cartoon text-indigo-400">
             {player.totalReputation}
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
            const { label, color, icon, bg } = getReputationDetails(rep);
            const rarityDisplay = RARITY_DISPLAY[npc.rarity || Rarity.COMUM_A];
            const isMysticNpc = npc.rarity === Rarity.MISTICA;
            
            return (
              <div key={npc.id} className="flex-shrink-0 flex flex-col items-center gap-2 w-20 transition-all duration-300">
                <div 
                  className={`relative ${!unlocked ? 'grayscale-[0.8]' : 'cursor-pointer'}`}
                  onClick={() => unlocked && setSelectedNpcForRep(npc)}
                >
                   <div className={`w-14 h-14 rounded-2xl border border-white/10 overflow-hidden relative z-10 flex items-center justify-center transition-all ${unlocked ? (isMysticNpc ? 'neon-border neon-purple' : 'bg-zinc-800 shadow-lg hover:border-indigo-500') : 'bg-zinc-950/90 border-dashed opacity-40 shadow-inner'}`}>
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
                  <span className={`text-[9px] font-black block truncate leading-none mb-1 ${unlocked ? (isMysticNpc ? 'text-purple-400' : 'text-white/80') : 'text-white/30 uppercase'}`}>
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
        {/* REGRA 4: Seção de Sócios */}
        {socioOffers.length > 0 && (
          <>
            <h3 className="font-cartoon text-sm text-purple-400 uppercase tracking-widest px-2">Oficina de Sócios (NPC Vende)</h3>
            {socioOffers.map(offer => {
              const npc = NPCS.find(n => n.id === offer.npcId)!;
              const seed = SEEDS.find(s => s.id === offer.itemId)!;
              const isHashCoin = offer.currency === 'hashCoins';
              const canAfford = isHashCoin ? player.hashCoins >= offer.price : player.coins >= offer.price;

              return (
                <div key={offer.id} className="bg-purple-950/20 border border-purple-500/20 p-5 rounded-[2.5rem] flex flex-col gap-4 relative overflow-hidden transition-all shadow-2xl">
                  <div className={`absolute top-0 right-0 px-5 py-2 rounded-bl-[2rem] flex items-center gap-1.5 z-10 font-cartoon text-xs shadow-xl ${isHashCoin ? 'bg-amber-500 text-black' : 'bg-purple-600 text-white'}`}>
                    {formatCurrency(offer.price)} {isHashCoin ? '🍪' : '🪙'}
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={npc.avatar} className="w-12 h-12 rounded-2xl border border-white/10 bg-zinc-800 p-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-white/95">{npc.name} <span className="text-purple-400 text-[8px]">[SÓCIO]</span></h4>
                      <p className="text-[8px] text-zinc-500 font-bold">"Parceiro, tenho mercadoria nova pra você."</p>
                    </div>
                  </div>
                  <div className="bg-black/40 rounded-[2rem] p-4 flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-white/5 bg-zinc-900">🌱</div>
                      <div>
                        <p className="text-[11px] font-black text-white/95">{seed.name}</p>
                        <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">{RARITY_DISPLAY[seed.rarity]}</span>
                      </div>
                    </div>
                    <button onClick={() => onBuyFromNPC(offer)} disabled={!canAfford} className={`px-6 py-3 rounded-2xl font-cartoon text-[10px] uppercase transition-all ${canAfford ? 'bg-purple-600 text-white active:translate-y-1' : 'bg-zinc-800 text-zinc-600 grayscale'}`}>Comprar</button>
                  </div>
                </div>
              );
            })}
          </>
        )}

        <div className="flex items-center justify-between px-2 mt-2">
          <div className="flex flex-col">
            <h3 className="font-cartoon text-sm text-yellow-400 uppercase tracking-widest">Contratos Disponíveis (NPC Compra)</h3>
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
             <p className="text-[10px] font-cartoon uppercase tracking-widest text-center px-10 leading-relaxed">Sem contratos de compra agora. Sócios ainda estão vendendo!</p>
          </div>
        ) : (
          filteredOffers.map(offer => {
            const npc = NPCS.find(n => n.id === offer.npcId)!;
            const seed = SEEDS.find(s => offer.itemId.startsWith(s.id))!;
            const isHash = offer.itemId.endsWith('_hash');
            const playerQty = player.inventory[offer.itemId] || 0;
            const hasStock = playerQty >= offer.quantity;
            const isHashCoin = offer.currency === 'hashCoins';
            const isMysticDeal = npc.rarity === Rarity.MISTICA;

            return (
              <div key={offer.id} className={`bg-zinc-900/90 border border-white/5 p-5 rounded-[2.5rem] flex flex-col gap-4 relative overflow-hidden transition-all shadow-2xl ${isMysticDeal ? 'neon-border neon-purple' : isHashCoin ? 'ring-2 ring-amber-500/30' : 'hover:border-indigo-500/40'}`}>
                <div className={`absolute top-0 right-0 px-5 py-2 rounded-bl-[2rem] flex items-center gap-1.5 z-10 font-cartoon text-xs shadow-xl ${isHashCoin ? 'bg-amber-500 text-black' : 'bg-indigo-600 text-white'}`}>
                  {formatCurrency(offer.price)} {isHashCoin ? '🍪' : '🪙'}
                </div>
                <div className="flex items-center gap-3">
                  <img src={npc.avatar} className="w-12 h-12 rounded-2xl border border-white/10 bg-zinc-800 p-0.5 shadow-md" />
                  <div>
                    <h4 className={`text-xs font-black tracking-tight ${isMysticDeal ? 'text-purple-400' : 'text-white/95'}`}>{npc.name}</h4>
                    <span className="text-[9px] text-indigo-400 font-black uppercase">Contrato Especial</span>
                  </div>
                </div>
                <div className="bg-black/40 rounded-[2rem] p-4 flex items-center justify-between border border-white/5 group relative overflow-hidden">
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border border-white/10 shadow-inner" style={{ backgroundColor: seed.color + '15' }}>
                      {isHash ? '🍫' : '🌿'}
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-white/95">{seed.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
                           <div className={`h-full transition-all duration-700 rounded-full ${hasStock ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, (playerQty / offer.quantity) * 100)}%` }} />
                        </div>
                        <span className={`text-[9px] font-black tabular-nums ${hasStock ? 'text-green-400' : 'text-red-400'}`}>{playerQty}/{offer.quantity}</span>
                      </div>
                    </div>
                  </div>
                  <button disabled={!hasStock} onClick={() => onAcceptOffer(offer)} className={`px-6 py-3.5 rounded-2xl font-cartoon text-[10px] uppercase transition-all ${hasStock ? 'bg-indigo-600 text-white active:translate-y-1' : 'bg-zinc-800 text-zinc-600 grayscale'}`}>Vender</button>
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