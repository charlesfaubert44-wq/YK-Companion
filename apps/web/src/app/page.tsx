'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import UserTypeSelector from '@/components/auth/UserTypeSelector';
import PremiumSpotlight from '@/components/PremiumSpotlight';
import PremiumSponsors from '@/components/sponsors/PremiumSponsors';
import { BushPlaneIcon, NorthernCabinIcon, OldTruckIcon } from '@/components/NorthernIcons';
import InteractiveHeader from '@/components/InteractiveHeader';
import OnboardingModal from '@/components/OnboardingModal';

export default function Home() {
  const { user, profile, loading } = useAuth();
  const { t } = useLanguage();
  const [showUserTypeSelector, setShowUserTypeSelector] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if user has seen onboarding
  useEffect(() => {
    if (!loading) {
      const hasOnboarded = localStorage.getItem('yk_buddy_onboarded');

      // Show onboarding modal for first-time visitors (non-logged in users)
      if (!hasOnboarded && !user) {
        // Small delay for smooth entrance
        setTimeout(() => {
          setShowOnboarding(true);
        }, 800);
      }
    }
  }, [loading, user]);

  // Show user type selector for logged-in users without a type
  useEffect(() => {
    if (user && profile && !profile.user_type) {
      setShowUserTypeSelector(true);
    }
  }, [user, profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-aurora-blue border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-xl font-semibold">Loading YK Buddy...</div>
        </div>
      </div>
    );
  }

  // If user is logged in and has selected a type, show personalized content
  if (user && profile?.user_type) {
    const userTypeConfig = {
      visiting: {
        title: 'Welcome, Traveler!',
        icon: <BushPlaneIcon className="w-16 h-16" />,
        description: 'Ready to explore Yellowknife?',
        primaryLink: '/visiting',
        primaryText: 'Plan Your Trip',
        gradient: 'from-emerald-500 to-cyan-500'
      },
      living: {
        title: 'Welcome Home!',
        icon: <NorthernCabinIcon className="w-16 h-16" />,
        description: 'Discover what\'s happening in your city',
        primaryLink: '/living',
        primaryText: 'Explore Yellowknife',
        gradient: 'from-blue-500 to-indigo-500'
      },
      moving: {
        title: 'Welcome to Your New Journey!',
        icon: <OldTruckIcon className="w-16 h-16" />,
        description: 'Let\'s get you settled in Yellowknife',
        primaryLink: '/moving',
        primaryText: 'Continue Planning',
        gradient: 'from-purple-500 to-pink-500'
      }
    };

    const config = userTypeConfig[profile.user_type as keyof typeof userTypeConfig];

    return (
      <>
        <InteractiveHeader />
        <UserTypeSelector
          isOpen={showUserTypeSelector}
          onComplete={() => setShowUserTypeSelector(false)}
        />
        <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <PremiumSpotlight position="home_top" />

            {/* Personalized Welcome Section */}
            <div className="text-center py-8 sm:py-12">
              <div className="mb-6 flex justify-center animate-bounce-slow">{config.icon}</div>
              <h1 className={`text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                {config.title}
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">{config.description}</p>

              <Link href={config.primaryLink}>
                <button className={`px-8 py-4 bg-gradient-to-r ${config.gradient} text-white font-bold rounded-xl hover:shadow-aurora transition-all transform hover:scale-105 text-lg flex items-center gap-2 mx-auto`}>
                  <span>{config.primaryText}</span>
                  <span>→</span>
                </button>
              </Link>

              {/* Other Pathways */}
              <div className="mt-10 pt-8 border-t border-gray-700/30">
                <p className="text-sm text-gray-500 mb-4 uppercase tracking-wider font-semibold">Explore other areas</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {profile.user_type !== 'visiting' && (
                    <Link href="/visiting" className="group">
                      <div className="px-5 py-3 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl hover:border-emerald-500 hover:bg-gray-800/80 transition-all">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🧭</span>
                          <span className="text-gray-300 group-hover:text-emerald-400 text-sm font-semibold transition-colors">Visiting</span>
                        </div>
                      </div>
                    </Link>
                  )}
                  {profile.user_type !== 'living' && (
                    <Link href="/living" className="group">
                      <div className="px-5 py-3 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl hover:border-blue-500 hover:bg-gray-800/80 transition-all">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🏔️</span>
                          <span className="text-gray-300 group-hover:text-blue-400 text-sm font-semibold transition-colors">Living</span>
                        </div>
                      </div>
                    </Link>
                  )}
                  {profile.user_type !== 'moving' && (
                    <Link href="/moving" className="group">
                      <div className="px-5 py-3 bg-gray-800/50 border-2 border-gray-700/50 rounded-xl hover:border-purple-500 hover:bg-gray-800/80 transition-all">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🎒</span>
                          <span className="text-gray-300 group-hover:text-purple-400 text-sm font-semibold transition-colors">Moving</span>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700/30">
              <PremiumSponsors position="home_middle" maxSponsors={3} layout="grid" showPlaceholder={true} />
            </div>

            <footer className="mt-8 pt-4 border-t border-gray-700/30 text-center">
              <p className="text-xs text-gray-400">{t('footer')}</p>
            </footer>
          </div>
        </div>
      </>
    );
  }

  // Default view for non-logged-in users or users without a selected type
  return (
    <>
      <InteractiveHeader />
      <UserTypeSelector
        isOpen={showUserTypeSelector}
        onComplete={() => setShowUserTypeSelector(false)}
      />

      {/* Beautiful Auto-Opening Onboarding Modal for First-Time Visitors */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <PremiumSpotlight position="home_top" />

          <div className="py-12">
            {/* Welcome Section */}
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-aurora-green via-aurora-blue to-aurora-purple mb-8 animate-pulse-slow">
                <span className="text-5xl">✨</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-aurora-green via-aurora-blue to-white bg-clip-text text-transparent">
                Welcome to YK Buddy
              </h2>
              <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Your personalized guide to Yellowknife
              </p>

              {/* Main CTA - Opens Onboarding Modal */}
              {!showOnboarding && (
                <button
                  onClick={() => setShowOnboarding(true)}
                  className="group px-10 py-5 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple text-white text-lg font-bold rounded-2xl hover:shadow-aurora transition-all transform hover:scale-105 flex items-center gap-3 mx-auto shadow-2xl"
                >
                  <span className="text-2xl group-hover:rotate-12 transition-transform">✨</span>
                  <span>Customize Your Experience</span>
                  <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                </button>
              )}

              {/* Subtext */}
              <p className="text-sm text-gray-500 mt-6 max-w-2xl mx-auto">
                Choose your path and discover Yellowknife your way - whether you're visiting, living here, or planning to move
              </p>
            </div>

            {/* Sponsors Section */}
            <div className="mt-16 pt-8 border-t border-gray-700/30">
              <PremiumSponsors position="home_bottom" maxSponsors={6} layout="grid" showPlaceholder={true} />
            </div>

            <footer className="mt-12 pt-6 border-t border-gray-700/30 text-center">
              <p className="text-xs text-gray-400">{t('footer')}</p>
            </footer>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
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

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
