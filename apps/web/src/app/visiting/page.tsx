'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';

interface FAQ {
  question: string;
  answer: string;
}

export default function VisitingPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      question: "When is the best time to see the aurora?",
      answer: "November through March offers the darkest skies. Aurora activity peaks around the equinoxes (March and September)."
    },
    {
      question: "How cold does it actually get?",
      answer: "Winter averages -25°C to -35°C, with extremes reaching -40°C. But with proper gear (which we'll help you with), it's manageable."
    },
    {
      question: "Do I need to rent a car?",
      answer: "Depends on your itinerary. Downtown is walkable, but a car gives you flexibility for aurora viewing locations and day trips."
    }
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="text-6xl mb-4 animate-bounce-subtle">🧳</div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Planning Your Visit
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to plan the perfect Yellowknife trip—from aurora forecasts to real costs.
            </p>
          </div>

          {/* Key Features for Visitors */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Link href="/quiz" className="group transform transition-all duration-300 hover:scale-105 hover:-translate-y-1">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:border-aurora-green hover:shadow-2xl hover:shadow-aurora-green/20 transition-all h-full">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎯</div>
                <h3 className="text-2xl font-bold text-white mb-3">Traveler Quiz</h3>
                <p className="text-gray-300 mb-4">
                  Take our 2-minute quiz to get personalized recommendations based on your travel style.
                </p>
                <div className="text-aurora-green font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Take Quiz <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>

            <Link href="/calculator" className="group transform transition-all duration-300 hover:scale-105 hover:-translate-y-1">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:border-aurora-blue hover:shadow-2xl hover:shadow-aurora-blue/20 transition-all h-full">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">💰</div>
                <h3 className="text-2xl font-bold text-white mb-3">Cost Calculator</h3>
                <p className="text-gray-300 mb-4">
                  Get transparent pricing breakdown for accommodation, activities, food, and more.
                </p>
                <div className="text-aurora-blue font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Calculate Costs <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>

            <Link href="/aurora" className="group transform transition-all duration-300 hover:scale-105 hover:-translate-y-1">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:border-aurora-purple hover:shadow-2xl hover:shadow-aurora-purple/20 transition-all h-full">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🌌</div>
                <h3 className="text-2xl font-bold text-white mb-3">Aurora Forecast</h3>
                <p className="text-gray-300 mb-4">
                  Real-time northern lights predictions, KP index, cloud cover, and best viewing times.
                </p>
                <div className="text-aurora-purple font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Check Forecast <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>

            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 opacity-60 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-aurora-green/10 to-aurora-blue/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-2xl font-bold text-white mb-3">Seasonal Planning</h3>
                <p className="text-gray-300 mb-4">
                  Month-by-month guide for temperature, daylight, aurora probability, and pricing.
                </p>
                <div className="text-gray-400 font-semibold inline-flex items-center gap-2">
                  Coming Soon <span className="animate-pulse">✨</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats with hover effects */}
          <div className="bg-gradient-to-br from-aurora-green/20 to-aurora-blue/20 backdrop-blur-lg p-8 rounded-2xl border-2 border-aurora-green/30 mb-12 hover:border-aurora-green/50 transition-all">
            <h3 className="text-2xl font-bold text-white mb-6">Quick Trip Insights</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-all group cursor-pointer transform hover:scale-105">
                <div className="text-sm text-gray-400 mb-1 group-hover:text-gray-300 transition-colors">Average Trip Length</div>
                <div className="text-3xl font-bold text-white group-hover:text-aurora-green transition-colors">4-5 days</div>
              </div>
              <div className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-all group cursor-pointer transform hover:scale-105">
                <div className="text-sm text-gray-400 mb-1 group-hover:text-gray-300 transition-colors">Best Aurora Season</div>
                <div className="text-3xl font-bold text-white group-hover:text-aurora-blue transition-colors">Nov-Mar</div>
              </div>
              <div className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-all group cursor-pointer transform hover:scale-105">
                <div className="text-sm text-gray-400 mb-1 group-hover:text-gray-300 transition-colors">Typical Budget (2 people)</div>
                <div className="text-3xl font-bold text-white group-hover:text-aurora-purple transition-colors">$2,500-$4,000</div>
              </div>
            </div>
          </div>

          {/* Interactive FAQ */}
          <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Common Visitor Questions</h3>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left p-4 flex justify-between items-center group"
                  >
                    <h4 className="text-white font-semibold group-hover:text-aurora-green transition-colors">
                      {faq.question}
                    </h4>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                        expandedFAQ === index ? 'rotate-180 text-aurora-green' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedFAQ === index ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-gray-400 text-sm px-4 pb-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}
