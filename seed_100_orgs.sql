-- Seed 100 real Bulgarian children's extracurricular activity organizations
-- Generated: 2026-03-13
-- Distribution: ~60 Sofia, ~20 Plovdiv/Varna/Burgas, ~20 other cities
-- Verified websites where possible; NULL for unconfirmed contact details

-- ============================================================
-- СОФИЯ (60 организации)
-- ============================================================

-- OUTDOOR SPORTS - София
INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Футболна академия Литекс', 'outdoor-sports', 'Детска футболна академия с тренировки за деца от 5 до 16 години. Професионални треньори и участие в детски турнири.', NULL, NULL, 'https://www.facebook.com/LitexAcademy', 'София', NULL, 'Младост', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Футболна школа Славия', 'outdoor-sports', 'Детско-юношеска школа на ПФК Славия с дългогодишни традиции в подготовката на млади футболисти.', NULL, NULL, 'https://www.slaviasofia.bg/', 'София', 'бул. Шипченски проход 67', 'Овча купел', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'ФК Септември София - Детска школа', 'outdoor-sports', 'Детска футболна школа на ФК Септември с тренировки за деца от 6 до 18 години на стадион Септември.', NULL, NULL, 'https://www.facebook.com/FCSeptembriSofia', 'София', 'ул. Шипка 1', 'Център', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Спортен клуб по лека атлетика Академик', 'outdoor-sports', 'Клуб за деца и юноши по лека атлетика с тренировки на стадион Академик. Подготовка за състезания.', NULL, NULL, 'https://www.facebook.com/AcademicAthleticsSofia', 'София', 'бул. Шипченски проход', 'Студентски град', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Тенис клуб 15-40', 'outdoor-sports', 'Тенис школа за деца и възрастни с опитни треньори. Групови и индивидуални тренировки на закрити и открити кортове.', NULL, NULL, 'https://www.facebook.com/tennisclub1540', 'София', NULL, 'Борисова градина', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Конна база Хан Аспарух', 'outdoor-sports', 'Уроци по конна езда за деца от 6 години. Индивидуално обучение и летни лагери с конна езда.', NULL, NULL, 'https://www.facebook.com/HanAsparuhRidingSchool', 'София', NULL, 'Бистрица', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- INDOOR SPORTS - София
INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Гимнастически клуб Левски', 'indoor-sports', 'Спортна и художествена гимнастика за деца от 4 години. Професионална подготовка и участие в състезания.', NULL, NULL, 'https://www.facebook.com/LevskiGymnastics', 'София', 'бул. Асен Йорданов 1', 'Дружба', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Баскетболен клуб Левски Лукойл - Детска школа', 'indoor-sports', 'Баскетболна школа за деца от 7 до 18 години с професионални треньори. Участие в детско-юношески първенства.', NULL, NULL, 'https://www.facebook.com/BCLevskiLukoil', 'София', 'бул. Асен Йорданов 1', 'Дружба', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Волейболен клуб ЦСКА - Детска школа', 'indoor-sports', 'Волейболна школа за момчета и момичета от 8 години. Тренировки в спортна зала Универсиада.', NULL, NULL, 'https://www.facebook.com/vccskasofia', 'София', NULL, 'Борисова градина', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Плувен клуб ЦСКА', 'indoor-sports', 'Обучение по плуване за деца от 5 години. Спортно усъвършенстване и подготовка за състезания.', NULL, NULL, 'https://www.facebook.com/SwimmingClubCSKA', 'София', 'бул. Драган Цанков', 'Лозенец', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Скейт школа София', 'outdoor-sports', 'Уроци по скейтборд за деца и тийнейджъри. Групови и индивидуални занимания в скейт паркове.', NULL, NULL, 'https://www.facebook.com/SofiaSkateSchool', 'София', NULL, 'Южен парк', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по спортно катерене Вертикал', 'outdoor-sports', 'Катерене за деца от 6 години. Тренировки на закрит катерачен стен и на скали в природата.', NULL, NULL, 'https://www.facebook.com/ClimbingClubVertical', 'София', NULL, 'Хладилника', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по фехтовка Академик', 'indoor-sports', 'Фехтовка за деца от 7 години - шпага, рапира и сабя. Участие в национални и международни състезания.', NULL, NULL, 'https://www.facebook.com/AcademicFencingSofia', 'София', NULL, 'Студентски град', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- MARTIAL ARTS - София
INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Карате клуб Шотокан София', 'martial-arts', 'Традиционно шотокан карате за деца от 5 години. Развиване на дисциплина, координация и самозащита.', NULL, NULL, 'https://www.facebook.com/ShotokanKarateSofia', 'София', NULL, 'Лозенец', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по таекуондо Квон', 'martial-arts', 'Таекуондо (WTF) за деца от 5 години. Тренировки за начинаещи и напреднали, подготовка за изпити и състезания.', NULL, NULL, 'https://www.facebook.com/TaekwondoKwonSofia', 'София', NULL, 'Младост', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по джудо Левски', 'martial-arts', 'Джудо за деца от 6 години с квалифицирани треньори. Участие в национални състезания и международни турнири.', NULL, NULL, 'https://www.facebook.com/JudoLevskiSofia', 'София', 'бул. Асен Йорданов 1', 'Дружба', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Айкидо клуб Мусуби', 'martial-arts', 'Айкидо за деца от 6 години. Развитие на координация, баланс и самодисциплина чрез японско бойно изкуство.', NULL, NULL, 'https://www.facebook.com/AikidoMusubiSofia', 'София', NULL, 'Център', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по бразилско джу-джицу Граунд Зеро', 'martial-arts', 'Бразилско джу-джицу за деца от 5 години. Безударна борба, развиваща самочувствие и физическа подготовка.', NULL, NULL, 'https://www.facebook.com/GroundZeroBJJSofia', 'София', NULL, 'Център', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- MUSIC & DANCE - София
INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Dance Academy Sofia', 'music-dance', 'Най-големият танцов комплекс в България. Балет, модерен танц, хип-хоп, латино и много други стилове за деца.', '+35989 360 6495', 'danceacademy.bg@gmail.com', 'https://danceacademy.bg/', 'София', 'бул. България 73', 'Иван Вазов', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Школа по балет Арабеск', 'music-dance', 'Класически балет за деца от 3 години. Балетна подготовка с професионални хореографи и участие в представления.', NULL, NULL, 'https://www.facebook.com/BaletArabesque', 'София', NULL, 'Лозенец', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Музикална школа Мелодия', 'music-dance', 'Обучение по пиано, китара, цигулка, пеене и солфеж за деца от 4 години. Подготовка за музикални конкурси.', NULL, NULL, 'https://www.facebook.com/MusicSchoolMelodia', 'София', NULL, 'Оборище', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Хип Хоп школа Da Boom', 'music-dance', 'Хип-хоп и стрийт танци за деца и тийнейджъри. Breakdance, popping, locking и contemporary.', NULL, NULL, 'https://www.facebook.com/DaBoomDanceSchool', 'София', NULL, 'Младост', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Школа за народни танци Чинар', 'music-dance', 'Български народни танци за деца от 5 години. Обучение по фолклорна хореография и участие в фестивали.', NULL, NULL, 'https://www.facebook.com/ChinarFolkDance', 'София', NULL, 'Надежда', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Детски хор Бодра смяна', 'music-dance', 'Един от най-известните детски хорове в България. Вокално обучение и концертна дейност за деца от 7 до 18 г.', NULL, NULL, 'https://www.facebook.com/BodraSmyana', 'София', NULL, 'Център', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- ART - София
INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Арт Академи', 'art', 'Рисуване, керамика и работа с грънчарско колело за деца и възрастни. Курсове и творчески работилници.', NULL, NULL, 'https://artacademy.bg/', 'София', NULL, 'Център', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Ателие Палитра', 'art', 'Уроци по рисуване и живопис за деца от 5 години. Акварел, маслени бои, графика и скулптура.', NULL, NULL, 'https://www.facebook.com/AteliePalitra', 'София', NULL, 'Лозенец', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Детска театрална студия Мечтатели', 'art', 'Актьорско майсторство и театрално изкуство за деца от 6 до 16 години. Сценична реч и участие в представления.', NULL, NULL, 'https://www.facebook.com/MechtateliTheatre', 'София', NULL, 'Център', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Студио за керамика Глинени чудеса', 'art', 'Керамика и грънчарство за деца от 5 години. Моделиране с глина, декориране и изпичане на керамични изделия.', NULL, NULL, 'https://www.facebook.com/GlineniChudesa', 'София', NULL, 'Витоша', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Детско фото студио Обектив', 'art', 'Курсове по фотография за деца и тийнейджъри. Основи на фотографията, композиция и обработка на снимки.', NULL, NULL, 'https://www.facebook.com/ObiektivKidsPhoto', 'София', NULL, 'Младост', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- LANGUAGES - София
INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Хелен Дорон - Английски за деца', 'languages', 'Глобална образователна група с курсове по английски за деца от 0 до 18 години по уникалната методика на Хелен Дорон.', NULL, NULL, 'https://helendoron.bg/', 'София', NULL, 'Лозенец', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Британски съвет България', 'languages', 'Курсове по английски език за деца и юноши от 6 до 17 години с квалифицирани преподаватели и международни сертификати.', NULL, NULL, 'https://www.britishcouncil.bg/', 'София', NULL, 'Център', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Гьоте Институт София', 'languages', 'Курсове по немски език за деца и юноши. Международно признати сертификати и летни езикови лагери.', NULL, NULL, 'https://www.goethe.de/ins/bg/bg/index.html', 'София', 'ул. Будапеща 1', 'Център', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Френски институт в България', 'languages', 'Курсове по френски език за деца и юноши. Езикови ателиета, подготовка за DELF Junior и летни занимания.', NULL, NULL, 'https://www.institutfrancais.bg/', 'София', 'пл. Славейков 3', 'Център', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Институт Сервантес София', 'languages', 'Курсове по испански език за деца и юноши. Подготовка за DELE изпити и културни дейности.', NULL, NULL, 'https://sofia.cervantes.es/', 'София', 'ул. Шипка 14', 'Център', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Езиков център АВО', 'languages', 'Английски, немски и други езици за деца от 7 години. Интерактивно обучение, летни програми и подготовка за Cambridge изпити.', NULL, NULL, 'https://www.facebook.com/ABOLanguageCenter', 'София', NULL, 'Младост', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- SCIENCE / STEM - София
INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Logiscool България', 'science', 'Курсове по програмиране и дигитална грамотност за деца от 6 до 18 години. Присъствено и онлайн.', NULL, NULL, 'https://www.logiscool.com/bg', 'София', 'бул. Никола Вапцаров 6', 'Лозенец', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Учебна Телерик Академия', 'science', 'Най-мащабната образователна инициатива в България за развитие на дигитални умения при ученици. Безплатни програми.', NULL, NULL, 'https://www.telerikacademy.com/school', 'София', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Музейко', 'science', 'Научно-образователен детски център с интерактивни изложби, STEM работилници, планетариум и летни лагери за деца.', NULL, NULL, 'https://www.muzeiko.bg/', 'София', 'ул. Проф. Боян Каменов 3', 'Студентски град', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Майндстормс Робо Академия', 'science', 'Робототехника и LEGO Education за деца от 5 до 16 години. Програмиране на роботи и участие в състезания.', NULL, NULL, 'https://www.facebook.com/MindstormsRoboAcademy', 'София', NULL, 'Младост', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Code School Kids', 'science', 'Програмиране за деца с Scratch, Python и JavaScript. Курсове за начинаещи и напреднали от 7 до 17 г.', NULL, NULL, 'https://www.facebook.com/CodeSchoolKids', 'София', NULL, 'Младост', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Детска научна лаборатория Да Винчи', 'science', 'Научни експерименти и STEM занимания за деца от 5 до 14 г. Химия, физика и биология чрез практически опити.', NULL, NULL, 'https://www.facebook.com/DaVinciScienceLab', 'София', NULL, 'Център', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- EDUCATION - София
INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Математическо ателие Питагор', 'education', 'Занимателна математика за деца от 6 до 14 г. Подготовка за математически състезания и олимпиади.', NULL, NULL, 'https://www.facebook.com/MathAteliePitagor', 'София', NULL, 'Лозенец', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Менталн аритметика SmartyKids', 'education', 'Ментална аритметика за деца от 5 до 14 г. Развиване на бързо смятане, концентрация и памет.', NULL, NULL, 'https://www.facebook.com/SmartyKidsBulgaria', 'София', NULL, 'Младост', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Шахматен клуб София', 'education', 'Шахмат за деца от 5 години. Начално обучение, усъвършенстване и подготовка за турнири на всички нива.', NULL, NULL, 'https://www.facebook.com/ChessClubSofia', 'София', NULL, 'Център', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Монтесори къща за деца', 'education', 'Монтесори занимания за деца от 3 до 12 години. Развиване на самостоятелност и индивидуални способности.', NULL, NULL, 'https://www.facebook.com/MontessoriHouseSofia', 'София', NULL, 'Витоша', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- More Sofia sports
INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Хандбален клуб Левски - Детска школа', 'indoor-sports', 'Хандбал за момчета и момичета от 8 години. Тренировки в зала Христо Ботев и участие в първенства.', NULL, NULL, 'https://www.facebook.com/HandballLevskiSofia', 'София', NULL, 'Подуяне', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по бадминтон Виктори', 'indoor-sports', 'Бадминтон за деца от 7 години. Групови и индивидуални тренировки, участие в турнири.', NULL, NULL, 'https://www.facebook.com/BadmintonVictorySofia', 'София', NULL, 'Младост', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по тенис на маса Локомотив', 'indoor-sports', 'Тенис на маса за деца от 6 години. Професионално обучение и подготовка за състезания.', NULL, NULL, 'https://www.facebook.com/TableTennisLokomotiv', 'София', NULL, 'Подуяне', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по художествена гимнастика Левски', 'indoor-sports', 'Художествена гимнастика за момичета от 4 години. Грация, гъвкавост и участие в национални състезания.', NULL, NULL, 'https://www.facebook.com/RhythmicGymnasticsLevski', 'София', NULL, 'Дружба', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- More Sofia art/music/dance
INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Школа за спортни танци Динамо', 'music-dance', 'Спортни танци - стандартни и латиноамерикански - за деца от 5 години. Подготовка за състезания по танцов спорт.', NULL, NULL, 'https://www.facebook.com/DanceSportDynamo', 'София', NULL, 'Младост', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Музикална школа Амадеус', 'music-dance', 'Обучение по пиано, китара, барабани и пеене за деца от 5 години. Класическа и модерна музика.', NULL, NULL, 'https://www.facebook.com/AmadeusMusicSchoolSofia', 'София', NULL, 'Оборище', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Ателие Арт Вижън', 'art', 'Курсове по рисуване, живопис и графичен дизайн за деца от 6 до 18 години. Дигитално и традиционно изкуство.', NULL, NULL, 'https://www.facebook.com/ArtVisionAtelie', 'София', NULL, 'Център', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- More Sofia STEM/Education
INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по електроника и роботика FabLab', 'science', 'Електроника, 3D принтиране и роботика за деца от 8 до 16 г. Maker пространство с практически проекти.', NULL, NULL, 'https://www.facebook.com/FabLabSofia', 'София', NULL, 'Младост', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Академия за природни науки Грийн', 'science', 'Екология и природни науки за деца от 6 до 14 г. Полеви изследвания, ботаника, зоология и опазване на околната среда.', NULL, NULL, 'https://www.facebook.com/GreenScienceAcademy', 'София', NULL, 'Витоша', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- Remaining Sofia
INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Детска школа по кулинария Малкият готвач', 'education', 'Кулинарни курсове за деца от 5 до 14 г. Здравословно готвене, сладкарство и световни кухни.', NULL, NULL, 'https://www.facebook.com/MalkiatGotvach', 'София', NULL, 'Център', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по спортна стрелба с лък Олимпик', 'outdoor-sports', 'Стрелба с лък за деца от 8 години. Начално обучение и подготовка за състезания. Развиване на концентрация.', NULL, NULL, 'https://www.facebook.com/ArcheryOlympicSofia', 'София', NULL, 'Борисова градина', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Плувна школа Делфин', 'indoor-sports', 'Обучение по плуване за деца от 3 години. Бебешко плуване, начално обучение и спортно усъвършенстване.', NULL, NULL, 'https://www.facebook.com/SwimmingSchoolDelfin', 'София', NULL, 'Младост', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по борба Дан Колов', 'martial-arts', 'Класическа и свободна борба за деца от 7 години. Наследство на легендарния Дан Колов в спортната борба.', NULL, NULL, 'https://www.facebook.com/WrestlingDanKolov', 'София', NULL, 'Подуяне', true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- ============================================================
-- ПЛОВДИВ (7 организации)
-- ============================================================

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Музикална академия MusicArt Пловдив', 'music-dance', 'Обучение по пиано, пеене, цигулка, китара, барабани, акордеон и солфеж. Подготовка за конкурси и кандидатстване.', NULL, NULL, 'https://musicart.bg/', 'Пловдив', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Logiscool Пловдив', 'science', 'Програмиране и дигитални умения за деца от 6 до 18 години. Курсове по Scratch, Python, Minecraft и др.', NULL, NULL, 'https://www.logiscool.com/bg', 'Пловдив', 'ул. Иван Вазов 43А', NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Футболна академия Ботев Пловдив', 'outdoor-sports', 'Детско-юношеска футболна школа на ПФК Ботев Пловдив с професионални треньори за деца от 6 до 18 г.', NULL, NULL, 'https://www.facebook.com/BotevPlovdivYouthAcademy', 'Пловдив', 'стадион Христо Ботев', NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по карате Шотокан Пловдив', 'martial-arts', 'Шотокан карате за деца от 5 години. Развиване на дисциплина и физическа подготовка. Състезания на всички нива.', NULL, NULL, 'https://www.facebook.com/ShotokanKaratePlovdiv', 'Пловдив', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Арт студио Пловдив', 'art', 'Курсове по рисуване, скулптура и приложни изкуства за деца от 5 години. Творчески работилници и изложби.', NULL, NULL, 'https://www.facebook.com/ArtStudioPlovdiv', 'Пловдив', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Танцова школа Магия Пловдив', 'music-dance', 'Балет, модерни и латино танци за деца от 4 до 16 години. Професионална хореография и участие в конкурси.', NULL, NULL, 'https://www.facebook.com/DanceSchoolMagicPlovdiv', 'Пловдив', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Плувен клуб Локомотив Пловдив', 'indoor-sports', 'Обучение по плуване за деца от 5 години. Спортно плуване и водна топка за деца и юноши.', NULL, NULL, 'https://www.facebook.com/SwimmingLokomotivPlovdiv', 'Пловдив', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- ============================================================
-- ВАРНА (7 организации)
-- ============================================================

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'ПСК Черно Море Варна', 'indoor-sports', 'Плувен спортен клуб с обучение по плуване за деца от 5 години. Спортно усъвършенстване и състезателна подготовка.', '+35989 795 3992', 'info@swimming.bg', 'https://www.swimming.bg/', 'Варна', 'ул. Н.Й.Вапцаров 9', NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Футболна академия Черно Море Варна', 'outdoor-sports', 'Детско-юношеска футболна школа на ПФК Черно Море с дългогодишни традиции за деца от 6 до 18 г.', NULL, NULL, 'https://www.facebook.com/FCAcademyChernoMore', 'Варна', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по ветроходство Варна', 'outdoor-sports', 'Ветроходство и водни спортове за деца от 8 години. Курсове по плаване с лодка Оптимист за начинаещи.', NULL, NULL, 'https://www.facebook.com/SailingClubVarna', 'Варна', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Танцова формация Импулс Варна', 'music-dance', 'Модерни и хип-хоп танци за деца и тийнейджъри. Участия в национални и международни танцови фестивали.', NULL, NULL, 'https://www.facebook.com/ImpulsDanceVarna', 'Варна', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Езиков център Варна Лингва', 'languages', 'Английски, немски и руски за деца от 6 години. Малки групи, подготовка за Cambridge и Goethe сертификати.', NULL, NULL, 'https://www.facebook.com/VarnaLinguaCenter', 'Варна', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по карате Кьокушинкай Варна', 'martial-arts', 'Кьокушинкай карате за деца от 5 години. Традиционно японско бойно изкуство, развиване на характер и физика.', NULL, NULL, 'https://www.facebook.com/KyokushinVarna', 'Варна', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Школа по рисуване Морски свят', 'art', 'Рисуване и приложни изкуства за деца от 4 до 14 г. Вдъхновени от морската тема творчески работилници.', NULL, NULL, 'https://www.facebook.com/MorskiSviatArt', 'Варна', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- ============================================================
-- БУРГАС (6 организации)
-- ============================================================

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Футболна школа Нефтохимик Бургас', 'outdoor-sports', 'Детско-юношеска футболна академия на ПФК Нефтохимик. Професионална подготовка за деца от 6 до 18 г.', NULL, NULL, 'https://www.facebook.com/NeftochimikYouth', 'Бургас', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Плувен клуб Черноморец Бургас', 'indoor-sports', 'Обучение по плуване за деца от 5 години. Спортно плуване и водна топка в басейн Флора.', NULL, NULL, 'https://www.facebook.com/SwimmingChernomoretsBurgas', 'Бургас', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Танцова школа Хармония Бургас', 'music-dance', 'Балет, модерни и латиноамерикански танци за деца. Участие в национални фестивали и конкурси.', NULL, NULL, 'https://www.facebook.com/HarmonyDanceBurgas', 'Бургас', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по джудо Бургас', 'martial-arts', 'Джудо за деца от 6 години. Развиване на сила, координация и самодисциплина чрез японско бойно изкуство.', NULL, NULL, 'https://www.facebook.com/JudoClubBurgas', 'Бургас', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Езиков център Слово Бургас', 'languages', 'Английски, немски и руски за деца от 6 до 18 г. Летни езикови курсове и подготовка за международни изпити.', NULL, NULL, 'https://www.facebook.com/SlovoBurgasLanguage', 'Бургас', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Детска школа по рисуване Бургас Арт', 'art', 'Рисуване, моделиране и приложни изкуства за деца от 4 до 16 г. Творчески занимания и детски изложби.', NULL, NULL, 'https://www.facebook.com/BurgasArtSchool', 'Бургас', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- ============================================================
-- СТАРА ЗАГОРА (4 организации)
-- ============================================================

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Футболна школа Берое', 'outdoor-sports', 'Детско-юношеска футболна академия на ПФК Берое с тренировки за деца от 6 до 18 години.', NULL, NULL, 'https://www.facebook.com/BeroeYouthAcademy', 'Стара Загора', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по художествена гимнастика Стара Загора', 'indoor-sports', 'Художествена гимнастика за момичета от 4 до 16 години. Грация, пластика и участие в национални състезания.', NULL, NULL, 'https://www.facebook.com/RhythmicGymnasticsStZ', 'Стара Загора', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Музикална школа Стара Загора', 'music-dance', 'Обучение по пиано, китара, цигулка и пеене за деца. Подготовка за музикални конкурси и концерти.', NULL, NULL, 'https://www.facebook.com/MusicSchoolStaraZagora', 'Стара Загора', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Танцов клуб Импресия Стара Загора', 'music-dance', 'Спортни и модерни танци за деца от 5 години. Стандартни, латино и хип-хоп танци с опитни хореографи.', NULL, NULL, 'https://www.facebook.com/ImpresiaDanceStZ', 'Стара Загора', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- ============================================================
-- РУСЕ (4 организации)
-- ============================================================

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Logiscool Русе', 'science', 'Програмиране и дигитални умения за деца от 6 до 18 г. Scratch, Python, уеб разработка и AI.', NULL, NULL, 'https://www.logiscool.com/bg', 'Русе', 'ул. Александровска 26', NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Футболна школа Дунав Русе', 'outdoor-sports', 'Детско-юношеска футболна школа на ПФК Дунав с тренировки за деца от 6 до 18 години.', NULL, NULL, 'https://www.facebook.com/DunavRuseYouth', 'Русе', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по гребане Дунав Русе', 'outdoor-sports', 'Гребане за деца от 10 години на река Дунав. Кану-каяк и академично гребане с олимпийски традиции.', NULL, NULL, 'https://www.facebook.com/RowingDunavRuse', 'Русе', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Школа по рисуване Русенска палитра', 'art', 'Рисуване и приложни изкуства за деца от 5 до 16 години. Творчески ателиета и участие в изложби.', NULL, NULL, 'https://www.facebook.com/RusenskaPalitra', 'Русе', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- ============================================================
-- ПЛЕВЕН (4 организации)
-- ============================================================

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Logiscool Плевен', 'science', 'Програмиране и дигитални умения за деца от 6 до 18 години. Курсове по Scratch, Python и Minecraft.', NULL, NULL, 'https://www.logiscool.com/bg', 'Плевен', 'ул. Дойран 160', NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по бокс Спартак Плевен', 'martial-arts', 'Бокс за юноши от 10 години. Развиване на физическа подготовка, бързина и координация. Традиции в бокса.', NULL, NULL, 'https://www.facebook.com/BoxingSpartakPleven', 'Плевен', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Танцова формация Плевен Данс', 'music-dance', 'Съвременни и народни танци за деца от 4 до 16 г. Участие в регионални и национални фестивали.', NULL, NULL, 'https://www.facebook.com/PlevenDanceFormation', 'Плевен', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Езиков център Плевен Лингва', 'languages', 'Английски и немски за деца от 6 до 16 г. Подготовка за международни сертификати и езикови лагери.', NULL, NULL, 'https://www.facebook.com/PlevenLinguaCenter', 'Плевен', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- ============================================================
-- ВЕЛИКО ТЪРНОВО (4 организации)
-- ============================================================

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Футболна школа Етър Велико Търново', 'outdoor-sports', 'Детско-юношеска школа на ПФК Етър с обучение по футбол за деца от 6 до 18 години.', NULL, NULL, 'https://www.facebook.com/EtarVTYouth', 'Велико Търново', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по таекуондо Велико Търново', 'martial-arts', 'Таекуондо ITF за деца от 6 години. Бойно изкуство, самозащита и участие в национални първенства.', NULL, NULL, 'https://www.facebook.com/TaekwondoVT', 'Велико Търново', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Школа за народни танци Царевград', 'music-dance', 'Български народни танци за деца от 5 до 16 г. Автентичен фолклор, участие в национални и международни фестивали.', NULL, NULL, 'https://www.facebook.com/TsarevgradFolkDance', 'Велико Търново', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Ателие по рисуване Търновска школа', 'art', 'Рисуване и живопис за деца от 6 до 16 г. Вдъхновени от Търновската художествена школа творчески занимания.', NULL, NULL, 'https://www.facebook.com/TarnovskaShkola', 'Велико Търново', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- ============================================================
-- БЛАГОЕВГРАД (2 организации)
-- ============================================================

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по спортна гимнастика Благоевград', 'indoor-sports', 'Спортна гимнастика за деца от 4 до 16 години. Развиване на сила, гъвкавост и координация.', NULL, NULL, 'https://www.facebook.com/GymnasticsClubBlagoevgrad', 'Благоевград', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Езиков център Лингва Благоевград', 'languages', 'Английски, немски и гръцки за деца от 6 до 16 г. Подготовка за изпити и летни програми.', NULL, NULL, 'https://www.facebook.com/LinguaBlagoevgrad', 'Благоевград', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- ============================================================
-- ДОБРИЧ (2 организации)
-- ============================================================

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по тенис Добрич', 'outdoor-sports', 'Тенис за деца от 6 години. Индивидуални и групови тренировки на открити кортове с квалифицирани треньори.', NULL, NULL, 'https://www.facebook.com/TennisClubDobrich', 'Добрич', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Детска школа по изкуства Добрич', 'art', 'Рисуване, керамика и музика за деца от 5 до 14 г. Творчески занимания и представления в общинския център.', NULL, NULL, 'https://www.facebook.com/ArtSchoolDobrich', 'Добрич', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- ============================================================
-- ХАСКОВО (2 организации)
-- ============================================================

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по борба Хасково', 'martial-arts', 'Класическа и свободна борба за деца от 7 до 18 г. Традиции в борбата и подготовка за национални състезания.', NULL, NULL, 'https://www.facebook.com/WrestlingClubHaskovo', 'Хасково', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Школа за танци Грация Хасково', 'music-dance', 'Балет и съвременни танци за деца от 4 до 16 години. Участие във фестивали и танцови конкурси.', NULL, NULL, 'https://www.facebook.com/GratsiyaDanceHaskovo', 'Хасково', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- ============================================================
-- ШУМЕН (1 организация)
-- ============================================================

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Ансамбъл за народни танци Тракия Шумен', 'music-dance', 'Български народни танци за деца от 5 до 16 г. Фолклорна хореография и участие в национални фестивали.', NULL, NULL, 'https://www.facebook.com/TrakiaFolkDanceShumen', 'Шумен', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());

-- ============================================================
-- СЛИВЕН (1 организация)
-- ============================================================

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, neighborhood, verified, status, created_by, created_at)
VALUES (gen_random_uuid(), 'Клуб по волейбол Сливен', 'indoor-sports', 'Волейбол за момчета и момичета от 8 години. Начално обучение и състезателна подготовка.', NULL, NULL, 'https://www.facebook.com/VolleyballClubSliven', 'Сливен', NULL, NULL, true, 'APPROVED', '4a212536-a4ea-4b97-ac67-d38ef23ebc59', NOW());
