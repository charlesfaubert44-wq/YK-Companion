'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AuthModal from '@/components/auth/AuthModal';
import UserTypeSelector from '@/components/auth/UserTypeSelector';
import YKBuddySeasonalBanner from '@/components/YKBuddySeasonalBanner';
import LanguageSelector from '@/components/LanguageSelector';
import PremiumSpotlight from '@/components/PremiumSpotlight';
import { BushPlaneIcon, NorthernCabinIcon, OldTruckIcon } from '@/components/NorthernIcons';

export default function Home() {
  const { user, profile, loading, signOut } = useAuth();
  const { t } = useLanguage();
  const [showUserTypeSelector, setShowUserTypeSelector] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    console.log('Home page - Auth state:', {
      loading,
      hasUser: !!user,
      hasProfile: !!profile,
      userType: profile?.user_type
    });
  }, [loading, user, profile]);

  useEffect(() => {
    // Show user type selector if user is logged in but hasn't selected a type
    if (user && profile && !profile.user_type) {
      console.log('Home page - Showing user type selector');
      setShowUserTypeSelector(true);
    }
  }, [user, profile]);

  if (loading) {
    console.log('Home page - Rendering loading state');
    return (
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  console.log('Home page - Rendering main content'); // Force rebuild

  // If user is logged in and has selected a type, show personalized content
  if (user && profile?.user_type) {
    const userTypeConfig = {
      visiting: {
        title: 'Welcome, Traveler!',
        emoji: '🧳',
        description: 'Ready to explore Yellowknife?',
        primaryLink: '/visiting',
        primaryText: 'Plan Your Trip'
      },
      living: {
        title: 'Welcome Home!',
        emoji: '🏠',
        description: 'Discover what\'s happening in your city',
        primaryLink: '/living',
        primaryText: 'Explore Yellowknife'
      },
      moving: {
        title: 'Welcome to Your New Journey!',
        emoji: '📦',
        description: 'Let\'s get you settled in Yellowknife',
        primaryLink: '/moving',
        primaryText: 'Continue Planning'
      }
    };

    const config = userTypeConfig[profile.user_type];

    return (
      <>
        <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900">
          {/* Language Selector - Top Right */}
          <div className="fixed top-6 right-6 flex items-center gap-3 z-50">
            <button
              onClick={signOut}
              className="text-gray-400 hover:text-red-400 transition-colors text-sm"
            >
              {t('sign_out')}
            </button>
            <LanguageSelector />
          </div>

          {/* YK Buddy Seasonal Banner */}
          <YKBuddySeasonalBanner />

          {/* Navigation Menu */}
          <div className="flex justify-center px-4 py-3">
            <nav className="flex gap-4 text-xs">
              <Link href="/" className="text-gray-500 hover:text-aurora-green transition-colors">
                {t('home')}
              </Link>
              <span className="text-gray-700">•</span>
              <Link href="/about" className="text-gray-500 hover:text-aurora-blue transition-colors">
                {t('about')}
              </Link>
              <span className="text-gray-700">•</span>
              <Link href="/contact" className="text-gray-500 hover:text-aurora-purple transition-colors">
                {t('contact')}
              </Link>
            </nav>
          </div>

          {/* Premium Spotlight */}
          <PremiumSpotlight position="home_top" />

          <div className="flex items-center justify-center px-4 py-12">
            <div className="max-w-3xl w-full text-center">
              <div className="text-8xl mb-6">{config.emoji}</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-aurora-green via-aurora-blue to-white bg-clip-text text-transparent">
                {config.title}
              </h1>
              <p className="text-xl text-gray-300 mb-8">{config.description}</p>

              <Link href={config.primaryLink}>
                <button className="px-8 py-4 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all transform hover:scale-105 mb-8">
                  {config.primaryText}
                </button>
              </Link>

              {/* Explore Other Pathways */}
              <div className="mt-12 pt-8 border-t border-gray-700/30">
                <p className="text-sm text-gray-400 mb-4">Explore other areas</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {profile.user_type !== 'visiting' && (
                    <Link href="/visiting" className="group">
                      <div className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-aurora-green/50 transition-all">
                        <span className="text-2xl mr-2">🧳</span>
                        <span className="text-gray-300 group-hover:text-aurora-green text-sm">Visiting</span>
                      </div>
                    </Link>
                  )}
                  {profile.user_type !== 'living' && (
                    <Link href="/living" className="group">
                      <div className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-aurora-blue/50 transition-all">
                        <span className="text-2xl mr-2">🏠</span>
                        <span className="text-gray-300 group-hover:text-aurora-blue text-sm">Living</span>
                      </div>
                    </Link>
                  )}
                  {profile.user_type !== 'moving' && (
                    <Link href="/moving" className="group">
                      <div className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-aurora-purple/50 transition-all">
                        <span className="text-2xl mr-2">📦</span>
                        <span className="text-gray-300 group-hover:text-aurora-purple text-sm">Moving</span>
                      </div>
                    </Link>
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-500 mt-8 max-w-2xl mx-auto">
                {t('footer')}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Default view for non-logged-in users
  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <UserTypeSelector
        isOpen={showUserTypeSelector}
        onComplete={() => setShowUserTypeSelector(false)}
      />
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900">
        {/* Language Selector & Sign In - Top Right */}
        <div className="fixed top-6 right-6 flex items-center gap-3 z-50">
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-6 py-2 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all text-sm"
          >
            {t('sign_in')}
          </button>
          <LanguageSelector />
        </div>

        {/* YK Buddy Seasonal Banner */}
        <YKBuddySeasonalBanner />

        {/* Navigation Menu */}
        <div className="flex justify-center px-4 py-3">
          <nav className="flex gap-4 text-xs">
            <Link href="/" className="text-gray-500 hover:text-aurora-green transition-colors">
              {t('home')}
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/about" className="text-gray-500 hover:text-aurora-blue transition-colors">
              {t('about')}
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/contact" className="text-gray-500 hover:text-aurora-purple transition-colors">
              {t('contact')}
            </Link>
          </nav>
        </div>

        {/* Premium Spotlight */}
        <PremiumSpotlight position="home_top" />

        <div className="flex items-center justify-center px-4 py-12">
          <div className="max-w-4xl w-full text-center">
            {/* Simple Question */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
                {t('are_you')}
              </h2>

              {/* Three Big Buttons */}
              <div className="grid md:grid-cols-3 gap-6">
                <Link href="/visiting" className="group">
                  <div className="bg-gradient-to-br from-aurora-green/20 to-aurora-green/5 backdrop-blur-lg p-8 rounded-3xl border-2 border-aurora-green/30 hover:border-aurora-green hover:shadow-aurora transition-all transform hover:scale-105 cursor-pointer">
                    <div className="mb-4 flex justify-center">
                      <BushPlaneIcon />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{t('visiting')}</h3>
                    <p className="text-gray-400 text-sm mb-4">{t('plan_your_trip')}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {t('visiting_desc')}
                    </p>
                  </div>
                </Link>

                <Link href="/living" className="group">
                  <div className="bg-gradient-to-br from-aurora-blue/20 to-aurora-blue/5 backdrop-blur-lg p-8 rounded-3xl border-2 border-aurora-blue/30 hover:border-aurora-blue hover:shadow-glow transition-all transform hover:scale-105 cursor-pointer">
                    <div className="mb-4 flex justify-center">
                      <NorthernCabinIcon />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{t('living')}</h3>
                    <p className="text-gray-400 text-sm mb-4">{t('explore_your_city')}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {t('living_desc')}
                    </p>
                  </div>
                </Link>

                <Link href="/moving" className="group">
                  <div className="bg-gradient-to-br from-aurora-purple/20 to-aurora-purple/5 backdrop-blur-lg p-8 rounded-3xl border-2 border-aurora-purple/30 hover:border-aurora-purple transition-all transform hover:scale-105 cursor-pointer">
                    <div className="mb-4 flex justify-center">
                      <OldTruckIcon />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{t('moving')}</h3>
                    <p className="text-gray-400 text-sm mb-4">{t('start_your_move')}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {t('moving_desc')}
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="text-sm text-gray-500">
              {t('footer')}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
