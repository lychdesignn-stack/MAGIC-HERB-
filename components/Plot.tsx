
import React, { useMemo } from 'react';
import { Plot, Rarity, Player } from '../types';
import { SEEDS } from '../constants';

interface PlotProps {
  plot: Plot;
  selectedSeedId: string;
  onPlant: () => void;
  onWater: () => void;
  onToggleLight: () => void;
  onPrune: () => void;
  onHarvest: () => void;
  onUpgrade: () => void;
  player: Player;
}

interface CannabisLeafProps {
  stemY: number;
  side: 'left' | 'right';
  progress: number;
  color: string;
  isPruned: boolean;
}

const CannabisLeaf: React.FC<CannabisLeafProps> = ({ stemY, side, progress, color, isPruned }) => {
  // Se estiver podado, as folhas somem completamente
  if (progress <= 0 || isPruned) return null;
  
  const scale = progress * 0.85; 
  const rotation = side === 'left' ? -35 * progress : 35 * progress;
  const flip = side === 'left' ? 1 : -1;

  return (
    <g transform={`translate(${50 + (1.2 * flip)}, ${85 - stemY}) rotate(${rotation}) scale(${scale})`} className="transition-all duration-500 ease-out">
      <path 
        d="M0,0 
           C-2,-8 -8,-15 -22,-15 C-8,-12 -2,-5 0,0 
           M0,0 C-1,-15 -3,-28 0,-35 C3,-28 1,-15 0,0 
           M0,0 C2,-8 8,-15 22,-15 C8,-12 2,-5 0,0" 
        fill={color} 
        stroke="rgba(0,0,0,0.2)" 
        strokeWidth="0.5"
      />
    </g>
  );
};

interface CannabisBudProps {
  color: string;
  progress: number;
  scaleMult?: number;
}

const CannabisBud: React.FC<CannabisBudProps> = ({ color, progress, scaleMult = 1 }) => {
  if (progress < 0.35) return null; 
  const scale = (progress - 0.35) * 1.6 * scaleMult;

  return (
    <g transform={`scale(${scale})`} className="transition-transform duration-700">
      <circle r="7" fill={color} fillOpacity="0.3" style={{ filter: 'blur(5px)' }} />
      <path 
        d="M0,-10 C-6,-8 -9,-2 -7,5 C-5,10 -2,12 0,12 C2,12 5,10 7,5 C9,-2 6,-8 0,-10" 
        fill={color} 
        stroke="rgba(0,0,0,0.1)" 
        strokeWidth="0.8"
      />
      {/* Pistilos laranja */}
      <g stroke="#f97316" strokeWidth="0.5" fill="none" opacity="0.9">
        <path d="M-3,-6 L-5,-9" />
        <path d="M3,-5 L5,-8" />
        <path d="M0,4 L0,8" />
      </g>
      {/* Resina/Brilho */}
      {progress > 0.8 && (
        <circle cx="-2" cy="-3" r="0.8" fill="white" fillOpacity="0.7" className="animate-pulse" />
      )}
    </g>
  );
};

