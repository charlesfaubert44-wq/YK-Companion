'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useBannerSettings } from '@/lib/banners/useBannerSettings';
import MobileBottomNav from './MobileBottomNav';
import MobileHeader from './MobileHeader';
import MobileMenuDrawer from './MobileMenuDrawer';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface MobileAppWrapperProps {
  children: ReactNode;
  showHeader?: boolean;
  showBottomNav?: boolean;
}

// Seasonal theme configurations matching the banner themes
const SEASONAL_THEMES = {
  winter: {
    primary: '#4d94ff',
    secondary: '#a366ff',
    accent: '#00ff88',
    background: 'from-indigo-950 via-slate-900 to-slate-950',
    glow: 'rgba(77, 148, 255, 0.3)',
  },
  spring: {
    primary: '#00ff88',
    secondary: '#4d94ff',
    accent: '#87ceeb',
    background: 'from-emerald-900 via-teal-900 to-cyan-950',
    glow: 'rgba(0, 255, 136, 0.3)',
  },
  summer: {
    primary: '#ffa500',
    secondary: '#FFD700',
    accent: '#ff66cc',
    background: 'from-amber-900 via-orange-900 to-rose-950',
    glow: 'rgba(255, 165, 0, 0.3)',
  },
  fall: {
    primary: '#ff6b35',
    secondary: '#ffa500',
    accent: '#FFD700',
    background: 'from-orange-950 via-amber-950 to-yellow-950',
    glow: 'rgba(255, 107, 53, 0.3)',
  },
  halloween: {
    primary: '#ff6b35',
    secondary: '#a366ff',
    accent: '#ffa500',
    background: 'from-purple-950 via-orange-950 to-black',
    glow: 'rgba(163, 102, 255, 0.4)',
  },
  remembrance: {
    primary: '#dc2626',
    secondary: '#7f1d1d',
    accent: '#fca5a5',
    background: 'from-gray-900 via-slate-900 to-neutral-950',
    glow: 'rgba(220, 38, 38, 0.3)',
  },
  christmas: {
    primary: '#dc2626',
    secondary: '#059669',
    accent: '#FFD700',
    background: 'from-red-950 via-green-950 to-emerald-950',
    glow: 'rgba(220, 38, 38, 0.3)',
  },
  newYear: {
    primary: '#a366ff',
    secondary: '#4d94ff',
    accent: '#FFD700',
    background: 'from-purple-950 via-indigo-950 to-blue-950',
    glow: 'rgba(163, 102, 255, 0.4)',
  },
  canadaDay: {
    primary: '#dc2626',
    secondary: '#f8f8f8',
    accent: '#dc2626',
    background: 'from-red-950 via-white/10 to-red-950',
    glow: 'rgba(220, 38, 38, 0.3)',
  },
  indigenousPeoples: {
    primary: '#fbbf24',
    secondary: '#dc2626',
    accent: '#059669',
    background: 'from-amber-950 via-yellow-950 to-orange-950',
    glow: 'rgba(251, 191, 36, 0.3)',
  },
  easter: {
    primary: '#ff66cc',
    secondary: '#a366ff',
    accent: '#fbbf24',
    background: 'from-pink-950 via-purple-950 to-violet-950',
    glow: 'rgba(255, 102, 204, 0.3)',
  },
};

export default function MobileAppWrapper({
  children,
  showHeader = true,
  showBottomNav = true,
}: MobileAppWrapperProps) {
  const isMobile = useIsMobile();
  const { currentTheme } = useBannerSettings();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const theme = SEASONAL_THEMES[currentTheme] || SEASONAL_THEMES.winter;

  // Handle page transitions
  useEffect(() => {
    // Determine slide direction based on route hierarchy
    const routeDepth = pathname.split('/').length;
    setDirection(routeDepth > 2 ? 'right' : 'left');
  }, [pathname]);

  // Don't wrap if not mobile
  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="mobile-app-container min-h-screen flex flex-col overflow-hidden">
      {/* Seasonal gradient background */}
      <div
        className={`fixed inset-0 bg-gradient-to-b ${theme.background} -z-10`}
        style={{
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Aurora glow effect overlay */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${theme.glow}, transparent 70%)`,
          animation: 'aurora-pulse 8s ease-in-out infinite',
        }}
      />

      {/* Animated stars/particles */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/40"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      {showHeader && (
        <MobileHeader
          theme={theme}
          onMenuClick={() => setMenuOpen(true)}
        />
      )}

      {/* Main content with safe area insets */}
      <main
        className={`flex-1 overflow-y-auto overflow-x-hidden safe-bottom ${
          showBottomNav ? 'pb-20' : 'pb-4'
        } ${showHeader ? 'pt-16' : 'pt-0'}`}
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
        }}
      >
        {/* Page transition wrapper */}
        <div
          className={`page-slide-${direction}`}
          key={pathname}
          style={{
            animation: `slide-${direction} 0.3s ease-out`,
          }}
        >
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && <MobileBottomNav theme={theme} />}

      {/* Menu Drawer */}
      <MobileMenuDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        theme={theme}
      />

      {/* Global styles for mobile animations */}
      <style jsx global>{`
        @keyframes aurora-pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        @keyframes slide-right {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-left {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .page-slide-right,
        .page-slide-left {
          will-change: transform, opacity;
        }

        /* Prevent overscroll bounce */
        .mobile-app-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          touch-action: pan-y;
        }

        /* Smooth momentum scrolling */
        main {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
      `}</style>
    </div>
  );
}
