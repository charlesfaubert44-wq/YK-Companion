'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import Modal from './Modal';
import AboutContent from './AboutContent';
import ContactContent from './ContactContent';

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // DEV BRANCH INDICATOR
  const isDev = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENV === 'dev';

  // Handle scroll for header effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const userMenuItems = [
    { href: '/profile', label: 'Profile', icon: '👤' },
    { href: '/saved', label: 'Saved Items', icon: '🔖' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-top ${
          scrolled
            ? 'bg-northern-midnight/95 backdrop-blur-xl shadow-lg shadow-aurora-blue/10'
            : 'bg-northern-midnight/70 backdrop-blur-lg'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
            {/* Logo with enhanced design */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-aurora-green via-aurora-blue to-aurora-purple flex items-center justify-center text-xl shadow-aurora">
                  🌌
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                  YK Buddy
                </span>
                {isDev && (
                  <span className="px-2 py-0.5 bg-yellow-500 text-black text-[10px] font-bold rounded-md uppercase">
                    Dev
                  </span>
                )}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative px-4 py-2 rounded-xl transition-all duration-300 ${
                    pathname === item.href
                      ? 'text-white bg-gradient-to-r from-aurora-green/20 to-aurora-blue/20'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg transition-transform group-hover:scale-125 group-hover:rotate-12 duration-300">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {pathname === item.href && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple rounded-full shadow-glow"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-aurora-green/0 via-aurora-blue/0 to-aurora-purple/0 group-hover:from-aurora-green/10 group-hover:via-aurora-blue/10 group-hover:to-aurora-purple/10 rounded-xl transition-all duration-300"></div>
                </Link>
              ))}

              {user ? (
                <div className="relative ml-4">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="group flex items-center space-x-3 px-4 py-2 rounded-xl bg-gradient-to-r from-dark-800 to-dark-900 border border-aurora-blue/30 hover:border-aurora-green/50 transition-all duration-300 hover:shadow-aurora"
                  >
                    <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-aurora-green via-aurora-blue to-aurora-purple flex items-center justify-center text-sm font-bold shadow-glow">
                      <span className="relative z-10">
                        {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                      </span>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-aurora-purple to-aurora-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Enhanced User Dropdown */}
                  {showUserMenu && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      ></div>

                      <div className="absolute right-0 mt-3 w-64 z-50 animate-in fade-in slide-in-from-top-5 duration-200">
                        <div className="bg-dark-900/95 backdrop-blur-xl border border-aurora-blue/30 rounded-2xl shadow-2xl shadow-aurora-blue/20 overflow-hidden">
                          {/* User Info Header */}
                          <div className="px-4 py-4 bg-gradient-to-r from-aurora-green/10 via-aurora-blue/10 to-aurora-purple/10 border-b border-aurora-blue/20">
                            <p className="text-sm text-gray-400">Signed in as</p>
                            <p className="text-white font-semibold truncate">{profile?.full_name || user.email}</p>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            {userMenuItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="group flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-aurora-green/10 hover:to-aurora-blue/10 transition-all duration-200"
                                onClick={() => setShowUserMenu(false)}
                              >
                                <span className="text-xl transition-transform group-hover:scale-125 duration-200">
                                  {item.icon}
                                </span>
                                <span className="font-medium">{item.label}</span>
                              </Link>
                            ))}
                          </div>

                          {/* Sign Out */}
                          <div className="border-t border-aurora-blue/20 p-2">
                            <button
                              onClick={() => {
                                signOut();
                                setShowUserMenu(false);
                              }}
                              className="group w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                            >
                              <span className="text-xl transition-transform group-hover:scale-125 duration-200">
                                🚪
                              </span>
                              <span className="font-medium">Sign Out</span>
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
                  className="group relative ml-4 px-6 py-2.5 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-aurora hover:scale-105"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>Sign In</span>
                    <span className="transition-transform group-hover:translate-x-1 duration-300">→</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-aurora-purple via-aurora-pink to-aurora-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )}
            </nav>

            {/* Enhanced Mobile menu button - 44px touch target */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden relative z-50 p-3 min-w-[44px] min-h-[44px] rounded-xl bg-dark-800/80 border border-aurora-blue/30 hover:border-aurora-green/50 transition-all duration-300 touch-manipulation flex items-center justify-center"
              aria-label={showMenu ? 'Close menu' : 'Open menu'}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-6 h-0.5 bg-gradient-to-r from-aurora-green to-aurora-blue rounded-full transition-all duration-300 ${showMenu ? 'rotate-45 translate-y-1.5' : '-translate-y-1'}`}></span>
                <span className={`block w-6 h-0.5 bg-gradient-to-r from-aurora-blue to-aurora-purple rounded-full transition-all duration-300 ${showMenu ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block w-6 h-0.5 bg-gradient-to-r from-aurora-purple to-aurora-pink rounded-full transition-all duration-300 ${showMenu ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile menu */}
        <div
          className={`md:hidden fixed inset-0 top-16 sm:top-18 md:top-20 transition-all duration-300 ${
            showMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-northern-midnight/95 backdrop-blur-xl"
            onClick={() => setShowMenu(false)}
          ></div>

          {/* Menu Content - Mobile Safe Areas */}
          <div className={`relative max-w-md mx-auto p-4 sm:p-6 safe-bottom transition-all duration-500 ${
            showMenu ? 'translate-y-0' : '-translate-y-full'
          }`}>
            <div className="bg-dark-900/90 backdrop-blur-lg rounded-3xl border border-aurora-blue/30 shadow-2xl shadow-aurora-blue/20 overflow-hidden">
              {/* Main Navigation */}
              <div className="p-4 space-y-2">
                <Link
                  href="/"
                  className={`group flex items-center space-x-4 px-5 py-4 min-h-[52px] rounded-2xl transition-all duration-300 touch-manipulation ${
                    pathname === '/'
                      ? 'bg-gradient-to-r from-aurora-green/20 to-aurora-blue/20 text-white shadow-glow'
                      : 'text-gray-300 hover:bg-gradient-to-r hover:from-aurora-green/10 hover:to-aurora-blue/10 hover:text-white'
                  }`}
                  onClick={() => setShowMenu(false)}
                >
                  <span className="text-2xl transition-transform group-hover:scale-125 duration-300">🏠</span>
                  <span className="font-semibold text-lg">Home</span>
                  {pathname === '/' && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-aurora-green to-aurora-blue shadow-glow"></div>
                  )}
                </Link>

                <button
                  onClick={() => {
                    setShowAboutModal(true);
                    setShowMenu(false);
                  }}
                  className="group w-full flex items-center space-x-4 px-5 py-4 min-h-[52px] rounded-2xl text-gray-300 hover:bg-gradient-to-r hover:from-aurora-green/10 hover:to-aurora-blue/10 hover:text-white transition-all duration-300 touch-manipulation"
                >
                  <span className="text-2xl transition-transform group-hover:scale-125 duration-300">ℹ️</span>
                  <span className="font-semibold text-lg">About</span>
                </button>

                <button
                  onClick={() => {
                    setShowContactModal(true);
                    setShowMenu(false);
                  }}
                  className="group w-full flex items-center space-x-4 px-5 py-4 min-h-[52px] rounded-2xl text-gray-300 hover:bg-gradient-to-r hover:from-aurora-green/10 hover:to-aurora-blue/10 hover:text-white transition-all duration-300 touch-manipulation"
                >
                  <span className="text-2xl transition-transform group-hover:scale-125 duration-300">📧</span>
                  <span className="font-semibold text-lg">Contact</span>
                </button>
              </div>

              {/* Pathways Section */}
              <div className="border-t border-aurora-blue/20 p-4 space-y-2">
                <div className="px-5 py-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pathways</span>
                </div>
                {navItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center space-x-4 px-5 py-4 min-h-[52px] rounded-2xl transition-all duration-300 touch-manipulation ${
                      pathname === item.href
                        ? 'bg-gradient-to-r from-aurora-green/20 to-aurora-blue/20 text-white shadow-glow'
                        : 'text-gray-300 hover:bg-gradient-to-r hover:from-aurora-green/10 hover:to-aurora-blue/10 hover:text-white'
                    }`}
                    onClick={() => setShowMenu(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="text-2xl transition-transform group-hover:scale-125 group-hover:rotate-12 duration-300">
                      {item.icon}
                    </span>
                    <span className="font-semibold text-lg">{item.label}</span>
                    {pathname === item.href && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-aurora-green to-aurora-blue shadow-glow"></div>
                    )}
                  </Link>
                ))}
              </div>

              {user ? (
                <>
                  <div className="border-t border-aurora-blue/20 p-4 space-y-2">
                    {userMenuItems.map((item, index) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group flex items-center space-x-4 px-5 py-4 rounded-2xl text-gray-300 hover:bg-gradient-to-r hover:from-aurora-purple/10 hover:to-aurora-pink/10 hover:text-white transition-all duration-300"
                        style={{ animationDelay: `${(navItems.length + index) * 50}ms` }}
                      >
                        <span className="text-2xl transition-transform group-hover:scale-125 duration-300">
                          {item.icon}
                        </span>
                        <span className="font-semibold text-lg">{item.label}</span>
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        signOut();
                        setShowMenu(false);
                      }}
                      className="group w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
                    >
                      <span className="text-2xl transition-transform group-hover:scale-125 duration-300">
                        🚪
                      </span>
                      <span className="font-semibold text-lg">Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-aurora-blue/20 p-4">
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setShowMenu(false);
                    }}
                    className="group w-full px-6 py-4 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple text-white font-bold text-lg rounded-2xl hover:shadow-aurora transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <span>Sign In</span>
                    <span className="transition-transform group-hover:translate-x-2 duration-300">→</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

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
