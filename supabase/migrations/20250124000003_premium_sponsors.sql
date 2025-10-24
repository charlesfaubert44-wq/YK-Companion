-- Create premium_sponsors table
CREATE TABLE IF NOT EXISTS premium_sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- Sponsor details
  name TEXT NOT NULL,
  tagline TEXT,
  link TEXT,

  -- Positioning and scheduling
  position TEXT NOT NULL CHECK (position IN ('home_top', 'home_middle', 'home_bottom', 'visiting', 'living', 'moving')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,

  -- Pricing and payment
  plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'premium', 'enterprise')),
  duration_days INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled', 'refunded')),

  -- Contact and metadata
  contact_email TEXT,
  contact_name TEXT,
  notes TEXT
);

-- Create premium_pricing_plans table
CREATE TABLE IF NOT EXISTS premium_pricing_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  plan_name TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'premium', 'enterprise')),
  position TEXT NOT NULL CHECK (position IN ('home_top', 'home_middle', 'home_bottom', 'visiting', 'living', 'moving')),

  -- Pricing structure
  base_price_per_day DECIMAL(10, 2) NOT NULL,
  min_duration_days INTEGER DEFAULT 7,
  max_duration_days INTEGER DEFAULT 365,

  -- Modifiers
  position_multiplier DECIMAL(3, 2) DEFAULT 1.0,
  volume_discount_7days DECIMAL(3, 2) DEFAULT 0.0,
  volume_discount_30days DECIMAL(3, 2) DEFAULT 0.0,
  volume_discount_90days DECIMAL(3, 2) DEFAULT 0.0,

  is_active BOOLEAN DEFAULT true,
  description TEXT
);

-- Insert default pricing plans
INSERT INTO premium_pricing_plans (plan_name, plan_type, position, base_price_per_day, position_multiplier, volume_discount_7days, volume_discount_30days, volume_discount_90days, description) VALUES
  -- Home Top Position (Prime Real Estate)
  ('Home Top - Basic', 'basic', 'home_top', 15.00, 2.0, 0.05, 0.15, 0.25, 'Premium visibility at the top of the home page'),
  ('Home Top - Premium', 'premium', 'home_top', 20.00, 2.0, 0.10, 0.20, 0.30, 'Premium visibility with enhanced styling'),
  ('Home Top - Enterprise', 'enterprise', 'home_top', 30.00, 2.0, 0.15, 0.25, 0.35, 'Maximum visibility with custom features'),

  -- Home Middle Position
  ('Home Middle - Basic', 'basic', 'home_middle', 10.00, 1.5, 0.05, 0.15, 0.25, 'Good visibility in the middle section'),
  ('Home Middle - Premium', 'premium', 'home_middle', 15.00, 1.5, 0.10, 0.20, 0.30, 'Enhanced middle section placement'),

  -- Home Bottom Position
  ('Home Bottom - Basic', 'basic', 'home_bottom', 7.00, 1.0, 0.05, 0.15, 0.25, 'Footer area placement'),

  -- Visiting Section
  ('Visiting Section - Basic', 'basic', 'visiting', 12.00, 1.7, 0.05, 0.15, 0.25, 'Target tourists and visitors'),
  ('Visiting Section - Premium', 'premium', 'visiting', 18.00, 1.7, 0.10, 0.20, 0.30, 'Enhanced tourist targeting'),

  -- Living Section
  ('Living Section - Basic', 'basic', 'living', 10.00, 1.4, 0.05, 0.15, 0.25, 'Target local residents'),
  ('Living Section - Premium', 'premium', 'living', 15.00, 1.4, 0.10, 0.20, 0.30, 'Enhanced resident targeting'),

  -- Moving Section
  ('Moving Section - Basic', 'basic', 'moving', 12.00, 1.6, 0.05, 0.15, 0.25, 'Target people relocating to Yellowknife'),
  ('Moving Section - Premium', 'premium', 'moving', 18.00, 1.6, 0.10, 0.20, 0.30, 'Enhanced relocation targeting');

-- Create indexes
CREATE INDEX idx_premium_sponsors_active ON premium_sponsors(is_active, position, start_date, end_date);
CREATE INDEX idx_premium_sponsors_dates ON premium_sponsors(start_date, end_date);
CREATE INDEX idx_premium_pricing_plans_active ON premium_pricing_plans(is_active, position, plan_type);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_premium_sponsors_updated_at BEFORE UPDATE ON premium_sponsors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_premium_pricing_plans_updated_at BEFORE UPDATE ON premium_pricing_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE premium_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_pricing_plans ENABLE ROW LEVEL SECURITY;

-- Public can view active sponsors
CREATE POLICY "Anyone can view active sponsors" ON premium_sponsors
    FOR SELECT USING (is_active = true);

-- Public can view active pricing plans
CREATE POLICY "Anyone can view active pricing plans" ON premium_pricing_plans
    FOR SELECT USING (is_active = true);

-- Only authenticated admins can modify (you'll need to create an admin role)
-- For now, we'll allow authenticated users to manage
CREATE POLICY "Authenticated users can manage sponsors" ON premium_sponsors
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage pricing plans" ON premium_pricing_plans
    FOR ALL USING (auth.role() = 'authenticated');
