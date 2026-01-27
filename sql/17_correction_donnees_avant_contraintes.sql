-- ============================================================================
-- CORRECTION DES DONNÉES AVANT APPLICATION DES CONTRAINTES
-- À exécuter AVANT le script 16_contraintes_metier.sql
-- ============================================================================

-- ============================================================================
-- 1. VÉRIFIER LES DONNÉES PROBLÉMATIQUES
-- ============================================================================

-- Vérifier les emails invalides
SELECT id, email, 'Email invalide' as probleme
FROM "User"
WHERE email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';

-- Vérifier les téléphones invalides
SELECT id, nom, prenom, telephone, 'Téléphone invalide' as probleme
FROM "User"
WHERE telephone !~* '^\+?[0-9\s]{8,20}$';

-- Vérifier les mots de passe non hashés
SELECT id, email, LENGTH(password) as longueur_mdp, 'Mot de passe non hashé' as probleme
FROM "User"
WHERE LENGTH(password) < 60;

-- Vérifier les noms/prénoms trop courts
SELECT id, email, nom, prenom, 'Nom ou prénom trop court' as probleme
FROM "User"
WHERE LENGTH(TRIM(nom)) < 2 OR LENGTH(TRIM(prenom)) < 2;

-- ============================================================================
-- 2. CORRIGER LES TÉLÉPHONES INVALIDES
-- ============================================================================

-- Nettoyer les téléphones: enlever les caractères non numériques sauf + et espaces
UPDATE "User"
SET telephone = REGEXP_REPLACE(telephone, '[^0-9+\s]', '', 'g')
WHERE telephone !~* '^\+?[0-9\s]{8,20}$';

-- Si des téléphones sont encore invalides, les remplacer par un format par défaut
UPDATE "User"
SET telephone = '+237600000000'
WHERE telephone !~* '^\+?[0-9\s]{8,20}$';

-- ============================================================================
-- 3. CORRIGER LES EMAILS INVALIDES (si nécessaire)
-- ============================================================================

-- Remplacer les emails invalides par un format générique
UPDATE "User"
SET email = LOWER(TRIM(email))
WHERE email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';

-- ============================================================================
-- 4. CORRIGER LES NOMS/PRÉNOMS TROP COURTS
-- ============================================================================

UPDATE "User"
SET nom = 'Nom'
WHERE LENGTH(TRIM(nom)) < 2;

UPDATE "User"
SET prenom = 'Prenom'
WHERE LENGTH(TRIM(prenom)) < 2;

-- ============================================================================
-- 5. VÉRIFICATION FINALE
-- ============================================================================

-- Compter les problèmes restants
SELECT 
    COUNT(*) FILTER (WHERE email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') as emails_invalides,
    COUNT(*) FILTER (WHERE telephone !~* '^\+?[0-9\s]{8,20}$') as telephones_invalides,
    COUNT(*) FILTER (WHERE LENGTH(password) < 60) as mdp_non_hashes,
    COUNT(*) FILTER (WHERE LENGTH(TRIM(nom)) < 2 OR LENGTH(TRIM(prenom)) < 2) as noms_invalides
FROM "User";

-- Si tous les compteurs sont à 0, vous pouvez exécuter le script 16_contraintes_metier.sql
