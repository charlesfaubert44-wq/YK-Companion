'use client';

import { Season } from '@/lib/seasons';
import { Snowflake, Leaf, Sun, Sparkles } from 'lucide-react';

interface SeasonSelectorProps {
  currentSeason: Season;
  onSeasonChange: (season: Season) => void;
}

export default function SeasonSelector({ currentSeason, onSeasonChange }: SeasonSelectorProps) {
  const seasons: Array<{ value: Season; label: string; icon: React.ReactNode; emoji: string }> = [
    { value: 'winter', label: 'Winter', icon: <Snowflake className="w-4 h-4" />, emoji: '❄️' },
    { value: 'spring', label: 'Spring', icon: <Sparkles className="w-4 h-4" />, emoji: '🌸' },
    { value: 'summer', label: 'Summer', icon: <Sun className="w-4 h-4" />, emoji: '☀️' },
    { value: 'fall', label: 'Fall', icon: <Leaf className="w-4 h-4" />, emoji: '🍂' },
  ];

  const getSeasonColor = (season: Season) => {
    switch (season) {
      case 'winter':
        return 'from-blue-400 to-indigo-500';
      case 'spring':
        return 'from-sky-400 to-emerald-400';
      case 'summer':
        return 'from-amber-400 to-orange-500';
      case 'fall':
        return 'from-orange-500 to-red-500';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-yk-dark-900/95 backdrop-blur-lg border-2 border-white/10 rounded-xl p-3 shadow-2xl">
        <p className="text-xs text-gray-400 mb-2 text-center font-semibold">Season Theme</p>
        <div className="grid grid-cols-2 gap-2">
          {seasons.map((season) => (
            <button
              key={season.value}
              onClick={() => onSeasonChange(season.value)}
              className={`
                relative group px-3 py-2 rounded-lg transition-all duration-300
                ${
                  currentSeason === season.value
                    ? `bg-gradient-to-br ${getSeasonColor(season.value)} text-white shadow-lg scale-105`
                    : 'bg-yk-dark-800/50 hover:bg-yk-dark-700/70 text-gray-300 hover:text-white'
                }
              `}
              title={`Switch to ${season.label}`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">{season.emoji}</span>
                <span className="text-[10px] font-semibold">{season.label}</span>
              </div>

              {/* Active indicator */}
              {currentSeason === season.value && (
                <div className="absolute inset-0 rounded-lg border-2 border-white/30 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
