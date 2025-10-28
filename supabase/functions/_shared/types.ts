/**
 * Shared type definitions for Supabase Edge Functions
 */

export interface Database {
  public: {
    Tables: {
      garage_sales: GarageSale
      aurora_photos: AuroraPhoto
      aurora_photo_likes: AuroraPhotoLike
      aurora_forecasts: AuroraForecast
      aurora_challenges: AuroraChallenge
      email_digest_subscriptions: EmailDigestSubscription
      push_notification_subscriptions: PushNotificationSubscription
      user_badges: UserBadge
      knowledge_submissions: KnowledgeSubmission
      knowledge_comments: KnowledgeComment
      knowledge_likes: KnowledgeLike
      knowledge_categories: KnowledgeCategory
    }
  }
}

export interface GarageSale {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  title: string
  description: string | null
  address: string
  sale_date: string
  start_time: string | null
  end_time: string | null
  latitude: number
  longitude: number
  contact_email: string | null
  contact_phone: string | null
  items_preview: string[] | null
  is_active: boolean
}

export interface AuroraPhoto {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  photo_url: string
  thumbnail_url: string | null
  caption: string | null
  location: string | null
  latitude: number | null
  longitude: number | null
  taken_at: string | null
  camera_settings: Record<string, unknown> | null
  ai_score: number | null
  ai_analysis: Record<string, unknown> | null
  likes_count: number
  views_count: number
  is_approved: boolean
  is_featured: boolean
  moderation_notes: string | null
  challenge_id: string | null
  is_active: boolean
}

export interface AuroraPhotoLike {
  id: string
  created_at: string
  photo_id: string
  user_id: string
}

export interface AuroraForecast {
  id: string
  created_at: string
  forecast_date: string
  kp_index: number | null
  visibility_score: number | null
  cloud_cover: number | null
  weather_conditions: string | null
  best_viewing_time: string | null
  forecast_data: Record<string, unknown> | null
  is_active: boolean
}

export interface AuroraChallenge {
  id: string
  created_at: string
  updated_at: string
  title: string
  description: string | null
  start_date: string
  end_date: string
  rules: Record<string, unknown> | null
  prize_description: string | null
  is_active: boolean
}

export interface EmailDigestSubscription {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  email: string
  frequency: 'daily' | 'weekly' | 'monthly'
  is_active: boolean
  last_sent_at: string | null
  unsubscribe_token: string
}

export interface PushNotificationSubscription {
  id: string
  created_at: string
  updated_at: string
  user_id: string | null
  endpoint: string
  p256dh_key: string
  auth_key: string
  alert_high_kp: boolean
  alert_new_photos: boolean
  alert_challenges: boolean
  is_active: boolean
}

export interface UserBadge {
  id: string
  created_at: string
  user_id: string
  badge_type: string
  badge_data: Record<string, unknown> | null
  earned_at: string
}

export interface KnowledgeSubmission {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  category_id: string
  title: string
  content: string
  tags: string[]
  source_url: string | null
  likes_count: number
  comments_count: number
  is_approved: boolean
  approved_by: string | null
  approved_at: string | null
}

export interface KnowledgeComment {
  id: string
  created_at: string
  submission_id: string
  user_id: string
  content: string
}

export interface KnowledgeLike {
  id: string
  created_at: string
  submission_id: string
  user_id: string
}

export interface KnowledgeCategory {
  id: string
  created_at: string
  name: string
  description: string | null
  icon: string | null
  color: string | null
  sort_order: number
}
