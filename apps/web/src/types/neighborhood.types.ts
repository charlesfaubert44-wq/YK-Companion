// Neighborhood Types for YK Buddy

// =====================================================
// CORE TYPES
// =====================================================

export interface Neighborhood {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  streets: string[];
  boundary_geojson: GeoJSON | null;
  is_active: boolean;
  requires_approval: boolean;
  max_members: number | null;
  admin_user_ids: string[];
  created_at: string;
  updated_at: string;

  // Joined data
  member_count?: number;
  pending_requests?: number;
}

export interface NeighborhoodMember {
  id: string;
  neighborhood_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  role: 'member' | 'moderator' | 'admin';

  // Request information
  requested_at: string;
  request_reason: string | null;
  provided_address: string | null;

  // Approval workflow
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  rejection_reason: string | null;

  // Activity tracking
  last_active_at: string | null;
  posts_count: number;
  alerts_count: number;

  // Settings
  email_notifications: boolean;
  notification_preferences: NotificationPreferences;

  created_at: string;
  updated_at: string;

  // Joined data
  neighborhood?: Neighborhood;
  user_name?: string;
  user_email?: string;
}

export interface NotificationPreferences {
  alerts: boolean;
  bulletins: boolean;
  events: boolean;
  businesses: boolean;
}

// =====================================================
// BULLETIN BOARD
// =====================================================

export interface NeighborhoodPost {
  id: string;
  neighborhood_id: string;
  user_id: string;

  // Content
  title: string;
  content: string;
  category: PostCategory;
  tags: string[];
  images: string[];

  // Engagement
  views_count: number;
  likes_count: number;
  comments_count: number;

  // Moderation
  is_pinned: boolean;
  is_archived: boolean;
  moderation_status: 'pending' | 'approved' | 'flagged' | 'removed';
  moderated_by: string | null;
  moderated_at: string | null;
  moderation_notes: string | null;

  // Expiry
  expires_at: string | null;

  created_at: string;
  updated_at: string;

  // Joined data
  author_name?: string;
  author_email?: string;
  neighborhood?: Neighborhood;
  user_has_liked?: boolean;
  comments?: NeighborhoodPostComment[];
}

export type PostCategory =
  | 'help_offered'
  | 'help_needed'
  | 'event'
  | 'announcement'
  | 'lost_found'
  | 'recommendation'
  | 'question'
  | 'other';

export interface NeighborhoodPostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_comment_id: string | null;
  likes_count: number;
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;

  // Joined data
  author_name?: string;
  author_email?: string;
  user_has_liked?: boolean;
  replies?: NeighborhoodPostComment[];
}

// =====================================================
// ALERTS
// =====================================================

export interface NeighborhoodAlert {
  id: string;
  neighborhood_id: string;
  user_id: string;

  // Alert details
  alert_type: AlertType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;

  // Location
  location: string | null;
  latitude: number | null;
  longitude: number | null;

  // Media
  images: string[];
  videos: string[];
  camera_feed_urls: string[];

  // Status
  status: 'active' | 'resolved' | 'investigating' | 'false_alarm';
  resolution_notes: string | null;
  resolved_by: string | null;
  resolved_at: string | null;

  // Engagement
  views_count: number;
  upvotes_count: number;
  comments_count: number;

  // Moderation
  is_verified: boolean;
  verified_by: string | null;
  verified_at: string | null;

  // Email notification tracking
  email_sent: boolean;
  email_sent_at: string | null;
  email_recipients_count: number;

  expires_at: string | null;

  created_at: string;
  updated_at: string;

  // Joined data
  author_name?: string;
  neighborhood?: Neighborhood;
  user_has_upvoted?: boolean;
}

export type AlertType =
  | 'security'
  | 'suspicious_activity'
  | 'crime'
  | 'emergency'
  | 'weather'
  | 'utility'
  | 'wildlife'
  | 'traffic'
  | 'other';

// =====================================================
// LOCAL BUSINESSES
// =====================================================

export interface NeighborhoodBusiness {
  id: string;
  neighborhood_id: string;
  submitted_by: string;

