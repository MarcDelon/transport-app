-- Script SQL pour créer la base de données dans Supabase
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

-- Activer Row Level Security (RLS) - Optionnel mais recommandé pour Supabase
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Trajet" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Vehicule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Conducteur" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Horaire" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Reservation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Paiement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Abonnement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Reduction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Bagage" ENABLE ROW LEVEL SECURITY;

-- Politiques RLS de base (tous les utilisateurs peuvent lire, seulement les admins peuvent modifier)
-- Vous pouvez ajuster ces politiques selon vos besoins

-- Politiques pour User
CREATE POLICY "Users can view their own data" ON "User" FOR SELECT USING (auth.uid()::text = id OR (SELECT role FROM "User" WHERE id = auth.uid()::text) = 'ADMIN');
CREATE POLICY "Admins can insert users" ON "User" FOR INSERT WITH CHECK ((SELECT role FROM "User" WHERE id = auth.uid()::text) = 'ADMIN');
CREATE POLICY "Users can update their own data" ON "User" FOR UPDATE USING (auth.uid()::text = id OR (SELECT role FROM "User" WHERE id = auth.uid()::text) = 'ADMIN');

-- Politiques pour Trajet (lecture publique, modification admin)
CREATE POLICY "Anyone can view trajets" ON "Trajet" FOR SELECT USING (true);
CREATE POLICY "Only admins can modify trajets" ON "Trajet" FOR ALL USING ((SELECT role FROM "User" WHERE id = auth.uid()::text) = 'ADMIN');

-- Politiques pour Vehicule (lecture publique, modification admin)
CREATE POLICY "Anyone can view vehicules" ON "Vehicule" FOR SELECT USING (true);
CREATE POLICY "Only admins can modify vehicules" ON "Vehicule" FOR ALL USING ((SELECT role FROM "User" WHERE id = auth.uid()::text) = 'ADMIN');

-- Politiques pour Conducteur (lecture publique, modification admin)
CREATE POLICY "Anyone can view conducteurs" ON "Conducteur" FOR SELECT USING (true);
CREATE POLICY "Only admins can modify conducteurs" ON "Conducteur" FOR ALL USING ((SELECT role FROM "User" WHERE id = auth.uid()::text) = 'ADMIN');

-- Politiques pour Horaire (lecture publique, modification admin)
CREATE POLICY "Anyone can view horaires" ON "Horaire" FOR SELECT USING (true);
CREATE POLICY "Only admins can modify horaires" ON "Horaire" FOR ALL USING ((SELECT role FROM "User" WHERE id = auth.uid()::text) = 'ADMIN');

-- Politiques pour Reservation
CREATE POLICY "Users can view their own reservations" ON "Reservation" FOR SELECT USING (auth.uid()::text = "userId" OR (SELECT role FROM "User" WHERE id = auth.uid()::text) = 'ADMIN');
CREATE POLICY "Users can create reservations" ON "Reservation" FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "Users can update their own reservations" ON "Reservation" FOR UPDATE USING (auth.uid()::text = "userId" OR (SELECT role FROM "User" WHERE id = auth.uid()::text) = 'ADMIN');

-- Politiques pour Paiement
CREATE POLICY "Users can view their own payments" ON "Paiement" FOR SELECT USING (auth.uid()::text = "userId" OR (SELECT role FROM "User" WHERE id = auth.uid()::text) = 'ADMIN');
CREATE POLICY "Users can create payments" ON "Paiement" FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- Politiques pour Abonnement
CREATE POLICY "Users can view their own abonnements" ON "Abonnement" FOR SELECT USING (auth.uid()::text = "userId" OR (SELECT role FROM "User" WHERE id = auth.uid()::text) = 'ADMIN');
CREATE POLICY "Users can create abonnements" ON "Abonnement" FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- Politiques pour Reduction (lecture publique, modification admin)
CREATE POLICY "Anyone can view reductions" ON "Reduction" FOR SELECT USING (true);
CREATE POLICY "Only admins can modify reductions" ON "Reduction" FOR ALL USING ((SELECT role FROM "User" WHERE id = auth.uid()::text) = 'ADMIN');

-- Politiques pour Bagage
CREATE POLICY "Users can view their own bagages" ON "Bagage" FOR SELECT USING (auth.uid()::text IN (SELECT "userId" FROM "Reservation" WHERE id = "reservationId") OR (SELECT role FROM "User" WHERE id = auth.uid()::text) = 'ADMIN');
CREATE POLICY "Users can create bagages" ON "Bagage" FOR INSERT WITH CHECK (auth.uid()::text IN (SELECT "userId" FROM "Reservation" WHERE id = "reservationId"));

-- Note: Les politiques RLS ci-dessus utilisent auth.uid() qui nécessite l'authentification Supabase
-- Si vous utilisez NextAuth au lieu de l'auth Supabase, vous pouvez désactiver RLS ou créer des politiques personnalisées


