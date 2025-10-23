'use client';

import { useState, useEffect } from 'react';
import { Season, getCurrentSeason, getSeasonTheme, SeasonTheme } from '@/lib/seasons';

export function useSeason() {
  const [season, setSeason] = useState<Season>('winter');
  const [theme, setTheme] = useState<SeasonTheme>(getSeasonTheme('winter'));

  useEffect(() => {
    // Check if user has manually selected a season
    const savedSeason = localStorage.getItem('yk-season') as Season | null;
    const currentSeason = savedSeason || getCurrentSeason();

    setSeason(currentSeason);
    setTheme(getSeasonTheme(currentSeason));
  }, []);

  const changeSeason = (newSeason: Season) => {
    setSeason(newSeason);
    setTheme(getSeasonTheme(newSeason));
    localStorage.setItem('yk-season', newSeason);
  };

  const resetToCurrentSeason = () => {
    const currentSeason = getCurrentSeason();
    setSeason(currentSeason);
    setTheme(getSeasonTheme(currentSeason));
    localStorage.removeItem('yk-season');
  };

  return {
    season,
    theme,
    changeSeason,
    resetToCurrentSeason,
    isManuallySet: localStorage.getItem('yk-season') !== null,
  };
}
