
import React, { useState } from 'react';
import { Player } from '../types';
import { SEEDS } from '../constants';

interface WarehouseProps {
  player: Player;
  onBack: () => void;
}

const Warehouse: React.FC<WarehouseProps> = ({ player, onBack }) => {
  const [filter, setFilter] = useState<'all' | 'seeds' | 'buds' | 'hash'>('all');

  const categories = [
    { id: 'all', label: 'Tudo', icon: '📦' },
    { id: 'seeds', label: 'Sementes', icon: '🌱' },
    { id: 'buds', label: 'Flores', icon: '🌿' },
    { id: 'hash', label: 'Hash', icon: '🍫' },
  ];

  const renderInventoryItem = (id: string, name: string, type: 'seed' | 'bud' | 'hash', color: string) => {
    const quantity = player.inventory[id] || 0;
    if (quantity === 0) return null;

    let icon = '🌱';
    if (type === 'bud') icon = '🌿';
    if (type === 'hash') icon = '🍫';

    return (
      <div key={id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 active:bg-white/10 transition-colors">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner border"
          style={{ 
            backgroundColor: color + '22',
            borderColor: color + '44'
          }}
        >
          <span style={{ color: color }}>{icon}</span>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm text-white/90">{name}</h4>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">{type}</p>
        </div>
        <div className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/20">
          x{quantity}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-cartoon text-3xl text-blue-400">Seu Estoque</h2>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id as any)}
            className={`
              flex items-center gap-1.5 px-4 py-2 rounded-xl border transition-all whitespace-nowrap text-xs font-bold
              ${filter === cat.id ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-white/10'}
            `}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 pb-24">
        {SEEDS.map(seed => (
          <React.Fragment key={seed.id}>
            {(filter === 'all' || filter === 'seeds') && renderInventoryItem(seed.id, seed.name, 'seed', seed.color)}
            {(filter === 'all' || filter === 'buds') && renderInventoryItem(`${seed.id}_bud`, `${seed.name} (Flor)`, 'bud', seed.color)}
            {(filter === 'all' || filter === 'hash') && renderInventoryItem(`${seed.id}_hash`, `${seed.name} (Extrato)`, 'hash', seed.color)}
          </React.Fragment>
        ))}
        
        {Object.values(player.inventory).every(v => v === 0) && (
          <div className="flex flex-col items-center justify-center py-20 text-white/20">
            <span className="text-5xl mb-4">📭</span>
            <p className="font-cartoon text-sm uppercase italic">Estoque Vazio</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Warehouse;
