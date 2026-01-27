-- ============================================================================
-- CONTRAINTES MÉTIER POUR LA BASE DE DONNÉES NOVA (VERSION SOUPLE)
-- Script SQL à exécuter dans Supabase SQL Editor
-- Cette version n'applique pas les contraintes CHECK sur les données existantes
-- ============================================================================

-- ============================================================================
-- 1. CONTRAINTES SUR LA TABLE TRAJET
-- ============================================================================

-- Distance positive
ALTER TABLE "Trajet" ADD CONSTRAINT "Trajet_distance_positive_check" 
CHECK (distance > 0);

-- Durée estimée positive (en minutes)
ALTER TABLE "Trajet" ADD CONSTRAINT "Trajet_duree_positive_check" 
CHECK ("dureeEstimee" > 0);

-- Tarif de base positif
ALTER TABLE "Trajet" ADD CONSTRAINT "Trajet_tarif_positive_check" 
CHECK ("tarifBase" > 0);

-- Ville de départ différente de ville d'arrivée
ALTER TABLE "Trajet" ADD CONSTRAINT "Trajet_villes_differentes_check" 
CHECK ("villeDepart" <> "villeArrivee");

-- Villes non vides
ALTER TABLE "Trajet" ADD CONSTRAINT "Trajet_villeDepart_not_empty_check" 
CHECK (LENGTH(TRIM("villeDepart")) >= 2);

ALTER TABLE "Trajet" ADD CONSTRAINT "Trajet_villeArrivee_not_empty_check" 
CHECK (LENGTH(TRIM("villeArrivee")) >= 2);

-- ============================================================================
-- 2. CONTRAINTES SUR LA TABLE VEHICULE
-- ============================================================================

-- Capacité maximale raisonnable (entre 1 et 100 places)
ALTER TABLE "Vehicule" ADD CONSTRAINT "Vehicule_capacite_range_check" 
CHECK ("capaciteMaximale" >= 1 AND "capaciteMaximale" <= 100);

-- Immatriculation non vide
ALTER TABLE "Vehicule" ADD CONSTRAINT "Vehicule_immatriculation_not_empty_check" 
CHECK (LENGTH(TRIM("numeroImmatriculation")) >= 3);

-- Marque et modèle non vides
ALTER TABLE "Vehicule" ADD CONSTRAINT "Vehicule_marque_not_empty_check" 
CHECK (LENGTH(TRIM(marque)) >= 2);

ALTER TABLE "Vehicule" ADD CONSTRAINT "Vehicule_modele_not_empty_check" 
CHECK (LENGTH(TRIM(modele)) >= 1);

-- ============================================================================
-- 3. CONTRAINTES SUR LA TABLE CONDUCTEUR
-- ============================================================================

-- Expérience positive (en années)
ALTER TABLE "Conducteur" ADD CONSTRAINT "Conducteur_experience_positive_check" 
CHECK (experience >= 0 AND experience <= 50);

-- Numéro de permis non vide
ALTER TABLE "Conducteur" ADD CONSTRAINT "Conducteur_permis_not_empty_check" 
CHECK (LENGTH(TRIM("numeroPermis")) >= 5);

-- Nom et prénom non vides
ALTER TABLE "Conducteur" ADD CONSTRAINT "Conducteur_nom_not_empty_check" 
CHECK (LENGTH(TRIM(nom)) >= 2);

ALTER TABLE "Conducteur" ADD CONSTRAINT "Conducteur_prenom_not_empty_check" 
CHECK (LENGTH(TRIM(prenom)) >= 2);

-- ============================================================================
-- 4. CONTRAINTES SUR LA TABLE HORAIRE
-- ============================================================================

-- Date d'arrivée postérieure à la date de départ
ALTER TABLE "Horaire" ADD CONSTRAINT "Horaire_dates_coherentes_check" 
CHECK ("dateArrivee" > "dateDepart");

-- ============================================================================
-- 5. CONTRAINTES SUR LA TABLE RESERVATION
-- ============================================================================

-- Nombre de places positif et raisonnable
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_places_range_check" 
CHECK ("nombrePlaces" >= 1 AND "nombrePlaces" <= 10);

-- ============================================================================
-- 6. CONTRAINTES SUR LA TABLE PAIEMENT
-- ============================================================================

-- Montant positif
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_montant_positive_check" 
CHECK (montant > 0);

-- ============================================================================
-- 7. CONTRAINTES SUR LA TABLE ABONNEMENT
-- ============================================================================

-- Date de fin postérieure à la date de début
ALTER TABLE "Abonnement" ADD CONSTRAINT "Abonnement_dates_coherentes_check" 
CHECK ("dateFin" > "dateDebut");

