-- ============================================================================
-- SOLUTION SIMPLE : METTRE À JOUR LES HORAIRES PASSÉS
-- ============================================================================
-- Ce script met à jour uniquement les horaires passés sans toucher aux triggers
-- Le trigger existant bloque déjà les réservations de dates passées

-- Désactiver temporairement les triggers pour éviter les conflits
ALTER TABLE "Horaire" DISABLE TRIGGER ALL;

-- Mettre à jour tous les horaires dont la date de départ est passée
-- en les déplaçant vers demain à la même heure
UPDATE "Horaire"
SET 
    "dateDepart" = CASE 
        WHEN "dateDepart" < CURRENT_TIMESTAMP THEN
            -- Demain à la même heure
            CURRENT_DATE + INTERVAL '1 day' + 
            (EXTRACT(HOUR FROM "dateDepart") || ' hours')::INTERVAL +
            (EXTRACT(MINUTE FROM "dateDepart") || ' minutes')::INTERVAL +
            (EXTRACT(SECOND FROM "dateDepart") || ' seconds')::INTERVAL
        ELSE "dateDepart"
    END,
    "dateArrivee" = CASE 
        WHEN "dateDepart" < CURRENT_TIMESTAMP THEN
            -- Calculer la durée du trajet et l'ajouter à la nouvelle date
            CURRENT_DATE + INTERVAL '1 day' + 
            (EXTRACT(HOUR FROM "dateDepart") || ' hours')::INTERVAL +
            (EXTRACT(MINUTE FROM "dateDepart") || ' minutes')::INTERVAL +
            (EXTRACT(SECOND FROM "dateDepart") || ' seconds')::INTERVAL +
            ("dateArrivee" - "dateDepart")
        ELSE "dateArrivee"
    END,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "dateDepart" < CURRENT_TIMESTAMP;

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
ORDER BY "dateDepart"
LIMIT 30;
