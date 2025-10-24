'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CalculatorPage() {
  const [travelers, setTravelers] = useState(2);
  const [nights, setNights] = useState(4);
  const [season, setSeason] = useState('winter');
  const [accommodation, setAccommodation] = useState('moderate');
  const [activities, setActivities] = useState<string[]>(['aurora']);
  const [rentalCar, setRentalCar] = useState(true);

  // Pricing data (mock)
  const pricing = {
    accommodation: {
      budget: 120,
      moderate: 200,
      luxury: 400,
    },
    activities: {
      aurora: 180,
      dogsledding: 250,
      fishing: 150,
      cultural: 100,
      icefishing: 180,
      snowmobile: 300,
    },
    food: 75, // per person per day
    rentalCar: 80, // per day
    flights: 600, // per person estimate
  };

  const calculateCosts = () => {
    const accommodationCost = pricing.accommodation[accommodation as keyof typeof pricing.accommodation] * nights * (accommodation === 'luxury' ? 1 : travelers);

    const activitiesCost = activities.reduce((sum, activity) => {
      return sum + (pricing.activities[activity as keyof typeof pricing.activities] || 0);
    }, 0) * travelers;

    const foodCost = pricing.food * travelers * nights;
    const carCost = rentalCar ? pricing.rentalCar * nights : 0;
    const flightsCost = pricing.flights * travelers;

    return {
      accommodation: accommodationCost,
      activities: activitiesCost,
      food: foodCost,
      transportation: carCost + flightsCost,
      gear: 0,
      other: 100 * travelers,
    };
  };

  const costs = calculateCosts();
  const total = Object.values(costs).reduce((a, b) => a + b, 0);
  const perPerson = total / travelers;

  const toggleActivity = (activity: string) => {
    if (activities.includes(activity)) {
      setActivities(activities.filter((a) => a !== activity));
    } else {
      setActivities([...activities, activity]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-gray-400 hover:text-aurora-green transition inline-flex items-center gap-2 mb-8">
          ← YK Buddy
        </Link>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Trip Cost Calculator
            </h1>
            <p className="text-xl text-gray-300">
              Remote travel is expensive—we get it. Here's the real breakdown, no surprises.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Inputs */}
            <div className="space-y-6">
              {/* Travelers */}
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
                <label className="block text-white font-semibold mb-3">
                  Number of Travelers
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 text-white font-bold"
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold text-white w-16 text-center">
                    {travelers}
                  </span>
                  <button
                    onClick={() => setTravelers(travelers + 1)}
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Nights */}
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
                <label className="block text-white font-semibold mb-3">
                  Number of Nights
                </label>
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={nights}
                  onChange={(e) => setNights(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>1 night</span>
                  <span className="text-aurora-green font-bold">{nights} nights</span>
                  <span>14 nights</span>
                </div>
              </div>

              {/* Season */}
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
                <label className="block text-white font-semibold mb-3">
                  Season
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['winter', 'spring', 'summer', 'fall'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSeason(s)}
                      className={`p-4 rounded-lg border-2 transition ${
                        season === s
                          ? 'bg-aurora-gradient border-aurora-green text-white'
                          : 'bg-white/5 border-white/20 text-gray-300 hover:border-aurora-green/50'
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accommodation */}
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
                <label className="block text-white font-semibold mb-3">
                  Accommodation Type
                </label>
                <div className="space-y-2">
                  {[
                    { key: 'budget', label: 'Budget ($120/night)', emoji: '🏨' },
                    { key: 'moderate', label: 'Moderate ($200/night)', emoji: '🏨' },
                    { key: 'luxury', label: 'Luxury ($400/night)', emoji: '✨' },
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setAccommodation(option.key)}
                      className={`w-full p-4 rounded-lg border-2 transition text-left ${
                        accommodation === option.key
                          ? 'bg-aurora-blue/20 border-aurora-blue text-white'
                          : 'bg-white/5 border-white/20 text-gray-300 hover:border-aurora-blue/50'
                      }`}
                    >
                      <span className="mr-2">{option.emoji}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
                <label className="block text-white font-semibold mb-3">
                  Select Activities
                </label>
                <div className="space-y-2">
                  {[
                    { key: 'aurora', label: 'Aurora Viewing Tour', price: 180, emoji: '🌌' },
                    { key: 'dogsledding', label: 'Dog Sledding', price: 250, emoji: '🐕' },
                    { key: 'fishing', label: 'Great Slave Lake Fishing', price: 150, emoji: '🎣' },
                    { key: 'cultural', label: 'Indigenous Cultural Experience', price: 100, emoji: '🏔️' },
                    { key: 'icefishing', label: 'Ice Fishing', price: 180, emoji: '🧊' },
                    { key: 'snowmobile', label: 'Snowmobile Adventure', price: 300, emoji: '🏍️' },
                  ].map((activity) => (
                    <button
                      key={activity.key}
                      onClick={() => toggleActivity(activity.key)}
                      className={`w-full p-3 rounded-lg border-2 transition text-left flex justify-between items-center ${
                        activities.includes(activity.key)
                          ? 'bg-aurora-green/20 border-aurora-green text-white'
                          : 'bg-white/5 border-white/20 text-gray-300 hover:border-aurora-green/50'
                      }`}
                    >
                      <span>
                        <span className="mr-2">{activity.emoji}</span>
                        {activity.label}
                      </span>
                      <span className="font-bold">${activity.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rental Car */}
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="block text-white font-semibold mb-1">
                      Rental Car
                    </span>
                    <span className="text-sm text-gray-400">
                      $80/day
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={rentalCar}
                    onChange={(e) => setRentalCar(e.target.checked)}
                    className="w-6 h-6"
                  />
                </label>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="lg:sticky lg:top-8 h-fit">
              <div className="bg-gradient-to-br from-aurora-green/20 to-aurora-blue/20 backdrop-blur-lg p-8 rounded-2xl border-2 border-aurora-green/30">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Trip Cost Estimate
                </h2>

                {/* Cost Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center pb-3 border-b border-white/20">
                    <span className="text-gray-300">Accommodation</span>
                    <span className="text-white font-bold">${costs.accommodation.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/20">
                    <span className="text-gray-300">Activities</span>
                    <span className="text-white font-bold">${costs.activities.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/20">
                    <span className="text-gray-300">Food & Dining</span>
                    <span className="text-white font-bold">${costs.food.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/20">
                    <span className="text-gray-300">Transportation</span>
                    <span className="text-white font-bold">${costs.transportation.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/20">
                    <span className="text-gray-300">Other (tips, misc)</span>
                    <span className="text-white font-bold">${costs.other.toLocaleString()}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-white/10 p-6 rounded-xl mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl text-gray-300">Total Trip Cost</span>
                    <span className="text-3xl font-bold text-aurora-green">
                      ${total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Per Person</span>
                    <span className="text-xl font-bold text-white">
                      ${Math.round(perPerson).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Money Saving Tips */}
                <div className="bg-aurora-blue/10 border border-aurora-blue/30 p-4 rounded-lg mb-6">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    💡 Money-Saving Tip
                  </h3>
                  <p className="text-sm text-gray-300">
                    Visit in shoulder season (Sep-Oct or Apr-May) to save 20-30% on accommodation and activities!
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Link
                    href="/activities"
                    className="block w-full px-6 py-4 bg-aurora-gradient text-white text-center font-semibold rounded-xl hover:shadow-aurora transition"
                  >
                    Explore Activities →
                  </Link>
                  <button className="block w-full px-6 py-4 bg-white/10 border-2 border-white/20 text-white text-center font-semibold rounded-xl hover:bg-white/20 transition">
                    Download PDF Estimate
                  </button>
                  <button className="block w-full px-6 py-4 bg-white/10 border-2 border-white/20 text-white text-center font-semibold rounded-xl hover:bg-white/20 transition">
                    Email Me This Quote
                  </button>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-500 mt-4 text-center">
                Estimates based on average 2025 pricing. Actual costs may vary.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
