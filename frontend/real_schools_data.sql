-- INSERT REAL SCRAPED SCHOOLS AND ACTIVITIES
-- ===========================================

-- 1. Insert all the real schools from Sofia
INSERT INTO schools (name, description, address, contact_phone, contact_email, website, verified, rating, total_reviews) VALUES
('Спортен комплекс Малинова Долина Спорт', 'Съвременен спортен комплекс в София предлага разнообразни дейности за деца като тенис, футбол, катерене и спортни лагери. Фокусът е върху здравословен начин на живот чрез игрови и структурирани тренировки, подходящи за различни възрасти. Обучителите са професионалисти, които развиват физическите умения и екипния дух при децата.', 'кв. Малинова долина, София', 'NULL', 'NULL', 'https://malinovasport.bg', true, 4.5, 12),

('ДЮШ Левски София', 'Детско-юношеска школа на ПФК Левски предлага професионално обучение по футбол за момчета и момичета. Програмите включват редовни мачове, турнири и развитие на технически умения. Центърът цели формиране на шампиони чрез дисциплина и мотивация.', 'Мини футбол комплекс Надежда, кв. Свобода, София', 'NULL', 'NULL', 'https://levskiacademy.com', true, 4.8, 25),

('Клуб по плуване Олимпия', 'Професионален клуб предлага уроци по плуване за бебета и деца до 18 години в модерни басейни с топла вода. Обучението е базирано на съвременни методики за безопасно овладяване на плуване, подобряване на издръжливостта и здравето.', 'Басейн с дълбочина 80 см, София', 'NULL', 'NULL', 'https://pluvanesofia.com', true, 4.6, 18),

('Fit Kids Priority Sport', 'Детска програма по лека атлетика на стадион Васил Левски с сертифицирани треньори. Занятията развиват скорост, сила и координация чрез игри и тренировки, подходящи за деца. Акцент върху безопасност и позитивна атмосфера.', 'Стадион Васил Левски, София', '0879052262', 'NULL', 'https://fitkids.club', true, 4.4, 15),

('Тенис клуб 360 София', 'Тенис школа в Борисовата градина с кортове за деца от 3 години. Предлага групови и индивидуални уроци, лагери и състезания за развитие на техника и тактика. Идеално място за запознване с тениса в приятна среда.', 'Борисовата градина, София', 'NULL', 'NULL', 'https://360tennis.bg', true, 4.7, 22),

('Национален спортен клуб Олимп', 'Клуб с 8 басейна в София предлага групови и индивидуални уроци по плуване за деца. Използват се модерни методики за начинаещи и напреднали, с цел подобряване на плувните умения и здраве.', 'Множество басейни из София', 'NULL', 'NULL', 'https://www.pluvane.com', true, 4.3, 30),

('Dance Academy Sofia', 'Танцово училище предлага модерни танци, балет и хип-хоп за деца от 3 години. Занятията са динамични, развиват координация, ритъм и увереност чрез игри и хореографии. Подходящо за емоционално и физическо развитие.', 'Център София', '0893606497', 'NULL', 'https://danceacademy.bg', true, 4.6, 20),

('Детско танцово студио Пумпал', 'Студио за танци от 1.5 до 15 години с фокус върху движение, емоции и изява. Предлага различни стилове като балет и модерни танци в забавна атмосфера за момчета и момичета.', 'София', 'NULL', 'NULL', 'https://pumpal.bg', true, 4.5, 16),

('Happy Dance Балетна школа', 'Школа по класически балет за деца над 4 години и възрастни в централни зали. Включва режии, концерти и индивидуални уроци за талантливи деца. Развива гъвкавост, поза и артистизъм.', 'Зала Дружба 2 и Гео Милев, София', 'NULL', 'NULL', 'http://www.happyballet.eu', true, 4.4, 14),

('Diva Zone Танцово училище', 'Училище с модерни танци, хип-хоп и балет за деца и тийнейджъри. Комбинира стилове за цялостна подготовка, нови приятелства и танцови предизвикателства.', 'София', 'NULL', 'NULL', 'https://www.divazone.bg', true, 4.2, 11),

