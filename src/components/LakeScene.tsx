'use client';

import { useState, useEffect } from 'react';
import { Waves } from 'lucide-react';

export default function LakeScene() {
  const [troutJumping, setTroutJumping] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    // Random trout jumps
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setTroutJumping(true);
        setTimeout(() => setTroutJumping(false), 1500);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleLakeClick = () => {
    setTroutJumping(true);
    setClickCount((prev) => prev + 1);
    setTimeout(() => setTroutJumping(false), 1500);
  };

  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-xl border-4 border-yk-primary-500/30 pixel-card cursor-pointer"
         onClick={handleLakeClick}>
      {/* Sky with Aurora */}
      <div className="absolute inset-0 bg-gradient-to-b from-yk-dark-800 via-yk-dark-700 to-yk-primary-900/50">
        <div className="absolute top-0 left-0 right-0 h-1/2 opacity-60">
          <div className="absolute top-4 left-1/4 w-32 h-16 bg-yk-aurora-400/30 blur-2xl animate-aurora"></div>
          <div className="absolute top-8 right-1/4 w-40 h-20 bg-yk-primary-400/30 blur-2xl animate-aurora animation-delay-400"></div>
          <div className="absolute top-2 left-1/2 w-36 h-12 bg-yk-gold-400/20 blur-2xl animate-aurora animation-delay-200"></div>
        </div>
      </div>

      {/* Stars */}
      <div className="absolute top-4 left-8 w-1 h-1 bg-white rounded-full animate-pulse"></div>
      <div className="absolute top-8 left-20 w-1 h-1 bg-white rounded-full animate-pulse animation-delay-200"></div>
      <div className="absolute top-6 right-16 w-1 h-1 bg-white rounded-full animate-pulse animation-delay-400"></div>
      <div className="absolute top-12 right-32 w-1 h-1 bg-white rounded-full animate-pulse"></div>

      {/* Lake */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-b from-yk-primary-800/60 to-yk-primary-900/80">
        {/* Water Waves */}
        <div className="absolute inset-0 opacity-30">
          <Waves className="absolute bottom-0 w-full h-12 text-yk-primary-300 animate-float" />
        </div>

        {/* Wave lines for pixel effect */}
        <div className="absolute bottom-0 left-0 right-0 space-y-1 pb-2">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-yk-primary-400/40 to-transparent animate-pulse"></div>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-yk-primary-300/30 to-transparent animate-pulse animation-delay-200"></div>
        </div>
      </div>

      {/* Houseboat */}
      <div className="absolute bottom-16 md:bottom-20 left-1/4 transform -translate-x-1/2 animate-float">
        {/* Cabin */}
        <div className="relative">
          {/* Roof */}
          <div className="w-16 h-3 bg-gradient-to-b from-red-600 to-red-700 border-2 border-red-900 transform -skew-x-12 mb-[-2px]"></div>

          {/* Main Cabin */}
          <div className="w-16 h-10 bg-gradient-to-b from-amber-700 to-amber-800 border-2 border-amber-900 relative">
            {/* Window */}
            <div className="absolute top-2 left-2 w-4 h-4 bg-yk-gold-300/80 border border-amber-900"></div>
            <div className="absolute top-2 right-2 w-4 h-4 bg-yk-gold-300/80 border border-amber-900"></div>
            {/* Light glow from window */}
            <div className="absolute top-2 left-2 w-4 h-4 bg-yk-gold-300 blur-sm opacity-50"></div>
          </div>

          {/* Hull */}
          <div className="w-20 h-4 bg-gradient-to-b from-gray-600 to-gray-700 border-2 border-gray-800 rounded-b-lg -ml-2"></div>
        </div>
      </div>

      {/* Lake Trout - Jumping */}
      <div
        className={`absolute bottom-12 right-1/3 transition-all duration-1000 ${
          troutJumping
            ? 'transform -translate-y-20 rotate-[-30deg]'
            : 'transform translate-y-0 rotate-12 opacity-0'
        }`}
      >
        {/* Trout body */}
        <div className="relative">
          <div className="w-12 h-6 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600 rounded-full border-2 border-teal-800">
            {/* Spots */}
            <div className="absolute top-1 left-2 w-1.5 h-1.5 bg-yk-gold-400 rounded-full"></div>
            <div className="absolute top-3 left-4 w-1.5 h-1.5 bg-yk-gold-400 rounded-full"></div>
            <div className="absolute top-2 left-6 w-1 h-1 bg-yk-gold-400 rounded-full"></div>
          </div>
          {/* Tail */}
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-teal-600 border-2 border-teal-800 transform rotate-45"></div>
          {/* Splash effect */}
          {troutJumping && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
              <div className="w-8 h-1 bg-yk-primary-300/60 blur-sm"></div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Hint */}
      <div className="absolute bottom-2 right-2 text-xs text-yk-primary-300/60 pixel-font">
        Click! {clickCount > 0 && `×${clickCount}`}
      </div>

      {/* Info Badge */}
      <div className="absolute top-2 left-2 bg-yk-dark-900/80 backdrop-blur-sm px-3 py-1 rounded-full border border-yk-primary-500/30">
        <p className="text-xs text-yk-primary-300 font-semibold">Great Slave Lake</p>
      </div>
    </div>
  );
}
