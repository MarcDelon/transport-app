-- ============================================================================
-- GESTION DES SIÈGES POUR LES RÉSERVATIONS
-- Script SQL à exécuter dans Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. MODIFIER LA TABLE RESERVATION
-- ============================================================================

-- Le champ numeroSiege existe déjà mais il faut le rendre obligatoire
-- et ajouter une contrainte d'unicité par horaire

-- Modifier la colonne pour accepter plusieurs sièges (format: "1,2,3")
-- Pour l'instant on garde TEXT, mais on va ajouter des contraintes

COMMENT ON COLUMN "Reservation"."numeroSiege" IS 'Numéros de sièges réservés (format: "1,2,3" pour plusieurs sièges)';

-- ============================================================================
-- 2. CRÉER UNE TABLE POUR GÉRER LES SIÈGES INDIVIDUELLEMENT
-- ============================================================================

-- Cette table permet de gérer chaque siège individuellement
CREATE TABLE IF NOT EXISTS "Siege" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "horaireId" TEXT NOT NULL,
    "numeroSiege" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Siege_pkey" PRIMARY KEY ("id")
);

-- Contrainte d'unicité : un siège ne peut être réservé qu'une fois par horaire
CREATE UNIQUE INDEX "Siege_horaireId_numeroSiege_key" 
ON "Siege"("horaireId", "numeroSiege");

-- Index pour accélérer les recherches
CREATE INDEX "Siege_reservationId_idx" ON "Siege"("reservationId");
CREATE INDEX "Siege_horaireId_idx" ON "Siege"("horaireId");

-- Clés étrangères
ALTER TABLE "Siege" ADD CONSTRAINT "Siege_reservationId_fkey" 
FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Siege" ADD CONSTRAINT "Siege_horaireId_fkey" 
FOREIGN KEY ("horaireId") REFERENCES "Horaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================================
-- 3. AJOUTER UNE TABLE POUR LA CONFIGURATION DES VÉHICULES
-- ============================================================================

-- Cette table définit la disposition des sièges pour chaque type de véhicule
CREATE TABLE IF NOT EXISTS "ConfigurationVehicule" (
    "id" TEXT NOT NULL,
    "vehiculeId" TEXT NOT NULL,
    "nombreRangees" INTEGER NOT NULL DEFAULT 10, -- Nombre de rangées de sièges
    "siegesParRangee" INTEGER NOT NULL DEFAULT 4, -- Sièges par rangée (ex: 2 gauche + 2 droite)
    "alleePosition" INTEGER NOT NULL DEFAULT 2, -- Position de l'allée (après le siège N)
    "siegesSpeciaux" TEXT, -- JSON des sièges spéciaux (ex: {"1": "conducteur", "2": "porte"})
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfigurationVehicule_pkey" PRIMARY KEY ("id")
);

-- Un véhicule ne peut avoir qu'une seule configuration
CREATE UNIQUE INDEX "ConfigurationVehicule_vehiculeId_key" 
ON "ConfigurationVehicule"("vehiculeId");

-- Clé étrangère
ALTER TABLE "ConfigurationVehicule" ADD CONSTRAINT "ConfigurationVehicule_vehiculeId_fkey" 
FOREIGN KEY ("vehiculeId") REFERENCES "Vehicule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================================
-- 4. TRIGGER POUR SYNCHRONISER numeroSiege DANS RESERVATION
-- ============================================================================

-- Fonction pour mettre à jour le champ numeroSiege dans Reservation
CREATE OR REPLACE FUNCTION sync_reservation_sieges()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour le champ numeroSiege avec la liste des sièges
    UPDATE "Reservation"
    SET "numeroSiege" = (
        SELECT STRING_AGG("numeroSiege"::TEXT, ',' ORDER BY "numeroSiege")
        FROM "Siege"
        WHERE "reservationId" = COALESCE(NEW."reservationId", OLD."reservationId")
    ),
    "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = COALESCE(NEW."reservationId", OLD."reservationId");
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger sur INSERT et DELETE de Siege
DROP TRIGGER IF EXISTS trigger_sync_reservation_sieges_insert ON "Siege";
CREATE TRIGGER trigger_sync_reservation_sieges_insert
    AFTER INSERT OR DELETE ON "Siege"
    FOR EACH ROW
    EXECUTE FUNCTION sync_reservation_sieges();

-- ============================================================================
-- 5. FONCTION POUR OBTENIR LES SIÈGES DISPONIBLES D'UN HORAIRE
-- ============================================================================

CREATE OR REPLACE FUNCTION get_sieges_disponibles(horaire_id TEXT)
RETURNS TABLE(numero_siege INTEGER, est_disponible BOOLEAN) AS $$
DECLARE
    capacite INTEGER;
BEGIN
    -- Récupérer la capacité du véhicule
    SELECT v."capaciteMaximale" INTO capacite
    FROM "Horaire" h
    JOIN "Vehicule" v ON h."vehiculeId" = v.id
    WHERE h.id = horaire_id;
    
    -- Retourner tous les sièges avec leur disponibilité
    RETURN QUERY
    SELECT 
        s.numero,
        NOT EXISTS (
            SELECT 1 FROM "Siege" sg
            JOIN "Reservation" r ON sg."reservationId" = r.id
            WHERE sg."horaireId" = horaire_id
            AND sg."numeroSiege" = s.numero
            AND r.statut IN ('CONFIRMEE', 'EN_ATTENTE')
        ) as est_disponible
    FROM generate_series(1, capacite) AS s(numero)
    ORDER BY s.numero;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. CRÉER DES CONFIGURATIONS PAR DÉFAUT POUR LES VÉHICULES EXISTANTS
-- ============================================================================

-- Insérer une configuration par défaut pour chaque véhicule
INSERT INTO "ConfigurationVehicule" (id, "vehiculeId", "nombreRangees", "siegesParRangee", "alleePosition", "createdAt", "updatedAt")
SELECT 
    'config_' || v.id,
    v.id,
    CASE 
        WHEN v."capaciteMaximale" <= 20 THEN 5
        WHEN v."capaciteMaximale" <= 40 THEN 10
        ELSE 12
    END as "nombreRangees",
    4 as "siegesParRangee",
    2 as "alleePosition",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "Vehicule" v
WHERE NOT EXISTS (
    SELECT 1 FROM "ConfigurationVehicule" cv WHERE cv."vehiculeId" = v.id
);

-- ============================================================================
-- 7. ACTIVER RLS SUR LES NOUVELLES TABLES
-- ============================================================================

ALTER TABLE "Siege" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ConfigurationVehicule" ENABLE ROW LEVEL SECURITY;

-- Politiques pour Siege
CREATE POLICY "Anyone can view sieges" ON "Siege" FOR SELECT USING (true);
CREATE POLICY "Users can create sieges for their reservations" ON "Siege" FOR INSERT 
WITH CHECK (
    auth.uid()::text IN (SELECT "userId" FROM "Reservation" WHERE id = "reservationId")
);
CREATE POLICY "Only admins can modify sieges" ON "Siege" FOR ALL 
USING ((SELECT role FROM "User" WHERE id = auth.uid()::text) = 'ADMIN');

-- Politiques pour ConfigurationVehicule
CREATE POLICY "Anyone can view configurations" ON "ConfigurationVehicule" FOR SELECT USING (true);
CREATE POLICY "Only admins can modify configurations" ON "ConfigurationVehicule" FOR ALL 
USING ((SELECT role FROM "User" WHERE id = auth.uid()::text) = 'ADMIN');

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================

-- Pour tester la fonction:
-- SELECT * FROM get_sieges_disponibles('votre_horaire_id');
