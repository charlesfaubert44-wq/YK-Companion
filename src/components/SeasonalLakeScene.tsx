'use client';

import { useState, useEffect } from 'react';
import { Waves, Snowflake, Sun, Wind } from 'lucide-react';
import { Season } from '@/lib/seasons';

interface SeasonalLakeSceneProps {
  season: Season;
}

export default function SeasonalLakeScene({ season }: SeasonalLakeSceneProps) {
  const [troutJumping, setTroutJumping] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [snowflakes, setSnowflakes] = useState<Array<{ x: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Random trout jumps (only in summer/spring when water is not frozen)
    if (season === 'summer' || season === 'spring') {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          setTroutJumping(true);
          setTimeout(() => setTroutJumping(false), 1500);
        }
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [season]);

  useEffect(() => {
    // Generate snowflakes for winter
    if (season === 'winter') {
      const flakes = Array.from({ length: 15 }, () => ({
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 5,
      }));
      setSnowflakes(flakes);
    }
  }, [season]);

  const handleLakeClick = () => {
    if (season === 'summer' || season === 'spring') {
      setTroutJumping(true);
      setClickCount((prev) => prev + 1);
      setTimeout(() => setTroutJumping(false), 1500);
    }
  };

  // Season-specific colors
  const seasonColors = {
    winter: {
      sky: 'from-slate-900 via-blue-950 to-indigo-900',
      lake: 'from-cyan-200/40 to-blue-300/50', // Frozen ice
      aurora: ['bg-blue-400/30', 'bg-indigo-400/30', 'bg-purple-400/30'],
      boat: 'from-blue-900 to-blue-950', // Covered in snow
    },
    spring: {
      sky: 'from-slate-800 via-sky-900 to-blue-900',
      lake: 'from-blue-600/50 to-blue-700/60', // Melting ice
      aurora: ['bg-sky-400/30', 'bg-emerald-400/30', 'bg-amber-400/20'],
      boat: 'from-amber-700 to-amber-800',
    },
    summer: {
      sky: 'from-amber-900 via-orange-900 to-yellow-900',
      lake: 'from-emerald-600/60 to-teal-700/70', // Vibrant water
      aurora: ['bg-amber-400/40', 'bg-yellow-400/30', 'bg-orange-400/30'], // Midnight sun glow
      boat: 'from-amber-700 to-amber-800',
    },
    fall: {
      sky: 'from-orange-950 via-red-950 to-purple-950',
      lake: 'from-blue-800/50 to-indigo-900/60',
      aurora: ['bg-orange-400/30', 'bg-red-400/30', 'bg-purple-400/30'],
      boat: 'from-orange-800 to-red-900',
    },
  };

  const colors = seasonColors[season];

  return (
    <div
      className="relative w-full h-64 md:h-80 overflow-hidden rounded-xl border-4 border-opacity-30 pixel-card cursor-pointer transition-all duration-1000"
      style={{
        borderColor:
          season === 'winter'
            ? '#38bdf8'
            : season === 'spring'
            ? '#60a5fa'
            : season === 'summer'
            ? '#fbbf24'
            : '#f59e0b',
      }}
      onClick={handleLakeClick}
    >
      {/* Sky with Aurora/Sun effect */}
      <div className={`absolute inset-0 bg-gradient-to-b ${colors.sky} transition-all duration-1000`}>
        <div className="absolute top-0 left-0 right-0 h-1/2 opacity-60">
          {/* Aurora or Midnight Sun */}
          {season === 'summer' ? (
            // Midnight Sun
            <div className="absolute top-8 right-1/4 w-24 h-24 bg-yellow-300/40 rounded-full blur-3xl animate-pulse">
              <Sun className="absolute inset-0 m-auto w-12 h-12 text-yellow-200/50" />
            </div>
          ) : (
            // Aurora
            <>
              <div className={`absolute top-4 left-1/4 w-32 h-16 ${colors.aurora[0]} blur-2xl animate-aurora`}></div>
              <div className={`absolute top-8 right-1/4 w-40 h-20 ${colors.aurora[1]} blur-2xl animate-aurora animation-delay-400`}></div>
              <div className={`absolute top-2 left-1/2 w-36 h-12 ${colors.aurora[2]} blur-2xl animate-aurora animation-delay-200`}></div>
            </>
          )}
        </div>
      </div>

      {/* Stars (not in summer) */}
      {season !== 'summer' && (
        <>
          <div className="absolute top-4 left-8 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-8 left-20 w-1 h-1 bg-white rounded-full animate-pulse animation-delay-200"></div>
          <div className="absolute top-6 right-16 w-1 h-1 bg-white rounded-full animate-pulse animation-delay-400"></div>
          <div className="absolute top-12 right-32 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        </>
      )}

      {/* Snowfall (winter only) */}
      {season === 'winter' &&
        snowflakes.map((flake, i) => (
          <div
            key={i}
            className="absolute top-0 animate-float"
            style={{
              left: `${flake.x}%`,
              animationDelay: `${flake.delay}s`,
              animationDuration: `${flake.duration}s`,
            }}
          >
            <Snowflake className="w-2 h-2 text-white/60" />
          </div>
        ))}

      {/* Falling Leaves (fall only) */}
      {season === 'fall' &&
        [0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute top-0 w-2 h-2 bg-gradient-to-br from-orange-500 to-red-600 rounded animate-float opacity-70"
            style={{
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: '8s',
            }}
          ></div>
        ))}

      {/* Lake / Ice */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-b ${colors.lake} transition-all duration-1000`}
      >
        {/* Winter: Ice cracks */}
        {season === 'winter' && (
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-32 h-0.5 bg-blue-100/30 rotate-12"></div>
            <div className="absolute top-1/3 right-1/3 w-24 h-0.5 bg-blue-100/30 -rotate-6"></div>
            <div className="absolute bottom-1/3 left-1/2 w-20 h-0.5 bg-blue-100/30 rotate-45"></div>
          </div>
        )}

        {/* Summer/Spring: Water Waves */}
        {(season === 'summer' || season === 'spring') && (
          <div className="absolute inset-0 opacity-30">
            <Waves className="absolute bottom-0 w-full h-12 text-white/40 animate-float" />
          </div>
        )}

        {/* Fall: Calmer waves */}
        {season === 'fall' && (
          <div className="absolute inset-0 opacity-20">
            <Wind className="absolute bottom-0 w-full h-12 text-white/30 animate-float" />
          </div>
        )}

        {/* Wave lines for pixel effect */}
        <div className="absolute bottom-0 left-0 right-0 space-y-1 pb-2">
          <div
            className="h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
            style={{ opacity: season === 'winter' ? 0.2 : 0.4 }}
          ></div>
          <div
            className="h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse animation-delay-200"
            style={{ opacity: season === 'winter' ? 0.15 : 0.3 }}
          ></div>
        </div>
      </div>

      {/* Houseboat */}
      <div className="absolute bottom-16 md:bottom-20 left-1/4 transform -translate-x-1/2 animate-float">
        <div className="relative">
          {/* Snow on roof (winter only) */}
          {season === 'winter' && (
            <div className="absolute -top-1 left-0 right-0 h-2 bg-white rounded-t-sm opacity-80"></div>
          )}

          {/* Roof */}
          <div
            className={`w-16 h-3 bg-gradient-to-b from-red-600 to-red-700 border-2 border-red-900 transform -skew-x-12 mb-[-2px] transition-all duration-1000`}
          ></div>

          {/* Main Cabin */}
          <div
            className={`w-16 h-10 bg-gradient-to-b ${colors.boat} border-2 border-gray-900 relative transition-all duration-1000`}
          >
            {/* Window with seasonal lighting */}
            <div
              className={`absolute top-2 left-2 w-4 h-4 border border-amber-900 transition-all duration-1000`}
              style={{
                backgroundColor:
                  season === 'winter'
                    ? 'rgba(251, 191, 36, 0.9)' // Warm glow in winter
                    : season === 'summer'
                    ? 'rgba(96, 165, 250, 0.6)' // Cool in summer
                    : 'rgba(251, 191, 36, 0.7)',
              }}
            ></div>
            <div
              className={`absolute top-2 right-2 w-4 h-4 border border-amber-900 transition-all duration-1000`}
              style={{
                backgroundColor:
                  season === 'winter'
                    ? 'rgba(251, 191, 36, 0.9)'
                    : season === 'summer'
                    ? 'rgba(96, 165, 250, 0.6)'
                    : 'rgba(251, 191, 36, 0.7)',
              }}
            ></div>

            {/* Extra window glow in winter */}
            {season === 'winter' && (
              <>
                <div className="absolute top-2 left-2 w-4 h-4 bg-yellow-300 blur-sm opacity-60"></div>
                <div className="absolute top-2 right-2 w-4 h-4 bg-yellow-300 blur-sm opacity-60"></div>
              </>
            )}
          </div>

          {/* Hull */}
          <div className="w-20 h-4 bg-gradient-to-b from-gray-600 to-gray-700 border-2 border-gray-800 rounded-b-lg -ml-2"></div>
        </div>
      </div>

      {/* Lake Trout - Jumping (summer/spring only) */}
      {(season === 'summer' || season === 'spring') && (
        <div
          className={`absolute bottom-12 right-1/3 transition-all duration-1000 ${
            troutJumping
              ? 'transform -translate-y-20 rotate-[-30deg] opacity-100'
              : 'transform translate-y-0 rotate-12 opacity-0'
          }`}
        >
          <div className="relative">
            <div className="w-12 h-6 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600 rounded-full border-2 border-teal-800">
              <div className="absolute top-1 left-2 w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
              <div className="absolute top-3 left-4 w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
              <div className="absolute top-2 left-6 w-1 h-1 bg-yellow-400 rounded-full"></div>
            </div>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-teal-600 border-2 border-teal-800 transform rotate-45"></div>
            {troutJumping && (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                <div className="w-8 h-1 bg-white/40 blur-sm"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Hint */}
      <div className="absolute bottom-2 right-2 text-xs text-white/50 pixel-font">
        {(season === 'summer' || season === 'spring') && (
          <>
            Click! {clickCount > 0 && `×${clickCount}`}
          </>
        )}
        {season === 'winter' && '❄️ Frozen'}
        {season === 'fall' && '🍂 Chilly'}
      </div>

      {/* Season Badge */}
      <div
        className="absolute top-2 left-2 backdrop-blur-sm px-3 py-1 rounded-full border transition-all duration-1000"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderColor:
            season === 'winter'
              ? '#38bdf8'
              : season === 'spring'
              ? '#60a5fa'
              : season === 'summer'
              ? '#fbbf24'
              : '#f59e0b',
        }}
      >
        <p
          className="text-xs font-semibold"
          style={{
            color:
              season === 'winter'
                ? '#7dd3fc'
                : season === 'spring'
                ? '#60a5fa'
                : season === 'summer'
                ? '#fde68a'
                : '#fcd34d',
          }}
        >
          Great Slave Lake
        </p>
      </div>
    </div>
  );
}
