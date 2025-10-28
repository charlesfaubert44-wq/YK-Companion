'use client';

import { useBannerSettings } from '@/lib/banners/useBannerSettings';
import { BANNER_THEMES } from './banners/BannerThemes';
import { useWeather } from '@/hooks/useWeather';

export default function YKBuddySeasonalBanner() {
  const { currentTheme } = useBannerSettings();
  const { weather, loading } = useWeather({ refreshInterval: 600000, enableFallback: true });

  const BannerComponent = BANNER_THEMES[currentTheme];

  if (loading || !weather) {
    // Show banner with loading state
    return <BannerComponent temperature={-30} weather={null} />;
  }

  return <BannerComponent temperature={weather.temp} weather={weather} />;
}
