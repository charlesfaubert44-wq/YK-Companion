export type UserType = 'visiting' | 'living' | 'moving';
export type BudgetRange = 'budget' | 'moderate' | 'luxury';
export type ItemType = 'activity' | 'event' | 'accommodation' | 'job' | 'housing';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  user_type: UserType | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  interests: string[] | null;
  budget_range: BudgetRange | null;
  preferred_activities: string[] | null;
  trip_start_date: string | null;
  trip_end_date: string | null;
  group_size: number | null;
  accommodation_type: string | null;
  has_vehicle: boolean;
  favorite_neighborhoods: string[] | null;
  event_notifications: boolean;
  target_move_date: string | null;
  housing_budget_max: number | null;
  job_search_active: boolean;
  preferred_job_sectors: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface SavedItem {
  id: string;
  user_id: string;
  item_type: ItemType;
  item_id: string;
  item_data: any;
  notes: string | null;
  created_at: string;
}

export interface Itinerary {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  items: any;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_preferences: {
        Row: UserPreferences;
        Insert: Omit<UserPreferences, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'>>;
      };
      saved_items: {
        Row: SavedItem;
        Insert: Omit<SavedItem, 'id' | 'created_at'>;
        Update: Partial<Omit<SavedItem, 'id' | 'user_id' | 'created_at'>>;
      };
      itineraries: {
        Row: Itinerary;
        Insert: Omit<Itinerary, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Itinerary, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