  // Business information
  name: string;
  description: string | null;
  category: BusinessCategory;
  subcategory: string | null;

  // Contact
  phone: string | null;
  email: string | null;
  website: string | null;

  // Location
  address: string;
  latitude: number | null;
  longitude: number | null;

  // Details
  hours_of_operation: HoursOfOperation | null;
  tags: string[];
  images: string[];
  logo_url: string | null;

  // Engagement
  views_count: number;
  likes_count: number;
  reviews_count: number;
  average_rating: number;

  // Status
  is_verified: boolean;
  verification_date: string | null;
  is_approved: boolean;
  approved_by: string | null;
  approved_at: string | null;
  is_active: boolean;
  is_featured: boolean;

  created_at: string;
  updated_at: string;

  // Joined data
  neighborhood?: Neighborhood;
  submitter_name?: string;
  user_has_liked?: boolean;
  distance_km?: number;
}

export type BusinessCategory =
  | 'restaurant'
  | 'retail'
  | 'service'
  | 'health'
  | 'education'
  | 'entertainment'
  | 'professional'
  | 'trades'
  | 'other';

export interface HoursOfOperation {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

// =====================================================
// RCMP COMPLAINTS
// =====================================================

export interface RCMPComplaint {
  id: string;
  neighborhood_id: string | null;
  user_id: string;

  // Complaint details
  incident_type: IncidentType;
  incident_date: string;
  incident_time: string | null;

  // Location
  location: string;
  latitude: number | null;
  longitude: number | null;

  // Description
  description: string;
  suspect_description: string | null;
  vehicle_description: string | null;
  witness_info: string | null;

  // Attachments
  evidence_images: string[];
  evidence_videos: string[];
  evidence_documents: string[];

  // Complainant info
  complainant_name: string | null;
  complainant_phone: string | null;
  complainant_email: string | null;
  is_anonymous: boolean;

  // Status tracking
  status: 'draft' | 'submitted' | 'acknowledged' | 'investigating' | 'resolved' | 'closed';
  rcmp_file_number: string | null;
  rcmp_response: string | null;

  // Email tracking
  email_sent_to_rcmp: boolean;
  email_sent_at: string | null;
  rcmp_email: string;

  // Follow-ups
  follow_up_notes: string | null;
  last_followed_up_at: string | null;

  created_at: string;
  updated_at: string;

  // Joined data
  neighborhood?: Neighborhood;
}

export type IncidentType =
  | 'theft'
  | 'vandalism'
  | 'assault'
  | 'break_in'
  | 'suspicious_activity'
  | 'noise'
  | 'traffic'
  | 'drug_activity'
  | 'fraud'
  | 'harassment'
  | 'other';

// =====================================================
// LOCAL POLITICS
// =====================================================

export interface NeighborhoodPolitics {
  id: string;
  neighborhood_id: string;
  user_id: string;

  // Topic details
  title: string;
  content: string;
  topic_type: PoliticsTopicType;
  tags: string[];

  // Related officials/meetings
  related_officials: string[];
  meeting_date: string | null;
  meeting_agenda_url: string | null;

  // Attachments
  documents: string[];
  links: string[];

  // Engagement
  views_count: number;
  likes_count: number;
  comments_count: number;

  // Moderation
  is_locked: boolean;
  locked_by: string | null;
  locked_at: string | null;
  lock_reason: string | null;
  is_pinned: boolean;
  is_archived: boolean;

  created_at: string;
  updated_at: string;

