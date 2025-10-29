'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import InteractiveHeader from '@/components/InteractiveHeader';
import {
  Users,
  MessageSquare,
  AlertTriangle,
  Briefcase,
  FileText,
  Flag,
  Plus,
  TrendingUp,
  MapPin,
  Calendar,
  Shield,
} from 'lucide-react';
import type { NeighborhoodDashboard } from '@/types/neighborhood.types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NeighborhoodDashboardPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const neighborhoodId = resolvedParams.id;

  const [dashboard, setDashboard] = useState<NeighborhoodDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bulletin' | 'alerts' | 'businesses' | 'politics'>('bulletin');

  useEffect(() => {
    fetchDashboard();
  }, [neighborhoodId]);

  const fetchDashboard = async () => {
    try {
      const response = await fetch(`/api/neighborhoods/${neighborhoodId}/dashboard`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load dashboard');
        return;
      }

      setDashboard(data.dashboard);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <InteractiveHeader />
        <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900 pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aurora-green mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !dashboard) {
    return (
      <>
        <InteractiveHeader />
        <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900 pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h1 className="text-3xl font-bold text-white mb-4">Access Restricted</h1>
              <p className="text-gray-300 mb-6">
                {error || 'You must be an approved member to view this neighborhood.'}
              </p>
              <Link
                href="/living/neighborhoods"
                className="inline-block px-6 py-3 bg-aurora-green text-white rounded-lg font-semibold hover:bg-aurora-green/80 transition-colors"
              >
                Back to Neighborhoods
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const { neighborhood, member, stats, recent_posts, active_alerts, featured_businesses } = dashboard;

  return (
    <>
      <InteractiveHeader />
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
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
                <Link href="/living/neighborhoods" className="hover:text-aurora-green transition-colors">
                  Neighborhoods
                </Link>
                <span>›</span>
                <span className="text-white">{neighborhood.name}</span>
              </div>
            </div>

            {/* Header */}
            <div className="mb-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{neighborhood.name}</h1>
                  <p className="text-gray-300 mb-4">{neighborhood.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{neighborhood.streets.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{stats.total_members} members</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-block px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-lg">
                    <p className="text-green-400 font-semibold text-sm">
                      {member.role === 'admin' ? '👑 Admin' : member.role === 'moderator' ? '⭐ Moderator' : '✓ Member'}
                    </p>
                  </div>
                  {member.role !== 'member' && stats.pending_approvals && stats.pending_approvals > 0 && (
                    <Link
                      href={`/living/neighborhoods/${neighborhoodId}/admin`}
                      className="block mt-2 px-4 py-2 bg-orange-500/20 border border-orange-500/40 rounded-lg hover:bg-orange-500/30 transition-colors"
                    >
                      <p className="text-orange-400 font-semibold text-sm">
                        {stats.pending_approvals} pending approval{stats.pending_approvals > 1 ? 's' : ''}
                      </p>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 text-center">
                <TrendingUp className="w-8 h-8 text-aurora-green mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{stats.recent_posts_count}</p>
                <p className="text-gray-400 text-sm">Posts This Week</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 text-center">
                <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{stats.active_alerts}</p>
                <p className="text-gray-400 text-sm">Active Alerts</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 text-center">
                <Briefcase className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{stats.local_businesses_count}</p>
                <p className="text-gray-400 text-sm">Local Businesses</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 text-center">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{stats.total_members}</p>
                <p className="text-gray-400 text-sm">Members</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <button className="bg-aurora-green hover:bg-aurora-green/80 text-white p-4 rounded-xl font-semibold transition-all flex flex-col items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                <span className="text-sm">New Post</span>
              </button>

              <button className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl font-semibold transition-all flex flex-col items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                <span className="text-sm">Post Alert</span>
              </button>

              <Link
                href={`/rcmp-complaints/new?neighborhood=${neighborhoodId}`}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-semibold transition-all flex flex-col items-center gap-2"
              >
                <Shield className="w-6 h-6" />
                <span className="text-sm">RCMP Complaint</span>
              </Link>

              <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl font-semibold transition-all flex flex-col items-center gap-2">
                <Briefcase className="w-6 h-6" />
                <span className="text-sm">Add Business</span>
              </button>

              <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl font-semibold transition-all flex flex-col items-center gap-2">
                <Flag className="w-6 h-6" />
                <span className="text-sm">Politics Post</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Recent Posts */}
              <div className="md:col-span-2 bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-6 h-6" />
                    Recent Posts
                  </h2>
                  <Link
                    href={`/living/neighborhoods/${neighborhoodId}/posts`}
                    className="text-aurora-green hover:text-aurora-green/80 text-sm font-semibold"
                  >
                    View All →
                  </Link>
                </div>

                {recent_posts.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No posts yet. Be the first to share!</p>
                ) : (
                  <div className="space-y-4">
                    {recent_posts.slice(0, 5).map((post) => (
                      <div key={post.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-aurora-green/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-white font-semibold">{post.title}</h3>
                          <span className="text-xs px-2 py-1 bg-aurora-green/20 text-aurora-green rounded">
                            {post.category.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm line-clamp-2 mb-2">{post.content}</p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{(post as any).profiles?.full_name || 'Anonymous'}</span>
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar - Alerts & Businesses */}
              <div className="space-y-6">
                {/* Active Alerts */}
                <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    Active Alerts
                  </h3>

                  {active_alerts.length === 0 ? (
                    <p className="text-gray-400 text-sm">No active alerts</p>
                  ) : (
                    <div className="space-y-3">
                      {active_alerts.slice(0, 3).map((alert) => (
                        <div key={alert.id} className={`p-3 rounded-lg border ${
                          alert.severity === 'critical' ? 'bg-red-500/20 border-red-500/40' :
                          alert.severity === 'high' ? 'bg-orange-500/20 border-orange-500/40' :
                          'bg-yellow-500/20 border-yellow-500/40'
                        }`}>
                          <p className="text-white font-semibold text-sm">{alert.title}</p>
                          <p className="text-gray-300 text-xs mt-1 line-clamp-2">{alert.description}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(alert.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/living/neighborhoods/${neighborhoodId}/alerts`}
                    className="block mt-4 text-center text-aurora-green hover:text-aurora-green/80 text-sm font-semibold"
                  >
                    View All Alerts →
                  </Link>
                </div>

                {/* Featured Businesses */}
                <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                    Local Businesses
                  </h3>

                  {featured_businesses.length === 0 ? (
                    <p className="text-gray-400 text-sm">No businesses listed yet</p>
                  ) : (
                    <div className="space-y-3">
                      {featured_businesses.slice(0, 3).map((business) => (
                        <div key={business.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-white font-semibold text-sm">{business.name}</p>
                          <p className="text-gray-400 text-xs">{business.category.replace('_', ' ')}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/living/neighborhoods/${neighborhoodId}/businesses`}
                    className="block mt-4 text-center text-aurora-green hover:text-aurora-green/80 text-sm font-semibold"
                  >
                    View All Businesses →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
