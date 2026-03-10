-- Fix email column to be nullable in schools table
-- This allows organizations to be created without requiring an email address

-- Make email column nullable
ALTER TABLE schools ALTER COLUMN email DROP NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN schools.email IS 'Email address for the school/organization (optional)';

-- Verify the change
SELECT 
    column_name, 
    is_nullable, 
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_name = 'schools' AND column_name = 'email';