'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Verification Pending Page
 *
 * Shown after user submits verification request
 * Provides status update and next steps
 */

export default function VerificationPendingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-northern-midnight via-dark-900 to-northern-midnight py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8 animate-in fade-in zoom-in duration-700">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative text-8xl animate-bounce-slow">✅</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-dark-900/95 backdrop-blur-xl border-2 border-aurora-green/50 rounded-3xl p-8 shadow-2xl shadow-aurora-green/20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <h1 className="text-4xl font-black text-white mb-4 text-center bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
            Verification Submitted!
          </h1>

          <p className="text-xl text-gray-300 text-center mb-8">
            Your verification request has been received and is under review.
          </p>

          {/* Timeline */}
          <div className="bg-dark-800/50 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>⏱️</span>
              <span>What Happens Next</span>
            </h2>

            <div className="space-y-4">
              {[
                { step: 1, title: 'Review Process', desc: 'An admin will review your documents (typically within 24-48 hours)', status: 'current' },
                { step: 2, title: 'Verification Decision', desc: 'You\'ll receive an email notification with the decision', status: 'pending' },
                { step: 3, title: 'Access Granted', desc: 'Once approved, you\'ll have full access to neighborhood features', status: 'pending' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                    item.status === 'current'
                      ? 'bg-aurora-blue text-white shadow-glow'
                      : 'bg-dark-700 text-gray-500'
                  }`}>
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold mb-1 ${
                      item.status === 'current' ? 'text-white' : 'text-gray-400'
                    }`}>
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What You Can Do */}
          <div className="bg-aurora-blue/10 border-2 border-aurora-blue/30 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>💡</span>
              <span>While You Wait</span>
            </h2>

            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-aurora-blue text-xl">•</span>
                <span>Check your email for verification updates (including spam folder)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-aurora-blue text-xl">•</span>
                <span>If you chose vouching, share your link with 2 verified neighbors</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-aurora-blue text-xl">•</span>
                <span>Explore other features of YK Companion while you wait</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-aurora-blue text-xl">•</span>
                <span>Review the <Link href="/neighborhoods/guidelines" className="text-aurora-blue hover:text-aurora-green underline">community guidelines</Link></span>
              </li>
            </ul>
          </div>

          {/* Status Badge */}
          <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-4xl">⏳</span>
              <div>
                <div className="text-yellow-300 font-bold mb-1">Current Status: Pending Review</div>
                <div className="text-sm text-gray-400">Submitted today • Typical review time: 24-48 hours</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/">
              <button className="w-full px-8 py-4 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple text-white font-bold rounded-xl hover:shadow-aurora transition-all duration-300 hover:scale-105">
                Return to Home
              </button>
            </Link>

            <Link href="/neighborhoods">
              <button className="w-full px-8 py-3 bg-dark-800 hover:bg-dark-700 text-gray-300 font-semibold rounded-xl transition-colors">
                Browse Other Neighborhoods
              </button>
            </Link>
          </div>

          {/* Help */}
          <div className="mt-8 pt-6 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm mb-2">Need help?</p>
            <Link href="/contact" className="text-aurora-blue hover:text-aurora-green transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
