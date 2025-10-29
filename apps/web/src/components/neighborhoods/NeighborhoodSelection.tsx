'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

/**
 * NeighborhoodSelection - Interactive neighborhood selection UI
 *
 * Features:
 * - Interactive map preview
 * - Search by address
 * - Popular neighborhoods with member counts
 * - Beautiful aurora-themed cards
 * - Responsive design
 */

interface Neighborhood {
  id: string;
  name: string;
  slug: string;
  description: string;
  memberCount: number;
  boundaries: string;
  icon: string;
  color: string;
}

// Mock data - will be replaced with API calls
const MOCK_NEIGHBORHOODS: Neighborhood[] = [
  {
    id: '1',
    name: 'Old Town',
    slug: 'old-town',
    description: 'Historic lakeside community',
    memberCount: 87,
    boundaries: 'Bounded by Yellowknife Bay',
    icon: '🏛️',
    color: 'from-aurora-green to-aurora-blue',
  },
  {
    id: '2',
    name: 'Range Lake',
    slug: 'range-lake',
    description: 'Family-friendly neighborhood',
    memberCount: 134,
    boundaries: 'Between Range Lake Rd & Frame Lake',
    icon: '🏡',
    color: 'from-aurora-blue to-aurora-purple',
  },
  {
    id: '3',
    name: 'Niven Lake',
    slug: 'niven-lake',
    description: 'Peaceful residential area',
    memberCount: 112,
    boundaries: 'Around Niven Lake',
    icon: '🌲',
    color: 'from-aurora-purple to-aurora-pink',
  },
  {
    id: '4',
    name: 'Downtown',
    slug: 'downtown',
    description: 'City center living',
    memberCount: 56,
    boundaries: 'Central business district',
    icon: '🏢',
    color: 'from-aurora-pink to-aurora-green',
  },
  {
    id: '5',
    name: 'Kam Lake',
    slug: 'kam-lake',
    description: 'Industrial & residential mix',
    memberCount: 43,
    boundaries: 'Kam Lake area',
    icon: '🏭',
    color: 'from-emerald-500 to-cyan-500',
  },
  {
    id: '6',
    name: 'Yellowknife Bay',
    slug: 'yellowknife-bay',
    description: 'Waterfront community',
    memberCount: 29,
    boundaries: 'Along Yellowknife Bay',
    icon: '⚓',
    color: 'from-blue-500 to-purple-500',
  },
];

