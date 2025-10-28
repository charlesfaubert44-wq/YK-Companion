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
import PremiumSponsors from '@/components/sponsors/PremiumSponsors';
import { BushPlaneIcon, NorthernCabinIcon, OldTruckIcon } from '@/components/NorthernIcons';
import Modal from '@/components/Modal';
import AboutContent from '@/components/AboutContent';
import ContactContent from '@/components/ContactContent';
import InteractiveMenu from '@/components/InteractiveMenu';
import SloganConnector from '@/components/SloganConnector';
import InteractiveAreYou from '@/components/InteractiveAreYou';
import EnhancedPathwayCards from '@/components/EnhancedPathwayCards';
import EnhancedPathwayCardsCarousel from '@/components/EnhancedPathwayCardsCarousel';

export default function Home() {
  const { user, profile, loading, signOut } = useAuth();
  const { t } = useLanguage();
  const [showUserTypeSelector, setShowUserTypeSelector] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

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
        icon: <BushPlaneIcon className="transform group-hover:scale-110 transition-all duration-300" />,
        description: 'Ready to explore Yellowknife?',
        primaryLink: '/visiting',
        primaryText: 'Plan Your Trip'
      },
      living: {
        title: 'Welcome Home!',
        icon: <NorthernCabinIcon className="transform group-hover:scale-110 transition-all duration-300" />,
        description: 'Discover what\'s happening in your city',
        primaryLink: '/living',
        primaryText: 'Explore Yellowknife'
      },
      moving: {
        title: 'Welcome to Your New Journey!',
        icon: <OldTruckIcon className="transform group-hover:scale-110 transition-all duration-300" />,
        description: 'Let\'s get you settled in Yellowknife',
        primaryLink: '/moving',
        primaryText: 'Continue Planning'
      }
    };

    const config = userTypeConfig[profile.user_type as keyof typeof userTypeConfig];

    return (
      <>
        <UserTypeSelector
          isOpen={showUserTypeSelector}
          onComplete={() => setShowUserTypeSelector(false)}
        />
        <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900">
          {/* Top Right Navigation - User Menu and Language Selector */}
          <div className="fixed top-6 right-6 flex items-center gap-3 z-50">
            <button
              onClick={signOut}
              className="px-4 py-2 bg-gradient-to-r from-red-500/80 to-red-600/80 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Sign Out
            </button>
            <LanguageSelector />
          </div>

          {/* YK Buddy Seasonal Banner */}
          <YKBuddySeasonalBanner />

          {/* Interactive Navigation Menu */}
          <InteractiveMenu
            onAboutClick={() => setShowAboutModal(true)}
            onContactClick={() => setShowContactModal(true)}
          />

          {/* Premium Spotlight */}
          <PremiumSpotlight position="home_top" />

          <div className="flex items-center justify-center px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12 safe-top safe-bottom">
            <div className="max-w-3xl w-full text-center group">
              <div className="mb-4 sm:mb-5 md:mb-6 flex justify-center">{config.icon}</div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-aurora-green via-aurora-blue to-white bg-clip-text text-transparent px-2">
                {config.title}
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 px-2">{config.description}</p>

              <Link href={config.primaryLink}>
                <button className="px-6 sm:px-8 py-3 sm:py-4 min-h-[48px] bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold text-base sm:text-lg rounded-lg hover:shadow-aurora transition-all transform hover:scale-105 mb-6 sm:mb-8 touch-manipulation">
                  {config.primaryText}
                </button>
              </Link>

              {/* Explore Other Pathways */}
              <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-700/30">
                <p className="text-sm text-gray-400 mb-3 sm:mb-4">Explore other areas</p>
                <div className="flex justify-center gap-3 sm:gap-4 flex-wrap px-2">
                  {profile.user_type !== 'visiting' && (
                    <Link href="/visiting" className="group">
                      <div className="px-6 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-aurora-green hover:bg-gray-800/80 transition-all transform hover:scale-105">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">🧭</span>
                          <span className="text-gray-300 group-hover:text-aurora-green text-sm font-medium transition-colors">Visiting</span>
                        </div>
                      </div>
                    </Link>
                  )}
                  {profile.user_type !== 'living' && (
                    <Link href="/living" className="group">
                      <div className="px-6 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-aurora-blue hover:bg-gray-800/80 transition-all transform hover:scale-105">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">🏔️</span>
                          <span className="text-gray-300 group-hover:text-aurora-blue text-sm font-medium transition-colors">Living</span>
                        </div>
                      </div>
                    </Link>
                  )}
                  {profile.user_type !== 'moving' && (
                    <Link href="/moving" className="group">
                      <div className="px-6 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-aurora-purple hover:bg-gray-800/80 transition-all transform hover:scale-105">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">🎒</span>
                          <span className="text-gray-300 group-hover:text-aurora-purple text-sm font-medium transition-colors">Moving</span>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              </div>

              {/* Premium Sponsors Section */}
              <div className="mt-12 pt-8 border-t border-gray-700/30">
                <PremiumSponsors position="home_middle" maxSponsors={3} layout="grid" showPlaceholder={true} />
              </div>

              {/* Styled Footer */}
              <footer className="mt-12 pt-6 border-t border-gray-700/30">
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-400">
                    {t('footer')}
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </div>

        {/* About Modal */}
        <Modal
          isOpen={showAboutModal}
          onClose={() => setShowAboutModal(false)}
          title="About YK Buddy"
        >
          <AboutContent />
        </Modal>

        {/* Contact Modal */}
        <Modal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          title="Contact Us"
        >
          <ContactContent />
        </Modal>
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
        {/* Top Right Navigation - Language Selector and Sign In */}
        <div className="fixed top-6 right-6 flex items-center gap-3 z-50">
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-aurora-green to-aurora-blue text-white text-sm font-semibold rounded-lg hover:shadow-aurora transition-all duration-300"
          >
            Sign In
          </button>
          <LanguageSelector />
        </div>

        {/* YK Buddy Seasonal Banner */}
        <YKBuddySeasonalBanner />

        {/* Interactive Navigation Menu */}
        <InteractiveMenu
          onAboutClick={() => setShowAboutModal(true)}
          onContactClick={() => setShowContactModal(true)}
        />

        {/* Premium Spotlight */}
        <PremiumSpotlight position="home_top" />

        <div className="flex items-center justify-center px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 safe-top safe-bottom">
          <div className="max-w-4xl w-full text-center">
            {/* Interactive "Are You..." Section */}
            <InteractiveAreYou />

            {/* Enhanced Pathway Cards with Beautiful Wrapper - Now with Carousel on Mobile */}
            <EnhancedPathwayCardsCarousel />

            {/* Premium Sponsors Section */}
            <div className="mt-12 sm:mt-16 md:mt-24 pt-6 sm:pt-8 border-t border-gray-700/30 px-2">
              <PremiumSponsors position="home_bottom" maxSponsors={6} layout="grid" showPlaceholder={true} />
            </div>

            {/* Styled Footer */}
            <footer className="mt-8 sm:mt-10 md:mt-12 pt-6 border-t border-gray-700/30 safe-bottom">
              <div className="text-center space-y-2 px-2">
                <p className="text-xs sm:text-sm text-gray-400">
                  {t('footer')}
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>

      {/* About Modal */}
      <Modal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        title="About YK Buddy"
      >
        <AboutContent />
      </Modal>

      {/* Contact Modal */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Contact Us"
      >
        <ContactContent />
      </Modal>
    </>
  );
}
