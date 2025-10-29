'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BushPlaneIcon, NorthernCabinIcon, OldTruckIcon } from './NorthernIcons';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPath?: (path: 'visiting' | 'living' | 'moving') => void;
}

/**
 * OnboardingModal - Beautiful first-time visitor experience
 *
 * Shows 3 pathway cards to customize the user's journey:
 * - Visiting (Explorer)
 * - Living (Resident)
 * - Moving (New Arrival)
 */
export default function OnboardingModal({ isOpen, onClose, onSelectPath }: OnboardingModalProps) {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
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
      // Use Next.js router for navigation instead of window.location
      router.push(`/${path}`);
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
      description: 'Discover Yellowknife as a traveler',
      icon: <BushPlaneIcon className="w-20 h-20 sm:w-24 sm:h-24" />,
      gradient: 'from-emerald-500 via-cyan-500 to-blue-500',
      borderColor: 'border-emerald-500/40 hover:border-emerald-400/80',
      shadowColor: 'hover:shadow-[0_0_60px_rgba(16,185,129,0.6)]',
      bgGradient: 'from-emerald-500/20 via-cyan-500/10 to-transparent',
      emoji: '🧭',
      features: ['Trip Planning', 'Attractions', 'Aurora Tours']
    },
    {
      id: 'living',
      title: 'Living',
      subtitle: 'Resident',
      description: 'Explore your home city',
      icon: <NorthernCabinIcon className="w-20 h-20 sm:w-24 sm:h-24" />,
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      borderColor: 'border-blue-500/40 hover:border-blue-400/80',
      shadowColor: 'hover:shadow-[0_0_60px_rgba(59,130,246,0.6)]',
      bgGradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
      emoji: '🏔️',
      features: ['Local Events', 'Community', 'Hidden Gems']
    },
    {
      id: 'moving',
      title: 'Moving',
      subtitle: 'New Arrival',
      description: 'Get settled in Yellowknife',
      icon: <OldTruckIcon className="w-20 h-20 sm:w-24 sm:h-24" />,
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      borderColor: 'border-purple-500/40 hover:border-purple-400/80',
      shadowColor: 'hover:shadow-[0_0_60px_rgba(168,85,247,0.6)]',
      bgGradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
      emoji: '🎒',
      features: ['Housing', 'Jobs', 'Services']
    }
  ];

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-500 ${
        isAnimatingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Backdrop with aurora animation */}
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
        className={`relative w-full max-w-6xl max-h-[90vh] overflow-y-auto transition-all duration-700 ${
          isAnimatingOut
            ? 'scale-95 opacity-0 translate-y-8'
            : 'scale-100 opacity-100 translate-y-0'
        }`}
      >
        <div className="bg-gradient-to-br from-dark-900/95 via-dark-800/95 to-dark-900/95 backdrop-blur-2xl border-2 border-aurora-blue/30 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12">

          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-aurora-green via-aurora-blue to-aurora-purple mb-6 animate-pulse-slow">
              <span className="text-4xl sm:text-5xl">✨</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-aurora-green via-aurora-blue to-white bg-clip-text text-transparent">
              Welcome to YK Buddy!
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Choose your path to get a personalized experience tailored just for you
            </p>
          </div>

          {/* 3 Pathway Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
            {pathways.map((pathway, index) => (
              <Link
                key={pathway.id}
                href={`/${pathway.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectPath(pathway.id as 'visiting' | 'living' | 'moving');
                }}
                className={`group block transition-all duration-500 ${
                  isAnimatingOut && selectedCard === pathway.id
                    ? 'scale-110 opacity-100'
                    : isAnimatingOut
                    ? 'scale-95 opacity-0'
                    : 'scale-100 opacity-100'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className={`relative h-full min-h-[360px] sm:min-h-[400px] rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border-2 ${pathway.borderColor} transition-all duration-500 ${pathway.shadowColor} transform-gpu hover:scale-105 cursor-pointer`}>

                  {/* Animated gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${pathway.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                  {/* Falling snow particles */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full bg-white/60"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `-${Math.random() * 20}%`,
                          width: `${2 + Math.random() * 3}px`,
                          height: `${2 + Math.random() * 3}px`,
                          animation: `snow-fall ${8 + Math.random() * 6}s linear infinite`,
                          animationDelay: `${Math.random() * 5}s`,
                          opacity: 0.3 + Math.random() * 0.4,
                        }}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col items-center text-center">

                    {/* Icon */}
                    <div className="mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      {pathway.icon}
                    </div>

                    {/* Title & Subtitle */}
                    <div className="mb-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-3xl sm:text-4xl">{pathway.emoji}</span>
                        <h3 className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${pathway.gradient} bg-clip-text text-transparent`}>
                          {pathway.title}
                        </h3>
                      </div>
                      <p className="text-sm sm:text-base text-gray-400 font-medium uppercase tracking-wider">
                        {pathway.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-base sm:text-lg text-gray-300 mb-6">
                      {pathway.description}
                    </p>

                    {/* Features */}
                    <div className="mt-auto w-full">
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="space-y-2">
                          {pathway.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                              <span className="text-aurora-green">✓</span>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button className={`mt-6 w-full px-6 py-3 bg-gradient-to-r ${pathway.gradient} text-white font-bold rounded-xl hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2`}>
                      <span>Explore</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Skip Button */}
          <div className="text-center">
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-300 underline decoration-gray-600 hover:decoration-white"
            >
              Skip for now
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-aurora-green/20 rounded-full filter blur-3xl -z-10" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-aurora-purple/20 rounded-full filter blur-3xl -z-10" />
        </div>
      </div>

      <style jsx>{`
        @keyframes snow-fall {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
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

        .animate-aurora {
          animation: aurora 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
