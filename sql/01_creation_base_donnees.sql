-- =====================================================
-- 5.1 SCRIPT DE CRÉATION DE LA BASE DE DONNÉES
-- Système de gestion de transport interurbain NOVA
-- =====================================================

-- Suppression des tables existantes (si nécessaire)
DROP TABLE IF EXISTS "Bagage" CASCADE;
DROP TABLE IF EXISTS "Reduction" CASCADE;
DROP TABLE IF EXISTS "Abonnement" CASCADE;
DROP TABLE IF EXISTS "Paiement" CASCADE;
DROP TABLE IF EXISTS "Reservation" CASCADE;
DROP TABLE IF EXISTS "Horaire" CASCADE;
DROP TABLE IF EXISTS "Conducteur" CASCADE;
DROP TABLE IF EXISTS "Vehicule" CASCADE;
DROP TABLE IF EXISTS "Trajet" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Suppression des types ENUM existants
DROP TYPE IF EXISTS "Role" CASCADE;
DROP TYPE IF EXISTS "StatutVehicule" CASCADE;
DROP TYPE IF EXISTS "StatutTrajet" CASCADE;
DROP TYPE IF EXISTS "StatutReservation" CASCADE;
DROP TYPE IF EXISTS "MethodePaiement" CASCADE;
DROP TYPE IF EXISTS "TypeAbonnement" CASCADE;

-- =====================================================
-- CRÉATION DES TYPES ENUM
-- =====================================================

CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT');
CREATE TYPE "StatutVehicule" AS ENUM ('EN_SERVICE', 'EN_MAINTENANCE', 'HORS_SERVICE');
CREATE TYPE "StatutTrajet" AS ENUM ('DISPONIBLE', 'ANNULE', 'COMPLET');
CREATE TYPE "StatutReservation" AS ENUM ('CONFIRMEE', 'EN_ATTENTE', 'ANNULEE');
CREATE TYPE "MethodePaiement" AS ENUM ('CARTE_BANCAIRE', 'MOBILE_MONEY', 'ESPECES');
CREATE TYPE "TypeAbonnement" AS ENUM ('MENSUEL', 'ANNUEL');

-- =====================================================
-- 5.1 CRÉATION DES TABLES AVEC CLÉS PRIMAIRES
-- =====================================================

-- Table User (Utilisateurs du système)
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "pieceIdentite" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Table Trajet (Routes disponibles)
CREATE TABLE "Trajet" (
    "id" TEXT NOT NULL,
    "villeDepart" TEXT NOT NULL,
    "villeArrivee" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "dureeEstimee" INTEGER NOT NULL,
    "tarifBase" DOUBLE PRECISION NOT NULL,
    "statut" "StatutTrajet" NOT NULL DEFAULT 'DISPONIBLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "Trajet_pkey" PRIMARY KEY ("id")
);

-- Table Vehicule (Flotte de véhicules)
CREATE TABLE "Vehicule" (
    "id" TEXT NOT NULL,
    "numeroImmatriculation" TEXT NOT NULL,
    "marque" TEXT NOT NULL,
    "modele" TEXT NOT NULL,
    "capaciteMaximale" INTEGER NOT NULL,
    "statut" "StatutVehicule" NOT NULL DEFAULT 'EN_SERVICE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "Vehicule_pkey" PRIMARY KEY ("id")
);

-- Table Conducteur (Chauffeurs)
CREATE TABLE "Conducteur" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "numeroPermis" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "Conducteur_pkey" PRIMARY KEY ("id")
);

-- Table Horaire (Planification des voyages)
CREATE TABLE "Horaire" (
    "id" TEXT NOT NULL,
    "dateDepart" TIMESTAMP(3) NOT NULL,
    "dateArrivee" TIMESTAMP(3) NOT NULL,
    "trajetId" TEXT NOT NULL,
    "vehiculeId" TEXT NOT NULL,
    "conducteurId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "Horaire_pkey" PRIMARY KEY ("id")
);

-- Table Reservation (Réservations clients)
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "horaireId" TEXT NOT NULL,
    "nombrePlaces" INTEGER NOT NULL,
    "numeroSiege" TEXT,
    "statut" "StatutReservation" NOT NULL DEFAULT 'EN_ATTENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- Table Paiement (Transactions financières)
CREATE TABLE "Paiement" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "methodePaiement" "MethodePaiement" NOT NULL,
    "datePaiement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numeroFacture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

