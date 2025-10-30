'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';

interface DelayedRegistrationPromptProps {
  delaySeconds?: number;
  feature?: string;
  benefits?: string[];
}

export default function DelayedRegistrationPrompt({
  delaySeconds = 30,
  feature = 'this feature',
  benefits = [
    '💾 Save your favorite items',
    '🔔 Get notifications on new sales',
    '📍 Create personalized routes',
    '⭐ Access premium features',
  ],
}: DelayedRegistrationPromptProps) {
  const { user } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hasShownOnce, setHasShownOnce] = useState(false);

  useEffect(() => {
    // Don't show if user is already logged in
    if (user) return;

    // Don't show if we've already shown it this session
    if (hasShownOnce) return;

    // Check if user has dismissed it in this session
    const dismissed = sessionStorage.getItem('registration_prompt_dismissed');
    if (dismissed === 'true') return;

    // Show prompt after delay
    const timer = setTimeout(() => {
      setShowPrompt(true);
      setHasShownOnce(true);
    }, delaySeconds * 1000);

    return () => clearTimeout(timer);
  }, [user, delaySeconds, hasShownOnce]);

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('registration_prompt_dismissed', 'true');
  };

  const handleSignUp = () => {
    setShowPrompt(false);
    setShowAuthModal(true);
  };

  if (!showPrompt || user) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="bg-gradient-to-br from-northern-midnight via-dark-800 to-northern-midnight border border-aurora-green/30 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Northern Lights glow effect */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-aurora-green/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-aurora-purple/20 rounded-full blur-3xl" />

          <div className="relative">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-aurora-green to-aurora-blue rounded-2xl flex items-center justify-center shadow-lg shadow-aurora-green/50">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-center text-white mb-2">Enjoying {feature}?</h2>

            {/* Message */}
            <p className="text-gray-300 text-center mb-6">
              Create a free account to unlock the full YK Buddy experience!
            </p>

            {/* Benefits */}
            <div className="space-y-3 mb-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center text-gray-200 text-sm">
                  <span className="mr-3">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSignUp}
                className="w-full px-6 py-3.5 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-aurora-green/50 transition-all transform hover:scale-105"
              >
                Create Free Account
              </button>

              <button
                onClick={handleDismiss}
                className="w-full px-6 py-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                Maybe later
              </button>
            </div>

            {/* Small print */}
            <p className="text-xs text-gray-500 text-center mt-4">
              No credit card required • Free forever
            </p>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
