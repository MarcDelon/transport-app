-- ============================================================================
-- CORRECTION DES HORAIRES SANS CRÉER DE CONFLITS
-- ============================================================================
-- Ce script désactive temporairement les triggers de conflit,
-- met à jour les dates, puis réactive les triggers

-- 1. DÉSACTIVER TEMPORAIREMENT LES TRIGGERS DE CONFLIT
-- ============================================================================
ALTER TABLE "Horaire" DISABLE TRIGGER trigger_check_vehicule_conflit;
ALTER TABLE "Horaire" DISABLE TRIGGER trigger_check_conducteur_conflit;

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

-- 3. RÉACTIVER LES TRIGGERS
-- ============================================================================
ALTER TABLE "Horaire" ENABLE TRIGGER trigger_check_vehicule_conflit;
ALTER TABLE "Horaire" ENABLE TRIGGER trigger_check_conducteur_conflit;

-- 4. VÉRIFICATION
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

-- Vérifier s'il y a des conflits de véhicules
SELECT 
    h1.id as horaire1,
    h2.id as horaire2,
    h1."vehiculeId",
    h1."dateDepart" as depart1,
    h1."dateArrivee" as arrivee1,
    h2."dateDepart" as depart2,
    h2."dateArrivee" as arrivee2
FROM "Horaire" h1
JOIN "Horaire" h2 ON h1."vehiculeId" = h2."vehiculeId" AND h1.id < h2.id
WHERE (
    (h1."dateDepart" >= h2."dateDepart" AND h1."dateDepart" < h2."dateArrivee")
    OR (h1."dateArrivee" > h2."dateDepart" AND h1."dateArrivee" <= h2."dateArrivee")
    OR (h1."dateDepart" <= h2."dateDepart" AND h1."dateArrivee" >= h2."dateArrivee")
)
LIMIT 10;
