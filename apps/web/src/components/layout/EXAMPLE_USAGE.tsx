/**
 * EXAMPLE USAGE - Layout Components
 *
 * This file demonstrates how to use the shared layout components
 * in various scenarios across the YK Companion app.
 */

// ============================================
// EXAMPLE 1: Complete Page with All Features
// ============================================

import { AppLayout, PageHeader } from '@/components/layout';

export function ExampleFullPage() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: 'YK Buddy', href: '/' },
        { label: 'Living', href: '/living' },
        { label: 'Garage Sales' },
      ]}
    >
      <PageHeader
        icon="🛒"
        title="Garage Sale Planner"
        description="Find garage sales on the map, plan your route, and save your favorites."
      />

      {/* Your page content here */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-3">Feature 1</h3>
          <p className="text-gray-300">Content goes here...</p>
        </div>
      </div>
    </AppLayout>
  );
}

// ============================================
// EXAMPLE 2: Page Without Breadcrumbs
// ============================================

export function ExampleSimplePage() {
  return (
    <AppLayout>
      <PageHeader
        icon="🌌"
        title="Aurora Forecast"
        description="Real-time northern lights predictions and best viewing times."
      />

      {/* Page content */}
      <div className="space-y-6">{/* Content here */}</div>
    </AppLayout>
  );
}

// ============================================
// EXAMPLE 3: Page Without Banner/Menu (for special pages)
// ============================================

export function ExampleMinimalPage() {
  return (
    <AppLayout showBanner={false} showMenu={false}>
      <PageHeader icon="🔐" title="Admin Dashboard" description="Manage your YK Buddy settings." />

      {/* Admin content */}
    </AppLayout>
  );
}

// ============================================
// EXAMPLE 4: Using PageHeader with Custom Icon Component
// ============================================

import { BushPlaneIcon } from '@/components/NorthernIcons';

export function ExampleCustomIcon() {
  return (
    <AppLayout breadcrumbs={[{ label: 'YK Buddy', href: '/' }, { label: 'Visiting' }]}>
      <PageHeader
        icon={<BushPlaneIcon className="w-16 h-16 text-aurora-green" />}
        title="Planning Your Visit"
        description="Everything you need for the perfect Yellowknife trip."
      />

      {/* Page content */}
    </AppLayout>
  );
}

// ============================================
// EXAMPLE 5: Using Breadcrumbs Standalone
// ============================================

import { Breadcrumbs } from '@/components/layout';

export function ExampleStandaloneBreadcrumbs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'YK Buddy', href: '/' },
          { label: 'Living', href: '/living' },
          { label: 'Events', href: '/living/events' },
          { label: 'Folk on the Rocks' },
        ]}
      />

      <h1 className="text-3xl font-bold text-white">Event Details</h1>
    </div>
  );
}

// ============================================
// EXAMPLE 6: Converting Existing Page to Use Layout
// ============================================

// BEFORE:
/*
export default function MyPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">🏠</div>
              <h1 className="text-5xl font-bold text-white mb-4">Living in Yellowknife</h1>
              <p className="text-xl text-gray-300">Local events and community resources</p>
            </div>

            {/* Content *\/}
          </div>
        </div>
      </div>
    </>
  );
}
*/

// AFTER (simplified and consistent):
export function MyPageRefactored() {
  return (
    <AppLayout breadcrumbs={[{ label: 'YK Buddy', href: '/' }, { label: 'Living' }]}>
      <PageHeader
        icon="🏠"
        title="Living in Yellowknife"
        description="Local events and community resources"
      />

      {/* Your existing content - no wrapper divs needed! */}
      <div className="grid md:grid-cols-2 gap-6">{/* Content here */}</div>
    </AppLayout>
  );
}

// ============================================
// EXAMPLE 7: Deep Nested Pages with Breadcrumbs
// ============================================

export function ExampleDeepPage() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: 'YK Buddy', href: '/' },
        { label: 'Living', href: '/living' },
        { label: 'Community', href: '/living/community' },
        { label: 'Recreation', href: '/living/community/recreation' },
        { label: 'Fieldhouse' },
      ]}
    >
      <PageHeader
        icon="🏃"
        title="Fieldhouse"
        description="Indoor gym, track, and sports facilities."
      />

      {/* Facility details */}
    </AppLayout>
  );
}

// ============================================
// TIPS AND BEST PRACTICES
// ============================================

/**
 * TIPS:
 *
 * 1. Always use AppLayout for consistent UI/UX
 * 2. Use PageHeader for all main page titles
 * 3. Breadcrumbs help users understand their location in the app
 * 4. The last breadcrumb item should NOT have an href
 * 5. Icons can be emojis or React components
 * 6. Footer is automatically included by AppLayout
 * 7. Language selector and modals are handled automatically
 *
 * STYLING:
 *
 * - Background gradient is automatic (from-northern-midnight via-dark-800 to-gray-900)
 * - Use aurora colors: aurora-green, aurora-blue, aurora-purple
 * - Standard spacing: mb-12 for sections, mb-6 for subsections
 * - Content cards: bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20
 *
 * PERFORMANCE:
 *
 * - All layout components are client-side ('use client')
 * - Banner and menu are lazy-loaded when needed
 * - Modals only render when opened
 */
