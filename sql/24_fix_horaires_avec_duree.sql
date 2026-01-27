-- ============================================================================
-- CORRECTION DES HORAIRES AVEC CALCUL CORRECT DE LA DURÉE
-- ============================================================================
-- Ce script désactive les triggers, met à jour les dates en calculant
-- correctement la dateArrivee basée sur la durée du trajet

-- 1. DÉSACTIVER TEMPORAIREMENT LES TRIGGERS
-- ============================================================================
ALTER TABLE "Horaire" DISABLE TRIGGER ALL;

-- 2. METTRE À JOUR LES HORAIRES PASSÉS AVEC CALCUL CORRECT
-- ============================================================================
-- Mettre à jour en calculant la dateArrivee basée sur la durée du trajet
UPDATE "Horaire" h
SET 
    "dateDepart" = CURRENT_DATE + INTERVAL '1 day' + 
                   (EXTRACT(HOUR FROM h."dateDepart") || ' hours')::INTERVAL +
                   (EXTRACT(MINUTE FROM h."dateDepart") || ' minutes')::INTERVAL,
    "dateArrivee" = CURRENT_DATE + INTERVAL '1 day' + 
                    (EXTRACT(HOUR FROM h."dateDepart") || ' hours')::INTERVAL +
                    (EXTRACT(MINUTE FROM h."dateDepart") || ' minutes')::INTERVAL +
                    (t."dureeEstimee" || ' minutes')::INTERVAL,
    "updatedAt" = CURRENT_TIMESTAMP
FROM "Trajet" t
WHERE h."trajetId" = t.id
AND h."dateDepart" < CURRENT_TIMESTAMP;

-- 3. RÉACTIVER TOUS LES TRIGGERS
-- ============================================================================
ALTER TABLE "Horaire" ENABLE TRIGGER ALL;

-- 4. VÉRIFICATION
-- ============================================================================
-- Vérifier qu'il n'y a plus d'horaires passés
SELECT 
    COUNT(*) as "total_horaires",
    COUNT(CASE WHEN "dateDepart" > CURRENT_TIMESTAMP THEN 1 END) as "horaires_futurs",
    COUNT(CASE WHEN "dateDepart" <= CURRENT_TIMESTAMP THEN 1 END) as "horaires_passes"
FROM "Horaire";

-- Vérifier que toutes les dates sont cohérentes
SELECT 
    id,
    "dateDepart",
    "dateArrivee",
    "dateArrivee" > "dateDepart" as "dates_coherentes",
    EXTRACT(EPOCH FROM ("dateArrivee" - "dateDepart"))/60 as "duree_minutes"
FROM "Horaire"
WHERE "dateArrivee" <= "dateDepart"
LIMIT 10;

-- Afficher quelques horaires mis à jour
SELECT 
    h.id,
    t."villeDepart",
    t."villeArrivee",
    h."dateDepart",
    h."dateArrivee",
    EXTRACT(EPOCH FROM (h."dateArrivee" - h."dateDepart"))/60 as "duree_minutes",
    t."dureeEstimee" as "duree_prevue"
FROM "Horaire" h
JOIN "Trajet" t ON h."trajetId" = t.id
ORDER BY h."dateDepart"
LIMIT 10;
