'use client';

import { useState } from 'react';
import { useSeasonalTheme } from '@/contexts/SeasonalThemeContext';
import {  Snowflake, Sun, Leaf, Flame } from 'lucide-react';

/**
 * SeasonalThemeSwitcher - UI control for changing seasonal themes
 *
 * UltraThink Reasoning:
 * - Floating button accessible from any page
 * - Visual icons represent each season (snowflake, flower, sun, leaf)
 * - Smooth transitions between themes
 * - Compact design doesn't obstruct content
 * - Shows current season with highlight
 */
export default function SeasonalThemeSwitcher() {
  const { currentSeason, setSeason, allSeasons, theme } = useSeasonalTheme();
  const [isOpen, setIsOpen] = useState(false);

  const seasonIcons = {
    winter: <Snowflake className="w-5 h-5" />,
    spring: <Leaf className="w-5 h-5" />,
    summer: <Sun className="w-5 h-5" />,
    fall: <Flame className="w-5 h-5" />,
  };

  const seasonEmoji = {
    winter: '❄️',
    spring: '🌸',
    summer: '☀️',
    fall: '🍂',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Season Options (when open) */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-dark-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-3 mb-2 shadow-2xl animate-slideUp">
          <div className="flex flex-col gap-2">
            {allSeasons.map((season) => (
              <button
                key={season}
                onClick={() => {
                  setSeason(season);
                  setIsOpen(false);
                }}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  currentSeason === season
                    ? 'bg-gradient-to-r from-aurora-green/20 to-aurora-blue/20 text-white shadow-glow'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
                style={{
                  borderLeft: currentSeason === season ? `3px solid ${theme.colors.primary}` : 'none',
                }}
              >
                <span className="text-2xl group-hover:scale-125 transition-transform">
                  {seasonEmoji[season]}
                </span>
                <div className="text-left">
                  <div className="font-semibold capitalize">{season}</div>
                  <div className="text-xs text-gray-400">
                    {season === 'winter' && 'Cold & Aurora'}
                    {season === 'spring' && 'Fresh & Thaw'}
                    {season === 'summer' && 'Warm & Sun'}
                    {season === 'fall' && 'Colors & Earth'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-14 h-14 bg-gradient-to-br from-dark-900 to-dark-800 rounded-full shadow-aurora border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110 flex items-center justify-center"
        style={{
          boxShadow: theme.shadows.aurora,
        }}
        aria-label="Change seasonal theme"
      >
        {/* Rotating icon ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-aurora-green/20 via-aurora-blue/20 to-aurora-purple/20 animate-spin-slow opacity-50 group-hover:opacity-100 transition-opacity"></div>

        {/* Current season icon */}
        <span className="relative text-3xl group-hover:scale-110 transition-transform">
          {seasonEmoji[currentSeason]}
        </span>

        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple opacity-0 group-hover:opacity-20 transition-opacity animate-pulse"></div>
      </button>

      {/* Label hint */}
      {!isOpen && (
        <div className="absolute bottom-0 right-16 bg-dark-900/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs text-gray-300 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          Change Season
        </div>
      )}

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
