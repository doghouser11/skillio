-- Create inquiry status enum
DO $$ BEGIN
    CREATE TYPE inquiry_status AS ENUM ('NEW', 'CONTACTED', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id),
    parent_name VARCHAR NOT NULL,
    parent_email VARCHAR NOT NULL,
    parent_phone VARCHAR,
    child_age INTEGER,
    message TEXT NOT NULL,
    status inquiry_status NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_school_id ON inquiries(school_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
