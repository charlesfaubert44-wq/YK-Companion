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

export default function AdminDashboard() {
  const { loading: authLoading, isAdmin, profile } = useAdminGuard();
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

  const quickActions = [
    {
      title: 'Knowledge Database',
      description: 'Review and manage user submissions',
      icon: '📚',
      href: '/admin/knowledge',
      color: 'from-aurora-green to-aurora-blue',
      badge: stats?.content.knowledge.pending || 0,
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: '👥',
      href: '/admin/users',
      color: 'from-aurora-pink to-aurora-green',
    },
    {
      title: 'Analytics',
      description: 'View comprehensive site analytics',
      icon: '📊',
      href: '/admin/analytics',
      color: 'from-aurora-green to-aurora-blue',
    },
    {
      title: 'Premium Sponsors',
      description: 'Manage premium spotlight placements',
      icon: '✨',
      href: '/admin/sponsors',
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      title: 'Banner Management',
      description: 'Customize seasonal and holiday banners',
      icon: '🎨',
      href: '/admin/banners',
      color: 'from-aurora-blue to-aurora-purple',
    },
    {
      title: 'Content Editor',
      description: 'Manage all platform content',
      icon: '✏️',
      href: '/admin/content',
      color: 'from-aurora-purple to-aurora-pink',
    },
    {
      title: 'Pricing Plans',
      description: 'Configure premium pricing structure',
      icon: '💰',
      href: '/admin/pricing-plans',
      color: 'from-aurora-green to-aurora-blue',
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: '⚙️',
      href: '/admin/settings',
      color: 'from-gray-400 to-gray-600',
    },
  ];

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
                href="/"
                className="text-aurora-green hover:text-aurora-blue transition-colors inline-flex items-center gap-2 mb-2"
              >
                ← Back to Site
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
                Super Admin Dashboard
              </h1>
              <p className="text-gray-300 mt-2">
                Welcome back, {profile?.full_name || profile?.email}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Admin Level</div>
              <div className="text-aurora-green font-semibold">Super Administrator</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        {loading || !stats ? (
          <div className="text-center text-white text-xl py-12">Loading statistics...</div>
        ) : (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.users.total}</p>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
                <div className="mt-4 text-emerald-400 text-sm">
                  +{stats.users.newThisMonth} this month
                </div>
              </div>

              <div className="bg-dark-800 rounded-xl p-6 border border-aurora-blue/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Knowledge Entries</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.content.knowledge.total}</p>
                  </div>
                  <div className="text-4xl">📚</div>
                </div>
                <div className="mt-4 text-blue-400 text-sm">
                  {stats.content.knowledge.approved} approved
                </div>
              </div>

              <div className="bg-dark-800 rounded-xl p-6 border border-aurora-purple/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Saved Items</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.content.savedItems}</p>
                  </div>
                  <div className="text-4xl">⭐</div>
                </div>
                <div className="mt-4 text-purple-400 text-sm">User bookmarks</div>
              </div>

              <div className="bg-dark-800 rounded-xl p-6 border border-aurora-pink/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Pending Reviews</p>
                    <p className="text-3xl font-bold text-yellow-400 mt-1">
                      {stats.content.knowledge.pending}
                    </p>
                  </div>
                  <div className="text-4xl">⏳</div>
                </div>
                <Link
                  href="/admin/knowledge"
                  className="mt-4 text-yellow-400 text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Review Now →
                </Link>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.href} className="group relative">
                      {action.badge !== undefined && action.badge > 0 && (
                        <div className="absolute -top-2 -right-2 z-10 bg-yellow-500 text-dark-900 font-bold text-xs px-2 py-1 rounded-full">
                          {action.badge}
                        </div>
                      )}
                      <div className={`bg-gradient-to-br ${action.color} p-[2px] rounded-xl hover:shadow-aurora transition-all transform hover:scale-105`}>
                        <div className="bg-dark-800 rounded-xl p-6 h-full">
                          <div className="text-5xl mb-4">{action.icon}</div>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-aurora-green transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {action.description}
                          </p>
                          <div className="mt-4 text-aurora-green font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                            Open <span>→</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* System Status */}
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-bold text-white mb-6">System Status</h2>
                <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white font-semibold">Database</span>
                      </div>
                      <span className="text-green-400 text-sm">Online</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white font-semibold">Authentication</span>
                      </div>
                      <span className="text-green-400 text-sm">Online</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white font-semibold">API</span>
                      </div>
                      <span className="text-green-400 text-sm">Online</span>
                    </div>
                  </div>
                </div>

                {/* Platform Stats */}
                <div className="mt-6 bg-dark-800 rounded-xl p-6 border border-aurora-blue/20">
                  <h3 className="text-white font-semibold mb-4">Platform Overview</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Visitors</span>
                        <span className="text-white font-semibold">{stats.users.byType.visiting}</span>
                      </div>
                      <div className="w-full bg-dark-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                          style={{
                            width: `${stats.users.total > 0 ? (stats.users.byType.visiting / stats.users.total) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Residents</span>
                        <span className="text-white font-semibold">{stats.users.byType.living}</span>
                      </div>
                      <div className="w-full bg-dark-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
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
                      <div className="w-full bg-dark-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full"
                          style={{
                            width: `${stats.users.total > 0 ? (stats.users.byType.moving / stats.users.total) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="mt-6 bg-dark-800 rounded-xl p-6 border border-aurora-purple/20">
                  <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                  <div className="space-y-2">
                    <Link
                      href="/admin/analytics"
                      className="block text-aurora-green hover:text-aurora-blue transition-colors text-sm"
                    >
                      → View Full Analytics
                    </Link>
                    <Link
                      href="/admin/users"
                      className="block text-aurora-green hover:text-aurora-blue transition-colors text-sm"
                    >
                      → Manage Users
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="block text-aurora-green hover:text-aurora-blue transition-colors text-sm"
                    >
                      → System Settings
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
