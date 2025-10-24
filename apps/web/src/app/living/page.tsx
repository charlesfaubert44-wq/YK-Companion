import Link from 'next/link';

export default function LivingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-gray-400 hover:text-aurora-green transition inline-flex items-center gap-2 mb-8">
          ← YK Buddy
        </Link>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🏠</div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Living in Yellowknife
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Local events, seasonal guides, hidden gems, and community resources for residents.
            </p>
          </div>

          {/* Key Features for Residents */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Link href="/living/garage-sales" className="group">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:border-aurora-green transition-all">
                <div className="text-4xl mb-4">🛒</div>
                <h3 className="text-2xl font-bold text-white mb-3">Garage Sale Planner</h3>
                <p className="text-gray-300 mb-4">
                  Find garage sales on the map, plan your route, and save your favorites. Smart itinerary generator included!
                </p>
                <div className="text-aurora-green font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Find Sales <span>→</span>
                </div>
              </div>
            </Link>

            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 opacity-60">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-white mb-3">Local Events</h3>
              <p className="text-gray-300 mb-4">
                Community festivals, markets, sports leagues, and social gatherings happening this month.
              </p>
              <div className="text-gray-400 font-semibold">
                Coming Soon
              </div>
            </div>

            <Link href="/aurora" className="group">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:border-aurora-blue transition-all">
                <div className="text-4xl mb-4">🌌</div>
                <h3 className="text-2xl font-bold text-white mb-3">Tonight's Aurora</h3>
                <p className="text-gray-300 mb-4">
                  Don't miss spectacular shows in your own backyard. Get real-time forecasts and alerts.
                </p>
                <div className="text-aurora-blue font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Check Tonight <span>→</span>
                </div>
              </div>
            </Link>

            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 opacity-60">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-2xl font-bold text-white mb-3">Local Favorites</h3>
              <p className="text-gray-300 mb-4">
                Best restaurants, shops, and services recommended by locals, not tourists.
              </p>
              <div className="text-gray-400 font-semibold">
                Coming Soon
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 opacity-60">
              <div className="text-4xl mb-4">❄️</div>
              <h3 className="text-2xl font-bold text-white mb-3">Seasonal Tips</h3>
              <p className="text-gray-300 mb-4">
                Month-by-month reminders for vehicle prep, home maintenance, and seasonal activities.
              </p>
              <div className="text-gray-400 font-semibold">
                Coming Soon
              </div>
            </div>
          </div>

          {/* This Month */}
          <div className="bg-gradient-to-br from-aurora-blue/20 to-aurora-purple/20 backdrop-blur-lg p-8 rounded-2xl border-2 border-aurora-blue/30 mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">This Month in Yellowknife</h3>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-semibold">Farmers Market</h4>
                  <span className="text-sm text-aurora-green">Every Saturday</span>
                </div>
                <p className="text-gray-400 text-sm">Local produce, crafts, and food trucks. Runs through September.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-semibold">Folk on the Rocks Festival</h4>
                  <span className="text-sm text-aurora-green">July 14-16</span>
                </div>
                <p className="text-gray-400 text-sm">Annual music festival featuring northern and Canadian artists at Long Lake.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg opacity-60">
                <p className="text-gray-400 text-sm italic">More events coming soon...</p>
              </div>
            </div>
          </div>

          {/* Community Resources */}
          <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">Community Resources</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-3">Recreation & Sports</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>• Fieldhouse (Gym, Track, Courts)</li>
                  <li>• Ruth Inch Memorial Pool</li>
                  <li>• Multiplex (Ice Rinks)</li>
                  <li>• Climbing Gym</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Libraries & Learning</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>• Yellowknife Public Library</li>
                  <li>• NWT Centennial Library</li>
                  <li>• Prince of Wales Northern Heritage Centre</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Seasonal Preparation */}
          <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">October Checklist</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <div className="text-white font-semibold">Switch to Winter Tires</div>
                  <div className="text-gray-400 text-sm">Legally required by October 1st</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <div className="text-white font-semibold">Block Heater & Extension Cord</div>
                  <div className="text-gray-400 text-sm">Test your block heater and get outdoor-rated cords</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <div className="text-white font-semibold">Emergency Winter Kit (Vehicle)</div>
                  <div className="text-gray-400 text-sm">Blanket, candle, matches, shovel, sand/kitty litter</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <div className="text-white font-semibold">Home Heating Check</div>
                  <div className="text-gray-400 text-sm">Service furnace, seal windows, stock up on fuel</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
