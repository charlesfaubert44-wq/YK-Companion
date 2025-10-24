'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './auth/AuthModal';

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-northern-midnight/80 backdrop-blur-lg border-b border-aurora-green/10 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-aurora-green via-aurora-blue to-white bg-clip-text text-transparent">
                YK Buddy
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/visiting"
                className="text-gray-300 hover:text-aurora-green transition-colors"
              >
                Visiting
              </Link>
              <Link
                href="/living"
                className="text-gray-300 hover:text-aurora-green transition-colors"
              >
                Living
              </Link>
              <Link
                href="/moving"
                className="text-gray-300 hover:text-aurora-green transition-colors"
              >
                Moving
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center space-x-2 text-white hover:text-aurora-green transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-aurora-green to-aurora-purple flex items-center justify-center text-sm font-bold">
                      {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-gray-700 rounded-lg shadow-xl py-2">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-300 hover:bg-dark-700 hover:text-white transition-colors"
                        onClick={() => setShowMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/saved"
                        className="block px-4 py-2 text-gray-300 hover:bg-dark-700 hover:text-white transition-colors"
                        onClick={() => setShowMenu(false)}
                      >
                        Saved Items
                      </Link>
                      <hr className="my-2 border-gray-700" />
                      <button
                        onClick={() => {
                          signOut();
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-dark-700 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-2 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all"
                >
                  Sign In
                </button>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {showMenu && (
          <div className="md:hidden bg-dark-900 border-t border-gray-800">
            <div className="px-4 py-3 space-y-3">
              <Link href="/visiting" className="block text-gray-300 hover:text-aurora-green py-2">
                Visiting
              </Link>
              <Link href="/living" className="block text-gray-300 hover:text-aurora-green py-2">
                Living
              </Link>
              <Link href="/moving" className="block text-gray-300 hover:text-aurora-green py-2">
                Moving
              </Link>
              {user ? (
                <>
                  <Link href="/profile" className="block text-gray-300 hover:text-aurora-green py-2">
                    Profile
                  </Link>
                  <Link href="/saved" className="block text-gray-300 hover:text-aurora-green py-2">
                    Saved Items
                  </Link>
                  <button
                    onClick={signOut}
                    className="block w-full text-left text-red-400 hover:text-red-300 py-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-lg transition-all text-center"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
