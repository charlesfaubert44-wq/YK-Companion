'use client';

import { useState, useEffect } from 'react';
import {
  AuroraChallenge,
  ChallengeWinner,
  LeaderboardEntry,
  LeaderboardFilters,
} from '@/types/aurora-enhancements.types';
import { AuroraPhoto } from '@/types/aurora.types';

interface Props {
  userId?: string;
  onClose?: () => void;
}

export default function ChallengeLeaderboard({ userId, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard'>('challenges');
  const [challenges, setChallenges] = useState<AuroraChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filters, setFilters] = useState<LeaderboardFilters>({
    timeframe: 'this_month',
    metric: 'total_likes',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
    fetchLeaderboard();
  }, [filters]);

  const fetchChallenges = async () => {
    try {
      // TODO: Replace with actual Supabase call
      // const { data } = await supabase
      //   .from('aurora_challenges')
      //   .select('*, current_entries:challenge_entries(count)')
      //   .order('start_date', { ascending: false });

      // Mock challenges
      const mockChallenges: AuroraChallenge[] = [
        {
          id: '1',
          title: 'Golden Hour Aurora',
          description: 'Capture the aurora during twilight when the sky has a golden glow',
          rules: 'Must be taken between 5-7 PM or 5-7 AM. Show horizon and sky.',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          required_tags: ['twilight', 'horizon'],
          min_kp: 4.0,
          location_specific: false,
          winner_count: 3,
          badge_name: 'Twilight Master',
          participant_count: 24,
          entry_count: 47,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          current_entries: 47,
        },
        {
          id: '2',
          title: 'Frame Lake Reflections',
          description: 'Capture aurora reflections in Frame Lake',
          rules: 'Must show water reflection. Taken from Frame Lake Trail.',
          start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          required_tags: ['reflection', 'frame-lake'],
          min_kp: 5.0,
          location_specific: true,
          winner_count: 1,
          badge_name: 'Reflection Champion',
          participant_count: 18,
          entry_count: 32,
          status: 'completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          winners: [
            {
              id: 'w1',
              challenge_id: '2',
              photo_id: 'p1',
              user_id: 'u1',
              rank: 1,
              final_score: 95.5,
              community_votes: 142,
              judge_score: 9.5,
              created_at: new Date().toISOString(),
              photographer_name: 'Sarah Thompson',
            },
          ],
        },
        {
          id: '3',
          title: 'Maximum Color Challenge',
          description: 'Capture the most vibrant, colorful aurora display',
          rules: 'Must show multiple colors (green, purple, pink, red). No heavy editing.',
          start_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          required_tags: ['colorful', 'multicolor'],
          min_kp: 6.0,
          location_specific: false,
          winner_count: 5,
          badge_name: 'Rainbow Chaser',
          participant_count: 0,
          entry_count: 0,
          status: 'upcoming',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      setChallenges(mockChallenges);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual Supabase call with filters
      // const { data } = await supabase.rpc('get_leaderboard', {
      //   timeframe: filters.timeframe,
      //   metric: filters.metric,
      //   limit: 50
      // });

      // Mock leaderboard
      const mockLeaderboard: LeaderboardEntry[] = Array.from({ length: 20 }, (_, i) => ({
        user_id: `user-${i}`,
        photographer_name:
          ['Sarah', 'Mike', 'Emma', 'John', 'Lisa', 'David', 'Sophie', 'Alex'][i % 8] +
          ` ${i > 7 ? i + 1 : ''}`,
        total_photos: 50 - i * 2,
        total_likes: 500 - i * 20,
        avg_ai_score: 0.95 - i * 0.02,
        featured_count: 15 - i,
        badge_count: 8 - Math.floor(i / 3),
        last_upload: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        rank: i + 1,
      }));

      setLeaderboard(mockLeaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
    setLoading(false);
  };

  const getStatusBadge = (status: AuroraChallenge['status']) => {
    const styles = {
      active: 'bg-aurora-green/20 text-aurora-green border-aurora-green/30',
      upcoming: 'bg-aurora-blue/20 text-aurora-blue border-aurora-blue/30',
      completed: 'bg-gray-700/20 text-gray-400 border-gray-700/30',
      judging: 'bg-aurora-purple/20 text-aurora-purple border-aurora-purple/30',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getMetricLabel = (metric: LeaderboardFilters['metric']) => {
    const labels = {
      total_likes: '❤️ Total Likes',
      avg_ai_score: '⭐ Avg Quality',
      total_photos: '📸 Photo Count',
      featured_count: '🌟 Featured',
    };
    return labels[metric];
  };

  return (
    <div
      className={
        onClose
          ? 'fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4 overflow-y-auto'
          : ''
      }
    >
      <div
        className={`${onClose ? 'bg-dark-900 rounded-2xl max-w-6xl w-full border-2 border-aurora-purple/50 max-h-[90vh] overflow-y-auto' : 'w-full'}`}
      >
        {/* Header */}
        <div
          className={`${onClose ? 'sticky top-0 bg-dark-900 border-b border-gray-800 p-6 z-10' : 'mb-6'}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-aurora-purple to-aurora-pink bg-clip-text text-transparent mb-2">
                🏆 Challenges & Leaderboard
              </h2>
              <p className="text-gray-400">
                Compete in photography challenges and climb the rankings
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors text-2xl"
              >
                ✕
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setActiveTab('challenges')}
              className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
                activeTab === 'challenges'
                  ? 'bg-aurora-purple text-white'
                  : 'bg-dark-800 text-gray-400 hover:text-white'
              }`}
            >
              🎯 Challenges
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-aurora-purple text-white'
                  : 'bg-dark-800 text-gray-400 hover:text-white'
              }`}
            >
              📊 Leaderboard
            </button>
          </div>
        </div>

        <div className={onClose ? 'p-6' : ''}>
          {activeTab === 'challenges' ? (
            /* Challenges Tab */
            <div className="space-y-4">
              {challenges.map(challenge => (
                <div
                  key={challenge.id}
                  className="bg-dark-800 rounded-xl p-6 border-2 border-gray-700 hover:border-aurora-purple/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{challenge.title}</h3>
                        {getStatusBadge(challenge.status)}
                      </div>
                      <p className="text-gray-400 mb-3">{challenge.description}</p>
                      {challenge.rules && (
                        <div className="bg-dark-900 rounded-lg p-3 mb-3">
                          <div className="text-sm font-semibold text-aurora-blue mb-1">Rules:</div>
                          <div className="text-sm text-gray-300">{challenge.rules}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-dark-900 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-aurora-green">
                        {challenge.participant_count}
                      </div>
                      <div className="text-xs text-gray-400">Participants</div>
                    </div>
                    <div className="bg-dark-900 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-aurora-blue">
                        {challenge.entry_count}
                      </div>
                      <div className="text-xs text-gray-400">Entries</div>
                    </div>
                    <div className="bg-dark-900 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-aurora-purple">
                        {challenge.winner_count}
                      </div>
                      <div className="text-xs text-gray-400">Winners</div>
                    </div>
                    <div className="bg-dark-900 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {challenge.min_kp ? `KP ${challenge.min_kp}+` : 'Any'}
                      </div>
                      <div className="text-xs text-gray-400">Min KP</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                    <span>
                      📅 {new Date(challenge.start_date).toLocaleDateString()} -{' '}
                      {new Date(challenge.end_date).toLocaleDateString()}
                    </span>
                    {challenge.location_specific && <span>📍 Location-specific</span>}
                    {challenge.badge_name && <span>🏅 Badge: {challenge.badge_name}</span>}
                  </div>

                  {/* Winners (for completed challenges) */}
                  {challenge.status === 'completed' &&
                    challenge.winners &&
                    challenge.winners.length > 0 && (
                      <div className="bg-gradient-to-r from-yellow-500/10 to-aurora-purple/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                        <div className="font-bold text-white mb-2">🏆 Winners</div>
                        <div className="space-y-2">
                          {challenge.winners.map(winner => (
                            <div
                              key={winner.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">
                                  {winner.rank === 1 ? '🥇' : winner.rank === 2 ? '🥈' : '🥉'}
                                </span>
                                <span className="text-white font-semibold">
                                  {winner.photographer_name}
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-gray-400">❤️ {winner.community_votes}</span>
                                <span className="text-aurora-green font-bold">
                                  {winner.final_score.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Actions */}
                  {challenge.status === 'active' && (
                    <button className="w-full py-3 bg-gradient-to-r from-aurora-purple to-aurora-pink text-white font-bold rounded-lg hover:shadow-glow transition-all">
                      📸 Submit Entry
                    </button>
                  )}
                  {challenge.status === 'upcoming' && (
                    <button className="w-full py-3 bg-dark-900 text-aurora-blue font-bold rounded-lg border border-aurora-blue/30 hover:bg-aurora-blue/10 transition-all">
                      🔔 Notify Me When It Starts
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Leaderboard Tab */
            <div>
              {/* Filters */}
              <div className="bg-dark-800 rounded-xl p-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Timeframe
                    </label>
                    <select
                      value={filters.timeframe}
                      onChange={e =>
                        setFilters({
                          ...filters,
                          timeframe: e.target.value as LeaderboardFilters['timeframe'],
                        })
                      }
                      className="w-full px-4 py-2 bg-dark-900 text-white rounded-lg border border-gray-700 focus:border-aurora-purple"
                    >
                      <option value="today">Today</option>
                      <option value="this_week">This Week</option>
                      <option value="this_month">This Month</option>
                      <option value="all_time">All Time</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Rank By
                    </label>
                    <select
                      value={filters.metric}
                      onChange={e =>
                        setFilters({
                          ...filters,
                          metric: e.target.value as LeaderboardFilters['metric'],
                        })
                      }
                      className="w-full px-4 py-2 bg-dark-900 text-white rounded-lg border border-gray-700 focus:border-aurora-purple"
                    >
                      <option value="total_likes">Total Likes</option>
                      <option value="avg_ai_score">Avg Quality Score</option>
                      <option value="total_photos">Photo Count</option>
                      <option value="featured_count">Featured Count</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Leaderboard List */}
              {loading ? (
                <div className="text-center py-12 text-gray-400">Loading leaderboard...</div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map(entry => {
                    const isCurrentUser = userId && entry.user_id === userId;
                    const metricValue = entry[filters.metric];

                    return (
                      <div
                        key={entry.user_id}
                        className={`bg-dark-800 rounded-lg p-4 border-2 transition-all ${
                          isCurrentUser
                            ? 'border-aurora-purple bg-aurora-purple/5'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Rank */}
                          <div
                            className={`text-2xl font-bold w-12 text-center ${
                              entry.rank === 1
                                ? 'text-yellow-400'
                                : entry.rank === 2
                                  ? 'text-gray-300'
                                  : entry.rank === 3
                                    ? 'text-orange-400'
                                    : 'text-gray-500'
                            }`}
                          >
                            {entry.rank === 1
                              ? '🥇'
                              : entry.rank === 2
                                ? '🥈'
                                : entry.rank === 3
                                  ? '🥉'
                                  : `#${entry.rank}`}
                          </div>

                          {/* Photographer */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">
                                {entry.photographer_name}
                              </span>
                              {isCurrentUser && (
                                <span className="px-2 py-0.5 bg-aurora-purple/20 text-aurora-purple text-xs rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-400">
                              {entry.total_photos} photos · {entry.badge_count} badges · Last upload{' '}
                              {new Date(entry.last_upload).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Metric Value */}
                          <div className="text-right">
                            <div className="text-2xl font-bold text-aurora-green">
                              {typeof metricValue === 'number' && metricValue < 1
                                ? (metricValue * 100).toFixed(0) + '%'
                                : metricValue}
                            </div>
                            <div className="text-xs text-gray-400">
                              {getMetricLabel(filters.metric)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
