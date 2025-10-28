-- Update Garage Sales Schema to Match TypeScript Types
-- This migration adds missing columns and adjusts the schema to align with the app code

-- ============================================
-- ADD MISSING COLUMNS
-- ============================================

DO $$
BEGIN
    -- Add user_id as alias/copy of posted_by for TypeScript compatibility
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'garage_sales' AND column_name = 'user_id') THEN
        ALTER TABLE garage_sales ADD COLUMN user_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
        -- Copy existing posted_by values to user_id
        UPDATE garage_sales SET user_id = posted_by WHERE posted_by IS NOT NULL;
    END IF;

    -- Add sale_date (YYYY-MM-DD format) - extracted from start_date
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'garage_sales' AND column_name = 'sale_date') THEN
        ALTER TABLE garage_sales ADD COLUMN sale_date DATE;
        -- Copy date portion from start_date
        UPDATE garage_sales SET sale_date = start_date::DATE WHERE start_date IS NOT NULL;
        -- Make it required for new records
        ALTER TABLE garage_sales ALTER COLUMN sale_date SET NOT NULL;
    END IF;

    -- Add start_time (HH:MM format)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'garage_sales' AND column_name = 'start_time') THEN
        ALTER TABLE garage_sales ADD COLUMN start_time TEXT;
        -- Extract time from start_date
        UPDATE garage_sales SET start_time = TO_CHAR(start_date, 'HH24:MI') WHERE start_date IS NOT NULL;
        -- Make it required for new records
        ALTER TABLE garage_sales ALTER COLUMN start_time SET NOT NULL;
    END IF;

    -- Add end_time (HH:MM format)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'garage_sales' AND column_name = 'end_time') THEN
        ALTER TABLE garage_sales ADD COLUMN end_time TEXT;
        -- Extract time from end_date
        UPDATE garage_sales SET end_time = TO_CHAR(end_date, 'HH24:MI') WHERE end_date IS NOT NULL;
        -- Make it required for new records
        ALTER TABLE garage_sales ALTER COLUMN end_time SET NOT NULL;
    END IF;

    -- Add location_details
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'garage_sales' AND column_name = 'location_details') THEN
        ALTER TABLE garage_sales ADD COLUMN location_details TEXT;
    END IF;

    -- Add photos array
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'garage_sales' AND column_name = 'photos') THEN
        ALTER TABLE garage_sales ADD COLUMN photos TEXT[] DEFAULT '{}';
    END IF;

    -- Add tags array
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'garage_sales' AND column_name = 'tags') THEN
        ALTER TABLE garage_sales ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;

    -- Add items_description
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'garage_sales' AND column_name = 'items_description') THEN
        ALTER TABLE garage_sales ADD COLUMN items_description TEXT;
    END IF;

    -- Add cash_only
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'garage_sales' AND column_name = 'cash_only') THEN
        ALTER TABLE garage_sales ADD COLUMN cash_only BOOLEAN DEFAULT false;
    END IF;

    -- Add early_birds_welcome
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'garage_sales' AND column_name = 'early_birds_welcome') THEN
        ALTER TABLE garage_sales ADD COLUMN early_birds_welcome BOOLEAN DEFAULT false;
    END IF;

    -- Add status (active/cancelled/completed) - different from approval_status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'garage_sales' AND column_name = 'status') THEN
        ALTER TABLE garage_sales ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed'));
    END IF;

END $$;

-- ============================================
-- CREATE INDEXES FOR NEW COLUMNS
-- ============================================

CREATE INDEX IF NOT EXISTS idx_garage_sales_user_id ON garage_sales(user_id);
CREATE INDEX IF NOT EXISTS idx_garage_sales_sale_date ON garage_sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_garage_sales_status ON garage_sales(status);
CREATE INDEX IF NOT EXISTS idx_garage_sales_tags ON garage_sales USING GIN(tags);

-- ============================================
-- UPDATE RLS POLICIES FOR user_id
-- ============================================

-- Add policies for user_id (in addition to posted_by)
DROP POLICY IF EXISTS "Users can view their own garage sales by user_id" ON garage_sales;
CREATE POLICY "Users can view their own garage sales by user_id" ON garage_sales
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own garage sales by user_id" ON garage_sales;
CREATE POLICY "Users can update their own garage sales by user_id" ON garage_sales
    FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert garage sales with user_id" ON garage_sales;
CREATE POLICY "Users can insert garage sales with user_id" ON garage_sales
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Allow anyone to view active garage sales (simplified from approval workflow)
DROP POLICY IF EXISTS "Anyone can view active garage sales" ON garage_sales;
CREATE POLICY "Anyone can view active garage sales" ON garage_sales
    FOR SELECT USING (status = 'active' AND is_active = true);

-- ============================================
-- CREATE TRIGGER TO SYNC user_id and posted_by
-- ============================================

CREATE OR REPLACE FUNCTION sync_user_id_posted_by()
RETURNS TRIGGER AS $$
BEGIN
    -- If user_id is set, copy to posted_by
    IF NEW.user_id IS NOT NULL THEN
        NEW.posted_by := NEW.user_id;
    END IF;

    -- If posted_by is set but user_id isn't, copy to user_id
    IF NEW.posted_by IS NOT NULL AND NEW.user_id IS NULL THEN
        NEW.user_id := NEW.posted_by;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_garage_sales_user_fields ON garage_sales;
CREATE TRIGGER sync_garage_sales_user_fields
    BEFORE INSERT OR UPDATE ON garage_sales
    FOR EACH ROW
    EXECUTE FUNCTION sync_user_id_posted_by();

-- ============================================
-- ADD COMMENTS
-- ============================================

COMMENT ON COLUMN garage_sales.user_id IS 'User who posted the garage sale (synced with posted_by)';
COMMENT ON COLUMN garage_sales.sale_date IS 'Date of the garage sale (YYYY-MM-DD format)';
COMMENT ON COLUMN garage_sales.start_time IS 'Start time of the garage sale (HH:MM format)';
COMMENT ON COLUMN garage_sales.end_time IS 'End time of the garage sale (HH:MM format)';
COMMENT ON COLUMN garage_sales.tags IS 'Searchable tags for categorizing items';
COMMENT ON COLUMN garage_sales.photos IS 'Array of photo URLs';
COMMENT ON COLUMN garage_sales.items_description IS 'Description of items being sold';
COMMENT ON COLUMN garage_sales.cash_only IS 'Whether cash is the only accepted payment method';
COMMENT ON COLUMN garage_sales.early_birds_welcome IS 'Whether early arrivals are welcome';
COMMENT ON COLUMN garage_sales.status IS 'Sale status: active, cancelled, or completed';
COMMENT ON COLUMN garage_sales.location_details IS 'Additional location details (e.g., "Driveway and garage")';
