'use client';

import { useState } from 'react';
import type { ContentType, Season } from '@/types/knowledge.types';

interface SubmissionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function SubmissionForm({ onSuccess, onCancel }: SubmissionFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
    content_type: '' as ContentType | '',
    tags: [] as string[],
    location_name: '',
    season: '' as Season | '',
    submitter_name: '',
    submitter_email: '',
    sources: [] as string[],
  });

  const [tagInput, setTagInput] = useState('');
  const [sourceInput, setSourceInput] = useState('');

  const contentTypes: { value: ContentType; label: string; icon: string; desc: string }[] = [
    { value: 'fact', label: 'Fact', icon: '💡', desc: 'Interesting fact about Yellowknife' },
    { value: 'story', label: 'Story', icon: '📖', desc: 'Personal story or experience' },
    { value: 'tip', label: 'Tip', icon: '⭐', desc: 'Helpful tip for visitors or residents' },
    { value: 'history', label: 'History', icon: '📜', desc: 'Historical information' },
    { value: 'culture', label: 'Culture', icon: '🪶', desc: 'Cultural insight or tradition' },
    { value: 'activity', label: 'Activity', icon: '🎣', desc: 'Activity or experience to try' },
  ];

  const seasons = [
    { value: 'winter', label: 'Winter', icon: '❄️' },
    { value: 'spring', label: 'Spring', icon: '🌸' },
    { value: 'summer', label: 'Summer', icon: '☀️' },
    { value: 'fall', label: 'Fall', icon: '🍂' },
    { value: 'year-round', label: 'Year-Round', icon: '🌍' },
  ];

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const addSource = () => {
    if (sourceInput.trim() && !formData.sources.includes(sourceInput.trim())) {
      setFormData({ ...formData, sources: [...formData.sources, sourceInput.trim()] });
      setSourceInput('');
    }
  };

  const removeSource = (source: string) => {
    setFormData({ ...formData, sources: formData.sources.filter(s => s !== source) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.length > 0 ? formData.tags : undefined,
          sources: formData.sources.length > 0 ? formData.sources : undefined,
          category_id: formData.category_id || undefined,
          season: formData.season || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-gradient-to-br from-aurora-green/20 to-aurora-blue/10 border-2 border-aurora-green/40 rounded-2xl p-12 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-white mb-3">Submission Received!</h3>
        <p className="text-gray-300 mb-6">
          Thank you for sharing your knowledge about Yellowknife. Our team will review your submission and publish it soon.
        </p>
        <button
          onClick={onSuccess}
          className="px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all"
        >
          Browse Knowledge
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">📝 Share Your Knowledge</h2>
        <p className="text-gray-400">
          Help others discover Yellowknife by sharing facts, stories, tips, and local insights
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border-2 border-red-500/50 rounded-lg p-4 text-red-200">
          {error}
        </div>
      )}

      {/* Content Type Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">What are you sharing? *</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {contentTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData({ ...formData, content_type: type.value })}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                formData.content_type === type.value
                  ? 'border-aurora-green bg-aurora-green/10 shadow-glow'
                  : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">{type.icon}</div>
              <div className="font-semibold text-white text-sm">{type.label}</div>
              <div className="text-xs text-gray-400 mt-1">{type.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">Title *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., The Best Time to See the Northern Lights"
          className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-aurora-blue focus:outline-none transition-all"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">Content *</label>
        <textarea
          required
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Share your knowledge, story, or tip about Yellowknife..."
          rows={8}
          className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-aurora-blue focus:outline-none transition-all resize-vertical"
        />
        <p className="text-xs text-gray-500 mt-1">{formData.content.length} characters</p>
      </div>

      {/* Season (optional) */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">Season (optional)</label>
        <div className="flex flex-wrap gap-2">
          {seasons.map((season) => (
            <button
              key={season.value}
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  season: formData.season === season.value ? '' : (season.value as Season),
                })
              }
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                formData.season === season.value
                  ? 'border-aurora-blue bg-aurora-blue/20 text-white'
                  : 'border-gray-700 bg-gray-800/30 text-gray-400 hover:border-gray-600'
              }`}
            >
              <span className="mr-2">{season.icon}</span>
              {season.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location (optional) */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">Location (optional)</label>
        <input
          type="text"
          value={formData.location_name}
          onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
          placeholder="e.g., Old Town, Frame Lake Trail, Ragged Ass Road"
          className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-aurora-blue focus:outline-none transition-all"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">Tags (optional)</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Add tags (press Enter)"
            className="flex-1 px-4 py-2 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-aurora-blue focus:outline-none transition-all"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-aurora-blue/20 border-2 border-aurora-blue/40 rounded-lg text-aurora-blue hover:bg-aurora-blue/30 transition-all"
          >
            Add
          </button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-aurora-green/20 border border-aurora-green/40 rounded-full text-sm text-aurora-green flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-400 transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Sources (optional) */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">Sources / References (optional)</label>
        <div className="flex gap-2 mb-2">
          <input
            type="url"
            value={sourceInput}
            onChange={(e) => setSourceInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSource())}
            placeholder="Add source URL (press Enter)"
            className="flex-1 px-4 py-2 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-aurora-blue focus:outline-none transition-all"
          />
          <button
            type="button"
            onClick={addSource}
            className="px-4 py-2 bg-aurora-blue/20 border-2 border-aurora-blue/40 rounded-lg text-aurora-blue hover:bg-aurora-blue/30 transition-all"
          >
            Add
          </button>
        </div>
        {formData.sources.length > 0 && (
          <div className="space-y-2">
            {formData.sources.map((source, idx) => (
              <div
                key={idx}
                className="px-3 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-sm text-gray-300 flex items-center justify-between"
              >
                <span className="truncate">{source}</span>
                <button
                  type="button"
                  onClick={() => removeSource(source)}
                  className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submitter Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Your Name (optional)</label>
          <input
            type="text"
            value={formData.submitter_name}
            onChange={(e) => setFormData({ ...formData, submitter_name: e.target.value })}
            placeholder="How should we credit you?"
            className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-aurora-blue focus:outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Your Email (optional)</label>
          <input
            type="email"
            value={formData.submitter_email}
            onChange={(e) => setFormData({ ...formData, submitter_email: e.target.value })}
            placeholder="For updates on your submission"
            className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-aurora-blue focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-6 border-t border-gray-700">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-800 border-2 border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-all"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !formData.title || !formData.content || !formData.content_type}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : '🚀 Submit for Review'}
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Submissions are reviewed by our team to ensure quality and accuracy before being published.
      </p>
    </form>
  );
}
