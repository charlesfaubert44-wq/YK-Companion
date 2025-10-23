'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#living', label: 'Living Here' },
    { href: '#moving', label: 'Moving Here' },
    { href: '#visiting', label: 'Visiting' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-yk-dark-900/95 backdrop-blur-md shadow-lg border-b-2 border-yk-primary-500/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2 group">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-yk-aurora-400 animate-pulse" />
              <div className="absolute inset-0 bg-yk-aurora-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            </div>
            <span className="text-xl md:text-2xl font-bold pixel-font glow-text">
              YK<span className="text-yk-aurora-400">-</span>Companion
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-all hover:bg-yk-dark-700/50 rounded relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yk-primary-500 to-yk-aurora-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
            <button className="ml-4 pixel-btn text-sm">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-yk-dark-700/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-yk-dark-900/98 backdrop-blur-lg border-t-2 border-yk-primary-500/20 animate-slide-up">
          <div className="px-4 py-6 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-semibold text-gray-300 hover:text-white hover:bg-yk-dark-700/50 rounded-lg transition-all"
              >
                {link.label}
              </a>
            ))}
            <button className="w-full pixel-btn text-sm mt-4">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
