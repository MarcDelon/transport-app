-- =====================================================
-- AJOUT DU CHAMP NUMÉRO D'IDENTITÉ
-- =====================================================

-- Ajouter la colonne numeroIdentite à la table User (optionnel)
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "numeroIdentite" TEXT;

-- Commentaire
COMMENT ON COLUMN "User"."numeroIdentite" IS 'Numéro de pièce d''identité du client (optionnel)';
