'use client';

import Link from 'next/link';
import { useAdminGuard } from '@/hooks/useAdminGuard';

export default function ContentManagementPage() {
  const { loading: authLoading, isAdmin } = useAdminGuard();

  // Show loading state while checking auth
  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const contentSections = [
    {
      title: 'Knowledge Database',
      description: 'Manage user-submitted knowledge entries, facts, and stories',
      icon: '📚',
      href: '/admin/knowledge',
      color: 'from-aurora-green to-aurora-blue',
      items: [
        'Review pending submissions',
        'Approve or reject entries',
        'Manage knowledge categories',
        'View submission statistics',
      ],
    },
    {
      title: 'Premium Sponsors',
      description: 'Manage premium spotlight placements and sponsor listings',
      icon: '✨',
      href: '/admin/sponsors',
      color: 'from-yellow-400 to-yellow-600',
      items: [
        'Add new sponsors',
        'Edit existing sponsors',
        'Configure pricing plans',
        'Track payment status',
      ],
    },
    {
      title: 'Banners & Themes',
      description: 'Customize seasonal and holiday banners',
      icon: '🎨',
      href: '/admin/banners',
      color: 'from-aurora-blue to-aurora-purple',
      items: [
        'Preview all banner variations',
        'Set active banners',
        'Configure auto-detection',
        'Upload custom banners',
      ],
    },
    {
      title: 'Pricing Plans',
      description: 'Configure premium spotlight pricing structure',
      icon: '💰',
      href: '/admin/pricing-plans',
      color: 'from-aurora-purple to-aurora-pink',
      items: [
        'Create pricing tiers',
        'Set volume discounts',
        'Configure position multipliers',
        'Manage plan availability',
      ],
    },
  ];

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
                Content Management
              </h1>
              <p className="text-gray-300 mt-2">
                Manage all platform content, submissions, and configurations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Content Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Content Sections</h2>
          <p className="text-gray-400">
            Select a section below to manage specific content areas of the platform.
          </p>
        </div>

        {/* Content Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {contentSections.map((section, index) => (
            <div
              key={index}
              className="bg-dark-800 rounded-xl border border-aurora-green/20 overflow-hidden hover:border-aurora-green/40 transition-all"
            >
              <div className={`bg-gradient-to-r ${section.color} p-6`}>
                <div className="flex items-center gap-4">
                  <div className="text-6xl">{section.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white">{section.title}</h3>
                    <p className="text-white/90 text-sm mt-1">{section.description}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-white font-semibold mb-3">Features:</h4>
                <ul className="space-y-2 mb-6">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-aurora-green mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={section.href}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-aurora-green text-dark-900 rounded-lg font-semibold hover:bg-aurora-blue transition-all group"
                >
                  Manage {section.title}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Content Quick Stats</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
              <div className="text-gray-400 text-sm">Knowledge Submissions</div>
              <div className="text-3xl font-bold text-white mt-2">View Stats</div>
              <Link
                href="/admin/knowledge"
                className="mt-4 text-aurora-green text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                Go to Knowledge →
              </Link>
            </div>

            <div className="bg-dark-800 rounded-xl p-6 border border-yellow-500/20">
              <div className="text-gray-400 text-sm">Active Sponsors</div>
              <div className="text-3xl font-bold text-white mt-2">Manage</div>
              <Link
                href="/admin/sponsors"
                className="mt-4 text-yellow-400 text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                Go to Sponsors →
              </Link>
            </div>

            <div className="bg-dark-800 rounded-xl p-6 border border-aurora-blue/20">
              <div className="text-gray-400 text-sm">Active Banners</div>
              <div className="text-3xl font-bold text-white mt-2">11 Variations</div>
              <Link
                href="/admin/banners"
                className="mt-4 text-aurora-blue text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                Go to Banners →
              </Link>
            </div>

            <div className="bg-dark-800 rounded-xl p-6 border border-aurora-purple/20">
              <div className="text-gray-400 text-sm">Pricing Plans</div>
              <div className="text-3xl font-bold text-white mt-2">Configure</div>
              <Link
                href="/admin/pricing-plans"
                className="mt-4 text-aurora-purple text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                Go to Pricing →
              </Link>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-12 bg-aurora-green/10 border border-aurora-green/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-aurora-green mb-3">💡 Content Management Tips</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-aurora-green mt-1">•</span>
              <span>Review knowledge submissions regularly to maintain content quality</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-aurora-green mt-1">•</span>
              <span>Keep banners updated for seasonal events and holidays</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-aurora-green mt-1">•</span>
              <span>Monitor sponsor placements and ensure accurate pricing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-aurora-green mt-1">•</span>
              <span>Adjust pricing plans based on demand and market conditions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
