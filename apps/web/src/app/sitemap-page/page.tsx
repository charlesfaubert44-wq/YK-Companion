'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

interface PageInfo {
  path: string;
  title: string;
  description: string;
  category: string;
  icon: string;
}

const pages: PageInfo[] = [
  // Main Pages
  {
    path: '/',
    title: 'Home',
    description: 'Three-segment homepage for Visiting, Living, or Moving to Yellowknife',
    category: 'Main',
    icon: '🏠',
  },
  {
    path: '/about',
    title: 'About',
    description: 'Learn about YKBuddy and our mission to help people in Yellowknife',
    category: 'Main',
    icon: '📖',
  },
  {
    path: '/contact',
    title: 'Contact',
    description: 'Get in touch with the YKBuddy team',
    category: 'Main',
    icon: '📧',
  },

  // User Segment Pages
  {
    path: '/visiting',
    title: 'Visiting',
    description: 'Aurora forecasts, attractions, seasonal guides for tourists',
    category: 'User Segments',
    icon: '✈️',
  },
  {
    path: '/living',
    title: 'Living Here',
    description: 'Resources for residents: events, garage sales, community info',
    category: 'User Segments',
    icon: '🏘️',
  },
  {
    path: '/moving',
    title: 'Moving Here',
    description: 'Housing market, jobs, cost of living for people relocating',
    category: 'User Segments',
    icon: '🚚',
  },

  // Living Features
  {
    path: '/living/garage-sales',
    title: 'Garage Sale Planner',
    description: 'Plan your garage sale route with TSP algorithm optimization',
    category: 'Living Features',
    icon: '🗺️',
  },

  // Aurora Features
  {
    path: '/aurora',
    title: 'Aurora Tracker',
    description: 'Real-time aurora borealis tracking and forecasts',
    category: 'Aurora',
    icon: '🌌',
  },
  {
    path: '/aurora-live',
    title: 'Aurora Live Events',
    description: 'Live photo uploads, mosaics, challenges, badges, and real-time tracking',
    category: 'Aurora',
    icon: '📸',
  },

  // Tools & Utilities
  {
    path: '/calculator',
    title: 'Cost of Living Calculator',
    description: 'Calculate your monthly expenses in Yellowknife',
    category: 'Tools',
    icon: '💰',
  },
  {
    path: '/quiz',
    title: 'Yellowknife Quiz',
    description: 'Test your knowledge about Yellowknife',
    category: 'Tools',
    icon: '❓',
  },
  {
    path: '/seasonal',
    title: 'Seasonal Guide',
    description: 'What to expect and do in each season',
    category: 'Tools',
    icon: '🍁',
  },

  // Community Features
  {
    path: '/knowledge',
    title: 'Local Knowledge',
    description: 'Community-submitted tips, guides, and insider knowledge',
    category: 'Community',
    icon: '💡',
  },

  // Demo Pages
  {
    path: '/pixel-demo',
    title: 'Pixel UI Demo',
    description: 'Demo of the Pixel UI component library',
    category: 'Demo',
    icon: '🎨',
  },

  // Admin Pages
  {
    path: '/admin',
    title: 'Admin Dashboard',
    description: 'Main admin control panel',
    category: 'Admin',
    icon: '⚙️',
  },
  {
    path: '/admin/banners',
    title: 'Banner Management',
    description: 'Manage seasonal banners and announcements',
    category: 'Admin',
    icon: '🎯',
  },
  {
    path: '/admin/sponsors',
    title: 'Sponsor Management',
    description: 'Manage premium spotlight sponsors',
    category: 'Admin',
    icon: '💼',
  },
  {
    path: '/admin/pricing-plans',
    title: 'Pricing Plans',
    description: 'Configure premium spotlight pricing',
    category: 'Admin',
    icon: '💵',
  },
  {
    path: '/admin/knowledge',
    title: 'Knowledge Admin',
    description: 'Review and approve community knowledge submissions',
    category: 'Admin',
    icon: '✅',
  },
];

