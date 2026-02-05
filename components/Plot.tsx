
import React, { useEffect, useState } from 'react';
import { Plot, Seed, Rarity, Player } from '../types';
import { SEEDS, UPGRADE_COSTS, UPGRADE_LIMITS } from '../constants';

interface PlotProps {
  plot: Plot;
  selectedSeedId: string;
  onPlant: () => void;
  onWater: () => void;
  onPrune: () => void;
  onHarvest: () => void;
  onUpgrade: () => void;
  player: Player;
}

const OrganicLeaf = ({ progress, size, color, x, y, rotation, isPruned, gradientId }: { progress: number, size: number, color: string, x: number, y: number, rotation: number, isPruned: boolean, gradientId?: string }) => {
  if (isPruned) return null;
  const leafProgress = Math.max(0, Math.min(1, (progress - 0.1) / 0.9));
  const currentScale = size * leafProgress;
  
  const leaflets = [
    { angle: -65, scale: 0.5 }, { angle: -40, scale: 0.8 }, { angle: -20, scale: 1 }, 
    { angle: 0, scale: 1.2 }, 
    { angle: 20, scale: 1 }, { angle: 40, scale: 0.8 }, { angle: 65, scale: 0.5 },
  ];

  if (leafProgress <= 0) return null;

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${currentScale})`} className="transition-all duration-700">
      {leaflets.map((leaf, i) => (
        <path 
          key={i} 
          d="M0,0 C-1,-5 -2.5,-15 -2.5,-25 C-2.5,-35 0,-45 0,-45 C0,-45 2.5,-35 2.5,-25 C2.5,-15 1,-5 0,0" 
          fill={gradientId ? `url(#${gradientId})` : color} 
          stroke="rgba(0,0,0,0.2)" 
          strokeWidth="0.5"
          style={{ 
            transition: 'transform 0.8s ease-out', 
            transform: `rotate(${leaf.angle * leafProgress}deg) scale(${leaf.scale})` 
          }}
        />
      ))}
    </g>
  );
};

const OrganicNugget = ({ progress, color, x, y, scale, glowColor, gradientId, rarity }: { progress: number, color: string, x: number, y: number, scale: number, glowColor: string, gradientId?: string, rarity: Rarity }) => {
  const nuggetGrowth = Math.max(0, Math.min(1, (progress - 0.4) / 0.6));
  if (nuggetGrowth <= 0) return null;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * nuggetGrowth})`}>
      {/* Glow / Aura */}
      <circle r={rarity === Rarity.LEGENDARY ? "40" : "25"} fill={glowColor} fillOpacity={rarity === Rarity.LEGENDARY ? "0.4" : "0.2"} filter="blur(15px)" className={rarity === Rarity.LEGENDARY ? "animate-pulse" : ""} />
      
      {/* Legendary Rotating Ring */}
      {rarity === Rarity.LEGENDARY && (
        <circle r="35" fill="none" stroke={glowColor} strokeWidth="1" strokeDasharray="10 5" className="animate-[spin_10s_linear_infinite]" />
      )}

      <path 
        d="M-12,12 Q-16,0 -8,-18 Q0,-30 8,-18 Q16,0 12,12 Q0,20 -12,12" 
        fill={gradientId ? `url(#${gradientId})` : color} 
        stroke="rgba(0,0,0,0.3)" 
        strokeWidth="1" 
      />
      
      {/* Resina / Brilho */}
      <g fill="white" fillOpacity="0.6">
        <circle cx="-4" cy="-8" r="1.5" />
        <circle cx="5" cy="-3" r="1.2" />
        {rarity === Rarity.LEGENDARY && <circle cx="0" cy="5" r="2" className="animate-pulse" />}
      </g>
      
      {/* Pelos alaranjados */}
      <g stroke="#f97316" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7">
        <path d="M-8,-8 Q-12,-12 -14,-10" />
        <path d="M8,-10 Q12,-15 14,-8" />
      </g>
    </g>
  );
};

const GrowLightEffect = ({ type, progress }: { type: Rarity, progress: number }) => {
  const intensity = 0.1 + (progress / 100) * 0.7;
  const colors = {
    [Rarity.COMMON]: { light: '#ffffff', beam: 'rgba(255,255,255,0.2)' },
    [Rarity.RARE]: { light: '#d8b4fe', beam: 'rgba(168,85,247,0.3)' },
    [Rarity.LEGENDARY]: { light: '#fde047', beam: 'rgba(234,179,8,0.5)' },
  };
  const color = colors[type];

  return (
    <div className="absolute top-0 inset-x-0 h-full pointer-events-none z-10 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-2 bg-zinc-800 rounded-b-full border-x border-b border-white/10 shadow-lg" />
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-b-full blur-[2px]"
        style={{ backgroundColor: color.light, opacity: intensity }}
      />
      <div 
        className="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-full transition-opacity duration-1000"
        style={{ 
          background: `linear-gradient(to bottom, ${color.beam}, transparent)`,
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
          opacity: intensity
        }}
      />
    </div>
  );
};

