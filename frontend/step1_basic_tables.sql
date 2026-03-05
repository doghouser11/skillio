-- БАЗОВИ ТАБЛИЦИ ПЪРВО
-- ====================

-- 1. Users table (основна)
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

-- 2. Neighborhoods (независима таблица)
CREATE TABLE IF NOT EXISTS public.neighborhoods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, city)
);

-- 3. Schools (без foreign key засега)
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by_user UUID, -- без constraint засега
  
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  
  city TEXT NOT NULL,
  neighborhood TEXT,
  address TEXT,
  
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  
  price_from INTEGER,
  price_to INTEGER,
  price_description TEXT,
  
  verified BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'APPROVED', -- директно approved за тест
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Success message
SELECT 'Step 1: Basic tables created!' AS message;