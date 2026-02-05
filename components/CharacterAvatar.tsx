
import React from 'react';
import { Player } from '../types';
import { LUXURY_ITEMS } from '../constants';

interface CharacterAvatarProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ player, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 rounded-xl',
    md: 'w-16 h-16 rounded-2xl',
    lg: 'w-28 h-28 rounded-3xl',
    xl: 'w-40 h-40 rounded-[3rem]'
  };

  const seedSuffix = player.gender === 'male' ? 'Oliver' : 'Cali';
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seedSuffix}&backgroundColor=b6e3f4`;
  
  const activeCape = LUXURY_ITEMS.find(i => i.id === player.activeCosmetics.cape);
  const activeJewelry = LUXURY_ITEMS.find(i => i.id === player.activeCosmetics.jewelry);
  const activeLuxury = LUXURY_ITEMS.find(i => i.id === player.activeCosmetics.luxury);

  return (
    <div className={`relative flex items-center justify-center bg-zinc-900 border-2 border-white/10 overflow-hidden shadow-2xl ${sizeClasses[size]}`}>
      {/* Cape Layer (Background of the character) */}
      {activeCape && (
        <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-t from-transparent to-white/20 animate-pulse pointer-events-none" />
      )}

      {/* Base Avatar */}
      <img src={avatarUrl} alt="Player Avatar" className="w-full h-full object-cover relative z-10" />

      {/* Cape Icon Overlay */}
      {activeCape && (
        <div className="absolute -left-1 bottom-1 z-30 pointer-events-none">
          <span className="text-xl filter drop-shadow-md">{activeCape.icon}</span>
        </div>
      )}

      {/* Jewelry Layer */}
      {activeJewelry && (
        <div className="absolute bottom-1 right-1 z-30 pointer-events-none">
          <span className="text-xl filter drop-shadow-[0_0_10px_gold]">{activeJewelry.icon}</span>
        </div>
      )}

      {/* Luxury Item Overlay */}
      {activeLuxury && (
        <div className="absolute top-1 right-1 z-30 pointer-events-none">
          <span className="text-xl filter drop-shadow-lg">{activeLuxury.icon}</span>
        </div>
      )}
    </div>
  );
};

export default CharacterAvatar;
