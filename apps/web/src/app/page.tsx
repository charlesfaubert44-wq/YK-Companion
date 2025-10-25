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
import InteractiveAreYou from '@/components/InteractiveAreYou';
import EnhancedPathwayCards from '@/components/EnhancedPathwayCards';

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
          {/* Language Selector - Top Right */}
          <div className="fixed top-6 right-6 flex items-center gap-3 z-50">
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

          <div className="flex items-center justify-center px-4 py-12">
            <div className="max-w-3xl w-full text-center group">
              <div className="mb-6 flex justify-center">{config.icon}</div>
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
        {/* Language Selector - Top Right */}
        <div className="fixed top-6 right-6 flex items-center gap-3 z-50">
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

        <div className="flex items-center justify-center px-4 py-12">
          <div className="max-w-4xl w-full text-center">
            {/* Interactive "Are You..." Section */}
            <InteractiveAreYou />

            {/* Enhanced Pathway Cards with Beautiful Wrapper */}
            <EnhancedPathwayCards />

            {/* Premium Sponsors Section */}
            <div className="mt-12 pt-8 border-t border-gray-700/30">
              <PremiumSponsors position="home_bottom" maxSponsors={6} layout="grid" showPlaceholder={true} />
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
