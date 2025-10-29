'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface PageNode {
  name: string;
  path: string;
  description: string;
  icon: string;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
  children?: PageNode[];
}

export default function SitemapPage() {
  const { user, profile } = useAuth();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['main']));

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const siteStructure: { category: string; id: string; icon: string; pages: PageNode[] }[] = [
    {
      category: 'Main Pathways',
      id: 'main',
      icon: '🧭',
      pages: [
        {
          name: 'Home',
          path: '/',
          description: 'Welcome page with personalized content',
          icon: '🏠',
        },
        {
          name: 'Visiting YK',
          path: '/visiting',
          description: 'Planning your trip to Yellowknife',
          icon: '🧳',
          children: [
            {
              name: 'Visitor Logbook',
              path: '/visiting/logbook',
              description: 'Share your Yellowknife experience with photos and stories',
              icon: '✨',
            },
          ],
        },
        {
          name: 'Living in YK',
          path: '/living',
          description: 'Resources for Yellowknife residents',
          icon: '🏔️',
          children: [
            {
              name: 'Garage Sales',
              path: '/living/garage-sales',
              description: 'Find and post garage sales in Yellowknife',
              icon: '🏷️',
            },
          ],
        },
        {
          name: 'Moving to YK',
          path: '/moving',
          description: 'Everything you need to relocate to Yellowknife',
          icon: '🎒',
        },
      ],
    },
    {
      category: 'Planning Tools',
      id: 'tools',
      icon: '🛠️',
      pages: [
        {
          name: 'Trip Calculator',
          path: '/calculator',
          description: 'Calculate trip costs for visiting Yellowknife',
          icon: '💰',
        },
        {
          name: 'Traveler Quiz',
          path: '/quiz',
          description: 'Get personalized recommendations based on your travel style',
          icon: '🎯',
        },
        {
          name: 'Seasonal Planning',
          path: '/seasonal',
          description: 'Month-by-month guide for planning your visit',
          icon: '📅',
        },
      ],
    },
    {
      category: 'Aurora Features',
      id: 'aurora',
      icon: '🌌',
      pages: [
        {
          name: 'Aurora Forecast',
          path: '/aurora',
          description: 'Real-time northern lights predictions and forecasts',
          icon: '🌠',
        },
        {
          name: 'Aurora Live',
          path: '/aurora-live',
          description: 'Live aurora viewing events and updates',
          icon: '📡',
        },
      ],
    },
    {
      category: 'Community',
      id: 'community',
      icon: '👥',
      pages: [
        {
          name: 'Knowledge Base',
          path: '/knowledge',
          description: 'Community-contributed guides and articles',
          icon: '📚',
        },
        {
          name: 'Discover',
          path: '/discover',
          description: 'Explore Yellowknife attractions and activities',
          icon: '🔍',
        },
      ],
    },
    {
      category: 'User Features',
      id: 'user',
      icon: '👤',
      pages: [
        {
          name: 'Profile',
          path: '/profile',
          description: 'Manage your account and preferences',
          icon: '⚙️',
          requiresAuth: true,
        },
        {
          name: 'Saved Items',
          path: '/saved',
          description: 'View your saved garage sales and favorites',
          icon: '⭐',
          requiresAuth: true,
        },
      ],
    },
    {
      category: 'Admin Dashboard',
      id: 'admin',
      icon: '🔐',
      pages: [
        {
          name: 'Admin Home',
          path: '/admin',
          description: 'Admin dashboard overview',
          icon: '📊',
          requiresAdmin: true,
        },
        {
          name: 'Analytics',
          path: '/admin/analytics',
          description: 'View site analytics and metrics',
          icon: '📈',
          requiresAdmin: true,
        },
        {
          name: 'Sponsors',
          path: '/admin/sponsors',
          description: 'Manage premium sponsors',
          icon: '💎',
          requiresAdmin: true,
        },
        {
          name: 'Banners',
          path: '/admin/banners',
          description: 'Manage site banners and announcements',
          icon: '🎨',
          requiresAdmin: true,
        },
        {
          name: 'Users',
          path: '/admin/users',
          description: 'Manage user accounts',
          icon: '👥',
          requiresAdmin: true,
        },
        {
          name: 'Garage Sales',
          path: '/admin/garage-sales',
          description: 'Moderate garage sale listings',
          icon: '🏷️',
          requiresAdmin: true,
        },
        {
          name: 'Knowledge',
          path: '/admin/knowledge',
          description: 'Moderate knowledge base articles',
          icon: '📚',
          requiresAdmin: true,
        },
        {
          name: 'Pricing Plans',
          path: '/admin/pricing-plans',
          description: 'Manage subscription tiers',
          icon: '💳',
          requiresAdmin: true,
        },
        {
          name: 'Settings',
          path: '/admin/settings',
          description: 'Site configuration and settings',
          icon: '⚙️',
          requiresAdmin: true,
        },
      ],
    },
    {
      category: 'Information',
      id: 'info',
      icon: 'ℹ️',
      pages: [
        {
          name: 'About',
          path: '/about',
          description: 'Learn about YK Buddy',
          icon: '📖',
        },
        {
          name: 'Contact',
          path: '/contact',
          description: 'Get in touch with us',
          icon: '✉️',
        },
        {
          name: 'Sponsor Info',
          path: '/sponsor-info',
          description: 'Information for potential sponsors',
          icon: '🤝',
        },
        {
          name: 'Sitemap',
          path: '/sitemap',
          description: 'Complete site navigation and feature tree',
          icon: '🗺️',
        },
      ],
    },
  ];

  const canAccess = (page: PageNode): boolean => {
    if (page.requiresAdmin) {
      return !!profile?.is_admin;
    }
    if (page.requiresAuth) {
      return !!user;
    }
    return true;
  };

  const PageLink = ({ page, level = 0 }: { page: PageNode; level?: number }) => {
    const accessible = canAccess(page);
    const hasChildren = page.children && page.children.length > 0;
    const isExpanded = expandedSections.has(page.path);

    return (
      <div className={`${level > 0 ? 'ml-6 mt-2' : 'mt-3'}`}>
        <div className="flex items-start gap-3">
          {hasChildren && (
            <button
              onClick={() => toggleSection(page.path)}
              className="mt-1 text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          <div className={`flex-1 ${!hasChildren ? 'ml-7' : ''}`}>
            {accessible ? (
              <Link
                href={page.path}
                className="block p-3 bg-dark-700 hover:bg-dark-600 border border-gray-600 hover:border-aurora-green rounded-lg transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{page.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white group-hover:text-aurora-green transition-colors">
                        {page.name}
                      </h3>
                      {page.requiresAuth && (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                          Auth Required
                        </span>
                      )}
                      {page.requiresAdmin && (
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                          Admin Only
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{page.description}</p>
                    <p className="text-xs text-aurora-green mt-1 font-mono">{page.path}</p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="block p-3 bg-dark-800 border border-gray-700 rounded-lg opacity-50">
                <div className="flex items-start gap-3">
                  <span className="text-2xl opacity-50">{page.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-500">{page.name}</h3>
                      <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">
                        🔒 {page.requiresAdmin ? 'Admin Only' : 'Sign In Required'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{page.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2">
            {page.children?.map((child) => (
              <PageLink key={child.path} page={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const stats = {
    totalPages: siteStructure.reduce((acc, section) => {
      const pageCount = section.pages.reduce((count, page) => {
        return count + 1 + (page.children?.length || 0);
      }, 0);
      return acc + pageCount;
    }, 0),
    publicPages: siteStructure.reduce((acc, section) => {
      return acc + section.pages.filter((p) => !p.requiresAuth && !p.requiresAdmin).length;
    }, 0),
    authPages: siteStructure.reduce((acc, section) => {
      return acc + section.pages.filter((p) => p.requiresAuth).length;
    }, 0),
    adminPages: siteStructure.reduce((acc, section) => {
      return acc + section.pages.filter((p) => p.requiresAdmin).length;
    }, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-aurora-green/10 to-aurora-blue/10 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              🗺️ Site Map & Feature Tree
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              Complete navigation guide to all pages and features on YK Buddy
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
                <div className="text-3xl font-bold text-aurora-green">{stats.totalPages}</div>
                <div className="text-sm text-gray-400">Total Pages</div>
              </div>
              <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-400">{stats.publicPages}</div>
                <div className="text-sm text-gray-400">Public</div>
              </div>
              <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
                <div className="text-3xl font-bold text-yellow-400">{stats.authPages}</div>
                <div className="text-sm text-gray-400">Auth Required</div>
              </div>
              <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
                <div className="text-3xl font-bold text-red-400">{stats.adminPages}</div>
                <div className="text-sm text-gray-400">Admin Only</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setExpandedSections(new Set(siteStructure.map((s) => s.id)))}
            className="px-4 py-2 bg-aurora-green text-white rounded-lg hover:bg-aurora-green/80 transition-colors text-sm font-medium"
          >
            Expand All
          </button>
          <button
            onClick={() => setExpandedSections(new Set())}
            className="px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors text-sm font-medium"
          >
            Collapse All
          </button>
          <Link
            href="/"
            className="px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors text-sm font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Site Structure */}
        <div className="space-y-8">
          {siteStructure.map((section) => {
            const isExpanded = expandedSections.has(section.id);

            return (
              <div key={section.id} className="bg-dark-800 border border-gray-700 rounded-xl overflow-hidden">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-dark-900/50 hover:bg-dark-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{section.icon}</span>
                    <h2 className="text-2xl font-bold text-white">{section.category}</h2>
                    <span className="text-sm text-gray-400">({section.pages.length} items)</span>
                  </div>
                  <svg
                    className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Section Content */}
                {isExpanded && (
                  <div className="p-6">
                    {section.pages.map((page) => (
                      <PageLink key={page.path} page={page} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>This sitemap is automatically maintained and reflects the current site structure.</p>
          <p className="mt-2">
            {user ? (
              profile?.is_admin ? (
                <span className="text-aurora-green">✓ Logged in as Admin - Full access</span>
              ) : (
                <span className="text-blue-400">✓ Logged in - Access to user features</span>
              )
            ) : (
              <span>Not logged in - Some features require authentication</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
