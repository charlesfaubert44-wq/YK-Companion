// Aurora Enhancements Types - All Future Features

import { AuroraPhoto } from './aurora.types';

// =====================================================
// PUSH NOTIFICATIONS
// =====================================================

export interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  notify_kp_threshold: number;
  notify_new_event: boolean;
  notify_photo_featured: boolean;
  notify_challenge_start: boolean;
  notify_mosaic_ready: boolean;
  device_type: string | null;
  browser: string | null;
  last_sent: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PushNotification {
  id: string;
  user_id: string;
  subscription_id: string;
  notification_type: 'kp_spike' | 'new_event' | 'featured' | 'challenge' | 'mosaic_ready';
  title: string;
  body: string;
  data: any;
  sent_at: string;
  clicked: boolean;
  clicked_at: string | null;
  created_at: string;
}

// =====================================================
// PHOTOGRAPHY CHALLENGES
// =====================================================

export interface AuroraChallenge {
  id: string;
  title: string;
  description: string;
  rules: string | null;
  start_date: string;
  end_date: string;
  required_tags: string[];
  min_kp: number | null;
  location_specific: boolean;
  winner_count: number;
  badge_name: string | null;
  participant_count: number;
  entry_count: number;
  status: 'upcoming' | 'active' | 'judging' | 'completed';
  created_at: string;
  updated_at: string;

  // Joined data
  current_entries?: number;
  user_entry?: AuroraPhoto;
  winners?: ChallengeWinner[];
}

export interface ChallengeWinner {
  id: string;
  challenge_id: string;
  photo_id: string;
  user_id: string;
  rank: number;
  final_score: number;
  community_votes: number;
  judge_score: number;
  created_at: string;

  // Joined data
  photo?: AuroraPhoto;
  photographer_name?: string;
}

// =====================================================
// BADGES & ACHIEVEMENTS
// =====================================================

export interface UserBadge {
  id: string;
  user_id: string;
  badge_type: string;
  badge_name: string;
  badge_description: string | null;
  badge_icon: string | null;
  earned_for: string | null;
  challenge_id: string | null;
  photo_id: string | null;
  earned_at: string;
  created_at: string;
}

export const BADGE_TYPES = {
  first_upload: {
    name: 'First Light',
    description: 'Uploaded your first aurora photo',
    icon: '🌟',
  },
  '10_uploads': {
    name: 'Aurora Chaser',
    description: 'Uploaded 10 aurora photos',
    icon: '📸',
  },
  '50_uploads': {
    name: 'Aurora Master',
    description: 'Uploaded 50 aurora photos',
    icon: '👑',
  },
  first_featured: {
    name: 'Spotlight',
    description: 'Had a photo featured',
    icon: '⭐',
  },
  challenge_winner: {
    name: 'Champion',
    description: 'Won a photography challenge',
    icon: '🏆',
  },
  most_liked: {
    name: 'Community Favorite',
    description: 'Received 100 likes',
    icon: '❤️',
  },
  perfect_score: {
    name: 'Perfectionist',
    description: 'Achieved perfect AI quality score',
    icon: '💯',
  },
} as const;

// =====================================================
// LEADERBOARDS
// =====================================================

export interface LeaderboardEntry {
  user_id: string;
  photographer_name: string;
  total_photos: number;
  total_likes: number;
  avg_ai_score: number;
  featured_count: number;
  badge_count: number;
  last_upload: string;
  rank?: number;
}

export interface LeaderboardFilters {
  timeframe: 'all_time' | 'this_month' | 'this_week' | 'today';
  metric: 'total_likes' | 'avg_ai_score' | 'total_photos' | 'featured_count';
}

// =====================================================
// FORECASTS
// =====================================================

export interface AuroraForecast {
  id: string;
  forecast_date: string;
  forecast_hour: number;
  predicted_kp: number;
  predicted_probability: number | null;
  confidence_level: 'low' | 'medium' | 'high';
  confidence_score: number;
  model_version: string | null;
  data_source: string;
  actual_kp: number | null;
  accuracy_score: number | null;
  created_at: string;
}

export interface ForecastAccuracy {
  data_source: string;
  avg_accuracy: number;
  total_forecasts: number;
  accurate_forecasts: number;
}

