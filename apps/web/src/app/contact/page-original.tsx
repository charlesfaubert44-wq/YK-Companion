'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900">
      {/* Top Navigation */}
      <div className="fixed top-6 left-6 right-6 z-50 flex justify-between items-center">
        <Link href="/" className="text-gray-400 hover:text-aurora-green transition-colors text-sm flex items-center gap-2">
          <span>←</span> Back to Home
        </Link>
        <LanguageSelector />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-7xl mb-6">📮</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300">
            Questions? Suggestions? Found a dead link from 2012?
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Intro */}
          <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 text-center">
            <p className="text-lg text-gray-300 leading-relaxed">
              YK Buddy is a community resource, and it gets better with your input. Whether you've spotted something wrong, have a great idea, or just want to say hi, we'd love to hear from you.
            </p>
          </section>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="bg-gradient-to-br from-aurora-green/20 to-aurora-green/5 backdrop-blur-sm rounded-2xl p-8 border-2 border-aurora-green/30 hover:border-aurora-green/50 transition-all">
              <div className="text-4xl mb-4 text-center">✉️</div>
              <h2 className="text-2xl font-bold text-white mb-3 text-center">Email Us</h2>
              <p className="text-gray-400 text-sm mb-4 text-center">
                The old-fashioned way (but it works)
              </p>
              <a
                href="mailto:hello@ykbuddy.ca"
                className="block text-aurora-green hover:text-aurora-blue transition-colors text-center font-mono text-lg"
              >
                hello@ykbuddy.ca
              </a>
            </div>

            {/* Feedback Form */}
            <div className="bg-gradient-to-br from-aurora-blue/20 to-aurora-blue/5 backdrop-blur-sm rounded-2xl p-8 border-2 border-aurora-blue/30 hover:border-aurora-blue/50 transition-all">
              <div className="text-4xl mb-4 text-center">💬</div>
              <h2 className="text-2xl font-bold text-white mb-3 text-center">Quick Feedback</h2>
              <p className="text-gray-400 text-sm mb-4 text-center">
                Got a quick suggestion?
              </p>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-aurora-blue to-aurora-purple text-white font-semibold rounded-lg hover:shadow-glow transition-all">
                Send Feedback
              </button>
            </div>
          </div>

          {/* What to Contact About */}
          <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">What Can You Contact Us About?</h2>
            <div className="space-y-4 text-gray-300">
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">🐛</span>
                <div>
                  <strong className="text-white">Bug Reports:</strong> Found something broken? Links not working? Aurora forecast showing sunshine in January? Let us know!
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">💡</span>
                <div>
                  <strong className="text-white">Feature Ideas:</strong> Have an idea that would make YK Buddy better? We're all ears.
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">📝</span>
                <div>
                  <strong className="text-white">Content Updates:</strong> Know about an event, garage sale, or local tip that should be added? Share it!
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">🤝</span>
                <div>
                  <strong className="text-white">Partnerships:</strong> Run a local business or tourism operation? Let's chat about how we can work together.
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">❤️</span>
                <div>
                  <strong className="text-white">Just Saying Hi:</strong> Seriously, we love hearing from people who use YK Buddy. Your stories make this worthwhile.
                </div>
              </div>
            </div>
          </section>

          {/* Response Time */}
          <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 text-center">
            <p className="text-sm text-gray-400">
              <strong className="text-gray-300">Response Time:</strong> We're not a huge team (read: it's just a few people who also have day jobs), but we typically respond within 24-48 hours. If it's urgent, please say so in the subject line.
            </p>
          </section>

          {/* Community Note */}
          <section className="bg-gradient-to-br from-aurora-purple/20 to-aurora-pink/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-aurora-purple/30 text-center">
            <h3 className="text-xl font-bold text-white mb-3">Built by the Community, For the Community</h3>
            <p className="text-gray-300 leading-relaxed">
              YK Buddy exists because we believe Yellowknife deserves better digital resources. Every message, suggestion, and piece of feedback helps make this tool more useful for everyone. So thank you for taking the time to reach out.
            </p>
          </section>
        </div>

        {/* Styled Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-700/30">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400">
              {t('footer')}
            </p>
            <p className="text-xs text-gray-500">
              {t('frozen_shield')}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
