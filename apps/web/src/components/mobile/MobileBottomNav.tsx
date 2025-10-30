'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Compass, Calendar, User, Sparkles } from 'lucide-react';
import { hapticFeedback } from '@/lib/mobile';

interface MobileBottomNavProps {
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
}

const NAV_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    path: '/',
  },
  {
    id: 'discover',
    label: 'Discover',
    icon: Compass,
    path: '/discover',
  },
  {
    id: 'aurora',
    label: 'Aurora',
    icon: Sparkles,
    path: '/aurora',
  },
  {
    id: 'seasonal',
    label: 'Seasonal',
    icon: Calendar,
    path: '/seasonal',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    path: '/profile',
  },
];

export default function MobileBottomNav({ theme }: MobileBottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (path: string) => {
    hapticFeedback();
    router.push(path);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 safe-bottom z-40 backdrop-blur-xl border-t"
        style={{
          backgroundColor: 'rgba(10, 14, 26, 0.9)',
          borderTopColor: `${theme.primary}40`,
        }}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className="flex flex-col items-center justify-center flex-1 h-full relative touch-feedback transition-transform active:scale-90"
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                {/* Active indicator glow */}
                {active && (
                  <div
                    className="absolute inset-0 rounded-lg opacity-20"
                    style={{
                      background: `radial-gradient(circle, ${theme.primary}, transparent)`,
                    }}
                  />
                )}

                {/* Icon with seasonal color */}
                <div className="relative">
                  <Icon
                    size={24}
                    strokeWidth={active ? 2.5 : 2}
                    style={{
                      color: active ? theme.primary : '#9ca3af',
                      filter: active ? `drop-shadow(0 0 8px ${theme.glow})` : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  />

                  {/* Pulsing dot for aurora page when active */}
                  {active && item.id === 'aurora' && (
                    <div
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: theme.accent }}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className="text-[10px] mt-1 font-medium transition-all"
                  style={{
                    color: active ? theme.primary : '#9ca3af',
                    textShadow: active ? `0 0 8px ${theme.glow}` : 'none',
                  }}
                >
                  {item.label}
                </span>

                {/* Active underline */}
                {active && (
                  <div
                    className="absolute bottom-0 h-0.5 w-12 rounded-full"
                    style={{
                      backgroundColor: theme.primary,
                      boxShadow: `0 0 12px ${theme.glow}`,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Animated aurora wave at top of nav */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden"
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
      </nav>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes aurora-wave {
          0%,
          100% {
            background-position: 0% 0%;
            opacity: 0.5;
          }
          50% {
            background-position: 100% 0%;
            opacity: 1;
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
