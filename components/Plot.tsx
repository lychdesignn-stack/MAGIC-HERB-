
import React, { useEffect, useState } from 'react';
import { Plot, Seed, Rarity, Player } from '../types';
import { SEEDS } from '../constants';

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
      {rarity === Rarity.MYTHIC && (
        <g>
          <circle r="50" fill={glowColor} fillOpacity="0.5" filter="blur(24px)" className="animate-pulse" />
          <circle r="44" fill="none" stroke={glowColor} strokeWidth="3" strokeDasharray="15 8" className="animate-[spin_3s_linear_infinite]" />
          <circle r="38" fill="none" stroke="#bef264" strokeWidth="1" strokeDasharray="5 5" className="animate-[spin_6s_linear_infinite_reverse]" />
          <circle cx="20" cy="-20" r="1.5" fill="white" className="animate-ping" style={{ animationDuration: '2s' }} />
          <circle cx="-25" cy="-10" r="1" fill="#bef264" className="animate-ping" style={{ animationDuration: '3s' }} />
        </g>
      )}
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
  </g>
);

const GrowLightEffect = ({ type, progress }: { type: Rarity, progress: number }) => {
  const normProgress = Math.max(0, Math.min(1, progress / 100));
  const intensity = normProgress * (type === Rarity.MYTHIC ? 0.7 : type === Rarity.LEGENDARY ? 0.5 : 0.4);
  
  const colors = {
    [Rarity.COMMON]: { beam: 'rgba(255,255,255,', bulb: 'bg-white' },
    [Rarity.RARE]: { beam: 'rgba(168,85,247,', bulb: 'bg-purple-400' },
    [Rarity.LEGENDARY]: { beam: 'rgba(234,179,8,', bulb: 'bg-yellow-400' },
    [Rarity.MYTHIC]: { beam: 'rgba(34,197,94,', bulb: 'bg-green-400' },
  };
  const theme = colors[type];

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center">
      {/* Container da Lâmpada perfeitamente centralizado */}
      <div className="w-16 h-1 flex flex-col items-center relative">
        {/* Lâmpada (Estrutura) */}
        <div className={`w-14 h-1.5 bg-zinc-800 rounded-b-md border-x border-b border-white/10 ${type === Rarity.MYTHIC ? 'border-green-500/20' : ''}`} />
        
        {/* Bulbo Brilhante */}
        <div 
          className={`absolute top-0.5 w-7 h-1 rounded-full blur-[1px] transition-all duration-700 ${theme.bulb}`}
          style={{ 
            opacity: 0.1 + normProgress * 0.9,
            boxShadow: `0 0 ${4 + normProgress * 15}px ${theme.beam}${0.6 + normProgress * 0.4})`
          }}
        />
      </div>
      
      {/* Feixe de Luz - Centralizado e com escala corrigida */}
      <div 
        className={`w-full h-full transition-all duration-1000 ease-out origin-top ${progress >= 100 ? 'animate-pulse' : ''}`}
        style={{ 
          background: `radial-gradient(circle at top, ${theme.beam}${intensity}), transparent 75%)`,
          clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)',
          opacity: intensity,
          transform: `scaleY(${0.5 + normProgress * 0.5})`
        }}
      />
    </div>
  );
};

