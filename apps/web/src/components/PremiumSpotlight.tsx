'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Sponsor {
  id: string;
  name: string;
  tagline?: string;
  link?: string;
  position: 'home_top' | 'home_middle' | 'home_bottom' | 'visiting' | 'living' | 'moving';
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface PremiumSpotlightProps {
  position: 'home_top' | 'home_middle' | 'home_bottom' | 'visiting' | 'living' | 'moving';
}

export default function PremiumSpotlight({ position }: PremiumSpotlightProps) {
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchActiveSponsor();
  }, [position]);

  const fetchActiveSponsor = async () => {
    try {
      const today = new Date().toISOString();

      const { data, error } = await supabase
        .from('premium_sponsors')
        .select('*')
        .eq('position', position)
        .eq('is_active', true)
        .lte('start_date', today)
        .gte('end_date', today)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setSponsor(data);
        setTimeout(() => setIsVisible(true), 100);
      }
    } catch (err) {
      console.error('Error fetching sponsor:', err);
    }
  };

  if (!sponsor) return null;

  const content = (
    <div
      className="relative group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Aurora Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 transition-opacity duration-700"
          style={{
            background: 'radial-gradient(ellipse at 0% 50%, rgba(16, 185, 129, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 100% 50%, rgba(139, 92, 246, 0.4) 0%, transparent 50%)',
            filter: 'blur(40px)',
            transform: isHovered ? 'scale(1.2)' : 'scale(1)',
            opacity: isHovered ? 0.6 : 0.4,
          }}
        />
        <div
          className="absolute inset-0 opacity-30 transition-all duration-1000"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(59, 130, 246, 0.3) 0%, transparent 60%)',
            filter: 'blur(30px)',
            transform: isHovered ? 'translateY(10px)' : 'translateY(0)',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        {/* Left: Business Logo Area */}
        <div className="flex items-center gap-4 flex-1">
          {/* Animated Icon/Logo Placeholder */}
          <div
            className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center transition-all duration-300"
            style={{
              transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
              boxShadow: isHovered ? '0 0 30px rgba(251, 191, 36, 0.6)' : '0 0 10px rgba(251, 191, 36, 0.3)',
            }}
          >
            <span className="text-2xl">✨</span>
          </div>

          {/* Business Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wide">
                Sponsored
              </span>
            </div>
            <h3
              className="text-lg md:text-xl font-bold text-white leading-tight transition-all duration-300"
              style={{
                textShadow: isHovered ? '0 0 20px rgba(251, 191, 36, 0.5)' : 'none',
              }}
            >
              {sponsor.name}
            </h3>
            {sponsor.tagline && (
              <p
                className={`text-xs md:text-sm text-gray-400 mt-1 transition-all duration-300 ${isHovered ? 'opacity-100 max-h-20' : 'opacity-70 max-h-0 md:max-h-20'}`}
                style={{
                  overflow: 'hidden',
                }}
              >
                {sponsor.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Right: CTA Button */}
        {sponsor.link && (
          <div
            className="ml-4 transition-all duration-300"
            style={{
              opacity: isHovered ? 1 : 0.85,
            }}
          >
            <div className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg text-white text-sm font-semibold whitespace-nowrap shadow-lg hover:shadow-xl transition-all">
              Visit →
            </div>
          </div>
        )}
      </div>

      {/* Sparkle Effects */}
      {isHovered && (
        <>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-sparkle"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.1}s`,
                boxShadow: '0 0 4px rgba(253, 224, 71, 0.8)',
              }}
            />
          ))}
        </>
      )}

      {/* Border Glow */}
      <div
        className="absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none"
        style={{
          border: '2px solid transparent',
          backgroundImage: 'linear-gradient(90deg, rgba(16, 185, 129, 0.5), rgba(59, 130, 246, 0.5), rgba(139, 92, 246, 0.5))',
          backgroundClip: 'border-box',
          opacity: isHovered ? 0.8 : 0.3,
        }}
      />
    </div>
  );

  if (sponsor.link) {
    return (
      <div className={`max-w-3xl mx-auto px-4 mt-8 py-2 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <a
          href={sponsor.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-xl border border-gray-700/50 hover:border-emerald-500/50 transition-all cursor-pointer overflow-hidden">
            {content}
          </div>
        </a>

        <style jsx>{`
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1.5); }
          }
          .animate-sparkle {
            animation: sparkle 1.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`max-w-3xl mx-auto px-4 mt-8 py-2 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-xl border border-gray-700/50 overflow-hidden">
        {content}
      </div>

      <style jsx>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
