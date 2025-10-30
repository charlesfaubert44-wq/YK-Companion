'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SavedGarageSales from '@/components/saved/SavedGarageSales';
import SavedArticles from '@/components/saved/SavedArticles';

type TabType = 'garage-sales' | 'articles';

/**
 * Saved Items Page
 *
 * Displays user's saved/favorited items organized by tabs.
 * Includes garage sales, knowledge articles, and other saved content.
 */
export default function SavedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('garage-sales');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-aurora-blue border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-xl font-semibold">Loading saved items...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'garage-sales' as TabType, label: 'Garage Sales', icon: '🏷️', count: 0 },
    { id: 'articles' as TabType, label: 'Articles', icon: '📰', count: 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-aurora-green transition mb-6"
        >
          ← Back to Profile
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📑 Saved Items</h1>
          <p className="text-gray-400">Your bookmarked content and favorites</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-aurora-green to-aurora-blue text-white shadow-aurora'
                  : 'bg-dark-900/50 text-gray-400 hover:text-white hover:bg-dark-800'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'garage-sales' && <SavedGarageSales userId={user.id} />}

          {activeTab === 'articles' && <SavedArticles userId={user.id} />}
        </div>
      </div>
    </div>
  );
}
