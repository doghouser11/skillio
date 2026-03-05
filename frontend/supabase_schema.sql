-- SKILLIO.LIVE DATABASE SCHEMA
-- =============================
-- Complete database structure for Skillio platform

-- 1. USERS TABLE (extends Supabase auth.users)
-- Stores additional user profile data
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'parent' CHECK (role IN ('parent', 'school', 'admin')),
  phone TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SCHOOLS TABLE (агенции/учители/треньори)
-- Main table for educational service providers
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by_user UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic Info
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'teacher', 'agency', 'trainer', 'studio'
  
  -- Location
  city TEXT NOT NULL,
  neighborhood TEXT,
  address TEXT,
  
  -- Contact
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  
  -- Pricing (optional)
  price_from INTEGER, -- minimum price in BGN
  price_to INTEGER,   -- maximum price in BGN
  price_description TEXT, -- "50 лв./урок" или "150-300 лв./мес"
  
  -- Status
  verified BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ACTIVITIES TABLE (дейности)
-- Specific activities offered by schools
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  
  -- Activity Details
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'Спорт', 'Музика', 'Танци', 'Програмиране', etc.
  
  -- Age Requirements
  age_min INTEGER,
  age_max INTEGER,
  
  -- Pricing
  price_monthly INTEGER, -- price per month in BGN
  price_per_session INTEGER, -- price per session in BGN
  
  -- Schedule & Availability
  schedule_text TEXT, -- "Понеделник, Сряда, Петък 18:00-19:00"
  duration_minutes INTEGER, -- duration of one session
  
  -- Status
  active BOOLEAN DEFAULT TRUE,
  verified BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. REVIEWS TABLE (отзиви и рейтинг)
-- Parent reviews for schools
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Review Content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate reviews from same parent for same school
  UNIQUE(school_id, parent_id)
);

-- 5. LEADS TABLE (заявки за интерес)
-- When parents express interest in activities
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Lead Details
  child_age INTEGER,
  message TEXT,
  
  -- Contact Preference
  preferred_contact TEXT DEFAULT 'email' CHECK (preferred_contact IN ('email', 'phone', 'whatsapp')),
  
  -- Status
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. NEIGHBORHOODS TABLE (квартали)
-- Helper table for location filtering
CREATE TABLE IF NOT EXISTS public.neighborhoods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(name, city)
);

-- INDEXES FOR PERFORMANCE
-- ========================

-- Schools indexes
CREATE INDEX IF NOT EXISTS idx_schools_city ON public.schools(city);
CREATE INDEX IF NOT EXISTS idx_schools_status ON public.schools(status);
CREATE INDEX IF NOT EXISTS idx_schools_verified ON public.schools(verified);
CREATE INDEX IF NOT EXISTS idx_schools_active ON public.schools(active);

-- Activities indexes  
CREATE INDEX IF NOT EXISTS idx_activities_school ON public.activities(school_id);
CREATE INDEX IF NOT EXISTS idx_activities_category ON public.activities(category);
CREATE INDEX IF NOT EXISTS idx_activities_active ON public.activities(active);
CREATE INDEX IF NOT EXISTS idx_activities_age ON public.activities(age_min, age_max);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_school ON public.reviews(school_id);
CREATE INDEX IF NOT EXISTS idx_reviews_parent ON public.reviews(parent_id);

-- Leads indexes
CREATE INDEX IF NOT EXISTS idx_leads_activity ON public.leads(activity_id);
CREATE INDEX IF NOT EXISTS idx_leads_parent ON public.leads(parent_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);

-- VIEWS FOR COMMON QUERIES
-- ========================

-- Schools with average rating
CREATE OR REPLACE VIEW public.schools_with_rating AS
SELECT 
  s.*,
  COALESCE(AVG(r.rating), 0) as average_rating,
  COUNT(r.id) as review_count
FROM public.schools s
LEFT JOIN public.reviews r ON r.school_id = s.id
GROUP BY s.id;

-- Activities with school info
CREATE OR REPLACE VIEW public.activities_with_school AS
SELECT 
  a.*,
  s.name as school_name,
  s.city as school_city,
  s.phone as school_phone,
  s.email as school_email,
  s.verified as school_verified
FROM public.activities a
JOIN public.schools s ON s.id = a.school_id;

-- FUNCTIONS
-- =========

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_schools_updated_at ON public.schools;  
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON public.schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_activities_updated_at ON public.activities;
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ROW LEVEL SECURITY (RLS) POLICIES  
-- ===================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all public profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Schools policies  
CREATE POLICY "Anyone can view approved schools" ON public.schools FOR SELECT USING (status = 'APPROVED' AND active = true);
CREATE POLICY "School owners can manage own schools" ON public.schools FOR ALL USING (auth.uid() = created_by_user);
CREATE POLICY "Admins can manage all schools" ON public.schools FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Activities policies
CREATE POLICY "Anyone can view active activities" ON public.activities FOR SELECT USING (active = true);
CREATE POLICY "School owners can manage activities" ON public.activities FOR ALL USING (
  EXISTS (SELECT 1 FROM public.schools WHERE id = school_id AND created_by_user = auth.uid())
);
CREATE POLICY "Admins can manage all activities" ON public.activities FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Parents can create reviews" ON public.reviews FOR INSERT WITH CHECK (
  auth.uid() = parent_id AND 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'parent')
);
CREATE POLICY "Parents can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = parent_id);

-- Leads policies
CREATE POLICY "Parents can view own leads" ON public.leads FOR SELECT USING (auth.uid() = parent_id);
CREATE POLICY "School owners can view leads for their activities" ON public.leads FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.activities a 
    JOIN public.schools s ON s.id = a.school_id 
    WHERE a.id = activity_id AND s.created_by_user = auth.uid()
  )
);
CREATE POLICY "Parents can create leads" ON public.leads FOR INSERT WITH CHECK (auth.uid() = parent_id);
CREATE POLICY "School owners can update lead status" ON public.leads FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.activities a 
    JOIN public.schools s ON s.id = a.school_id 
    WHERE a.id = activity_id AND s.created_by_user = auth.uid()
  )
);

-- Neighborhoods policies
CREATE POLICY "Anyone can view neighborhoods" ON public.neighborhoods FOR SELECT USING (true);
CREATE POLICY "Admins can manage neighborhoods" ON public.neighborhoods FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- SEED DATA
-- =========

-- Add some neighborhoods for Sofia
INSERT INTO public.neighborhoods (name, city) VALUES
('Център', 'София'),
('Лозенец', 'София'), 
('Борово', 'София'),
('Витоша', 'София'),
('Младост', 'София'),
('Люлин', 'София'),
('Студентски град', 'София'),
('Банишора', 'София'),
('Редута', 'София'),
('Гео Милев', 'София')
ON CONFLICT (name, city) DO NOTHING;

-- Success message
SELECT 'Database schema created successfully!' AS message;