-- =====================================================
-- AJOUT DU RÔLE CONDUCTEUR AU SYSTÈME
-- =====================================================

-- Modifier le type ENUM Role pour ajouter CONDUCTEUR
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'CONDUCTEUR';

-- Ajouter une colonne userId à la table Conducteur pour lier au compte utilisateur
ALTER TABLE "Conducteur" 
ADD COLUMN IF NOT EXISTS "userId" TEXT;

-- Ajouter une contrainte de clé étrangère
ALTER TABLE "Conducteur"
ADD CONSTRAINT "Conducteur_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL;

-- Commentaires
COMMENT ON COLUMN "Conducteur"."userId" IS 'Référence au compte utilisateur du conducteur (optionnel)';