-- Table Abonnement (Abonnements clients)
CREATE TABLE "Abonnement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TypeAbonnement" NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "reduction" DOUBLE PRECISION NOT NULL,
    "trajetsInclus" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "Abonnement_pkey" PRIMARY KEY ("id")
);

-- Table Reduction (Promotions et réductions)
CREATE TABLE "Reduction" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "pourcentage" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "Reduction_pkey" PRIMARY KEY ("id")
);

-- Table Bagage (Gestion des bagages)
CREATE TABLE "Bagage" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "poids" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "estGratuit" BOOLEAN NOT NULL DEFAULT true,
    "supplement" DOUBLE PRECISION,
    "etiquette" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "Bagage_pkey" PRIMARY KEY ("id")
);

-- =====================================================
-- 5.2 CONTRAINTES D'INTÉGRITÉ
-- =====================================================

-- Contraintes UNIQUE
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Vehicule_numeroImmatriculation_key" ON "Vehicule"("numeroImmatriculation");
CREATE UNIQUE INDEX "Conducteur_numeroPermis_key" ON "Conducteur"("numeroPermis");
CREATE UNIQUE INDEX "Paiement_numeroFacture_key" ON "Paiement"("numeroFacture");

-- Contraintes CHECK
ALTER TABLE "Trajet" ADD CONSTRAINT "check_distance_positive" 
    CHECK ("distance" > 0);

ALTER TABLE "Trajet" ADD CONSTRAINT "check_duree_positive" 
    CHECK ("dureeEstimee" > 0);

ALTER TABLE "Trajet" ADD CONSTRAINT "check_tarif_positive" 
    CHECK ("tarifBase" > 0);

ALTER TABLE "Vehicule" ADD CONSTRAINT "check_capacite_positive" 
    CHECK ("capaciteMaximale" > 0 AND "capaciteMaximale" <= 100);

ALTER TABLE "Conducteur" ADD CONSTRAINT "check_experience_positive" 
    CHECK ("experience" >= 0);

ALTER TABLE "Reservation" ADD CONSTRAINT "check_places_positive" 
    CHECK ("nombrePlaces" > 0 AND "nombrePlaces" <= 10);

ALTER TABLE "Paiement" ADD CONSTRAINT "check_montant_positive" 
    CHECK ("montant" > 0);

ALTER TABLE "Abonnement" ADD CONSTRAINT "check_reduction_valide" 
    CHECK ("reduction" >= 0 AND "reduction" <= 100);

ALTER TABLE "Bagage" ADD CONSTRAINT "check_poids_positive" 
    CHECK ("poids" > 0 AND "poids" <= 50);

ALTER TABLE "Bagage" ADD CONSTRAINT "check_volume_positive" 
    CHECK ("volume" > 0);

-- Contraintes NOT NULL déjà définies dans CREATE TABLE

-- =====================================================
-- CLÉS ÉTRANGÈRES (FOREIGN KEYS)
-- =====================================================

-- Relations Horaire
ALTER TABLE "Horaire" ADD CONSTRAINT "Horaire_trajetId_fkey" 
    FOREIGN KEY ("trajetId") REFERENCES "Trajet"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Horaire" ADD CONSTRAINT "Horaire_vehiculeId_fkey" 
    FOREIGN KEY ("vehiculeId") REFERENCES "Vehicule"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Horaire" ADD CONSTRAINT "Horaire_conducteurId_fkey" 
    FOREIGN KEY ("conducteurId") REFERENCES "Conducteur"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Relations Reservation
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_horaireId_fkey" 
    FOREIGN KEY ("horaireId") REFERENCES "Horaire"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Relations Paiement
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_reservationId_fkey" 
    FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Relations Abonnement
ALTER TABLE "Abonnement" ADD CONSTRAINT "Abonnement_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Relations Bagage
ALTER TABLE "Bagage" ADD CONSTRAINT "Bagage_reservationId_fkey" 
    FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- =====================================================
-- INDEX POUR AMÉLIORER LES PERFORMANCES
-- =====================================================

CREATE INDEX "Horaire_dateDepart_idx" ON "Horaire"("dateDepart");
CREATE INDEX "Horaire_vehiculeId_dateDepart_idx" ON "Horaire"("vehiculeId", "dateDepart");
CREATE INDEX "Reservation_userId_idx" ON "Reservation"("userId");
CREATE INDEX "Paiement_userId_idx" ON "Paiement"("userId");
CREATE INDEX "Trajet_villeDepart_villeArrivee_idx" ON "Trajet"("villeDepart", "villeArrivee");

-- =====================================================
-- FIN DU SCRIPT DE CRÉATION
-- =====================================================
