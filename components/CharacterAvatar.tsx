
import React from 'react';
import { Player } from '../types';
import { LUXURY_ITEMS, AVATAR_OPTIONS } from '../constants';

interface CharacterAvatarProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ player, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12 rounded-xl',
    md: 'w-20 h-20 rounded-2xl',
    lg: 'w-32 h-32 rounded-[2.5rem]',
    xl: 'w-48 h-48 rounded-[3.5rem]'
  };

  // Encontra a URL do avatar selecionado
  const selectedAvatar = AVATAR_OPTIONS.find(opt => opt.id === player.avatarId) || AVATAR_OPTIONS[0];
  const avatarUrl = selectedAvatar.url;
  
  const activeCape = LUXURY_ITEMS.find(i => i.id === player.activeCosmetics.cape);
  const activeJewelry = LUXURY_ITEMS.find(i => i.id === player.activeCosmetics.jewelry);
  const activeLuxury = LUXURY_ITEMS.find(i => i.id === player.activeCosmetics.luxury);

  return (
    <div className={`relative flex items-center justify-center bg-zinc-900 border-2 border-white/10 overflow-hidden shadow-2xl transition-all duration-500 ${sizeClasses[size]}`}>
      {/* Brilho de fundo para títulos especiais */}
      {player.activeTitle === 'deus_verde' && (
        <div className="absolute inset-0 bg-gradient-to-t from-green-500/40 to-transparent animate-pulse z-0" />
      )}
      
      {/* Personagem Principal */}
      <img 
        src={avatarUrl} 
        alt="Avatar do Jogador" 
        className="w-full h-full object-cover relative z-10 scale-100" 
      />

      {/* Sobreposições de Itens de Luxo */}
      {activeCape && (
        <div className="absolute -left-1 top-1 z-30 pointer-events-none">
          <span className="text-2xl filter drop-shadow-md">{activeCape.icon}</span>
        </div>
      )}

      {activeJewelry && (
        <div className="absolute top-2 right-2 z-30 pointer-events-none">
          <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]">{activeJewelry.icon}</span>
        </div>
      )}

      {activeLuxury && (
        <div className="absolute bottom-2 right-2 z-30 pointer-events-none">
          <span className="text-2xl filter drop-shadow-[0_0_10px_white]">{activeLuxury.icon}</span>
        </div>
      )}
    </div>
  );
};

export default CharacterAvatar;
