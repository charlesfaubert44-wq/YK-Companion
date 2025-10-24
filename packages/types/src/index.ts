// User Segment Types
export enum UserSegment {
  VISITING = 'visiting', // Tourists planning trips
  LIVING = 'living', // Current residents
  MOVING = 'moving', // People planning to relocate
  NOT_SET = 'not_set',
}

// Traveler Types (for Visiting segment)
export enum TravelerType {
  RELAXED = 'relaxed', // Comfort-focused, prefers packages
  CURIOUS = 'curious', // Cultural explorer, educational
  ADVENTURER = 'adventurer', // Outdoor enthusiast, extreme experiences
  NOT_SET = 'not_set',
}

// Resident Types (for Living segment)
export enum ResidentType {
  NEW_RESIDENT = 'new_resident', // Recently moved, still exploring
  ESTABLISHED = 'established', // Long-time resident, knows the area
  FAMILY = 'family', // Family with kids
  NOT_SET = 'not_set',
}

// Relocator Types (for Moving segment)
export enum RelocatorType {
  JOB_TRANSFER = 'job_transfer', // Moving for work
  LIFESTYLE = 'lifestyle', // Seeking northern lifestyle
  FAMILY_REASONS = 'family_reasons', // Moving for family
  STUDENT = 'student', // Moving for education
  NOT_SET = 'not_set',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  segment?: UserSegment;
  travelerType?: TravelerType; // For visiting segment
  residentType?: ResidentType; // For living segment
  relocatorType?: RelocatorType; // For moving segment
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  budgetRange?: {
    min: number;
    max: number;
  };
  interests: string[]; // aurora, culture, adventure, food, photography, etc.
  accessibilityNeeds?: AccessibilityNeeds;
  dietaryRestrictions?: string[];
}

// Activity Types
export enum ActivityCategory {
  AURORA = 'aurora',
  ADVENTURE = 'adventure',
  CULTURE = 'culture',
  WILDLIFE = 'wildlife',
  FISHING = 'fishing',
  WINTER_SPORTS = 'winter_sports',
  SUMMER_ACTIVITIES = 'summer_activities',
}

export enum Season {
  WINTER = 'winter', // Dec - Mar
  SPRING = 'spring', // Apr - May
  SUMMER = 'summer', // Jun - Aug
  FALL = 'fall', // Sep - Nov
}

export enum DifficultyLevel {
  EASY = 'easy',
  MODERATE = 'moderate',
  CHALLENGING = 'challenging',
  EXPERT = 'expert',
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  category: ActivityCategory;
  seasons: Season[];
  difficulty: DifficultyLevel;
  duration: number; // in minutes
  price: number;
  priceRange?: {
    min: number;
    max: number;
  }; // For flexible pricing
  location: Location;
  images: string[];
  tags: string[];
  rating: number;
  reviewCount: number;

  // New fields based on research
  isIndigenousOwned?: boolean;
  isIndoorOption?: boolean; // Important for bad weather backups
  minAge?: number;
  maxGroupSize?: number;
  gearProvided?: string[]; // What gear is included
  gearRequired?: string[]; // What you need to bring
  accessibility?: AccessibilityInfo;
  bestMonths?: number[]; // Array of month numbers (0-11)
  crowdLevel?: 'low' | 'medium' | 'high'; // By season
  cancellationPolicy?: string;
  physicalDemand?: 'low' | 'moderate' | 'high' | 'extreme';

  createdAt: Date;
  updatedAt: Date;
}

// Accessibility Types
export interface AccessibilityNeeds {
  mobilityAssistance?: boolean;
  wheelchairAccessible?: boolean;
  hearingAssistance?: boolean;
  visualAssistance?: boolean;
  serviceAnimalFriendly?: boolean;
  other?: string;
}

export interface AccessibilityInfo {
  wheelchairAccessible: boolean;
  mobilityLevel: 'easy' | 'moderate' | 'challenging'; // How much walking/standing
  sensoryConsiderations?: string[]; // Loud noises, bright lights, etc.
  serviceAnimalsAllowed: boolean;
  accessibleParking: boolean;
  accessibleRestrooms: boolean;
  notes?: string;
}

// Location Types
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city: string;
  province: string;
  country: string;
}

