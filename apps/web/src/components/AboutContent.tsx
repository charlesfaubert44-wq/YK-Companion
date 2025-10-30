'use client';

import Link from 'next/link';

export default function AboutContent() {
  return (
    <div className="space-y-4 text-gray-300 leading-relaxed">
      {/* Compact Header */}
      <div className="text-center pb-4 border-b border-aurora-blue/30">
        <div className="text-5xl mb-3">❄️</div>
        <p className="text-xl font-bold text-transparent bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text mb-1">
          YK Buddy
        </p>
        <p className="text-sm text-gray-400 italic">Because Nobody Should Face -40° Alone</p>
      </div>

      {/* What We Do */}
      <section className="bg-gradient-to-br from-aurora-green/20 via-aurora-blue/15 to-aurora-purple/20 rounded-xl p-4 border border-aurora-green/40">
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          <span>What We Do</span>
        </h2>
        <p className="text-sm mb-3">
          YK Buddy is your digital companion for all things Yellowknife. One place for scattered
          info, local knowledge, and helpful tips.
        </p>
        <div className="space-y-2 text-xs">
          <div className="flex gap-2 p-2 rounded-lg bg-aurora-green/10 border border-aurora-green/20">
            <span className="text-lg flex-shrink-0">🧳</span>
            <div>
              <strong className="text-aurora-green">Visitors:</strong> Aurora forecasts, seasonal
              guides, insider tips
            </div>
          </div>
          <div className="flex gap-2 p-2 rounded-lg bg-aurora-blue/10 border border-aurora-blue/20">
            <span className="text-lg flex-shrink-0">🏠</span>
            <div>
              <strong className="text-aurora-blue">Residents:</strong> Garage sales, events,
              community intel
            </div>
          </div>
          <div className="flex gap-2 p-2 rounded-lg bg-aurora-purple/10 border border-aurora-purple/20">
            <span className="text-lg flex-shrink-0">📦</span>
            <div>
              <strong className="text-aurora-purple">Moving Here:</strong> Housing, jobs, cost of
              living info
            </div>
          </div>
        </div>
      </section>

      {/* The Promise - Compact */}
      <section className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
        <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-xl">🤝</span> Our Promise
        </h2>
        <div className="space-y-1 text-sm">
          <p>✓ Real, useful information</p>
          <p>✓ Regular updates</p>
          <p>✓ Built by locals</p>
          <p>✓ No BS, just helpful stuff</p>
        </div>
      </section>

      {/* Welcome Message */}
      <section className="bg-gradient-to-br from-aurora-blue/20 to-aurora-purple/20 rounded-lg p-4 border border-aurora-blue/30 text-center">
        <p className="text-sm mb-2">
          Whether you're here for three days or three decades, we're here to help.
        </p>
        <p className="text-base text-aurora-green font-semibold">
          Nobody should face -40° alone. ❄️
        </p>
      </section>

      {/* CTA Buttons - Fixed positioning removed */}
      <div className="text-center pt-2">
        <h3 className="text-base font-bold text-white mb-3">Ready to explore?</h3>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link href="/visiting" className="flex-1 sm:flex-initial">
            <button className="w-full px-4 py-2.5 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all text-sm">
              🧳 Visiting
            </button>
          </Link>
          <Link href="/living" className="flex-1 sm:flex-initial">
            <button className="w-full px-4 py-2.5 bg-gradient-to-r from-aurora-blue to-aurora-purple text-white font-semibold rounded-lg hover:shadow-aurora transition-all text-sm">
              🏠 Living
            </button>
          </Link>
          <Link href="/moving" className="flex-1 sm:flex-initial">
            <button className="w-full px-4 py-2.5 bg-gradient-to-r from-aurora-purple to-aurora-pink text-white font-semibold rounded-lg hover:shadow-aurora transition-all text-sm">
              📦 Moving
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
