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

            {/* Three Art-Filled Pathway Badges */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* VISITING - Aurora Sky with Bush Plane (Robbie Craig Style) */}
                <Link href="/visiting" className="group">
                  <div className="relative h-64 rounded-3xl overflow-hidden border-2 border-emerald-400/40 hover:border-emerald-300 transition-all duration-500 transform hover:scale-[1.03] cursor-pointer shadow-2xl hover:shadow-emerald-400/60" style={{boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.25), inset 0 0 40px rgba(16, 185, 129, 0.05)'}}>
                    {/* Deep Aurora Sky Background - Layered */}
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950">
                      {/* Atmospheric Sky Layers */}
                      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/60 via-purple-900/40 to-transparent" />

                      {/* Multi-Layered Aurora - Robbie Craig Style */}
                      <div className="absolute inset-0">
                        {/* Main aurora curtain */}
                        <div className="absolute w-full h-full opacity-70 group-hover:opacity-90 transition-all duration-1000"
                          style={{
                            background: 'radial-gradient(ellipse 120% 80% at 50% 25%, rgba(16, 185, 129, 0.7) 0%, rgba(52, 211, 153, 0.5) 30%, rgba(167, 243, 208, 0.2) 50%, transparent 75%)',
                            filter: 'blur(60px)',
                          }}
                        />
                        {/* Secondary aurora layer */}
                        <div className="absolute w-full h-full opacity-50 group-hover:opacity-70 transition-all duration-700"
                          style={{
                            background: 'radial-gradient(ellipse 90% 60% at 30% 35%, rgba(139, 92, 246, 0.6) 0%, rgba(196, 181, 253, 0.3) 40%, transparent 65%)',
                            filter: 'blur(45px)',
                          }}
                        />
                        {/* Subtle cyan highlights */}
                        <div className="absolute w-full h-full opacity-30 group-hover:opacity-50 transition-all duration-500"
                          style={{
                            background: 'radial-gradient(ellipse 70% 40% at 70% 30%, rgba(34, 211, 238, 0.4) 0%, transparent 60%)',
                            filter: 'blur(35px)',
                          }}
                        />
                      </div>

                      {/* Twinkling Stars with Depth */}
                      {[...Array(40)].map((_, i) => (
                        <div key={i} className="absolute rounded-full bg-white animate-twinkle"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 65}%`,
                            width: `${0.5 + Math.random() * 2}px`,
                            height: `${0.5 + Math.random() * 2}px`,
                            opacity: 0.4 + Math.random() * 0.6,
                            boxShadow: '0 0 3px rgba(255,255,255,0.9)',
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`,
                          }}
                        />
                      ))}

                      {/* Bush Plane Silhouette with Contrail */}
                      <div className="absolute bottom-20 right-16 group-hover:bottom-24 group-hover:right-20 transition-all duration-1000">
                        <svg width="90" height="45" viewBox="0 0 90 45" className="opacity-50 group-hover:opacity-75 transition-opacity drop-shadow-lg">
                          {/* Contrail/vapor trail */}
                          <path d="M5,22 Q20,20 35,22" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" opacity="0.6"/>
                          {/* Plane */}
                          <path d="M10,22 L32,22 L27,10 L38,10 L50,22 L68,22 L80,16 L86,22 L80,28 L68,22 L50,22 L38,34 L27,34 L32,22 Z"
                            fill="#0f172a"
                            stroke="#1e293b"
                            strokeWidth="1.5"
                            opacity="0.95"/>
                        </svg>
                      </div>

                      {/* Layered Mountain Ranges - Deep Perspective */}
                      {/* Far mountains */}
                      <svg viewBox="0 0 400 120" className="absolute bottom-0 w-full h-32" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="mountainGradFar" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.6" />
                          </linearGradient>
                          <linearGradient id="mountainGradNear" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
                          </linearGradient>
                        </defs>
                        {/* Distant range */}
                        <path d="M0,75 L100,50 L180,60 L250,45 L320,55 L400,65 L400,120 L0,120 Z" fill="url(#mountainGradFar)"/>
                        {/* Near range */}
                        <path d="M0,85 L80,60 L140,70 L200,55 L260,65 L320,60 L400,75 L400,120 L0,120 Z" fill="url(#mountainGradNear)"/>
                      </svg>

                      {/* Title with Enhanced Glow */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-4xl md:text-5xl font-black text-white group-hover:scale-110 transition-all duration-500"
                          style={{
                            textShadow: '0 0 60px rgba(16, 185, 129, 0.9), 0 0 30px rgba(52, 211, 153, 0.6), 5px 5px 0px rgba(15, 23, 42, 0.95), 8px 8px 0px rgba(15, 23, 42, 0.5)',
                            letterSpacing: '0.05em',
                          }}>
                          VISITING
                        </h3>
                      </div>

                      {/* Atmospheric Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-indigo-950/20 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30 pointer-events-none" />
                    </div>
                  </div>
                </Link>

                {/* LIVING - Great Slave Lake Life (Robbie Craig Style) */}
                <Link href="/living" className="group">
                  <div className="relative h-64 rounded-3xl overflow-hidden border-2 border-blue-400/40 hover:border-blue-300 transition-all duration-500 transform hover:scale-[1.03] cursor-pointer shadow-2xl hover:shadow-blue-400/60" style={{boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.25), inset 0 0 40px rgba(59, 130, 246, 0.05)'}}>
                    {/* Deep Night Sky Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-950 to-blue-950">
                      {/* Atmospheric Depth */}
                      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 via-slate-900/20 to-blue-900/40" />

                      {/* Magnificent Aurora - Dominant Feature */}
                      <div className="absolute inset-0">
                        {/* Main emerald aurora curtain */}
                        <div className="absolute w-full h-full opacity-75 group-hover:opacity-95 transition-all duration-1000"
                          style={{
                            background: 'radial-gradient(ellipse 140% 85% at 50% 15%, rgba(16, 185, 129, 0.8) 0%, rgba(52, 211, 153, 0.6) 20%, rgba(167, 243, 208, 0.3) 45%, transparent 75%)',
                            filter: 'blur(60px)',
                          }}
                        />
                        {/* Vibrant blue aurora layer */}
                        <div className="absolute w-full h-full opacity-65 group-hover:opacity-85 transition-all duration-700"
                          style={{
                            background: 'radial-gradient(ellipse 100% 65% at 70% 20%, rgba(59, 130, 246, 0.7) 0%, rgba(96, 165, 250, 0.4) 35%, transparent 70%)',
                            filter: 'blur(50px)',
                          }}
                        />
                        {/* Purple accent */}
                        <div className="absolute w-full h-full opacity-40 group-hover:opacity-60 transition-all duration-500"
                          style={{
                            background: 'radial-gradient(ellipse 70% 45% at 25% 25%, rgba(139, 92, 246, 0.5) 0%, rgba(196, 181, 253, 0.2) 40%, transparent 65%)',
                            filter: 'blur(45px)',
                          }}
                        />
                      </div>

                      {/* Twinkling Stars - More Spacious */}
                      {[...Array(35)].map((_, i) => (
                        <div key={i} className="absolute rounded-full bg-white animate-twinkle"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 50}%`,
                            width: `${0.5 + Math.random() * 1.8}px`,
                            height: `${0.5 + Math.random() * 1.8}px`,
                            opacity: 0.4 + Math.random() * 0.6,
                            boxShadow: '0 0 3px rgba(255,255,255,0.9)',
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2.5 + Math.random() * 2}s`,
                          }}
                        />
                      ))}

                      {/* Distant Yellowknife City Lights - Far Horizon */}
                      <div className="absolute bottom-28 left-0 right-0 h-8 opacity-60 group-hover:opacity-75 transition-opacity duration-700">
                        {/* City skyline silhouette with warm lights */}
                        {[...Array(12)].map((_, i) => (
                          <div key={i} className="absolute bottom-0"
                            style={{
                              left: `${15 + i * 6}%`,
                              width: `${8 + Math.random() * 12}px`,
                              height: `${4 + Math.random() * 8}px`,
                              background: 'linear-gradient(to top, rgba(251, 191, 36, 0.7), rgba(251, 191, 36, 0.3))',
                              boxShadow: '0 0 8px rgba(251, 191, 36, 0.5)',
                            }}
                          />
                        ))}
                      </div>

                      {/* Great Slave Lake - Frozen Surface */}
                      <div className="absolute bottom-0 left-0 right-0 h-32">
                        <svg viewBox="0 0 400 130" className="w-full h-full" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="lakeIceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.3" />
                              <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.5" />
                              <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0.7" />
                            </linearGradient>
                            <linearGradient id="snowGradLake" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#f0f9ff" stopOpacity="0.9" />
                              <stop offset="100%" stopColor="#dbeafe" stopOpacity="1" />
                            </linearGradient>
                          </defs>
                          {/* Ice surface with gentle waves */}
                          <path d="M0,40 Q100,35 200,42 T400,38 L400,130 L0,130 Z" fill="url(#lakeIceGrad)"/>
                          {/* Snow patches on ice */}
                          <path d="M0,55 Q120,48 240,58 T400,52 L400,130 L0,130 Z" fill="url(#snowGradLake)"/>
                          {/* Ice cracks - subtle detail */}
                          <line x1="80" y1="50" x2="120" y2="130" stroke="#93c5fd" strokeWidth="1" opacity="0.2"/>
                          <line x1="220" y1="45" x2="260" y2="130" stroke="#93c5fd" strokeWidth="1" opacity="0.2"/>
                        </svg>

                        {/* People Enjoying Yellowknife Life */}
                        {/* Ice Fishing Hut */}
                        <div className="absolute bottom-12 left-16 group-hover:left-14 transition-all duration-700 drop-shadow-xl">
                          <svg width="50" height="35" viewBox="0 0 50 35">
                            {/* Hut */}
                            <rect x="5" y="15" width="40" height="20" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" rx="1"/>
                            {/* Roof */}
                            <path d="M3,15 L25,5 L47,15 Z" fill="#b91c1c"/>
                            {/* Window with warm light */}
                            <rect x="18" y="20" width="14" height="10" fill="#fef08a" opacity="0.9" rx="1"/>
                            {/* Door */}
                            <rect x="10" y="22" width="6" height="13" fill="#7f1d1d"/>
                          </svg>
                        </div>

                        {/* Person Walking Dog - Silhouettes */}
                        <div className="absolute bottom-14 right-24 group-hover:right-22 transition-all duration-1000 drop-shadow-lg">
                          <svg width="60" height="30" viewBox="0 0 60 30">
                            {/* Person */}
                            <ellipse cx="25" cy="8" rx="4" ry="5" fill="#1e293b" opacity="0.9"/>
                            <rect x="22" y="12" width="6" height="12" fill="#1e293b" opacity="0.9" rx="1"/>
                            <line x1="22" y1="18" x2="18" y2="24" stroke="#1e293b" strokeWidth="2" opacity="0.9"/>
                            <line x1="28" y1="18" x2="32" y2="24" stroke="#1e293b" strokeWidth="2" opacity="0.9"/>
                            {/* Dog */}
                            <ellipse cx="45" cy="20" rx="5" ry="4" fill="#334155" opacity="0.85"/>
                            <ellipse cx="48" cy="18" rx="3" ry="3" fill="#334155" opacity="0.85"/>
                            <line x1="41" y1="23" x2="39" y2="26" stroke="#334155" strokeWidth="1.5" opacity="0.85"/>
                            <line x1="44" y1="23" x2="43" y2="26" stroke="#334155" strokeWidth="1.5" opacity="0.85"/>
                            <line x1="46" y1="23" x2="47" y2="26" stroke="#334155" strokeWidth="1.5" opacity="0.85"/>
                            <line x1="49" y1="21" x2="51" y2="24" stroke="#334155" strokeWidth="1.5" opacity="0.85"/>
                            {/* Leash */}
                            <path d="M28,16 Q35,18 42,19" stroke="#64748b" strokeWidth="1" opacity="0.7"/>
                          </svg>
                        </div>

                        {/* Friends Gathering Around Small Fire - Community */}
                        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 group-hover:scale-105 transition-all duration-700 drop-shadow-lg">
                          <svg width="70" height="35" viewBox="0 0 70 35">
                            {/* Three friends - silhouettes */}
                            {/* Person 1 */}
                            <ellipse cx="20" cy="12" rx="4" ry="5" fill="#1e293b" opacity="0.85"/>
                            <rect x="17" y="16" width="6" height="10" fill="#1e293b" opacity="0.85" rx="1"/>
                            {/* Person 2 */}
                            <ellipse cx="35" cy="13" rx="4" ry="5" fill="#1e293b" opacity="0.85"/>
                            <rect x="32" y="17" width="6" height="9" fill="#1e293b" opacity="0.85" rx="1"/>
                            {/* Person 3 */}
                            <ellipse cx="50" cy="12" rx="4" ry="5" fill="#1e293b" opacity="0.85"/>
                            <rect x="47" y="16" width="6" height="10" fill="#1e293b" opacity="0.85" rx="1"/>
                            {/* Small campfire/warmth */}
                            <circle cx="35" cy="30" r="3" fill="#fbbf24" opacity="0.8">
                              <animate attributeName="opacity" values="0.6;0.9;0.6" dur="1.5s" repeatCount="indefinite"/>
                            </circle>
                            <circle cx="35" cy="28" r="2" fill="#fef08a" opacity="0.9">
                              <animate attributeName="r" values="1.5;2.5;1.5" dur="1.5s" repeatCount="indefinite"/>
                            </circle>
                          </svg>
                        </div>
                      </div>

                      {/* Single Majestic Pine Tree - Left Side for Balance */}
                      <div className="absolute bottom-24 left-8 drop-shadow-2xl opacity-50">
                        <svg width="35" height="55" viewBox="0 0 35 55">
                          <path d="M17,0 L28,22 L25,22 L33,40 L28,40 L35,55 L0,55 L7,40 L2,40 L10,22 L7,22 Z" fill="#1a3a2a" opacity="0.9"/>
                        </svg>
                      </div>

                      {/* Title with Enhanced Glow */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-4xl md:text-5xl font-black text-white group-hover:scale-110 transition-all duration-500"
                          style={{
                            textShadow: '0 0 70px rgba(16, 185, 129, 0.95), 0 0 40px rgba(59, 130, 246, 0.7), 5px 5px 0px rgba(15, 23, 42, 0.95), 8px 8px 0px rgba(15, 23, 42, 0.5)',
                            letterSpacing: '0.05em',
                          }}>
                          LIVING
                        </h3>
                      </div>

                      {/* Atmospheric Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-indigo-950/15 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 pointer-events-none" />
                    </div>
                  </div>
                </Link>

                {/* MOVING - Ice Road with Moving Truck (Robbie Craig Style) */}
                <Link href="/moving" className="group">
                  <div className="relative h-64 rounded-3xl overflow-hidden border-2 border-purple-400/40 hover:border-purple-300 transition-all duration-500 transform hover:scale-[1.03] cursor-pointer shadow-2xl hover:shadow-purple-400/60" style={{boxShadow: '0 25px 50px -12px rgba(167, 139, 250, 0.25), inset 0 0 40px rgba(167, 139, 250, 0.05)'}}>
                    {/* Twilight Sky Background - Deep Layers */}
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-pink-950 to-orange-900">
                      {/* Atmospheric Depth */}
                      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-fuchsia-900/30 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-900/20 via-transparent to-orange-900/20" />

                      {/* Multi-Layered Aurora - Twilight Glow */}
                      <div className="absolute inset-0">
                        {/* Main purple aurora */}
                        <div className="absolute w-full h-full opacity-50 group-hover:opacity-70 transition-all duration-1000"
                          style={{
                            background: 'radial-gradient(ellipse 120% 60% at 50% 15%, rgba(167, 139, 250, 0.6) 0%, rgba(196, 181, 253, 0.4) 30%, rgba(221, 214, 254, 0.2) 50%, transparent 75%)',
                            filter: 'blur(55px)',
                          }}
                        />
                        {/* Pink glow layer */}
                        <div className="absolute w-full h-full opacity-40 group-hover:opacity-60 transition-all duration-700"
                          style={{
                            background: 'radial-gradient(ellipse 90% 50% at 30% 20%, rgba(236, 72, 153, 0.5) 0%, rgba(251, 207, 232, 0.3) 35%, transparent 65%)',
                            filter: 'blur(45px)',
                          }}
                        />
                        {/* Orange horizon glow */}
                        <div className="absolute w-full h-full opacity-35 group-hover:opacity-50 transition-all duration-500"
                          style={{
                            background: 'radial-gradient(ellipse 100% 40% at 50% 80%, rgba(249, 115, 22, 0.4) 0%, rgba(251, 146, 60, 0.2) 40%, transparent 70%)',
                            filter: 'blur(50px)',
                          }}
                        />
                      </div>

                      {/* Distant Twinkling Stars */}
                      {[...Array(35)].map((_, i) => (
                        <div key={i} className="absolute rounded-full bg-white animate-twinkle"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 40}%`,
                            width: `${0.5 + Math.random() * 1.2}px`,
                            height: `${0.5 + Math.random() * 1.2}px`,
                            opacity: 0.3 + Math.random() * 0.5,
                            boxShadow: '0 0 2px rgba(255,255,255,0.7)',
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                          }}
                        />
                      ))}

                      {/* Layered Mountain Ranges - Deep Perspective */}
                      <svg viewBox="0 0 400 140" className="absolute bottom-24 w-full h-36" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="mountainMovingFar" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.5" />
                          </linearGradient>
                          <linearGradient id="mountainMovingMid" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.55" />
                            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.75" />
                          </linearGradient>
                          <linearGradient id="mountainMovingNear" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
                          </linearGradient>
                        </defs>
                        {/* Far distant range */}
                        <path d="M0,90 L120,65 L200,75 L280,60 L360,70 L400,80 L400,140 L0,140 Z" fill="url(#mountainMovingFar)"/>
                        {/* Mid range */}
                        <path d="M0,95 L100,70 L180,80 L250,65 L320,75 L400,85 L400,140 L0,140 Z" fill="url(#mountainMovingMid)"/>
                        {/* Near range */}
                        <path d="M0,105 L80,80 L160,90 L240,75 L320,85 L400,95 L400,140 L0,140 Z" fill="url(#mountainMovingNear)"/>
                      </svg>

                      {/* Ice Road with Perspective */}
                      <div className="absolute bottom-0 left-0 right-0 h-28">
                        <svg viewBox="0 0 400 110" className="w-full h-full" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="iceRoadGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.5" />
                              <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.75" />
                            </linearGradient>
                            <linearGradient id="iceRoadGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.65" />
                              <stop offset="100%" stopColor="#eff6ff" stopOpacity="0.85" />
                            </linearGradient>
                          </defs>
                          {/* Ice surface with perspective - far */}
                          <path d="M145,0 L255,0 L400,110 L0,110 Z" fill="url(#iceRoadGrad1)"/>
                          {/* Ice surface - near */}
                          <path d="M155,0 L245,0 L385,110 L15,110 Z" fill="url(#iceRoadGrad2)"/>
                          {/* Ice cracks */}
                          <line x1="170" y1="0" x2="100" y2="110" stroke="#93c5fd" strokeWidth="1" opacity="0.25"/>
                          <line x1="230" y1="0" x2="300" y2="110" stroke="#93c5fd" strokeWidth="1" opacity="0.25"/>
                          {/* Snow banks */}
                          <path d="M0,65 Q60,58 120,68 L0,110 Z" fill="#f0f9ff" opacity="0.85"/>
                          <path d="M400,65 Q340,58 280,68 L400,110 Z" fill="#f0f9ff" opacity="0.85"/>
                        </svg>

                        {/* Moving Truck with Details */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 group-hover:bottom-12 group-hover:scale-115 transition-all duration-700 drop-shadow-2xl">
                          <svg width="85" height="42" viewBox="0 0 85 42">
                            {/* Shadow */}
                            <ellipse cx="42" cy="40" rx="35" ry="3" fill="#000" opacity="0.3"/>

                            {/* Truck container */}
                            <rect x="12" y="12" width="40" height="21" fill="#dc2626" stroke="#991b1b" strokeWidth="2" rx="2"/>
                            <line x1="27" y1="12" x2="27" y2="33" stroke="#b91c1c" strokeWidth="1" opacity="0.5"/>
                            <line x1="37" y1="12" x2="37" y2="33" stroke="#b91c1c" strokeWidth="1" opacity="0.5"/>

                            {/* Truck cabin */}
                            <rect x="52" y="6" width="24" height="27" fill="#dc2626" stroke="#991b1b" strokeWidth="2" rx="2"/>

                            {/* Windows with reflection */}
                            <rect x="56" y="10" width="8" height="10" fill="#e0f2fe" opacity="0.8" rx="1"/>
                            <rect x="66" y="10" width="7" height="10" fill="#cbd5e1" opacity="0.7" rx="1"/>
                            <rect x="56" y="11" width="3" height="4" fill="#f0f9ff" opacity="0.9"/>

                            {/* Grille */}
                            <rect x="74" y="18" width="2" height="10" fill="#0f172a" opacity="0.8"/>
                            <line x1="74" y1="20" x2="76" y2="20" stroke="#334155" strokeWidth="0.5"/>
                            <line x1="74" y1="23" x2="76" y2="23" stroke="#334155" strokeWidth="0.5"/>
                            <line x1="74" y1="26" x2="76" y2="26" stroke="#334155" strokeWidth="0.5"/>

                            {/* Wheels with detail */}
                            <g>
                              <circle cx="24" cy="33" r="6.5" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5"/>
                              <circle cx="24" cy="33" r="3.5" fill="#334155"/>
                              <circle cx="24" cy="33" r="1.5" fill="#64748b"/>
                            </g>
                            <g>
                              <circle cx="43" cy="33" r="6.5" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5"/>
                              <circle cx="43" cy="33" r="3.5" fill="#334155"/>
                              <circle cx="43" cy="33" r="1.5" fill="#64748b"/>
                            </g>
                            <g>
                              <circle cx="64" cy="33" r="6.5" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5"/>
                              <circle cx="64" cy="33" r="3.5" fill="#334155"/>
                              <circle cx="64" cy="33" r="1.5" fill="#64748b"/>
                            </g>

                            {/* Headlights with glow */}
                            <circle cx="78" cy="17" r="2.5" fill="#fef08a" opacity="0.95">
                              <animate attributeName="opacity" values="0.95;0.7;0.95" dur="2s" repeatCount="indefinite"/>
                            </circle>
                            <circle cx="78" cy="25" r="2.5" fill="#fef08a" opacity="0.95">
                              <animate attributeName="opacity" values="0.95;0.7;0.95" dur="2s" repeatCount="indefinite"/>
                            </circle>

                            {/* Exhaust smoke */}
                            <circle cx="14" cy="15" r="2" fill="#94a3b8" opacity="0.4"/>
                            <circle cx="12" cy="11" r="2.5" fill="#cbd5e1" opacity="0.3"/>
                          </svg>
                        </div>
                      </div>

                      {/* Title with Enhanced Glow */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-4xl md:text-5xl font-black text-white group-hover:scale-110 transition-all duration-500"
                          style={{
                            textShadow: '0 0 60px rgba(167, 139, 250, 0.9), 0 0 30px rgba(196, 181, 253, 0.6), 5px 5px 0px rgba(15, 23, 42, 0.95), 8px 8px 0px rgba(15, 23, 42, 0.5)',
                            letterSpacing: '0.05em',
                          }}>
                          MOVING
                        </h3>
                      </div>

                      {/* Atmospheric Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-purple-950/20 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30 pointer-events-none" />
                    </div>
                  </div>
                </Link>
              </div>

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
