
import React, { useState } from 'react';
import { Player, LuxuryItem } from '../types';
import { LUXURY_ITEMS } from '../constants';
import CharacterAvatar from './CharacterAvatar';

interface ProfileViewProps {
  player: Player;
  onBuyLuxury: (itemId: string) => void;
  onToggleCosmetic: (itemId: string) => void;
  onSetGender: (gender: 'male' | 'female') => void;
  onBack: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ player, onBuyLuxury, onToggleCosmetic, onSetGender, onBack }) => {
  const [activeTab, setActiveTab] = useState<'owned' | 'shop'>('owned');

  const getStatus = (coins: number) => {
    if (coins > 500000) return { label: 'Deus do Hash', color: 'text-yellow-400', theme: 'from-amber-600 to-amber-950', icon: '👑' };
    if (coins > 100000) return { label: 'Barão Galáctico', color: 'text-purple-400', theme: 'from-purple-600 to-purple-950', icon: '💎' };
    if (coins > 10000) return { label: 'Cultivador Prospero', color: 'text-green-400', theme: 'from-green-600 to-green-950', icon: '🌿' };
    return { label: 'Iniciante Pobre', color: 'text-zinc-500', theme: 'from-zinc-700 to-zinc-950', icon: '🦴' };
  };

  const status = getStatus(player.coins);

  return (
    <div className="w-full flex flex-col gap-6 animate-in slide-in-from-right duration-300">
      <div className={`w-full rounded-[3rem] p-8 bg-gradient-to-br ${status.theme} border border-white/20 shadow-2xl relative overflow-hidden`}>
        <div className="absolute top-4 right-4 text-5xl opacity-20 pointer-events-none">{status.icon}</div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="flex flex-col items-center gap-3">
            <CharacterAvatar player={player} size="lg" />
            <div className="flex bg-black/50 rounded-full p-1 border border-white/10">
              <button 
                onClick={() => onSetGender('male')}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all ${player.gender === 'male' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40'}`}
              >
                ♂
              </button>
              <button 
                onClick={() => onSetGender('female')}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all ${player.gender === 'female' ? 'bg-pink-600 text-white shadow-lg' : 'text-white/40'}`}
              >
                ♀
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-1">
            <h2 className="font-cartoon text-3xl text-white">Perfil VIP</h2>
            <span className={`text-[10px] font-black uppercase tracking-widest ${status.color} bg-black/40 px-3 py-1 rounded-full self-start border border-white/5 mb-4`}>
              {status.label}
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-[8px] text-white/50 uppercase font-bold">Patrimônio</span>
                <span className="font-cartoon text-xl text-yellow-400">🪙 {Math.floor(player.coins)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-white/50 uppercase font-bold">Nível Farm</span>
                <span className="font-cartoon text-xl text-indigo-300">{Math.floor(player.level)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => setActiveTab('owned')}
          className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${activeTab === 'owned' ? 'bg-indigo-600 border-indigo-400 shadow-xl' : 'bg-white/5 border-white/10 text-white/40'}`}
        >
          Meus Itens
        </button>
        <button 
          onClick={() => setActiveTab('shop')}
          className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${activeTab === 'shop' ? 'bg-amber-600 border-amber-400 shadow-xl' : 'bg-white/5 border-white/10 text-white/40'}`}
        >
          Loja de Luxo 💎
        </button>
      </div>

      <div className="flex flex-col gap-4 pb-32">
        {activeTab === 'owned' ? (
          player.ownedLuxuryItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {player.ownedLuxuryItems.map(itemId => {
                const item = LUXURY_ITEMS.find(i => i.id === itemId)!;
                const isActive = Object.values(player.activeCosmetics).includes(itemId);
                return (
                  <button 
                    key={itemId}
                    onClick={() => onToggleCosmetic(itemId)}
                    className={`p-4 rounded-[2rem] border flex flex-col items-center gap-2 transition-all active:scale-95
                      ${isActive ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/30' : 'bg-white/5 border-white/10 opacity-70'}
                    `}
                  >
                    <span className="text-4xl">{item.icon}</span>
                    <span className="text-[10px] font-black uppercase text-center leading-tight">{item.name}</span>
                    <span className={`text-[8px] font-bold uppercase ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`}>
                      {isActive ? 'Equipado' : 'Equipar'}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center opacity-40">
               <span className="text-4xl mb-4">🛸</span>
               <p className="text-[10px] font-black uppercase">Vazio</p>
            </div>
          )
        ) : (
          LUXURY_ITEMS.map(item => {
            const owned = player.ownedLuxuryItems.includes(item.id);
            const canAfford = item.currency === 'coins' ? player.coins >= item.price : player.hashCoins >= item.price;
            return (
              <div key={item.id} className={`bg-zinc-900/80 border border-white/5 p-5 rounded-[2.5rem] flex items-center gap-5 transition-all ${owned ? 'opacity-40' : ''}`}>
                 <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-4xl shadow-inner shrink-0">
                   {item.icon}
                 </div>
                 <div className="flex-1">
                   <div className="flex items-center gap-2 mb-1">
                     <h4 className="text-[11px] font-black text-white uppercase">{item.name}</h4>
                     <span className="bg-white/5 text-[6px] px-1.5 py-0.5 rounded text-white/50 uppercase font-black">{item.category}</span>
                   </div>
                   <p className="text-[9px] text-zinc-500 font-bold mb-3">{item.description}</p>
                   {owned ? (
                     <span className="text-[9px] font-black text-green-500 uppercase">Adquirido</span>
                   ) : (
                     <button 
                       onClick={() => onBuyLuxury(item.id)}
                       disabled={!canAfford}
                       className={`px-4 py-2 rounded-xl font-cartoon text-[9px] uppercase transition-all
                         ${canAfford ? 'bg-amber-600 shadow-[0_4px_0_rgb(120,53,15)] active:translate-y-1 active:shadow-none' : 'bg-zinc-800 text-zinc-600 grayscale'}
                       `}
                     >
                       {item.price} {item.currency === 'coins' ? '🪙' : '🍪'}
                     </button>
                   )}
                 </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProfileView;
