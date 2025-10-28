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
      subtitle: 'I\'m exploring Yellowknife',
      description: 'Plan your trip and discover the best of the North',
      bgColor: 'bg-slate-800',
      borderColor: 'border-emerald-500/30',
      accentColor: 'bg-emerald-500',
      hoverBorder: 'hover:border-emerald-400',
      iconColor: 'text-emerald-400'
    },
    {
      id: 'living',
      title: 'Living',
      subtitle: 'I\'m a local resident',
      description: 'Stay connected with your community and local events',
      bgColor: 'bg-slate-800',
      borderColor: 'border-blue-500/30',
      accentColor: 'bg-blue-500',
      hoverBorder: 'hover:border-blue-400',
      iconColor: 'text-blue-400'
    },
    {
      id: 'moving',
      title: 'Moving',
      subtitle: 'I\'m moving to Yellowknife',
      description: 'Get everything you need to start your life up North',
      bgColor: 'bg-slate-800',
      borderColor: 'border-purple-500/30',
      accentColor: 'bg-purple-500',
      hoverBorder: 'hover:border-purple-400',
      iconColor: 'text-purple-400'
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

          {/* Simplified CTA Buttons with Northern Visuals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {pathways.map((pathway, index) => (
              <button
                key={pathway.id}
                onClick={() => handleSelectPath(pathway.id as 'visiting' | 'living' | 'moving')}
                onMouseEnter={() => setHoveredCard(pathway.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative ${pathway.bgColor} border-2 ${pathway.borderColor} ${pathway.hoverBorder} rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                  isAnimatingOut && selectedCard === pathway.id
                    ? 'scale-110 opacity-100 z-50'
                    : isAnimatingOut
                    ? 'scale-95 opacity-0'
                    : 'opacity-100'
                }`}
              >
                {/* Northern Visual */}
                <div className="mb-6">
                  {pathway.id === 'visiting' && (
                    <svg className={`w-full h-40 ${pathway.iconColor}`} viewBox="0 0 200 120" fill="none">
                      {/* Aurora Borealis Waves */}
                      <path d="M0,60 Q25,40 50,55 T100,50 T150,60 T200,45" stroke="currentColor" strokeWidth="3" opacity="0.8" fill="none" className="animate-aurora-wave"/>
                      <path d="M0,70 Q25,50 50,65 T100,60 T150,70 T200,55" stroke="currentColor" strokeWidth="2" opacity="0.6" fill="none" className="animate-aurora-wave-2"/>
                      <path d="M0,80 Q25,60 50,75 T100,70 T150,80 T200,65" stroke="currentColor" strokeWidth="2" opacity="0.4" fill="none" className="animate-aurora-wave-3"/>
                      {/* Stars */}
                      <circle cx="30" cy="20" r="2" fill="currentColor" opacity="0.8" className="animate-twinkle"/>
                      <circle cx="70" cy="15" r="1.5" fill="currentColor" opacity="0.6" className="animate-twinkle-2"/>
                      <circle cx="120" cy="25" r="2" fill="currentColor" opacity="0.7" className="animate-twinkle-3"/>
                      <circle cx="160" cy="18" r="1.5" fill="currentColor" opacity="0.9" className="animate-twinkle"/>
                      <circle cx="180" cy="30" r="2" fill="currentColor" opacity="0.6" className="animate-twinkle-2"/>
                      {/* Northern Star */}
                      <circle cx="100" cy="25" r="3" fill="currentColor" opacity="1"/>
                      <path d="M100,15 L102,23 L110,23 L104,28 L106,36 L100,31 L94,36 L96,28 L90,23 L98,23 Z" fill="currentColor" opacity="0.9"/>
                    </svg>
                  )}

                  {pathway.id === 'living' && (
                    <svg className={`w-full h-40 ${pathway.iconColor}`} viewBox="0 0 200 120" fill="none">
                      {/* Northern Trees Forest */}
                      <path d="M40,90 L50,60 L45,60 L55,35 L50,35 L60,10 L70,35 L65,35 L75,60 L70,60 L80,90 Z" fill="currentColor" opacity="0.7"/>
                      <path d="M80,95 L88,70 L84,70 L92,50 L88,50 L96,30 L104,50 L100,50 L108,70 L104,70 L112,95 Z" fill="currentColor" opacity="0.85"/>
                      <path d="M120,90 L128,65 L124,65 L132,45 L128,45 L136,25 L144,45 L140,45 L148,65 L144,65 L152,90 Z" fill="currentColor" opacity="0.7"/>
                      {/* Cabin */}
                      <rect x="10" y="75" width="25" height="20" fill="currentColor" opacity="0.6" stroke="currentColor" strokeWidth="1"/>
                      <path d="M7,75 L22.5,60 L38,75 Z" fill="currentColor" opacity="0.7" stroke="currentColor" strokeWidth="1"/>
                      {/* Cabin Window */}
                      <rect x="15" y="82" width="6" height="6" fill="#FCD34D" opacity="0.9"/>
                      <rect x="24" y="82" width="6" height="6" fill="#FCD34D" opacity="0.9"/>
                      {/* Smoke */}
                      <circle cx="28" cy="58" r="2" fill="currentColor" opacity="0.3" className="animate-float"/>
                      <circle cx="30" cy="52" r="2.5" fill="currentColor" opacity="0.2" className="animate-float"/>
                    </svg>
                  )}

                  {pathway.id === 'moving' && (
                    <svg className={`w-full h-40 ${pathway.iconColor}`} viewBox="0 0 200 120" fill="none">
                      {/* Signpost */}
                      <rect x="95" y="30" width="10" height="70" fill="currentColor" opacity="0.8"/>
                      {/* Sign boards pointing different directions */}
                      <path d="M100,35 L160,35 L165,40 L160,45 L100,45 Z" fill="currentColor" opacity="0.7" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M100,55 L40,55 L35,60 L40,65 L100,65 Z" fill="currentColor" opacity="0.7" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M100,75 L150,75 L155,80 L150,85 L100,85 Z" fill="currentColor" opacity="0.7" stroke="currentColor" strokeWidth="1.5"/>
                      {/* Text lines on signs */}
                      <line x1="110" y1="40" x2="150" y2="40" stroke="currentColor" strokeWidth="2" opacity="0.9"/>
                      <line x1="50" y1="60" x2="90" y2="60" stroke="currentColor" strokeWidth="2" opacity="0.9"/>
                      <line x1="110" y1="80" x2="140" y2="80" stroke="currentColor" strokeWidth="2" opacity="0.9"/>
                      {/* Trail/Path leading forward */}
                      <ellipse cx="100" cy="105" rx="60" ry="8" fill="currentColor" opacity="0.2"/>
                      <path d="M80,105 Q100,95 120,105" stroke="currentColor" strokeWidth="2" opacity="0.4" strokeDasharray="5,5"/>
                      {/* Mountains in background */}
                      <path d="M0,50 L30,20 L60,45 L0,45 Z" fill="currentColor" opacity="0.15"/>
                      <path d="M140,50 L170,25 L200,45 L140,45 Z" fill="currentColor" opacity="0.15"/>
                    </svg>
                  )}
                </div>

                {/* Text Content */}
                <div className="text-center space-y-3 mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {pathway.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-medium">
                    {pathway.subtitle}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {pathway.description}
                  </p>
                </div>

                {/* CTA Button */}
                <div className={`w-full py-3 px-6 ${pathway.accentColor} text-white font-semibold rounded-lg transition-all duration-300 ${
                  hoveredCard === pathway.id ? 'shadow-lg scale-105' : ''
                }`}>
                  Select
                </div>
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
            transform: translateY(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-15px);
            opacity: 0.2;
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

        /* Aurora wave animations for northern lights */
        @keyframes aurora-wave {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-5px);
            opacity: 1;
          }
        }

        @keyframes aurora-wave-2 {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-3px);
            opacity: 0.9;
          }
        }

        @keyframes aurora-wave-3 {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-2px);
            opacity: 0.7;
          }
        }

        /* Star twinkling animations */
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(0.8);
          }
        }

        @keyframes twinkle-2 {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.2);
          }
        }

        @keyframes twinkle-3 {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(0.9);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-aurora {
          animation: aurora 8s ease-in-out infinite;
        }

        .animate-aurora-wave {
          animation: aurora-wave 4s ease-in-out infinite;
        }

        .animate-aurora-wave-2 {
          animation: aurora-wave-2 5s ease-in-out infinite;
        }

        .animate-aurora-wave-3 {
          animation: aurora-wave-3 6s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        .animate-twinkle-2 {
          animation: twinkle-2 2.5s ease-in-out infinite;
        }

        .animate-twinkle-3 {
          animation: twinkle-3 3.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
