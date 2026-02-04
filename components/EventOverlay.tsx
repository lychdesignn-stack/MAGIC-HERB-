
import React from 'react';

interface EventOverlayProps {
  currentEvent: string | null;
}

const EventOverlay: React.FC<EventOverlayProps> = ({ currentEvent }) => {
  if (!currentEvent) return null;

  const getEventStyles = () => {
    switch (currentEvent) {
      case 'Neon Rain':
        return 'bg-blue-500/10 mix-blend-color-dodge';
      case 'Full Moon Ritual':
        return 'bg-purple-900/20 backdrop-brightness-75';
      case 'Cosmic Breeze':
        return 'bg-pink-500/10 mix-blend-overlay';
      default:
        return '';
    }
  };

  return (
    <div className={`fixed inset-0 pointer-events-none z-[100] transition-all duration-1000 ${getEventStyles()}`}>
      {currentEvent === 'Neon Rain' && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-[2px] h-20 bg-gradient-to-b from-blue-400 to-transparent animate-[rain_1s_infinite]"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                top: `-20%`
              }}
            />
          ))}
        </div>
      )}
      
      <style>{`
        @keyframes rain {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default EventOverlay;
