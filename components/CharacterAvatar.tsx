import React from 'react';
import { Player } from '../types';
import { AVATAR_OPTIONS } from '../constants';

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

  const selectedAvatar = AVATAR_OPTIONS.find(opt => opt.id === player.avatarId) || AVATAR_OPTIONS[0];
  const avatarUrl = selectedAvatar.url;
  
  const isSpecial = player.activeTitle === 'deus_verde' || player.activeTitle === 'lenda_viva' || player.activeTitle === 'chefao';
  const rimClass = isSpecial ? 'rim-mistica' : 'rim-comum';

  return (
    <div className={`selection-rim selection-active ${rimClass} ${sizeClasses[size]} bg-zinc-900 shadow-2xl transition-all duration-500`}>
      {/* Camada de Conteúdo */}
      <div className="absolute inset-0 z-0">
        {player.activeTitle === 'deus_verde' && (
          <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent animate-pulse" />
        )}
        
        <img 
          src={avatarUrl} 
          alt="Avatar do Jogador" 
          className="w-full h-full object-cover" 
        />
      </div>
    </div>
  );
};

export default CharacterAvatar;