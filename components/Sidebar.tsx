
import React from 'react';

interface SidebarProps {
  activeScreen: string;
  onNavigate: (screen: 'farm' | 'shop' | 'npc' | 'lab' | 'warehouse') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeScreen, onNavigate }) => {
  const navItems = [
    { id: 'farm', label: 'Fazenda', icon: '🏡' },
    { id: 'warehouse', label: 'Armazém', icon: '📦' },
    { id: 'lab', label: 'Laboratório', icon: '⚗️' },
    { id: 'shop', label: 'Loja', icon: '🌱' },
    { id: 'npc', label: 'Mercado', icon: '🌌' },
  ];

  return (
    <nav className="w-24 bg-black/40 backdrop-blur-xl border-l border-white/10 flex flex-col items-center py-8 gap-10">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id as any)}
          className={`
            group relative w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-300
            ${activeScreen === item.id 
              ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-110' 
              : 'text-white/40 hover:text-white hover:bg-white/5'}
          `}
        >
          <span className="text-3xl mb-1">{item.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          
          {activeScreen === item.id && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
          )}
        </button>
      ))}
    </nav>
  );
};

export default Sidebar;
