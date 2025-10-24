'use client';

import { useState } from 'react';
import AuthModal from './AuthModal';

interface FunnyLoginPromptProps {
  section?: 'visiting' | 'living' | 'moving';
  featureName?: string;
}

export default function FunnyLoginPrompt({ section = 'living', featureName }: FunnyLoginPromptProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const funnyMessages = {
    visiting: [
      "Whoa there, Aurora chaser! 🌌",
      "Hold up, future adventurer! 🧳",
      "Not so fast, traveler! ✈️",
      "Easy there, explorer! 🗺️",
    ],
    living: [
      "Hold your horses, neighbor! 🏠",
      "Slow down there, Yellowknifer! 🛷",
      "Whoa, local legend! 🦌",
      "Easy there, community member! 🤝",
    ],
    moving: [
      "Pump the brakes, future resident! 📦",
      "Not so fast, relocator! 🚚",
      "Hold on, new neighbor! 🏡",
      "Whoa there, mover! 🛣️",
    ]
  };

  const descriptions = {
    visiting: "You need an account to access trip planning tools and save your favorite spots!",
    living: "You need an account to access local features like garage sales and community events!",
    moving: "You need an account to access relocation tools and housing insights!"
  };

  const benefits = {
    visiting: [
      "🌌 Save your favorite aurora viewing spots",
      "📅 Create custom itineraries",
      "🗺️ Get personalized recommendations",
      "📸 Track places you want to visit"
    ],
    living: [
      "🛒 Save favorite garage sales",
      "📍 Plan garage sale routes",
      "📅 Get event reminders",
      "🏠 Access community resources"
    ],
    moving: [
      "🏠 Save favorite neighborhoods",
      "💼 Track job opportunities",
      "📊 Use cost of living calculator",
      "✅ Manage your moving checklist"
    ]
  };

  // Pick a random funny message
  const randomMessage = funnyMessages[section][Math.floor(Math.random() * funnyMessages[section].length)];

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          {/* Main Card */}
          <div className="bg-gradient-to-br from-dark-800/80 to-dark-900/80 backdrop-blur-xl rounded-3xl border-2 border-aurora-green/30 p-8 md:p-12 shadow-2xl">
            {/* Emoji Header */}
            <div className="text-center mb-6">
              <div className="text-7xl mb-4 animate-bounce">🛑</div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
                {randomMessage}
              </h1>
              <p className="text-lg text-gray-300">
                {descriptions[section]}
              </p>
            </div>

            {/* Funny Message Box */}
            <div className="bg-aurora-green/10 border border-aurora-green/30 rounded-xl p-6 mb-6">
              <p className="text-center text-gray-300 italic">
                "It's -40°C outside, but this feature is even more locked down than Great Slave Lake in January! ❄️"
              </p>
            </div>

            {/* Benefits */}
            {featureName && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  Create an account to unlock:
                </h3>
                <div className="space-y-3">
                  {benefits[section].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 text-gray-300">
                      <span className="text-xl">{benefit.split(' ')[0]}</span>
                      <span className="flex-1">{benefit.substring(benefit.indexOf(' ') + 1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full px-8 py-4 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-bold text-lg rounded-xl hover:shadow-aurora transition-all transform hover:scale-105"
              >
                Create Free Account
              </button>

              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full px-8 py-3 bg-dark-700/50 text-gray-300 font-semibold rounded-xl hover:bg-dark-700 transition-all border border-gray-600/30"
              >
                I Already Have an Account
              </button>
            </div>

            {/* Extra Humor */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Pro tip: Creating an account is faster than explaining what a "sun dog" is to tourists. 🌞
              </p>
            </div>
          </div>

          {/* Bottom Message */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Don't worry, it's free! We just want to make your Yellowknife experience more personal.
          </div>
        </div>
      </div>
    </>
  );
}
