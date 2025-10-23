'use client';

import { useEffect } from 'react';
import {
  Home,
  Plane,
  Mountain,
  Snowflake,
  Sun,
  Users,
  Building2,
  GraduationCap,
  MapPin,
  Camera,
  Compass,
  Heart,
  Sparkles,
  ArrowRight,
  Fish
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SeasonalLakeScene from '@/components/SeasonalLakeScene';
import SeasonSelector from '@/components/SeasonSelector';
import { useSeason } from '@/hooks/useSeason';

export default function HomePage() {
  const { season, theme, changeSeason } = useSeason();

  // Apply season class to body
  useEffect(() => {
    document.body.className = `season-${season}`;
  }, [season]);
  const features = {
    living: [
      {
        icon: Home,
        title: 'Community Life',
        description: 'Tight-knit community with festivals, markets, and northern hospitality',
        color: 'text-yk-primary-400'
      },
      {
        icon: Building2,
        title: 'Local Services',
        description: 'Modern amenities, healthcare, shopping, and dining options',
        color: 'text-yk-aurora-400'
      },
      {
        icon: Snowflake,
        title: 'Four Seasons',
        description: 'Experience midnight sun in summer and aurora borealis in winter',
        color: 'text-yk-gold-400'
      },
      {
        icon: Fish,
        title: 'Outdoor Living',
        description: 'World-class fishing, hiking, houseboats on Great Slave Lake',
        color: 'text-teal-400'
      }
    ],
    moving: [
      {
        icon: GraduationCap,
        title: 'Education',
        description: 'Quality schools and Aurora College for continuing education',
        color: 'text-yk-primary-400'
      },
      {
        icon: Building2,
        title: 'Employment',
        description: 'Government, mining, tourism, and entrepreneurship opportunities',
        color: 'text-yk-aurora-400'
      },
      {
        icon: Home,
        title: 'Housing',
        description: 'Diverse housing options from apartments to lakefront properties',
        color: 'text-yk-gold-400'
      },
      {
        icon: Users,
        title: 'Support Network',
        description: 'Newcomer services and welcoming community programs',
        color: 'text-purple-400'
      }
    ],
    visiting: [
      {
        icon: Sparkles,
        title: 'Aurora Viewing',
        description: 'Prime location for Northern Lights with 240+ viewing nights/year',
        color: 'text-yk-aurora-400'
      },
      {
        icon: Camera,
        title: 'Photography',
        description: 'Capture stunning landscapes, wildlife, and the midnight sun',
        color: 'text-yk-gold-400'
      },
      {
        icon: Mountain,
        title: 'Adventure',
        description: 'Dog sledding, ice road tours, kayaking, and hiking trails',
        color: 'text-yk-primary-400'
      },
      {
        icon: Compass,
        title: 'Culture & Heritage',
        description: 'Indigenous culture, museums, Old Town, and Pilots Monument',
        color: 'text-orange-400'
      }
    ]
  };

  return (
    <div className="min-h-screen aurora-bg pixel-grid">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-yk-primary-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-yk-aurora-400/10 rounded-full blur-3xl animate-float animation-delay-400"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yk-gold-400/5 rounded-full blur-3xl animate-aurora"></div>
        </div>

        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left space-y-6 animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-yk-dark-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-yk-primary-500/30">
                <MapPin className="w-4 h-4 text-yk-primary-400" />
                <span className="text-sm text-gray-300">Yellowknife, Northwest Territories</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="glow-text">Your Gateway</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yk-primary-400 via-yk-aurora-400 to-yk-gold-400">
                  to the North
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
                Discover Canada's Northern Capital - Where the aurora dances, communities thrive,
                and adventure awaits under the midnight sun.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#living" className="pixel-btn inline-flex items-center justify-center space-x-2">
                  <span>Explore YK</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
                <button className="px-6 py-3 bg-yk-dark-700/50 hover:bg-yk-dark-600/50 border-2 border-yk-primary-500/30 rounded font-semibold transition-all hover:border-yk-primary-500/60">
                  Watch Video
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-yk-primary-400 pixel-font">20K+</div>
                  <div className="text-xs text-gray-400">Residents</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-yk-aurora-400 pixel-font">240+</div>
                  <div className="text-xs text-gray-400">Aurora Nights</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-yk-gold-400 pixel-font">24hr</div>
                  <div className="text-xs text-gray-400">Daylight (Summer)</div>
                </div>
              </div>
            </div>

            {/* Interactive Lake Scene */}
            <div className="animate-fade-in animation-delay-200">
              <SeasonalLakeScene season={season} />
              <p className="text-center text-sm text-gray-400 mt-4">
                <Sparkles className="w-4 h-4 inline mr-1 text-yk-aurora-400" />
                {season === 'winter' && 'Frozen lake with cozy houseboat'}
                {season === 'spring' && 'Ice breakup season - click for trout!'}
                {season === 'summer' && 'Click the lake to see a trout jump!'}
                {season === 'fall' && 'Preparing for winter freeze'}
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-yk-primary-400 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-yk-primary-400 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Living Here Section */}
      <section id="living" className="section-container scroll-mt-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-yk-dark-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-yk-primary-500/30 mb-4">
            <Home className="w-4 h-4 text-yk-primary-400" />
            <span className="text-sm text-gray-300">Living Here</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="glow-text">Life in</span>{' '}
            <span className="text-yk-aurora-400">Yellowknife</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Experience northern living at its finest with modern amenities and authentic community spirit
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.living.map((feature, index) => (
            <div
              key={index}
              className="pixel-card p-6 group hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 ${feature.color} mb-4 flex items-center justify-center bg-yk-dark-900/50 rounded-lg`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Weather Info */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="pixel-card p-8 bg-gradient-to-br from-orange-500/10 to-yk-gold-500/10">
            <Sun className="w-10 h-10 text-yk-gold-400 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Summer Magic</h3>
            <p className="text-gray-300 mb-4">
              24 hours of daylight, warm temperatures up to 25°C, perfect for hiking, fishing, and lake activities
            </p>
            <div className="flex items-center space-x-2 text-yk-gold-400 text-sm font-semibold">
              <span>June - August</span>
            </div>
          </div>

          <div className="pixel-card p-8 bg-gradient-to-br from-yk-primary-500/10 to-yk-aurora-500/10">
            <Snowflake className="w-10 h-10 text-yk-primary-400 mb-4 animate-spin" style={{ animationDuration: '10s' }} />
            <h3 className="text-2xl font-bold mb-2">Winter Wonderland</h3>
            <p className="text-gray-300 mb-4">
              Aurora viewing paradise, winter festivals, ice fishing, and unique northern experiences
            </p>
            <div className="flex items-center space-x-2 text-yk-primary-400 text-sm font-semibold">
              <span>November - March</span>
            </div>
          </div>
        </div>
      </section>

      {/* Moving Here Section */}
      <section id="moving" className="section-container scroll-mt-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-yk-dark-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-yk-aurora-500/30 mb-4">
            <Plane className="w-4 h-4 text-yk-aurora-400" />
            <span className="text-sm text-gray-300">Moving Here</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="glow-text-aurora">Start Your</span>{' '}
            <span className="text-yk-gold-400">Northern Journey</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about relocating to Canada's Northern Capital
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.moving.map((feature, index) => (
            <div
              key={index}
              className="pixel-card p-6 group hover:scale-105 transition-all duration-300"
            >
              <div className={`w-12 h-12 ${feature.color} mb-4 flex items-center justify-center bg-yk-dark-900/50 rounded-lg`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Card */}
        <div className="pixel-card p-8 md:p-12 bg-gradient-to-br from-yk-aurora-500/10 to-yk-primary-500/10 text-center gradient-border">
          <Heart className="w-12 h-12 text-yk-aurora-400 mx-auto mb-4 animate-pulse" />
          <h3 className="text-3xl font-bold mb-4">Ready to Make YK Home?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join our growing community and discover why people from around the world choose
            Yellowknife as their new home
          </p>
          <button className="pixel-btn">
            Download Relocation Guide
          </button>
        </div>
      </section>

      {/* Visiting Section */}
      <section id="visiting" className="section-container scroll-mt-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-yk-dark-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-yk-gold-500/30 mb-4">
            <Compass className="w-4 h-4 text-yk-gold-400" />
            <span className="text-sm text-gray-300">Visiting</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="glow-text">Experience</span>{' '}
            <span className="text-yk-primary-400">The Arctic</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Unforgettable adventures await in the land of the midnight sun and northern lights
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.visiting.map((feature, index) => (
            <div
              key={index}
              className="pixel-card p-6 group hover:scale-105 transition-all duration-300"
            >
              <div className={`w-12 h-12 ${feature.color} mb-4 flex items-center justify-center bg-yk-dark-900/50 rounded-lg`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Best Time to Visit */}
        <div className="pixel-card p-8 md:p-12 bg-gradient-to-br from-yk-gold-500/10 to-orange-500/10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Sparkles className="w-10 h-10 text-yk-aurora-400 mb-4" />
              <h3 className="text-3xl font-bold mb-4">When to Visit</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-yk-aurora-400 mb-1">Aurora Season (Aug-Apr)</h4>
                  <p className="text-gray-300 text-sm">
                    Peak viewing: December to March. Clear, dark skies and spectacular displays
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-yk-gold-400 mb-1">Midnight Sun (May-Jul)</h4>
                  <p className="text-gray-300 text-sm">
                    24-hour daylight, festivals, hiking, and water activities on Great Slave Lake
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <button className="w-full pixel-btn">
                Plan Your Trip
              </button>
              <button className="w-full px-6 py-3 bg-yk-dark-700/50 hover:bg-yk-dark-600/50 border-2 border-yk-primary-500/30 rounded font-semibold transition-all hover:border-yk-primary-500/60">
                View Accommodations
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Season Selector */}
      <SeasonSelector currentSeason={season} onSeasonChange={changeSeason} />
    </div>
  );
}