const ActionCircle = ({ icon, onClick, active, pulse }: { icon: string, onClick: () => void, active: boolean, pulse?: boolean }) => {
  if (!active) return null;
  return (
    <button 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center text-lg transition-all active:scale-90 hover:bg-black/60 group
        ${pulse ? 'animate-pulse ring-1 ring-white/20' : ''}
      `}
    >
      <span className="drop-shadow-md group-hover:scale-110 transition-transform">{icon}</span>
    </button>
  );
};

const PlotComponent: React.FC<PlotProps> = ({ plot, selectedSeedId, onPlant, onWater, onPrune, onHarvest }) => {
  const [progress, setProgress] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
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
    } else if (!plot.seedId) {
      setProgress(0);
    }
  }, [plot.seedId, plot.plantedAt, plot.isWatered]);

  const isReadyForPruning = progress >= 100;
  const hasGradient = seed && (seed.rarity === Rarity.RARE || seed.rarity === Rarity.LEGENDARY || seed.rarity === Rarity.MYTHIC);
  const gradientId = hasGradient ? `grad-${seed!.id}-${plot.id}` : undefined;
  const maxGrowthHeight = 42;

  return (
    <div className={`relative w-full aspect-square rounded-[2.5rem] overflow-hidden border transition-all duration-500 group
      ${plot.type === Rarity.COMMON ? 'bg-zinc-950 border-white/5' : 
        plot.type === Rarity.RARE ? 'bg-purple-950/10 border-purple-500/10' : 
        plot.type === Rarity.LEGENDARY ? 'bg-yellow-950/10 border-yellow-500/10' :
        'bg-green-950/20 border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.15)] ring-1 ring-green-500/10'}
    `}>
      {/* Grow Light - Fixado alinhamento */}
      {plot.seedId && plot.isWatered && <GrowLightEffect type={plot.type} progress={progress} />}

      {/* Plant SVG */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
            <g transform={`translate(50, 92) scale(${0.8 + plot.capacity * 0.05}) translate(-50, -92)`}>
              <path 
                d={`M50,92 Q${50 + Math.sin(progress/10)*2},${92 - (progress/100)*(maxGrowthHeight/2)} 50,${92 - (progress/100)*maxGrowthHeight}`} 
                fill="none" 
                stroke={seed.rarity === Rarity.MYTHIC ? '#22c55e' : '#166534'} 
                strokeWidth={2 + (progress/100) * 1.5} 
                strokeLinecap="round" 
              />
              <OrganicLeaf progress={progress/100} size={0.4} color={seed.color} x={50} y={92 - (progress/100)*(maxGrowthHeight * 0.3)} rotation={-45} isPruned={plot.isPruned} gradientId={gradientId} />
              <OrganicLeaf progress={progress/100} size={0.5} color={seed.color} x={50} y={92 - (progress/100)*(maxGrowthHeight * 0.6)} rotation={45} isPruned={plot.isPruned} gradientId={gradientId} />
              <OrganicLeaf progress={progress/100} size={0.6} color={seed.color} x={50} y={92 - (progress/100)*(maxGrowthHeight * 0.85)} rotation={-30} isPruned={plot.isPruned} gradientId={gradientId} />
              <OrganicNugget progress={progress/100} color={seed.color} x={50} y={92 - (progress/100)*maxGrowthHeight} scale={0.7 + (progress/100)*0.4} glowColor={seed.glowColor} gradientId={gradientId} rarity={seed.rarity} />
            </g>
          )}
        </svg>
      </div>

      {/* Interação & Info */}
      <div className="absolute inset-0 z-20">
        <div className={`absolute top-4 left-4 text-[6px] font-black uppercase tracking-[0.3em] ${plot.type === Rarity.MYTHIC ? 'text-green-400' : 'text-white/10'}`}>{plot.type}</div>

        {plot.seedId && (
          <button 
            onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }}
            className={`absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center text-[8px] border transition-all
              ${showInfo ? 'bg-white text-black border-white' : 'bg-white/5 text-white/20 border-white/10 hover:border-white/30'}
            `}
          >
            ?
          </button>
        )}

        {showInfo && seed && (
          <div className="absolute top-11 right-4 left-4 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 animate-in fade-in zoom-in duration-200 shadow-2xl z-50">
            <h4 className="text-[10px] font-black text-white uppercase mb-1 tracking-wider">{seed.name}</h4>
            <p className="text-[8px] text-zinc-500 leading-tight">{seed.info}</p>
          </div>
        )}

        {!plot.seedId && (
          <div className="w-full h-full flex items-center justify-center">
            {selectedSeedId && SEEDS.find(s => s.id === selectedSeedId)?.rarity === plot.type ? (
              <button onClick={onPlant} className={`w-14 h-14 rounded-full border border-dashed transition-all flex items-center justify-center group/plant ${plot.type === Rarity.MYTHIC ? 'border-green-500/40 bg-green-500/5' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}`}>
                <span className={`text-xl opacity-20 group-hover/plant:opacity-100 group-hover/plant:scale-110 transition-all ${plot.type === Rarity.MYTHIC ? 'opacity-40 text-green-400' : ''}`}>🌱</span>
              </button>
            ) : (
              <span className={`text-[7px] font-black uppercase tracking-[0.5em] rotate-90 ${plot.type === Rarity.MYTHIC ? 'text-green-500/20' : 'text-white/5'}`}>VAZIO</span>
            )}
          </div>
        )}

        <div className="absolute bottom-4 right-4 flex flex-col gap-2.5 items-center">
          <ActionCircle 
            icon="💧" 
            onClick={onWater} 
            active={!!plot.seedId && !plot.isWatered} 
          />
          
          <ActionCircle 
            icon="✂️" 
            onClick={onPrune} 
            active={!!plot.seedId && plot.isWatered && !plot.isPruned && isReadyForPruning} 
          />

          <ActionCircle 
            icon="📦" 
            onClick={onHarvest} 
            active={plot.isPruned} 
            pulse={true}
          />

          {plot.seedId && plot.isWatered && !isReadyForPruning && (
            <div className={`w-1.5 h-10 bg-white/5 rounded-full overflow-hidden border border-white/5 mt-1 ${plot.type === Rarity.MYTHIC ? 'border-green-500/30' : ''}`}>
              <div 
                className={`w-full transition-all duration-500 shadow-[0_0_8px_rgba(99,102,241,0.5)] ${plot.type === Rarity.MYTHIC ? 'bg-green-400 shadow-[0_0_12px_rgba(34,197,94,0.8)]' : 'bg-indigo-500'}`} 
                style={{ height: `${progress}%`, marginTop: 'auto' }} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlotComponent;
