'use client';

import { useState, useEffect } from 'react';
import { UserBadge, BADGE_TYPES, UserStatistics } from '@/types/aurora-enhancements.types';

interface Props {
  userId: string;
  compact?: boolean;
}

export default function BadgeDisplay({ userId, compact = false }: Props) {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<UserBadge | null>(null);

  useEffect(() => {
    fetchBadges();
    fetchStats();
  }, [userId]);

  const fetchBadges = async () => {
    try {
      // TODO: Replace with actual Supabase call
      // const { data } = await supabase
      //   .from('user_badges')
      //   .select('*')
      //   .eq('user_id', userId)
      //   .order('earned_at', { ascending: false });

      // Mock badges
      const mockBadges: UserBadge[] = [
        {
          id: '1',
          user_id: userId,
          badge_type: 'first_upload',
          badge_name: BADGE_TYPES.first_upload.name,
          badge_description: BADGE_TYPES.first_upload.description,
          badge_icon: BADGE_TYPES.first_upload.icon,
          earned_for: 'Uploaded first aurora photo on Jan 15, 2025',
          challenge_id: null,
          photo_id: 'photo1',
          earned_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: userId,
          badge_type: '10_uploads',
          badge_name: BADGE_TYPES['10_uploads'].name,
          badge_description: BADGE_TYPES['10_uploads'].description,
          badge_icon: BADGE_TYPES['10_uploads'].icon,
          earned_for: 'Reached 10 aurora photos',
          challenge_id: null,
          photo_id: null,
          earned_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          user_id: userId,
          badge_type: 'first_featured',
          badge_name: BADGE_TYPES.first_featured.name,
          badge_description: BADGE_TYPES.first_featured.description,
          badge_icon: BADGE_TYPES.first_featured.icon,
          earned_for: 'Photo featured in community gallery',
          challenge_id: null,
          photo_id: 'photo5',
          earned_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
        },
        {
          id: '4',
          user_id: userId,
          badge_type: 'challenge_winner',
          badge_name: BADGE_TYPES.challenge_winner.name,
          badge_description: BADGE_TYPES.challenge_winner.description,
          badge_icon: BADGE_TYPES.challenge_winner.icon,
          earned_for: 'Won "Frame Lake Reflections" challenge',
          challenge_id: 'challenge2',
          photo_id: 'photo8',
          earned_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
        },
      ];

      setBadges(mockBadges);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      // TODO: Replace with actual Supabase call
      const mockStats: UserStatistics = {
        total_uploads: 24,
        total_likes_received: 342,
        avg_ai_score: 0.87,
        best_photo_score: 0.98,
        featured_photos: 5,
        badges_earned: 4,
        challenges_entered: 3,
        challenges_won: 1,
        rank_overall: 12,
        rank_this_month: 8,
        events_participated: 7,
        mosaics_created: 3,
        mosaics_featured_in: 15,
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getProgressToNextBadge = () => {
    const hasAuroraChaser = badges.some(b => b.badge_type === '10_uploads');
    const hasAuroraMaster = badges.some(b => b.badge_type === '50_uploads');

    if (stats) {
      if (!hasAuroraChaser && stats.total_uploads < 10) {
        return {
          badge: BADGE_TYPES['10_uploads'],
          current: stats.total_uploads,
          needed: 10,
          label: 'photos until Aurora Chaser',
        };
      } else if (hasAuroraChaser && !hasAuroraMaster && stats.total_uploads < 50) {
        return {
          badge: BADGE_TYPES['50_uploads'],
          current: stats.total_uploads,
          needed: 50,
          label: 'photos until Aurora Master',
        };
      } else if (stats.total_likes_received < 100) {
        return {
          badge: BADGE_TYPES.most_liked,
          current: stats.total_likes_received,
          needed: 100,
          label: 'likes until Community Favorite',
        };
      }
    }
    return null;
  };

  const nextBadgeProgress = getProgressToNextBadge();

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {badges.slice(0, 5).map(badge => (
          <div
            key={badge.id}
            title={`${badge.badge_name}: ${badge.badge_description}`}
            className="text-3xl cursor-pointer hover:scale-110 transition-transform"
          >
            {badge.badge_icon}
          </div>
        ))}
        {badges.length > 5 && (
          <div className="text-sm text-gray-400 self-center">+{badges.length - 5} more</div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="bg-dark-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">📊 Your Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-aurora-green">{stats.total_uploads}</div>
              <div className="text-sm text-gray-400">Photos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-aurora-blue">
                {stats.total_likes_received}
              </div>
              <div className="text-sm text-gray-400">Total Likes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-aurora-purple">
                {(stats.avg_ai_score * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-400">Avg Quality</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">#{stats.rank_overall}</div>
              <div className="text-sm text-gray-400">Overall Rank</div>
            </div>
          </div>
        </div>
      )}

      {/* Progress to Next Badge */}
      {nextBadgeProgress && (
        <div className="bg-gradient-to-r from-aurora-purple/10 to-aurora-pink/10 border border-aurora-purple/30 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-4xl">{nextBadgeProgress.badge.icon}</span>
            <div>
              <h3 className="text-lg font-bold text-white">{nextBadgeProgress.badge.name}</h3>
              <p className="text-sm text-gray-400">{nextBadgeProgress.badge.description}</p>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>
                {nextBadgeProgress.current} / {nextBadgeProgress.needed}
              </span>
              <span>
                {nextBadgeProgress.needed - nextBadgeProgress.current} {nextBadgeProgress.label}
              </span>
            </div>
            <div className="w-full bg-dark-900 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-aurora-purple to-aurora-pink h-3 rounded-full transition-all"
                style={{
                  width: `${(nextBadgeProgress.current / nextBadgeProgress.needed) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Earned Badges */}
      <div className="bg-dark-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">🏅 Your Badges ({badges.length})</h3>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading badges...</div>
        ) : badges.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-3">🎯</div>
            <p className="text-gray-400">
              No badges yet. Start uploading photos to earn your first badge!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map(badge => (
              <button
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className="bg-dark-900 rounded-lg p-4 border-2 border-gray-700 hover:border-aurora-purple/50 transition-all text-left group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-4xl group-hover:scale-110 transition-transform">
                    {badge.badge_icon}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-1">{badge.badge_name}</h4>
                    <p className="text-sm text-gray-400 mb-2">{badge.badge_description}</p>
                    <div className="text-xs text-gray-500">
                      Earned {new Date(badge.earned_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Available Badges */}
      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">🎯 Available Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(BADGE_TYPES).map(([type, badge]) => {
            const earned = badges.some(b => b.badge_type === type);
            return (
              <div
                key={type}
                className={`bg-dark-900 rounded-lg p-4 border-2 transition-all ${
                  earned ? 'border-aurora-green/30 opacity-50' : 'border-gray-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`text-4xl ${earned ? 'grayscale-0' : 'grayscale opacity-50'}`}>
                    {badge.icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white">{badge.name}</h4>
                      {earned && <span className="text-xs text-aurora-green">✓ Earned</span>}
                    </div>
                    <p className="text-sm text-gray-400">{badge.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-dark-900 rounded-2xl max-w-lg w-full border-2 border-aurora-purple/50 p-6">
            <div className="text-center">
              <div className="text-8xl mb-4">{selectedBadge.badge_icon}</div>
              <h2 className="text-3xl font-bold text-white mb-2">{selectedBadge.badge_name}</h2>
              <p className="text-gray-400 mb-4">{selectedBadge.badge_description}</p>

              <div className="bg-dark-800 rounded-lg p-4 mb-6 text-left">
                <div className="text-sm font-semibold text-aurora-purple mb-2">
                  Achievement Details
                </div>
                <div className="text-sm text-gray-300">{selectedBadge.earned_for}</div>
                <div className="text-xs text-gray-500 mt-2">
                  Earned on {new Date(selectedBadge.earned_at).toLocaleString()}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="flex-1 py-3 bg-dark-800 text-white hover:bg-dark-700 rounded-lg font-bold transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 py-3 bg-gradient-to-r from-aurora-purple to-aurora-pink text-white hover:shadow-glow rounded-lg font-bold transition-all">
                  📤 Share Badge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