-- Réduction entre 0 et 100%
ALTER TABLE "Abonnement" ADD CONSTRAINT "Abonnement_reduction_range_check" 
CHECK (reduction >= 0 AND reduction <= 100);

-- Trajets inclus positif ou null
ALTER TABLE "Abonnement" ADD CONSTRAINT "Abonnement_trajets_positive_check" 
CHECK ("trajetsInclus" IS NULL OR "trajetsInclus" > 0);

-- ============================================================================
-- 8. CONTRAINTES SUR LA TABLE REDUCTION
-- ============================================================================

-- Pourcentage entre 0 et 100
ALTER TABLE "Reduction" ADD CONSTRAINT "Reduction_pourcentage_range_check" 
CHECK (pourcentage >= 0 AND pourcentage <= 100);

-- Date de fin postérieure à la date de début (si les deux sont définies)
ALTER TABLE "Reduction" ADD CONSTRAINT "Reduction_dates_coherentes_check" 
CHECK ("dateDebut" IS NULL OR "dateFin" IS NULL OR "dateFin" > "dateDebut");

-- Type non vide
ALTER TABLE "Reduction" ADD CONSTRAINT "Reduction_type_not_empty_check" 
CHECK (LENGTH(TRIM(type)) >= 2);

-- ============================================================================
-- 9. CONTRAINTES SUR LA TABLE BAGAGE
-- ============================================================================

-- Poids positif et raisonnable (max 50kg)
ALTER TABLE "Bagage" ADD CONSTRAINT "Bagage_poids_range_check" 
CHECK (poids > 0 AND poids <= 50);

-- Volume positif
ALTER TABLE "Bagage" ADD CONSTRAINT "Bagage_volume_positive_check" 
CHECK (volume > 0);

-- Supplément positif ou null
ALTER TABLE "Bagage" ADD CONSTRAINT "Bagage_supplement_positive_check" 
CHECK (supplement IS NULL OR supplement >= 0);

-- ============================================================================
-- 10. TRIGGERS POUR CONTRAINTES COMPLEXES
-- ============================================================================

-- ---------------------------------------------------------------------------
-- TRIGGER: Vérifier qu'un véhicule n'est pas en maintenance lors de l'assignation
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION check_vehicule_disponible()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM "Vehicule" 
        WHERE id = NEW."vehiculeId" 
        AND statut IN ('EN_MAINTENANCE', 'HORS_SERVICE')
    ) THEN
        RAISE EXCEPTION 'Le véhicule sélectionné n''est pas disponible (en maintenance ou hors service)';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_vehicule_disponible ON "Horaire";
CREATE TRIGGER trigger_check_vehicule_disponible
    BEFORE INSERT OR UPDATE ON "Horaire"
    FOR EACH ROW
    EXECUTE FUNCTION check_vehicule_disponible();

-- ---------------------------------------------------------------------------
-- TRIGGER: Vérifier qu'un véhicule n'est pas déjà assigné au même moment
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION check_vehicule_conflit_horaire()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM "Horaire" 
        WHERE "vehiculeId" = NEW."vehiculeId"
        AND id <> COALESCE(NEW.id, '')
        AND (
            (NEW."dateDepart" >= "dateDepart" AND NEW."dateDepart" < "dateArrivee")
            OR (NEW."dateArrivee" > "dateDepart" AND NEW."dateArrivee" <= "dateArrivee")
            OR (NEW."dateDepart" <= "dateDepart" AND NEW."dateArrivee" >= "dateArrivee")
        )
    ) THEN
        RAISE EXCEPTION 'Le véhicule est déjà assigné à un autre trajet pendant cette période';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_vehicule_conflit ON "Horaire";
CREATE TRIGGER trigger_check_vehicule_conflit
    BEFORE INSERT OR UPDATE ON "Horaire"
    FOR EACH ROW
    EXECUTE FUNCTION check_vehicule_conflit_horaire();

-- ---------------------------------------------------------------------------
-- TRIGGER: Vérifier qu'un conducteur n'est pas déjà assigné au même moment
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION check_conducteur_conflit_horaire()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM "Horaire" 
        WHERE "conducteurId" = NEW."conducteurId"
        AND id <> COALESCE(NEW.id, '')
        AND (
            (NEW."dateDepart" >= "dateDepart" AND NEW."dateDepart" < "dateArrivee")
            OR (NEW."dateArrivee" > "dateDepart" AND NEW."dateArrivee" <= "dateArrivee")
            OR (NEW."dateDepart" <= "dateDepart" AND NEW."dateArrivee" >= "dateArrivee")
        )
    ) THEN
        RAISE EXCEPTION 'Le conducteur est déjà assigné à un autre trajet pendant cette période';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_conducteur_conflit ON "Horaire";
