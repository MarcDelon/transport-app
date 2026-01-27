-- ============================================================================
-- CORRECTION DES DATES D'HORAIRES POUR LES TESTS
-- ============================================================================
-- Ce script met à jour les horaires passés pour qu'ils soient dans le futur
-- Utile pour les environnements de développement/test

-- Option 1: Désactiver temporairement le trigger (pour dev/test uniquement)
-- ============================================================================

-- Désactiver le trigger de vérification de date passée
ALTER TABLE "Reservation" DISABLE TRIGGER trigger_check_reservation_date_passee;

-- Pour réactiver plus tard (en production):
-- ALTER TABLE "Reservation" ENABLE TRIGGER trigger_check_reservation_date_passee;

-- Option 2: Mettre à jour les dates des horaires passés
-- ============================================================================

-- Mettre à jour tous les horaires dont la date de départ est passée
-- en les décalant vers le futur (aujourd'hui + 1 jour minimum)

UPDATE "Horaire"
SET 
    "dateDepart" = CASE 
        WHEN "dateDepart" < CURRENT_TIMESTAMP THEN
            CURRENT_TIMESTAMP + INTERVAL '1 day' + 
            (EXTRACT(HOUR FROM "dateDepart") || ' hours')::INTERVAL +
            (EXTRACT(MINUTE FROM "dateDepart") || ' minutes')::INTERVAL
        ELSE "dateDepart"
    END,
    "dateArrivee" = CASE 
        WHEN "dateDepart" < CURRENT_TIMESTAMP THEN
            CURRENT_TIMESTAMP + INTERVAL '1 day' + 
            (EXTRACT(HOUR FROM "dateDepart") || ' hours')::INTERVAL +
            (EXTRACT(MINUTE FROM "dateDepart") || ' minutes')::INTERVAL +
            (SELECT "dureeEstimee" || ' minutes' FROM "Trajet" WHERE id = "Horaire"."trajetId")::INTERVAL
        ELSE "dateArrivee"
    END,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "dateDepart" < CURRENT_TIMESTAMP;

-- Vérifier les horaires mis à jour
SELECT 
    id,
    "dateDepart",
    "dateArrivee",
    "dateDepart" > CURRENT_TIMESTAMP as "est_futur"
FROM "Horaire"
ORDER BY "dateDepart"
LIMIT 10;

-- ============================================================================
-- ALTERNATIVE: Modifier le trigger pour être plus flexible en dev
-- ============================================================================

-- Remplacer le trigger pour ajouter une marge de 1 heure (au lieu de bloquer immédiatement)
CREATE OR REPLACE FUNCTION check_reservation_date_passee()
RETURNS TRIGGER AS $$
DECLARE
    date_depart TIMESTAMP;
BEGIN
    SELECT "dateDepart" INTO date_depart
    FROM "Horaire"
    WHERE id = NEW."horaireId";

    -- Autoriser les réservations jusqu'à 1 heure avant le départ
    -- (au lieu de bloquer dès que la date est passée)
    IF date_depart < (CURRENT_TIMESTAMP - INTERVAL '1 hour') THEN
        RAISE EXCEPTION 'Impossible de réserver un trajet dont le départ est déjà passé';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SCRIPT DE GÉNÉRATION D'HORAIRES FUTURS POUR LES TESTS
-- ============================================================================

-- Créer des horaires de test pour les 7 prochains jours
DO $$
DECLARE
    trajet_record RECORD;
    vehicule_id TEXT;
    conducteur_id TEXT;
    jour INTEGER;
    heure INTEGER;
    horaire_id TEXT;
BEGIN
    -- Récupérer un véhicule et un conducteur disponibles
    SELECT id INTO vehicule_id FROM "Vehicule" WHERE statut = 'DISPONIBLE' LIMIT 1;
    SELECT id INTO conducteur_id FROM "Conducteur" WHERE statut = 'DISPONIBLE' LIMIT 1;
    
    -- Pour chaque trajet actif
    FOR trajet_record IN 
        SELECT * FROM "Trajet" WHERE statut = 'ACTIF' LIMIT 5
    LOOP
        -- Créer des horaires pour les 7 prochains jours
        FOR jour IN 1..7 LOOP
            -- Créer 2 horaires par jour (matin et après-midi)
            FOR heure IN 1..2 LOOP
                horaire_id := 'horaire_test_' || trajet_record.id || '_j' || jour || '_h' || heure;
                
                -- Vérifier si l'horaire n'existe pas déjà
                IF NOT EXISTS (SELECT 1 FROM "Horaire" WHERE id = horaire_id) THEN
                    INSERT INTO "Horaire" (
                        id,
                        "trajetId",
                        "vehiculeId",
                        "conducteurId",
                        "dateDepart",
                        "dateArrivee",
                        "createdAt",
                        "updatedAt"
                    ) VALUES (
                        horaire_id,
                        trajet_record.id,
                        vehicule_id,
                        conducteur_id,
                        CURRENT_TIMESTAMP + (jour || ' days')::INTERVAL + 
                            CASE WHEN heure = 1 THEN INTERVAL '8 hours' ELSE INTERVAL '14 hours' END,
                        CURRENT_TIMESTAMP + (jour || ' days')::INTERVAL + 
                            CASE WHEN heure = 1 THEN INTERVAL '8 hours' ELSE INTERVAL '14 hours' END +
                            (trajet_record."dureeEstimee" || ' minutes')::INTERVAL,
                        CURRENT_TIMESTAMP,
                        CURRENT_TIMESTAMP
                    );
                END IF;
            END LOOP;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Horaires de test créés avec succès';
END $$;

-- Vérifier les nouveaux horaires
SELECT 
    h.id,
    t."villeDepart",
    t."villeArrivee",
    h."dateDepart",
    h."dateDepart" > CURRENT_TIMESTAMP as "est_futur"
FROM "Horaire" h
JOIN "Trajet" t ON h."trajetId" = t.id
WHERE h.id LIKE 'horaire_test_%'
ORDER BY h."dateDepart"
LIMIT 20;