export default function NeighborhoodSelection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);
  const [showMap, setShowMap] = useState(false);

  const filteredNeighborhoods = useMemo(() => {
    if (!searchQuery) return MOCK_NEIGHBORHOODS;

    return MOCK_NEIGHBORHOODS.filter(n =>
      n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-northern-midnight via-dark-900 to-northern-midnight py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-5 duration-700">
          <div className="inline-block mb-4">
            <div className="text-6xl animate-bounce-slow">🏘️</div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
            Find Your Neighborhood
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join verified neighbors for hyper-local alerts, resources, and community building
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-dark-900/90 backdrop-blur-xl border-2 border-aurora-blue/30 rounded-2xl p-2 hover:border-aurora-green/50 transition-all duration-300">
              <div className="flex items-center gap-4">
                <span className="text-3xl pl-4">📍</span>
                <input
                  type="text"
                  placeholder="Enter your address to find your neighborhood..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 text-lg py-4 focus:outline-none"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-xl hover:shadow-aurora transition-all duration-300 hover:scale-105">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Map Toggle */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowMap(!showMap)}
              className="text-aurora-blue hover:text-aurora-green transition-colors duration-300 font-medium flex items-center gap-2 mx-auto"
            >
              <span className="text-xl">{showMap ? '📋' : '🗺️'}</span>
              <span>{showMap ? 'View as List' : 'View on Map'}</span>
            </button>
          </div>
        </div>

        {/* Map View (Placeholder) */}
        {showMap && (
          <div className="max-w-5xl mx-auto mb-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-aurora-blue/30 shadow-2xl shadow-aurora-blue/20">
              <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🗺️</div>
                  <p className="text-gray-400 text-lg">Interactive map will be displayed here</p>
                  <p className="text-gray-500 text-sm mt-2">Click neighborhoods to select</p>
                </div>
              </div>
              {/* Map overlay markers for neighborhoods */}
              <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-aurora-green/80 rounded-full border-2 border-white shadow-glow animate-pulse cursor-pointer"></div>
              <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-aurora-blue/80 rounded-full border-2 border-white shadow-glow animate-pulse cursor-pointer"></div>
              <div className="absolute bottom-1/3 left-1/2 w-8 h-8 bg-aurora-purple/80 rounded-full border-2 border-white shadow-glow animate-pulse cursor-pointer"></div>
            </div>
          </div>
        )}

        {/* Popular Neighborhoods */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">⭐</span>
            Popular Neighborhoods
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNeighborhoods.map((neighborhood, index) => (
              <div
                key={neighborhood.id}
                className="group animate-in fade-in slide-in-from-bottom-8 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  onClick={() => setSelectedNeighborhood(neighborhood)}
                  className="relative cursor-pointer"
                >
                  {/* Card glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${neighborhood.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`}></div>

                  {/* Card */}
                  <div className={`relative bg-dark-900/90 backdrop-blur-xl border-2 border-aurora-blue/30 group-hover:border-aurora-green/50 rounded-3xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                    selectedNeighborhood?.id === neighborhood.id ? 'border-aurora-green shadow-aurora' : ''
                  }`}>
                    {/* Icon */}
                    <div className="text-6xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                      {neighborhood.icon}
                    </div>

                    {/* Name */}
                    <h3 className={`text-2xl font-bold text-white mb-2 bg-gradient-to-r ${neighborhood.color} bg-clip-text text-transparent`}>
                      {neighborhood.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-4">
                      {neighborhood.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">👥</span>
                        <span className="text-aurora-blue font-semibold">
                          {neighborhood.memberCount} verified
                        </span>
                      </div>
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${neighborhood.color} text-white text-xs font-bold`}>
                        Active
                      </div>
                    </div>

                    {/* Boundaries */}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-gray-500 text-xs">
                        {neighborhood.boundaries}
                      </p>
                    </div>

                    {/* Hover indicator */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 bg-aurora-green/20 rounded-full flex items-center justify-center">
                        <span className="text-aurora-green text-xl">→</span>
                      </div>
                    </div>

                    {/* Selected indicator */}
                    {selectedNeighborhood?.id === neighborhood.id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 bg-aurora-green rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                          <span className="text-white text-lg">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Neighborhood Detail */}
        {selectedNeighborhood && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="max-w-4xl mx-auto">
              {/* Preview Card */}
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${selectedNeighborhood.color} rounded-3xl blur-2xl opacity-30`}></div>

                <div className="relative bg-dark-900/95 backdrop-blur-xl border-2 border-aurora-green/50 rounded-3xl p-8 shadow-2xl shadow-aurora-green/20">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-6xl">{selectedNeighborhood.icon}</span>
                        <div>
                          <h2 className={`text-4xl font-black bg-gradient-to-r ${selectedNeighborhood.color} bg-clip-text text-transparent`}>
                            {selectedNeighborhood.name}
                          </h2>
                          <p className="text-gray-400">{selectedNeighborhood.description}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedNeighborhood(null)}
                      className="text-gray-400 hover:text-white transition-colors p-2"
                    >
                      <span className="text-2xl">✕</span>
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-aurora-green/10 rounded-xl p-4 border border-aurora-green/20">
                      <div className="text-2xl mb-2">👥</div>
                      <div className="text-2xl font-bold text-white">{selectedNeighborhood.memberCount}</div>
                      <div className="text-sm text-gray-400">Verified Members</div>
                    </div>
                    <div className="bg-aurora-blue/10 rounded-xl p-4 border border-aurora-blue/20">
                      <div className="text-2xl mb-2">🚨</div>
                      <div className="text-2xl font-bold text-white">Active</div>
                      <div className="text-sm text-gray-400">Crime Watch</div>
                    </div>
                    <div className="bg-aurora-purple/10 rounded-xl p-4 border border-aurora-purple/20">
                      <div className="text-2xl mb-2">🤝</div>
                      <div className="text-2xl font-bold text-white">Enabled</div>
                      <div className="text-sm text-gray-400">Resource Sharing</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <span>🔒</span>
                      <span>Verification Required</span>
                    </h3>
                    <p className="text-gray-300 mb-4">
                      To access neighborhood features, you'll need to verify your residency.
                      This helps maintain a trusted community of actual neighbors.
                    </p>
                  </div>

                  {/* Available Features */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-3">Features Available:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { icon: '🚨', label: 'Crime Watch Alerts', active: true },
                        { icon: '💬', label: 'Community Bulletin Board', active: true },
                        { icon: '🛠️', label: 'Resource Sharing', active: true },
                        { icon: '🆘', label: 'Emergency Contact Network', active: true },
                        { icon: '📅', label: 'Event Coordination', active: true },
                        { icon: '❄️', label: 'Snow Removal Coordination', active: true },
                      ].map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 bg-dark-800/50 rounded-xl p-3"
                        >
                          <span className="text-2xl">{feature.icon}</span>
                          <span className="text-gray-300">{feature.label}</span>
                          {feature.active && (
                            <span className="ml-auto text-aurora-green text-xl">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link href={`/neighborhoods/${selectedNeighborhood.slug}/verify`}>
                    <button className="group w-full relative px-8 py-5 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple text-white font-bold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-aurora hover:scale-105">
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <span>Join This Neighborhood</span>
                        <span className="transition-transform group-hover:translate-x-2 duration-300">→</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-aurora-purple via-aurora-pink to-aurora-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </Link>

                  <p className="text-center text-gray-500 text-sm mt-4">
                    You'll need to verify your residency to access neighborhood features
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredNeighborhoods.length === 0 && (
          <div className="text-center py-12 animate-in fade-in duration-500">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-400">No neighborhoods found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-aurora-blue hover:text-aurora-green transition-colors"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        .animate-shimmer {
          animation: shimmer 8s ease-in-out infinite;
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
