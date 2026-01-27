-- ============================================================================
-- CORRECTION DES DERNIERS HORAIRES PASSÉS AVEC RÉSERVATIONS
-- ============================================================================
-- Ce script met à jour les horaires passés qui ont des réservations actives
-- en désactivant temporairement les triggers pour éviter les conflits

-- Désactiver TOUS les triggers pour éviter les conflits
ALTER TABLE "Horaire" DISABLE TRIGGER ALL;

-- Mettre à jour les horaires passés spécifiques
UPDATE "Horaire"
SET 
    "dateDepart" = CURRENT_DATE + INTERVAL '1 day' + 
        (EXTRACT(HOUR FROM "dateDepart") || ' hours')::INTERVAL +
        (EXTRACT(MINUTE FROM "dateDepart") || ' minutes')::INTERVAL +
        (EXTRACT(SECOND FROM "dateDepart") || ' seconds')::INTERVAL,
    "dateArrivee" = CURRENT_DATE + INTERVAL '1 day' + 
        (EXTRACT(HOUR FROM "dateDepart") || ' hours')::INTERVAL +
        (EXTRACT(MINUTE FROM "dateDepart") || ' minutes')::INTERVAL +
        (EXTRACT(SECOND FROM "dateDepart") || ' seconds')::INTERVAL +
        ("dateArrivee" - "dateDepart"),
    "updatedAt" = CURRENT_TIMESTAMP
WHERE id IN (
    'horaire004',
    'horaire007',
    'horaire010',
    'horaire012',
    'horaire014',
    'horaire016',
    'horaire018',
    'horaire_gen_169',
    'horaire_gen_161',
    'horaire_gen_641',
    'horaire_gen_801'
);

-- Réactiver les triggers
ALTER TABLE "Horaire" ENABLE TRIGGER ALL;

-- Vérifier les horaires mis à jour
SELECT 
    id,
    "dateDepart",
    "dateArrivee",
    CASE 
        WHEN "dateDepart" < CURRENT_TIMESTAMP THEN '❌ PASSÉ'
        WHEN "dateDepart" < CURRENT_TIMESTAMP + INTERVAL '1 hour' THEN '⚠️ DANS MOINS D''1H'
        ELSE '✅ FUTUR'
    END as statut,
    ROUND(EXTRACT(EPOCH FROM ("dateDepart" - CURRENT_TIMESTAMP))/3600, 1) as heures_avant_depart
FROM "Horaire"
WHERE id IN (
    'horaire004',
    'horaire007',
    'horaire010',
    'horaire012',
    'horaire014',
    'horaire016',
    'horaire018',
    'horaire_gen_169',
    'horaire_gen_161',
    'horaire_gen_641',
    'horaire_gen_801'
)
ORDER BY "dateDepart";

-- Vérifier qu'il ne reste plus d'horaires passés
SELECT COUNT(*) as "Horaires passés restants"
FROM "Horaire"
WHERE "dateDepart" < CURRENT_TIMESTAMP;
