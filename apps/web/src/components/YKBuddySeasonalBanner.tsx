'use client';

import { useBannerSettings } from '@/lib/banners/useBannerSettings';
import { BANNER_THEMES } from './banners/BannerThemes';
import { useWeather } from '@/hooks/useWeather';

export default function YKBuddySeasonalBanner() {
  const { currentTheme } = useBannerSettings();
  const { weather, loading } = useWeather({ refreshInterval: 600000, enableFallback: true });

  const BannerComponent = BANNER_THEMES[currentTheme];

  // Always pass weather data (will be fallback data if API fails)
  return <BannerComponent temperature={weather?.temp || -28} weather={weather} />;
}
