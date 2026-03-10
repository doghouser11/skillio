-- URGENT FIX: Оправи status на всички записи с невалиден lowercase status
-- Paste в Supabase SQL Editor → Run

-- Първо виж какво имаме
SELECT id, name, status FROM schools LIMIT 5;

-- Оправи всички записи с lowercase status
UPDATE schools SET status = 'APPROVED' WHERE status = 'approved';
UPDATE schools SET status = 'PENDING' WHERE status = 'pending';
UPDATE schools SET status = 'REJECTED' WHERE status = 'rejected';

-- Провери резултата
SELECT status, COUNT(*) FROM schools GROUP BY status;
