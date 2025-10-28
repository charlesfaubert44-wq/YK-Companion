'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import InteractiveHeader from '@/components/InteractiveHeader';
import Link from 'next/link';

export default function SavedItemsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  if (!loading && !user) {
    router.push('/');
    return null;
  }

  if (loading) {
    return (
      <>
        <InteractiveHeader />
        <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900 pt-20">
          <div className="container mx-auto px-4 py-12 flex items-center justify-center">
            <div className="text-white text-xl">Loading...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <InteractiveHeader />
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">🔖</div>
              <h1 className="text-4xl font-bold text-white mb-2">Saved Items</h1>
              <p className="text-gray-400">Your bookmarked places, activities, and resources</p>
            </div>

            {/* Empty State */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-6">📭</div>
                <h3 className="text-2xl font-bold text-white mb-4">No Saved Items Yet</h3>
                <p className="text-gray-400 mb-8">
                  Start exploring Yellowknife and save your favorite places, activities, and resources to access them here.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/visiting"
                    className="group px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-xl hover:shadow-aurora transition-all inline-flex items-center justify-center gap-2"
                  >
                    <span>Explore Visiting</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                  <Link
                    href="/living"
                    className="group px-6 py-3 bg-gradient-to-r from-aurora-blue to-aurora-purple text-white font-semibold rounded-xl hover:shadow-aurora transition-all inline-flex items-center justify-center gap-2"
                  >
                    <span>Explore Living</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Coming Soon Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-gradient-to-br from-aurora-green/10 to-transparent p-6 rounded-xl border border-aurora-green/20">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-lg font-bold text-white mb-2">Places</h3>
                <p className="text-sm text-gray-400">Save restaurants, viewpoints, and attractions</p>
              </div>
              <div className="bg-gradient-to-br from-aurora-blue/10 to-transparent p-6 rounded-xl border border-aurora-blue/20">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-bold text-white mb-2">Activities</h3>
                <p className="text-sm text-gray-400">Bookmark tours, events, and experiences</p>
              </div>
              <div className="bg-gradient-to-br from-aurora-purple/10 to-transparent p-6 rounded-xl border border-aurora-purple/20">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-lg font-bold text-white mb-2">Resources</h3>
                <p className="text-sm text-gray-400">Keep track of useful guides and tips</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
