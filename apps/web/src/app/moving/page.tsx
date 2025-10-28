'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import InteractiveHeader from '@/components/InteractiveHeader';

interface ChecklistSection {
  id: string;
  title: string;
  timeframe: string;
  items: { id: string; text: string }[];
}

export default function MovingPage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['section1']));

  const checklistSections: ChecklistSection[] = [
    {
      id: 'section1',
      title: '3-6 Months Before',
      timeframe: '3-6 months',
      items: [
        { id: '1', text: 'Research housing market and neighborhoods' },
        { id: '2', text: 'Secure employment or remote work arrangement' },
        { id: '3', text: 'Visit Yellowknife to scout locations' },
        { id: '4', text: 'Research schools (if applicable)' },
      ],
    },
    {
      id: 'section2',
      title: '1-2 Months Before',
      timeframe: '1-2 months',
      items: [
        { id: '5', text: 'Book accommodation or finalize housing' },
        { id: '6', text: 'Arrange moving company or shipping' },
        { id: '7', text: 'Set up utilities (power, internet, phone)' },
        { id: '8', text: 'Register vehicle and get NWT license' },
        { id: '9', text: 'Update health card and find family doctor' },
      ],
    },
    {
      id: 'section3',
      title: 'First Month',
      timeframe: 'first month',
      items: [
        { id: '10', text: 'Get NWT Driver\'s License (90 days to transfer)' },
        { id: '11', text: 'Register kids for school/daycare' },
        { id: '12', text: 'Join community groups or sports leagues' },
        { id: '13', text: 'Find your favorite coffee shop (important!)' },
      ],
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

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const totalItems = checklistSections.reduce((sum, section) => sum + section.items.length, 0);
  const completionPercentage = (checkedItems.size / totalItems) * 100;

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
                <span className="text-white">Moving</span>
              </div>
            </div>

            {/* Page Header */}
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">📦</div>
              <h1 className="text-5xl font-bold text-white mb-4">
                Moving to Yellowknife
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Everything you need to relocate successfully—from housing costs to climate prep.
              </p>
            </div>

            {/* Key Topics */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 opacity-60 relative overflow-hidden group hover:opacity-70 transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-r from-aurora-green/10 to-aurora-blue/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="text-4xl mb-4">🏘️</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Housing Market</h3>
                  <p className="text-gray-300 mb-4">
                    Current rental and purchase prices, neighborhoods, and what to expect.
                  </p>
                  <div className="text-gray-400 font-semibold inline-flex items-center gap-2">
                    Coming Soon <span className="animate-pulse">✨</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 opacity-60 relative overflow-hidden group hover:opacity-70 transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-r from-aurora-purple/10 to-aurora-pink/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="text-4xl mb-4">💼</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Job Market</h3>
                  <p className="text-gray-300 mb-4">
                    Major employers, in-demand skills, average salaries, and remote opportunities.
                  </p>
                  <div className="text-gray-400 font-semibold inline-flex items-center gap-2">
                    Coming Soon <span className="animate-pulse">✨</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 opacity-60 relative overflow-hidden group hover:opacity-70 transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-r from-aurora-blue/10 to-aurora-purple/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="text-4xl mb-4">💸</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Cost of Living</h3>
                  <p className="text-gray-300 mb-4">
                    Real monthly costs for groceries, utilities, transportation, and more.
                  </p>
                  <div className="text-gray-400 font-semibold inline-flex items-center gap-2">
                    Coming Soon <span className="animate-pulse">✨</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="bg-gradient-to-br from-aurora-purple/20 to-aurora-pink/20 backdrop-blur-lg p-8 rounded-2xl border-2 border-aurora-purple/30 mb-12 hover:border-aurora-purple/50 transition-all">
              <h3 className="text-2xl font-bold text-white mb-6">At a Glance</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all group cursor-pointer transform hover:scale-[1.02]">
                    <div className="text-sm text-gray-400 mb-1 group-hover:text-gray-300 transition-colors">Population</div>
                    <div className="text-2xl font-bold text-white group-hover:text-aurora-purple transition-colors">~20,000</div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all group cursor-pointer transform hover:scale-[1.02]">
                    <div className="text-sm text-gray-400 mb-1 group-hover:text-gray-300 transition-colors">Average 1BR Rent</div>
                    <div className="text-2xl font-bold text-white group-hover:text-aurora-green transition-colors">$1,400-$1,800/mo</div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all group cursor-pointer transform hover:scale-[1.02]">
                    <div className="text-sm text-gray-400 mb-1 group-hover:text-gray-300 transition-colors">Average Home Price</div>
                    <div className="text-2xl font-bold text-white group-hover:text-aurora-blue transition-colors">$450,000-$550,000</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all group cursor-pointer transform hover:scale-[1.02]">
                    <div className="text-sm text-gray-400 mb-1 group-hover:text-gray-300 transition-colors">Median Household Income</div>
                    <div className="text-2xl font-bold text-white group-hover:text-aurora-purple transition-colors">~$130,000</div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all group cursor-pointer transform hover:scale-[1.02]">
                    <div className="text-sm text-gray-400 mb-1 group-hover:text-gray-300 transition-colors">Unemployment Rate</div>
                    <div className="text-2xl font-bold text-white group-hover:text-aurora-green transition-colors">~8%</div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all group cursor-pointer transform hover:scale-[1.02]">
                    <div className="text-sm text-gray-400 mb-1 group-hover:text-gray-300 transition-colors">Major Industries</div>
                    <div className="text-lg text-white group-hover:text-aurora-blue transition-colors">Mining, Government, Tourism</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Climate Preparation */}
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 mb-12">
              <h3 className="text-2xl font-bold text-white mb-6">Preparing for the Climate</h3>
              <p className="text-gray-300 mb-6">
                The biggest adjustment for newcomers. Here's what you need to know:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2 group-hover:text-aurora-blue transition-colors">
                    ❄️ Winter (-25°C to -35°C)
                  </h4>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li className="hover:text-white transition-colors">• Budget $500-800 for proper winter gear</li>
                    <li className="hover:text-white transition-colors">• Block heater is essential (not optional)</li>
                    <li className="hover:text-white transition-colors">• Heating costs: $200-400/month</li>
                    <li className="hover:text-white transition-colors">• Snow tires required by law (Oct 1 - Apr 30)</li>
                    <li className="hover:text-white transition-colors">• Shorter days (4-5 hours of daylight in Dec)</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-aurora-green/10 to-aurora-blue/10 p-6 rounded-lg border border-aurora-green/20 hover:border-aurora-green/40 transition-all group">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2 group-hover:text-aurora-green transition-colors">
                    ☀️ Summer (15°C to 25°C)
                  </h4>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li className="hover:text-white transition-colors">• 20+ hours of daylight in June</li>
                    <li className="hover:text-white transition-colors">• Mosquitoes are intense (bring bug spray)</li>
                    <li className="hover:text-white transition-colors">• Short but beautiful growing season</li>
                    <li className="hover:text-white transition-colors">• Forest fire smoke can affect air quality</li>
                    <li className="hover:text-white transition-colors">• Best weather for exploring outdoors</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Interactive Relocation Checklist */}
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Relocation Checklist</h3>
              <div className="text-right">
                <div className="text-sm text-gray-400">Progress</div>
                <div className="text-2xl font-bold text-aurora-purple">
                  {checkedItems.size}/{totalItems}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6 bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-aurora-purple to-aurora-pink transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="space-y-4">
              {checklistSections.map((section) => {
                const sectionCheckedCount = section.items.filter(item => checkedItems.has(item.id)).length;
                const sectionProgress = (sectionCheckedCount / section.items.length) * 100;

                return (
                  <div
                    key={section.id}
                    className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all"
                  >
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full text-left p-4 flex justify-between items-center group"
                    >
                      <div className="flex-1">
                        <h4 className="text-white font-semibold group-hover:text-aurora-purple transition-colors">
                          {section.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-aurora-purple transition-all duration-300"
                              style={{ width: `${sectionProgress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">
                            {sectionCheckedCount}/{section.items.length}
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 ml-4 transition-transform duration-300 ${
                          expandedSections.has(section.id) ? 'rotate-180 text-aurora-purple' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedSections.has(section.id) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-4 pb-4 space-y-2">
                        {section.items.map((item) => (
                          <div
                            key={item.id}
                            className={`flex items-center gap-2 p-2 rounded transition-all ${
                              checkedItems.has(item.id)
                                ? 'bg-aurora-purple/10'
                                : 'hover:bg-white/5'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checkedItems.has(item.id)}
                              onChange={() => toggleCheckbox(item.id)}
                              className="w-4 h-4 rounded cursor-pointer accent-aurora-purple"
                            />
                            <span
                              className={`text-sm transition-all ${
                                checkedItems.has(item.id)
                                  ? 'text-gray-400 line-through'
                                  : 'text-gray-300'
                              }`}
                            >
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {completionPercentage === 100 && (
              <div className="mt-6 p-4 bg-aurora-purple/20 border border-aurora-purple/30 rounded-lg text-center animate-pulse">
                <span className="text-aurora-purple font-semibold">🎉 Congratulations! You're all set for your move to Yellowknife!</span>
              </div>
            )}
          </div>

          {/* Why People Move Here */}
          <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Why People Choose Yellowknife</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-aurora-green/10 to-transparent p-6 rounded-lg border border-aurora-green/20 hover:border-aurora-green/40 transition-all">
                <h4 className="text-aurora-green font-semibold mb-3 text-lg">The Pros</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="hover:text-white transition-colors cursor-default">• No provincial sales tax (GST only)</li>
                  <li className="hover:text-white transition-colors cursor-default">• Higher salaries than southern Canada</li>
                  <li className="hover:text-white transition-colors cursor-default">• Tight-knit, friendly community</li>
                  <li className="hover:text-white transition-colors cursor-default">• Incredible natural beauty and aurora access</li>
                  <li className="hover:text-white transition-colors cursor-default">• Unique northern culture and lifestyle</li>
                  <li className="hover:text-white transition-colors cursor-default">• Low crime rate</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-red-500/10 to-transparent p-6 rounded-lg border border-red-500/20 hover:border-red-500/40 transition-all">
                <h4 className="text-red-400 font-semibold mb-3 text-lg">The Challenges</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="hover:text-white transition-colors cursor-default">• High cost of living (especially food)</li>
                  <li className="hover:text-white transition-colors cursor-default">• Extreme winter temperatures</li>
                  <li className="hover:text-white transition-colors cursor-default">• Limited shopping and services</li>
                  <li className="hover:text-white transition-colors cursor-default">• Expensive to travel south</li>
                  <li className="hover:text-white transition-colors cursor-default">• Dark winters can affect mental health</li>
                  <li className="hover:text-white transition-colors cursor-default">• Housing shortage</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
