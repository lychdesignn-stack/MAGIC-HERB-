
import React from 'react';

interface BottomNavProps {
  activeScreen: string;
  onNavigate: (screen: 'farm' | 'shop' | 'npc' | 'lab' | 'warehouse') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  const navItems = [
    { id: 'farm', label: 'Fazenda', icon: '🏡' },
    { id: 'warehouse', label: 'Estoque', icon: '📦' },
    { id: 'lab', label: 'Extração', icon: '⚗️' },
    { id: 'shop', label: 'Loja', icon: '🌱' },
    { id: 'npc', label: 'Vender', icon: '🌌' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-2xl border-t border-white/10 flex justify-around items-center py-3 pb-6 z-[100] px-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id as any)}
          className={`
            relative flex flex-col items-center justify-center transition-all duration-300
            ${activeScreen === item.id ? 'active-tab' : 'text-white/40'}
          `}
        >
          <span className="text-2xl mb-1">{item.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
