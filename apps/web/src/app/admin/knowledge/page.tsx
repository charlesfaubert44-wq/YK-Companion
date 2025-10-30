'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import type {
  KnowledgeSubmissionWithCategory,
  KnowledgeStats,
  SubmissionStatus,
} from '@/types/knowledge.types';

export default function AdminKnowledgePage() {
  const { profile, loading: authLoading } = useAuth();
  const [submissions, setSubmissions] = useState<KnowledgeSubmissionWithCategory[]>([]);
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [filter, setFilter] = useState<SubmissionStatus | 'all'>('pending');
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] =
    useState<KnowledgeSubmissionWithCategory | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (profile?.is_admin) {
      fetchStats();
      fetchSubmissions();
    }
  }, [profile, filter]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/knowledge/admin/stats');
      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);

      // Fetch all submissions (admin can see all)
      const response = await fetch(`/api/knowledge?${params}&limit=100`);
      const data = await response.json();

      // Filter by status locally since we need admin access
      let filteredData = data.data || [];
      if (filter !== 'all') {
        filteredData = filteredData.filter((s: any) => s.status === filter);
      }

      setSubmissions(filteredData);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (
    submissionId: string,
    status: 'approved' | 'rejected' | 'flagged'
  ) => {
    try {
      const response = await fetch('/api/knowledge/admin/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: submissionId,
          status,
          review_notes: reviewNotes || undefined,
          rejection_reason: status === 'rejected' ? rejectionReason : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to review submission');
      }

      // Refresh data
      await fetchStats();
      await fetchSubmissions();

      // Reset form
      setSelectedSubmission(null);
      setReviewNotes('');
      setRejectionReason('');
    } catch (error) {
      console.error('Error reviewing submission:', error);
      alert('Failed to review submission');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-3">Access Denied</h1>
          <p className="text-gray-400 mb-6">You need admin privileges to access this page.</p>
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all inline-block"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const statusColors: Record<SubmissionStatus, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    approved: 'bg-green-500/20 text-green-400 border-green-500/40',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/40',
    flagged: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900">
      {/* Header */}
      <div className="border-b border-gray-700/50 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">🛡️ Knowledge Base Admin</h1>
            <p className="text-sm text-gray-400">Review and manage community submissions</p>
          </div>
          <Link
            href="/admin"
            className="text-gray-400 hover:text-aurora-green transition-colors text-sm"
          >
            ← Back to Admin
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800/50 border-2 border-gray-700/50 rounded-xl p-6">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-3xl font-bold text-white">{stats.total_submissions}</div>
              <div className="text-sm text-gray-400">Total Submissions</div>
            </div>
            <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl p-6">
              <div className="text-3xl mb-2">⏳</div>
              <div className="text-3xl font-bold text-yellow-400">{stats.pending_submissions}</div>
              <div className="text-sm text-gray-400">Pending Review</div>
            </div>
            <div className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-6">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-3xl font-bold text-green-400">{stats.approved_submissions}</div>
              <div className="text-sm text-gray-400">Approved</div>
            </div>
            <div className="bg-aurora-blue/10 border-2 border-aurora-blue/30 rounded-xl p-6">
              <div className="text-3xl mb-2">👁️</div>
              <div className="text-3xl font-bold text-aurora-blue">{stats.total_views}</div>
              <div className="text-sm text-gray-400">Total Views</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'approved', 'rejected', 'flagged'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg border-2 transition-all capitalize ${
                filter === status
                  ? 'border-aurora-green bg-aurora-green/20 text-white'
                  : 'border-gray-700 bg-gray-800/30 text-gray-400 hover:border-gray-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⌛</div>
            <p className="text-gray-400">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/30 rounded-2xl border-2 border-gray-700/50">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-white mb-3">No submissions found</h3>
            <p className="text-gray-400">
              No {filter !== 'all' ? filter : ''} submissions at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map(submission => (
              <div
                key={submission.id}
                className="bg-gray-800/50 border-2 border-gray-700/50 rounded-xl p-6 hover:border-gray-600 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{submission.title}</h3>
                      <span
                        className={`text-xs px-3 py-1 rounded-full border ${statusColors[submission.status]}`}
                      >
                        {submission.status}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-400 capitalize">
                        {submission.content_type}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-3">{submission.content}</p>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                      {submission.submitter_name && <span>👤 {submission.submitter_name}</span>}
                      {submission.location_name && <span>📍 {submission.location_name}</span>}
                      {submission.season && <span>🌤️ {submission.season}</span>}
                      <span>📅 {new Date(submission.created_at).toLocaleString()}</span>
                      <span>👁️ {submission.views} views</span>
                      <span>❤️ {submission.likes} likes</span>
                    </div>

                    {/* Tags */}
                    {submission.tags && submission.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {submission.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-aurora-green/10 text-aurora-green rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Review Actions */}
                  {submission.status === 'pending' && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleReview(submission.id, 'approved')}
                        className="px-4 py-2 bg-green-500/20 border-2 border-green-500/40 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="px-4 py-2 bg-red-500/20 border-2 border-red-500/40 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                      >
                        ❌ Reject
                      </button>
                      <button
                        onClick={() => handleReview(submission.id, 'flagged')}
                        className="px-4 py-2 bg-orange-500/20 border-2 border-orange-500/40 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-all"
                      >
                        🚩 Flag
                      </button>
                    </div>
                  )}
                </div>

                {/* Rejection Modal */}
                {selectedSubmission?.id === submission.id && (
                  <div className="mt-4 p-4 bg-gray-900/80 border-2 border-red-500/40 rounded-lg">
                    <h4 className="text-white font-semibold mb-3">Rejection Details</h4>
                    <textarea
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                      placeholder="Reason for rejection (required)"
                      className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 mb-3"
                      rows={3}
                    />
                    <textarea
                      value={reviewNotes}
                      onChange={e => setReviewNotes(e.target.value)}
                      placeholder="Additional notes (optional)"
                      className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 mb-3"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (rejectionReason.trim()) {
                            handleReview(submission.id, 'rejected');
                          } else {
                            alert('Please provide a rejection reason');
                          }
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                      >
                        Confirm Rejection
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSubmission(null);
                          setRejectionReason('');
                          setReviewNotes('');
                        }}
                        className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
