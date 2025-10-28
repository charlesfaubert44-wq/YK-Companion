// Premium Sponsors Types for YK Buddy

export type SponsorPosition = 'home_top' | 'home_middle' | 'home_bottom' | 'visiting' | 'living' | 'moving';
export type PlanType = 'basic' | 'premium' | 'enterprise';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface PremiumSponsor {
  id: string;
  name: string;
  tagline?: string | null;
  link?: string | null;
  position: SponsorPosition;
  start_date: string;
  end_date: string;
  is_active: boolean;
  plan_type: PlanType;
  duration_days: number;
  total_price: number;
  payment_status: PaymentStatus;
  contact_email?: string | null;
  contact_name?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PremiumPricingPlan {
  id: string;
  plan_name: string;
  plan_type: PlanType;
  position: SponsorPosition;
  base_price_per_day: number;
  position_multiplier: number;
  volume_discount_7days: number;
  volume_discount_30days: number;
  volume_discount_90days: number;
  min_duration_days: number;
  max_duration_days: number | null;
  is_active: boolean;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSponsorInput {
  name: string;
  tagline?: string;
  link?: string;
  position: SponsorPosition;
  start_date: string;
  end_date: string;
  plan_type: PlanType;
  duration_days: number;
  total_price: number;
  payment_status: PaymentStatus;
  contact_email?: string;
  contact_name?: string;
  notes?: string;
}

export interface UpdateSponsorInput extends Partial<CreateSponsorInput> {
  is_active?: boolean;
}

export interface SponsorPriceCalculation {
  base_price: number;
  position_multiplier: number;
  subtotal: number;
  discount_percentage: number;
  discount_amount: number;
  total: number;
  duration_days: number;
  price_per_day: number;
}
