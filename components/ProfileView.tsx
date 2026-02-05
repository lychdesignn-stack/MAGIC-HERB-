
import React, { useState } from 'react';
import { Player, LuxuryItem, Title } from '../types';
import { LUXURY_ITEMS, TITLES, AVATAR_OPTIONS } from '../constants';
import CharacterAvatar from './CharacterAvatar';

interface ProfileViewProps {
  player: Player;
  onBuyLuxury: (itemId: string) => void;
  onToggleCosmetic: (itemId: string) => void;
  onSetAvatar: (avatarId: string, gender: 'male' | 'female') => void;
  onBuyTitle: (titleId: string, price: number) => void;
  onSetTitle: (titleId: string) => void;
  onBack: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ player, onBuyLuxury, onToggleCosmetic, onSetAvatar, onBuyTitle, onSetTitle, onBack }) => {
  const [activeTab, setActiveTab] = useState<'owned_items' | 'owned_themes' | 'shop_items' | 'shop_themes' | 'titles'>('titles');

  const getStatus = (coins: number) => {
    if (coins > 500000) return { label: 'Deus do Hash', color: 'text-yellow-400', theme: 'from-amber-600 to-amber-950', icon: '👑' };
    if (coins > 100000) return { label: 'Barão Galáctico', color: 'text-purple-400', theme: 'from-purple-600 to-purple-950', icon: '💎' };
    return { label: 'Fazendeiro Astral', color: 'text-green-400', theme: 'from-green-600 to-green-950', icon: '🌿' };
  };

  const status = getStatus(player.coins);
  const currentTitle = TITLES.find(t => t.id === player.activeTitle);

  return (
    <div className="w-full flex flex-col gap-5 animate-in slide-in-from-right duration-300">
      <div className={`w-full rounded-[3rem] p-6 bg-gradient-to-br ${status.theme} border border-white/20 shadow-2xl relative overflow-hidden`}>
        <div className="absolute top-4 right-4 text-6xl opacity-20 pointer-events-none transform rotate-12">{status.icon}</div>
        <div className="flex items-center gap-6 relative z-10">
          <CharacterAvatar player={player} size="lg" />
          <div className="flex-1 flex flex-col gap-1">
            <h2 className="font-cartoon text-3xl text-white leading-none">Perfil VIP</h2>
            <div className="flex flex-col mt-2">
              <span className={`text-[10px] font-black uppercase tracking-widest ${status.color} bg-black/50 px-3 py-1.5 rounded-2xl self-start border border-white/5 shadow-lg`}>
                {currentTitle?.name || 'Sem Título'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Selection Otimizado */}
      <div className="bg-black/40 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/10 shadow-inner">
        <h3 className="text-[10px] font-black uppercase text-white/40 mb-4 px-1 flex items-center justify-between">
          <span>Avatar Visual</span>
          <span className="text-[8px] animate-pulse">Escolha um rosto ➔</span>
        </h3>
        <div className="flex flex-nowrap gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {AVATAR_OPTIONS.map((opt) => (
            <button 
              key={opt.id} 
              onClick={() => onSetAvatar(opt.id, opt.gender)} 
              className={`relative flex-shrink-0 w-16 h-16 rounded-3xl overflow-hidden border-4 transition-all duration-300 ${player.avatarId === opt.id ? 'border-indigo-500 scale-110 shadow-[0_0_15px_rgba(99,102,241,0.6)]' : 'border-white/5 opacity-60 hover:opacity-100 grayscale hover:grayscale-0'}`}
            >
              <img src={opt.url} className="w-full h-full object-cover" alt="" />
              {player.avatarId === opt.id && (
                <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Tabs de Gerenciamento */}
      <div className="flex gap-1.5 bg-black/30 p-1.5 rounded-3xl overflow-x-auto no-scrollbar shadow-inner">
        {[
          {id: 'titles', label: 'Títulos', icon: '🏷️'},
          {id: 'owned_items', label: 'Itens', icon: '🎒'},
          {id: 'owned_themes', label: 'Temas', icon: '🎨'},
          {id: 'shop_items', label: '+ Itens', icon: '🛍️'},
          {id: 'shop_themes', label: '+ Temas', icon: '💎'}
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)} 
            className={`px-4 py-3 rounded-2xl font-black text-[9px] uppercase tracking-tighter transition-all whitespace-nowrap flex items-center justify-center gap-1.5 min-w-[80px] ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-white/30 hover:bg-white/5'}`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 pb-32">
        {activeTab === 'titles' && TITLES.map(title => {
          const owned = player.ownedTitles.includes(title.id);
          const isActive = player.activeTitle === title.id;
          return (
            <div key={title.id} className={`bg-zinc-900/60 p-5 rounded-[2.5rem] border transition-all ${isActive ? 'border-indigo-500 shadow-lg' : 'border-white/5'} flex justify-between items-center group`}>
              <div className="flex-1">
                <h4 className={`text-xs font-black ${isActive ? 'text-indigo-400' : 'text-white group-hover:text-indigo-300'}`}>{title.name}</h4>
                <p className="text-[8px] text-white/30 uppercase font-black tracking-widest mt-1 leading-none">{title.requirement}</p>
              </div>
              {owned ? (
                <button onClick={() => onSetTitle(title.id)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${isActive ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>{isActive ? 'Ativo' : 'Usar'}</button>
              ) : title.price ? (
                <button onClick={() => onBuyTitle(title.id, title.price!)} disabled={player.hashCoins < title.price} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase shadow-xl transition-all ${player.hashCoins >= title.price ? 'bg-amber-600 text-white active:scale-95' : 'bg-zinc-800 text-zinc-600'}`}>🍪 {title.price}</button>
              ) : <span className="text-[9px] text-zinc-700 uppercase font-black italic mr-2">Bloqueado</span>}
            </div>
          );
        })}

        {(activeTab === 'owned_items' || activeTab === 'owned_themes') && (
          player.ownedLuxuryItems.filter(id => {
            const item = LUXURY_ITEMS.find(i => i.id === id);
            return activeTab === 'owned_items' ? item?.category !== 'hud_theme' : item?.category === 'hud_theme';
          }).length > 0 ? (
            <div className="grid grid-cols-2 gap-4 px-1">
              {player.ownedLuxuryItems.filter(id => {
                const item = LUXURY_ITEMS.find(i => i.id === id);
                return activeTab === 'owned_items' ? item?.category !== 'hud_theme' : item?.category === 'hud_theme';
              }).map(itemId => {
                const item = LUXURY_ITEMS.find(i => i.id === itemId)!;
                const isActive = Object.values(player.activeCosmetics).includes(itemId);
                return (
                  <button key={itemId} onClick={() => onToggleCosmetic(itemId)} className={`p-5 rounded-[3rem] border flex flex-col items-center gap-3 transition-all relative ${isActive ? 'bg-indigo-600/30 border-indigo-500 shadow-xl' : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100 hover:bg-white/10'}`}>
                    {item.harvestBonus && <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg">+{Math.round(item.harvestBonus * 100)}%</div>}
                    <span className="text-5xl drop-shadow-lg">{item.icon}</span>
                    <span className="text-[10px] font-black uppercase text-center truncate w-full leading-none">{item.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-24 bg-white/5 rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center opacity-30 text-center px-10">
               <span className="text-5xl mb-4 grayscale">📦</span>
               <p className="text-[11px] font-black uppercase tracking-widest text-white/50">Nada equipado aqui, fazendeiro.</p>
            </div>
          )
        )}

        {(activeTab === 'shop_items' || activeTab === 'shop_themes') && LUXURY_ITEMS.filter(i => activeTab === 'shop_items' ? i.category !== 'hud_theme' : i.category === 'hud_theme').map(item => {
            const owned = player.ownedLuxuryItems.includes(item.id);
            const canAfford = item.currency === 'coins' ? player.coins >= item.price : player.hashCoins >= item.price;
            if (owned) return null;
            return (
              <div key={item.id} className="bg-zinc-900/80 border border-white/5 p-5 rounded-[2.5rem] flex items-center gap-4 active:scale-98 transition-all group">
                 <div className="w-16 h-16 rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center text-4xl shrink-0 group-hover:scale-110 transition-transform">{item.icon}</div>
                 <div className="flex-1">
                   <div className="flex items-center gap-2 flex-wrap mb-1">
                     <h4 className="text-[11px] font-black text-white uppercase leading-none">{item.name}</h4>
                     {item.harvestBonus && <span className="bg-emerald-500/20 text-emerald-400 text-[8px] px-1.5 py-0.5 rounded-full font-black">+{Math.round(item.harvestBonus * 100)}% Prod.</span>}
                   </div>
                   <p className="text-[9px] text-zinc-500 font-bold mb-3 leading-relaxed">{item.description}</p>
                   <button onClick={() => onBuyLuxury(item.id)} disabled={!canAfford} className={`px-5 py-2 rounded-2xl font-cartoon text-[10px] uppercase transition-all shadow-xl ${canAfford ? 'bg-amber-600 text-white active:scale-90 hover:brightness-110' : 'bg-zinc-800 text-zinc-600'}`}>
                     {item.price} {item.currency === 'coins' ? '🪙' : '🍪'}
                   </button>
                 </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ProfileView;
