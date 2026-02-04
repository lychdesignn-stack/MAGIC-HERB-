
import React, { useEffect, useState } from 'react';
import { Plot, Seed, Rarity } from '../types';
import { SEEDS } from '../constants';

interface PlotProps {
  plot: Plot;
  selectedSeedId: string;
  onPlant: () => void;
  onWater: () => void;
  onPrune: () => void;
  onHarvest: () => void;
}

// Organic Leaf with improved unfolding logic
const OrganicLeaf = ({ progress, size, color, x, y, rotation, isPruned }: { progress: number, size: number, color: string, x: number, y: number, rotation: number, isPruned: boolean }) => {
  if (isPruned) return null;

  const leafProgress = Math.max(0, Math.min(1, (progress - 0.2) / 0.8));
  const currentScale = size * leafProgress;
  
  const leaflets = [
    { angle: -70, scale: 0.5 },
    { angle: -45, scale: 0.8 },
    { angle: -22, scale: 1 },
    { angle: 0, scale: 1.2 }, 
    { angle: 22, scale: 1 },
    { angle: 45, scale: 0.8 },
    { angle: 70, scale: 0.5 },
  ];

  if (leafProgress <= 0) return null;

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${currentScale})`} className="transition-all duration-500">
      {leaflets.map((leaf, i) => (
        <path
          key={i}
          d="M0,0 C-1,-5 -2.5,-15 -2.5,-25 C-2.5,-35 0,-45 0,-45 C0,-45 2.5,-35 2.5,-25 C2.5,-15 1,-5 0,0"
          fill={color}
          stroke="#064e3b"
          strokeWidth="1.5"
          style={{ 
            transition: 'transform 0.5s ease-out',
            transform: `rotate(${leaf.angle * leafProgress}deg) scale(${leaf.scale})` 
          }}
        />
      ))}
      {/* Reflexo de luz na folha para destacar sob a iluminação forte */}
      <ellipse cx="0" cy="-20" rx="3" ry="12" fill="white" fillOpacity="0.2" filter="blur(3px)" />
    </g>
  );
};

// Flower/Bud with growth and subtle pulsing
const OrganicNugget = ({ progress, color, x, y, scale, isLegendary }: { progress: number, color: string, x: number, y: number, scale: number, isLegendary: boolean }) => {
  const nuggetGrowth = Math.max(0, Math.min(1, (progress - 0.5) / 0.5));
  if (nuggetGrowth <= 0) return null;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * nuggetGrowth})`}>
      <path 
        d="M-12,12 Q-16,0 -8,-18 Q0,-30 8,-18 Q16,0 12,12 Q0,20 -12,12" 
        fill={color} 
        stroke="#1a2e05" 
        strokeWidth="2" 
      />
      <g stroke="#f97316" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M-10,-5 Q-14,-8 -18,-3" className="animate-pulse" />
        <path d="M10,-8 Q14,-10 16,-5" className="animate-pulse" />
        <path d="M-3,-22 Q-5,-28 -1,-32" />
        <path d="M3,-20 Q5,-26 8,-28" />
      </g>
      <g fill="white" fillOpacity="0.6">
        <circle cx="-3" cy="-12" r="1.5" />
        <circle cx="6" cy="-6" r="1.2" />
      </g>
      {isLegendary && (
        <circle r="38" fill="none" stroke="gold" strokeWidth="1" strokeDasharray="4 8" className="animate-[spin_5s_linear_infinite]" />
      )}
    </g>
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
          const elapsed = (Date.now() - (plot.plantedAt || 0)) / 1000;
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
  const isLegendary = seed?.rarity === Rarity.LEGENDARY;

  const getLightStage = () => {
    if (progress < 40) return 'white';
    if (progress < 80) return 'purple';
    return 'gold';
  };

  const getLedColor = () => {
    if (!seed) return 'bg-zinc-800';
    const stage = getLightStage();
    if (stage === 'white') return 'bg-white shadow-[0_0_25px_white]'; 
    if (stage === 'purple') return 'bg-purple-500 shadow-[0_0_25px_#a855f7]'; 
    return 'bg-amber-400 shadow-[0_0_30px_#fbbf24]'; 
  };

  const renderPlant = () => {
    if (!seed) return null;
    
    const p = progress / 100;
    const easeProgress = p * p * (3 - 2 * p); 
    const stemHeight = easeProgress * 48;
    const stemY = 100 - stemHeight;
    const bend = Math.max(0, 15 * (1 - p * 3));

    return (
      <div 
        className="absolute inset-x-0 bottom-[14%] flex justify-center pointer-events-none z-20"
        style={{ clipPath: 'inset(-100px -100px 0px -100px)' }}
      >
        <svg 
          width="130" 
          height="140" 
          viewBox="0 0 100 100" 
          className="overflow-visible"
        >
          {/* Main Stem */}
          <path 
            d={`M50,100 Q${50 - bend},${100 - stemHeight/2} 50,${stemY}`}
            fill="none"
            stroke="#14532d"
            strokeWidth={2.5 + p * 1.5}
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {p > 0.15 && (
            <g>
              <OrganicLeaf progress={p * 1.1} x={50} y={Math.max(stemY + 10, 88)} rotation={-50} size={0.5} color={seed.color} isPruned={plot.isPruned} />
              <OrganicLeaf progress={p * 1.1} x={50} y={Math.max(stemY + 10, 88)} rotation={50} size={0.5} color={seed.color} isPruned={plot.isPruned} />
              {p > 0.45 && (
                <>
                  <OrganicLeaf progress={p} x={50} y={Math.max(stemY + 5, 65)} rotation={-35} size={0.4} color={seed.color} isPruned={plot.isPruned} />
                  <OrganicLeaf progress={p} x={50} y={Math.max(stemY + 5, 65)} rotation={35} size={0.4} color={seed.color} isPruned={plot.isPruned} />
                </>
              )}
            </g>
          )}

          <OrganicNugget progress={p} x={50} y={stemY} scale={0.9} color={seed.color} isLegendary={isLegendary} />
          
          {p > 0 && p < 0.15 && (
            <g className="animate-pulse">
              <circle cx="48" cy="98" r="1" fill="#3f2305" />
              <circle cx="52" cy="99" r="1.5" fill="#2a1803" />
            </g>
          )}
        </svg>
      </div>
    );
  };

  const lightStage = getLightStage();

  return (
    <div 
      onClick={() => {
        if (!plot.seedId) onPlant();
        else if (!plot.isWatered) onWater();
        else if (isReadyForPruning && !plot.isPruned) onPrune();
        else if (plot.isPruned) onHarvest();
      }}
      className={`
        relative w-full aspect-square rounded-[3.5rem] cursor-pointer transition-all duration-500 active:scale-95 overflow-hidden
        ${plot.seedId ? 'bg-zinc-900 shadow-inner' : 'bg-zinc-950'}
        ${!plot.seedId && selectedSeedId ? 'ring-4 ring-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : ''}
        ${plot.isFertilized ? 'legendary-glow border-2' : 'border-b-[10px] border-black'}
        shadow-2xl
      `}
    >
      {/* Background Lighting System */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Camada 1: Gradiente Base */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/20 to-black" />
        
        {/* Camada 2: Brilho Ambiente (Bloom) - Intensificado */}
        <div 
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[160%] h-[140%] transition-all duration-1000 blur-[100px]
            ${lightStage === 'white' ? 'bg-white/50' : lightStage === 'purple' ? 'bg-purple-600/60' : 'bg-amber-500/70'}
          `}
          style={{ opacity: seed ? 0.6 + (progress/100) * 0.4 : 0 }}
        />

        {/* Camada 3: Holofote (Spotlight) Focalizado encima da planta */}
        <div 
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[100%] h-[150%] transition-all duration-700
            ${lightStage === 'white' ? 'from-white/40' : lightStage === 'purple' ? 'from-purple-500/40' : 'from-amber-400/40'}
            bg-gradient-to-b via-transparent to-transparent
          `}
          style={{ 
            opacity: seed ? 1 : 0,
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'
          }}
        />

        {/* Camada 4: Glow Pulsante para vida extra */}
        {seed && (
          <div 
            className={`absolute top-[-10%] left-1/2 -translate-x-1/2 w-40 h-40 blur-[40px] rounded-full animate-pulse
              ${lightStage === 'white' ? 'bg-white/30' : lightStage === 'purple' ? 'bg-purple-400/30' : 'bg-amber-300/40'}
            `}
          />
        )}
      </div>

      {/* Compact LED Panel - Destaque visual do emissor de luz */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-4 bg-zinc-800 rounded-b-2xl z-30 flex justify-center items-center gap-2 px-3 border-x border-b border-white/10 shadow-lg">
        {[1,2,3,4].map(i => (
          <div key={i} className={`w-2 h-1.5 rounded-full transition-all duration-700 ${getLedColor()}`} />
        ))}
      </div>

      {renderPlant()}

      {/* Soil Tile */}
      <div className={`
        absolute bottom-[10%] left-1/2 -translate-x-1/2 w-32 h-10 rounded-[50%] bg-[#0d0704] border-t-2 border-white/5 z-10 shadow-2xl overflow-hidden
      `}>
         <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:4px_4px]" />
         {progress > 0 && progress < 12 && (
           <g stroke="black" strokeWidth="1.5" fill="none" opacity="0.6">
             <path d="M55,5 L65,15 M45,8 L35,18" />
           </g>
         )}
      </div>

      {/* Action Overlays */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50">
        {!plot.seedId && selectedSeedId && (
          <div className="bg-green-600 text-white px-4 py-1.5 rounded-full font-cartoon text-[8px] animate-bounce shadow-xl border border-white/20 uppercase tracking-tighter">Plantar</div>
        )}
        {plot.seedId && !plot.isWatered && (
          <div className="text-4xl animate-bounce drop-shadow-2xl">💧</div>
        )}
        {isReadyForPruning && !plot.isPruned && (
           <div className="w-14 h-14 bg-pink-500 rounded-[2rem] flex items-center justify-center text-2xl shadow-2xl animate-pulse border-4 border-white">✂️</div>
        )}
        {plot.isPruned && (
          <div className="bg-purple-600 text-white px-6 py-2.5 rounded-full font-cartoon text-[10px] animate-pulse border-2 border-white/20 shadow-2xl uppercase tracking-[0.1em]">Colher</div>
        )}
      </div>
    </div>
  );
};

export default PlotComponent;
