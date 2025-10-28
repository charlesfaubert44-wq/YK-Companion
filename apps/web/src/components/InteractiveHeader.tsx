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

export default function InteractiveHeader() {
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
    { href: '/visiting', label: 'Visiting', icon: '🏔️' },
    { href: '/living', label: 'Living', icon: '🏠' },
    { href: '/moving', label: 'Moving', icon: '📦' },
  ];

  // Add Admin link if user is admin
  const allNavItems = profile?.is_admin
    ? [...navItems, { href: '/admin', label: 'Admin', icon: '⚙️' }]
    : navItems;

  const userMenuItems = [
    { href: '/profile', label: 'Profile', icon: '👤' },
    { href: '/saved', label: 'Saved Items', icon: '🔖' },
  ];

  return (
    <>
      {/* Header with Banner and Overlaid Navigation */}
      <div className="relative">
        {/* Interactive Banner with Weather and Slogan */}
        <YKBuddySeasonalBanner />

        {/* Navigation Overlay - positioned on top of banner */}
        <div className="absolute top-0 left-0 right-0 z-50 safe-top">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="flex justify-between items-center h-12 pt-2">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative px-3 py-1.5 rounded-lg backdrop-blur-md transition-all duration-300 ${
                      pathname === item.href
                        ? 'text-white bg-northern-midnight/60 shadow-lg'
                        : 'text-gray-200 hover:text-white hover:bg-northern-midnight/40'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <span className="text-sm transition-transform group-hover:scale-125 duration-300">
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  </Link>
                ))}

                {user ? (
                  <div className="relative ml-2">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="group flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-northern-midnight/60 backdrop-blur-md border border-aurora-blue/30 hover:border-aurora-green/50 transition-all duration-300 shadow-lg"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-aurora-green via-aurora-blue to-aurora-purple flex items-center justify-center text-xs font-bold">
                        {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                      </div>
                      <svg
                        className={`w-3 h-3 text-gray-300 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`}
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
                        <div className="absolute right-0 mt-2 w-56 z-50 animate-in fade-in slide-in-from-top-5 duration-200">
                          <div className="bg-dark-900/95 backdrop-blur-xl border border-aurora-blue/30 rounded-xl shadow-2xl overflow-hidden">
                            <div className="px-3 py-3 bg-gradient-to-r from-aurora-green/10 to-aurora-blue/10 border-b border-aurora-blue/20">
                              <p className="text-xs text-gray-400">Signed in as</p>
                              <p className="text-sm text-white font-semibold truncate">{profile?.full_name || user.email}</p>
                            </div>
                            <div className="py-1">
                              {userMenuItems.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className="group flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-aurora-green/10 hover:to-aurora-blue/10 transition-all"
                                  onClick={() => setShowUserMenu(false)}
                                >
                                  <span className="text-base">{item.icon}</span>
                                  <span>{item.label}</span>
                                </Link>
                              ))}
                            </div>
                            <div className="border-t border-aurora-blue/20 p-1">
                              <button
                                onClick={() => {
                                  signOut();
                                  setShowUserMenu(false);
                                }}
                                className="group w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                              >
                                <span className="text-base">🚪</span>
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
                    className="ml-2 px-4 py-1.5 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple backdrop-blur-md text-white text-sm font-semibold rounded-lg hover:shadow-aurora transition-all duration-300 shadow-lg"
                  >
                    Sign In
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center gap-2 ml-auto">
                {user ? (
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center space-x-2 px-2 py-1.5 rounded-lg bg-northern-midnight/60 backdrop-blur-md border border-aurora-blue/30 shadow-lg"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-aurora-green via-aurora-blue to-aurora-purple flex items-center justify-center text-xs font-bold">
                      {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-3 py-1.5 bg-gradient-to-r from-aurora-green to-aurora-blue backdrop-blur-md text-white text-sm font-semibold rounded-lg shadow-lg"
                  >
                    Sign In
                  </button>
                )}

                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-lg bg-northern-midnight/60 backdrop-blur-md border border-aurora-blue/30 shadow-lg"
                  aria-label={showMenu ? 'Close menu' : 'Open menu'}
                >
                  <div className="w-5 h-5 flex flex-col justify-center items-center">
                    <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${showMenu ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                    <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${showMenu ? 'opacity-0' : 'opacity-100'}`}></span>
                    <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${showMenu ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden fixed inset-0 top-0 transition-all duration-300 ${
              showMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="absolute inset-0 bg-northern-midnight/95 backdrop-blur-xl" onClick={() => setShowMenu(false)}></div>
            <div className={`relative max-w-md mx-auto p-4 pt-20 transition-all duration-500 ${showMenu ? 'translate-y-0' : '-translate-y-full'}`}>
              <div className="bg-dark-900/90 backdrop-blur-lg rounded-2xl border border-aurora-blue/30 shadow-2xl overflow-hidden">
                <div className="p-3 space-y-1">
                  <Link
                    href="/"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      pathname === '/' ? 'bg-gradient-to-r from-aurora-green/20 to-aurora-blue/20 text-white' : 'text-gray-300 hover:bg-gradient-to-r hover:from-aurora-green/10 hover:to-aurora-blue/10'
                    }`}
                    onClick={() => setShowMenu(false)}
                  >
                    <span className="text-xl">🏠</span>
                    <span className="font-semibold">Home</span>
                  </Link>

                  <button
                    onClick={() => {
                      setShowAboutModal(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gradient-to-r hover:from-aurora-green/10 hover:to-aurora-blue/10 transition-all"
                  >
                    <span className="text-xl">ℹ️</span>
                    <span className="font-semibold">About</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowContactModal(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gradient-to-r hover:from-aurora-green/10 hover:to-aurora-blue/10 transition-all"
                  >
                    <span className="text-xl">📧</span>
                    <span className="font-semibold">Contact</span>
                  </button>
                </div>

                <div className="border-t border-aurora-blue/20 p-3 space-y-1">
                  <div className="px-4 py-1">
                    <span className="text-xs font-bold text-gray-500 uppercase">Pathways</span>
                  </div>
                  {allNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        pathname === item.href ? 'bg-gradient-to-r from-aurora-green/20 to-aurora-blue/20 text-white' : 'text-gray-300 hover:bg-gradient-to-r hover:from-aurora-green/10 hover:to-aurora-blue/10'
                      }`}
                      onClick={() => setShowMenu(false)}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-semibold">{item.label}</span>
                    </Link>
                  ))}
                </div>

                {user ? (
                  <>
                    <div className="border-t border-aurora-blue/20 p-3 space-y-1">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gradient-to-r hover:from-aurora-purple/10 hover:to-aurora-pink/10 transition-all"
                          onClick={() => setShowMenu(false)}
                        >
                          <span className="text-xl">{item.icon}</span>
                          <span className="font-semibold">{item.label}</span>
                        </Link>
                      ))}
                      <button
                        onClick={() => {
                          signOut();
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <span className="text-xl">🚪</span>
                        <span className="font-semibold">Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="border-t border-aurora-blue/20 p-3">
                    <button
                      onClick={() => {
                        setShowAuthModal(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-5 py-3 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple text-white font-bold rounded-xl hover:shadow-aurora transition-all flex items-center justify-center space-x-2"
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
    </>
  );
}
