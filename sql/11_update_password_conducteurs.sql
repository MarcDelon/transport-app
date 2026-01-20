-- =====================================================
-- MISE À JOUR DES MOTS DE PASSE CONDUCTEURS
-- =====================================================
-- Mot de passe : "conducteur123"
-- Hash bcrypt RÉEL : $2a$10$UcacCQtsW6eYmnLfK5eN9eJllF42xKxhxa4zad/.V/KSygS7P9oQW

-- Mettre à jour tous les comptes conducteurs avec le bon hash
UPDATE "User"
SET password = '$2a$10$UcacCQtsW6eYmnLfK5eN9eJllF42xKxhxa4zad/.V/KSygS7P9oQW'
WHERE role = 'CONDUCTEUR';

-- Vérification
SELECT 
  id,
  email,
  role,
  LEFT(password, 20) as password_hash_preview
FROM "User"
WHERE role = 'CONDUCTEUR';

-- =====================================================
-- COMPTES CONDUCTEURS AVEC MOT DE PASSE CORRECT
-- =====================================================

/*
✅ Tous les comptes conducteurs ont maintenant le bon mot de passe

Email / Mot de passe :
1. paul.mbarga@novatransport.com / conducteur123
2. marie.ngo@novatransport.com / conducteur123
3. jean.fotso@novatransport.com / conducteur123
4. sophie.kamga@novatransport.com / conducteur123
5. daniel.tchoupo@novatransport.com / conducteur123

🚀 Testez la connexion maintenant !
*/
