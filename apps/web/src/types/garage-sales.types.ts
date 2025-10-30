// Garage Sale Types for YK Buddy

export interface GarageSale {
  id: string;
  user_id: string;

  // Basic Information
  title: string;
  description: string | null;

  // Location
  address: string;
  latitude: number;
  longitude: number;
  location_details: string | null;

  // Date and Time
  sale_date: string; // YYYY-MM-DD format
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format

  // Sale Details
  photos: string[];
  tags: string[];
  items_description: string | null;

  // Preferences
  cash_only: boolean;
  early_birds_welcome: boolean;

  // Status
  status: 'active' | 'cancelled' | 'completed';

  // Metadata
  created_at: string;
  updated_at: string;

  // Joined data
  host_name?: string;
  host_email?: string;
  save_count?: number;
  distance_km?: number;
}

export interface SavedGarageSale {
  id: string;
  user_id: string;
  sale_id: string;
  notes: string | null;
  reminder_sent: boolean;
  created_at: string;

  // Joined garage sale data
  garage_sale?: GarageSale;
}

export interface GarageSaleItinerary {
  id: string;
  user_id: string;
  name: string;
  date: string;
  sale_ids: string[];
  optimized_route: RouteOptimization | null;
  total_distance_km: number | null;
  estimated_duration_minutes: number | null;
  created_at: string;
  updated_at: string;

  // Joined data
  sales?: GarageSale[];
}

export interface RouteOptimization {
  waypoints: RouteWaypoint[];
  total_distance_km: number;
  total_duration_minutes: number;
  start_location: Coordinates;
  end_location: Coordinates;
}

export interface RouteWaypoint {
  sale_id: string;
  order: number;
  coordinates: Coordinates;
  estimated_arrival_time: string; // HH:MM format
  distance_from_previous_km: number;
  duration_from_previous_minutes: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Form Types
export interface CreateGarageSaleInput {
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  location_details?: string;
  sale_date: string;
  start_time: string;
  end_time: string;
  photos?: string[];
  tags: string[];
  items_description?: string;
  cash_only: boolean;
  early_birds_welcome: boolean;
}

export interface UpdateGarageSaleInput extends Partial<CreateGarageSaleInput> {
  status?: 'active' | 'cancelled' | 'completed';
}

export interface CreateItineraryInput {
  name: string;
  date: string;
  sale_ids: string[];
}

// Filter Types
export interface GarageSaleFilters {
  search?: string;
  tags?: string[];
  date_from?: string;
  date_to?: string;
  cash_only?: boolean;
  early_birds_only?: boolean;
  max_distance_km?: number;
  user_location?: Coordinates;
}

// Map Types
export interface GarageSaleMarker extends Coordinates {
  sale: GarageSale;
  color: 'red' | 'orange' | 'green' | 'gray';
}

// Common tag options
export const GARAGE_SALE_TAGS = [
  'furniture',
  'appliances',
  'electronics',
  'tools',
  'sports',
  'outdoor',
  'kids',
  'toys',
  'baby gear',
  'clothes',
  'books',
  'household',
  'kitchen',
  'decorations',
  'winter gear',
  'fishing',
  'camping',
  'bikes',
  'vehicles',
  'collectibles',
  'antiques',
  'art',
  'plants',
  'misc',
] as const;

export type GarageSaleTag = (typeof GARAGE_SALE_TAGS)[number];
