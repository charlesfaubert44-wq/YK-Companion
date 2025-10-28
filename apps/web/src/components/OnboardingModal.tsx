'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPath?: (path: 'visiting' | 'living' | 'moving') => void;
}

/**
 * OnboardingModal - Elegant pathway selection with custom interactive CTAs
 */
export default function OnboardingModal({ isOpen, onClose, onSelectPath }: OnboardingModalProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSelectPath = (path: 'visiting' | 'living' | 'moving') => {
    setSelectedCard(path);
    setIsAnimatingOut(true);

    // Store preference in localStorage
    localStorage.setItem('yk_buddy_onboarded', 'true');
    localStorage.setItem('yk_buddy_preferred_path', path);

    if (onSelectPath) {
      onSelectPath(path);
    }

    setTimeout(() => {
      onClose();
      setIsAnimatingOut(false);
      window.location.href = `/${path}`;
    }, 600);
  };

  const handleSkip = () => {
    localStorage.setItem('yk_buddy_onboarded', 'true');
    setIsAnimatingOut(true);
    setTimeout(() => {
      onClose();
      setIsAnimatingOut(false);
    }, 400);
  };

  if (!isOpen) return null;

  const pathways = [
    {
      id: 'visiting',
      title: 'Visiting',
      subtitle: 'Explorer',
      description: 'Discover the magic of the North',
      gradient: 'from-emerald-400 via-teal-400 to-cyan-400',
      darkGradient: 'from-emerald-900 via-teal-900 to-cyan-900',
      solidBg: 'bg-gradient-to-br from-emerald-950 via-teal-950 to-cyan-950',
      borderColor: 'border-emerald-500/50',
      accentColor: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      icon: '🧭',
      bgPattern: 'compass',
      features: ['Trip Planning', 'Aurora Tours', 'Hidden Gems']
    },
    {
      id: 'living',
      title: 'Living',
      subtitle: 'Resident',
      description: 'Embrace life in Yellowknife',
      gradient: 'from-blue-400 via-indigo-400 to-violet-400',
      darkGradient: 'from-blue-900 via-indigo-900 to-violet-900',
      solidBg: 'bg-gradient-to-br from-blue-950 via-indigo-950 to-violet-950',
      borderColor: 'border-blue-500/50',
      accentColor: 'bg-blue-500',
      textColor: 'text-blue-400',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      icon: '🏔️',
      bgPattern: 'mountain',
      features: ['Local Events', 'Community', 'Activities']
    },
    {
      id: 'moving',
      title: 'Moving',
      subtitle: 'New Arrival',
      description: 'Start your Northern journey',
      gradient: 'from-purple-400 via-fuchsia-400 to-pink-400',
      darkGradient: 'from-purple-900 via-fuchsia-900 to-pink-900',
      solidBg: 'bg-gradient-to-br from-purple-950 via-fuchsia-950 to-pink-950',
      borderColor: 'border-purple-500/50',
      accentColor: 'bg-purple-500',
      textColor: 'text-purple-400',
      glowColor: 'rgba(168, 85, 247, 0.4)',
      icon: '🎒',
      bgPattern: 'path',
      features: ['Housing', 'Jobs', 'Essentials']
    }
  ];

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-500 ${
        isAnimatingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-northern-midnight/95 backdrop-blur-xl transition-all duration-500 ${
          isAnimatingOut ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleSkip}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-aurora-green/10 via-aurora-blue/10 to-aurora-purple/10 animate-aurora" />
      </div>

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-7xl max-h-[90vh] overflow-y-auto transition-all duration-700 ${
          isAnimatingOut
            ? 'scale-95 opacity-0 translate-y-8'
            : 'scale-100 opacity-100 translate-y-0'
        }`}
      >
        <div className="bg-gradient-to-br from-dark-900/95 via-dark-800/95 to-dark-900/95 backdrop-blur-2xl border-2 border-aurora-blue/30 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-aurora-green via-aurora-blue to-aurora-purple mb-6 relative">
              <span className="text-5xl animate-float">✨</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-aurora-green via-aurora-blue to-aurora-purple opacity-50 blur-2xl animate-pulse-slow"></div>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-aurora-green via-aurora-blue to-white bg-clip-text text-transparent">
              Choose Your Path
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Select the experience that matches your journey
            </p>
          </div>

          {/* Elegant Interactive CTA Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {pathways.map((pathway, index) => (
              <button
                key={pathway.id}
                onClick={() => handleSelectPath(pathway.id as 'visiting' | 'living' | 'moving')}
                onMouseEnter={() => setHoveredCard(pathway.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative overflow-hidden rounded-3xl transition-all duration-500 transform ${
                  hoveredCard === pathway.id ? 'scale-105 -translate-y-2' : 'scale-100'
                } ${
                  isAnimatingOut && selectedCard === pathway.id
                    ? 'scale-110 opacity-100 z-50'
                    : isAnimatingOut
                    ? 'scale-95 opacity-0'
                    : 'opacity-100'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                {/* Card Background - Solid Dark Theme with Border */}
                <div
                  className={`relative h-[420px] sm:h-[460px] ${pathway.solidBg} border-2 ${pathway.borderColor} rounded-3xl overflow-hidden transition-all duration-500 ${
                    hoveredCard === pathway.id ? 'border-opacity-100' : 'border-opacity-50'
                  }`}
                  style={{
                    animation: `subtle-glow-${index} 3s ease-in-out infinite`,
                    animationDelay: `${index * 0.5}s`
                  }}
                >
                  <div className="relative h-full rounded-3xl overflow-hidden">

                    {/* Subtle Background Pattern - Simplified */}
                    <div className="absolute inset-0 opacity-5">
                      {pathway.bgPattern === 'compass' && (
                        <svg className="w-full h-full" viewBox="0 0 200 200">
                          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" fill="none" className={pathway.textColor} />
                          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1" fill="none" className={pathway.textColor} />
                          <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="2" className={pathway.textColor} />
                          <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="2" className={pathway.textColor} />
                        </svg>
                      )}
                      {pathway.bgPattern === 'mountain' && (
                        <svg className="w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="none">
                          <path d="M0,150 L40,100 L70,120 L100,60 L130,90 L160,70 L200,110 L200,200 L0,200 Z" fill="currentColor" className={pathway.textColor} opacity="0.5" />
                          <path d="M0,170 L50,130 L80,145 L120,100 L150,120 L180,105 L200,130 L200,200 L0,200 Z" fill="currentColor" className={pathway.textColor} opacity="0.3" />
                        </svg>
                      )}
                      {pathway.bgPattern === 'path' && (
                        <svg className="w-full h-full" viewBox="0 0 200 200">
                          <path d="M20,180 Q50,150 80,160 T140,140 T180,150" stroke="currentColor" strokeWidth="3" fill="none" className={pathway.textColor} strokeDasharray="5,5" />
                          <path d="M30,160 Q60,130 90,140 T150,120 T190,130" stroke="currentColor" strokeWidth="3" fill="none" className={pathway.textColor} strokeDasharray="5,5" />
                        </svg>
                      )}
                    </div>

                    {/* Subtle Hover Overlay */}
                    <div
                      className={`absolute inset-0 bg-white transition-opacity duration-500 ${
                        hoveredCard === pathway.id ? 'opacity-5' : 'opacity-0'
                      }`}
                    />

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between p-8">

                      {/* Top Section - Icon */}
                      <div className="flex justify-center">
                        <div
                          className={`w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-sm border-2 ${pathway.borderColor} flex items-center justify-center shadow-xl transform transition-all duration-500 ${
                            hoveredCard === pathway.id ? 'scale-110 bg-white/20' : 'scale-100'
                          }`}
                        >
                          <span className="text-6xl">{pathway.icon}</span>
                        </div>
                      </div>

                      {/* Middle Section - Text */}
                      <div className="text-center space-y-4">
                        <div className={`inline-block px-5 py-2 rounded-full ${pathway.accentColor} text-white text-xs font-bold uppercase tracking-wider shadow-lg`}>
                          {pathway.subtitle}
                        </div>
                        <h3 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                          {pathway.title}
                        </h3>
                        <p className="text-gray-300 text-base leading-relaxed">
                          {pathway.description}
                        </p>
                      </div>

                      {/* Bottom Section - Features & CTA */}
                      <div className="space-y-5">
                        {/* Features */}
                        <div className="flex justify-center gap-2 flex-wrap">
                          {pathway.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className={`px-4 py-2 bg-white/10 border ${pathway.borderColor} rounded-lg text-sm text-white font-medium backdrop-blur-sm`}
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* CTA Button */}
                        <div className={`h-14 rounded-xl ${pathway.accentColor} flex items-center justify-center font-bold text-white text-lg transition-all duration-300 shadow-xl ${
                          hoveredCard === pathway.id ? 'scale-105 shadow-2xl' : 'scale-100'
                        }`}>
                          <span className="mr-2">Start Exploring</span>
                          <span className={`text-2xl transition-transform duration-300 ${hoveredCard === pathway.id ? 'translate-x-2' : ''}`}>→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle Outer Glow - On Hover */}
                <div
                  className={`absolute -inset-1 ${pathway.solidBg} rounded-3xl blur-2xl transition-opacity duration-500 -z-10 ${
                    hoveredCard === pathway.id ? 'opacity-50' : 'opacity-0'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Skip Button */}
          <div className="text-center">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors duration-300 underline decoration-gray-600 hover:decoration-gray-400"
            >
              Skip for now
            </button>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        @keyframes aurora {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 0.6;
            transform: translateY(-10px) scale(1.02);
          }
        }

        /* Subtle border glow animations */
        @keyframes subtle-glow-0 {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.1);
          }
        }

        @keyframes subtle-glow-1 {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.15);
          }
        }

        @keyframes subtle-glow-2 {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.08);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-aurora {
          animation: aurora 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
