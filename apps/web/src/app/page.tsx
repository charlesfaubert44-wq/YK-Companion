'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import UserTypeSelector from '@/components/auth/UserTypeSelector';
import YKBuddySeasonalBanner from '@/components/YKBuddySeasonalBanner';

export default function Home() {
  const { user, profile, loading, signOut } = useAuth();
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
          {/* Sign Out Button - Top Right */}
          <button
            onClick={signOut}
            className="fixed top-6 right-6 text-gray-400 hover:text-red-400 transition-colors text-sm z-50"
          >
            Sign Out
          </button>

          {/* YK Buddy Seasonal Banner */}
          <YKBuddySeasonalBanner />

          {/* Navigation Menu */}
          <div className="flex justify-center px-4 py-4">
            <nav className="flex gap-6 text-sm">
              <Link href="/about" className="text-gray-400 hover:text-aurora-green transition-colors">
                About
              </Link>
              <Link href="/aurora" className="text-gray-400 hover:text-aurora-blue transition-colors">
                Aurora
              </Link>
              <Link href="/aurora-live" className="text-gray-400 hover:text-aurora-purple transition-colors">
                Aurora Live
              </Link>
              <Link href="/seasonal" className="text-gray-400 hover:text-aurora-pink transition-colors">
                Seasonal Guide
              </Link>
            </nav>
          </div>

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
                Built with love on the traditional territory of the Yellowknives Dene First Nation in Yellowknife, Northwest Territories
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
        {/* Sign In Button - Top Right */}
        <button
          onClick={() => setShowAuthModal(true)}
          className="fixed top-6 right-6 px-6 py-2 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all text-sm z-50"
        >
          Sign In
        </button>

        {/* YK Buddy Seasonal Banner */}
        <YKBuddySeasonalBanner />

        {/* Navigation Menu */}
        <div className="flex justify-center px-4 py-4">
          <nav className="flex gap-6 text-sm">
            <Link href="/about" className="text-gray-400 hover:text-aurora-green transition-colors">
              About
            </Link>
            <Link href="/aurora" className="text-gray-400 hover:text-aurora-blue transition-colors">
              Aurora
            </Link>
            <Link href="/aurora-live" className="text-gray-400 hover:text-aurora-purple transition-colors">
              Aurora Live
            </Link>
            <Link href="/seasonal" className="text-gray-400 hover:text-aurora-pink transition-colors">
              Seasonal Guide
            </Link>
          </nav>
        </div>

        <div className="flex items-center justify-center px-4 py-12">
          <div className="max-w-4xl w-full text-center">
            {/* Simple Question */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
                Are you...
              </h2>

              {/* Three Big Buttons */}
              <div className="grid md:grid-cols-3 gap-6">
                <Link href="/visiting" className="group">
                  <div className="bg-gradient-to-br from-aurora-green/20 to-aurora-green/5 backdrop-blur-lg p-8 rounded-3xl border-2 border-aurora-green/30 hover:border-aurora-green hover:shadow-aurora transition-all transform hover:scale-105 cursor-pointer">
                    <div className="text-6xl mb-4">🧳</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Visiting</h3>
                    <p className="text-gray-400 text-sm mb-4">Plan your trip</p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      Aurora forecasts, top attractions, seasonal guides, hidden gems, and local experiences to make your Yellowknife adventure unforgettable.
                    </p>
                  </div>
                </Link>

                <Link href="/living" className="group">
                  <div className="bg-gradient-to-br from-aurora-blue/20 to-aurora-blue/5 backdrop-blur-lg p-8 rounded-3xl border-2 border-aurora-blue/30 hover:border-aurora-blue hover:shadow-glow transition-all transform hover:scale-105 cursor-pointer">
                    <div className="text-6xl mb-4">🏠</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Living Here</h3>
                    <p className="text-gray-400 text-sm mb-4">Explore your city</p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      Garage sales, local events, seasonal activities, community resources, and insider tips for making the most of life in Yellowknife.
                    </p>
                  </div>
                </Link>

                <Link href="/moving" className="group">
                  <div className="bg-gradient-to-br from-aurora-purple/20 to-aurora-purple/5 backdrop-blur-lg p-8 rounded-3xl border-2 border-aurora-purple/30 hover:border-aurora-purple transition-all transform hover:scale-105 cursor-pointer">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Moving Here</h3>
                    <p className="text-gray-400 text-sm mb-4">Start your move</p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      Housing market insights, job opportunities, cost of living calculator, moving checklist, and everything you need to relocate to Yellowknife.
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="text-sm text-gray-500">
              Made with ❤️ in Yellowknife
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
