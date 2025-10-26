'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Seasonal Theme System
 *
 * UltraThink Reasoning:
 * - Northern seasons have distinct visual identities
 * - Each season has unique color palette reflecting natural environment
 * - Themes affect gradients, shadows, and accent colors throughout app
 * - Persisted in localStorage for user preference
 * - Context API for global state access
 */

export type SeasonType = 'winter' | 'spring' | 'summer' | 'fall';

interface SeasonalTheme {
  id: SeasonType;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
  gradients: {
    background: string;
    aurora: string;
    card: string;
  };
  shadows: {
    glow: string;
    aurora: string;
  };
}

const themes: Record<SeasonType, SeasonalTheme> = {
  winter: {
    id: 'winter',
    name: 'Winter Aurora',
    description: 'Cold blues and purples like northern lights over ice',
    colors: {
      primary: '#4d94ff',    // Aurora blue
      secondary: '#a366ff',  // Aurora purple
      accent: '#00ff88',     // Aurora green
      glow: '#e0f2ff',       // Ice white
    },
    gradients: {
      background: 'linear-gradient(to bottom, #0a1128 0%, #1a2844 50%, #0a1128 100%)',
      aurora: 'linear-gradient(135deg, #4d94ff 0%, #a366ff 50%, #00ff88 100%)',
      card: 'linear-gradient(to-br, rgba(77, 148, 255, 0.1), rgba(163, 102, 255, 0.1))',
    },
    shadows: {
      glow: '0 0 20px rgba(77, 148, 255, 0.4)',
      aurora: '0 0 30px rgba(77, 148, 255, 0.5), 0 0 60px rgba(163, 102, 255, 0.3)',
    },
  },
  spring: {
    id: 'spring',
    name: 'Spring Thaw',
    description: 'Fresh greens and soft blues as ice melts',
    colors: {
      primary: '#00e68a',    // Fresh green
      secondary: '#4d94ff',  // Melt water blue
      accent: '#ffeb3b',     // Spring sun
      glow: '#b3ffe0',       // Light green
    },
    gradients: {
      background: 'linear-gradient(to bottom, #1a3d2e 0%, #0a1128 50%, #1a2844 100%)',
      aurora: 'linear-gradient(135deg, #00ff88 0%, #4d94ff 50%, #ffeb3b 100%)',
      card: 'linear-gradient(to-br, rgba(0, 230, 138, 0.1), rgba(77, 148, 255, 0.1))',
    },
    shadows: {
      glow: '0 0 20px rgba(0, 230, 138, 0.4)',
      aurora: '0 0 30px rgba(0, 255, 136, 0.5), 0 0 60px rgba(77, 148, 255, 0.3)',
    },
  },
  summer: {
    id: 'summer',
    name: 'Midnight Sun',
    description: 'Warm golds and oranges of 24-hour daylight',
    colors: {
      primary: '#ffa500',    // Sunset orange
      secondary: '#ffeb3b',  // Golden yellow
      accent: '#ff6600',     // Warm red
      glow: '#ffe0b3',       // Warm glow
    },
    gradients: {
      background: 'linear-gradient(to bottom, #1a2844 0%, #ffa500 50%, #ff6600 100%)',
      aurora: 'linear-gradient(135deg, #ffeb3b 0%, #ffa500 50%, #ff6600 100%)',
      card: 'linear-gradient(to-br, rgba(255, 165, 0, 0.15), rgba(255, 235, 59, 0.1))',
    },
    shadows: {
      glow: '0 0 20px rgba(255, 165, 0, 0.5)',
      aurora: '0 0 30px rgba(255, 165, 0, 0.6), 0 0 60px rgba(255, 102, 0, 0.4)',
    },
  },
  fall: {
    id: 'fall',
    name: 'Fall Colors',
    description: 'Deep oranges and reds as tundra changes',
    colors: {
      primary: '#ff6600',    // Fall orange
      secondary: '#8b4513',  // Earth brown
      accent: '#ffcc00',     // Golden aspens
      glow: '#ffb380',       // Warm amber
    },
    gradients: {
      background: 'linear-gradient(to bottom, #1a2844 0%, #8b4513 50%, #1a0f0a 100%)',
      aurora: 'linear-gradient(135deg, #ff6600 0%, #ffcc00 50%, #8b4513 100%)',
      card: 'linear-gradient(to-br, rgba(255, 102, 0, 0.15), rgba(139, 69, 19, 0.1))',
    },
    shadows: {
      glow: '0 0 20px rgba(255, 102, 0, 0.5)',
      aurora: '0 0 30px rgba(255, 102, 0, 0.6), 0 0 60px rgba(255, 204, 0, 0.4)',
    },
  },
};

interface SeasonalThemeContextType {
  currentSeason: SeasonType;
  theme: SeasonalTheme;
  setSeason: (season: SeasonType) => void;
  allSeasons: SeasonType[];
}

const SeasonalThemeContext = createContext<SeasonalThemeContextType | undefined>(undefined);

export function SeasonalThemeProvider({ children }: { children: ReactNode }) {
  const [currentSeason, setCurrentSeason] = useState<SeasonType>('winter');
  const [mounted, setMounted] = useState(false);

  // Load saved theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('yk-buddy-season');
    if (saved && (saved === 'winter' || saved === 'spring' || saved === 'summer' || saved === 'fall')) {
      setCurrentSeason(saved);
    } else {
      // Auto-detect season based on current month
      const month = new Date().getMonth();
      if (month >= 2 && month <= 4) setCurrentSeason('spring');
      else if (month >= 5 && month <= 7) setCurrentSeason('summer');
      else if (month >= 8 && month <= 10) setCurrentSeason('fall');
      else setCurrentSeason('winter');
    }
  }, []);

  const setSeason = (season: SeasonType) => {
    setCurrentSeason(season);
    localStorage.setItem('yk-buddy-season', season);

    // Apply theme CSS variables
    const root = document.documentElement;
    const theme = themes[season];
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-glow', theme.colors.glow);
    root.style.setProperty('--gradient-background', theme.gradients.background);
    root.style.setProperty('--gradient-aurora', theme.gradients.aurora);
    root.style.setProperty('--shadow-glow', theme.shadows.glow);
  };

  // Apply theme on mount and when it changes
  useEffect(() => {
    if (!mounted) return;
    setSeason(currentSeason);
  }, [currentSeason, mounted]);

  const value = {
    currentSeason,
    theme: themes[currentSeason],
    setSeason,
    allSeasons: ['winter', 'spring', 'summer', 'fall'] as SeasonType[],
  };

  return (
    <SeasonalThemeContext.Provider value={value}>
      {children}
    </SeasonalThemeContext.Provider>
  );
}

export function useSeasonalTheme() {
  const context = useContext(SeasonalThemeContext);
  if (context === undefined) {
    throw new Error('useSeasonalTheme must be used within a SeasonalThemeProvider');
  }
  return context;
}
