'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import UserTypeSelector from '@/components/auth/UserTypeSelector';
import PremiumSpotlight from '@/components/PremiumSpotlight';
import PremiumSponsors from '@/components/sponsors/PremiumSponsors';
import { BushPlaneIcon, NorthernCabinIcon, OldTruckIcon } from '@/components/NorthernIcons';
import InteractiveAreYou from '@/components/InteractiveAreYou';
import EnhancedPathwayCards from '@/components/EnhancedPathwayCards';
import InteractiveHeader from '@/components/InteractiveHeader';

export default function Home() {
  const { user, profile, loading } = useAuth();
  const { t } = useLanguage();
  const [showUserTypeSelector, setShowUserTypeSelector] = useState(false);

  useEffect(() => {
    if (user && profile && !profile.user_type) {
      setShowUserTypeSelector(true);
    }
  }, [user, profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
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
        primaryText: 'Plan Your Trip'
      },
      living: {
        title: 'Welcome Home!',
        icon: <NorthernCabinIcon className="w-16 h-16" />,
        description: 'Discover what\'s happening in your city',
        primaryLink: '/living',
        primaryText: 'Explore Yellowknife'
      },
      moving: {
        title: 'Welcome to Your New Journey!',
        icon: <OldTruckIcon className="w-16 h-16" />,
        description: 'Let\'s get you settled in Yellowknife',
        primaryLink: '/moving',
        primaryText: 'Continue Planning'
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

            <div className="text-center py-8">
              <div className="mb-4 flex justify-center">{config.icon}</div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-aurora-green via-aurora-blue to-white bg-clip-text text-transparent">
                {config.title}
              </h1>
              <p className="text-lg text-gray-300 mb-6">{config.description}</p>

              <Link href={config.primaryLink}>
                <button className="px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all transform hover:scale-105">
                  {config.primaryText}
                </button>
              </Link>

              <div className="mt-8 pt-6 border-t border-gray-700/30">
                <p className="text-xs text-gray-400 mb-3">Explore other areas</p>
                <div className="flex justify-center gap-3 flex-wrap">
                  {profile.user_type !== 'visiting' && (
                    <Link href="/visiting" className="group">
                      <div className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-aurora-green hover:bg-gray-800/80 transition-all">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🧭</span>
                          <span className="text-gray-300 group-hover:text-aurora-green text-sm font-medium transition-colors">Visiting</span>
                        </div>
                      </div>
                    </Link>
                  )}
                  {profile.user_type !== 'living' && (
                    <Link href="/living" className="group">
                      <div className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-aurora-blue hover:bg-gray-800/80 transition-all">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🏔️</span>
                          <span className="text-gray-300 group-hover:text-aurora-blue text-sm font-medium transition-colors">Living</span>
                        </div>
                      </div>
                    </Link>
                  )}
                  {profile.user_type !== 'moving' && (
                    <Link href="/moving" className="group">
                      <div className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-aurora-purple hover:bg-gray-800/80 transition-all">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🎒</span>
                          <span className="text-gray-300 group-hover:text-aurora-purple text-sm font-medium transition-colors">Moving</span>
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

  // Default view for non-logged-in users
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

          <div className="py-6">
            <InteractiveAreYou />

            <div className="mt-8">
              <EnhancedPathwayCards />
            </div>

            <div className="mt-12 pt-6 border-t border-gray-700/30">
              <PremiumSponsors position="home_bottom" maxSponsors={6} layout="grid" showPlaceholder={true} />
            </div>

            <footer className="mt-8 pt-4 border-t border-gray-700/30 text-center">
              <p className="text-xs text-gray-400">{t('footer')}</p>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