const PlotComponent: React.FC<PlotProps> = ({ plot, selectedSeedId, onPlant, onWater, onPrune, onHarvest }) => {
  const [progress, setProgress] = useState(0);
  const seed = plot.seedId ? SEEDS.find(s => s.id === plot.seedId) : null;

  useEffect(() => {
    if (plot.seedId && plot.plantedAt && plot.isWatered) {
      const interval = setInterval(() => {
        const seedData = SEEDS.find(s => s.id === plot.seedId);
        if (seedData) {
          const elapsed = (Date.now() - plot.plantedAt!) / 1000;
          const currentProgress = (elapsed / seedData.growthTime) * 100;
          setProgress(Math.min(currentProgress, 100));
        }
      }, 500);
      return () => clearInterval(interval);
    } else if (!plot.seedId) setProgress(0);
  }, [plot.seedId, plot.plantedAt, plot.isWatered]);

  const isReadyForPruning = progress >= 100;

  const getRarityStyle = () => {
    switch(plot.type) {
      case Rarity.COMMON: return 'border-white/10';
      case Rarity.RARE: return 'border-purple-500/30 shadow-[inset_0_0_20px_rgba(168,85,247,0.15)]';
      case Rarity.LEGENDARY: return 'border-yellow-500/40 shadow-[inset_0_0_40px_rgba(234,179,8,0.25)] ring-1 ring-yellow-500/20';
    }
  };

  const gradientId = seed ? `grad-${seed.id}-${plot.id}` : '';

  return (
    <div className={`relative w-full aspect-square rounded-[2rem] overflow-hidden bg-zinc-950 border-2 ${getRarityStyle()} transition-all duration-500 active:scale-95 group`}>
      {/* Minimalist Capacity Badge */}
      <div className="absolute top-3 right-4 z-50">
        <div className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1">
          <span className="text-[10px] font-black text-white/40 tracking-tighter">×</span>
          <span className="text-[11px] font-cartoon text-white/80">{plot.capacity}</span>
        </div>
      </div>

      <div className="absolute top-3 left-4 z-50">
         <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white/60 transition-colors">{plot.type}</span>
      </div>

      {plot.seedId && <GrowLightEffect type={plot.type} progress={progress} />}

      {seed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
            <defs>
              {/* Gradiente para Raras e Lendárias */}
              {(seed.rarity === Rarity.RARE || seed.rarity === Rarity.LEGENDARY) && (
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                  {seed.gradientColors ? (
                    seed.gradientColors.map((c, i) => (
                      <stop key={i} offset={`${(i / (seed.gradientColors!.length - 1)) * 100}%`} stopColor={c} />
                    ))
                  ) : (
                    <>
                      <stop offset="0%" stopColor={seed.color} />
                      <stop offset="100%" stopColor={seed.secondaryColor || seed.color} />
                    </>
                  )}
                </linearGradient>
              )}
            </defs>

            <g transform={`scale(${0.85 + (plot.capacity * 0.05)}) translate(${(100 - 100*(0.85 + plot.capacity*0.05))/2}, 0)`}>
              {/* Caule */}
              <path 
                d={`M50,95 Q${50 + Math.sin(progress/10)*2},${95 - (progress/100)*25} 50,${95 - (progress/100)*50}`} 
                fill="none" 
                stroke="#166534" 
                strokeWidth={1.5 + (progress/100) * 2} 
                strokeLinecap="round" 
              />
              
              <OrganicLeaf progress={progress/100} size={0.5} color={seed.color} x={50} y={95 - (progress/100)*15} rotation={-45} isPruned={plot.isPruned} gradientId={gradientId} />
              <OrganicLeaf progress={progress/100} size={0.6} color={seed.color} x={50} y={95 - (progress/100)*30} rotation={45} isPruned={plot.isPruned} gradientId={gradientId} />
              <OrganicLeaf progress={progress/100} size={0.7} color={seed.color} x={50} y={95 - (progress/100)*45} rotation={-30} isPruned={plot.isPruned} gradientId={gradientId} />
              
              <OrganicNugget 
                progress={progress/100} 
                color={seed.color} 
                x={50} 
                y={95 - (progress/100)*50} 
                scale={0.7 + (progress/100)*0.5} 
                glowColor={seed.glowColor} 
                gradientId={gradientId}
                rarity={seed.rarity}
              />
            </g>
          </svg>
        </div>
      )}

      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-24 h-4 bg-black/40 rounded-[100%] blur-sm pointer-events-none" />

      <button 
        onClick={() => {
          if (!plot.seedId) onPlant();
          else if (!plot.isWatered) onWater();
          else if (isReadyForPruning && !plot.isPruned) onPrune();
          else if (plot.isPruned) onHarvest();
        }}
        className="absolute inset-0 z-40 flex items-center justify-center"
      >
        {!plot.seedId && selectedSeedId && SEEDS.find(s => s.id === selectedSeedId)?.rarity === plot.type && (
          <div className="bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase animate-bounce border border-white/20 backdrop-blur-sm">Cultivar</div>
        )}
        {plot.seedId && !plot.isWatered && <div className="text-5xl animate-bounce drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]">💧</div>}
        {isReadyForPruning && !plot.isPruned && (
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl animate-pulse shadow-[0_0_30px_white] border-2 border-pink-500 transform rotate-12">✂️</div>
        )}
        {plot.isPruned && (
          <div className="bg-white text-black px-8 py-3 rounded-full font-cartoon text-[12px] animate-pulse border-2 border-white/40 shadow-[0_10px_30px_rgba(255,255,255,0.3)]">COLHER {plot.capacity}×</div>
        )}
      </button>

      {/* Partículas para Lendários e Raros */}
      {(plot.type === Rarity.LEGENDARY || plot.type === Rarity.RARE) && plot.seedId && (
        <div className="absolute inset-0 pointer-events-none opacity-50 overflow-hidden">
          <div className={`absolute top-1/2 left-1/3 w-1 h-1 bg-white rounded-full ${plot.type === Rarity.LEGENDARY ? 'animate-ping' : 'animate-pulse'}`} />
          <div className={`absolute top-1/4 right-1/3 w-1 h-1 bg-white rounded-full ${plot.type === Rarity.LEGENDARY ? 'animate-ping' : 'animate-pulse'} delay-500`} />
          {plot.type === Rarity.LEGENDARY && <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-bounce delay-200" />}
        </div>
      )}
    </div>
  );
};

export default PlotComponent;
