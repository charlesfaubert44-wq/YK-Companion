'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAdminGuard } from '@/hooks/useAdminGuard';

interface Stats {
  users: {
    total: number;
    newThisMonth: number;
    byType: {
      visiting: number;
      living: number;
      moving: number;
      unknown: number;
    };
  };
  content: {
    savedItems: number;
    itineraries: number;
    knowledge: {
      total: number;
      pending: number;
      approved: number;
      rejected: number;
    };
  };
}

export default function AnalyticsPage() {
  const { loading: authLoading, isAdmin } = useAdminGuard();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchStats();
    }
  }, [authLoading, isAdmin]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();

      if (response.ok) {
        setStats(data);
      } else {
        console.error('Error fetching stats:', data.error);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth
  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900">
      {/* Header */}
      <div className="bg-northern-midnight/80 backdrop-blur-lg border-b border-aurora-green/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin"
                className="text-aurora-green hover:text-aurora-blue transition-colors inline-flex items-center gap-2 mb-2"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-gray-300 mt-2">
                Comprehensive platform statistics and insights
              </p>
            </div>
            <button
              onClick={fetchStats}
              className="px-6 py-3 bg-aurora-green text-dark-900 rounded-lg font-semibold hover:bg-aurora-blue transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading || !stats ? (
          <div className="text-center text-white text-xl py-12">Loading statistics...</div>
        ) : (
          <>
            {/* User Statistics */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">User Statistics</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Users</p>
                      <p className="text-4xl font-bold text-white mt-2">{stats.users.total}</p>
                    </div>
                    <div className="text-5xl">👥</div>
                  </div>
                  <div className="mt-4 text-emerald-400 text-sm">All registered users</div>
                </div>

                <div className="bg-dark-800 rounded-xl p-6 border border-aurora-blue/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">New This Month</p>
                      <p className="text-4xl font-bold text-white mt-2">{stats.users.newThisMonth}</p>
                    </div>
                    <div className="text-5xl">📈</div>
                  </div>
                  <div className="mt-4 text-blue-400 text-sm">
                    {stats.users.total > 0 ?
                      `${((stats.users.newThisMonth / stats.users.total) * 100).toFixed(1)}% of total` :
                      'N/A'}
                  </div>
                </div>

                <div className="bg-dark-800 rounded-xl p-6 border border-aurora-purple/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Visitors</p>
                      <p className="text-4xl font-bold text-white mt-2">{stats.users.byType.visiting}</p>
                    </div>
                    <div className="text-5xl">🧳</div>
                  </div>
                  <div className="mt-4 text-purple-400 text-sm">
                    {stats.users.total > 0 ?
                      `${((stats.users.byType.visiting / stats.users.total) * 100).toFixed(1)}% of users` :
                      'N/A'}
                  </div>
                </div>

                <div className="bg-dark-800 rounded-xl p-6 border border-aurora-pink/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Residents</p>
                      <p className="text-4xl font-bold text-white mt-2">{stats.users.byType.living}</p>
                    </div>
                    <div className="text-5xl">🏠</div>
                  </div>
                  <div className="mt-4 text-pink-400 text-sm">
                    {stats.users.total > 0 ?
                      `${((stats.users.byType.living / stats.users.total) * 100).toFixed(1)}% of users` :
                      'N/A'}
                  </div>
                </div>
              </div>

              {/* User Type Breakdown */}
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
                  <h3 className="text-xl font-bold text-white mb-4">User Type Distribution</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Visiting</span>
                        <span className="text-white font-semibold">{stats.users.byType.visiting}</span>
                      </div>
                      <div className="w-full bg-dark-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all"
                          style={{
                            width: `${stats.users.total > 0 ? (stats.users.byType.visiting / stats.users.total) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Living</span>
                        <span className="text-white font-semibold">{stats.users.byType.living}</span>
                      </div>
                      <div className="w-full bg-dark-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all"
                          style={{
                            width: `${stats.users.total > 0 ? (stats.users.byType.living / stats.users.total) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Moving</span>
                        <span className="text-white font-semibold">{stats.users.byType.moving}</span>
                      </div>
                      <div className="w-full bg-dark-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full transition-all"
                          style={{
                            width: `${stats.users.total > 0 ? (stats.users.byType.moving / stats.users.total) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Unknown</span>
                        <span className="text-white font-semibold">{stats.users.byType.unknown}</span>
                      </div>
                      <div className="w-full bg-dark-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-gray-400 to-gray-600 h-3 rounded-full transition-all"
                          style={{
                            width: `${stats.users.total > 0 ? (stats.users.byType.unknown / stats.users.total) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
                  <h3 className="text-xl font-bold text-white mb-4">Growth Metrics</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="text-gray-400 text-sm">Growth Rate (This Month)</div>
                      <div className="text-3xl font-bold text-emerald-400 mt-2">
                        {stats.users.total > 0 && stats.users.newThisMonth > 0 ?
                          `+${((stats.users.newThisMonth / (stats.users.total - stats.users.newThisMonth)) * 100).toFixed(1)}%` :
                          'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Average Users per Type</div>
                      <div className="text-3xl font-bold text-blue-400 mt-2">
                        {Math.round((stats.users.byType.visiting + stats.users.byType.living + stats.users.byType.moving) / 3)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Statistics */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Content Statistics</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Saved Items</p>
                      <p className="text-4xl font-bold text-white mt-2">{stats.content.savedItems}</p>
                    </div>
                    <div className="text-5xl">⭐</div>
                  </div>
                  <div className="mt-4 text-emerald-400 text-sm">User bookmarks & favorites</div>
                </div>

                <div className="bg-dark-800 rounded-xl p-6 border border-aurora-blue/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Itineraries</p>
                      <p className="text-4xl font-bold text-white mt-2">{stats.content.itineraries}</p>
                    </div>
                    <div className="text-5xl">📅</div>
                  </div>
                  <div className="mt-4 text-blue-400 text-sm">User-created trip plans</div>
                </div>

                <div className="bg-dark-800 rounded-xl p-6 border border-aurora-purple/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Knowledge Entries</p>
                      <p className="text-4xl font-bold text-white mt-2">{stats.content.knowledge.total}</p>
                    </div>
                    <div className="text-5xl">📚</div>
                  </div>
                  <div className="mt-4 text-purple-400 text-sm">Total submissions</div>
                </div>
              </div>
            </div>

            {/* Knowledge Database Statistics */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Knowledge Database</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-dark-800 rounded-xl p-6 border border-yellow-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Pending Review</p>
                      <p className="text-4xl font-bold text-yellow-400 mt-2">{stats.content.knowledge.pending}</p>
                    </div>
                    <div className="text-5xl">⏳</div>
                  </div>
                  <Link
                    href="/admin/knowledge"
                    className="mt-4 text-yellow-400 text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Review Now →
                  </Link>
                </div>

                <div className="bg-dark-800 rounded-xl p-6 border border-green-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Approved</p>
                      <p className="text-4xl font-bold text-green-400 mt-2">{stats.content.knowledge.approved}</p>
                    </div>
                    <div className="text-5xl">✅</div>
                  </div>
                  <div className="mt-4 text-green-400 text-sm">
                    {stats.content.knowledge.total > 0 ?
                      `${((stats.content.knowledge.approved / stats.content.knowledge.total) * 100).toFixed(1)}% approval rate` :
                      'N/A'}
                  </div>
                </div>

                <div className="bg-dark-800 rounded-xl p-6 border border-red-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Rejected</p>
                      <p className="text-4xl font-bold text-red-400 mt-2">{stats.content.knowledge.rejected}</p>
                    </div>
                    <div className="text-5xl">❌</div>
                  </div>
                  <div className="mt-4 text-red-400 text-sm">
                    {stats.content.knowledge.total > 0 ?
                      `${((stats.content.knowledge.rejected / stats.content.knowledge.total) * 100).toFixed(1)}% rejection rate` :
                      'N/A'}
                  </div>
                </div>

                <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Submissions</p>
                      <p className="text-4xl font-bold text-white mt-2">{stats.content.knowledge.total}</p>
                    </div>
                    <div className="text-5xl">📊</div>
                  </div>
                  <div className="mt-4 text-gray-400 text-sm">All status combined</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
