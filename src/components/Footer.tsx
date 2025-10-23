'use client';

import { Heart, Github, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-yk-dark-900 border-t-2 border-yk-primary-500/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold pixel-font glow-text mb-4">
              YK<span className="text-yk-aurora-400">-</span>Companion
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Your ultimate guide to Yellowknife - Canada's Northern Capital under the Aurora.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4 text-yk-primary-400" />
              <span>Yellowknife, Northwest Territories</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#living" className="text-gray-400 hover:text-yk-primary-400 transition-colors text-sm">
                  Living Here
                </a>
              </li>
              <li>
                <a href="#moving" className="text-gray-400 hover:text-yk-primary-400 transition-colors text-sm">
                  Moving Here
                </a>
              </li>
              <li>
                <a href="#visiting" className="text-gray-400 hover:text-yk-primary-400 transition-colors text-sm">
                  Visiting
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-yk-dark-700 hover:bg-yk-dark-600 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-yk-dark-700 hover:bg-yk-dark-600 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-yk-dark-700 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © {currentYear} YK-Companion. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center">
            Made with <Heart className="w-4 h-4 text-red-500 mx-1 animate-pulse" /> in Yellowknife
          </p>
        </div>
      </div>
    </footer>
  );
}
