-- ============================================================================
-- SUPPRESSION DES 11 HORAIRES PROBLÉMATIQUES
-- ============================================================================
-- Ces horaires ont des conflits de véhicules/conducteurs impossibles à résoudre
-- Il faut d'abord supprimer leurs réservations, puis les horaires eux-mêmes

-- ÉTAPE 1 : Supprimer les réservations associées à ces horaires
DELETE FROM "Reservation"
WHERE "horaireId" IN (
    'horaire004',
    'horaire007',
    'horaire010',
    'horaire012',
    'horaire014',
    'horaire016',
    'horaire018',
    'horaire_gen_169',
    'horaire_gen_161',
    'horaire_gen_641',
    'horaire_gen_801'
);

-- ÉTAPE 2 : Supprimer les sièges associés (si existants)
DELETE FROM "Siege"
WHERE "horaireId" IN (
    'horaire004',
    'horaire007',
    'horaire010',
    'horaire012',
    'horaire014',
    'horaire016',
    'horaire018',
    'horaire_gen_169',
    'horaire_gen_161',
    'horaire_gen_641',
    'horaire_gen_801'
);

-- ÉTAPE 3 : Supprimer les horaires
DELETE FROM "Horaire"
WHERE id IN (
    'horaire004',
    'horaire007',
    'horaire010',
    'horaire012',
    'horaire014',
    'horaire016',
    'horaire018',
    'horaire_gen_169',
    'horaire_gen_161',
    'horaire_gen_641',
    'horaire_gen_801'
);

-- VÉRIFICATION FINALE
SELECT 
    COUNT(*) as "Total horaires passés restants"
FROM "Horaire"
WHERE "dateDepart" < CURRENT_TIMESTAMP;

-- Afficher le total d'horaires
SELECT 
    COUNT(*) as "Total horaires dans la base"
FROM "Horaire";
