'use client';

import { useState } from 'react';
import Link from 'next/link';

/**
 * NeighborhoodDashboard - Main dashboard for verified neighborhood members
 *
 * Features:
 * - Active alerts feed
 * - Community posts
 * - Resource sharing
 * - Upcoming events
 * - Member directory
 * - Quick actions
 */

interface Alert {
  id: string;
  type: 'crime' | 'suspicious' | 'lost_pet' | 'found_item' | 'emergency' | 'power_outage';
  severity: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  time: string;
  views: number;
  icon: string;
  color: string;
}

interface Post {
  id: string;
  author: string;
  authorInitial: string;
  title: string;
  category: string;
  comments: number;
  time: string;
  icon: string;
}

interface Resource {
  id: string;
  title: string;
  owner: string;
  icon: string;
  available: boolean;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  icon: string;
}

// Mock data
const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    type: 'emergency',
    severity: 'urgent',
    title: 'Bear spotted on 48th Ave',
    description: 'Large black bear near Range Lake Park. Secure pets and garbage.',
    time: '2 hours ago',
    views: 34,
    icon: '🐻',
    color: 'from-red-500 to-orange-500',
  },
  {
    id: '2',
    type: 'suspicious',
    severity: 'medium',
    title: 'Suspicious vehicle on Range Lake Rd',
    description: 'White van circling the area slowly. License plate ABC-123',
    time: '5 hours ago',
    views: 12,
    icon: '🚐',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: '3',
    type: 'lost_pet',
    severity: 'low',
    title: 'Found: Black cat near tennis courts',
    description: 'Friendly black cat with white paws. Currently at my house.',
    time: '1 day ago',
    views: 8,
    icon: '🐱',
    color: 'from-green-500 to-emerald-500',
  },
];

const MOCK_POSTS: Post[] = [
  { id: '1', author: 'Sarah M.', authorInitial: 'S', title: 'Block Party Planning - June 15', category: 'Event', comments: 23, time: '3h ago', icon: '🎉' },
  { id: '2', author: 'Mike T.', authorInitial: 'M', title: 'Recommendation: Electrician Needed', category: 'Question', comments: 8, time: '6h ago', icon: '🔧' },
  { id: '3', author: 'Lisa K.', authorInitial: 'L', title: 'Free: Moving boxes', category: 'Offer', comments: 4, time: '1d ago', icon: '📦' },
];

const MOCK_RESOURCES: Resource[] = [
  { id: '1', title: 'Snowblower - Craftsman 24"', owner: 'John S.', icon: '❄️', available: true },
  { id: '2', title: 'Extension Ladder', owner: 'Mike T.', icon: '🪜', available: true },
  { id: '3', title: 'Power Tools Set', owner: 'Sarah M.', icon: '🔧', available: false },
];

const MOCK_EVENTS: Event[] = [
  { id: '1', title: 'Block Party', date: 'June 15', location: 'Community Park', icon: '🎉' },
  { id: '2', title: 'Garage Sale Day', date: 'June 22', location: 'Various', icon: '🏷️' },
];

interface Props {
  neighborhoodName: string;
  memberCount: number;
  neighborhoodIcon: string;
}