// =====================================================
// EMAIL DIGESTS
// =====================================================

export interface EmailDigestPreferences {
  user_id: string;
  digest_frequency: 'daily' | 'weekly' | 'monthly' | 'never';
  digest_day: number | null;
  include_top_photos: boolean;
  include_mosaics: boolean;
  include_forecast: boolean;
  include_challenges: boolean;
  include_personal_stats: boolean;
  last_sent: string | null;
  next_scheduled: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailDigest {
  id: string;
  user_id: string;
  digest_type: 'daily' | 'weekly' | 'monthly';
  period_start: string;
  period_end: string;
  photos_included: number;
  mosaics_included: number;
  events_covered: number;
  sent_at: string;
  opened: boolean;
  opened_at: string | null;
  clicks: number;
  created_at: string;
}

// =====================================================
// AR CAMERA
// =====================================================

export interface ARCameraSettings {
  iso: number;
  shutter_speed: string;
  aperture: string;
  white_balance: string;
  tips: string[];
}

export interface ARCameraRecommendation {
  id: string;
  kp_index: number;
  brightness_level: 'dim' | 'moderate' | 'bright';
  beginner_settings: ARCameraSettings;
  intermediate_settings: ARCameraSettings;
  advanced_settings: ARCameraSettings;
  phone_model_overrides: Record<string, Partial<ARCameraSettings>>;
  created_at: string;
  updated_at: string;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

// =====================================================
// AI PHOTO SCORING
// =====================================================

export interface AIPhotoScore {
  ai_quality_score: number; // 0.00-1.00
  composition_score: number;
  color_score: number;
  technical_score: number;
  ai_tags: string[];
}

export interface AIScoreBreakdown {
  overall: number;
  composition: {
    score: number;
    feedback: string[];
  };
  color: {
    score: number;
    feedback: string[];
  };
  technical: {
    score: number;
    feedback: string[];
  };
  suggestions: string[];
}

// =====================================================
// WEBSOCKET REAL-TIME
// =====================================================

export interface RealtimeSubscription {
  id: string;
  user_id: string;
  connection_id: string;
  event_id: string;
  connected_at: string;
  last_ping: string;
  active: boolean;
  created_at: string;
}

export interface WebSocketMessage {
  type:
    | 'photo_uploaded'
    | 'photo_liked'
    | 'kp_updated'
    | 'event_started'
    | 'event_ended'
    | 'mosaic_created';
  event_id?: string;
  data: any;
  timestamp: string;
}

// =====================================================
// PRINT-QUALITY DOWNLOADS
// =====================================================

export interface PrintOptions {
  resolution: '4K' | '8K' | '12K';
  dpi: 150 | 300 | 600;
  format: 'JPG' | 'PNG' | 'TIFF';
  color_profile: 'sRGB' | 'AdobeRGB' | 'ProPhoto';
  size: {
    width: number;
    height: number;
    unit: 'px' | 'in' | 'cm';
  };
}

export interface PrintDownload {
  mosaic_id: string;
  options: PrintOptions;
  file_size_mb: number;
  download_url: string;
  expires_at: string;
}

// =====================================================
// USER STATISTICS
// =====================================================

export interface UserStatistics {
  total_uploads: number;
  total_likes_received: number;
  avg_ai_score: number;
  best_photo_score: number;
  featured_photos: number;
  badges_earned: number;
  challenges_entered: number;
  challenges_won: number;
  rank_overall: number;
  rank_this_month: number;
  events_participated: number;
  mosaics_created: number;
  mosaics_featured_in: number;
}

// =====================================================
// NOTIFICATION PREFERENCES
// =====================================================

export interface NotificationPreferences {
  push_enabled: boolean;
  push_kp_threshold: number;
  push_new_event: boolean;
  push_photo_featured: boolean;
  push_challenge_start: boolean;
  push_mosaic_ready: boolean;

  email_enabled: boolean;
  email_digest_frequency: 'daily' | 'weekly' | 'monthly' | 'never';
  email_top_photos: boolean;
  email_mosaics: boolean;
  email_forecast: boolean;
  email_challenges: boolean;
  email_personal_stats: boolean;
}
