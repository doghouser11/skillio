-- Quick test data for Skillio
-- Run this on the production database to see content on homepage

-- Insert test neighborhoods (Sofia)
INSERT INTO neighborhoods (id, city, name, lat, lng) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'София', 'Център', 42.6977, 23.3219),
('550e8400-e29b-41d4-a716-446655440002', 'София', 'Лозенец', 42.6736, 23.3370),
('550e8400-e29b-41d4-a716-446655440003', 'София', 'Младост', 42.6491, 23.3816)
ON CONFLICT (id) DO NOTHING;

-- Insert test admin user (for testing admin panel)
INSERT INTO users (id, email, password_hash, role, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440010', 'admin@skillio.live', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LTgp3KMNM6kx7Tc2C', 'admin', NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert test school user
INSERT INTO users (id, email, password_hash, role, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440011', 'school1@skillio.live', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LTgp3KMNM6kx7Tc2C', 'school', NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert test schools
INSERT INTO schools (id, name, description, phone, email, website, city, address, neighborhood_id, verified, status, created_by, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440020', 'Танцово Studio Sofia', 'Професионално танцово студио за деца и възрастни. Модерни танци, балет, хип-хоп.', '+359888123456', 'info@dancestudio.bg', 'https://dancestudio.bg', 'София', 'ул. Витоша 15', '550e8400-e29b-41d4-a716-446655440001', true, 'APPROVED', '550e8400-e29b-41d4-a716-446655440011', NOW()),
('550e8400-e29b-41d4-a716-446655440021', 'Футболна Академия Champion', 'Детска футболна академия с професионални треньори и модерна база.', '+359888654321', 'info@champion-academy.bg', 'https://champion-academy.bg', 'София', 'ул. Гео Милев 25', '550e8400-e29b-41d4-a716-446655440002', true, 'APPROVED', '550e8400-e29b-41d4-a716-446655440011', NOW()),
('550e8400-e29b-41d4-a716-446655440022', 'Музикално Училище Harmony', 'Обучение по пиано, цигулка, китара, пеене. Индивидуални и групови уроци.', '+359888987654', 'contact@harmony-music.bg', 'https://harmony-music.bg', 'София', 'бул. Христо Ботев 88', '550e8400-e29b-41d4-a716-446655440003', true, 'APPROVED', '550e8400-e29b-41d4-a716-446655440011', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert test activities
INSERT INTO activities (id, school_id, title, description, category, age_min, age_max, price_monthly, active, verified, created_by, source, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440020', 'Модерен танц за деца', 'Уроци по модерен танц за деца от 4 до 12 години. Развитие на координация, гъвкавост и артистичност.', 'Танци', 4, 12, 80.00, true, true, '550e8400-e29b-41d4-a716-446655440011', 'SCHOOL', NOW()),
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440020', 'Балет за начинаещи', 'Класически балет за деца. Основни позиции, техника и хореография.', 'Танци', 5, 14, 100.00, true, true, '550e8400-e29b-41d4-a716-446655440011', 'SCHOOL', NOW()),
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440021', 'Детски футбол', 'Обучение по футбол за деца от 6 до 16 години. Техника, тактика, игра в отбор.', 'Спорт', 6, 16, 60.00, true, true, '550e8400-e29b-41d4-a716-446655440011', 'SCHOOL', NOW()),
('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440021', 'Футболни вратари', 'Специализирано обучение за вратари. Техника на хващане, рефлекси.', 'Спорт', 8, 18, 70.00, true, true, '550e8400-e29b-41d4-a716-446655440011', 'SCHOOL', NOW()),
('550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440022', 'Уроци по пиано', 'Индивидуални уроци по пиано за деца и възрастни. От начинаещи до напреднали.', 'Музика', 5, 18, 120.00, true, true, '550e8400-e29b-41d4-a716-446655440011', 'SCHOOL', NOW()),
('550e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440022', 'Детски хор', 'Групово пеене за деца. Развитие на слуха и музикалността.', 'Музика', 6, 14, 50.00, true, true, '550e8400-e29b-41d4-a716-446655440011', 'SCHOOL', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert some test reviews
INSERT INTO reviews (id, school_id, parent_id, rating, comment, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', 5, 'Отлично студио! Децата обичат уроците и треньорите са много професионални.', NOW()),
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440010', 4, 'Добра академия с качествени тренировки. Препоръчвам!', NOW()),
('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440010', 5, 'Учителите са изключително търпеливи и детето прогресира бързо.', NOW())
ON CONFLICT (id) DO NOTHING;