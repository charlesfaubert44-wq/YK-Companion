'use client';

import { Map, Calendar, Heart, Calculator, BookOpen, MessageCircle } from 'lucide-react';
import { MobileFeatureCard, MobileContentCard } from '@/components/mobile/MobileCard';
import { useBannerSettings } from '@/lib/banners/useBannerSettings';
import { useRouter } from 'next/navigation';

// Seasonal theme configurations
const SEASONAL_THEMES = {
  winter: {
    primary: '#4d94ff',
    secondary: '#a366ff',
    accent: '#00ff88',
    glow: 'rgba(77, 148, 255, 0.3)',
  },
  spring: {
    primary: '#00ff88',
    secondary: '#4d94ff',
    accent: '#87ceeb',
    glow: 'rgba(0, 255, 136, 0.3)',
  },
  summer: {
    primary: '#ffa500',
    secondary: '#FFD700',
    accent: '#ff66cc',
    glow: 'rgba(255, 165, 0, 0.3)',
  },
  fall: {
    primary: '#ff6b35',
    secondary: '#ffa500',
    accent: '#FFD700',
    glow: 'rgba(255, 107, 53, 0.3)',
  },
  halloween: {
    primary: '#ff6b35',
    secondary: '#a366ff',
    accent: '#ffa500',
    glow: 'rgba(163, 102, 255, 0.4)',
  },
  remembrance: {
    primary: '#dc2626',
    secondary: '#7f1d1d',
    accent: '#fca5a5',
    glow: 'rgba(220, 38, 38, 0.3)',
  },
  christmas: {
    primary: '#dc2626',
    secondary: '#059669',
    accent: '#FFD700',
    glow: 'rgba(220, 38, 38, 0.3)',
  },
  newYear: {
    primary: '#a366ff',
    secondary: '#4d94ff',
    accent: '#FFD700',
    glow: 'rgba(163, 102, 255, 0.4)',
  },
  canadaDay: {
    primary: '#dc2626',
    secondary: '#f8f8f8',
    accent: '#dc2626',
    glow: 'rgba(220, 38, 38, 0.3)',
  },
  indigenousPeoples: {
    primary: '#fbbf24',
    secondary: '#dc2626',
    accent: '#059669',
    glow: 'rgba(251, 191, 36, 0.3)',
  },
  easter: {
    primary: '#ff66cc',
    secondary: '#a366ff',
    accent: '#fbbf24',
    glow: 'rgba(255, 102, 204, 0.3)',
  },
};

