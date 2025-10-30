'use client';

import { useState } from 'react';

export default function ContactContent() {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="text-center pb-4 border-b border-aurora-blue/30">
        <div className="text-5xl mb-3">📮</div>
        <p className="text-xl font-bold text-transparent bg-gradient-to-r from-aurora-blue via-aurora-purple to-aurora-pink bg-clip-text mb-1">
          Get in Touch
        </p>
        <p className="text-sm text-gray-400">Questions? Suggestions? Feedback?</p>
      </div>

      {/* Intro */}
      <section className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50 text-center">
        <p className="text-xs text-gray-300">
          YK Buddy gets better with your input. Spotted something wrong or have an idea? Let us
          know!
        </p>
      </section>

      {/* Contact Methods - Compact */}
      <div className="grid gap-3">
        {/* Email */}
        <div className="bg-gradient-to-r from-aurora-green/20 to-aurora-green/5 rounded-lg p-4 border border-aurora-green/30 text-center">
          <div className="text-3xl mb-2">✉️</div>
          <h2 className="text-base font-bold text-white mb-1">Email Us</h2>
          <a
            href="mailto:hello@ykbuddy.ca"
            className="text-aurora-green hover:text-aurora-blue transition-colors font-mono text-sm"
          >
            hello@ykbuddy.ca
          </a>
        </div>

        {/* Quick Feedback */}
        <div className="bg-gradient-to-r from-aurora-blue/20 to-aurora-blue/5 rounded-lg p-4 border border-aurora-blue/30 text-center">
          <div className="text-3xl mb-2">💬</div>
          <h2 className="text-base font-bold text-white mb-2">Quick Feedback</h2>
          {!feedbackSubmitted ? (
            <button
              onClick={() => setFeedbackSubmitted(true)}
              className="w-full px-4 py-2 bg-gradient-to-r from-aurora-blue to-aurora-purple text-white font-semibold rounded-lg hover:shadow-aurora transition-all text-sm"
            >
              Send Feedback
            </button>
          ) : (
            <div className="text-aurora-green font-semibold text-sm py-2">✓ Thanks!</div>
          )}
        </div>
      </div>

      {/* What to Contact About - Simplified */}
      <section className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
        <h2 className="text-base font-bold text-white mb-3 text-center">What to Contact About</h2>
        <div className="space-y-2 text-xs">
          <div className="flex gap-2 items-center p-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <span className="text-lg flex-shrink-0">🐛</span>
            <span>
              <strong>Bugs:</strong> Something broken? Let us know
            </span>
          </div>
          <div className="flex gap-2 items-center p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <span className="text-lg flex-shrink-0">💡</span>
            <span>
              <strong>Ideas:</strong> Feature suggestions welcome
            </span>
          </div>
          <div className="flex gap-2 items-center p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <span className="text-lg flex-shrink-0">📝</span>
            <span>
              <strong>Content:</strong> Events, tips, updates
            </span>
          </div>
          <div className="flex gap-2 items-center p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <span className="text-lg flex-shrink-0">🤝</span>
            <span>
              <strong>Partnerships:</strong> Business collaborations
            </span>
          </div>
        </div>
      </section>

      {/* Response Time */}
      <section className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50 text-center">
        <p className="text-xs text-gray-400">
          <strong className="text-gray-300">Response Time:</strong> We typically respond within
          24-48 hours.
        </p>
      </section>

      {/* Community Note - No sticky positioning */}
      <section className="bg-gradient-to-br from-aurora-purple/20 to-aurora-blue/20 rounded-lg p-4 border border-aurora-purple/40 text-center">
        <h3 className="text-sm font-bold text-white mb-2">Built by the Community</h3>
        <p className="text-xs text-gray-300">
          Every message helps make YK Buddy better. Thank you for reaching out!
        </p>
      </section>
    </div>
  );
}
