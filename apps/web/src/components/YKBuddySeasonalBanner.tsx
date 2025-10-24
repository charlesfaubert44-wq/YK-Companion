'use client';

import { useState, useEffect } from 'react';
import { useBannerSettings } from '@/lib/banners/useBannerSettings';
import { BANNER_THEMES } from './banners/BannerThemes';

export default function YKBuddySeasonalBanner() {
  const { currentTheme } = useBannerSettings();
  const [temperature, setTemperature] = useState<number>(-30);

  // Set mock temperature based on current month
  useEffect(() => {
    const month = new Date().getMonth() + 1;
    if (month === 12 || month === 1 || month === 2 || month === 3) {
      setTemperature(-30 - Math.floor(Math.random() * 15)); // -30 to -45°C
    } else if (month === 4 || month === 5) {
      setTemperature(-5 + Math.floor(Math.random() * 15)); // -5 to +10°C
    } else if (month === 6 || month === 7 || month === 8) {
      setTemperature(15 + Math.floor(Math.random() * 12)); // +15 to +27°C
    } else {
      setTemperature(-5 + Math.floor(Math.random() * 15)); // -5 to +10°C
    }
  }, []);

  const BannerComponent = BANNER_THEMES[currentTheme];

  return <BannerComponent temperature={temperature} />;
}
