
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
  const [activeTab, setActiveTab] = useState<'titles' | 'owned_items' | 'owned_themes'>('titles');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(player.name);

  const activeProfileBgId = player.activeCosmetics.profile_bg;
  const activeTheme = LUXURY_ITEMS.find(i => i.id === activeProfileBgId);
  
  const themeStyles = activeTheme?.style || {
    bg: 'from-green-800 to-green-950',
    border: 'border-green-500/30',
    text: 'text-green-400',
    accent: 'bg-green-500'
  };

  const currentTitle = TITLES.find(t => t.id === player.activeTitle);

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return val.toString();
  };

  const freeThemes = LUXURY_ITEMS.filter(i => i.category === 'profile_bg' && i.price === 0);

  // Itens de Gear Ativos
  const activeGear = [
    { label: 'Capa', item: LUXURY_ITEMS.find(i => i.id === player.activeCosmetics.cape) },
    { label: 'Joia', item: LUXURY_ITEMS.find(i => i.id === player.activeCosmetics.jewelry) },
    { label: 'Luxo', item: LUXURY_ITEMS.find(i => i.id === player.activeCosmetics.luxury) }
  ].filter(g => g.item);

  return (
    <div className="w-full flex flex-col gap-6 animate-in slide-in-from-right duration-300">
      {/* Header do Perfil */}
      <div className={`w-full rounded-[2.5rem] p-6 bg-gradient-to-br ${themeStyles.bg} border ${themeStyles.border} shadow-2xl relative overflow-hidden transition-all duration-700`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
        
        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className="relative">
              <CharacterAvatar player={player} size="lg" />
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-2">
                  {isEditingName ? (
                      <input 
                          className="bg-black/50 border border-white/20 rounded-lg px-2 py-1 text-sm font-cartoon w-full outline-none text-white"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          onBlur={() => { onUpdateName(tempName); setIsEditingName(false); }}
                          autoFocus
                      />
                  ) : (
                      <h2 onClick={() => setIsEditingName(true)} className="font-cartoon text-xl text-white flex items-center gap-2 cursor-pointer truncate drop-shadow-lg">
                          {player.name} <span className="text-[10px] opacity-40">✏️</span>
                      </h2>
                  )}
                  <span className={`text-[7px] font-black uppercase tracking-[0.2em] ${themeStyles.text} block mt-1 drop-shadow-md`}>
                    {currentTitle?.name || 'Fazendeiro Novato'}
                  </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-2 border border-white/5">
                     <p className="text-[6px] text-white/40 uppercase font-black">Colheitas</p>
                     <p className="text-xs font-cartoon text-white">{player.stats?.totalPlanted || 0}</p>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-2 border border-white/5">
                     <p className="text-[6px] text-white/40 uppercase font-black">Vendas</p>
                     <p className="text-xs font-cartoon text-white">{player.stats?.totalSold || 0}</p>
                  </div>
              </div>

              {/* EXIBIÇÃO DE EQUIPAMENTOS ATIVOS (HUB) */}
              {activeGear.length > 0 && (
                <div className="flex gap-2">
                   {activeGear.map((gear, idx) => (
                     <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1.5 flex flex-col items-center justify-center min-w-[32px] shadow-lg animate-in zoom-in duration-300">
                        <span className="text-sm">{gear.item?.icon}</span>
                        <span className="text-[5px] font-black uppercase text-white/40 mt-0.5">{gear.label}</span>
                     </div>
                   ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-3 border border-white/10">
            <p className="text-[7px] font-black uppercase text-white/40 tracking-widest mb-3 ml-1">Mudar Identidade</p>
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
              {AVATAR_OPTIONS.map(opt => {
                const isActive = player.avatarId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onSetAvatar(opt.id, opt.gender)}
                    className={`flex-shrink-0 w-14 h-14 rounded-full border-2 transition-all relative overflow-hidden group
                      ${isActive ? 'border-white scale-110 shadow-[0_0_15px_white]' : 'border-white/5 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 active:scale-95'}
                    `}
                  >
                    <img src={opt.url} className="w-full h-full object-cover" />
                    {isActive && <div className="absolute inset-0 bg-white/10 ring-2 ring-inset ring-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Opções de cores gratuitas do hub */}
          <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-3 border border-white/10">
            <p className="text-[7px] font-black uppercase text-white/40 tracking-widest mb-3 ml-1">Cores do Perfil (Grátis)</p>
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
              {freeThemes.map(theme => {
                const isActive = player.activeCosmetics.profile_bg === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => onToggleCosmetic(theme.id)}
                    className={`flex-shrink-0 w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center text-lg
                      ${isActive ? 'border-white scale-110 shadow-[0_0_10px_white]' : 'border-white/5 hover:border-white/20 active:scale-90'}
                    `}
                    style={{ background: `linear-gradient(to br, ${theme.style?.bg.split(' ')[0].replace('from-', '') || '#15803d'}, ${theme.style?.bg.split(' ')[1]?.replace('to-', '') || '#064e3b'})` }}
                  >
                    {theme.icon}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 bg-black/30 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
        {[
          {id: 'titles', label: 'Títulos', icon: '🏷️'},
          {id: 'owned_items', label: 'Cofre', icon: '🎒'},
          {id: 'owned_themes', label: 'Temas Pagos', icon: '🎨'}
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)} 
            className={`px-4 py-3 rounded-xl font-black text-[9px] uppercase tracking-tighter transition-all whitespace-nowrap flex-1 flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-white text-black shadow-xl scale-[1.02]' : 'text-white/30 hover:bg-white/5'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 pb-32 px-1">
        {activeTab === 'titles' && TITLES.map(title => {
          const owned = player.ownedTitles.includes(title.id);
          const isActive = player.activeTitle === title.id;
          const isUnlockable = title.type === 'reputation';
          
          return (
            <div key={title.id} className={`bg-zinc-900/60 p-4 rounded-3xl border transition-all flex justify-between items-center ${isActive ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-white/5'}`}>
              <div className="flex-1 pr-4">
                <h4 className={`text-[10px] font-black uppercase ${owned ? 'text-white' : 'text-white/40'}`}>{title.name}</h4>
                <p className="text-[7px] text-zinc-500 font-bold uppercase mt-1 tracking-wider">
                  {isUnlockable ? `Requisito: ${title.requirement}` : 'Título de Prestígio'}
                </p>
              </div>
              {owned ? (
                <button 
                  onClick={() => onSetTitle(title.id)} 
                  className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase min-w-[70px] ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/10 text-white/40 border border-white/5 hover:bg-white/20'}`}
                >
                  {isActive ? 'Ativo' : 'Usar'}
                </button>
              ) : !isUnlockable && title.price ? (
                <button 
                  onClick={() => onBuyTitle(title.id, title.price!)} 
                  disabled={player.hashCoins < title.price} 
                  className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase min-w-[80px] ${player.hashCoins >= title.price ? 'bg-amber-600 shadow-lg text-white' : 'bg-zinc-800 opacity-50 text-zinc-500 cursor-not-allowed'}`}
                >
                  🍪 {formatCurrency(title.price)}
                </button>
              ) : (
                <span className="text-[7px] text-zinc-700 font-black uppercase italic border border-zinc-800 px-2 py-1 rounded-lg">Bloqueado</span>
              )}
            </div>
          );
        })}

        {(activeTab === 'owned_items' || activeTab === 'owned_themes') && (
            <div className="grid grid-cols-2 gap-3">
                {player.ownedLuxuryItems.filter(id => {
                    const item = LUXURY_ITEMS.find(i => i.id === id);
                    const isStyle = item?.category === 'hud_theme' || item?.category === 'profile_bg';
                    // No tab de estilo, só mostrar se for tema pago (preço > 0)
                    if (activeTab === 'owned_themes' && item?.price === 0) return false;
                    return activeTab === 'owned_items' ? !isStyle : isStyle;
                }).map(itemId => {
                    const item = LUXURY_ITEMS.find(i => i.id === itemId)!;
                    const isActive = Object.values(player.activeCosmetics).includes(itemId);
                    return (
                        <button key={itemId} onClick={() => onToggleCosmetic(itemId)} className={`p-5 rounded-[2.5rem] border flex flex-col items-center gap-3 transition-all ${isActive ? 'bg-white/10 border-white ring-4 ring-white/5 scale-95 shadow-2xl' : 'bg-zinc-900/40 border-white/5 active:scale-90 hover:bg-zinc-900/60'}`}>
                            <span className="text-4xl filter drop-shadow-md">{item.icon}</span>
                            <div className="text-center">
                                <span className="text-[8px] font-black uppercase truncate w-full block text-white/90">{item.name}</span>
                                <span className="text-[6px] text-white/30 uppercase tracking-[0.2em] font-bold block mt-1">{item.category.replace('_', ' ')}</span>
                            </div>
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
