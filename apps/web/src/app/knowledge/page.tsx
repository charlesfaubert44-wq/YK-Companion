'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SubmissionForm from '@/components/knowledge/SubmissionForm';
import type { KnowledgeSubmissionWithCategory, KnowledgeCategory, ContentType } from '@/types/knowledge.types';
import LanguageSelector from '@/components/LanguageSelector';

export default function KnowledgePage() {
  const [submissions, setSubmissions] = useState<KnowledgeSubmissionWithCategory[]>([]);
  const [categories, setCategories] = useState<KnowledgeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<ContentType | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchSubmissions();
  }, [selectedCategory, selectedType, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/knowledge/categories');
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category_id', selectedCategory);
      if (selectedType) params.append('content_type', selectedType);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/knowledge?${params}`);
      const data = await response.json();
      setSubmissions(data.data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const contentTypeIcons: Record<ContentType, string> = {
    fact: '💡',
    story: '📖',
    tip: '⭐',
    history: '📜',
    culture: '🪶',
    activity: '🎣',
  };

  const getSeasonIcon = (season: string | null) => {
    const icons: Record<string, string> = {
      winter: '❄️',
      spring: '🌸',
      summer: '☀️',
      fall: '🍂',
      'year-round': '🌍',
    };
    return season ? icons[season] : null;
  };

  if (showSubmitForm) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900">
        {/* Header */}
        <div className="fixed top-6 left-6 right-6 z-50 flex justify-between items-center">
          <button
            onClick={() => setShowSubmitForm(false)}
            className="text-gray-400 hover:text-aurora-green transition-colors text-sm flex items-center gap-2"
          >
            <span>←</span> Back to Knowledge Base
          </button>
          <LanguageSelector />
        </div>

        <div className="max-w-4xl mx-auto px-6 py-20">
          <SubmissionForm
            onSuccess={() => {
              setShowSubmitForm(false);
              fetchSubmissions();
            }}
            onCancel={() => setShowSubmitForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900">
      {/* Header */}
      <div className="fixed top-6 left-6 right-6 z-50 flex justify-between items-center">
        <Link href="/" className="text-gray-400 hover:text-aurora-green transition-colors text-sm flex items-center gap-2">
          <span>←</span> Back to Home
        </Link>
        <LanguageSelector />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-aurora-green via-aurora-blue to-white bg-clip-text text-transparent">
            💎 Yellowknife Knowledge Base
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Discover local wisdom, stories, and insider knowledge about life in Yellowknife
          </p>
          <button
            onClick={() => setShowSubmitForm(true)}
            className="px-8 py-4 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all transform hover:scale-105"
          >
            📝 Share Your Knowledge
          </button>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Browse by Category</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                selectedCategory === ''
                  ? 'border-aurora-green bg-aurora-green/20 text-white'
                  : 'border-gray-700 bg-gray-800/30 text-gray-400 hover:border-gray-600'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedCategory === cat.id
                    ? 'border-aurora-green bg-aurora-green/20 text-white'
                    : 'border-gray-700 bg-gray-800/30 text-gray-400 hover:border-gray-600'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search knowledge..."
            className="w-full px-6 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-aurora-blue focus:outline-none transition-all"
          />
        </div>

        {/* Submissions Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⌛</div>
            <p className="text-gray-400">Loading knowledge...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-2xl font-bold text-white mb-3">No results found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters or be the first to share!</p>
            <button
              onClick={() => setShowSubmitForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all"
            >
              Share Your Knowledge
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg p-6 rounded-2xl border-2 border-gray-700/50 hover:border-aurora-blue/50 transition-all group cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{contentTypeIcons[submission.content_type]}</span>
                    <span className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-400 capitalize">
                      {submission.content_type}
                    </span>
                  </div>
                  {submission.is_featured && (
                    <span className="text-xl">⭐</span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-aurora-green transition-colors">
                  {submission.title}
                </h3>

                {/* Content Preview */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {submission.content}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {submission.season && (
                    <span className="text-xs px-2 py-1 bg-aurora-blue/20 border border-aurora-blue/40 rounded-full text-aurora-blue">
                      {getSeasonIcon(submission.season)} {submission.season}
                    </span>
                  )}
                  {submission.location_name && (
                    <span className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-400">
                      📍 {submission.location_name}
                    </span>
                  )}
                  {submission.category && (
                    <span className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-400">
                      {submission.category.icon} {submission.category.name}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {submission.tags && submission.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {submission.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 bg-aurora-green/10 text-aurora-green rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50 text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span>👁️ {submission.views}</span>
                    <span>❤️ {submission.likes}</span>
                  </div>
                  <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-700/30">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400">
              🏔️ Built with ❤️ on Yellowknives Dene First Nation territory
            </p>
            <p className="text-xs text-gray-500">
              Imagined by the Frozen Shield Team •{' '}
              <a
                href="https://frozenshield.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-aurora-blue hover:text-aurora-green transition-colors underline decoration-dotted"
              >
                frozenshield.com
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
