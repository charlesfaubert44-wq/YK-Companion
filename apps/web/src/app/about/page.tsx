'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

interface TeamMember {
  name: string;
  role: string;
  emoji: string;
  bio: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Sarah Johnson',
    role: 'Founder & Community Lead',
    emoji: '👩‍💼',
    bio: 'Born and raised in Yellowknife, Sarah has spent over a decade connecting visitors with authentic Northern experiences. She started YK Buddy after realizing how scattered information about the city really was.',
  },
  {
    name: 'Mike Chen',
    role: 'Developer & UX Designer',
    emoji: '👨‍💻',
    bio: "Building tech solutions that actually work at -40°C. Mike moved to Yellowknife for a tech job and fell in love with the community. Now he's dedicated to creating digital tools that make life easier for everyone.",
  },
  {
    name: 'Emma Wilson',
    role: 'Content Creator & Aurora Photographer',
    emoji: '✍️',
    bio: 'Storyteller, aurora chaser, and community connector. Emma documents the magic of the North through photography and writing, helping visitors and residents alike discover hidden gems.',
  },
];

export default function AboutPage() {
  const { t } = useLanguage();
  const [expandedMember, setExpandedMember] = useState<number | null>(null);

  const toggleMember = (index: number) => {
    setExpandedMember(expandedMember === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900">
      {/* Top Navigation */}
      <div className="fixed top-6 left-6 right-6 z-50 flex justify-between items-center">
        <Link
          href="/"
          className="text-gray-400 hover:text-aurora-green transition-colors text-sm flex items-center gap-2"
        >
          <span>←</span> Back to Home
        </Link>
        <LanguageSelector />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Header with Logo */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-aurora-green/30 to-aurora-blue/30 rounded-full flex items-center justify-center border-4 border-aurora-green">
              <span className="text-5xl md:text-6xl font-bold text-aurora-green">YK</span>
            </div>
            <div className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 bg-aurora-green/20 rounded-full blur-xl -z-10 animate-pulse"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
            About YK Buddy
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 italic font-light">
            Because Nobody Should Face -40° Alone
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8 text-gray-300 leading-relaxed">
          {/* The Reality */}
          <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-3xl">🥶</span> The Reality
            </h2>
            <p className="text-lg mb-4">
              Let's be honest: Yellowknife is absolutely beautiful, wildly unique, and occasionally
              trying to kill you with its weather.
            </p>
            <p className="text-lg">
              Whether you're a tourist Googling "will my phone work at -40?" at 2 AM, a resident
              trying to remember which neighbor has the best garage sales, or someone brave enough
              to move here (respect), you've probably noticed something:{' '}
              <span className="text-aurora-blue font-semibold">there's a LOT to figure out</span>.
            </p>
          </section>

          {/* The Problem */}
          <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-3xl">🤔</span> The Problem
            </h2>
            <p className="text-lg mb-4">
              Information about Yellowknife is scattered across fourteen different Facebook groups,
              buried in tourism websites last updated in 2012, and locked in the minds of locals who
              have learned to dress in layers that would make an onion jealous.
            </p>
            <p className="text-lg">
              Want to know if the aurora will be visible tonight? Check five different websites and
              interpret the KP index like you're decoding ancient runes. Need to find a good moving
              company? Hope you know someone who knows someone. Looking for garage sales? Better
              scroll through endless Facebook posts while your coffee gets cold.
            </p>
          </section>

          {/* The Solution */}
          <section className="bg-gradient-to-br from-aurora-green/20 to-aurora-blue/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-aurora-green/30 hover:border-aurora-green/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-3xl">💡</span> Enter YK Buddy
            </h2>
            <p className="text-lg mb-4">
              YK Buddy is your friendly neighborhood digital companion for all things Yellowknife.
              We're here to make life in the North a little easier, a lot more fun, and
              significantly less "oh god why is my car making that noise."
            </p>
            <div className="space-y-4 text-base">
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">🧳</span>
                <div>
                  <strong className="text-aurora-green">For Visitors:</strong> Aurora forecasts that
                  actually make sense, seasonal guides that won't lead you to bring shorts in
                  January, and insider tips from people who actually live here.
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">🏠</span>
                <div>
                  <strong className="text-aurora-blue">For Residents:</strong> Garage sale maps
                  (because treasure hunting is better with GPS), local event updates, seasonal
                  activity guides, and all the community intel you need.
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">📦</span>
                <div>
                  <strong className="text-aurora-purple">For People Moving Here:</strong> Real
                  housing market data, job opportunities, cost of living breakdowns, and honest
                  answers to questions like "do I really need a block heater?" (Yes. Yes you do.)
                </div>
              </div>
            </div>
          </section>

          {/* Meet the Team */}
          <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Meet the Team</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => toggleMember(index)}
                >
                  <div
                    className={`bg-gradient-to-br from-aurora-green/10 to-aurora-blue/10 rounded-xl p-6 border-2 transition-all ${
                      expandedMember === index
                        ? 'border-aurora-green shadow-aurora'
                        : 'border-gray-700/50 hover:border-aurora-green/50'
                    }`}
                  >
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-3">{member.emoji}</div>
                      <h3 className="text-lg font-bold text-white">{member.name}</h3>
                      <p className="text-sm text-aurora-green">{member.role}</p>
                    </div>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedMember === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="pt-4 border-t border-gray-700/50">
                        <p className="text-sm text-gray-400 leading-relaxed">{member.bio}</p>
                      </div>
                    </div>
                    <div className="text-center mt-4">
                      <span className="text-2xl text-aurora-green group-hover:scale-125 transition-transform inline-block">
                        {expandedMember === index ? '−' : '+'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">By the Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-aurora-green/20 to-aurora-green/5 rounded-xl border border-aurora-green/30">
                <div className="text-4xl font-bold text-aurora-green mb-2">2,500+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-aurora-blue/20 to-aurora-blue/5 rounded-xl border border-aurora-blue/30">
                <div className="text-4xl font-bold text-aurora-blue mb-2">150+</div>
                <div className="text-sm text-gray-400">Activities</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-aurora-purple/20 to-aurora-purple/5 rounded-xl border border-aurora-purple/30">
                <div className="text-4xl font-bold text-aurora-purple mb-2">50+</div>
                <div className="text-sm text-gray-400">Local Partners</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-aurora-pink/20 to-aurora-pink/5 rounded-xl border border-aurora-pink/30">
                <div className="text-4xl font-bold text-aurora-pink mb-2">-40°C</div>
                <div className="text-sm text-gray-400">Still Works!</div>
              </div>
            </div>
          </section>

          {/* The Mission */}
          <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-3xl">🎯</span> Our Mission
            </h2>
            <p className="text-lg mb-4">
              To be the most helpful, slightly sarcastic, but ultimately caring digital companion
              for anyone interacting with Yellowknife. We want to take all that scattered
              information, those unspoken local knowledge gems, and those "I wish someone had told
              me" moments, and put them in one place that doesn't require joining seventeen Facebook
              groups.
            </p>
            <p className="text-lg">
              Because life in the North is challenging enough without having to become a research
              scientist just to plan a weekend trip or find a good deal on a used snowblower.
            </p>
          </section>

          {/* The Promise */}
          <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-3xl">🤝</span> The Promise
            </h2>
            <div className="space-y-3 text-lg">
              <p>✓ Real, useful information (not tourist brochure fluff)</p>
              <p>✓ Regular updates (unlike that one website from 2012)</p>
              <p>✓ Built by people who actually live here</p>
              <p>✓ No BS, just helpful stuff</p>
              <p>✓ A sense of humor (because sometimes you gotta laugh when it's -45°)</p>
            </div>
          </section>

          {/* The Truth */}
          <section className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-3xl">💬</span> The Truth
            </h2>
            <p className="text-lg mb-4">
              We're not perfect. We're constantly learning, updating, and trying to make this thing
              better. If you find something that's wrong, outdated, or could be improved,{' '}
              <span className="text-aurora-green font-semibold">please tell us</span>. This is a
              community resource, and it gets better with community input.
            </p>
            <p className="text-lg">
              Yellowknife is an incredible place full of resilient, creative, and frankly slightly
              crazy (in a good way) people who have chosen to live somewhere where the sun doesn't
              rise for weeks at a time. You deserve tools that work as hard as you do.
            </p>
          </section>

          {/* The Invitation */}
          <section className="bg-gradient-to-br from-aurora-blue/20 to-aurora-purple/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-aurora-blue/30 text-center hover:border-aurora-blue/50 transition-all">
            <h2 className="text-2xl font-bold text-white mb-4">So Welcome, Friend</h2>
            <p className="text-lg mb-6">
              Whether you're here for three days or three decades, we're here to help. Because
              nobody should have to figure out the North alone.
            </p>
            <p className="text-xl text-aurora-green font-semibold italic">
              Let's do this together. ❄️
            </p>
          </section>
        </div>

        {/* CTA Buttons */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Ready to explore?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/visiting">
              <button className="px-8 py-4 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all transform hover:scale-105">
                🧳 I'm Visiting
              </button>
            </Link>
            <Link href="/living">
              <button className="px-8 py-4 bg-gradient-to-r from-aurora-blue to-aurora-purple text-white font-semibold rounded-lg hover:shadow-glow transition-all transform hover:scale-105">
                🏠 I Live Here
              </button>
            </Link>
            <Link href="/moving">
              <button className="px-8 py-4 bg-gradient-to-r from-aurora-purple to-aurora-pink text-white font-semibold rounded-lg hover:shadow-glow transition-all transform hover:scale-105">
                📦 I'm Moving Here
              </button>
            </Link>
          </div>
        </div>

        {/* Styled Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-700/30">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400">
              Made with ❤️ in Yellowknife, Northwest Territories
            </p>
            <p className="text-xs text-gray-500">
              On the traditional territory of the Yellowknives Dene First Nation
            </p>
            <p className="text-xs text-gray-500 mt-2">© 2025 YK Buddy. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
