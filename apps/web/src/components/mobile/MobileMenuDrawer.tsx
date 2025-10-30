'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Home,
  Compass,
  Map,
  Heart,
  Settings,
  LogOut,
  BookOpen,
  Calculator,
  Users,
  Share2,
} from 'lucide-react';
import { hapticFeedback, lockBodyScroll, unlockBodyScroll } from '@/lib/mobile';
import { useAuth } from '@/contexts/AuthContext';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
}

const MENU_SECTIONS = [
  {
    title: 'Main',
    items: [
      { id: 'home', label: 'Home', icon: Home, path: '/' },
      { id: 'discover', label: 'Discover', icon: Compass, path: '/discover' },
      { id: 'aurora', label: 'Aurora Forecast', icon: Share2, path: '/aurora' },
    ],
  },
  {
    title: 'Explore',
    items: [
      { id: 'visiting', label: 'Visiting', icon: Map, path: '/visiting' },
      { id: 'living', label: 'Living', icon: Home, path: '/living' },
      { id: 'moving', label: 'Moving', icon: Users, path: '/moving' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { id: 'calculator', label: 'Trip Calculator', icon: Calculator, path: '/calculator' },
      { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen, path: '/knowledge' },
      { id: 'saved', label: 'Saved Items', icon: Heart, path: '/saved' },
    ],
  },
];

export default function MobileMenuDrawer({ isOpen, onClose, theme }: MobileMenuDrawerProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (isOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }

    return () => unlockBodyScroll();
  }, [isOpen]);

  const handleNavClick = (path: string) => {
    hapticFeedback();
    router.push(path);
    onClose();
  };

  const handleLogout = async () => {
    hapticFeedback();
    await signOut();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
        style={{
          animation: 'fadeIn 0.2s ease-out',
        }}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] z-50 safe-left safe-top safe-bottom overflow-hidden"
        style={{
          animation: 'slideInLeft 0.3s ease-out',
          background: `linear-gradient(135deg, rgba(10, 14, 26, 0.98), rgba(21, 27, 46, 0.98))`,
          backdropFilter: 'blur(20px)',
          borderRight: `1px solid ${theme.primary}40`,
        }}
      >
        {/* Aurora glow effect */}
        <div
          className="absolute top-0 left-0 right-0 h-64 pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${theme.glow}, transparent)`,
            animation: 'aurora-pulse 4s ease-in-out infinite',
          }}
        />

        {/* Header */}
        <div className="relative p-6 border-b" style={{ borderBottomColor: `${theme.primary}40` }}>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2
                className="text-2xl font-bold"
                style={{
                  color: theme.primary,
                  textShadow: `0 0 12px ${theme.glow}`,
                }}
              >
                Menu
              </h2>
              {user && (
                <p className="text-sm text-gray-400 mt-1">
                  Welcome, {user.email?.split('@')[0] || 'Explorer'}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="touch-feedback p-2 rounded-lg transition-all active:scale-90"
              aria-label="Close menu"
            >
              <X
                size={24}
                style={{
                  color: theme.primary,
                  filter: `drop-shadow(0 0 8px ${theme.glow})`,
                }}
              />
            </button>
          </div>

          {/* Animated wave */}
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5"
            style={{
              background: `linear-gradient(90deg, transparent, ${theme.primary}, ${theme.secondary}, transparent)`,
              animation: 'aurora-wave 3s ease-in-out infinite',
              backgroundSize: '200% 100%',
            }}
          />
        </div>

        {/* Menu Items */}
        <div className="overflow-y-auto h-[calc(100vh-180px)] pb-6">
          {MENU_SECTIONS.map((section, sectionIndex) => (
            <div key={section.title} className="mt-6">
              <h3
                className="px-6 mb-3 text-xs font-semibold uppercase tracking-wider"
                style={{ color: theme.secondary }}
              >
                {section.title}
              </h3>
              <div className="space-y-1 px-3">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.path)}
                      className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg touch-feedback transition-all active:scale-95 group hover:bg-white/5"
                      style={{
                        animationDelay: `${sectionIndex * 50 + itemIndex * 30}ms`,
                        animation: 'slideInLeft 0.3s ease-out backwards',
                      }}
                    >
                      <div
                        className="p-2 rounded-lg transition-all group-hover:scale-110"
                        style={{
                          backgroundColor: `${theme.primary}20`,
                        }}
                      >
                        <Icon
                          size={20}
                          style={{
                            color: theme.primary,
                            filter: `drop-shadow(0 0 4px ${theme.glow})`,
                          }}
                        />
                      </div>
                      <span className="text-gray-200 font-medium group-hover:text-white transition-colors">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Settings Section */}
          <div className="mt-8 border-t pt-6" style={{ borderTopColor: `${theme.primary}40` }}>
            <div className="space-y-1 px-3">
              <button
                onClick={() => handleNavClick('/profile')}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg touch-feedback transition-all active:scale-95 group hover:bg-white/5"
              >
                <div
                  className="p-2 rounded-lg transition-all group-hover:scale-110"
                  style={{
                    backgroundColor: `${theme.primary}20`,
                  }}
                >
                  <Settings
                    size={20}
                    style={{
                      color: theme.primary,
                      filter: `drop-shadow(0 0 4px ${theme.glow})`,
                    }}
                  />
                </div>
                <span className="text-gray-200 font-medium group-hover:text-white transition-colors">
                  Settings
                </span>
              </button>

              {user && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg touch-feedback transition-all active:scale-95 group hover:bg-white/5"
                >
                  <div
                    className="p-2 rounded-lg transition-all group-hover:scale-110"
                    style={{
                      backgroundColor: `${theme.accent}20`,
                    }}
                  >
                    <LogOut
                      size={20}
                      style={{
                        color: theme.accent,
                      }}
                    />
                  </div>
                  <span className="text-gray-200 font-medium group-hover:text-white transition-colors">
                    Log Out
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Decorative particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: '2px',
                height: '2px',
                backgroundColor: theme.accent,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.3,
                animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes aurora-pulse {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        @keyframes aurora-wave {
          0%,
          100% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 0%;
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.6;
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
