
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
  passiveBonuses?: {
    extraBuds: number;
    growthSpeedMultiplier: number;
  };
}

const HUD: React.FC<HUDProps> = ({ 
  player, 
  currentEvent, 
  onOpenProfile, 
  onOpenMap, 
  totalBonus = 0, 
  passiveBonuses = { extraBuds: 0, growthSpeedMultiplier: 1 } 
}) => {
  const activeThemeId = player.activeCosmetics.hud_theme;
  const activeTheme = LUXURY_ITEMS.find(i => i.id === activeThemeId);
  
  const themeStyles = activeTheme?.style || {
    bg: 'bg-black/40',
    border: 'border-white/5',
    text: 'text-blue-400',
    accent: 'bg-white/10',
    effectClass: ''
  };

  const equippedGear = [
    LUXURY_ITEMS.find(i => i.id === player.activeCosmetics.cape),
    LUXURY_ITEMS.find(i => i.id === player.activeCosmetics.jewelry),
    LUXURY_ITEMS.find(i => i.id === player.activeCosmetics.luxury)
  ].filter(Boolean);

  return (
    <div className={`w-full ${themeStyles.bg} backdrop-blur-xl border-b ${themeStyles.border} p-3 flex flex-col gap-2 z-50 transition-all duration-700 ${themeStyles.effectClass || ''}`}>
      {/* Linha Principal: Perfil e Recursos */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="flex flex-col">
              <span className={`text-[10px] font-cartoon drop-shadow-md ${themeStyles.text}`}>{player.name}</span>
              <div className="flex gap-1 mt-0.5">
                {equippedGear.map((item, idx) => (
                  <span key={idx} className="text-[8px] opacity-80" title={item?.name}>{item?.icon}</span>
                ))}
              </div>
            </div>
            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${themeStyles.accent} text-white/60`}>LV.{Math.floor(player.level)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-2.5 py-1 rounded-xl border flex items-center gap-1 min-w-[60px] ${themeStyles.bg} ${themeStyles.border}`}>
              <span className="text-[10px]">🪙</span>
              <span className={`font-cartoon text-[10px] ${themeStyles.text}`}>{Math.floor(player.coins)}</span>
            </div>
            <div className={`px-2.5 py-1 rounded-xl border flex items-center gap-1 min-w-[60px] ${themeStyles.bg} ${themeStyles.border}`}>
              <span className="text-[10px]">🍪</span>
              <span className={`font-cartoon text-[10px] ${themeStyles.text}`}>{Math.floor(player.hashCoins)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenMap}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl active:scale-90 transition-all shadow-lg border ${themeStyles.bg} ${themeStyles.border} hover:brightness-125`}
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

      {/* Linha de Status: Bônus Ativos */}
      <div className="flex items-center gap-3 bg-black/20 rounded-xl px-2 py-1.5 border border-white/5 overflow-x-auto no-scrollbar">
        <span className="text-[7px] font-black uppercase text-white/30 tracking-widest border-r border-white/10 pr-2 whitespace-nowrap">Bônus Ativos</span>
        
        {/* Velocidade de Crescimento */}
        <div className="flex items-center gap-1.5 whitespace-nowrap group animate-in fade-in zoom-in duration-500">
           <span className="text-xs">⚡</span>
           <span className="text-[8px] font-black text-indigo-400 uppercase">Growth: x{passiveBonuses.growthSpeedMultiplier.toFixed(2)}</span>
        </div>

        {/* Extra Buds */}
        <div className="flex items-center gap-1.5 whitespace-nowrap group animate-in fade-in zoom-in duration-500 delay-75">
           <span className="text-xs">🧪</span>
           <span className="text-[8px] font-black text-green-400 uppercase">Extra: +{passiveBonuses.extraBuds}</span>
        </div>

        {/* Bônus de Colheita de Itens */}
        <div className="flex items-center gap-1.5 whitespace-nowrap group animate-in fade-in zoom-in duration-500 delay-150">
           <span className="text-xs">💍</span>
           <span className="text-[8px] font-black text-amber-400 uppercase">Harvest: +{Math.round(totalBonus * 100)}%</span>
        </div>

        {currentEvent && (
          <div className="flex items-center gap-1.5 whitespace-nowrap ml-auto">
            <span className={`text-[8px] font-cartoon uppercase tracking-widest animate-pulse ${themeStyles.text}`}>
              ✨ {currentEvent}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HUD;
