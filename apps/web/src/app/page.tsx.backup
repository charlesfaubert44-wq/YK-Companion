import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Aurora Background Effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-aurora-green rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-aurora-blue rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-40 left-1/2 w-96 h-96 bg-aurora-purple rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative container mx-auto px-4 pt-20 pb-32">
          {/* Navigation */}
          <nav className="flex justify-between items-center mb-16">
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-aurora-gradient">✨</span>
              <span>TRUE NORTH TRIPS</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/activities" className="text-gray-300 hover:text-aurora-green transition">
                Explore
              </Link>
              <Link href="/plan" className="text-gray-300 hover:text-aurora-green transition">
                Plan Trip
              </Link>
              <Link href="/aurora" className="text-gray-300 hover:text-aurora-green transition">
                Aurora Forecast
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-aurora-gradient text-white font-semibold hover:shadow-aurora transition"
              >
                Get Started
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Navigate the North
              <span className="block text-transparent bg-clip-text bg-aurora-gradient mt-2">
                With Confidence
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Whether you're visiting, living, or moving to Yellowknife—get the local expertise you need.
            </p>

            {/* User Type Selection */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
              {/* Visiting */}
              <Link href="/visiting" className="group">
                <div className="bg-gradient-to-br from-aurora-green/20 to-aurora-green/5 backdrop-blur-lg p-8 rounded-2xl border-2 border-aurora-green/30 hover:border-aurora-green hover:shadow-aurora transition-all transform hover:scale-105">
                  <div className="text-5xl mb-4">🧳</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Visiting</h3>
                  <p className="text-gray-300 mb-4">
                    Plan your trip with real costs, aurora forecasts, and personalized recommendations.
                  </p>
                  <div className="text-aurora-green font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Plan Your Visit <span>→</span>
                  </div>
                </div>
              </Link>

              {/* Living Here */}
              <Link href="/living" className="group">
                <div className="bg-gradient-to-br from-aurora-blue/20 to-aurora-blue/5 backdrop-blur-lg p-8 rounded-2xl border-2 border-aurora-blue/30 hover:border-aurora-blue hover:shadow-glow transition-all transform hover:scale-105">
                  <div className="text-5xl mb-4">🏠</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Living Here</h3>
                  <p className="text-gray-300 mb-4">
                    Local events, activities, seasonal guides, and community recommendations for residents.
                  </p>
                  <div className="text-aurora-blue font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Explore Local Life <span>→</span>
                  </div>
                </div>
              </Link>

              {/* Moving Here */}
              <Link href="/moving" className="group">
                <div className="bg-gradient-to-br from-aurora-purple/20 to-aurora-purple/5 backdrop-blur-lg p-8 rounded-2xl border-2 border-aurora-purple/30 hover:border-aurora-purple transition-all transform hover:scale-105">
                  <div className="text-5xl mb-4">📦</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Moving Here</h3>
                  <p className="text-gray-300 mb-4">
                    Housing costs, job market, climate prep, and everything you need to relocate successfully.
                  </p>
                  <div className="text-aurora-purple font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Start Your Move <span>→</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-aurora-green">✓</span>
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-aurora-green">✓</span>
                <span>10K+ trips planned</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-aurora-green">✓</span>
                <span>Real-time forecasts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="bg-dark-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Northern Travel Planning—The Real Story
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <div className="text-red-400 text-2xl mb-3">❌</div>
                <h3 className="text-white font-semibold mb-2">No Pricing Info</h3>
                <p className="text-gray-400 text-sm">
                  Tourism sites show beautiful photos but hide the costs. You can't budget properly.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <div className="text-red-400 text-2xl mb-3">❌</div>
                <h3 className="text-white font-semibold mb-2">Generic Advice</h3>
                <p className="text-gray-400 text-sm">
                  One-size-fits-all recommendations. No personalization for your travel style.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <div className="text-red-400 text-2xl mb-3">❌</div>
                <h3 className="text-white font-semibold mb-2">Preparation Anxiety</h3>
                <p className="text-gray-400 text-sm">
                  Never experienced -40°C? No clear guidance on what gear you actually need.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-gradient-to-b from-dark-900 to-dark-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Plan Confidently
            </h2>
            <p className="text-gray-300 text-lg">
              Based on real visitor needs, not marketing hype
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-aurora-green/50 transition-all hover:shadow-aurora">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-3">Personalized for You</h3>
              <p className="text-gray-300 mb-4">
                Take our 2-minute quiz. Get recommendations tailored to your travel style—whether you seek comfort, culture, or adventure.
              </p>
              <Link
                href="/quiz"
                className="text-aurora-green font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Take the quiz <span>→</span>
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-aurora-blue/50 transition-all hover:shadow-glow">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-white mb-3">Transparent Costs</h3>
              <p className="text-gray-300 mb-4">
                Know exactly what your trip will cost. Itemized breakdown: accommodation, activities, food, gear—everything.
              </p>
              <Link
                href="/calculator"
                className="text-aurora-blue font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Calculate costs <span>→</span>
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-aurora-purple/50 transition-all">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Seasonal Planning</h3>
              <p className="text-gray-300 mb-4">
                Month-by-month guide shows temperature, daylight, aurora probability, crowds, and pricing. Find your perfect timing.
              </p>
              <Link
                href="/seasons"
                className="text-aurora-purple font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Explore seasons <span>→</span>
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-aurora-pink/50 transition-all">
              <div className="text-4xl mb-4">🎒</div>
              <h3 className="text-xl font-bold text-white mb-3">Gear Guidance</h3>
              <p className="text-gray-300 mb-4">
                Temperature-specific packing lists. What to bring, what to rent locally, and how to survive -40°C comfortably.
              </p>
              <Link
                href="/packing"
                className="text-aurora-pink font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Get packing list <span>→</span>
              </Link>
            </div>

            {/* Feature 5 */}
            <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-aurora-green/50 transition-all">
              <div className="text-4xl mb-4">🌌</div>
              <h3 className="text-xl font-bold text-white mb-3">Live Aurora Forecast</h3>
              <p className="text-gray-300 mb-4">
                Real-time KP index, cloud cover, and best viewing times. Get alerts when conditions are perfect tonight.
              </p>
              <Link
                href="/aurora"
                className="text-aurora-green font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Check forecast <span>→</span>
              </Link>
            </div>

            {/* Feature 6 */}
            <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-aurora-blue/50 transition-all">
              <div className="text-4xl mb-4">🏔️</div>
              <h3 className="text-xl font-bold text-white mb-3">Indigenous Culture</h3>
              <p className="text-gray-300 mb-4">
                Respectful cultural protocol guides. Verified Indigenous-owned businesses. Learn why experiences matter.
              </p>
              <Link
                href="/culture"
                className="text-aurora-blue font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Learn more <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Aurora Forecast Teaser */}
      <section className="py-20 bg-gradient-to-br from-northern-midnight to-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-aurora-green rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-aurora-purple rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-aurora-green/20 border border-aurora-green/30 rounded-full text-aurora-green text-sm font-semibold mb-6">
              🌌 Live Now
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Tonight's Aurora Forecast
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Real-time predictions updated every hour
            </p>

            {/* Mock Aurora Dashboard */}
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 max-w-2xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <div className="text-gray-400 text-sm mb-2">KP Index</div>
                  <div className="text-3xl font-bold text-aurora-green">5.2</div>
                  <div className="text-xs text-gray-500">Good</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-2">Cloud Cover</div>
                  <div className="text-3xl font-bold text-aurora-blue">25%</div>
                  <div className="text-xs text-gray-500">Excellent</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-2">Visibility</div>
                  <div className="text-3xl font-bold text-aurora-purple">78%</div>
                  <div className="text-xs text-gray-500">High</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-2">Best Time</div>
                  <div className="text-3xl font-bold text-white">11PM</div>
                  <div className="text-xs text-gray-500">Tonight</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-aurora-green/20 to-aurora-purple/20 p-4 rounded-lg border border-aurora-green/30">
                <p className="text-white font-semibold mb-2">✨ Excellent viewing conditions tonight!</p>
                <p className="text-gray-300 text-sm">
                  Clear skies and high solar activity. Get ready for a spectacular show around 11:00 PM.
                </p>
              </div>

              <Link
                href="/aurora"
                className="mt-6 inline-block px-6 py-3 bg-aurora-gradient text-white font-semibold rounded-lg hover:shadow-aurora transition"
              >
                View Full Forecast →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-dark-800">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-2">
                Trusted by Northern Travelers
              </h2>
              <p className="text-gray-400">Real reviews from real visitors</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <div className="flex gap-1 text-aurora-green mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "The cost calculator was a game-changer. Finally knew what to budget for our aurora trip!"
                </p>
                <div className="text-sm text-gray-400">— Sarah M., Toronto</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <div className="flex gap-1 text-aurora-green mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "The packing list saved us. We were perfectly prepared for -38°C. No joke, this app is essential."
                </p>
                <div className="text-sm text-gray-400">— Mike P., Vancouver</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <div className="flex gap-1 text-aurora-green mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "Aurora alerts worked perfectly. We got notified and saw the most incredible northern lights show!"
                </p>
                <div className="text-sm text-gray-400">— Jennifer L., Calgary</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-dark-900 to-northern-midnight relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-aurora-gradient rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Plan Your Northern Adventure?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of travelers who've discovered the smarter way to plan Yellowknife trips.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quiz"
                className="px-8 py-4 bg-aurora-gradient text-white text-lg font-semibold rounded-xl hover:shadow-aurora transform hover:scale-105 transition-all"
              >
                Start Planning Now →
              </Link>
              <Link
                href="/learn-more"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-xl border-2 border-white/20 hover:bg-white/20 transition"
              >
                Learn More
              </Link>
            </div>

            <p className="text-sm text-gray-400 mt-6">
              No credit card required • Free to start • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-900 border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">True North Trips</h3>
              <p className="text-gray-400 text-sm">
                Navigate the North with confidence. Northern expertise for real travelers.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/quiz" className="hover:text-aurora-green transition">Traveler Quiz</Link></li>
                <li><Link href="/calculator" className="hover:text-aurora-green transition">Cost Calculator</Link></li>
                <li><Link href="/aurora" className="hover:text-aurora-green transition">Aurora Forecast</Link></li>
                <li><Link href="/packing" className="hover:text-aurora-green transition">Packing Lists</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/blog" className="hover:text-aurora-green transition">Travel Blog</Link></li>
                <li><Link href="/guides" className="hover:text-aurora-green transition">Trip Guides</Link></li>
                <li><Link href="/faq" className="hover:text-aurora-green transition">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-aurora-green transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-aurora-green transition">About Us</Link></li>
                <li><Link href="/partners" className="hover:text-aurora-green transition">Partners</Link></li>
                <li><Link href="/privacy" className="hover:text-aurora-green transition">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-aurora-green transition">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 True North Trips. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-aurora-green transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-aurora-green transition">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-aurora-green transition">Facebook</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
