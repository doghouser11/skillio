-- CLEANUP: Изтриване на 14 фейк организации
-- Дата: 2026-03-13
-- Верифицирано чрез уеб търсения — тези НЕ съществуват

-- Варна фейк
DELETE FROM schools WHERE id = '627f2976-b278-47cf-bcd6-e9e1f06d4fc6'; -- British School of Languages Varna (bslschool.com не съществува)
DELETE FROM schools WHERE id = '2b8f0228-9e8c-462b-b2ea-57c69560bb0f'; -- Varna Tennis Club (varna-tennis.bg не съществува)
DELETE FROM schools WHERE id = '66c0d8b2-b27e-4bbd-bdad-bad0dfc047a9'; -- Varna Karate Kyokushin Club (varna-karate.bg не съществува)

-- Бургас фейк
DELETE FROM schools WHERE id = '0f753c9a-9438-420c-8483-163b4b3b4280'; -- Children Dance School Zelenika (няма резултати)
DELETE FROM schools WHERE id = 'c0dfc851-8895-471b-a8b0-24f0adfca00e'; -- Coding Kids Burgas (няма резултати)
DELETE FROM schools WHERE id = '5f6b2690-cd4f-4cf0-b75e-42b4c2f577ae'; -- Art School Burgas (artschool-bs.bg не съществува)
DELETE FROM schools WHERE id = '4777d0ba-6887-454c-96b9-1e9010832d6c'; -- Language Centre Burgas (langcentre-bs.bg не съществува)
DELETE FROM schools WHERE id = 'ddac8b93-2708-4a7b-956b-6e9ba3392ca2'; -- Burgas Tennis Club (burgas-tennis.bg не съществува)
DELETE FROM schools WHERE id = '6dda8bc1-36c4-49e1-ad8a-ce519e1d4325'; -- Burgas Karate Club (burgas-karate.bg не съществува)

-- София фейк
DELETE FROM schools WHERE id = '448b8179-9ce2-4116-9158-a5e1689be89b'; -- Софийска художествена школа (няма сайт, няма резултати)
DELETE FROM schools WHERE id = '85c9c8b4-6b40-4eb6-a5cc-701ee7b3df30'; -- Art Center Sofia Kids (няма сайт, generic name)
DELETE FROM schools WHERE id = 'df093fe6-bdd8-492a-bb94-3b9a4cfed036'; -- English Academy Sofia (няма сайт, generic name)
DELETE FROM schools WHERE id = '00c6f0c0-d0b3-4271-8dee-b4a7485b20f6'; -- Coding Kids Sofia (няма сайт, generic name)
DELETE FROM schools WHERE id = '2f91fc5e-ae96-4f2d-9164-958632891220'; -- Karate Club Shoto Vitosa (няма резултати)
DELETE FROM schools WHERE id = '3ed63e16-9445-46f8-bc11-6a7d034a126a'; -- Pulse Fitness Kids Academy (pulsefitness.bg не съществува)

-- FIX: Dance Station Varna → всъщност е в София (НДК), не Варна
UPDATE schools SET city = 'София', address = 'НДК', neighborhood = 'Център'
WHERE id = '35c0bbcc-68ed-4954-ada6-af759f1b32a3';

-- FIX: Махаме НСА Тенис Академия (университет, не детска академия)
DELETE FROM schools WHERE id = '45b2e951-8cbf-402d-a327-72e7630cf63d';

-- FIX: Махаме Тенис клуб Левски (неясно дали съществува)
DELETE FROM schools WHERE id = 'b4bd2df7-9279-4c74-90b0-c538a50036c6';

-- ОБЩО: 17 изтрити, 1 коригирана
