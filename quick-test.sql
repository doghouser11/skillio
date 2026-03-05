-- QUICK TEST DATA FOR SKILLIO (2 minutes to working site)

-- Test users with correct enum values
INSERT INTO users (id, email, password_hash, role, created_at) VALUES 
('11111111-1111-1111-1111-111111111111'::uuid, 'admin@test.bg', '$2b$12$test_hash', 'admin', NOW()),
('22222222-2222-2222-2222-222222222222'::uuid, 'school@test.bg', '$2b$12$test_hash', 'school', NOW())
ON CONFLICT (email) DO NOTHING;

-- Test neighborhood
INSERT INTO neighborhoods (id, city, name, lat, lng) VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'София', 'Център', 42.6977, 23.3219)
ON CONFLICT (id) DO NOTHING;

-- Test school
INSERT INTO schools (id, name, description, phone, email, city, address, neighborhood_id, verified, status, created_by, created_at) VALUES 
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Test Танцово Студио', 'Test описание за танцово студио.', '+359888123456', 'info@test-studio.bg', 'София', 'ул. Test 1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, true, 'APPROVED', '22222222-2222-2222-2222-222222222222'::uuid, NOW())
ON CONFLICT (id) DO NOTHING;

-- Test activity  
INSERT INTO activities (id, school_id, title, description, category, age_min, age_max, price_monthly, active, verified, created_by, source, created_at) VALUES 
('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Test Танци', 'Test уроци по танци за деца.', 'Танци', 4, 12, 50.00, true, true, '22222222-2222-2222-2222-222222222222'::uuid, 'school', NOW())
ON CONFLICT (id) DO NOTHING;

-- Success message
SELECT 'SUCCESS: Test data created! Try login: admin@test.bg or school@test.bg (password unknown - need real hash)' as result;