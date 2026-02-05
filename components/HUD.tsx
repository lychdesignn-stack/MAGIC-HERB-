
import React from 'react';
import { Player } from '../types';
import { LUXURY_ITEMS } from '../constants';
import CharacterAvatar from './CharacterAvatar';

interface HUDProps {
  player: Player;
  currentEvent: string | null;
  onOpenProfile: () => void;
}

const HUD: React.FC<HUDProps> = ({ player, currentEvent, onOpenProfile }) => {
  const activeThemeId = player.activeCosmetics.hud_theme;
  const activeTheme = LUXURY_ITEMS.find(i => i.id === activeThemeId);
  
  const themeStyles = activeTheme?.style || {
    bg: 'bg-black/40',
    border: 'border-white/5',
    text: 'text-blue-400'
  };

  return (
    <div className={`w-full ${themeStyles.bg} backdrop-blur-xl border-b ${themeStyles.border} p-3 flex items-center justify-between z-50 transition-all duration-700`}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-500/10 px-3 py-1 rounded-2xl border border-yellow-500/30 flex items-center gap-1.5 min-w-[70px]">
            <span className="text-xs">🪙</span>
            <span className="font-cartoon text-xs text-yellow-400">{Math.floor(player.coins)}</span>
          </div>
          <div className="bg-amber-500/10 px-3 py-1 rounded-2xl border border-amber-500/30 flex items-center gap-1.5 min-w-[70px]">
            <span className="text-xs">🍪</span>
            <span className="font-cartoon text-xs text-amber-500">{Math.floor(player.hashCoins)}</span>
          </div>
        </div>
        <div className={`bg-white/5 px-3 py-0.5 rounded-full border border-white/10 flex items-center gap-1.5 self-start`}>
          <span className={`text-[8px] font-bold ${themeStyles.text}`}>LV.{Math.floor(player.level)}</span>
          <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${activeTheme ? themeStyles.text.replace('text', 'bg') : 'bg-blue-500'}`} 
              style={{ width: `${(player.level % 1) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="text-center flex-1 mx-2">
        {currentEvent && (
          <span className="text-[10px] font-cartoon text-purple-400 uppercase tracking-widest animate-pulse whitespace-nowrap">
            ✨ {currentEvent}
          </span>
        )}
      </div>

      <button 
        onClick={onOpenProfile}
        className="active:scale-90 transition-transform relative group"
      >
        <CharacterAvatar player={player} size="sm" />
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
      </button>
    </div>
  );
};

export default HUD;
