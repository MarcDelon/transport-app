-- ============================================================================
-- CORRECTION DES HORAIRES PASSÉS
-- ============================================================================
-- Ce script met à jour tous les horaires dont la date de départ est passée
-- pour les déplacer dans le futur

-- Mettre à jour tous les horaires passés
UPDATE "Horaire"
SET 
    "dateDepart" = CASE 
        WHEN "dateDepart" < CURRENT_TIMESTAMP THEN
            CURRENT_TIMESTAMP + INTERVAL '2 hours' + 
            (EXTRACT(HOUR FROM "dateDepart") || ' hours')::INTERVAL +
            (EXTRACT(MINUTE FROM "dateDepart") || ' minutes')::INTERVAL
        ELSE "dateDepart"
    END,
    "dateArrivee" = CASE 
        WHEN "dateDepart" < CURRENT_TIMESTAMP THEN
            CURRENT_TIMESTAMP + INTERVAL '2 hours' + 
            (EXTRACT(HOUR FROM "dateDepart") || ' hours')::INTERVAL +
            (EXTRACT(MINUTE FROM "dateDepart") || ' minutes')::INTERVAL +
            ("dateArrivee" - "dateDepart")
        ELSE "dateArrivee"
    END,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "dateDepart" < CURRENT_TIMESTAMP;

-- Vérifier les horaires mis à jour
SELECT 
    id,
    "dateDepart",
    "dateArrivee",
    "dateDepart" > CURRENT_TIMESTAMP as "est_futur",
    EXTRACT(EPOCH FROM ("dateDepart" - CURRENT_TIMESTAMP))/3600 as "heures_avant_depart"
FROM "Horaire"
ORDER BY "dateDepart"
LIMIT 20;
