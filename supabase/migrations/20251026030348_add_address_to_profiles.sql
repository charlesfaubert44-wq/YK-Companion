-- Add address column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;

-- Add comment to document the column
COMMENT ON COLUMN profiles.address IS 'User address (optional field collected during signup)';
