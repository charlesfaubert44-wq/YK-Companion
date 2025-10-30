'use client';

import { Menu, Bell } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import { hapticFeedback } from '@/lib/mobile';
import { useBannerSettings } from '@/lib/banners/useBannerSettings';

interface MobileHeaderProps {
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
  onMenuClick: () => void;
}

export default function MobileHeader({ theme, onMenuClick }: MobileHeaderProps) {
  const { weather, loading } = useWeather({ refreshInterval: 600000, enableFallback: true });
  const { currentTheme } = useBannerSettings();

  const handleMenuClick = () => {
    hapticFeedback();
    onMenuClick();
  };

  const getSeasonalEmoji = () => {
    const emojiMap: Record<string, string> = {
      winter: '❄️',
      spring: '🌸',
      summer: '☀️',
      fall: '🍂',
      halloween: '🎃',
      remembrance: '🌺',
      christmas: '🎄',
      newYear: '🎆',
      canadaDay: '🍁',
      indigenousPeoples: '🪶',
      easter: '🐰',
    };
    return emojiMap[currentTheme] || '✨';
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 safe-top z-50 backdrop-blur-xl border-b"
        style={{
          backgroundColor: 'rgba(10, 14, 26, 0.9)',
          borderBottomColor: `${theme.primary}40`,
        }}
      >
        <div className="flex items-center justify-between h-16 px-4">
          {/* Menu Button */}
          <button
            onClick={handleMenuClick}
            className="touch-feedback p-2 -ml-2 rounded-lg transition-all active:scale-90"
            aria-label="Open menu"
          >
            <Menu
              size={24}
              style={{
                color: theme.primary,
                filter: `drop-shadow(0 0 8px ${theme.glow})`,
              }}
            />
          </button>

          {/* Logo/Brand with seasonal emoji */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl" aria-hidden="true">
              {getSeasonalEmoji()}
            </span>
            <div className="flex flex-col">
              <h1
                className="text-lg font-bold leading-tight"
                style={{
                  color: theme.primary,
                  textShadow: `0 0 12px ${theme.glow}`,
                }}
              >
                YK Buddy
              </h1>
              {!loading && weather && (
                <span
                  className="text-xs font-medium"
                  style={{ color: theme.secondary }}
                >
                  {Math.round(weather.temp)}°C
                </span>
              )}
            </div>
          </div>

          {/* Notifications Button */}
          <button
            className="touch-feedback p-2 -mr-2 rounded-lg transition-all active:scale-90 relative"
            aria-label="Notifications"
          >
            <Bell
              size={24}
              style={{
                color: theme.primary,
                filter: `drop-shadow(0 0 8px ${theme.glow})`,
              }}
            />
            {/* Notification badge */}
            <div
              className="absolute top-1 right-1 w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: theme.accent }}
            />
          </button>
        </div>

        {/* Animated aurora wave at bottom of header */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden"
          style={{
            background: `linear-gradient(90deg,
              transparent,
              ${theme.primary},
              ${theme.secondary},
              ${theme.accent},
              transparent
            )`,
            animation: 'aurora-wave 3s ease-in-out infinite',
            backgroundSize: '200% 100%',
          }}
        />

        {/* Subtle particles for header */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: '2px',
                height: '2px',
                backgroundColor: theme.accent,
                left: `${i * 20}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.4,
                animation: `twinkle ${2 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      </header>

      <style jsx>{`
        @keyframes aurora-wave {
          0%, 100% {
            background-position: 0% 0%;
            opacity: 0.6;
          }
          50% {
            background-position: 100% 0%;
            opacity: 1;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.5);
          }
        }

        .touch-feedback {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
      `}</style>
    </>
  );
}
