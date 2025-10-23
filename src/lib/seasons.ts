export type Season = 'winter' | 'spring' | 'summer' | 'fall';

export interface SeasonTheme {
  name: string;
  months: number[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  description: string;
  icon: string;
}

export const seasonThemes: Record<Season, SeasonTheme> = {
  winter: {
    name: 'Winter',
    months: [11, 12, 1, 2, 3], // November - March
    colors: {
      primary: '#38bdf8', // Ice blue
      secondary: '#818cf8', // Aurora purple-blue
      accent: '#c084fc', // Purple
      background: '#0c1929', // Deep frozen blue-black
      text: '#e0f2fe',
    },
    description: 'Frozen Aurora Season',
    icon: '❄️',
  },
  spring: {
    name: 'Spring',
    months: [4, 5], // April - May
    colors: {
      primary: '#60a5fa', // Bright blue
      secondary: '#34d399', // Fresh green
      accent: '#fbbf24', // Warm yellow
      background: '#1e293b', // Lighter dark
      text: '#f0f9ff',
    },
    description: 'Ice Breakup & Renewal',
    icon: '🌸',
  },
  summer: {
    name: 'Summer',
    months: [6, 7, 8], // June - August
    colors: {
      primary: '#22c55e', // Vibrant green
      secondary: '#fbbf24', // Midnight sun gold
      accent: '#f97316', // Warm orange
      background: '#1e3a2f', // Deep forest green
      text: '#fef3c7',
    },
    description: 'Midnight Sun',
    icon: '☀️',
  },
  fall: {
    name: 'Fall',
    months: [9, 10], // September - October
    colors: {
      primary: '#f59e0b', // Autumn gold
      secondary: '#ef4444', // Fall red
      accent: '#8b5cf6', // Purple
      background: '#1c1917', // Rich brown-black
      text: '#fef3c7',
    },
    description: 'Northern Lights Return',
    icon: '🍂',
  },
};

/**
 * Get the current season based on month
 */
export function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1; // 1-12

  for (const [season, theme] of Object.entries(seasonThemes)) {
    if (theme.months.includes(month)) {
      return season as Season;
    }
  }

  return 'winter'; // Default fallback
}

/**
 * Get season theme by season name
 */
export function getSeasonTheme(season: Season): SeasonTheme {
  return seasonThemes[season];
}

/**
 * Get the current season theme
 */
export function getCurrentSeasonTheme(): SeasonTheme {
  const season = getCurrentSeason();
  return getSeasonTheme(season);
}

/**
 * Get CSS variables for a season theme
 */
export function getSeasonCSSVariables(season: Season): Record<string, string> {
  const theme = getSeasonTheme(season);
  return {
    '--season-primary': theme.colors.primary,
    '--season-secondary': theme.colors.secondary,
    '--season-accent': theme.colors.accent,
    '--season-background': theme.colors.background,
    '--season-text': theme.colors.text,
  };
}
