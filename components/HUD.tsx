import React, { useState } from 'react';
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
  onActivateCode: (code: string) => string;
}

const HUD: React.FC<HUDProps> = ({ 
  player, 
  currentEvent, 
  onOpenProfile, 
  onOpenMap, 
  totalBonus = 0, 
  passiveBonuses = { extraBuds: 0, growthSpeedMultiplier: 1 },
  onActivateCode
}) => {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState('');
  const [codeResult, setCodeResult] = useState<string | null>(null);

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

  const handleCodeSubmit = () => {
    const result = onActivateCode(code);
    setCodeResult(result);
    setCode('');
    setTimeout(() => {
      setCodeResult(null);
      setShowCodeInput(false);
    }, 2000);
  };

  // Cálculo de XP necessário para Nível de Jogador
  const playerXPNeeded = 100 * (1.4 + player.level * 0.15);
  const playerXPProgress = (player.experience / playerXPNeeded) * 100;

  // Cálculo de XP necessário para Nível de Reputação
  const repXPNeeded = 50 * (1.6 + player.totalReputation * 0.25);
  const repXPProgress = (player.totalReputationXP / repXPNeeded) * 100;

  return (
    <div className={`w-full ${themeStyles.bg} backdrop-blur-xl border-b ${themeStyles.border} p-3 flex flex-col gap-2 z-50 transition-all duration-700 ${themeStyles.effectClass || ''}`}>
      {/* Sistema de Códigos Overlay */}
      {showCodeInput && (
        <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-6 backdrop-blur-md">
           <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in duration-300">
              <h3 className="font-cartoon text-lg text-center">Configurações Estelares</h3>
              {codeResult ? (
                <p className="text-center font-black text-indigo-400 text-xs uppercase py-4">{codeResult}</p>
              ) : (
                <>
                  <input 
                    type="text" 
                    placeholder="Inserir Código..." 
                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none text-white text-center font-bold"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setShowCodeInput(false)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/5 font-black text-[10px] uppercase">Cancelar</button>
                    <button onClick={handleCodeSubmit} className="flex-1 py-3 rounded-xl bg-indigo-600 font-black text-[10px] uppercase">Ativar</button>
                  </div>
                </>
              )}
           </div>
        </div>
      )}

      {/* Linha Principal: Perfil e Recursos */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5 flex-1 max-w-[70%]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="flex flex-col">
              <span className={`text-[10px] font-cartoon drop-shadow-md ${themeStyles.text}`}>{player.name}</span>
              <div className="flex gap-1 mt-0.5">
                {equippedGear.map((item, idx) => (
                  <span key={idx} className="text-[8px] opacity-80" title={item?.name}>{item?.icon}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1 flex-1 ml-2">
              <div className="flex items-center gap-1">
                <span className={`text-[7px] font-black uppercase tracking-tighter text-white/60`}>LV.{player.level}</span>
                <div className="h-1.5 flex-1 bg-white/10 rounded-full border border-white/5 overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${playerXPProgress}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-[7px] font-black uppercase tracking-tighter text-amber-500`}>REP.{player.totalReputation}</span>
                <div className="h-1.5 flex-1 bg-white/10 rounded-full border border-white/5 overflow-hidden">
                  <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${repXPProgress}%` }} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-2 py-0.5 rounded-lg border flex items-center gap-1 min-w-[50px] ${themeStyles.bg} ${themeStyles.border}`}>
              <span className="text-[10px]">🪙</span>
              <span className={`font-cartoon text-[9px] ${themeStyles.text}`}>{Math.floor(player.coins)}</span>
            </div>
            <div className={`px-2 py-0.5 rounded-lg border flex items-center gap-1 min-w-[50px] ${themeStyles.bg} ${themeStyles.border}`}>
              <span className="text-[10px]">🍪</span>
              <span className={`font-cartoon text-[9px] ${themeStyles.text}`}>{Math.floor(player.hashCoins)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenMap}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg active:scale-90 transition-all shadow-lg border ${themeStyles.bg} ${themeStyles.border} hover:brightness-125`}
          >
            🗺️
          </button>
          <div className="flex flex-col items-center gap-1">
            <button 
              onClick={onOpenProfile}
              className="active:scale-90 transition-transform relative group"
            >
              <CharacterAvatar player={player} size="sm" />
            </button>
            <button 
              onClick={() => setShowCodeInput(true)}
              className="text-[10px] text-white/20 active:scale-125 transition-transform"
            >
              ⚙️
            </button>
          </div>
        </div>
      </div>

      {/* Linha de Status: Bônus Ativos */}
      <div className="flex items-center gap-3 bg-black/20 rounded-xl px-2 py-1 border border-white/5 overflow-x-auto no-scrollbar">
        <span className="text-[7px] font-black uppercase text-white/30 tracking-widest border-r border-white/10 pr-2 whitespace-nowrap">Status</span>
        
        <div className="flex items-center gap-1 whitespace-nowrap group">
           <span className="text-xs">⚡</span>
           <span className="text-[7px] font-black text-indigo-400 uppercase">Speed: x{passiveBonuses.growthSpeedMultiplier.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-1 whitespace-nowrap group">
           <span className="text-xs">🧪</span>
           <span className="text-[7px] font-black text-green-400 uppercase">Bonus: +{passiveBonuses.extraBuds}</span>
        </div>

        {currentEvent && (
          <div className="flex items-center gap-1.5 whitespace-nowrap ml-auto">
            <span className={`text-[7px] font-cartoon uppercase tracking-widest animate-pulse ${themeStyles.text}`}>
              ✨ {currentEvent}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HUD;