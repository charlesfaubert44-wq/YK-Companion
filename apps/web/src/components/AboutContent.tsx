'use client';

import Link from 'next/link';

export default function AboutContent() {
  return (
    <div className="space-y-6 text-gray-300 leading-relaxed overflow-y-auto max-h-[70vh] custom-scrollbar">
      {/* Animated Header with Aurora Effect */}
      <div className="relative text-center mb-6 pb-8 border-b border-aurora-blue/30">
        {/* Aurora Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-b from-aurora-green/20 via-aurora-blue/20 to-transparent blur-3xl rounded-full -z-10"></div>

        <div className="relative inline-block">
          <div className="text-7xl mb-4 animate-bounce-slow drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">❄️</div>
        </div>

        <p className="text-2xl md:text-3xl text-transparent bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text font-bold mb-2">
          YK Buddy
        </p>
        <p className="text-lg md:text-xl text-gray-300 italic font-light">
          Because Nobody Should Face -40° Alone
        </p>
      </div>

      {/* The Reality */}
      <section className="relative group bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-aurora-green/40 transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-aurora-green/5 rounded-full blur-2xl group-hover:bg-aurora-green/10 transition-all duration-500"></div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3 relative z-10">
          <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">🥶</span>
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">The Reality</span>
        </h2>
        <p className="text-base mb-3 relative z-10">
          Let's be honest: Yellowknife is absolutely beautiful, wildly unique, and occasionally trying to kill you with its weather.
        </p>
        <p className="text-base relative z-10">
          Whether you're a tourist Googling "will my phone work at -40?" at 2 AM, a resident trying to remember which neighbor has the best garage sales, or someone brave enough to move here (respect), you've probably noticed something: <span className="text-aurora-blue font-semibold">there's a LOT to figure out</span>.
        </p>
      </section>

      {/* The Problem */}
      <section className="relative group bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-aurora-blue/40 transition-all duration-300 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-aurora-blue/5 rounded-full blur-2xl group-hover:bg-aurora-blue/10 transition-all duration-500"></div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3 relative z-10">
          <span className="text-3xl transform group-hover:rotate-12 transition-transform duration-300">🤔</span>
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">The Problem</span>
        </h2>
        <p className="text-base mb-3 relative z-10">
          Information about Yellowknife is scattered across fourteen different Facebook groups, buried in tourism websites last updated in 2012, and locked in the minds of locals who have learned to dress in layers that would make an onion jealous.
        </p>
        <p className="text-base relative z-10">
          Want to know if the aurora will be visible tonight? Check five different websites and interpret the KP index like you're decoding ancient runes. Need to find a good moving company? Hope you know someone who knows someone. Looking for garage sales? Better scroll through endless Facebook posts while your coffee gets cold.
        </p>
      </section>

      {/* The Solution */}
      <section className="relative bg-gradient-to-br from-aurora-green/20 via-aurora-blue/15 to-aurora-purple/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-aurora-green/40 shadow-[0_0_30px_rgba(16,185,129,0.2)] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-aurora-green/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3 relative z-10">
          <span className="text-3xl animate-pulse drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">💡</span>
          <span className="bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">Enter YK Buddy</span>
        </h2>
        <p className="text-base mb-4 relative z-10">
          YK Buddy is your friendly neighborhood digital companion for all things Yellowknife. We're here to make life in the North a little easier, a lot more fun, and significantly less "oh god why is my car making that noise."
        </p>
        <div className="space-y-3 text-sm relative z-10">
          <div className="flex gap-3 p-3 rounded-xl bg-aurora-green/10 border border-aurora-green/20 hover:border-aurora-green/40 transition-all">
            <span className="text-2xl flex-shrink-0 transform hover:scale-125 transition-transform">🧳</span>
            <div>
              <strong className="text-aurora-green">For Visitors:</strong> Aurora forecasts that actually make sense, seasonal guides that won't lead you to bring shorts in January, and insider tips from people who actually live here.
            </div>
          </div>
          <div className="flex gap-3 p-3 rounded-xl bg-aurora-blue/10 border border-aurora-blue/20 hover:border-aurora-blue/40 transition-all">
            <span className="text-2xl flex-shrink-0 transform hover:scale-125 transition-transform">🏠</span>
            <div>
              <strong className="text-aurora-blue">For Residents:</strong> Garage sale maps (because treasure hunting is better with GPS), local event updates, seasonal activity guides, and all the community intel you need.
            </div>
          </div>
          <div className="flex gap-3 p-3 rounded-xl bg-aurora-purple/10 border border-aurora-purple/20 hover:border-aurora-purple/40 transition-all">
            <span className="text-2xl flex-shrink-0 transform hover:scale-125 transition-transform">📦</span>
            <div>
              <strong className="text-aurora-purple">For People Moving Here:</strong> Real housing market data, job opportunities, cost of living breakdowns, and honest answers to questions like "do I really need a block heater?" (Yes. Yes you do.)
            </div>
          </div>
        </div>
      </section>

      {/* The Mission */}
      <section className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="text-2xl">🎯</span> Our Mission
        </h2>
        <p className="text-base mb-3">
          To be the most helpful, slightly sarcastic, but ultimately caring digital companion for anyone interacting with Yellowknife. We want to take all that scattered information, those unspoken local knowledge gems, and those "I wish someone had told me" moments, and put them in one place that doesn't require joining seventeen Facebook groups.
        </p>
        <p className="text-base">
          Because life in the North is challenging enough without having to become a research scientist just to plan a weekend trip or find a good deal on a used snowblower.
        </p>
      </section>

      {/* The Promise */}
      <section className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="text-2xl">🤝</span> The Promise
        </h2>
        <div className="space-y-2 text-base">
          <p>✓ Real, useful information (not tourist brochure fluff)</p>
          <p>✓ Regular updates (unlike that one website from 2012)</p>
          <p>✓ Built by people who actually live here</p>
          <p>✓ No BS, just helpful stuff</p>
          <p>✓ A sense of humor (because sometimes you gotta laugh when it's -45°)</p>
        </div>
      </section>

      {/* The Truth */}
      <section className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="text-2xl">💬</span> The Truth
        </h2>
        <p className="text-base mb-3">
          We're not perfect. We're constantly learning, updating, and trying to make this thing better. If you find something that's wrong, outdated, or could be improved, <span className="text-aurora-green font-semibold">please tell us</span>. This is a community resource, and it gets better with community input.
        </p>
        <p className="text-base">
          Yellowknife is an incredible place full of resilient, creative, and frankly slightly crazy (in a good way) people who have chosen to live somewhere where the sun doesn't rise for weeks at a time. You deserve tools that work as hard as you do.
        </p>
      </section>

      {/* The Invitation */}
      <section className="bg-gradient-to-br from-aurora-blue/20 to-aurora-purple/20 backdrop-blur-sm rounded-xl p-6 border-2 border-aurora-blue/30 text-center">
        <h2 className="text-xl font-bold text-white mb-3">
          So Welcome, Friend
        </h2>
        <p className="text-base mb-4">
          Whether you're here for three days or three decades, we're here to help. Because nobody should have to figure out the North alone.
        </p>
        <p className="text-lg text-aurora-green font-semibold italic">
          Let's do this together. ❄️
        </p>
      </section>

      {/* CTA Buttons */}
      <div className="mt-6 text-center sticky bottom-0 bg-gradient-to-t from-dark-900 via-dark-900 to-transparent pt-6 pb-2">
        <h3 className="text-xl font-bold text-white mb-4 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
          Ready to explore?
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/visiting">
            <button className="px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-xl hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all transform hover:scale-105 text-sm">
              🧳 I'm Visiting
            </button>
          </Link>
          <Link href="/living">
            <button className="px-6 py-3 bg-gradient-to-r from-aurora-blue to-aurora-purple text-white font-semibold rounded-xl hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all transform hover:scale-105 text-sm">
              🏠 I Live Here
            </button>
          </Link>
          <Link href="/moving">
            <button className="px-6 py-3 bg-gradient-to-r from-aurora-purple to-aurora-pink text-white font-semibold rounded-xl hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all transform hover:scale-105 text-sm">
              📦 I'm Moving Here
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
