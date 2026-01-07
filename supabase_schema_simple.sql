-- Script SQL simplifié pour créer la base de données dans Supabase
-- Version sans RLS (Row Level Security) - pour utiliser avec NextAuth
-- Copiez et exécutez ce script dans le SQL Editor de Supabase

-- Création des types ENUM
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT');
CREATE TYPE "StatutVehicule" AS ENUM ('EN_SERVICE', 'EN_MAINTENANCE', 'HORS_SERVICE');
CREATE TYPE "StatutTrajet" AS ENUM ('DISPONIBLE', 'ANNULE', 'COMPLET');
CREATE TYPE "StatutReservation" AS ENUM ('CONFIRMEE', 'EN_ATTENTE', 'ANNULEE');
CREATE TYPE "MethodePaiement" AS ENUM ('CARTE_BANCAIRE', 'MOBILE_MONEY', 'ESPECES');
CREATE TYPE "TypeAbonnement" AS ENUM ('MENSUEL', 'ANNUEL');

-- Table User
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
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Table Trajet
CREATE TABLE "Trajet" (
    "id" TEXT NOT NULL,
    "villeDepart" TEXT NOT NULL,
    "villeArrivee" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "dureeEstimee" INTEGER NOT NULL,
    "tarifBase" DOUBLE PRECISION NOT NULL,
    "statut" "StatutTrajet" NOT NULL DEFAULT 'DISPONIBLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trajet_pkey" PRIMARY KEY ("id")
);

-- Table Vehicule
CREATE TABLE "Vehicule" (
    "id" TEXT NOT NULL,
    "numeroImmatriculation" TEXT NOT NULL,
    "marque" TEXT NOT NULL,
    "modele" TEXT NOT NULL,
    "capaciteMaximale" INTEGER NOT NULL,
    "statut" "StatutVehicule" NOT NULL DEFAULT 'EN_SERVICE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicule_pkey" PRIMARY KEY ("id")
);

-- Table Conducteur
CREATE TABLE "Conducteur" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "numeroPermis" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conducteur_pkey" PRIMARY KEY ("id")
);

-- Table Horaire
CREATE TABLE "Horaire" (
    "id" TEXT NOT NULL,
    "dateDepart" TIMESTAMP(3) NOT NULL,
    "dateArrivee" TIMESTAMP(3) NOT NULL,
    "trajetId" TEXT NOT NULL,
    "vehiculeId" TEXT NOT NULL,
    "conducteurId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Horaire_pkey" PRIMARY KEY ("id")
);

-- Table Reservation
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "horaireId" TEXT NOT NULL,
    "nombrePlaces" INTEGER NOT NULL,
    "numeroSiege" TEXT,
    "statut" "StatutReservation" NOT NULL DEFAULT 'EN_ATTENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- Table Paiement
CREATE TABLE "Paiement" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "methodePaiement" "MethodePaiement" NOT NULL,
    "datePaiement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numeroFacture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

-- Table Abonnement
CREATE TABLE "Abonnement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TypeAbonnement" NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "reduction" DOUBLE PRECISION NOT NULL,
    "trajetsInclus" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Abonnement_pkey" PRIMARY KEY ("id")
);

-- Table Reduction
CREATE TABLE "Reduction" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "pourcentage" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reduction_pkey" PRIMARY KEY ("id")
);

-- Table Bagage
CREATE TABLE "Bagage" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "poids" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "estGratuit" BOOLEAN NOT NULL DEFAULT true,
    "supplement" DOUBLE PRECISION,
    "etiquette" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bagage_pkey" PRIMARY KEY ("id")
);

-- Contraintes d'unicité
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Vehicule_numeroImmatriculation_key" ON "Vehicule"("numeroImmatriculation");
CREATE UNIQUE INDEX "Conducteur_numeroPermis_key" ON "Conducteur"("numeroPermis");
CREATE UNIQUE INDEX "Paiement_numeroFacture_key" ON "Paiement"("numeroFacture");

-- Index pour améliorer les performances
CREATE INDEX "Horaire_dateDepart_idx" ON "Horaire"("dateDepart");
CREATE INDEX "Horaire_vehiculeId_dateDepart_idx" ON "Horaire"("vehiculeId", "dateDepart");

-- Clés étrangères
ALTER TABLE "Horaire" ADD CONSTRAINT "Horaire_trajetId_fkey" FOREIGN KEY ("trajetId") REFERENCES "Trajet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Horaire" ADD CONSTRAINT "Horaire_vehiculeId_fkey" FOREIGN KEY ("vehiculeId") REFERENCES "Vehicule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Horaire" ADD CONSTRAINT "Horaire_conducteurId_fkey" FOREIGN KEY ("conducteurId") REFERENCES "Conducteur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_horaireId_fkey" FOREIGN KEY ("horaireId") REFERENCES "Horaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Abonnement" ADD CONSTRAINT "Abonnement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Bagage" ADD CONSTRAINT "Bagage_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;


