import Link from 'next/link';

export default function VisitingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-gray-400 hover:text-aurora-green transition inline-flex items-center gap-2 mb-8">
          ← YK Buddy
        </Link>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🧳</div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Planning Your Visit
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to plan the perfect Yellowknife trip—from aurora forecasts to real costs.
            </p>
          </div>

          {/* Key Features for Visitors */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Link href="/quiz" className="group">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:border-aurora-green transition-all">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-white mb-3">Traveler Quiz</h3>
                <p className="text-gray-300 mb-4">
                  Take our 2-minute quiz to get personalized recommendations based on your travel style.
                </p>
                <div className="text-aurora-green font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Take Quiz <span>→</span>
                </div>
              </div>
            </Link>

            <Link href="/calculator" className="group">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:border-aurora-blue transition-all">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-white mb-3">Cost Calculator</h3>
                <p className="text-gray-300 mb-4">
                  Get transparent pricing breakdown for accommodation, activities, food, and more.
                </p>
                <div className="text-aurora-blue font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Calculate Costs <span>→</span>
                </div>
              </div>
            </Link>

            <Link href="/aurora" className="group">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:border-aurora-purple transition-all">
                <div className="text-4xl mb-4">🌌</div>
                <h3 className="text-2xl font-bold text-white mb-3">Aurora Forecast</h3>
                <p className="text-gray-300 mb-4">
                  Real-time northern lights predictions, KP index, cloud cover, and best viewing times.
                </p>
                <div className="text-aurora-purple font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Check Forecast <span>→</span>
                </div>
              </div>
            </Link>

            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 opacity-60">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-white mb-3">Seasonal Planning</h3>
              <p className="text-gray-300 mb-4">
                Month-by-month guide for temperature, daylight, aurora probability, and pricing.
              </p>
              <div className="text-gray-400 font-semibold">
                Coming Soon
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-aurora-green/20 to-aurora-blue/20 backdrop-blur-lg p-8 rounded-2xl border-2 border-aurora-green/30 mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">Quick Trip Insights</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-400 mb-1">Average Trip Length</div>
                <div className="text-3xl font-bold text-white">4-5 days</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Best Aurora Season</div>
                <div className="text-3xl font-bold text-white">Nov-Mar</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Typical Budget (2 people)</div>
                <div className="text-3xl font-bold text-white">$2,500-$4,000</div>
              </div>
            </div>
          </div>

          {/* Common Questions */}
          <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Common Visitor Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">When is the best time to see the aurora?</h4>
                <p className="text-gray-400 text-sm">November through March offers the darkest skies. Aurora activity peaks around the equinoxes (March and September).</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">How cold does it actually get?</h4>
                <p className="text-gray-400 text-sm">Winter averages -25°C to -35°C, with extremes reaching -40°C. But with proper gear (which we'll help you with), it's manageable.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Do I need to rent a car?</h4>
                <p className="text-gray-400 text-sm">Depends on your itinerary. Downtown is walkable, but a car gives you flexibility for aurora viewing locations and day trips.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