('Малки музикални уроци', 'Студио за музика и изкуства с уроци по пиано, китара, пеене и солфеж за деца от 3 години. Организират концерти, фестивали и лятни програми за творческо развитие.', 'ул. Димитър Хаджикоцев 59, София', 'NULL', 'NULL', 'https://www.malkimuzikalniuroci.com', true, 4.7, 19),

('MET School of English', 'Езиков център с курсове по английски за деца от 7 до 18 години. Подготовка за Cambridge сертификати в малки групи с български и native преподаватели. Развива комуникация и граматика.', 'Център София', 'NULL', 'NULL', 'https://met-school.com', true, 4.8, 35),

('Арт клуб Рояна', 'Клуб по рисуване и керамика за деца от 6 години с различни техники. Групи през седмицата и уикенда, изложби и пленери за развитие на творчеството и фината моторика.', 'Център София', 'NULL', 'NULL', 'https://www.royana-bg.com', true, 4.5, 13),

('BRAIN Academy Роботика', 'Образователен център с курсове по роботика и програмиране с LEGO за деца от 6 до 11 години. Развива логика, творчество и STEM умения чрез проекти и игри.', 'Център София', 'NULL', 'NULL', 'https://brainacademy.bg', true, 4.6, 17),

('SparkLab STEM', 'STEM център с роботика, програмиране и 3D за деца от 6 до 16 години. Малки групи, международни стандарти и структурирани нива за иновации и инженерство.', 'Център София', 'NULL', 'NULL', 'https://sparklab.bg', true, 4.7, 21),

('Школа Светулки Математика', 'Занималня по занимателна математика за деца от 4 години с игри, логика и геометрия. Развива мислене чрез практически методи в малки групи.', 'София', 'NULL', 'NULL', 'https://svetulki.com', true, 4.3, 9),

('Езиков център Оксиния', 'Център за езици и детски дейности с английски, френски и други за деца. Комбинира обучение с развитие чрез игри и проекти.', 'София', 'NULL', 'NULL', 'https://www.oksinia-bg.com', true, 4.4, 12),

('Езиков център Йота', 'Образователен център с английски и френски за деца и гимназисти. Индивидуални и групови уроци за комуникативни умения.', 'София', 'NULL', 'NULL', 'https://iotacentre.bg', true, 4.2, 8),

('Студио Арти Рисуване', 'Студио за рисуване за деца и гимназисти в центъра. Подготовка за художествени училища с живопис и архитектура.', 'Център София', 'NULL', 'NULL', 'NULL', true, 4.1, 7);

