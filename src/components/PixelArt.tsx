'use client';

import { useEffect, useState } from 'react';

export function AuroraAnimation() {
  return (
    <div className="relative w-full h-32 overflow-hidden">
      <div className="absolute inset-0">
        {/* Aurora waves */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-x-0 h-12"
            style={{
              top: `${i * 25}%`,
              opacity: 0.3 - i * 0.05,
              animation: `aurora ${15 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <div
              className={`h-full bg-gradient-to-r ${
                i % 3 === 0
                  ? 'from-yk-primary-400 via-yk-aurora-400 to-yk-gold-400'
                  : i % 3 === 1
                  ? 'from-yk-aurora-400 via-yk-primary-400 to-purple-400'
                  : 'from-yk-gold-400 via-yk-aurora-400 to-yk-primary-400'
              }`}
              style={{
                filter: 'blur(20px)',
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PixelStars({ count = 20 }: { count?: number }) {
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    const newStars = Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() > 0.5 ? 1 : 2,
      delay: Math.random() * 3,
    }));
    setStars(newStars);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: '2s',
          }}
        ></div>
      ))}
    </div>
  );
}

export function PixelCloud({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-block ${className}`}>
      {/* Simple pixel cloud shape */}
      <div className="relative">
        <div className="flex space-x-px">
          <div className="w-2 h-2 bg-gray-300/40"></div>
          <div className="w-2 h-2 bg-gray-300/60"></div>
          <div className="w-2 h-2 bg-gray-300/60"></div>
          <div className="w-2 h-2 bg-gray-300/40"></div>
        </div>
        <div className="flex space-x-px -mt-px">
          <div className="w-2 h-2 bg-gray-300/60"></div>
          <div className="w-2 h-2 bg-gray-300/80"></div>
          <div className="w-2 h-2 bg-gray-300/80"></div>
          <div className="w-2 h-2 bg-gray-300/80"></div>
          <div className="w-2 h-2 bg-gray-300/60"></div>
        </div>
      </div>
    </div>
  );
}

interface PixelIconProps {
  type: 'heart' | 'star' | 'tree' | 'mountain';
  className?: string;
}

export function PixelIcon({ type, className = '' }: PixelIconProps) {
  const patterns = {
    heart: [
      [0, 1, 1, 0, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
    ],
    star: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [1, 0, 1, 0, 1],
    ],
    tree: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ],
    mountain: [
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 1, 1, 0, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1],
    ],
  };

  const pattern = patterns[type];

  return (
    <div className={`inline-grid gap-px ${className}`}>
      {pattern.map((row, i) => (
        <div key={i} className="flex gap-px">
          {row.map((pixel, j) => (
            <div
              key={j}
              className={`w-1.5 h-1.5 ${pixel ? 'bg-current' : 'bg-transparent'}`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}
