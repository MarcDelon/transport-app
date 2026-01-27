-- ============================================================================
-- CORRECTION FINALE DES HORAIRES
-- ============================================================================
-- Ce script désactive uniquement les triggers personnalisés (pas les triggers système)

-- 1. DÉSACTIVER LES TRIGGERS PERSONNALISÉS
-- ============================================================================
ALTER TABLE "Horaire" DISABLE TRIGGER trigger_check_vehicule_disponible;
ALTER TABLE "Horaire" DISABLE TRIGGER trigger_check_vehicule_conflit;
ALTER TABLE "Horaire" DISABLE TRIGGER trigger_check_conducteur_conflit;

-- 2. DÉSACTIVER TEMPORAIREMENT LA CONTRAINTE CHECK
-- ============================================================================
ALTER TABLE "Horaire" DROP CONSTRAINT IF EXISTS "Horaire_dates_coherentes_check";

-- 3. METTRE À JOUR LES HORAIRES PASSÉS
-- ============================================================================
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

-- 4. RÉACTIVER LA CONTRAINTE CHECK
-- ============================================================================
ALTER TABLE "Horaire" ADD CONSTRAINT "Horaire_dates_coherentes_check" 
CHECK ("dateArrivee" > "dateDepart");

-- 5. RÉACTIVER LES TRIGGERS PERSONNALISÉS
-- ============================================================================
ALTER TABLE "Horaire" ENABLE TRIGGER trigger_check_vehicule_disponible;
ALTER TABLE "Horaire" ENABLE TRIGGER trigger_check_vehicule_conflit;
ALTER TABLE "Horaire" ENABLE TRIGGER trigger_check_conducteur_conflit;

-- 6. VÉRIFICATION
-- ============================================================================
-- Compter les horaires
SELECT 
    COUNT(*) as "total_horaires",
    COUNT(CASE WHEN "dateDepart" > CURRENT_TIMESTAMP THEN 1 END) as "horaires_futurs",
    COUNT(CASE WHEN "dateDepart" <= CURRENT_TIMESTAMP THEN 1 END) as "horaires_passes"
FROM "Horaire";

-- Vérifier la cohérence des dates
SELECT 
    COUNT(*) as "horaires_incoherents"
FROM "Horaire"
WHERE "dateArrivee" <= "dateDepart";

-- Afficher quelques horaires
SELECT 
    h.id,
    t."villeDepart",
    t."villeArrivee",
    h."dateDepart",
    h."dateArrivee",
    EXTRACT(EPOCH FROM (h."dateArrivee" - h."dateDepart"))/60 as "duree_minutes"
FROM "Horaire" h
JOIN "Trajet" t ON h."trajetId" = t.id
ORDER BY h."dateDepart"
LIMIT 10;