export default function MobileDemoPage() {
  const router = useRouter();
  const { currentTheme } = useBannerSettings();
  const theme = SEASONAL_THEMES[currentTheme] || SEASONAL_THEMES.winter;

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Section */}
      <div className="text-center py-6">
        <h1
          className="text-4xl font-bold mb-3"
          style={{
            color: theme.primary,
            textShadow: `0 0 20px ${theme.glow}`,
          }}
        >
          Mobile Demo
        </h1>
        <p className="text-gray-300 text-sm px-4">
          Experience YK Buddy's new mobile interface with seasonal theming
        </p>

        {/* Seasonal indicator */}
        <div
          className="inline-block mt-4 px-4 py-2 rounded-full backdrop-blur-md"
          style={{
            backgroundColor: `${theme.primary}20`,
            border: `1px solid ${theme.primary}60`,
          }}
        >
          <span
            className="text-sm font-semibold"
            style={{ color: theme.primary }}
          >
            {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)} Theme
          </span>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="space-y-4">
        <h2
          className="text-xl font-bold px-1"
          style={{ color: theme.primary }}
        >
          Explore Features
        </h2>

        <MobileFeatureCard
          icon={<Map size={24} />}
          title="Discover Yukon"
          description="Explore attractions, trails, and hidden gems across Yukon"
          onClick={() => router.push('/discover')}
          theme={theme}
        />

        <MobileFeatureCard
          icon={<Calendar size={24} />}
          title="Seasonal Events"
          description="Find upcoming events and activities happening in your area"
          onClick={() => router.push('/seasonal')}
          theme={theme}
        />

        <MobileFeatureCard
          icon={<Calculator size={24} />}
          title="Trip Calculator"
          description="Plan your budget with our comprehensive trip cost estimator"
          onClick={() => router.push('/calculator')}
          theme={theme}
        />

        <MobileFeatureCard
          icon={<BookOpen size={24} />}
          title="Knowledge Base"
          description="Learn about Yukon's history, culture, and northern living"
          onClick={() => router.push('/knowledge')}
          theme={theme}
        />
      </div>

      {/* Content Cards Section */}
      <div className="space-y-4 mt-8">
        <h2
          className="text-xl font-bold px-1"
          style={{ color: theme.primary }}
        >
          Popular Content
        </h2>

        <div className="space-y-4">
          <MobileContentCard
            image="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&h=300&fit=crop"
            title="Aurora Borealis Guide"
            subtitle="Best viewing locations and tips"
            badge="Popular"
            onClick={() => router.push('/aurora')}
            theme={theme}
          />

          <MobileContentCard
            image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
            title="Winter Adventures"
            subtitle="Top activities for the cold season"
            badge="Seasonal"
            onClick={() => {}}
            theme={theme}
          />

          <MobileContentCard
            image="https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop"
            title="Hiking Trails"
            subtitle="Explore Yukon's wilderness"
            badge="New"
            onClick={() => {}}
            theme={theme}
          />
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4 mt-8">
        <h2
          className="text-xl font-bold px-1"
          style={{ color: theme.primary }}
        >
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <button
            className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 transition-all active:scale-95 touch-feedback"
            style={{
              boxShadow: `0 4px 20px ${theme.glow}`,
            }}
            onClick={() => router.push('/saved')}
          >
            <Heart
              size={32}
              className="mx-auto mb-3"
              style={{ color: theme.primary }}
            />
            <p
              className="text-sm font-semibold"
              style={{ color: theme.primary }}
            >
              Saved
            </p>
          </button>

          <button
            className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 transition-all active:scale-95 touch-feedback"
            style={{
              boxShadow: `0 4px 20px ${theme.glow}`,
            }}
            onClick={() => router.push('/contact')}
          >
            <MessageCircle
              size={32}
              className="mx-auto mb-3"
              style={{ color: theme.primary }}
            />
            <p
              className="text-sm font-semibold"
              style={{ color: theme.primary }}
            >
              Contact
            </p>
          </button>
        </div>
      </div>

      {/* Instructions Section */}
      <div
        className="mt-8 p-6 rounded-2xl backdrop-blur-md"
        style={{
          backgroundColor: `${theme.primary}10`,
          border: `1px solid ${theme.primary}30`,
        }}
      >
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: theme.primary }}
        >
          Try These Gestures
        </h3>
        <ul className="space-y-3 text-sm text-gray-300">
          <li className="flex items-start">
            <span
              className="mr-3 text-lg"
              style={{ color: theme.accent }}
            >
              →
            </span>
            <span>
              <strong style={{ color: theme.primary }}>Swipe right</strong> from the edge to go back
            </span>
          </li>
          <li className="flex items-start">
            <span
              className="mr-3 text-lg"
              style={{ color: theme.accent }}
            >
              ☰
            </span>
            <span>
              <strong style={{ color: theme.primary }}>Tap menu icon</strong> in header to open navigation
            </span>
          </li>
          <li className="flex items-start">
            <span
              className="mr-3 text-lg"
              style={{ color: theme.accent }}
            >
              ⬇
            </span>
            <span>
              <strong style={{ color: theme.primary }}>Use bottom nav</strong> to switch between main sections
            </span>
          </li>
          <li className="flex items-start">
            <span
              className="mr-3 text-lg"
              style={{ color: theme.accent }}
            >
              ✨
            </span>
            <span>
              <strong style={{ color: theme.primary }}>Haptic feedback</strong> confirms your interactions
            </span>
          </li>
        </ul>
      </div>

      {/* Theme Info */}
      <div
        className="mt-6 p-4 rounded-xl backdrop-blur-sm text-center"
        style={{
          backgroundColor: `${theme.secondary}10`,
          border: `1px solid ${theme.secondary}30`,
        }}
      >
        <p className="text-xs text-gray-400">
          The interface automatically adapts to the current season.
          <br />
          Colors and animations change throughout the year!
        </p>
      </div>

      <style jsx>{`
        .touch-feedback {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
      `}</style>
    </div>
  );
}
