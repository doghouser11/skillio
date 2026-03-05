-- SAMPLE SCHOOLS/AGENCIES DATA
-- =============================
-- Ready-to-insert test data for initial population

-- Sample schools/agencies/teachers
INSERT INTO public.schools (
  name, description, category, city, neighborhood, address, 
  email, phone, website, price_from, price_to, price_description,
  verified, active, status
) VALUES 

-- Dance Studios
('Студио за танци "Ритъм"', 'Професионални уроци по модерни танци за деца и възрастни. Латино, хип-хоп, съвременен танц.', 'studio', 'София', 'Център', 'ул. Витоша 15', 'info@rithm-dance.bg', '0888123456', 'https://rithm-dance.bg', 80, 150, '80-150 лв./месец', true, true, 'APPROVED'),

('Балетно студио "Грация"', 'Класически балет за деца от 4 до 16 години. Квалифицирани преподаватели с международен опит.', 'studio', 'София', 'Лозенец', 'ул. Околовръстен път 23А', 'contact@gracia-ballet.bg', '0887654321', 'https://gracia-ballet.bg', 120, 200, '120-200 лв./месец', true, true, 'APPROVED'),

-- Sports
('Спортен клуб "Шампиони"', 'Футбол, баскетбол и тенис за деца. Тренировки в група и индивидуални уроци.', 'club', 'София', 'Младост', 'бул. Цариградско шосе 125', 'office@champions-bg.com', '0889999888', 'https://champions-bg.com', 60, 120, '60-120 лв./месец', true, true, 'APPROVED'),

('Плувен басейн "Делфин"', 'Уроци по плуване за деца от 3 години. Групови и индивидуални тренировки.', 'trainer', 'София', 'Борово', 'ул. Дунав 5', 'swim@delfin.bg', '0877112233', NULL, 45, 80, '45 лв./урок', true, true, 'APPROVED'),

-- Music
('Музикална школа "Мелодия"', 'Уроци по пиано, китара, цигулка и вокал. Подготовка за прием в НМА.', 'school', 'София', 'Студентски град', 'ул. 8-ми декември 45', 'melodia@music-bg.net', '0886775544', 'https://melodia-music.bg', 80, 150, '80-150 лв./месец', true, true, 'APPROVED'),

-- Programming/Tech
('IT Академия "Код"', 'Програмиране за деца - Scratch, Python, JavaScript. Роботика и 3D моделиране.', 'academy', 'София', 'Витоша', 'ул. Околовръстен път 36', 'hello@code-academy.bg', '0888444555', 'https://code-academy.bg', 100, 200, '100-200 лв./месец', true, true, 'APPROVED'),

-- Art
('Художествено ателие "Палитра"', 'Рисуване, моделиране с глина, декоративно изкуство за деца от 5 години.', 'studio', 'София', 'Лозенец', 'ул. Софийски герой 12', 'art@palitra-bg.com', '0877333222', NULL, 70, 120, '70-120 лв./месец', true, true, 'APPROVED'),

-- Languages
('Езиков център "Полиглот"', 'Английски, немски, френски за деца. Игрови методи на обучение.', 'center', 'София', 'Редута', 'ул. Гладстон 25', 'info@polyglot.bg', '0889111000', 'https://polyglot.bg', 90, 160, '90-160 лв./месец', true, true, 'APPROVED'),

-- Martial Arts
('Карате клуб "Самурай"', 'Шотокан карате за деца и възрастни. Участие в състезания и лагери.', 'club', 'София', 'Люлин', 'ул. Бели дунав 15', 'dojo@samurai-karate.bg', '0886222111', NULL, 50, 90, '50-90 лв./месец', true, true, 'APPROVED'),

-- Individual teachers (pending approval)
('Учител по математика - Иванка Петрова', 'Частни уроци по математика за ученици 1-12 клас. 15 години опит.', 'teacher', 'София', 'Гео Милев', 'ул. Акад. Борис Стефанов 5', 'ivanka.math@gmail.com', '0887123789', NULL, 30, 50, '30-50 лв./урок', false, true, 'PENDING'),

('Треньор по тенис - Георги Димитров', 'Индивидуални уроци по тенис за деца и възрастни на кортове в Борисовата градина.', 'trainer', 'София', 'Център', 'Борисова градина', 'georgi.tennis@yahoo.com', '0888567890', NULL, 60, 100, '60-100 лв./урок', false, true, 'PENDING');

-- Create some sample activities
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
SELECT 'Sample schools and activities created!' AS message;