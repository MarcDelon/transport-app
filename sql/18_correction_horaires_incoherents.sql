-- ============================================================================
-- CORRECTION DES HORAIRES INCOHÉRENTS
-- À exécuter AVANT le script 16_contraintes_metier.sql
-- ============================================================================

-- ============================================================================
-- 1. IDENTIFIER LES HORAIRES PROBLÉMATIQUES
-- ============================================================================

-- Voir les horaires où dateArrivee <= dateDepart
SELECT 
    h.id,
    h."dateDepart",
    h."dateArrivee",
    t."villeDepart",
    t."villeArrivee",
    t."dureeEstimee",
    EXTRACT(EPOCH FROM (h."dateArrivee" - h."dateDepart"))/60 as duree_reelle_minutes,
    'Date arrivée <= date départ' as probleme
FROM "Horaire" h
JOIN "Trajet" t ON h."trajetId" = t.id
WHERE h."dateArrivee" <= h."dateDepart"
ORDER BY h."dateDepart";

-- ============================================================================
-- 2. CORRIGER LES HORAIRES INCOHÉRENTS
-- ============================================================================

-- Option 1: Recalculer dateArrivee en ajoutant la durée estimée du trajet
UPDATE "Horaire" h
SET "dateArrivee" = h."dateDepart" + (t."dureeEstimee" || ' minutes')::INTERVAL
FROM "Trajet" t
WHERE h."trajetId" = t.id
AND h."dateArrivee" <= h."dateDepart";

-- ============================================================================
-- 3. VÉRIFICATION FINALE
-- ============================================================================

-- Compter les horaires encore problématiques
SELECT COUNT(*) as horaires_incoherents
FROM "Horaire"
WHERE "dateArrivee" <= "dateDepart";

-- Afficher tous les horaires pour vérification
SELECT 
    h.id,
    t."villeDepart" || ' → ' || t."villeArrivee" as trajet,
    h."dateDepart",
    h."dateArrivee",
    EXTRACT(EPOCH FROM (h."dateArrivee" - h."dateDepart"))/60 as duree_minutes
FROM "Horaire" h
JOIN "Trajet" t ON h."trajetId" = t.id
ORDER BY h."dateDepart"
LIMIT 20;

-- Si le compteur est à 0, vous pouvez maintenant exécuter le script 16_contraintes_metier.sql