  // Joined data
  author_name?: string;
  neighborhood?: Neighborhood;
  user_has_liked?: boolean;
}

export type PoliticsTopicType =
  | 'city_council'
  | 'mla_update'
  | 'development'
  | 'infrastructure'
  | 'bylaw'
  | 'petition'
  | 'meeting'
  | 'vote'
  | 'other';

// =====================================================
// FORM INPUT TYPES
// =====================================================

export interface JoinNeighborhoodInput {
  neighborhood_id: string;
  request_reason?: string;
  provided_address?: string;
}

export interface CreatePostInput {
  neighborhood_id: string;
  title: string;
  content: string;
  category: PostCategory;
  tags?: string[];
  images?: string[];
  expires_at?: string;
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  is_archived?: boolean;
}

export interface CreateAlertInput {
  neighborhood_id: string;
  alert_type: AlertType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  videos?: string[];
  camera_feed_urls?: string[];
}

export interface UpdateAlertInput {
  status?: 'active' | 'resolved' | 'investigating' | 'false_alarm';
  resolution_notes?: string;
}

export interface CreateBusinessInput {
  neighborhood_id: string;
  name: string;
  description?: string;
  category: BusinessCategory;
  subcategory?: string;
  phone?: string;
  email?: string;
  website?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  hours_of_operation?: HoursOfOperation;
  tags?: string[];
  images?: string[];
  logo_url?: string;
}

export interface UpdateBusinessInput extends Partial<CreateBusinessInput> {
  is_active?: boolean;
}

export interface CreateRCMPComplaintInput {
  neighborhood_id?: string;
  incident_type: IncidentType;
  incident_date: string;
  incident_time?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  description: string;
  suspect_description?: string;
  vehicle_description?: string;
  witness_info?: string;
  evidence_images?: string[];
  evidence_videos?: string[];
  evidence_documents?: string[];
  complainant_name?: string;
  complainant_phone?: string;
  complainant_email?: string;
  is_anonymous?: boolean;
}

export interface UpdateRCMPComplaintInput extends Partial<CreateRCMPComplaintInput> {
  status?: 'draft' | 'submitted' | 'acknowledged' | 'investigating' | 'resolved' | 'closed';
  rcmp_file_number?: string;
  rcmp_response?: string;
  follow_up_notes?: string;
}

export interface CreatePoliticsPostInput {
  neighborhood_id: string;
  title: string;
  content: string;
  topic_type: PoliticsTopicType;
  tags?: string[];
  related_officials?: string[];
  meeting_date?: string;
  meeting_agenda_url?: string;
  documents?: string[];
  links?: string[];
}

export interface UpdatePoliticsPostInput extends Partial<CreatePoliticsPostInput> {
  is_archived?: boolean;
}

// =====================================================
// APPROVAL WORKFLOW
// =====================================================

export interface ApprovalAction {
  member_id: string;
  action: 'approve' | 'reject';
  review_notes?: string;
  rejection_reason?: string;
}

export interface MemberRoleUpdate {
  member_id: string;
  role: 'member' | 'moderator' | 'admin';
}

// =====================================================
// FILTER TYPES
// =====================================================

export interface NeighborhoodPostFilters {
  category?: PostCategory;
  tags?: string[];
  search?: string;
  is_pinned?: boolean;
  is_archived?: boolean;
}

export interface NeighborhoodAlertFilters {
  alert_type?: AlertType;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'active' | 'resolved' | 'investigating' | 'false_alarm';
  search?: string;
}

export interface NeighborhoodBusinessFilters {
  category?: BusinessCategory;
  tags?: string[];
  search?: string;
  is_verified?: boolean;
  max_distance_km?: number;
  user_location?: Coordinates;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeoJSON {
  type: string;
  coordinates: any;
}

// =====================================================
// DASHBOARD DATA
// =====================================================

export interface NeighborhoodDashboard {
  neighborhood: Neighborhood;
  member: NeighborhoodMember;
  stats: NeighborhoodStats;
  recent_posts: NeighborhoodPost[];
  active_alerts: NeighborhoodAlert[];
  featured_businesses: NeighborhoodBusiness[];
  upcoming_meetings: NeighborhoodPolitics[];
}

export interface NeighborhoodStats {
  total_members: number;
  active_alerts: number;
  recent_posts_count: number;
  local_businesses_count: number;
  pending_approvals?: number; // Only for moderators/admins
}

// =====================================================
// CONSTANTS
// =====================================================

export const POST_CATEGORIES: { value: PostCategory; label: string; icon: string }[] = [
  { value: 'help_offered', label: 'Help Offered', icon: '🤝' },
  { value: 'help_needed', label: 'Help Needed', icon: '🆘' },
  { value: 'event', label: 'Event', icon: '📅' },
  { value: 'announcement', label: 'Announcement', icon: '📢' },
  { value: 'lost_found', label: 'Lost & Found', icon: '🔍' },
  { value: 'recommendation', label: 'Recommendation', icon: '⭐' },
  { value: 'question', label: 'Question', icon: '❓' },
  { value: 'other', label: 'Other', icon: '💬' },
];

export const ALERT_TYPES: { value: AlertType; label: string; icon: string }[] = [
  { value: 'security', label: 'Security', icon: '🔒' },
  { value: 'suspicious_activity', label: 'Suspicious Activity', icon: '👁️' },
  { value: 'crime', label: 'Crime', icon: '🚨' },
  { value: 'emergency', label: 'Emergency', icon: '🆘' },
  { value: 'weather', label: 'Weather', icon: '🌨️' },
  { value: 'utility', label: 'Utility Issue', icon: '⚡' },
  { value: 'wildlife', label: 'Wildlife', icon: '🐻' },
  { value: 'traffic', label: 'Traffic', icon: '🚗' },
  { value: 'other', label: 'Other', icon: '📌' },
];

export const BUSINESS_CATEGORIES: { value: BusinessCategory; label: string; icon: string }[] = [
  { value: 'restaurant', label: 'Restaurant/Cafe', icon: '🍽️' },
  { value: 'retail', label: 'Retail Shop', icon: '🏪' },
  { value: 'service', label: 'Service', icon: '🔧' },
  { value: 'health', label: 'Health & Wellness', icon: '🏥' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎭' },
  { value: 'professional', label: 'Professional Services', icon: '💼' },
  { value: 'trades', label: 'Trades', icon: '🔨' },
  { value: 'other', label: 'Other', icon: '📋' },
];

export const INCIDENT_TYPES: { value: IncidentType; label: string }[] = [
  { value: 'theft', label: 'Theft' },
  { value: 'vandalism', label: 'Vandalism' },
  { value: 'assault', label: 'Assault' },
  { value: 'break_in', label: 'Break-in / Burglary' },
  { value: 'suspicious_activity', label: 'Suspicious Activity' },
  { value: 'noise', label: 'Noise Complaint' },
  { value: 'traffic', label: 'Traffic Violation' },
  { value: 'drug_activity', label: 'Drug Activity' },
  { value: 'fraud', label: 'Fraud' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'other', label: 'Other' },
];

export const POLITICS_TOPIC_TYPES: { value: PoliticsTopicType; label: string; icon: string }[] = [
  { value: 'city_council', label: 'City Council', icon: '🏛️' },
  { value: 'mla_update', label: 'MLA Update', icon: '📣' },
  { value: 'development', label: 'Development', icon: '🏗️' },
  { value: 'infrastructure', label: 'Infrastructure', icon: '🛣️' },
  { value: 'bylaw', label: 'Bylaw', icon: '📜' },
  { value: 'petition', label: 'Petition', icon: '✍️' },
  { value: 'meeting', label: 'Public Meeting', icon: '👥' },
  { value: 'vote', label: 'Vote/Referendum', icon: '🗳️' },
  { value: 'other', label: 'Other', icon: '💭' },
];

export const SEVERITY_COLORS = {
  low: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
  high: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  critical: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
};

export const STATUS_COLORS = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  approved: { bg: 'bg-green-100', text: 'text-green-800' },
  rejected: { bg: 'bg-red-100', text: 'text-red-800' },
  suspended: { bg: 'bg-gray-100', text: 'text-gray-800' },
  active: { bg: 'bg-green-100', text: 'text-green-800' },
  resolved: { bg: 'bg-blue-100', text: 'text-blue-800' },
  investigating: { bg: 'bg-purple-100', text: 'text-purple-800' },
  false_alarm: { bg: 'bg-gray-100', text: 'text-gray-800' },
};
