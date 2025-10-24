'use client';

import { useState, useEffect } from 'react';
import { getCurrentHolidayTheme } from '../holidays/nwt-holidays';
import { BannerTheme } from '@/components/banners/BannerThemes';

interface BannerSettings {
  activeTheme: BannerTheme | 'auto';
  autoDetect: boolean;
}

const DEFAULT_SETTINGS: BannerSettings = {
  activeTheme: 'winter',
  autoDetect: false,
};

export function useBannerSettings() {
  const [settings, setSettings] = useState<BannerSettings>(DEFAULT_SETTINGS);
  const [currentTheme, setCurrentTheme] = useState<BannerTheme>('winter');

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yk-buddy-banner-settings');
      if (saved) {
        try {
          setSettings(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse banner settings:', e);
        }
      }
    }
  }, []);

  // Determine which theme to display
  useEffect(() => {
    if (settings.activeTheme === 'auto' || settings.autoDetect) {
      // Auto-detect based on season and holidays
      const holidayTheme = getCurrentHolidayTheme();

      if (holidayTheme) {
        setCurrentTheme(holidayTheme);
      } else {
        // Fall back to season
        const month = new Date().getMonth() + 1;
        if (month === 12 || month === 1 || month === 2 || month === 3) {
          setCurrentTheme('winter');
        } else if (month === 4 || month === 5) {
          setCurrentTheme('spring');
        } else if (month === 6 || month === 7 || month === 8) {
          setCurrentTheme('summer');
        } else {
          setCurrentTheme('fall');
        }
      }
    } else {
      // Use manually selected theme
      setCurrentTheme(settings.activeTheme);
    }
  }, [settings]);

  // Save settings
  const updateSettings = (newSettings: Partial<BannerSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('yk-buddy-banner-settings', JSON.stringify(updated));
    }
  };

  const setActiveTheme = (theme: BannerTheme | 'auto') => {
    updateSettings({ activeTheme: theme, autoDetect: theme === 'auto' });
  };

  const toggleAutoDetect = () => {
    updateSettings({ autoDetect: !settings.autoDetect });
  };

  return {
    currentTheme,
    settings,
    setActiveTheme,
    toggleAutoDetect,
  };
}
