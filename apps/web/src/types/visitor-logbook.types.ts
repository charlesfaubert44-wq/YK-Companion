/**
 * TypeScript types for Visitor Logbook feature
 */

// Experience type options
export const EXPERIENCE_TYPES = [
  'aurora',
  'hiking',
  'culture',
  'food',
  'wildlife',
  'photography',
  'winter-activities',
  'summer-activities',
  'local-events',
  'shopping',
  'other',
] as const;

export type ExperienceType = (typeof EXPERIENCE_TYPES)[number];

// Visit duration options
export const VISIT_DURATIONS = [
  '1-2 days',
  '3-5 days',
  '1 week',
  '2 weeks',
  '1 month',
  '2+ months',
] as const;

export type VisitDuration = (typeof VISIT_DURATIONS)[number];

// Core database types
export interface VisitorLogbookEntry {
  id: string;
  user_id: string;

  // User info
  visitor_name: string;
  visitor_location: string | null;

  // Content
  title: string;
  message: string;

  // Photos
  photos: string[];
  featured_photo: string | null;

  // Visit details
  visit_date: string; // ISO date string
  visit_duration: string | null;

  // Categorization
  experience_type: ExperienceType[];
  rating: number | null; // 1-5

  // Engagement
  likes_count: number;
  views_count: number;

  // Moderation
  is_approved: boolean;
  is_featured: boolean;
  is_active: boolean;
  moderation_notes: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;

  // Relations (joined data)
  user_liked?: boolean; // Whether current user has liked this entry
}

export interface VisitorLogbookLike {
  id: string;
  entry_id: string;
  user_id: string;
  created_at: string;
}

// Form input types
export interface CreateLogbookEntryInput {
  visitor_name: string;
  visitor_location: string;
  title: string;
  message: string;
  visit_date: string;
  visit_duration: string;
  experience_type: ExperienceType[];
  rating: number;
  photos: string[]; // Photo URLs after upload
}

export interface UpdateLogbookEntryInput {
  title?: string;
  message?: string;
  visitor_location?: string;
  visit_date?: string;
  visit_duration?: string;
  experience_type?: ExperienceType[];
  rating?: number;
  photos?: string[];
  featured_photo?: string;
}

// API response types
export interface LogbookEntryResponse {
  success: boolean;
  data?: VisitorLogbookEntry;
  error?: string;
}

export interface LogbookEntriesResponse {
  success: boolean;
  data?: VisitorLogbookEntry[];
  total?: number;
  error?: string;
}

export interface PhotoUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export interface LikeResponse {
  success: boolean;
  liked?: boolean;
  likes_count?: number;
  error?: string;
}

// Filter and query types
export interface LogbookFilters {
  featured?: boolean;
  experience_type?: ExperienceType;
  rating?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

// UI component types
export interface LogbookFormData {
  visitor_name: string;
  visitor_location: string;
  title: string;
  message: string;
  visit_date: string;
  visit_duration: string;
  experience_type: ExperienceType[];
  rating: number;
  photos: File[];
  uploadedPhotoUrls: string[];
}

export interface LogbookFormErrors {
  visitor_name?: string;
  visitor_location?: string;
  title?: string;
  message?: string;
  visit_date?: string;
  visit_duration?: string;
  experience_type?: string;
  rating?: string;
  photos?: string;
}

// Experience type labels and icons
export const EXPERIENCE_TYPE_CONFIG: Record<
  ExperienceType,
  { label: string; icon: string; color: string }
> = {
  aurora: {
    label: 'Northern Lights',
    icon: '✨',
    color: 'aurora-green',
  },
  hiking: {
    label: 'Hiking & Nature',
    icon: '🥾',
    color: 'emerald-500',
  },
  culture: {
    label: 'Culture & History',
    icon: '🏛️',
    color: 'purple-500',
  },
  food: {
    label: 'Food & Dining',
    icon: '🍽️',
    color: 'orange-500',
  },
  wildlife: {
    label: 'Wildlife',
    icon: '🦌',
    color: 'green-600',
  },
  photography: {
    label: 'Photography',
    icon: '📸',
    color: 'blue-500',
  },
  'winter-activities': {
    label: 'Winter Activities',
    icon: '❄️',
    color: 'cyan-400',
  },
  'summer-activities': {
    label: 'Summer Activities',
    icon: '☀️',
    color: 'yellow-500',
  },
  'local-events': {
    label: 'Local Events',
    icon: '🎉',
    color: 'pink-500',
  },
  shopping: {
    label: 'Shopping',
    icon: '🛍️',
    color: 'indigo-500',
  },
  other: {
    label: 'Other',
    icon: '🌟',
    color: 'gray-500',
  },
};

// Rating labels
export const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
} as const;
