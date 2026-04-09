'use client';

interface WaterDropsIndicatorProps {
  litros: number;
}

export function WaterDropsIndicator({ litros }: WaterDropsIndicatorProps) {
  const fullDrops = Math.floor(litros);
  const hasPartial = litros % 1 > 0;
  const totalDrops = 3;

  return (
    <div className="flex items-center gap-1.5 mt-2">
      {Array.from({ length: totalDrops }).map((_, index) => {
        const isFull = index < fullDrops;
        const isPartial = index === fullDrops && hasPartial;

        return (
          <div key={index} className="relative h-4 w-2.5">
            {isFull ? (
              // Gota cheia colorida
              <svg viewBox="0 0 16 24" className="h-full w-full fill-flow-accent">
                <path d="M8 1c0 0-6 8-6 14c0 3.3 2.7 6 6 6s6-2.7 6-6c0-6-6-14-6-14z" />
              </svg>
            ) : isPartial ? (
              // Gota parcialmente cheia
              <svg viewBox="0 0 16 24" className="h-full w-full">
                <defs>
                  <linearGradient id={`partialGradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="50%" stopColor="#6c63ff" />
                    <stop offset="50%" stopColor="#e0e0e0" />
                  </linearGradient>
                </defs>
                <path d="M8 1c0 0-6 8-6 14c0 3.3 2.7 6 6 6s6-2.7 6-6c0-6-6-14-6-14z" fill={`url(#partialGradient-${index})`} />
              </svg>
            ) : (
              // Gota vazia cinza
              <svg viewBox="0 0 16 24" className="h-full w-full stroke-gray-300 fill-none" strokeWidth="0.5">
                <path d="M8 1c0 0-6 8-6 14c0 3.3 2.7 6 6 6s6-2.7 6-6c0-6-6-14-6-14z" />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}

