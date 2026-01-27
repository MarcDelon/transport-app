-- ============================================================================
-- CORRECTION DES 11 DERNIERS HORAIRES PASSÉS
-- ============================================================================
-- Solution sans modification de triggers (compatible avec les permissions Supabase)

-- Mettre à jour chaque horaire individuellement pour éviter les conflits
-- Horaire 1 - Jour 5
UPDATE "Horaire"
SET 
    "dateDepart" = CURRENT_DATE + INTERVAL '5 days' + TIME '08:00:00',
    "dateArrivee" = CURRENT_DATE + INTERVAL '5 days' + TIME '11:00:00',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'horaire004';

-- Horaire 2 - Jour 6
UPDATE "Horaire"
SET 
    "dateDepart" = CURRENT_DATE + INTERVAL '6 days' + TIME '08:00:00',
    "dateArrivee" = CURRENT_DATE + INTERVAL '6 days' + TIME '11:00:00',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'horaire007';

-- Horaire 3 - Jour 7
UPDATE "Horaire"
SET 
    "dateDepart" = CURRENT_DATE + INTERVAL '7 days' + TIME '08:00:00',
    "dateArrivee" = CURRENT_DATE + INTERVAL '7 days' + TIME '11:00:00',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'horaire010';

-- Horaire 4 - Jour 8
UPDATE "Horaire"
SET 
    "dateDepart" = CURRENT_DATE + INTERVAL '8 days' + TIME '08:00:00',
    "dateArrivee" = CURRENT_DATE + INTERVAL '8 days' + TIME '11:00:00',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'horaire012';

-- Horaire 5 - Jour 9
UPDATE "Horaire"
SET 
    "dateDepart" = CURRENT_DATE + INTERVAL '9 days' + TIME '08:00:00',
    "dateArrivee" = CURRENT_DATE + INTERVAL '9 days' + TIME '11:00:00',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'horaire014';

-- Horaire 6 - Jour 10
UPDATE "Horaire"
SET 
    "dateDepart" = CURRENT_DATE + INTERVAL '10 days' + TIME '08:00:00',
    "dateArrivee" = CURRENT_DATE + INTERVAL '10 days' + TIME '11:00:00',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'horaire016';

-- Horaire 7 - Jour 11
UPDATE "Horaire"
SET 
    "dateDepart" = CURRENT_DATE + INTERVAL '11 days' + TIME '08:00:00',
    "dateArrivee" = CURRENT_DATE + INTERVAL '11 days' + TIME '11:00:00',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'horaire018';

-- Horaire 8 - Jour 12
UPDATE "Horaire"
SET 
    "dateDepart" = CURRENT_DATE + INTERVAL '12 days' + TIME '08:00:00',
    "dateArrivee" = CURRENT_DATE + INTERVAL '12 days' + TIME '11:00:00',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'horaire_gen_169';

-- Horaire 9 - Jour 13
UPDATE "Horaire"
SET 
    "dateDepart" = CURRENT_DATE + INTERVAL '13 days' + TIME '08:00:00',
    "dateArrivee" = CURRENT_DATE + INTERVAL '13 days' + TIME '11:00:00',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'horaire_gen_161';

-- Horaire 10 - Jour 14
UPDATE "Horaire"
SET 
    "dateDepart" = CURRENT_DATE + INTERVAL '14 days' + TIME '08:00:00',
    "dateArrivee" = CURRENT_DATE + INTERVAL '14 days' + TIME '11:00:00',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'horaire_gen_641';

-- Horaire 11 - Jour 15
UPDATE "Horaire"
SET 
    "dateDepart" = CURRENT_DATE + INTERVAL '15 days' + TIME '08:00:00',
    "dateArrivee" = CURRENT_DATE + INTERVAL '15 days' + TIME '11:00:00',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'horaire_gen_801';

-- Vérification finale
SELECT 
    id,
    "dateDepart",
    "dateArrivee",
    CASE 
        WHEN "dateDepart" < CURRENT_TIMESTAMP THEN '❌ PASSÉ'
        ELSE '✅ FUTUR'
    END as statut
FROM "Horaire"
WHERE id IN (
    'horaire004', 'horaire007', 'horaire010', 'horaire012', 'horaire014',
    'horaire016', 'horaire018', 'horaire_gen_169', 'horaire_gen_161',
    'horaire_gen_641', 'horaire_gen_801'
)
ORDER BY "dateDepart";

-- Compter les horaires passés restants
SELECT 
    COUNT(*) as "Total horaires passés"
FROM "Horaire"
WHERE "dateDepart" < CURRENT_TIMESTAMP;
