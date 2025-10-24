// Knowledge Database Types for Yellowknife

export type ContentType = 'fact' | 'story' | 'tip' | 'history' | 'culture' | 'activity';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'flagged';
export type Season = 'winter' | 'spring' | 'summer' | 'fall' | 'year-round';

export interface KnowledgeCategory {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
}

export interface KnowledgeSubmission {
  id: string;
  created_at: string;
  updated_at: string;

  // Content
  title: string;
  content: string;
  category_id: string | null;
  content_type: ContentType;

  // Metadata
  tags: string[] | null;
  images: string[] | null;
  sources: string[] | null;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  season: Season | null;

  // Submission info
  submitted_by: string | null;
  submitter_name: string | null;
  submitter_email: string | null;

  // Review workflow
  status: SubmissionStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  rejection_reason: string | null;

  // Engagement metrics
  views: number;
  likes: number;
  is_featured: boolean;
  featured_until: string | null;
}

export interface KnowledgeSubmissionWithCategory extends KnowledgeSubmission {
  category: KnowledgeCategory | null;
}

export interface KnowledgeComment {
  id: string;
  created_at: string;
  updated_at: string;
  submission_id: string;
  user_id: string | null;
  commenter_name: string | null;
  comment: string;
  is_approved: boolean;
  parent_comment_id: string | null;
}

export interface KnowledgeLike {
  id: string;
  created_at: string;
  submission_id: string;
  user_id: string | null;
  ip_address: string | null;
}

// Form types for creating submissions
export interface CreateKnowledgeSubmissionInput {
  title: string;
  content: string;
  category_id?: string;
  content_type: ContentType;
  tags?: string[];
  images?: string[];
  sources?: string[];
  location_name?: string;
  latitude?: number;
  longitude?: number;
  season?: Season;
  submitter_name?: string;
  submitter_email?: string;
}

// Admin review input
export interface ReviewSubmissionInput {
  status: 'approved' | 'rejected' | 'flagged';
  review_notes?: string;
  rejection_reason?: string;
}

// Filter options for browsing
export interface KnowledgeFilters {
  category_id?: string;
  content_type?: ContentType;
  season?: Season;
  search?: string;
  is_featured?: boolean;
  limit?: number;
  offset?: number;
}

// Stats for admin dashboard
export interface KnowledgeStats {
  total_submissions: number;
  pending_submissions: number;
  approved_submissions: number;
  rejected_submissions: number;
  total_views: number;
  total_likes: number;
  total_categories: number;
}
