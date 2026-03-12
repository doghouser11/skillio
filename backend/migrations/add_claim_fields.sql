-- Add claim fields to schools table
ALTER TABLE schools ADD COLUMN IF NOT EXISTS claimed_by UUID REFERENCES users(id);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_schools_claimed_by ON schools(claimed_by);