export default function NeighborhoodDashboard({ neighborhoodName, memberCount, neighborhoodIcon }: Props) {
  const [activeTab, setActiveTab] = useState<'alerts' | 'posts' | 'members' | 'resources'>('alerts');

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'urgent':
        return 'bg-red-500/20 border-red-500/50 text-red-300';
      case 'high':
        return 'bg-orange-500/20 border-orange-500/50 text-orange-300';
      case 'medium':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
      default:
        return 'bg-green-500/20 border-green-500/50 text-green-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-northern-midnight via-dark-900 to-northern-midnight py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-5 duration-700">
          <div className="bg-dark-900/95 backdrop-blur-xl border-2 border-aurora-blue/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{neighborhoodIcon}</div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
                    {neighborhoodName}
                  </h1>
                  <p className="text-gray-400">
                    <span className="text-aurora-blue font-semibold">{memberCount}</span> verified members
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Link href="/neighborhoods/alerts/create">
                  <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300 hover:scale-105 flex items-center gap-2">
                    <span className="text-xl">🚨</span>
                    <span className="hidden sm:inline">Alert</span>
                  </button>
                </Link>
                <Link href="/neighborhoods/posts/create">
                  <button className="px-4 py-2 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-xl hover:shadow-aurora transition-all duration-300 hover:scale-105 flex items-center gap-2">
                    <span className="text-xl">✍️</span>
                    <span className="hidden sm:inline">Post</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
              {[
                { key: 'alerts', label: 'Alerts', icon: '🚨', count: 3 },
                { key: 'posts', label: 'Posts', icon: '💬', count: 5 },
                { key: 'members', label: 'Members', icon: '👥', count: memberCount },
                { key: 'resources', label: 'Resources', icon: '🛠️', count: 8 },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-aurora-green to-aurora-blue text-white shadow-aurora'
                      : 'bg-dark-800/50 text-gray-400 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.key ? 'bg-white/20' : 'bg-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>🚨</span>
                  <span>Active Alerts</span>
                  <span className="text-sm text-gray-400 font-normal">({MOCK_ALERTS.length})</span>
                </h2>

                {MOCK_ALERTS.map((alert, index) => (
                  <div
                    key={alert.id}
                    className="group relative animate-in fade-in slide-in-from-bottom-5 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Alert glow */}
                    {alert.severity === 'urgent' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    )}

                    <div className="relative bg-dark-900/95 backdrop-blur-xl border-2 border-gray-700 hover:border-aurora-blue/50 rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02]">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="text-4xl">{alert.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-white">{alert.title}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full border uppercase font-bold ${getSeverityStyles(alert.severity)}`}>
                                {alert.severity}
                              </span>
                            </div>
                            <p className="text-gray-300">{alert.description}</p>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span className="flex items-center gap-2">
                          <span>👁️</span>
                          <span>{alert.views} views</span>
                        </span>
                        <span>{alert.time}</span>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white rounded-xl transition-colors">
                          View Details
                        </button>
                        <button className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white rounded-xl transition-colors">
                          💬 Comment
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <Link href="/neighborhoods/alerts">
                  <button className="w-full py-3 bg-dark-800/50 hover:bg-dark-800 text-aurora-blue font-semibold rounded-xl transition-all duration-300 hover:scale-105">
                    View All Alerts →
                  </button>
                </Link>
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>💬</span>
                  <span>Recent Posts</span>
                </h2>

                {MOCK_POSTS.map((post, index) => (
                  <div
                    key={post.id}
                    className="group bg-dark-900/95 backdrop-blur-xl border-2 border-gray-700 hover:border-aurora-blue/50 rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-5"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Author Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-aurora-green to-aurora-blue flex items-center justify-center text-white font-bold shadow-glow flex-shrink-0">
                        {post.authorInitial}
                      </div>

                      <div className="flex-1">
                        {/* Post Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{post.icon}</span>
                              <h3 className="text-lg font-bold text-white">{post.title}</h3>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                              <span>{post.author}</span>
                              <span>•</span>
                              <span>{post.time}</span>
                              <span className="px-2 py-0.5 bg-aurora-blue/20 text-aurora-blue rounded-full text-xs">
                                {post.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 mt-3">
                          <button className="flex items-center gap-2 text-gray-400 hover:text-aurora-blue transition-colors">
                            <span>💬</span>
                            <span className="text-sm">{post.comments} comments</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-400 hover:text-aurora-green transition-colors">
                            <span>👍</span>
                            <span className="text-sm">Like</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Link href="/neighborhoods/posts">
                  <button className="w-full py-3 bg-dark-800/50 hover:bg-dark-800 text-aurora-blue font-semibold rounded-xl transition-all duration-300 hover:scale-105">
                    View All Posts →
                  </button>
                </Link>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>👥</span>
                  <span>Neighborhood Directory</span>
                </h2>

                <div className="bg-dark-900/95 backdrop-blur-xl border-2 border-gray-700 rounded-2xl p-6">
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <p className="text-xl text-gray-300 mb-2">Member Directory Coming Soon</p>
                    <p className="text-gray-500">Browse verified neighbors, skills, and capabilities</p>
                  </div>
                </div>
              </div>
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>🛠️</span>
                  <span>Shared Resources</span>
                </h2>

                {MOCK_RESOURCES.map((resource, index) => (
                  <div
                    key={resource.id}
                    className="bg-dark-900/95 backdrop-blur-xl border-2 border-gray-700 hover:border-aurora-green/50 rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-5"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{resource.icon}</div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{resource.title}</h3>
                          <p className="text-gray-400 text-sm">Owned by {resource.owner}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          resource.available
                            ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {resource.available ? 'Available' : 'In Use'}
                        </span>
                        {resource.available && (
                          <button className="px-4 py-2 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-xl hover:shadow-aurora transition-all duration-300 hover:scale-105">
                            Request
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <Link href="/neighborhoods/resources">
                  <button className="w-full py-3 bg-dark-800/50 hover:bg-dark-800 text-aurora-blue font-semibold rounded-xl transition-all duration-300 hover:scale-105">
                    Browse All Resources →
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-dark-900/95 backdrop-blur-xl border-2 border-aurora-purple/30 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>📅</span>
                <span>Upcoming Events</span>
              </h3>

              <div className="space-y-3">
                {MOCK_EVENTS.map((event) => (
                  <div key={event.id} className="bg-dark-800/50 rounded-xl p-4 hover:bg-dark-700 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{event.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{event.title}</h4>
                        <p className="text-sm text-gray-400">{event.date}</p>
                        <p className="text-xs text-gray-500">{event.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/neighborhoods/events">
                <button className="w-full mt-4 py-2 bg-dark-800 hover:bg-dark-700 text-aurora-purple font-semibold rounded-xl transition-colors">
                  View Calendar →
                </button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="bg-dark-900/95 backdrop-blur-xl border-2 border-aurora-blue/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">This Week</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">New Alerts</span>
                  <span className="text-2xl font-bold text-aurora-blue">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Posts Created</span>
                  <span className="text-2xl font-bold text-aurora-green">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Resources Shared</span>
                  <span className="text-2xl font-bold text-aurora-purple">5</span>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🆘</span>
                <span>Emergency</span>
              </h3>

              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-300 font-semibold">RCMP</div>
                  <a href="tel:867-669-1111" className="text-aurora-blue hover:text-aurora-green">867-669-1111</a>
                </div>
                <div>
                  <div className="text-gray-300 font-semibold">Fire Department</div>
                  <a href="tel:867-873-2222" className="text-aurora-blue hover:text-aurora-green">867-873-2222</a>
                </div>
                <div>
                  <div className="text-gray-300 font-semibold">Power Outage (NTPC)</div>
                  <a href="tel:1-800-661-0855" className="text-aurora-blue hover:text-aurora-green">1-800-661-0855</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
