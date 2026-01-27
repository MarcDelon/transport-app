-- ============================================================================
-- SOLUTION RAPIDE POUR L'ENVIRONNEMENT DE DÉVELOPPEMENT
-- ============================================================================
-- Ce script désactive temporairement le trigger de vérification de date passée
-- et met à jour les horaires existants pour qu'ils soient dans le futur

-- 1. DÉSACTIVER LE TRIGGER (pour dev/test)
-- ============================================================================
ALTER TABLE "Reservation" DISABLE TRIGGER trigger_check_reservation_date_passee;

-- 2. METTRE À JOUR LES HORAIRES PASSÉS
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

-- 3. VÉRIFICATION
-- ============================================================================
SELECT 
    COUNT(*) as "total_horaires",
    COUNT(CASE WHEN "dateDepart" > CURRENT_TIMESTAMP THEN 1 END) as "horaires_futurs",
    COUNT(CASE WHEN "dateDepart" <= CURRENT_TIMESTAMP THEN 1 END) as "horaires_passes"
FROM "Horaire";

-- Afficher quelques horaires pour vérifier
SELECT 
    id,
    "dateDepart",
    "dateDepart" > CURRENT_TIMESTAMP as "est_futur"
FROM "Horaire"
ORDER BY "dateDepart"
LIMIT 10;

-- ============================================================================
-- POUR RÉACTIVER LE TRIGGER EN PRODUCTION
-- ============================================================================
-- Décommentez cette ligne quand vous déployez en production:
-- ALTER TABLE "Reservation" ENABLE TRIGGER trigger_check_reservation_date_passee;