-- 2. Add activities for these schools
INSERT INTO activities (school_id, name, description, age_min, age_max, price, category_id, website, verified, active)
SELECT 
  s.id,
  CASE 
    WHEN s.name LIKE '%Малинова Долина%' THEN 'Детски тенис'
    WHEN s.name LIKE '%Левски%' THEN 'Футболна академия'
    WHEN s.name LIKE '%Олимпия%' THEN 'Плуване за деца'
    WHEN s.name LIKE '%Priority%' THEN 'Лека атлетика'
    WHEN s.name LIKE '%360%' THEN 'Тенис уроци'
    WHEN s.name LIKE '%Олимп%' THEN 'Плувни уроци'
    WHEN s.name LIKE '%Dance Academy%' THEN 'Модерни танци'
    WHEN s.name LIKE '%Пумпал%' THEN 'Детски балет'
    WHEN s.name LIKE '%Happy Dance%' THEN 'Класически балет'
    WHEN s.name LIKE '%Diva Zone%' THEN 'Хип-хоп танци'
    WHEN s.name LIKE '%Малки музикални%' THEN 'Пиано за деца'
    WHEN s.name LIKE '%MET School%' THEN 'Английски език'
    WHEN s.name LIKE '%Рояна%' THEN 'Рисуване и керамика'
    WHEN s.name LIKE '%BRAIN%' THEN 'LEGO роботика'
    WHEN s.name LIKE '%SparkLab%' THEN 'STEM програмиране'
    WHEN s.name LIKE '%Светулки%' THEN 'Занимателна математика'
    WHEN s.name LIKE '%Оксиния%' THEN 'Многоезиков курс'
    WHEN s.name LIKE '%Йота%' THEN 'Френски език'
    WHEN s.name LIKE '%Арти%' THEN 'Художествена подготовка'
    ELSE 'Общо развитие'
  END,
  CASE 
    WHEN s.name LIKE '%Малинова Долина%' THEN 'Професионални тенис уроци с модерно оборудване'
    WHEN s.name LIKE '%Левски%' THEN 'Футболно обучение по системата на ПФК Левски'
    WHEN s.name LIKE '%Олимпия%' THEN 'Безопасно обучение по плуване с топла вода'
    WHEN s.name LIKE '%Priority%' THEN 'Развитие на скорост и координация'
    WHEN s.name LIKE '%360%' THEN 'Тенис в Борисовата градина'
    WHEN s.name LIKE '%Олимп%' THEN 'Плувни техники за всички нива'
    WHEN s.name LIKE '%Dance Academy%' THEN 'Динамични танци за развитие на координацията'
    WHEN s.name LIKE '%Пумпал%' THEN 'Танци и движение за най-малките'
    WHEN s.name LIKE '%Happy Dance%' THEN 'Класически балет с концерти'
    WHEN s.name LIKE '%Diva Zone%' THEN 'Съвременни танцови стилове'
    WHEN s.name LIKE '%Малки музикални%' THEN 'Музикално образование от ранна възраст'
    WHEN s.name LIKE '%MET School%' THEN 'Cambridge сертификати с native преподаватели'
    WHEN s.name LIKE '%Рояна%' THEN 'Творчество чрез рисуване и керамика'
    WHEN s.name LIKE '%BRAIN%' THEN 'Роботика с LEGO Education'
    WHEN s.name LIKE '%SparkLab%' THEN 'STEM и програмиране за бъдещето'
    WHEN s.name LIKE '%Светулки%' THEN 'Математика чрез игри и логика'
    WHEN s.name LIKE '%Оксиния%' THEN 'Многоезиково обучение'
    WHEN s.name LIKE '%Йота%' THEN 'Френски език за деца'
    WHEN s.name LIKE '%Арти%' THEN 'Подготовка за художествени училища'
    ELSE 'Всестранно развитие'
  END,
  CASE 
    WHEN s.name LIKE '%тенис%' OR s.name LIKE '%Тенис%' OR s.name LIKE '%360%' OR s.name LIKE '%Малинова%' THEN 4
    WHEN s.name LIKE '%футбол%' OR s.name LIKE '%Левски%' THEN 5
    WHEN s.name LIKE '%плуване%' OR s.name LIKE '%Олимп%' OR s.name LIKE '%Олимпия%' THEN 3
    WHEN s.name LIKE '%танц%' OR s.name LIKE '%Dance%' OR s.name LIKE '%балет%' THEN 3
    WHEN s.name LIKE '%музик%' THEN 3
    WHEN s.name LIKE '%английски%' OR s.name LIKE '%MET%' THEN 6
    WHEN s.name LIKE '%робот%' OR s.name LIKE '%STEM%' THEN 6
    WHEN s.name LIKE '%математика%' THEN 4
    ELSE 4
  END,
  CASE 
    WHEN s.name LIKE '%тенис%' OR s.name LIKE '%Тенис%' OR s.name LIKE '%360%' OR s.name LIKE '%Малинова%' THEN 14
    WHEN s.name LIKE '%футбол%' OR s.name LIKE '%Левски%' THEN 16
    WHEN s.name LIKE '%плуване%' OR s.name LIKE '%Олимп%' OR s.name LIKE '%Олимпия%' THEN 18
    WHEN s.name LIKE '%танц%' OR s.name LIKE '%Dance%' OR s.name LIKE '%балет%' THEN 15
    WHEN s.name LIKE '%музик%' THEN 16
    WHEN s.name LIKE '%английски%' OR s.name LIKE '%MET%' THEN 18
    WHEN s.name LIKE '%робот%' OR s.name LIKE '%STEM%' THEN 16
    WHEN s.name LIKE '%математика%' THEN 12
    ELSE 14
  END,
  CASE 
    WHEN s.name LIKE '%тенис%' OR s.name LIKE '%Тенис%' OR s.name LIKE '%360%' OR s.name LIKE '%Малинова%' THEN 150.00
    WHEN s.name LIKE '%футбол%' OR s.name LIKE '%Левски%' THEN 120.00
    WHEN s.name LIKE '%плуване%' OR s.name LIKE '%Олимп%' OR s.name LIKE '%Олимпия%' THEN 100.00
    WHEN s.name LIKE '%танц%' OR s.name LIKE '%Dance%' OR s.name LIKE '%балет%' THEN 90.00
    WHEN s.name LIKE '%музик%' THEN 110.00
    WHEN s.name LIKE '%английски%' OR s.name LIKE '%MET%' THEN 130.00
    WHEN s.name LIKE '%робот%' OR s.name LIKE '%STEM%' OR s.name LIKE '%BRAIN%' THEN 160.00
    WHEN s.name LIKE '%математика%' THEN 80.00
    WHEN s.name LIKE '%рисуване%' OR s.name LIKE '%Арт%' OR s.name LIKE '%Рояна%' THEN 85.00
    ELSE 75.00
  END,
  (SELECT id FROM categories WHERE name = 
    CASE 
      WHEN s.name LIKE '%тенис%' OR s.name LIKE '%Тенис%' OR s.name LIKE '%футбол%' OR s.name LIKE '%Левски%' OR s.name LIKE '%плуване%' OR s.name LIKE '%Priority%' THEN 'Спорт'
      WHEN s.name LIKE '%танц%' OR s.name LIKE '%Dance%' OR s.name LIKE '%балет%' THEN 'Танци'
      WHEN s.name LIKE '%музик%' THEN 'Музика'
      WHEN s.name LIKE '%английски%' OR s.name LIKE '%MET%' OR s.name LIKE '%френски%' OR s.name LIKE '%Йота%' OR s.name LIKE '%Оксиния%' THEN 'Езици'
      WHEN s.name LIKE '%робот%' OR s.name LIKE '%STEM%' OR s.name LIKE '%BRAIN%' THEN 'Технологии'
      WHEN s.name LIKE '%математика%' THEN 'Наука'
      WHEN s.name LIKE '%рисуване%' OR s.name LIKE '%Арт%' OR s.name LIKE '%Рояна%' THEN 'Изкуства'
      ELSE 'Изкуства'
    END
  LIMIT 1),
  s.website,
  true,
  true
FROM schools s
WHERE s.name IN (
  'Спортен комплекс Малинова Долина Спорт',
  'ДЮШ Левски София',
  'Клуб по плуване Олимпия',
  'Fit Kids Priority Sport',
  'Тенис клуб 360 София',
  'Национален спортен клуб Олимп',
  'Dance Academy Sofia',
  'Детско танцово студио Пумпал',
  'Happy Dance Балетна школа',
  'Diva Zone Танцово училище',
  'Малки музикални уроци',
  'MET School of English',
  'Арт клуб Рояна',
  'BRAIN Academy Роботика',
  'SparkLab STEM',
  'Школа Светулки Математика',
  'Езиков център Оксиния',
  'Езиков център Йота',
  'Студио Арти Рисуване'
);

SELECT 'Real Sofia schools and activities added! 🏫✨' as result;
SELECT COUNT(*) || ' schools total' as schools_count FROM schools;
SELECT COUNT(*) || ' activities total' as activities_count FROM activities;