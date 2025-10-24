import Link from 'next/link';

export default function MovingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-gray-400 hover:text-aurora-green transition inline-flex items-center gap-2 mb-8">
          ← YK Buddy
        </Link>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
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
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 opacity-60">
              <div className="text-4xl mb-4">🏘️</div>
              <h3 className="text-2xl font-bold text-white mb-3">Housing Market</h3>
              <p className="text-gray-300 mb-4">
                Current rental and purchase prices, neighborhoods, and what to expect.
              </p>
              <div className="text-gray-400 font-semibold">
                Coming Soon
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 opacity-60">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-2xl font-bold text-white mb-3">Job Market</h3>
              <p className="text-gray-300 mb-4">
                Major employers, in-demand skills, average salaries, and remote opportunities.
              </p>
              <div className="text-gray-400 font-semibold">
                Coming Soon
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 opacity-60">
              <div className="text-4xl mb-4">💸</div>
              <h3 className="text-2xl font-bold text-white mb-3">Cost of Living</h3>
              <p className="text-gray-300 mb-4">
                Real monthly costs for groceries, utilities, transportation, and more.
              </p>
              <div className="text-gray-400 font-semibold">
                Coming Soon
              </div>
            </div>
          </div>

          {/* Quick Facts */}
          <div className="bg-gradient-to-br from-aurora-purple/20 to-aurora-pink/20 backdrop-blur-lg p-8 rounded-2xl border-2 border-aurora-purple/30 mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">At a Glance</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-400 mb-1">Population</div>
                <div className="text-2xl font-bold text-white mb-4">~20,000</div>

                <div className="text-sm text-gray-400 mb-1">Average 1BR Rent</div>
                <div className="text-2xl font-bold text-white mb-4">$1,400-$1,800/mo</div>

                <div className="text-sm text-gray-400 mb-1">Average Home Price</div>
                <div className="text-2xl font-bold text-white">$450,000-$550,000</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Median Household Income</div>
                <div className="text-2xl font-bold text-white mb-4">~$130,000</div>

                <div className="text-sm text-gray-400 mb-1">Unemployment Rate</div>
                <div className="text-2xl font-bold text-white mb-4">~8%</div>

                <div className="text-sm text-gray-400 mb-1">Major Industries</div>
                <div className="text-lg text-white">Mining, Government, Tourism</div>
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
              <div className="bg-white/5 p-6 rounded-lg">
                <h4 className="text-white font-semibold mb-3">Winter (-25°C to -35°C)</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>• Budget $500-800 for proper winter gear</li>
                  <li>• Block heater is essential (not optional)</li>
                  <li>• Heating costs: $200-400/month</li>
                  <li>• Snow tires required by law (Oct 1 - Apr 30)</li>
                  <li>• Shorter days (4-5 hours of daylight in Dec)</li>
                </ul>
              </div>
              <div className="bg-white/5 p-6 rounded-lg">
                <h4 className="text-white font-semibold mb-3">Summer (15°C to 25°C)</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>• 20+ hours of daylight in June</li>
                  <li>• Mosquitoes are intense (bring bug spray)</li>
                  <li>• Short but beautiful growing season</li>
                  <li>• Forest fire smoke can affect air quality</li>
                  <li>• Best weather for exploring outdoors</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Relocation Checklist */}
          <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">Relocation Checklist</h3>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-3">3-6 Months Before</h4>
                <div className="space-y-2 text-gray-400 text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Research housing market and neighborhoods</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Secure employment or remote work arrangement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Visit Yellowknife to scout locations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Research schools (if applicable)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-3">1-2 Months Before</h4>
                <div className="space-y-2 text-gray-400 text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Book accommodation or finalize housing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Arrange moving company or shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Set up utilities (power, internet, phone)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Register vehicle and get NWT license</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Update health card and find family doctor</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-3">First Month</h4>
                <div className="space-y-2 text-gray-400 text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Get NWT Driver's License (90 days to transfer)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Register kids for school/daycare</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Join community groups or sports leagues</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Find your favorite coffee shop (important!)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why People Move Here */}
          <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Why People Choose Yellowknife</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-aurora-green font-semibold mb-2">The Pros</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>• No provincial sales tax (GST only)</li>
                  <li>• Higher salaries than southern Canada</li>
                  <li>• Tight-knit, friendly community</li>
                  <li>• Incredible natural beauty and aurora access</li>
                  <li>• Unique northern culture and lifestyle</li>
                  <li>• Low crime rate</li>
                </ul>
              </div>
              <div>
                <h4 className="text-red-400 font-semibold mb-2">The Challenges</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>• High cost of living (especially food)</li>
                  <li>• Extreme winter temperatures</li>
                  <li>• Limited shopping and services</li>
                  <li>• Expensive to travel south</li>
                  <li>• Dark winters can affect mental health</li>
                  <li>• Housing shortage</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