CREATE TRIGGER trigger_check_conducteur_conflit
    BEFORE INSERT OR UPDATE ON "Horaire"
    FOR EACH ROW
    EXECUTE FUNCTION check_conducteur_conflit_horaire();

-- ---------------------------------------------------------------------------
-- TRIGGER: Vérifier que le nombre de places réservées ne dépasse pas la capacité
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION check_capacite_vehicule()
RETURNS TRIGGER AS $$
DECLARE
    places_reservees INTEGER;
    capacite_max INTEGER;
BEGIN
    -- Calculer le total des places déjà réservées pour cet horaire
    SELECT COALESCE(SUM("nombrePlaces"), 0) INTO places_reservees
    FROM "Reservation"
    WHERE "horaireId" = NEW."horaireId"
    AND statut <> 'ANNULEE'
    AND id <> COALESCE(NEW.id, '');

    -- Récupérer la capacité du véhicule
    SELECT v."capaciteMaximale" INTO capacite_max
    FROM "Horaire" h
    JOIN "Vehicule" v ON h."vehiculeId" = v.id
    WHERE h.id = NEW."horaireId";

    -- Vérifier si la nouvelle réservation dépasse la capacité
    IF (places_reservees + NEW."nombrePlaces") > capacite_max THEN
        RAISE EXCEPTION 'Capacité du véhicule dépassée. Places disponibles: %, demandées: %', 
            (capacite_max - places_reservees), NEW."nombrePlaces";
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_capacite ON "Reservation";
CREATE TRIGGER trigger_check_capacite
    BEFORE INSERT OR UPDATE ON "Reservation"
    FOR EACH ROW
    EXECUTE FUNCTION check_capacite_vehicule();

-- ---------------------------------------------------------------------------
-- TRIGGER: Empêcher les réservations en double (même user, même horaire)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION check_reservation_doublon()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM "Reservation"
        WHERE "userId" = NEW."userId"
        AND "horaireId" = NEW."horaireId"
        AND statut <> 'ANNULEE'
        AND id <> COALESCE(NEW.id, '')
    ) THEN
        RAISE EXCEPTION 'Une réservation existe déjà pour cet utilisateur sur cet horaire';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_reservation_doublon ON "Reservation";
CREATE TRIGGER trigger_check_reservation_doublon
    BEFORE INSERT OR UPDATE ON "Reservation"
    FOR EACH ROW
    EXECUTE FUNCTION check_reservation_doublon();

-- ---------------------------------------------------------------------------
-- TRIGGER: Empêcher la réservation sur un horaire passé
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION check_horaire_futur()
RETURNS TRIGGER AS $$
DECLARE
    date_depart TIMESTAMP;
BEGIN
    SELECT "dateDepart" INTO date_depart
    FROM "Horaire"
    WHERE id = NEW."horaireId";

    IF date_depart < CURRENT_TIMESTAMP THEN
        RAISE EXCEPTION 'Impossible de réserver un trajet dont le départ est déjà passé';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_horaire_futur ON "Reservation";
CREATE TRIGGER trigger_check_horaire_futur
    BEFORE INSERT ON "Reservation"
    FOR EACH ROW
    EXECUTE FUNCTION check_horaire_futur();

-- ============================================================================
-- 11. INDEX POUR OPTIMISER LES VÉRIFICATIONS
-- ============================================================================

-- Index pour accélérer la vérification des conflits d'horaires
CREATE INDEX IF NOT EXISTS "idx_horaire_vehicule_dates" 
ON "Horaire" ("vehiculeId", "dateDepart", "dateArrivee");

CREATE INDEX IF NOT EXISTS "idx_horaire_conducteur_dates" 
ON "Horaire" ("conducteurId", "dateDepart", "dateArrivee");

-- Index pour accélérer la vérification des doublons de réservation
CREATE INDEX IF NOT EXISTS "idx_reservation_user_horaire" 
ON "Reservation" ("userId", "horaireId");

-- Index pour accélérer le calcul des places disponibles
CREATE INDEX IF NOT EXISTS "idx_reservation_horaire_statut" 
ON "Reservation" ("horaireId", statut);

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================

-- REMARQUE: Les contraintes sur la table User ont été retirées pour éviter
-- les conflits avec les données existantes. Vous pouvez les ajouter manuellement
-- après avoir nettoyé vos données avec le script 17_correction_donnees_avant_contraintes.sql
