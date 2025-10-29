'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SavedArticlesProps {
  userId: string;
}

interface SavedArticle {
  id: string;
  article_id: string;
  created_at: string;
  article: {
    id: string;
    title: string;
    excerpt?: string;
    category?: string;
    slug?: string;
  };
}

/**
 * SavedArticles Component
 * 
 * Displays user's saved knowledge articles with ability to remove from saved.
 */
export default function SavedArticles({ userId }: SavedArticlesProps) {
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedArticles();
  }, [userId]);

  const fetchSavedArticles = async () => {
    try {
      const response = await fetch(`/api/favorites?type=articles`);
      if (response.ok) {
        const data = await response.json();
        setSavedArticles(data.favorites || []);
      }
    } catch (error) {
      console.error('Error fetching saved articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (favoriteId: string) => {
    if (!confirm('Remove this article from your saved items?')) {
      return;
    }

    setRemoving(favoriteId);
    try {
      const response = await fetch(`/api/favorites?id=${favoriteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSavedArticles(prev => prev.filter(article => article.id !== favoriteId));
      }
    } catch (error) {
      console.error('Error removing article:', error);
      alert('Failed to remove article');
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-aurora-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (savedArticles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📰</div>
        <h3 className="text-2xl font-bold text-white mb-2">
          No Saved Articles
        </h3>
        <p className="text-gray-400 mb-6">
          You haven't saved any articles yet
        </p>
        <Link
          href="/knowledge"
          className="inline-block px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition"
        >
          Browse Knowledge Base
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {savedArticles.map((saved) => (
        <div
          key={saved.id}
          className="bg-dark-900/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 hover:border-aurora-blue/50 transition"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white pr-4">
              {saved.article.title}
            </h3>
            <button
              onClick={() => handleRemove(saved.id)}
              disabled={removing === saved.id}
              className="text-red-400 hover:text-red-300 transition disabled:opacity-50"
              title="Remove from saved"
            >
              {removing === saved.id ? '...' : '❌'}
            </button>
          </div>

          {saved.article.category && (
            <div className="mb-3">
              <span className="px-3 py-1 bg-aurora-purple/20 text-aurora-purple rounded-full text-xs font-semibold">
                {saved.article.category}
              </span>
            </div>
          )}

          {saved.article.excerpt && (
            <p className="text-gray-400 text-sm line-clamp-3 mb-4">
              {saved.article.excerpt}
            </p>
          )}

          <Link
            href={`/knowledge`}
            className="inline-block px-4 py-2 bg-aurora-blue/20 text-aurora-blue hover:bg-aurora-blue/30 rounded-lg transition text-sm font-medium"
          >
            Read Article →
          </Link>

          <div className="mt-3 pt-3 border-t border-gray-700/50 text-xs text-gray-500">
            Saved {new Date(saved.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}

