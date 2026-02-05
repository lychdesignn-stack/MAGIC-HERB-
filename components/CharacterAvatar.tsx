
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

  // Encontra a URL do avatar selecionado
  const selectedAvatar = AVATAR_OPTIONS.find(opt => opt.id === player.avatarId) || AVATAR_OPTIONS[0];
  const avatarUrl = selectedAvatar.url;

  return (
    <div className={`relative flex items-center justify-center bg-zinc-900 border-2 border-white/10 overflow-hidden shadow-2xl transition-all duration-500 ${sizeClasses[size]}`}>
      {/* Brilho de fundo para títulos especiais */}
      {player.activeTitle === 'deus_verde' && (
        <div className="absolute inset-0 bg-gradient-to-t from-green-500/40 to-transparent animate-pulse z-0" />
      )}
      
      {/* Personagem Principal - Limpo, sem itens por cima */}
      <img 
        src={avatarUrl} 
        alt="Avatar do Jogador" 
        className="w-full h-full object-cover relative z-10 scale-100" 
      />
    </div>
  );
};

export default CharacterAvatar;
