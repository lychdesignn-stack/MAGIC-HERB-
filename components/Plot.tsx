
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
          stroke="rgba(0,0,0,0.15)" 
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
      {/* Aura de Raridade Vibrante */}
      {rarity === Rarity.LEGENDARY && (
        <g>
          <circle r="42" fill={glowColor} fillOpacity="0.4" filter="blur(18px)" className="animate-pulse" />
          <circle r="36" fill="none" stroke={glowColor} strokeWidth="2" strokeDasharray="10 5" className="animate-[spin_4s_linear_infinite]" />
        </g>
      )}
      {rarity === Rarity.RARE && (
        <circle r="32" fill={glowColor} fillOpacity="0.2" filter="blur(12px)" className="animate-pulse" />
      )}

      <path 
        d="M-12,12 Q-16,0 -8,-18 Q0,-30 8,-18 Q16,0 12,12 Q0,20 -12,12" 
        fill={gradientId ? `url(#${gradientId})` : color} 
        stroke="rgba(0,0,0,0.2)" 
        strokeWidth="1" 
      />
      
      <g fill="white" fillOpacity="0.8">
        <circle cx="-5" cy="-10" r="1.5" className="animate-pulse" />
        <circle cx="6" cy="-4" r="1.2" />
      </g>
    </g>
  );
};

const Soil = () => (
  <g transform="translate(50, 92)">
    <path 
      d="M-28,0 Q-24,-10 0,-10 Q24,-10 28,0" 
      fill="#4a3728" 
      stroke="#2d1e12" 
      strokeWidth="1"
    />
    <circle cx="-14" cy="-5" r="2" fill="#2d1e12" opacity="0.6" />
    <circle cx="10" cy="-6" r="1.5" fill="#2d1e12" opacity="0.6" />
    <path d="M-8,-7 Q0,-9 8,-7" fill="none" stroke="#2d1e12" strokeWidth="0.8" opacity="0.4" />
  </g>
);

const GrowLightEffect = ({ type, progress }: { type: Rarity, progress: number }) => {
  const intensity = 0.15 + (progress / 100) * 0.75;
  const colors = {
    [Rarity.COMMON]: { light: '#ffffff', beam: 'rgba(255,255,255,0.1)' },
    [Rarity.RARE]: { light: '#e9d5ff', beam: 'rgba(192,132,252,0.25)' },
    [Rarity.LEGENDARY]: { light: '#fef08a', beam: 'rgba(250,204,21,0.4)' },
  };
  const color = colors[type];

  return (
    <div className="absolute top-0 inset-x-0 h-full pointer-events-none z-10 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-2.5 bg-zinc-800 rounded-b-full border-x border-b border-white/20 shadow-2xl" />
      <div 
        className="absolute top-2 left-1/2 -translate-x-1/2 w-56 h-full transition-opacity duration-1000"
        style={{ 
          background: `linear-gradient(to bottom, ${color.beam}, transparent)`,
          clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
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
      case Rarity.COMMON: return 'border-white/10 bg-zinc-950';
      case Rarity.RARE: return 'border-purple-500/30 bg-zinc-950 shadow-[inset_0_0_25px_rgba(168,85,247,0.1)]';
      case Rarity.LEGENDARY: return 'border-yellow-500/40 bg-zinc-950 shadow-[inset_0_0_45px_rgba(234,179,8,0.2)]';
    }
  };

  const hasGradient = seed && (seed.rarity === Rarity.RARE || seed.rarity === Rarity.LEGENDARY);
  const gradientId = hasGradient ? `grad-${seed!.id}-${plot.id}` : undefined;
  const maxGrowthHeight = 40;

  return (
    <div className={`relative w-full aspect-square rounded-[3rem] overflow-hidden border-2 ${getRarityStyle()} transition-all duration-500 active:scale-95 group`}>
      <div className="absolute top-5 right-5 z-50">
        <div className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1 shadow-lg">
          <span className="text-[10px] font-black text-white/50">×</span>
          <span className="text-[12px] font-cartoon text-white">{plot.capacity}</span>
        </div>
      </div>

      {plot.seedId && <GrowLightEffect type={plot.type} progress={progress} />}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
          <defs>
            {hasGradient && (
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

          {seed && <Soil />}

          {seed && (
            <g transform={`scale(${0.9 + (plot.capacity * 0.04)}) translate(${(100 - 100*(0.9 + plot.capacity*0.04))/2}, 0)`}>
              <path 
                d={`M50,92 Q${50 + Math.sin(progress/10)*2},${92 - (progress/100)*(maxGrowthHeight/2)} 50,${92 - (progress/100)*maxGrowthHeight}`} 
                fill="none" 
                stroke="#166534" 
                strokeWidth={2 + (progress/100) * 2} 
                strokeLinecap="round" 
              />
              
              <OrganicLeaf progress={progress/100} size={0.55} color={seed.color} x={50} y={92 - (progress/100)*(maxGrowthHeight * 0.3)} rotation={-45} isPruned={plot.isPruned} gradientId={gradientId} />
              <OrganicLeaf progress={progress/100} size={0.65} color={seed.color} x={50} y={92 - (progress/100)*(maxGrowthHeight * 0.6)} rotation={45} isPruned={plot.isPruned} gradientId={gradientId} />
              <OrganicLeaf progress={progress/100} size={0.75} color={seed.color} x={50} y={92 - (progress/100)*(maxGrowthHeight * 0.85)} rotation={-30} isPruned={plot.isPruned} gradientId={gradientId} />
              
              <OrganicNugget 
                progress={progress/100} 
                color={seed.color} 
                x={50} 
                y={92 - (progress/100)*maxGrowthHeight} 
                scale={0.8 + (progress/100)*0.5} 
                glowColor={seed.glowColor} 
                gradientId={gradientId}
                rarity={seed.rarity}
              />
            </g>
          )}
        </svg>
      </div>

      <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-32 h-6 bg-black/60 rounded-[100%] blur-md pointer-events-none" />

      <button 
        onClick={() => {
          if (!plot.seedId) onPlant();
          else if (!plot.isWatered) onWater();
          else if (isReadyForPruning && !plot.isPruned) onPrune();
          else if (plot.isPruned) onHarvest();
        }}
        className="absolute inset-0 z-40 flex items-center justify-center bg-transparent"
      >
        {!plot.seedId && selectedSeedId && SEEDS.find(s => s.id === selectedSeedId)?.rarity === plot.type && (
          <div className="bg-white/20 px-6 py-2 rounded-full text-[11px] font-black uppercase animate-bounce border border-white/30 backdrop-blur-md shadow-xl text-white">CULTIVAR</div>
        )}
        {plot.seedId && !plot.isWatered && <div className="text-6xl animate-bounce drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">💧</div>}
        {isReadyForPruning && !plot.isPruned && (
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl animate-pulse shadow-[0_0_50px_white] border-2 border-pink-500 transform rotate-12">✂️</div>
        )}
        {plot.isPruned && (
          <div className="bg-white text-black px-10 py-4 rounded-full font-cartoon text-[14px] animate-pulse border-2 border-white/40 shadow-2xl">COLHER {plot.capacity}×</div>
        )}
      </button>
    </div>
  );
};

export default PlotComponent;
