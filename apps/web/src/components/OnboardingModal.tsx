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
      darkGradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      glowColor: 'rgba(16, 185, 129, 0.6)',
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
      darkGradient: 'from-blue-600 via-indigo-600 to-violet-600',
      glowColor: 'rgba(59, 130, 246, 0.6)',
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
      darkGradient: 'from-purple-600 via-fuchsia-600 to-pink-600',
      glowColor: 'rgba(168, 85, 247, 0.6)',
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
                {/* Card Background with Gradient */}
                <div className={`relative h-[420px] sm:h-[460px] bg-gradient-to-br ${pathway.gradient} p-[2px] rounded-3xl`}>
                  <div className="relative h-full bg-dark-900 rounded-3xl overflow-hidden">

                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      {pathway.bgPattern === 'compass' && (
                        <svg className="w-full h-full" viewBox="0 0 200 200">
                          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" fill="none" className="text-emerald-400" />
                          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1" fill="none" className="text-emerald-400" />
                          <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="2" className="text-emerald-400" />
                          <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="2" className="text-emerald-400" />
                          <polygon points="100,30 95,50 105,50" fill="currentColor" className="text-emerald-500" />
                        </svg>
                      )}
                      {pathway.bgPattern === 'mountain' && (
                        <svg className="w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="none">
                          <path d="M0,150 L40,100 L70,120 L100,60 L130,90 L160,70 L200,110 L200,200 L0,200 Z" fill="currentColor" className="text-blue-400" opacity="0.3" />
                          <path d="M0,170 L50,130 L80,145 L120,100 L150,120 L180,105 L200,130 L200,200 L0,200 Z" fill="currentColor" className="text-blue-500" opacity="0.2" />
                        </svg>
                      )}
                      {pathway.bgPattern === 'path' && (
                        <svg className="w-full h-full" viewBox="0 0 200 200">
                          <path d="M20,180 Q50,150 80,160 T140,140 T180,150" stroke="currentColor" strokeWidth="3" fill="none" className="text-purple-400" strokeDasharray="5,5" />
                          <path d="M30,160 Q60,130 90,140 T150,120 T190,130" stroke="currentColor" strokeWidth="3" fill="none" className="text-purple-500" strokeDasharray="5,5" />
                          <circle cx="20" cy="180" r="4" fill="currentColor" className="text-purple-400" />
                          <circle cx="180" cy="150" r="4" fill="currentColor" className="text-purple-400" />
                        </svg>
                      )}
                    </div>

                    {/* Glow Effect on Hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${pathway.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                    />

                    {/* Floating Particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {hoveredCard === pathway.id && [...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${3 + Math.random() * 4}px`,
                            height: `${3 + Math.random() * 4}px`,
                            background: pathway.glowColor,
                            animation: `float-up ${2 + Math.random() * 2}s ease-in-out infinite`,
                            animationDelay: `${Math.random()}s`,
                            boxShadow: `0 0 10px ${pathway.glowColor}`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between p-8">

                      {/* Top Section - Icon */}
                      <div className="flex justify-center">
                        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${pathway.gradient} flex items-center justify-center shadow-lg transform transition-all duration-500 ${
                          hoveredCard === pathway.id ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
                        }`}>
                          <span className="text-5xl">{pathway.icon}</span>
                        </div>
                      </div>

                      {/* Middle Section - Text */}
                      <div className="text-center space-y-3">
                        <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${pathway.gradient} text-dark-900 text-xs font-bold uppercase tracking-wider`}>
                          {pathway.subtitle}
                        </div>
                        <h3 className={`text-3xl sm:text-4xl font-black bg-gradient-to-br ${pathway.gradient} bg-clip-text text-transparent`}>
                          {pathway.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {pathway.description}
                        </p>
                      </div>

                      {/* Bottom Section - Features & CTA */}
                      <div className="space-y-4">
                        {/* Features */}
                        <div className="flex justify-center gap-2 flex-wrap">
                          {pathway.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 backdrop-blur-sm"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* CTA Button */}
                        <div className={`h-12 rounded-xl bg-gradient-to-r ${pathway.gradient} flex items-center justify-center font-bold text-dark-900 text-lg transition-all duration-300 ${
                          hoveredCard === pathway.id ? 'shadow-2xl' : 'shadow-lg'
                        }`}
                        style={{
                          boxShadow: hoveredCard === pathway.id ? `0 10px 40px ${pathway.glowColor}` : 'none'
                        }}>
                          <span className="mr-2">Start Exploring</span>
                          <span className={`transition-transform duration-300 ${hoveredCard === pathway.id ? 'translate-x-1' : ''}`}>→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outer Glow Ring */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-br ${pathway.gradient} rounded-3xl opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500 -z-10`}
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

        @keyframes float-up {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(1);
            opacity: 0;
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
