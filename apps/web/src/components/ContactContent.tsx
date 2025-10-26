'use client';

import { useState } from 'react';

export default function ContactContent() {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  return (
    <div className="space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
      {/* Animated Header */}
      <div className="relative text-center mb-6 pb-8 border-b border-aurora-blue/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-b from-aurora-blue/20 via-aurora-purple/20 to-transparent blur-3xl rounded-full -z-10"></div>

        <div className="relative inline-block">
          <div className="text-7xl mb-4 animate-bounce-slow drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">📮</div>
        </div>

        <p className="text-2xl md:text-3xl text-transparent bg-gradient-to-r from-aurora-blue via-aurora-purple to-aurora-pink bg-clip-text font-bold mb-2">
          Get in Touch
        </p>
        <p className="text-base md:text-lg text-gray-300">
          Questions? Suggestions? Found a dead link from 2012?
        </p>
      </div>

      {/* Intro */}
      <section className="relative group bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 text-center overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-aurora-purple/5 rounded-full blur-2xl group-hover:bg-aurora-purple/10 transition-all duration-500"></div>
        <p className="text-base text-gray-300 leading-relaxed relative z-10">
          YK Buddy is a community resource, and it gets better with your input. Whether you've spotted something wrong, have a great idea, or just want to say hi, we'd love to hear from you.
        </p>
      </section>

      {/* Contact Methods */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Email */}
        <div className="relative group bg-gradient-to-br from-aurora-green/20 to-aurora-green/5 backdrop-blur-sm rounded-2xl p-6 border-2 border-aurora-green/30 hover:border-aurora-green/50 transition-all overflow-hidden hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <div className="absolute inset-0 bg-gradient-to-br from-aurora-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="text-4xl mb-3 text-center transform group-hover:scale-110 transition-transform duration-300 relative z-10">✉️</div>
          <h2 className="text-xl font-bold text-white mb-2 text-center relative z-10">Email Us</h2>
          <p className="text-gray-400 text-sm mb-3 text-center relative z-10">
            The old-fashioned way (but it works)
          </p>
          <a
            href="mailto:hello@ykbuddy.ca"
            className="block text-aurora-green hover:text-aurora-blue transition-colors text-center font-mono text-base group-hover:scale-105 transform transition-transform relative z-10"
          >
            hello@ykbuddy.ca
          </a>
        </div>

        {/* Feedback Form */}
        <div className="relative group bg-gradient-to-br from-aurora-blue/20 to-aurora-blue/5 backdrop-blur-sm rounded-2xl p-6 border-2 border-aurora-blue/30 hover:border-aurora-blue/50 transition-all overflow-hidden hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          <div className="absolute inset-0 bg-gradient-to-br from-aurora-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="text-4xl mb-3 text-center transform group-hover:scale-110 transition-transform duration-300 relative z-10">💬</div>
          <h2 className="text-xl font-bold text-white mb-2 text-center relative z-10">Quick Feedback</h2>
          <p className="text-gray-400 text-sm mb-3 text-center relative z-10">
            Got a quick suggestion?
          </p>
          {!feedbackSubmitted ? (
            <button
              onClick={() => setFeedbackSubmitted(true)}
              className="w-full px-5 py-2 bg-gradient-to-r from-aurora-blue to-aurora-purple text-white font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all text-sm relative z-10 transform hover:scale-105"
            >
              Send Feedback
            </button>
          ) : (
            <div className="text-center text-aurora-green font-semibold text-sm relative z-10 py-2">
              ✓ Thanks for your feedback!
            </div>
          )}
        </div>
      </div>

      {/* What to Contact About */}
      <section className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-aurora-purple/30 transition-all overflow-hidden group">
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-aurora-purple/5 rounded-full blur-2xl group-hover:bg-aurora-purple/10 transition-all duration-500"></div>
        <h2 className="text-xl font-bold text-white mb-4 text-center relative z-10">What Can You Contact Us About?</h2>
        <div className="space-y-3 text-gray-300 text-sm relative z-10">
          <div className="flex gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all">
            <span className="text-2xl flex-shrink-0 transform hover:scale-125 transition-transform">🐛</span>
            <div>
              <strong className="text-white">Bug Reports:</strong> Found something broken? Links not working? Aurora forecast showing sunshine in January? Let us know!
            </div>
          </div>
          <div className="flex gap-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 hover:border-yellow-500/40 transition-all">
            <span className="text-2xl flex-shrink-0 transform hover:scale-125 transition-transform">💡</span>
            <div>
              <strong className="text-white">Feature Ideas:</strong> Have an idea that would make YK Buddy better? We're all ears.
            </div>
          </div>
          <div className="flex gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all">
            <span className="text-2xl flex-shrink-0 transform hover:scale-125 transition-transform">📝</span>
            <div>
              <strong className="text-white">Content Updates:</strong> Know about an event, garage sale, or local tip that should be added? Share it!
            </div>
          </div>
          <div className="flex gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all">
            <span className="text-2xl flex-shrink-0 transform hover:scale-125 transition-transform">🤝</span>
            <div>
              <strong className="text-white">Partnerships:</strong> Run a local business or tourism operation? Let's chat about how we can work together.
            </div>
          </div>
          <div className="flex gap-3 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 hover:border-pink-500/40 transition-all">
            <span className="text-2xl flex-shrink-0 transform hover:scale-125 transition-transform">❤️</span>
            <div>
              <strong className="text-white">Just Saying Hi:</strong> Seriously, we love hearing from people who use YK Buddy. Your stories make this worthwhile.
            </div>
          </div>
        </div>
      </section>

      {/* Response Time */}
      <section className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 text-center group overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-aurora-green/5 rounded-full blur-xl group-hover:bg-aurora-green/10 transition-all duration-500"></div>
        <p className="text-sm text-gray-400 relative z-10">
          <strong className="text-gray-300">Response Time:</strong> We're not a huge team (read: it's just a few people who also have day jobs), but we typically respond within 24-48 hours. If it's urgent, please say so in the subject line.
        </p>
      </section>

      {/* Community Note */}
      <section className="relative bg-gradient-to-br from-aurora-purple/20 via-aurora-pink/15 to-aurora-blue/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-aurora-purple/40 text-center shadow-[0_0_30px_rgba(168,85,247,0.2)] overflow-hidden sticky bottom-0">
        <div className="absolute inset-0 bg-gradient-to-br from-aurora-purple/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
        <h3 className="text-lg font-bold text-white mb-2 relative z-10 bg-gradient-to-r from-aurora-purple via-aurora-pink to-aurora-blue bg-clip-text text-transparent">
          Built by the Community, For the Community
        </h3>
        <p className="text-gray-300 leading-relaxed text-sm relative z-10">
          YK Buddy exists because we believe Yellowknife deserves better digital resources. Every message, suggestion, and piece of feedback helps make this tool more useful for everyone. So thank you for taking the time to reach out.
        </p>
      </section>
    </div>
  );
}
