// Aurora Live Events & Photo Mosaic Types

export interface AuroraEvent {
  id: string;
  event_date: string;
  start_time: string;
  end_time: string | null;
  kp_index: number;
  kp_max: number | null;
  visibility_score: number | null;
  cloud_coverage: number | null;
  status: 'upcoming' | 'active' | 'ended' | 'archived';
  auto_generated: boolean;
  photo_count: number;
  participant_count: number;
  mosaic_generated: boolean;
  created_at: string;
  updated_at: string;

  // Joined data
  recent_uploads?: number;
  recent_photos?: AuroraPhoto[];
}

export interface AuroraPhoto {
  id: string;
  event_id: string;
  user_id: string;
  photo_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  location_lat: number | null;
  location_lng: number | null;
  location_name: string | null;

  // Camera Settings
  camera_model: string | null;
  iso: number | null;
  shutter_speed: string | null;
  aperture: string | null;
  focal_length: string | null;

  // Metadata
  taken_at: string | null;
  uploaded_at: string;
  likes_count: number;
  featured: boolean;
  quality_score: number | null;
  approved: boolean;
  flagged: boolean;
  created_at: string;

  // Joined data
  photographer_name?: string;
  is_liked_by_user?: boolean;
}

export interface AuroraMosaic {
  id: string;
  event_id: string;
  title: string;
  description: string | null;
  mosaic_url: string | null;
  thumbnail_url: string | null;
  photo_ids: string[];
  grid_size: string;
  total_photos: number;
  time_window_start: string;
  time_window_end: string;
  moment_description: string | null;
  views_count: number;
  shares_count: number;
  generated_at: string;
  created_at: string;

  // Joined data
  photos?: AuroraPhoto[];
}

export interface KPIndexData {
  id: string;
  kp_index: number;
  timestamp: string;
  source: string;
  forecast: boolean;
  aurora_probability: number | null;
  created_at: string;
}

export interface AuroraPreferences {
  user_id: string;
  notify_kp_threshold: number;
  notify_event_start: boolean;
  notify_new_photos: boolean;
  notify_mosaic_ready: boolean;
  favorite_locations: string[];
  camera_model: string | null;
  created_at: string;
  updated_at: string;
}

// Form/Input Types
export interface UploadPhotoInput {
  event_id: string;
  photo_url: string;
  caption?: string;
  location_lat?: number;
  location_lng?: number;
  location_name?: string;
  camera_model?: string;
  iso?: number;
  shutter_speed?: string;
  aperture?: string;
  focal_length?: string;
  taken_at?: string;
}

export interface CreateMosaicInput {
  event_id: string;
  title: string;
  description?: string;
  time_window_start: string;
  time_window_end: string;
  moment_description?: string;
  photo_ids?: string[];
}

// Real-time Update Types
export interface LiveEventUpdate {
  event_id: string;
  type: 'new_photo' | 'photo_liked' | 'kp_updated' | 'mosaic_generated' | 'event_ended';
  data: any;
  timestamp: string;
}

export interface PhotoUploadNotification {
  photo: AuroraPhoto;
  event: AuroraEvent;
  photographer_name: string;
}

// Camera Settings Recommendations
export interface CameraSettings {
  iso: number;
  shutter_speed: string;
  aperture: string;
  white_balance: string;
  focus: string;
  tips: string[];
}

export interface CameraRecommendation {
  kp_index: number;
  settings: {
    beginner: CameraSettings;
    intermediate: CameraSettings;
    advanced: CameraSettings;
  };
  conditions: string;
}

// Viewing Locations
export interface ViewingLocation {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  light_pollution: 'low' | 'medium' | 'high';
  accessibility: 'easy' | 'moderate' | 'difficult';
  amenities: string[];
  best_for: string[];
  rating: number;
  photo_count: number;
}

// Statistics
export interface AuroraStats {
  total_events: number;
  total_photos: number;
  total_participants: number;
  avg_kp_index: number;
  most_active_photographer: string;
  most_liked_photo: AuroraPhoto | null;
  recent_mosaics: AuroraMosaic[];
}

// KP Index Levels
export const KP_LEVELS = {
  0: { label: 'Quiet', color: '#4CAF50', description: 'No aurora expected' },
  1: { label: 'Quiet', color: '#4CAF50', description: 'Very low activity' },
  2: { label: 'Quiet', color: '#8BC34A', description: 'Low activity' },
  3: { label: 'Unsettled', color: '#FFC107', description: 'Possible aurora' },
  4: { label: 'Active', color: '#FF9800', description: 'Good chance of aurora' },
  5: { label: 'Minor Storm', color: '#FF5722', description: 'Aurora likely visible' },
  6: { label: 'Moderate Storm', color: '#F44336', description: 'Strong aurora likely' },
  7: { label: 'Strong Storm', color: '#E91E63', description: 'Excellent aurora!' },
  8: { label: 'Severe Storm', color: '#9C27B0', description: 'Exceptional aurora!' },
  9: { label: 'Extreme Storm', color: '#6A1B9A', description: 'Rare spectacular display!' },
} as const;

export type KPLevel = keyof typeof KP_LEVELS;

// Helper function to get KP level info
export function getKPLevelInfo(kp: number): { label: string; color: string; description: string } {
  const level = Math.floor(kp) as KPLevel;
  return KP_LEVELS[level] || KP_LEVELS[0];
}

// Mosaic Grid Sizes
export const MOSAIC_GRID_SIZES = [
  { value: '2x2', label: '2×2 (4 photos)', photos: 4 },
  { value: '3x3', label: '3×3 (9 photos)', photos: 9 },
  { value: '4x4', label: '4×4 (16 photos)', photos: 16 },
  { value: '4x5', label: '4×5 (20 photos)', photos: 20 },
  { value: '5x5', label: '5×5 (25 photos)', photos: 25 },
] as const;
