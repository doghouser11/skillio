-- Оправи невалидни категории в DB
-- Paste в Supabase SQL Editor → Run

UPDATE schools SET category = 'music-dance' WHERE category = 'dance';
UPDATE schools SET category = 'science' WHERE category = 'stem';
UPDATE schools SET category = 'art' WHERE category = 'arts';
UPDATE schools SET category = 'outdoor-sports' WHERE category IS NULL;

-- Провери резултата
SELECT category, COUNT(*) FROM schools GROUP BY category ORDER BY count DESC;
