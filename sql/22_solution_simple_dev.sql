-- ============================================================================
-- SOLUTION SIMPLE POUR L'ENVIRONNEMENT DE DÉVELOPPEMENT
-- ============================================================================
-- Ce script met simplement à jour les horaires passés vers le futur
-- Sans dépendre de l'existence du trigger

-- METTRE À JOUR LES HORAIRES PASSÉS
-- ============================================================================
-- Décaler tous les horaires passés vers le futur (demain à la même heure)
UPDATE "Horaire"
SET 
    "dateDepart" = CURRENT_DATE + INTERVAL '1 day' + 
                   (EXTRACT(HOUR FROM "dateDepart") || ' hours')::INTERVAL +
                   (EXTRACT(MINUTE FROM "dateDepart") || ' minutes')::INTERVAL,
    "dateArrivee" = CURRENT_DATE + INTERVAL '1 day' + 
                    (EXTRACT(HOUR FROM "dateArrivee") || ' hours')::INTERVAL +
                    (EXTRACT(MINUTE FROM "dateArrivee") || ' minutes')::INTERVAL,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "dateDepart" < CURRENT_TIMESTAMP;

-- VÉRIFICATION
-- ============================================================================
SELECT 
    COUNT(*) as "total_horaires",
    COUNT(CASE WHEN "dateDepart" > CURRENT_TIMESTAMP THEN 1 END) as "horaires_futurs",
    COUNT(CASE WHEN "dateDepart" <= CURRENT_TIMESTAMP THEN 1 END) as "horaires_passes"
FROM "Horaire";

-- Afficher les horaires mis à jour
SELECT 
    id,
    "dateDepart",
    "dateArrivee",
    "dateDepart" > CURRENT_TIMESTAMP as "est_futur"
FROM "Horaire"
ORDER BY "dateDepart"
LIMIT 10;