// Itinerary Types
export interface ItineraryItem {
  id: string;
  activityId: string;
  activity?: Activity;
  date: Date;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface Itinerary {
  id: string;
  userId: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  items: ItineraryItem[];
  estimatedCost: number;
  createdAt: Date;
  updatedAt: Date;
}

// Weather & Aurora Types
export interface WeatherCondition {
  date: Date;
  temperature: number; // in Celsius
  feelsLike: number;
  condition: string;
  precipitation: number;
  windSpeed: number;
  humidity: number;
}

export interface AuroraForecast {
  date: Date;
  kpIndex: number; // 0-9 scale
  visibility: 'poor' | 'fair' | 'good' | 'excellent';
  cloudCover: number; // percentage
  moonPhase: string;
  bestViewingTime: string;
}

// Booking Types
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export interface Booking {
  id: string;
  userId: string;
  activityId: string;
  activity?: Activity;
  date: Date;
  numberOfPeople: number;
  totalPrice: number;
  status: BookingStatus;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Accommodation Types
export enum AccommodationType {
  HOTEL = 'hotel',
  LODGE = 'lodge',
  BED_AND_BREAKFAST = 'bnb',
  CABIN = 'cabin',
  CAMPING = 'camping',
}

export interface Accommodation {
  id: string;
  name: string;
  type: AccommodationType;
  description: string;
  location: Location;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  availability: boolean;
}

// Packing List Types
export interface PackingList {
  id: string;
  season: Season;
  activities: ActivityCategory[];
  minTemperature: number;
  items: PackingItem[];
}

export interface PackingItem {
  name: string;
  category: 'clothing' | 'gear' | 'accessories' | 'documents' | 'other';
  priority: 'essential' | 'recommended' | 'optional';
  quantity?: number;
  notes?: string;
  canRentLocally?: boolean;
  rentalCost?: number;
}

// Trip Cost Estimate Types
export interface TripCostEstimate {
  tripDuration: number; // days
  numberOfPeople: number;
  breakdown: {
    accommodation: number;
    activities: number;
    food: number;
    transportation: number;
    gear: number;
    other: number;
  };
  total: number;
  perPerson: number;
  season: Season;
  budgetLevel: 'budget' | 'moderate' | 'luxury';
}

// Itinerary Template Types
export interface ItineraryTemplate {
  id: string;
  name: string;
  description: string;
  travelerType: TravelerType;
  duration: number; // days
  season: Season;
  budgetLevel: 'budget' | 'moderate' | 'luxury';
  estimatedCost: number;
  includedActivities: string[]; // Activity IDs
  tags: string[];
  rating: number;
  usageCount: number;
}

// Cultural Guide Types
export interface CulturalGuide {
  id: string;
  title: string;
  content: string;
  category: 'protocol' | 'language' | 'history' | 'etiquette';
  relatedActivities?: string[]; // Activity IDs
}

// Aurora Alert Types
export interface AuroraAlert {
  id: string;
  userId: string;
  tripStartDate: Date;
  tripEndDate: Date;
  isActive: boolean;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  minKpIndex: number; // Only alert if KP >= this value
}

// Local Tip Types
export interface LocalTip {
  id: string;
  title: string;
  content: string;
  category: 'money-saving' | 'hidden-gem' | 'photo-spot' | 'restaurant' | 'safety' | 'other';
  location?: Location;
  season?: Season;
  upvotes: number;
  isVerified: boolean; // Verified by locals/admin
}

// Real-time Conditions Types
export interface LiveConditions {
  timestamp: Date;
  weather: WeatherCondition;
  aurora: AuroraForecast;
  iceRoads?: {
    status: 'open' | 'closed' | 'restricted';
    conditions: string;
    lastUpdated: Date;
  };
  trailConditions?: Array<{
    trailName: string;
    status: 'open' | 'closed' | 'caution';
    notes: string;
  }>;
  airQuality?: {
    index: number;
    category: 'good' | 'moderate' | 'poor';
  };
  daylightHours: {
    sunrise: string;
    sunset: string;
    totalDaylight: number; // in hours
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Relocation Types (Moving Segment)
export interface RelocationGuide {
  id: string;
  title: string;
  category: 'housing' | 'employment' | 'education' | 'healthcare' | 'transportation' | 'community';
  content: string;
  resources: Array<{
    name: string;
    url: string;
    description: string;
  }>;
  checklist?: string[];
}

export interface HousingInfo {
  id: string;
  type: 'rental' | 'purchase';
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  bedrooms: number;
  location: Location;
  utilities?: {
    heating: number;
    electricity: number;
    water: number;
    internet: number;
  };
  availability: 'high' | 'medium' | 'low';
  seasonalConsiderations: string;
}

export interface JobMarketInfo {
  industry: string;
  averageSalary: number;
  demandLevel: 'high' | 'medium' | 'low';
  keyEmployers: string[];
  requiredQualifications?: string[];
  remoteOpportunities: boolean;
}

export interface CostOfLiving {
  category: 'groceries' | 'utilities' | 'transportation' | 'healthcare' | 'childcare' | 'entertainment';
  monthlyAverage: number;
  comparisonToNationalAverage: number; // Percentage
  notes: string;
  seasonalVariation?: {
    winter: number;
    summer: number;
  };
}

export interface RelocationChecklist {
  id: string;
  userId: string;
  timeline: 'immediate' | 'within_3_months' | 'within_6_months' | 'within_year';
  items: Array<{
    task: string;
    category: 'housing' | 'employment' | 'logistics' | 'admin' | 'community';
    priority: 'critical' | 'high' | 'medium' | 'low';
    completed: boolean;
    dueDate?: Date;
    notes?: string;
  }>;
  moveDate?: Date;
}

// Resident Types (Living Segment)
export interface LocalEvent {
  id: string;
  name: string;
  description: string;
  category: 'festival' | 'market' | 'community' | 'sports' | 'arts' | 'family';
  date: Date;
  endDate?: Date;
  location: Location;
  cost: number;
  isFree: boolean;
  isRecurring: boolean;
  recurringSchedule?: string;
  ageRestriction?: string;
  registrationRequired: boolean;
  registrationUrl?: string;
  organizer: string;
  contactInfo?: string;
}

export interface CommunityResource {
  id: string;
  name: string;
  type: 'library' | 'recreation' | 'health' | 'education' | 'government' | 'support';
  description: string;
  location: Location;
  hours: {
    [key: string]: string; // day: hours
  };
  phone?: string;
  email?: string;
  website?: string;
  services: string[];
  accessibility: AccessibilityInfo;
}

export interface SeasonalTip {
  id: string;
  month: number; // 0-11
  season: Season;
  category: 'maintenance' | 'preparation' | 'activity' | 'safety' | 'savings';
  title: string;
  description: string;
  priority: 'essential' | 'recommended' | 'optional';
  applicableTo: UserSegment[];
}

export interface LocalRecommendation {
  id: string;
  category: 'restaurant' | 'shop' | 'service' | 'activity' | 'hidden_gem';
  name: string;
  description: string;
  location: Location;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  tags: string[];
  rating: number;
  reviewCount: number;
  isLocalFavorite: boolean;
  bestFor: string[]; // families, couples, solo, groups
  hours?: string;
  website?: string;
}
