'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import InteractiveHeader from '@/components/InteractiveHeader';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
}

export default function LivingPage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [expandedResources, setExpandedResources] = useState<string | null>(null);

  const checklistItems: ChecklistItem[] = [
    { id: '1', title: 'Switch to Winter Tires', description: 'Legally required by October 1st' },
    {
      id: '2',
      title: 'Block Heater & Extension Cord',
      description: 'Test your block heater and get outdoor-rated cords',
    },
    {
      id: '3',
      title: 'Emergency Winter Kit (Vehicle)',
      description: 'Blanket, candle, matches, shovel, sand/kitty litter',
    },
    {
      id: '4',
      title: 'Home Heating Check',
      description: 'Service furnace, seal windows, stock up on fuel',
    },
  ];

  const toggleCheckbox = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const toggleResource = (section: string) => {
    setExpandedResources(expandedResources === section ? null : section);
  };

  const completionPercentage = (checkedItems.size / checklistItems.length) * 100;

  return (
    <>
      <InteractiveHeader />
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Link href="/" className="hover:text-aurora-green transition-colors">
                  YK Buddy
                </Link>
                <span>›</span>
                <span className="text-white">Living</span>
              </div>
            </div>

            {/* Page Header */}
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">🏠</div>
              <h1 className="text-5xl font-bold text-white mb-4">Living in Yellowknife</h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Local events, seasonal guides, hidden gems, and community resources for residents.
              </p>
            </div>

            {/* Key Features for Residents */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Link
                href="/living/garage-sales"
                className="group transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:border-aurora-green hover:shadow-2xl hover:shadow-aurora-green/20 transition-all h-full">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🛒</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Garage Sale Planner</h3>
                  <p className="text-gray-300 mb-4">
                    Find garage sales on the map, plan your route, and save your favorites. Smart
                    itinerary generator included!
                  </p>
                  <div className="text-aurora-green font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Find Sales{' '}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>

              <Link
                href="/living/neighborhoods"
                className="group transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:border-aurora-purple hover:shadow-2xl hover:shadow-aurora-purple/20 transition-all h-full">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏘️</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Your Neighborhood</h3>
                  <p className="text-gray-300 mb-4">
                    Connect with neighbors, share alerts, discover local businesses, and build a
                    stronger community together.
                  </p>
                  <div className="text-aurora-purple font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Join Your Community{' '}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>

              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 opacity-60 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-aurora-purple/10 to-aurora-pink/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="text-4xl mb-4">📅</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Local Events</h3>
                  <p className="text-gray-300 mb-4">
                    Community festivals, markets, sports leagues, and social gatherings happening
                    this month.
                  </p>
                  <div className="text-gray-400 font-semibold inline-flex items-center gap-2">
                    Coming Soon <span className="animate-pulse">✨</span>
                  </div>
                </div>
              </div>

              <Link
                href="/aurora"
                className="group transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:border-aurora-blue hover:shadow-2xl hover:shadow-aurora-blue/20 transition-all h-full">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🌌</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Tonight's Aurora</h3>
                  <p className="text-gray-300 mb-4">
                    Don't miss spectacular shows in your own backyard. Get real-time forecasts and
                    alerts.
                  </p>
                  <div className="text-aurora-blue font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Check Tonight{' '}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>

              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 opacity-60 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-aurora-green/10 to-aurora-blue/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="text-4xl mb-4">🍽️</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Local Favorites</h3>
                  <p className="text-gray-300 mb-4">
                    Best restaurants, shops, and services recommended by locals, not tourists.
                  </p>
                  <div className="text-gray-400 font-semibold inline-flex items-center gap-2">
                    Coming Soon <span className="animate-pulse">✨</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 opacity-60 relative overflow-hidden group md:col-span-2">
                <div className="absolute inset-0 bg-gradient-to-r from-aurora-purple/10 to-aurora-pink/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="text-4xl mb-4">❄️</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Seasonal Tips</h3>
                  <p className="text-gray-300 mb-4">
                    Month-by-month reminders for vehicle prep, home maintenance, and seasonal
                    activities.
                  </p>
                  <div className="text-gray-400 font-semibold inline-flex items-center gap-2">
                    Coming Soon <span className="animate-pulse">✨</span>
                  </div>
                </div>
              </div>
            </div>

            {/* This Month */}
            <div className="bg-gradient-to-br from-aurora-blue/20 to-aurora-purple/20 backdrop-blur-lg p-8 rounded-2xl border-2 border-aurora-blue/30 mb-12 hover:border-aurora-blue/50 transition-all">
              <h3 className="text-2xl font-bold text-white mb-6">This Month in Yellowknife</h3>
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all group cursor-pointer transform hover:scale-[1.02]">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-semibold group-hover:text-aurora-green transition-colors">
                      Farmers Market
                    </h4>
                    <span className="text-sm text-aurora-green px-3 py-1 bg-aurora-green/10 rounded-full">
                      Every Saturday
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Local produce, crafts, and food trucks. Runs through September.
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all group cursor-pointer transform hover:scale-[1.02]">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-semibold group-hover:text-aurora-blue transition-colors">
                      Folk on the Rocks Festival
                    </h4>
                    <span className="text-sm text-aurora-blue px-3 py-1 bg-aurora-blue/10 rounded-full">
                      July 14-16
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Annual music festival featuring northern and Canadian artists at Long Lake.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Community Resources */}
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 mb-12">
              <h3 className="text-2xl font-bold text-white mb-6">Community Resources</h3>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleResource('recreation')}
                    className="w-full text-left p-4 flex justify-between items-center group hover:bg-white/10 transition-all"
                  >
                    <h4 className="text-white font-semibold group-hover:text-aurora-green transition-colors">
                      Recreation & Sports
                    </h4>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                        expandedResources === 'recreation' ? 'rotate-90 text-aurora-green' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedResources === 'recreation'
                        ? 'max-h-48 opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <ul className="space-y-2 px-4 pb-4 text-gray-400 text-sm">
                      <li className="hover:text-white transition-colors cursor-pointer">
                        • Fieldhouse (Gym, Track, Courts)
                      </li>
                      <li className="hover:text-white transition-colors cursor-pointer">
                        • Ruth Inch Memorial Pool
                      </li>
                      <li className="hover:text-white transition-colors cursor-pointer">
                        • Multiplex (Ice Rinks)
                      </li>
                      <li className="hover:text-white transition-colors cursor-pointer">
                        • Climbing Gym
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleResource('learning')}
                    className="w-full text-left p-4 flex justify-between items-center group hover:bg-white/10 transition-all"
                  >
                    <h4 className="text-white font-semibold group-hover:text-aurora-blue transition-colors">
                      Libraries & Learning
                    </h4>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                        expandedResources === 'learning' ? 'rotate-90 text-aurora-blue' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedResources === 'learning'
                        ? 'max-h-48 opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <ul className="space-y-2 px-4 pb-4 text-gray-400 text-sm">
                      <li className="hover:text-white transition-colors cursor-pointer">
                        • Yellowknife Public Library
                      </li>
                      <li className="hover:text-white transition-colors cursor-pointer">
                        • NWT Centennial Library
                      </li>
                      <li className="hover:text-white transition-colors cursor-pointer">
                        • Prince of Wales Northern Heritage Centre
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Seasonal Checklist */}
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">October Checklist</h3>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Progress</div>
                  <div className="text-2xl font-bold text-aurora-green">
                    {checkedItems.size}/{checklistItems.length}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6 bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-aurora-green to-aurora-blue transition-all duration-500 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              <div className="space-y-3">
                {checklistItems.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                      checkedItems.has(item.id)
                        ? 'bg-aurora-green/10 border border-aurora-green/30'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems.has(item.id)}
                      onChange={() => toggleCheckbox(item.id)}
                      className="mt-1 w-5 h-5 rounded cursor-pointer accent-aurora-green"
                    />
                    <div className="flex-1">
                      <div
                        className={`font-semibold transition-all ${
                          checkedItems.has(item.id) ? 'text-gray-400 line-through' : 'text-white'
                        }`}
                      >
                        {item.title}
                      </div>
                      <div
                        className={`text-sm transition-all ${
                          checkedItems.has(item.id) ? 'text-gray-500' : 'text-gray-400'
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {completionPercentage === 100 && (
                <div className="mt-6 p-4 bg-aurora-green/20 border border-aurora-green/30 rounded-lg text-center animate-pulse">
                  <span className="text-aurora-green font-semibold">
                    🎉 All tasks completed! You're ready for winter!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
