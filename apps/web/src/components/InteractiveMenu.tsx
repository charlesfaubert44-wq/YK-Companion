'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

interface InteractiveMenuProps {
  onAboutClick: () => void;
  onContactClick: () => void;
}

export default function InteractiveMenu({ onAboutClick, onContactClick }: InteractiveMenuProps) {
  const { t } = useLanguage();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems = [
    { key: 'home', label: t('home'), href: '/', color: 'emerald', icon: '🏠' },
    { key: 'about', label: t('about'), onClick: onAboutClick, color: 'cyan', icon: '💡' },
    { key: 'contact', label: t('contact'), onClick: onContactClick, color: 'purple', icon: '✉️' }
  ];

  return (
    <div className="flex justify-center px-4 py-6">
      <nav className="relative">
        {/* Aurora Glow Background - Animated */}
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div
            className="absolute inset-0 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15), rgba(34, 211, 238, 0.15), rgba(139, 92, 246, 0.15))',
            }}
          />
        </div>

        <div className="group flex items-center gap-2 bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-2xl px-6 py-4 hover:border-emerald-500/50 transition-all duration-500">
          {menuItems.map((item, index) => (
            <div key={item.key} className="flex items-center">
              {item.href ? (
                <Link href={item.href}>
                  <button
                    className="relative px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-110"
                    onMouseEnter={() => setHoveredItem(item.key)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                      color: hoveredItem === item.key ? '#ffffff' : '#94a3b8',
                    }}
                  >
                    {/* Gradient Background on Hover */}
                    {hoveredItem === item.key && (
                      <div
                        className="absolute inset-0 rounded-xl opacity-100 transition-opacity duration-300"
                        style={{
                          background:
                            item.color === 'emerald'
                              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(52, 211, 153, 0.2))'
                              : item.color === 'cyan'
                              ? 'linear-gradient(135deg, rgba(34, 211, 238, 0.3), rgba(59, 130, 246, 0.2))'
                              : 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(168, 85, 247, 0.2))',
                          boxShadow:
                            item.color === 'emerald'
                              ? '0 0 30px rgba(16, 185, 129, 0.4)'
                              : item.color === 'cyan'
                              ? '0 0 30px rgba(34, 211, 238, 0.4)'
                              : '0 0 30px rgba(139, 92, 246, 0.4)',
                        }}
                      />
                    )}

                    {/* Icon */}
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <span
                        className="text-lg transition-transform duration-300"
                        style={{
                          transform: hoveredItem === item.key ? 'scale(1.3) rotate(12deg)' : 'scale(1)',
                        }}
                      >
                        {item.icon}
                      </span>
                      <span className="font-semibold">{item.label}</span>
                    </span>

                    {/* Shimmer Effect */}
                    {hoveredItem === item.key && (
                      <div
                        className="absolute inset-0 rounded-xl overflow-hidden"
                        style={{
                          background:
                            'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                          animation: 'shimmer 1.5s infinite',
                        }}
                      />
                    )}
                  </button>
                </Link>
              ) : (
                <button
                  onClick={item.onClick}
                  className="relative px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-110"
                  onMouseEnter={() => setHoveredItem(item.key)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    color: hoveredItem === item.key ? '#ffffff' : '#94a3b8',
                  }}
                >
                  {/* Gradient Background on Hover */}
                  {hoveredItem === item.key && (
                    <div
                      className="absolute inset-0 rounded-xl opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          item.color === 'emerald'
                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(52, 211, 153, 0.2))'
                            : item.color === 'cyan'
                            ? 'linear-gradient(135deg, rgba(34, 211, 238, 0.3), rgba(59, 130, 246, 0.2))'
                            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(168, 85, 247, 0.2))',
                        boxShadow:
                          item.color === 'emerald'
                            ? '0 0 30px rgba(16, 185, 129, 0.4)'
                            : item.color === 'cyan'
                            ? '0 0 30px rgba(34, 211, 238, 0.4)'
                            : '0 0 30px rgba(139, 92, 246, 0.4)',
                      }}
                    />
                  )}

                  {/* Icon */}
                  <span className="relative z-10 inline-flex items-center gap-2">
                    <span
                      className="text-lg transition-transform duration-300"
                      style={{
                        transform: hoveredItem === item.key ? 'scale(1.3) rotate(12deg)' : 'scale(1)',
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className="font-semibold">{item.label}</span>
                  </span>

                  {/* Shimmer Effect */}
                  {hoveredItem === item.key && (
                    <div
                      className="absolute inset-0 rounded-xl overflow-hidden"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        animation: 'shimmer 1.5s infinite',
                      }}
                    />
                  )}
                </button>
              )}

              {/* Separator - Aurora themed */}
              {index < menuItems.length - 1 && (
                <div className="mx-2 w-px h-8 bg-gradient-to-b from-transparent via-slate-600 to-transparent opacity-50" />
              )}
            </div>
          ))}

          {/* Floating Particles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-1000"
              style={{
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                left: `${10 + Math.random() * 80}%`,
                top: `${-5 + Math.random() * 10}%`,
                background:
                  i % 3 === 0
                    ? 'rgba(16, 185, 129, 0.8)'
                    : i % 3 === 1
                    ? 'rgba(34, 211, 238, 0.8)'
                    : 'rgba(139, 92, 246, 0.8)',
                boxShadow: `0 0 8px ${
                  i % 3 === 0
                    ? 'rgba(16, 185, 129, 0.6)'
                    : i % 3 === 1
                    ? 'rgba(34, 211, 238, 0.6)'
                    : 'rgba(139, 92, 246, 0.6)'
                }`,
                animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}</style>
      </nav>
    </div>
  );
}
