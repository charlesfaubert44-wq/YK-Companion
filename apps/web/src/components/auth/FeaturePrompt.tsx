'use client';

import { useState } from 'react';
import AuthModal from './AuthModal';

interface FeaturePromptProps {
  featureName: string;
  onClose: () => void;
}

export default function FeaturePrompt({ featureName, onClose }: FeaturePromptProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignUp = () => {
    onClose();
    setShowAuthModal(true);
  };

  return (
    <>
      {/* Mini prompt overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-gradient-to-br from-dark-800 to-northern-midnight border border-aurora-green/30 rounded-xl shadow-xl max-w-sm w-full p-6 animate-in slide-in-from-bottom-2 duration-300">
          <div className="text-center">
            {/* Icon */}
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-aurora-green/20 to-aurora-blue/20 rounded-full flex items-center justify-center border border-aurora-green/30">
              <svg
                className="w-6 h-6 text-aurora-green"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            {/* Message */}
            <h3 className="text-lg font-bold text-white mb-2">Sign up to use {featureName}</h3>
            <p className="text-gray-400 text-sm mb-5">
              Create a free account to unlock this feature and more!
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSignUp}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-aurora-green/50 transition-all"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
