'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import InteractiveHeader from '@/components/InteractiveHeader';
import { Users, MapPin, Shield, Briefcase, MessageSquare, AlertTriangle } from 'lucide-react';
import type { Neighborhood, NeighborhoodMember } from '@/types/neighborhood.types';

export default function NeighborhoodsPage() {
  const router = useRouter();
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [userMemberships, setUserMemberships] = useState<NeighborhoodMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAddress, setUserAddress] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    fetchNeighborhoods();
    fetchUserMemberships();
  }, []);

  const fetchNeighborhoods = async () => {
    try {
      const response = await fetch('/api/neighborhoods');
      const data = await response.json();
      setNeighborhoods(data.neighborhoods || []);
    } catch (error) {
      console.error('Error fetching neighborhoods:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserMemberships = async () => {
    try {
      // Fetch all memberships for the current user
      // This would need a separate API endpoint, but for now we'll handle it per neighborhood
      setUserMemberships([]);
    } catch (error) {
      console.error('Error fetching memberships:', error);
    }
  };

  const handleAddressCheck = async () => {
    if (!userAddress.trim()) return;

    try {
      const response = await fetch(`/api/neighborhoods?address=${encodeURIComponent(userAddress)}`);
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error checking address:', error);
    }
  };

  const handleJoinRequest = async (neighborhoodId: string) => {
    try {
      const response = await fetch(`/api/neighborhoods/${neighborhoodId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: Include cookies for auth
        body: JSON.stringify({
          provided_address: userAddress,
          request_reason: 'Requesting to join my neighborhood community',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || 'Join request submitted! You will be notified once approved.');
        fetchUserMemberships();
        // Optionally redirect to neighborhood page
        // router.push(`/living/neighborhoods/${neighborhoodId}`);
      } else {
        const error = await response.json();
        console.error('Join request failed:', error);
        alert(error.error || 'Failed to submit join request. Please make sure you are logged in.');
      }
    } catch (error) {
      console.error('Error joining neighborhood:', error);
      alert('Failed to submit join request. Please check your connection and try again.');
    }
  };

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
                <Link href="/living" className="hover:text-aurora-green transition-colors">
                  Living
                </Link>
                <span>›</span>
                <span className="text-white">Neighborhoods</span>
              </div>
            </div>

            {/* Page Header */}
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">🏘️</div>
              <h1 className="text-5xl font-bold text-white mb-4">
                Your Neighborhood
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Connect with your neighbors, stay informed about local events, share resources,
                and build a stronger community together.
              </p>
            </div>

            {/* Address Check Section */}
            <div className="mb-12 bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Find Your Neighborhood</h2>
              <p className="text-gray-300 mb-4">
                Enter your address to discover which neighborhood community you belong to.
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter your street address..."
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-aurora-green"
                />
                <button
                  onClick={handleAddressCheck}
                  className="px-6 py-3 bg-aurora-green text-white rounded-lg font-semibold hover:bg-aurora-green/80 transition-colors"
                >
                  Check Address
                </button>
              </div>

              {suggestions.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-green-400 font-semibold">✓ Matching neighborhoods found:</p>
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.neighborhood_id}
                      className="p-4 bg-green-500/20 border border-green-500/40 rounded-lg"
                    >
                      <p className="text-white font-semibold">{suggestion.neighborhood_name}</p>
                      <p className="text-sm text-gray-300">
                        Confidence: {suggestion.confidence === 'high' ? '🟢 High' : '🟡 Low'}
                      </p>
                      <button
                        onClick={() => handleJoinRequest(suggestion.neighborhood_id)}
                        className="mt-2 px-4 py-2 bg-aurora-green text-white rounded-lg text-sm font-semibold hover:bg-aurora-green/80 transition-colors"
                      >
                        Request to Join
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Neighborhoods */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Available Neighborhoods</h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aurora-green mx-auto"></div>
                  <p className="text-gray-400 mt-4">Loading neighborhoods...</p>
                </div>
              ) : neighborhoods.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-gray-400">No neighborhoods available yet.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {neighborhoods.map((neighborhood) => (
                    <div
                      key={neighborhood.id}
                      className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:border-aurora-green transition-all"
                    >
                      <h3 className="text-2xl font-bold text-white mb-2">{neighborhood.name}</h3>
                      <p className="text-gray-300 mb-4">{neighborhood.description}</p>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>Streets: {neighborhood.streets.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>{neighborhood.member_count || 0} members</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleJoinRequest(neighborhood.id)}
                        className="w-full px-4 py-2 bg-aurora-green text-white rounded-lg font-semibold hover:bg-aurora-green/80 transition-colors"
                      >
                        Request to Join
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Features Overview */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Neighborhood Features</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 text-center">
                  <MessageSquare className="w-12 h-12 text-aurora-blue mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">Bulletin Board</h3>
                  <p className="text-gray-300 text-sm">
                    Share help offers, lost & found, recommendations, and community announcements.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 text-center">
                  <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">Security Alerts</h3>
                  <p className="text-gray-300 text-sm">
                    Stay informed about suspicious activity, emergencies, and community safety issues.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 text-center">
                  <Briefcase className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">Local Businesses</h3>
                  <p className="text-gray-300 text-sm">
                    Discover and support local businesses in your neighborhood.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 text-center">
                  <Shield className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">RCMP Complaints</h3>
                  <p className="text-gray-300 text-sm">
                    Generate and submit formal police complaints directly to the detachment.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 text-center">
                  <Users className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">Local Politics</h3>
                  <p className="text-gray-300 text-sm">
                    Discuss city council decisions, development projects, and civic engagement.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 text-center">
                  <MapPin className="w-12 h-12 text-pink-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">Community Events</h3>
                  <p className="text-gray-300 text-sm">
                    Stay updated on neighborhood gatherings, meetings, and local initiatives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
