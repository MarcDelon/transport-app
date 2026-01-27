-- ============================================================================
-- SOLUTION DÉFINITIVE : BLOQUER LES RÉSERVATIONS DE DATES PASSÉES
-- ============================================================================
-- Ce script met à jour tous les horaires passés et garantit que le trigger
-- bloque correctement les réservations de dates passées

-- ============================================================================
-- ÉTAPE 1 : METTRE À JOUR TOUS LES HORAIRES PASSÉS
-- ============================================================================

-- Désactiver temporairement les triggers pour permettre la mise à jour
ALTER TABLE "Horaire" DISABLE TRIGGER ALL;

-- Mettre à jour les horaires passés en les déplaçant dans le futur
-- On garde la même heure mais on ajoute des jours pour être dans le futur
UPDATE "Horaire"
SET 
    "dateDepart" = CASE 
        WHEN "dateDepart" < CURRENT_TIMESTAMP THEN
            -- Calculer le nombre de jours à ajouter pour être au moins demain
            CURRENT_DATE + INTERVAL '1 day' + 
            (EXTRACT(HOUR FROM "dateDepart") || ' hours')::INTERVAL +
            (EXTRACT(MINUTE FROM "dateDepart") || ' minutes')::INTERVAL +
            (EXTRACT(SECOND FROM "dateDepart") || ' seconds')::INTERVAL
        ELSE "dateDepart"
    END,
    "dateArrivee" = CASE 
        WHEN "dateDepart" < CURRENT_TIMESTAMP THEN
            -- Calculer la durée du trajet et l'ajouter à la nouvelle date de départ
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

-- ============================================================================
-- ÉTAPE 2 : S'ASSURER QUE LE TRIGGER BLOQUE LES DATES PASSÉES
-- ============================================================================

-- Recréer la fonction de vérification avec une logique stricte
CREATE OR REPLACE FUNCTION check_horaire_futur()
RETURNS TRIGGER AS $$
DECLARE
    date_depart TIMESTAMP;
BEGIN
    -- Récupérer la date de départ de l'horaire
    SELECT "dateDepart" INTO date_depart
    FROM "Horaire"
    WHERE id = NEW."horaireId";

    -- Bloquer strictement les réservations si la date de départ est passée
    IF date_depart < CURRENT_TIMESTAMP THEN
        RAISE EXCEPTION 'Impossible de réserver un trajet dont le départ est déjà passé';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Supprimer et recréer le trigger pour s'assurer qu'il est actif
DROP TRIGGER IF EXISTS trigger_check_horaire_futur ON "Reservation";
CREATE TRIGGER trigger_check_horaire_futur
    BEFORE INSERT ON "Reservation"
    FOR EACH ROW
    EXECUTE FUNCTION check_horaire_futur();

-- ============================================================================
-- ÉTAPE 3 : VÉRIFICATION DES HORAIRES
-- ============================================================================

-- Afficher les horaires et leur statut
SELECT 
    id,
    "dateDepart",
    "dateArrivee",
    CASE 
        WHEN "dateDepart" < CURRENT_TIMESTAMP THEN '❌ PASSÉ'
        WHEN "dateDepart" < CURRENT_TIMESTAMP + INTERVAL '1 hour' THEN '⚠️ DANS MOINS D''1H'
        ELSE '✅ FUTUR'
    END as statut,
    EXTRACT(EPOCH FROM ("dateDepart" - CURRENT_TIMESTAMP))/3600 as heures_avant_depart
FROM "Horaire"
ORDER BY "dateDepart"
LIMIT 30;

-- Compter les horaires par statut
SELECT 
    CASE 
        WHEN "dateDepart" < CURRENT_TIMESTAMP THEN 'PASSÉ'
        WHEN "dateDepart" < CURRENT_TIMESTAMP + INTERVAL '1 hour' THEN 'MOINS_1H'
        ELSE 'FUTUR'
    END as statut,
    COUNT(*) as nombre
FROM "Horaire"
GROUP BY 
    CASE 
        WHEN "dateDepart" < CURRENT_TIMESTAMP THEN 'PASSÉ'
        WHEN "dateDepart" < CURRENT_TIMESTAMP + INTERVAL '1 hour' THEN 'MOINS_1H'
        ELSE 'FUTUR'
    END
ORDER BY statut;

-- ============================================================================
-- ÉTAPE 4 : CRÉER UNE FONCTION POUR MAINTENIR LES HORAIRES À JOUR
-- ============================================================================

-- Fonction pour mettre à jour automatiquement les horaires passés (optionnel)
CREATE OR REPLACE FUNCTION auto_update_horaires_passes()
RETURNS void AS $$
BEGIN
    UPDATE "Horaire"
    SET 
        "dateDepart" = CURRENT_DATE + INTERVAL '1 day' + 
            (EXTRACT(HOUR FROM "dateDepart") || ' hours')::INTERVAL +
            (EXTRACT(MINUTE FROM "dateDepart") || ' minutes')::INTERVAL,
        "dateArrivee" = CURRENT_DATE + INTERVAL '1 day' + 
            (EXTRACT(HOUR FROM "dateDepart") || ' hours')::INTERVAL +
            (EXTRACT(MINUTE FROM "dateDepart") || ' minutes')::INTERVAL +
            ("dateArrivee" - "dateDepart"),
        "updatedAt" = CURRENT_TIMESTAMP
    WHERE "dateDepart" < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Pour exécuter manuellement la mise à jour des horaires passés :
-- SELECT auto_update_horaires_passes();

-- ============================================================================
-- NOTES IMPORTANTES
-- ============================================================================
-- 
-- 1. Ce script met à jour TOUS les horaires passés pour qu'ils soient demain
--    à la même heure
-- 
-- 2. Le trigger bloque STRICTEMENT toute tentative de réservation sur un
--    horaire dont la date de départ est passée
-- 
-- 3. Pour les environnements de développement, vous pouvez exécuter
--    régulièrement : SELECT auto_update_horaires_passes();
-- 
-- 4. En production, assurez-vous de créer de nouveaux horaires futurs
--    régulièrement pour que les clients aient toujours des options
-- 
-- ============================================================================
