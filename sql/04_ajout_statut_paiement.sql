-- =====================================================
-- AJOUT DU STATUT DE PAIEMENT
-- =====================================================

-- Créer le type ENUM pour le statut de paiement
CREATE TYPE "StatutPaiement" AS ENUM ('EN_ATTENTE', 'VALIDE', 'REFUSE');

-- Ajouter la colonne statut à la table Paiement
ALTER TABLE "Paiement" 
ADD COLUMN "statut" "StatutPaiement" NOT NULL DEFAULT 'EN_ATTENTE';

-- Mettre à jour les paiements existants comme VALIDE
UPDATE "Paiement" SET "statut" = 'VALIDE' WHERE "statut" = 'EN_ATTENTE';

-- Rendre la méthode de paiement nullable pour les paiements en attente
ALTER TABLE "Paiement" 
ALTER COLUMN "methodePaiement" DROP NOT NULL;

-- Commentaires
COMMENT ON COLUMN "Paiement"."statut" IS 'Statut du paiement: EN_ATTENTE (créé automatiquement), VALIDE (confirmé par admin), REFUSE (rejeté)';
