-- SKILLIO.LIVE COMPLETE SETUP
-- =============================
-- Database schema + sample data in one file

-- 1. USERS TABLE (extends Supabase auth.users)
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
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by_user UUID REFERENCES public.users(id) ON DELETE CASCADE,
  
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

-- 3. ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  
  age_min INTEGER,
  age_max INTEGER,
  
  price_monthly INTEGER,
  price_per_session INTEGER,
  
  schedule_text TEXT,
  duration_minutes INTEGER,
  
  active BOOLEAN DEFAULT TRUE,
  verified BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(school_id, parent_id)
);

-- 5. LEADS TABLE
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  child_age INTEGER,
  message TEXT,
  
  preferred_contact TEXT DEFAULT 'email' CHECK (preferred_contact IN ('email', 'phone', 'whatsapp')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. NEIGHBORHOODS TABLE
CREATE TABLE IF NOT EXISTS public.neighborhoods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(name, city)
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_schools_city ON public.schools(city);
CREATE INDEX IF NOT EXISTS idx_schools_status ON public.schools(status);
CREATE INDEX IF NOT EXISTS idx_activities_school ON public.activities(school_id);
CREATE INDEX IF NOT EXISTS idx_activities_category ON public.activities(category);
CREATE INDEX IF NOT EXISTS idx_reviews_school ON public.reviews(school_id);
CREATE INDEX IF NOT EXISTS idx_leads_activity ON public.leads(activity_id);

-- VIEWS
CREATE OR REPLACE VIEW public.schools_with_rating AS
SELECT 
  s.*,
  COALESCE(AVG(r.rating), 0) as average_rating,
  COUNT(r.id) as review_count
FROM public.schools s
LEFT JOIN public.reviews r ON r.school_id = s.id
GROUP BY s.id;

-- RLS POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;

-- Basic policies
CREATE POLICY "Anyone can view approved schools" ON public.schools FOR SELECT USING (status = 'APPROVED' AND active = true);
CREATE POLICY "Anyone can view active activities" ON public.activities FOR SELECT USING (active = true);
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can view neighborhoods" ON public.neighborhoods FOR SELECT USING (true);

-- SEED DATA
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

-- SAMPLE SCHOOLS (without created_by_user for now)
INSERT INTO public.schools (
  name, description, category, city, neighborhood, address, 
  email, phone, website, price_from, price_to, price_description,
  verified, active, status
) VALUES 

('Студио за танци "Ритъм"', 'Професионални уроци по модерни танци за деца и възрастни. Латино, хип-хоп, съвременен танц.', 'studio', 'София', 'Център', 'ул. Витоша 15', 'info@rithm-dance.bg', '0888123456', 'https://rithm-dance.bg', 80, 150, '80-150 лв./месец', true, true, 'APPROVED'),

('Балетно студио "Грация"', 'Класически балет за деца от 4 до 16 години. Квалифицирани преподаватели с международен опит.', 'studio', 'София', 'Лозенец', 'ул. Околовръстен път 23А', 'contact@gracia-ballet.bg', '0887654321', 'https://gracia-ballet.bg', 120, 200, '120-200 лв./месец', true, true, 'APPROVED'),

('Спортен клуб "Шампиони"', 'Футбол, баскетбол и тенис за деца. Тренировки в grupa и индивидуални уроци.', 'club', 'София', 'Младост', 'бул. Цариградско шосе 125', 'office@champions-bg.com', '0889999888', 'https://champions-bg.com', 60, 120, '60-120 лв./месец', true, true, 'APPROVED'),

('Плувен басейн "Делфин"', 'Уроци по плуване за деца от 3 години. Групови и индивидуални тренировки.', 'trainer', 'София', 'Борово', 'ул. Дунав 5', 'swim@delfin.bg', '0877112233', NULL, 45, 80, '45 лв./урок', true, true, 'APPROVED'),

('Музикална школа "Мелодия"', 'Уроци по пиано, китара, цигулка и вокал. Подготовка за прием в НМА.', 'school', 'София', 'Студентски град', 'ул. 8-ми декември 45', 'melodia@music-bg.net', '0886775544', 'https://melodia-music.bg', 80, 150, '80-150 лв./месец', true, true, 'APPROVED'),

('IT Академия "Код"', 'Програмиране за деца - Scratch, Python, JavaScript. Роботика и 3D моделиране.', 'academy', 'София', 'Витоша', 'ул. Околовръстен път 36', 'hello@code-academy.bg', '0888444555', 'https://code-academy.bg', 100, 200, '100-200 лв./месец', true, true, 'APPROVED'),

('Художествено ателие "Палитра"', 'Рисуване, моделиране с глина, декоративно изкуство за деца от 5 години.', 'studio', 'София', 'Лозенец', 'ул. Софийски герой 12', 'art@palitra-bg.com', '0877333222', NULL, 70, 120, '70-120 лв./месец', true, true, 'APPROVED'),

('Езиков център "Полиглот"', 'Английски, немски, френски за деца. Игрови методи на обучение.', 'center', 'София', 'Редута', 'ул. Гладстон 25', 'info@polyglot.bg', '0889111000', 'https://polyglot.bg', 90, 160, '90-160 лв./месец', true, true, 'APPROVED');

-- SAMPLE ACTIVITIES
INSERT INTO public.activities (
  school_id, title, description, category, age_min, age_max, 
  price_monthly, schedule_text, duration_minutes, active, verified
) 
SELECT 
  s.id,
  'Танци за начинаещи',
  'Основни стъпки и техники за деца без предишен опит.',
  'Танци',
  4, 12,
  100,
  'Вторник и Четвъртък 17:00-18:00',
  60,
  true, true
FROM public.schools s WHERE s.name = 'Студио за танци "Ритъм"'

UNION ALL

SELECT 
  s.id,
  'Футбол за деца',
  'Тренировки по футбол в група до 12 деца.',
  'Спорт', 
  6, 14,
  80,
  'Понеделник, Сряда, Петък 18:00-19:30',
  90,
  true, true
FROM public.schools s WHERE s.name = 'Спортен клуб "Шампиони"'

UNION ALL

SELECT 
  s.id,
  'Пиано за деца',
  'Индивидуални уроци по пиано за начинаещи.',
  'Музика',
  5, 16,
  120,
  'По договаряне',
  45,
  true, true
FROM public.schools s WHERE s.name = 'Музикална школа "Мелодия"'

UNION ALL

SELECT 
  s.id,
  'Scratch програмиране',
  'Въведение в програмирането със Scratch за деца.',
  'Програмиране',
  7, 12, 
  150,
  'Събота 10:00-12:00',
  120,
  true, true
FROM public.schools s WHERE s.name = 'IT Академия "Код"';

-- Success message
SELECT 'Skillio.live database setup complete! 🎉' AS message;