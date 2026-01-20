-- =====================================================
-- CRÉATION D'UN COMPTE CONDUCTEUR DE TEST
-- =====================================================

-- Mot de passe : "conducteur123"
-- Hash bcrypt : $2a$10$rXKZ5JxJ5JxJ5JxJ5JxJ5eN5JxJ5JxJ5JxJ5JxJ5JxJ5JxJ5JxJ5J

-- 1. Créer un utilisateur avec le rôle CONDUCTEUR
INSERT INTO "User" (id, nom, prenom, email, password, telephone, role, "createdAt", "updatedAt")
VALUES (
  'user_cond_001',
  'Mbarga',
  'Paul',
  'paul.conducteur@novatransport.com',
  '$2a$10$YourRealBcryptHashHere', -- À remplacer par un vrai hash bcrypt
  '+237 677 12 34 56',
  'CONDUCTEUR',
  NOW(),
  NOW()
);

-- 2. Lier le premier conducteur de la base au compte
-- (Remplacez 'cond_xxx' par l'ID réel d'un conducteur existant)
UPDATE "Conducteur"
SET "userId" = 'user_cond_001'
WHERE id = (SELECT id FROM "Conducteur" LIMIT 1);

-- =====================================================
-- ALTERNATIVE : Créer un conducteur ET son compte
-- =====================================================

-- Si vous n'avez pas encore de conducteur, créez-en un :
/*
INSERT INTO "Conducteur" (id, nom, prenom, numeroPermis, experience, "userId", "createdAt", "updatedAt")
VALUES (
  'cond_paul_001',
  'Mbarga',
  'Paul',
  'PERM-2024-12345',
  5, -- 5 ans d'expérience
  'user_cond_001',
  NOW(),
  NOW()
);
*/

-- =====================================================
-- COMMENT GÉNÉRER UN VRAI HASH BCRYPT
-- =====================================================

-- Option 1 : Utiliser Node.js
-- npm install bcryptjs
-- node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('conducteur123', 10));"

-- Option 2 : Utiliser un site web (pour les tests uniquement)
-- https://bcrypt-generator.com/
-- Entrez "conducteur123" et copiez le hash généré

-- Option 3 : Créer le compte via l'interface d'inscription
-- Puis mettre à jour le rôle :
-- UPDATE "User" SET role = 'CONDUCTEUR' WHERE email = 'paul.conducteur@novatransport.com';

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Vérifier que le compte a été créé
SELECT * FROM "User" WHERE role = 'CONDUCTEUR';

-- Vérifier que le conducteur est lié
SELECT 
  c.id as conducteur_id,
  c.nom,
  c.prenom,
  c.numeroPermis,
  u.email,
  u.role
FROM "Conducteur" c
LEFT JOIN "User" u ON c."userId" = u.id
WHERE c."userId" IS NOT NULL;
