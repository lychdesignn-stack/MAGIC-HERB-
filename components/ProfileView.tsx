
import React, { useState } from 'react';
import { Player, Title } from '../types';
import { LUXURY_ITEMS, TITLES, AVATAR_OPTIONS } from '../constants';
import CharacterAvatar from './CharacterAvatar';

interface ProfileViewProps {
  player: Player;
  onBuyLuxury: (itemId: string) => void;
  onToggleCosmetic: (itemId: string) => void;
  onSetAvatar: (avatarId: string, gender: 'male' | 'female') => void;
  onBuyTitle: (titleId: string, price: number) => void;
  onSetTitle: (titleId: string) => void;
  onUpdateName: (name: string) => void;
  onBack: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ player, onBuyLuxury, onToggleCosmetic, onSetAvatar, onBuyTitle, onSetTitle, onUpdateName, onBack }) => {
  const [activeTab, setActiveTab] = useState<'owned_items' | 'owned_themes' | 'titles' | 'stats'>('stats');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(player.name);

  const getStatus = (coins: number) => {
    if (coins > 1000000) return { label: 'Deus do Hash', color: 'text-yellow-400', theme: 'from-amber-600 to-amber-950', icon: '👑' };
    if (coins > 100000) return { label: 'Barão Galáctico', color: 'text-purple-400', theme: 'from-purple-600 to-purple-950', icon: '💎' };
    return { label: 'Fazendeiro Astral', color: 'text-green-400', theme: 'from-green-600 to-green-950', icon: '🌿' };
  };

  const status = getStatus(player.coins);
  const currentTitle = TITLES.find(t => t.id === player.activeTitle);

  return (
    <div className="w-full flex flex-col gap-5 animate-in slide-in-from-right duration-300">
      <div className={`w-full rounded-[2.5rem] p-6 bg-gradient-to-br ${status.theme} border border-white/20 shadow-2xl relative overflow-hidden`}>
        <div className="flex items-center gap-5 relative z-10">
          <CharacterAvatar player={player} size="lg" />
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2">
                {isEditingName ? (
                    <input 
                        className="bg-black/50 border border-white/20 rounded-lg px-2 py-1 text-sm font-cartoon w-32 outline-none"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onBlur={() => { onUpdateName(tempName); setIsEditingName(false); }}
                        autoFocus
                    />
                ) : (
                    <h2 onClick={() => setIsEditingName(true)} className="font-cartoon text-2xl text-white flex items-center gap-2 cursor-pointer">
                        {player.name} <span className="text-[10px] opacity-40">✏️</span>
                    </h2>
                )}
            </div>
            <span className={`text-[8px] font-black uppercase tracking-widest ${status.color} bg-black/40 px-2 py-1 rounded-lg self-start mt-2 border border-white/5`}>
              {currentTitle?.name || 'Sem Título'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 bg-black/30 p-1 rounded-2xl overflow-x-auto no-scrollbar">
        {[
          {id: 'stats', label: 'Estatísticas', icon: '📊'},
          {id: 'titles', label: 'Títulos', icon: '🏷️'},
          {id: 'owned_items', label: 'Itens', icon: '🎒'},
          {id: 'owned_themes', label: 'Temas', icon: '🎨'}
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)} 
            className={`px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-tighter transition-all whitespace-nowrap flex-1 flex items-center justify-center gap-1.5 ${activeTab === tab.id ? 'bg-white text-black shadow-xl' : 'text-white/30 hover:bg-white/5'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 pb-32">
        {activeTab === 'stats' && (
            <div className="grid grid-cols-1 gap-3">
                <div className="bg-white/5 p-4 rounded-3xl border border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black text-white/40 uppercase">Total Plantado</span>
                    <span className="font-cartoon text-xl">{player.stats?.totalPlanted || 0}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-3xl border border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black text-white/40 uppercase">Flores Vendidas</span>
                    <span className="font-cartoon text-xl">{player.stats?.totalSold || 0}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-3xl border border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black text-white/40 uppercase">Ganhos em Moedas</span>
                    <span className="font-cartoon text-xl">🪙 {Math.floor(player.stats?.totalEarned || 0)}</span>
                </div>
            </div>
        )}

        {activeTab === 'titles' && TITLES.map(title => {
          const owned = player.ownedTitles.includes(title.id);
          const isActive = player.activeTitle === title.id;
          return (
            <div key={title.id} className={`bg-zinc-900/60 p-4 rounded-3xl border ${isActive ? 'border-white' : 'border-white/5'} flex justify-between items-center`}>
              <div className="flex-1">
                <h4 className="text-[11px] font-black text-white">{title.name}</h4>
                <p className="text-[7px] text-white/30 uppercase font-black mt-1">{title.requirement}</p>
              </div>
              {owned ? (
                <button onClick={() => onSetTitle(title.id)} className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase ${isActive ? 'bg-white text-black' : 'bg-white/5 text-white/40'}`}>{isActive ? 'Ativo' : 'Usar'}</button>
              ) : title.price ? (
                <button onClick={() => onBuyTitle(title.id, title.price!)} disabled={player.hashCoins < title.price} className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase ${player.hashCoins >= title.price ? 'bg-amber-600' : 'bg-zinc-800'}`}>🍪 {title.price}</button>
              ) : <span className="text-[8px] text-zinc-700 uppercase font-black italic">Bloqueado</span>}
            </div>
          );
        })}

        {(activeTab === 'owned_items' || activeTab === 'owned_themes') && (
            <div className="grid grid-cols-2 gap-3">
                {player.ownedLuxuryItems.filter(id => {
                    const item = LUXURY_ITEMS.find(i => i.id === id);
                    return activeTab === 'owned_items' ? item?.category !== 'hud_theme' : item?.category === 'hud_theme';
                }).map(itemId => {
                    const item = LUXURY_ITEMS.find(i => i.id === itemId)!;
                    const isActive = Object.values(player.activeCosmetics).includes(itemId);
                    return (
                        <button key={itemId} onClick={() => onToggleCosmetic(itemId)} className={`p-4 rounded-[2rem] border flex flex-col items-center gap-2 ${isActive ? 'bg-white/10 border-white' : 'bg-white/5 border-white/5'}`}>
                            <span className="text-4xl">{item.icon}</span>
                            <span className="text-[8px] font-black uppercase truncate w-full text-center">{item.name}</span>
                        </button>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
