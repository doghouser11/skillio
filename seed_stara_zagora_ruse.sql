-- Skillio: 20 нови организации — Стара Загора и Русе
-- Paste в Supabase SQL Editor и натисни Run

-- Първо: направи email nullable (ако вече не е)
ALTER TABLE schools ALTER COLUMN email DROP NOT NULL;

INSERT INTO schools (id, name, category, description, phone, email, website, city, address, verified, status, neighborhood, created_by)
VALUES
-- === СТАРА ЗАГОРА (10) ===
(gen_random_uuid(), 'SmartyKids Стара Загора', 'education', 'Образователен център за ментална аритметика и развитие на логическото мислене при деца.', '+359885181801', NULL, 'https://smarty-kids.bg', 'Стара Загора', 'ул. Кольо Ганчев 45', true, 'approved', 'Център', '4a212536-a4ea-4b97-ac67-d38ef23ebc59'),

(gen_random_uuid(), 'Dance Studio Caribe', 'music-dance', 'Танцова школа със специални детски групи по балет и модерни танци.', NULL, NULL, 'https://dscaribe.com', 'Стара Загора', 'гр. Стара Загора', true, 'approved', 'Център', '4a212536-a4ea-4b97-ac67-d38ef23ebc59'),

(gen_random_uuid(), 'Sports Dance Club Zagora Dance', 'music-dance', 'Клуб по модерни и латино танци с групи за деца и начинаещи.', '+359887332416', NULL, NULL, 'Стара Загора', 'бул. Патриарх Евтимий 125', true, 'approved', 'Център', '4a212536-a4ea-4b97-ac67-d38ef23ebc59'),

(gen_random_uuid(), 'Детско-юношеска студия за опера и балет – Държавна опера Стара Загора', 'music-dance', 'Школа за деца по вокално изкуство, балет и сценични изкуства към операта.', '+35942622431', NULL, 'https://operasz.bg', 'Стара Загора', 'бул. Митрополит Методий Кусев 30', true, 'approved', 'Център', '4a212536-a4ea-4b97-ac67-d38ef23ebc59'),

(gen_random_uuid(), 'Академия на успеха', 'education', 'Образователна организация с обучения и развитие на умения за деца и ученици.', NULL, NULL, 'https://asbg.eu', 'Стара Загора', 'ул. Единство 25', true, 'approved', 'Център', '4a212536-a4ea-4b97-ac67-d38ef23ebc59'),

(gen_random_uuid(), 'Zara Kids School', 'languages', 'Частна занималня и езиков център за деца с английски език и творчески занимания.', NULL, NULL, NULL, 'Стара Загора', 'ул. Княз Борис 93', true, 'approved', 'Център', '4a212536-a4ea-4b97-ac67-d38ef23ebc59'),

(gen_random_uuid(), 'Балетна школа Родина', 'music-dance', 'Балетна школа за деца към НЧ „Родина".', '+35942639075', NULL, NULL, 'Стара Загора', 'ул. Св. Княз Борис I 94', true, 'approved', 'Център', '4a212536-a4ea-4b97-ac67-d38ef23ebc59'),

(gen_random_uuid(), 'Детска вокална студия Усмивки', 'music-dance', 'Вокална школа за деца към читалище Родина.', '+359887409675', NULL, NULL, 'Стара Загора', 'ул. Св. Княз Борис I 94', true, 'approved', 'Център', '4a212536-a4ea-4b97-ac67-d38ef23ebc59'),

(gen_random_uuid(), 'Модерен балет Елеганс', 'music-dance', 'Формация по модерен балет за деца и младежи.', '+359889025977', NULL, NULL, 'Стара Загора', 'ул. Св. Княз Борис I 94', true, 'approved', 'Център', '4a212536-a4ea-4b97-ac67-d38ef23ebc59'),

(gen_random_uuid(), 'Детска танцова група Синчец', 'music-dance', 'Детска фолклорна танцова група към читалище Родина.', '+359888001679', NULL, NULL, 'Стара Загора', 'ул. Св. Княз Борис I 94', true, 'approved', 'Център', '4a212536-a4ea-4b97-ac67-d38ef23ebc59'),

-- === РУСЕ (10) ===
(gen_random_uuid(), 'Sport Dance Club Flamingo', 'music-dance', 'Спортен и танцов клуб с детски групи по танци и фитнес.', '+359883456053', NULL, NULL, 'Русе', 'бул. Васил Левски 4', true, 'approved', 'Дружба', '4a212536-a4ea-4b97-ac67-d38ef23ebc59'),

(gen_random_uuid(), 'Academy Kids Champions', 'outdoor-sports', 'Детска спортна академия с функционални тренировки за деца.', '+359884335411', NULL, NULL, 'Русе', 'ул. Околчица 1', true, 'approved', 'Здравец', '4a212536-a4ea-4b97-ac67-d38ef23ebc59'),

(gen_random_uuid(), 'Sports Dance Club Nastroenie', 'music-dance', 'Спортен клуб по танци с дългогодишна история и детски групи.', NULL, NULL, NULL, 'Русе', 'гр. Русе', true, 'approved', 'Център', '4a212536-a4ea-4b97-ac67-d38ef23ebc59'),

(gen_random_uuid(), 'Детска опера Русе', 'music-dance', 'Детска школа по вокално изкуство, танци и театър към Русенската опера.', NULL, NULL, 'https://ruseopera.com', 'Русе', 'гр. Русе', true, 'approved', 'Център', '4a212536-a4ea-4b97-ac67-d38ef23ebc59'),

(gen_random_uuid(), 'Детска футболна школа Дракончета', 'outdoor-sports', 'Футболна школа за деца към клуб Дунав Русе.', NULL, NULL, NULL, 'Русе', 'гр. Русе', true, 'approved', 'Център', '4a212536-a4ea-4b97-ac67-d38ef23ebc59'),

(gen_random_uuid(), 'Общински младежки дом Русе', 'education', 'Център за извънкласни дейности и творчески школи за деца.', NULL, NULL, NULL, 'Русе', 'гр. Русе', true, 'approved', 'Център', '4a212536-a4ea-4b97-ac67-d38ef23ebc59'),

(gen_random_uuid(), 'Клуб по народни танци Северина', 'music-dance', 'Фолклорна школа за деца и младежи.', NULL, NULL, NULL, 'Русе', 'гр. Русе', true, 'approved', 'Център', '4a212536-a4ea-4b97-ac67-d38ef23ebc59'),

(gen_random_uuid(), 'Клуб Динамика Zumba Ruse', 'music-dance', 'Клуб за танцови и фитнес занимания, включително детски групи.', NULL, NULL, NULL, 'Русе', 'гр. Русе', true, 'approved', 'Център', '4a212536-a4ea-4b97-ac67-d38ef23ebc59'),

(gen_random_uuid(), 'Регионална библиотека Любен Каравелов – детски клубове', 'education', 'Библиотека с образователни работилници и клубове за деца.', NULL, NULL, 'https://libruse.bg', 'Русе', 'ул. Дондуков-Корсаков 1', true, 'approved', 'Център', '4a212536-a4ea-4b97-ac67-d38ef23ebc59'),

(gen_random_uuid(), 'Младежки театрален състав Камелия', 'art', 'Театрална школа и творчески работилници за деца.', NULL, NULL, NULL, 'Русе', 'гр. Русе', true, 'approved', 'Център', '4a212536-a4ea-4b97-ac67-d38ef23ebc59');
