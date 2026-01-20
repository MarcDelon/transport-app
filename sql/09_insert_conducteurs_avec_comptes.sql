-- =====================================================
-- INSERTION DE CONDUCTEURS AVEC COMPTES UTILISATEURS
-- =====================================================
-- ⚠️ IMPORTANT : Exécutez d'abord le script 07_ajout_role_conducteur.sql
-- pour ajouter le rôle CONDUCTEUR et la colonne userId à la table Conducteur
-- =====================================================
-- Tous les mots de passe sont : "conducteur123"
-- Hash bcrypt généré : $2a$10$N9qo8uLOickgx2ZMRZoMye7FrYX9CPqyJZ3IKW8WJLd6Q3JKQ3JKe

-- Conducteur 1 : Paul Mbarga
INSERT INTO "User" (id, nom, prenom, email, password, telephone, role, "createdAt", "updatedAt")
VALUES (
  'user_cond_paul',
  'Mbarga',
  'Paul',
  'paul.mbarga@novatransport.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye7FrYX9CPqyJZ3IKW8WJLd6Q3JKQ3JKe',
  '+237 677 12 34 56',
  'CONDUCTEUR',
  NOW(),
  NOW()
);

INSERT INTO "Conducteur" (id, nom, prenom, numeroPermis, experience, "userId", "createdAt", "updatedAt")
VALUES (
  'cond_paul_001',
  'Mbarga',
  'Paul',
  'PERM-2024-001',
  8,
  'user_cond_paul',
  NOW(),
  NOW()
);

-- Conducteur 2 : Marie Ngo
INSERT INTO "User" (id, nom, prenom, email, password, telephone, role, "createdAt", "updatedAt")
VALUES (
  'user_cond_marie',
  'Ngo',
  'Marie',
  'marie.ngo@novatransport.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye7FrYX9CPqyJZ3IKW8WJLd6Q3JKQ3JKe',
  '+237 677 23 45 67',
  'CONDUCTEUR',
  NOW(),
  NOW()
);

INSERT INTO "Conducteur" (id, nom, prenom, numeroPermis, experience, "userId", "createdAt", "updatedAt")
VALUES (
  'cond_marie_002',
  'Ngo',
  'Marie',
  'PERM-2024-002',
  5,
  'user_cond_marie',
  NOW(),
  NOW()
);

-- Conducteur 3 : Jean Fotso
INSERT INTO "User" (id, nom, prenom, email, password, telephone, role, "createdAt", "updatedAt")
VALUES (
  'user_cond_jean',
  'Fotso',
  'Jean',
  'jean.fotso@novatransport.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye7FrYX9CPqyJZ3IKW8WJLd6Q3JKQ3JKe',
  '+237 677 34 56 78',
  'CONDUCTEUR',
  NOW(),
  NOW()
);

INSERT INTO "Conducteur" (id, nom, prenom, numeroPermis, experience, "userId", "createdAt", "updatedAt")
VALUES (
  'cond_jean_003',
  'Fotso',
  'Jean',
  'PERM-2024-003',
  12,
  'user_cond_jean',
  NOW(),
  NOW()
);

-- Conducteur 4 : Sophie Kamga
INSERT INTO "User" (id, nom, prenom, email, password, telephone, role, "createdAt", "updatedAt")
VALUES (
  'user_cond_sophie',
  'Kamga',
  'Sophie',
  'sophie.kamga@novatransport.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye7FrYX9CPqyJZ3IKW8WJLd6Q3JKQ3JKe',
  '+237 677 45 67 89',
  'CONDUCTEUR',
  NOW(),
  NOW()
);

INSERT INTO "Conducteur" (id, nom, prenom, numeroPermis, experience, "userId", "createdAt", "updatedAt")
VALUES (
  'cond_sophie_004',
  'Kamga',
  'Sophie',
  'PERM-2024-004',
  6,
  'user_cond_sophie',
  NOW(),
  NOW()
);

-- Conducteur 5 : Daniel Tchoupo
INSERT INTO "User" (id, nom, prenom, email, password, telephone, role, "createdAt", "updatedAt")
VALUES (
  'user_cond_daniel',
  'Tchoupo',
  'Daniel',
  'daniel.tchoupo@novatransport.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye7FrYX9CPqyJZ3IKW8WJLd6Q3JKQ3JKe',
  '+237 677 56 78 90',
  'CONDUCTEUR',
  NOW(),
  NOW()
);

INSERT INTO "Conducteur" (id, nom, prenom, numeroPermis, experience, "userId", "createdAt", "updatedAt")
VALUES (
  'cond_daniel_005',
  'Tchoupo',
  'Daniel',
  'PERM-2024-005',
  10,
  'user_cond_daniel',
  NOW(),
  NOW()
);

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Afficher tous les conducteurs avec leurs comptes
SELECT 
  c.id as conducteur_id,
  c.nom,
  c.prenom,
  c.numeroPermis,
  c.experience,
  u.email,
  u.role,
  u.telephone
FROM "Conducteur" c
INNER JOIN "User" u ON c."userId" = u.id
WHERE u.role = 'CONDUCTEUR'
ORDER BY c.nom;

-- =====================================================
-- INFORMATIONS DE CONNEXION
-- =====================================================

/*
TOUS LES COMPTES CONDUCTEURS :

1. Paul Mbarga
   Email    : paul.mbarga@novatransport.com
   Password : conducteur123
   
2. Marie Ngo
   Email    : marie.ngo@novatransport.com
   Password : conducteur123
   
3. Jean Fotso
   Email    : jean.fotso@novatransport.com
   Password : conducteur123
   
4. Sophie Kamga
   Email    : sophie.kamga@novatransport.com
   Password : conducteur123
   
5. Daniel Tchoupo
   Email    : daniel.tchoupo@novatransport.com
   Password : conducteur123

ACCÈS : /connexion puis /conducteur/dashboard
*/
