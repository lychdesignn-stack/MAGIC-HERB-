
import React from 'react';
import { Player } from '../types';

interface HUDProps {
  player: Player;
  currentEvent: string | null;
}

const HUD: React.FC<HUDProps> = ({ player, currentEvent }) => {
  return (
    <div className="w-full bg-black/40 backdrop-blur-xl border-b border-white/5 p-3 flex items-center justify-between z-50">
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
        <div className="bg-blue-500/10 px-3 py-0.5 rounded-full border border-blue-500/30 flex items-center gap-1.5 self-start">
          <span className="text-[8px] font-bold text-blue-400">LV.{Math.floor(player.level)}</span>
          <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500" 
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

      <div className="w-8 h-8 bg-purple-600 rounded-xl border border-white/20 overflow-hidden shadow-lg">
        <img src="https://picsum.photos/seed/farmer/100" alt="Avatar" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default HUD;
