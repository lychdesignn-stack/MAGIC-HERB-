
import React from 'react';
import { Player } from '../types';
import { LUXURY_ITEMS } from '../constants';
import CharacterAvatar from './CharacterAvatar';

interface HUDProps {
  player: Player;
  currentEvent: string | null;
  onOpenProfile: () => void;
  onOpenMap: () => void;
  totalBonus?: number;
}

const HUD: React.FC<HUDProps> = ({ player, currentEvent, onOpenProfile, onOpenMap, totalBonus = 0 }) => {
  const activeThemeId = player.activeCosmetics.hud_theme;
  const activeTheme = LUXURY_ITEMS.find(i => i.id === activeThemeId);
  
  const themeStyles = activeTheme?.style || {
    bg: 'bg-black/40',
    border: 'border-white/5',
    text: 'text-blue-400'
  };

  return (
    <div className={`w-full ${themeStyles.bg} backdrop-blur-xl border-b ${themeStyles.border} p-3 flex items-center justify-between z-50 transition-all duration-700`}>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[10px] font-cartoon text-white/90 drop-shadow-md">{player.name}</span>
          <span className="text-[8px] font-black bg-white/10 px-1.5 py-0.5 rounded text-white/40">LV.{Math.floor(player.level)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-yellow-500/10 px-2.5 py-1 rounded-xl border border-yellow-500/30 flex items-center gap-1 min-w-[60px]">
            <span className="text-[10px]">🪙</span>
            <span className="font-cartoon text-[10px] text-yellow-400">{Math.floor(player.coins)}</span>
          </div>
          <div className="bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/30 flex items-center gap-1 min-w-[60px]">
            <span className="text-[10px]">🍪</span>
            <span className="font-cartoon text-[10px] text-amber-500">{Math.floor(player.hashCoins)}</span>
          </div>
        </div>
      </div>

      <div className="text-center flex-1 mx-2">
        {currentEvent && (
          <span className="text-[9px] font-cartoon text-purple-400 uppercase tracking-widest animate-pulse whitespace-nowrap">
            ✨ {currentEvent}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onOpenMap}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl active:scale-90 transition-all hover:bg-white/10 shadow-lg"
        >
          🗺️
        </button>
        <button 
          onClick={onOpenProfile}
          className="active:scale-90 transition-transform relative group"
        >
          <CharacterAvatar player={player} size="sm" />
        </button>
      </div>
    </div>
  );
};

export default HUD;
