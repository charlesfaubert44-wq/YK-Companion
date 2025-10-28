'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import Modal from './Modal';
import AboutContent from './AboutContent';
import ContactContent from './ContactContent';
import YKBuddySeasonalBanner from './YKBuddySeasonalBanner';

export default function ImprovedHeader() {
  const { user, profile, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const pathname = usePathname();

  // Close menus when pathname changes
  useEffect(() => {
    setShowMenu(false);
    setShowUserMenu(false);
  }, [pathname]);

  const navItems = [
    { href: '/visiting', label: 'Visiting', icon: '🧭', gradient: 'from-emerald-500 to-cyan-500' },
    { href: '/living', label: 'Living', icon: '🏔️', gradient: 'from-blue-500 to-indigo-500' },
    { href: '/moving', label: 'Moving', icon: '🎒', gradient: 'from-purple-500 to-pink-500' },
  ];

  const quickLinks = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/aurora', label: 'Aurora', icon: '🌌' },
    { href: '/discover', label: 'Discover', icon: '🔍' },
    { href: '/living/garage-sales', label: 'Garage Sales', icon: '🏡' },
  ];

  const userMenuItems = [
    { href: '/profile', label: 'Profile', icon: '👤' },
    { href: '/saved', label: 'Saved Items', icon: '🔖' },
  ];

  return (
    <>
      {/* Header with Banner and Navigation */}
      <div className="relative">
        {/* Interactive Banner */}
        <YKBuddySeasonalBanner />

        {/* Floating Navigation - Positioned over banner with improved layout */}
        <div className="absolute top-0 left-0 right-0 z-50 safe-top">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end items-center h-16 sm:h-18 pt-2">

              {/* Mobile & Desktop - Right aligned auth + menu */}
              <div className="flex items-center gap-3">

                {/* User Avatar/Sign In Button */}
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="group flex items-center space-x-2 px-3 py-2 rounded-xl bg-northern-midnight/70 backdrop-blur-md border-2 border-aurora-blue/40 hover:border-aurora-green/60 transition-all duration-300 shadow-lg hover:shadow-aurora"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-aurora-green via-aurora-blue to-aurora-purple flex items-center justify-center text-sm font-bold ring-2 ring-white/20">
                        {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                      </div>
                      <svg
                        className={`hidden sm:block w-4 h-4 text-gray-300 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* User Dropdown */}
                    {showUserMenu && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                        <div className="absolute right-0 mt-3 w-64 z-50 animate-in fade-in slide-in-from-top-5 duration-200">
                          <div className="bg-dark-900/98 backdrop-blur-2xl border-2 border-aurora-blue/40 rounded-2xl shadow-2xl overflow-hidden">
                            <div className="px-4 py-4 bg-gradient-to-r from-aurora-green/10 via-aurora-blue/10 to-aurora-purple/10 border-b border-aurora-blue/30">
                              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Signed in as</p>
                              <p className="text-base text-white font-bold truncate">{profile?.full_name || user.email}</p>
                            </div>
                            <div className="py-2">
                              {userMenuItems.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className="group flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-aurora-green/15 hover:to-aurora-blue/15 transition-all"
                                  onClick={() => setShowUserMenu(false)}
                                >
                                  <span className="text-lg">{item.icon}</span>
                                  <span className="font-medium">{item.label}</span>
                                </Link>
                              ))}
                            </div>
                            <div className="border-t border-aurora-blue/30 p-2">
                              <button
                                onClick={() => {
                                  signOut();
                                  setShowUserMenu(false);
                                }}
                                className="group w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all font-medium"
                              >
                                <span className="text-lg">🚪</span>
                                <span>Sign Out</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple backdrop-blur-md text-white text-sm font-bold rounded-xl hover:shadow-aurora transition-all duration-300 shadow-lg transform hover:scale-105"
                  >
                    <span>Sign In</span>
                    <span>→</span>
                  </button>
                )}

                {/* Beautiful Hamburger Menu Button */}
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="relative group p-3 rounded-xl bg-northern-midnight/70 backdrop-blur-md border-2 border-aurora-blue/40 hover:border-aurora-purple/60 transition-all duration-300 shadow-lg hover:shadow-aurora"
                  aria-label={showMenu ? 'Close menu' : 'Open menu'}
                >
                  <div className="w-6 h-6 flex flex-col justify-center items-center gap-1.5">
                    <span className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${showMenu ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${showMenu ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}></span>
                    <span className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${showMenu ? '-rotate-45 -translate-y-2' : ''}`}></span>
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-aurora-green/20 via-aurora-blue/20 to-aurora-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-lg"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Stunning Full-Screen Mobile Menu */}
          <div
            className={`fixed inset-0 top-0 transition-all duration-500 z-[60] ${
              showMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Animated backdrop with aurora */}
            <div
              className={`absolute inset-0 bg-northern-midnight/98 backdrop-blur-2xl transition-all duration-500 ${
                showMenu ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={() => setShowMenu(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-aurora-green/10 via-aurora-blue/10 to-aurora-purple/10 animate-aurora" />
            </div>

            {/* Menu Content */}
            <div
              className={`relative h-full overflow-y-auto transition-all duration-700 ${
                showMenu ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <div className="max-w-lg mx-auto p-6 pt-20">

                {/* Close Button */}
                <div className="flex justify-end mb-6">
                  <button
                    onClick={() => setShowMenu(false)}
                    className="p-3 rounded-xl bg-northern-midnight/70 backdrop-blur-md border-2 border-aurora-blue/40 hover:border-red-500/60 transition-all duration-300 shadow-lg group"
                    aria-label="Close menu"
                  >
                    <svg
                      className="w-6 h-6 text-white group-hover:text-red-400 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Main Pathway Cards */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Choose Your Path</h3>
                  <div className="space-y-4">
                    {navItems.map((item, index) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group block transition-all duration-500 ${
                          showMenu ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                        }`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                        onClick={() => setShowMenu(false)}
                      >
                        <div className={`relative px-6 py-5 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border-2 ${
                          pathname === item.href
                            ? `bg-gradient-to-r ${item.gradient} border-transparent shadow-lg`
                            : 'border-white/20 hover:border-white/40'
                        } transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>

                          {/* Background gradient on hover */}
                          <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300`} />

                          <div className="relative flex items-center space-x-4">
                            <span className="text-3xl transition-transform group-hover:scale-125 duration-300">{item.icon}</span>
                            <div>
                              <span className="text-xl font-bold text-white block">{item.label}</span>
                              <span className="text-sm text-gray-400">Explore this path</span>
                            </div>
                            <span className="ml-auto text-white opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Quick Links</h3>
                  <div className="bg-dark-900/60 backdrop-blur-lg rounded-2xl border border-aurora-blue/30 overflow-hidden">
                    {quickLinks.map((item, index) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center space-x-3 px-5 py-4 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-aurora-green/15 hover:to-aurora-blue/15 transition-all ${
                          pathname === item.href ? 'bg-gradient-to-r from-aurora-green/20 to-aurora-blue/20 text-white' : ''
                        } ${index !== quickLinks.length - 1 ? 'border-b border-aurora-blue/20' : ''}`}
                        onClick={() => setShowMenu(false)}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <span className="font-semibold">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* About & Contact */}
                <div className="mb-8">
                  <div className="bg-dark-900/60 backdrop-blur-lg rounded-2xl border border-aurora-blue/30 overflow-hidden">
                    <button
                      onClick={() => {
                        setShowAboutModal(true);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-5 py-4 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-aurora-green/15 hover:to-aurora-blue/15 transition-all border-b border-aurora-blue/20"
                    >
                      <span className="text-2xl">ℹ️</span>
                      <span className="font-semibold">About</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowContactModal(true);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-5 py-4 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-aurora-green/15 hover:to-aurora-blue/15 transition-all"
                    >
                      <span className="text-2xl">📧</span>
                      <span className="font-semibold">Contact</span>
                    </button>
                  </div>
                </div>

                {/* Auth Section */}
                {!user && (
                  <div className="mb-8">
                    <button
                      onClick={() => {
                        setShowAuthModal(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-6 py-4 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple text-white font-bold rounded-2xl hover:shadow-aurora transition-all flex items-center justify-center space-x-2 transform hover:scale-105"
                    >
                      <span>Sign In</span>
                      <span>→</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <Modal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} title="About YK Buddy">
        <AboutContent />
      </Modal>
      <Modal isOpen={showContactModal} onClose={() => setShowContactModal(false)} title="Contact Us">
        <ContactContent />
      </Modal>

      <style jsx>{`
        @keyframes aurora {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          50% {
            opacity: 0.6;
            transform: translateY(-10px);
          }
        }

        .animate-aurora {
          animation: aurora 8s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
