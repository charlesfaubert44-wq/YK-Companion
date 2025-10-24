'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminDashboard() {
  const [stats] = useState({
    totalUsers: 1247,
    activeBanners: 11,
    pageViews: 45632,
    customBanners: 3,
  });

  const quickActions = [
    {
      title: 'Banner Management',
      description: 'View, edit, and create custom banner variations',
      icon: '🎨',
      href: '/admin/banners',
      color: 'from-aurora-green to-aurora-blue',
    },
    {
      title: 'Content Editor',
      description: 'Edit site content directly',
      icon: '✏️',
      href: '/admin/content',
      color: 'from-aurora-blue to-aurora-purple',
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: '👥',
      href: '/admin/users',
      color: 'from-aurora-purple to-aurora-pink',
    },
    {
      title: 'Analytics',
      description: 'View site analytics and reports',
      icon: '📊',
      href: '/admin/analytics',
      color: 'from-aurora-pink to-aurora-green',
    },
  ];

  const recentActivity = [
    { action: 'Banner updated', item: 'Winter Seasonal', time: '2 hours ago', user: 'Admin' },
    { action: 'Content edited', item: 'Homepage Hero', time: '5 hours ago', user: 'Admin' },
    { action: 'New user registered', item: 'john@example.com', time: '1 day ago', user: 'System' },
    { action: 'Banner created', item: 'Halloween Custom', time: '2 days ago', user: 'Admin' },
  ];

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
                Manage your YK Buddy platform
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Last login</div>
              <div className="text-white font-semibold">Today, 10:30 AM</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
            <div className="mt-4 text-emerald-400 text-sm">+12% from last month</div>
          </div>

          <div className="bg-dark-800 rounded-xl p-6 border border-aurora-blue/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Banners</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.activeBanners}</p>
              </div>
              <div className="text-4xl">🎨</div>
            </div>
            <div className="mt-4 text-blue-400 text-sm">11 variations ready</div>
          </div>

          <div className="bg-dark-800 rounded-xl p-6 border border-aurora-purple/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Page Views</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.pageViews.toLocaleString()}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
            <div className="mt-4 text-purple-400 text-sm">+8% from last week</div>
          </div>

          <div className="bg-dark-800 rounded-xl p-6 border border-aurora-pink/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Custom Banners</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.customBanners}</p>
              </div>
              <div className="text-4xl">✨</div>
            </div>
            <div className="mt-4 text-pink-400 text-sm">Create more!</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href} className="group">
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

            {/* Active Banners Preview */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-6">Current Banner</h2>
              <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold">Fall Seasonal Banner</h3>
                    <p className="text-gray-400 text-sm">Auto-selected based on current season</p>
                  </div>
                  <Link href="/admin/banners">
                    <button className="px-4 py-2 bg-aurora-green/20 text-aurora-green rounded-lg hover:bg-aurora-green/30 transition-all">
                      Manage
                    </button>
                  </Link>
                </div>
                <div className="aspect-[4/1] bg-gradient-to-br from-orange-400 via-red-400 to-amber-500 rounded-lg flex items-center justify-center">
                  <h1 className="text-5xl font-black text-white">
                    YK <span className="text-yellow-300">BUDDY</span>
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="pb-4 border-b border-gray-700 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white font-semibold">{activity.action}</p>
                        <p className="text-gray-400 text-sm">{activity.item}</p>
                        <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                      </div>
                      <span className="text-xs bg-dark-700 text-gray-400 px-2 py-1 rounded">
                        {activity.user}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Holidays */}
            <div className="mt-6 bg-dark-800 rounded-xl p-6 border border-aurora-blue/20">
              <h3 className="text-white font-semibold mb-4">Upcoming Holidays</h3>
              <div className="space-y-3">
                <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-orange-300 font-semibold">🎃 Halloween</span>
                    <span className="text-gray-400 text-sm">Oct 31</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">Banner active in 3 days</p>
                </div>
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-red-300 font-semibold">🌺 Remembrance</span>
                    <span className="text-gray-400 text-sm">Nov 11</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">Banner ready</p>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-green-300 font-semibold">🎄 Christmas</span>
                    <span className="text-gray-400 text-sm">Dec 25</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">Auto-schedule set</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
