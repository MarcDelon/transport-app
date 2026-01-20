-- =====================================================
-- AJOUT DE LA COLONNE STATUT À LA TABLE HORAIRE
-- =====================================================

-- Créer le type ENUM pour le statut des horaires
DO $$ BEGIN
    CREATE TYPE "StatutHoraire" AS ENUM ('PROGRAMME', 'EN_COURS', 'TERMINE', 'ANNULE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Ajouter la colonne statut à la table Horaire
ALTER TABLE "Horaire" 
ADD COLUMN IF NOT EXISTS "statut" "StatutHoraire" NOT NULL DEFAULT 'PROGRAMME';

-- Mettre à jour les horaires existants selon leur date
-- Les horaires passés sont marqués comme TERMINE
UPDATE "Horaire"
SET "statut" = 'TERMINE'
WHERE "dateArrivee" < NOW();

-- Vérification
SELECT 
  id,
  "dateDepart",
  "dateArrivee",
  statut,
  "trajetId",
  "conducteurId"
FROM "Horaire"
ORDER BY "dateDepart" DESC
LIMIT 10;

-- =====================================================
-- COMMENTAIRE
-- =====================================================
COMMENT ON COLUMN "Horaire"."statut" IS 'Statut du trajet: PROGRAMME, EN_COURS, TERMINE, ANNULE';