const PlotComponent: React.FC<PlotProps> = ({ plot, onPlant, onWater, onToggleLight, onPrune, onHarvest }) => {
  const seed = useMemo(() => plot.seedId ? SEEDS.find(s => s.id === plot.seedId) : null, [plot.seedId]);
  const growth = plot.accumulatedGrowth;
  const isReady = growth >= 1;
  
  // Altura aumentada para 45 (quase metade do lote)
  const maxStemHeight = 45;
  const currentStemHeight = growth * maxStemHeight;

  // Nós de crescimento
  const nodes = [
    { y: 10, side: 'left' as const },
    { y: 20, side: 'right' as const },
    { y: 30, side: 'left' as const },
    { y: 40, side: 'right' as const },
  ];

  return (
    <div 
      onClick={() => !plot.seedId && onPlant()}
      className={`relative w-full aspect-square rounded-[2.5rem] overflow-hidden border transition-all duration-500 group cursor-pointer
      ${plot.type === Rarity.COMMON ? 'bg-zinc-950 border-white/5' : 
        plot.type === Rarity.RARE ? 'bg-purple-950/20 border-purple-500/20' : 
        plot.type === Rarity.LEGENDARY ? 'bg-yellow-950/20 border-yellow-500/30' :
        'bg-green-950/30 border-green-400/50 shadow-[0_0_40px_rgba(74,222,128,0.1)]'}
    `}>
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
          <defs>
            <radialGradient id={`soil-grad-${plot.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={plot.isWatered ? "#2d1a0a" : "#4a3528"} />
              <stop offset="100%" stopColor="#1a0f05" />
            </radialGradient>
            <radialGradient id="lamp-glow" cx="50%" cy="0%" r="100%">
              <stop offset="0%" stopColor="rgba(253, 224, 71, 0.18)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Lâmpada HUD */}
          <g transform="translate(50, 8)">
            <path d="M-12,0 L12,0 L16,8 L-16,8 Z" fill="#1e293b" />
            <rect x="-10" y="8" width="20" height="2" fill={plot.isLightOn ? "#fde047" : "#475569"} />
            {plot.isLightOn && <path d="M-15,10 L15,10 L35,85 L-35,85 Z" fill="url(#lamp-glow)" className="animate-pulse" />}
          </g>

          {/* PLANTA (Ancorada em Y=85 para nascer de dentro da terra) */}
          {seed && (
            <g style={{ 
              filter: plot.isLightOn ? 'none' : 'brightness(0.35) saturate(0.7)',
              transition: 'filter 0.5s ease'
            }}>
              {/* Caule Principal */}
              <path 
                d={`M50,85 L50,${85 - currentStemHeight}`} 
                fill="none" 
                stroke="#15803d" 
                strokeWidth={2 + growth * 2} 
                strokeLinecap="round" 
                className="transition-all duration-300"
              />

              {/* Sistema de Nós */}
              {nodes.map((node, i) => {
                const nodeProgress = Math.max(0, Math.min(1, (currentStemHeight - node.y) / 10));
                return (
                  <g key={i}>
                    <CannabisLeaf 
                      stemY={node.y} 
                      side={node.side} 
                      progress={nodeProgress} 
                      color={seed.color}
                      isPruned={plot.isPruned} 
                    />
                    <g transform={`translate(${50 + (node.side === 'left' ? -1.8 : 1.8)}, ${85 - node.y})`}>
                      <CannabisBud color={seed.color} progress={nodeProgress * growth} scaleMult={0.6} />
                    </g>
                  </g>
                );
              })}

              {/* Cluster de Buds no Topo (Cola principal) */}
              <g transform={`translate(50, ${85 - currentStemHeight})`}>
                <g transform="translate(0, -3)">
                  <CannabisBud color={seed.color} progress={growth} scaleMult={0.8} />
                </g>
                <g transform="translate(-3, 1) scale(0.8)">
                  <CannabisBud color={seed.color} progress={growth} scaleMult={0.6} />
                </g>
                <g transform="translate(3, 1) scale(0.8)">
                  <CannabisBud color={seed.color} progress={growth} scaleMult={0.6} />
                </g>
                <g transform="translate(0, 4) scale(0.7)">
                  <CannabisBud color={seed.color} progress={growth} scaleMult={0.5} />
                </g>
              </g>
            </g>
          )}

          {/* Monte de Terra (Desenhado por cima para enterrar a planta) */}
          <path d="M22,92 Q50,78 78,92 L75,98 L25,98 Z" fill={`url(#soil-grad-${plot.id})`} />
        </svg>
      </div>

      {/* Interface de Ações */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-between p-4 pointer-events-none">
        <div className="w-full flex justify-between items-start">
           <span className="text-[7px] font-black uppercase text-white/20 tracking-widest">{plot.type}</span>
           {growth > 0 && growth < 1 && (
             <div className="bg-black/60 px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                <div className={`w-1 h-1 rounded-full ${plot.isLightOn && plot.isWatered ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-[8px] font-bold text-white/60 tabular-nums">{Math.floor(growth * 100)}%</span>
             </div>
           )}
        </div>

        {!plot.seedId && (
          <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">🌱</div>
            <span className="text-[7px] font-black uppercase text-white/40 tracking-wider">Livre</span>
          </div>
        )}

        <div className="w-full flex flex-col gap-2 items-end pointer-events-auto">
          {seed && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleLight(); }}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg transition-all active:scale-90 border shadow-lg backdrop-blur-md
                  ${plot.isLightOn ? 'bg-yellow-500/40 border-yellow-400' : 'bg-black/60 border-white/10'}
                `}
              >
                💡
              </button>
              
              {!plot.isWatered && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onWater(); }}
                  className="w-10 h-10 rounded-2xl bg-blue-500 border border-blue-300 flex items-center justify-center text-lg animate-pulse shadow-lg"
                >
                  💧
                </button>
              )}

              {plot.isWatered && !plot.isPruned && isReady && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onPrune(); }}
                  className="w-10 h-10 rounded-2xl bg-indigo-600 border border-indigo-400 flex items-center justify-center text-lg animate-bounce shadow-xl"
                  title="Podar Folhas"
                >
                  ✂️
                </button>
              )}

              {plot.isPruned && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onHarvest(); }}
                  className="w-10 h-10 rounded-2xl bg-green-500 border border-white/40 flex items-center justify-center text-xl animate-pulse shadow-xl"
                >
                  📦
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlotComponent;