export default function SitemapPage() {
  const { t } = useLanguage();

  const categories = Array.from(new Set(pages.map(p => p.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900">
      {/* Top Navigation */}
      <div className="fixed top-6 left-6 right-6 z-50 flex justify-between items-center">
        <Link
          href="/"
          className="text-gray-400 hover:text-aurora-green transition-colors text-sm flex items-center gap-2"
        >
          <span>←</span> Back to Home
        </Link>
        <LanguageSelector />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-7xl mb-6">🗺️</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
            YKBuddy Sitemap
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Complete overview of all pages and features in the YKBuddy platform
          </p>
          <div className="mt-4 text-sm text-gray-400">
            Total Pages: <span className="text-aurora-green font-semibold">{pages.length}</span>
          </div>
        </div>

        {/* Pages by Category */}
        <div className="space-y-12">
          {categories.map(category => {
            const categoryPages = pages.filter(p => p.category === category);

            return (
              <div
                key={category}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8"
              >
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-aurora-blue">{category}</span>
                  <span className="text-sm text-gray-500 font-normal">
                    ({categoryPages.length} {categoryPages.length === 1 ? 'page' : 'pages'})
                  </span>
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {categoryPages.map(page => (
                    <Link key={page.path} href={page.path} className="group">
                      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 hover:border-aurora-green/50 transition-all hover:shadow-aurora">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl flex-shrink-0">{page.icon}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-aurora-green transition-colors">
                              {page.title}
                            </h3>
                            <p className="text-sm text-gray-400 mb-3 leading-relaxed">
                              {page.description}
                            </p>
                            <code className="text-xs text-aurora-blue font-mono bg-gray-800/80 px-2 py-1 rounded">
                              {page.path}
                            </code>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* API Routes Section */}
        <div className="mt-12 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-aurora-purple">API Routes</span>
          </h2>

          <div className="space-y-3">
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4">
              <code className="text-sm text-aurora-blue font-mono">GET /api/knowledge</code>
              <p className="text-xs text-gray-400 mt-1">Fetch community knowledge submissions</p>
            </div>
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4">
              <code className="text-sm text-aurora-blue font-mono">GET /api/knowledge/[id]</code>
              <p className="text-xs text-gray-400 mt-1">Get specific knowledge submission</p>
            </div>
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4">
              <code className="text-sm text-aurora-blue font-mono">
                GET /api/knowledge/categories
              </code>
              <p className="text-xs text-gray-400 mt-1">List all knowledge categories</p>
            </div>
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4">
              <code className="text-sm text-aurora-blue font-mono">
                GET /api/knowledge/admin/stats
              </code>
              <p className="text-xs text-gray-400 mt-1">Admin statistics for submissions</p>
            </div>
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4">
              <code className="text-sm text-aurora-blue font-mono">
                POST /api/knowledge/admin/review
              </code>
              <p className="text-xs text-gray-400 mt-1">Approve or reject knowledge submissions</p>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mt-12 bg-gradient-to-br from-aurora-green/10 to-aurora-blue/10 border-2 border-aurora-green/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Technology Stack</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="text-aurora-green font-semibold mb-2">Frontend</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Next.js 14 (App Router)</li>
                <li>• React 18</li>
                <li>• TypeScript 5</li>
                <li>• Tailwind CSS 3</li>
              </ul>
            </div>
            <div>
              <h3 className="text-aurora-blue font-semibold mb-2">Backend</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Supabase (PostgreSQL)</li>
                <li>• Row Level Security</li>
                <li>• API Routes</li>
                <li>• Server Components</li>
              </ul>
            </div>
            <div>
              <h3 className="text-aurora-purple font-semibold mb-2">Features</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• 9 Languages Support</li>
                <li>• Real-time Updates</li>
                <li>• Admin Dashboard</li>
                <li>• Premium Sponsors</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-700/30">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400">{t('footer')}</p>
            <p className="text-xs text-gray-500">{t('frozen_shield')}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
