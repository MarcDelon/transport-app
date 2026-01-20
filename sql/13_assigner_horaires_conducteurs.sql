-- =====================================================
-- ASSIGNER DES HORAIRES AUX CONDUCTEURS
-- =====================================================

-- 1. Vérifier les conducteurs existants
SELECT 
  c.id as conducteur_id,
  c.nom,
  c.prenom,
  c."userId",
  u.email
FROM "Conducteur" c
LEFT JOIN "User" u ON c."userId" = u.id
ORDER BY c.nom;

-- 2. Vérifier les horaires existants (sans conducteur assigné ou avec conducteur)
SELECT 
  h.id,
  h."dateDepart",
  h."conducteurId",
  t."villeDepart",
  t."villeArrivee"
FROM "Horaire" h
INNER JOIN "Trajet" t ON h."trajetId" = t.id
WHERE h."dateDepart" >= NOW()
ORDER BY h."dateDepart"
LIMIT 20;

-- 3. Assigner les horaires futurs aux conducteurs créés
-- Répartir équitablement les horaires entre les 5 conducteurs

-- Récupérer les IDs des conducteurs
DO $$
DECLARE
  conducteur_ids TEXT[] := ARRAY(
    SELECT id FROM "Conducteur" WHERE "userId" IS NOT NULL ORDER BY nom LIMIT 5
  );
  horaire_record RECORD;
  conducteur_index INT := 0;
BEGIN
  -- Pour chaque horaire futur, assigner un conducteur en rotation
  FOR horaire_record IN 
    SELECT id FROM "Horaire" 
    WHERE "dateDepart" >= NOW() 
    ORDER BY "dateDepart"
  LOOP
    -- Assigner le conducteur (rotation circulaire)
    UPDATE "Horaire"
    SET "conducteurId" = conducteur_ids[(conducteur_index % array_length(conducteur_ids, 1)) + 1]
    WHERE id = horaire_record.id;
    
    conducteur_index := conducteur_index + 1;
  END LOOP;
  
  RAISE NOTICE 'Assignation terminée : % horaires assignés à % conducteurs', 
    conducteur_index, array_length(conducteur_ids, 1);
END $$;

-- 4. Vérification : Afficher les horaires de Paul Mbarga
SELECT 
  h.id,
  h."dateDepart",
  h."dateArrivee",
  h.statut,
  t."villeDepart",
  t."villeArrivee",
  v."numeroImmatriculation",
  c.nom as conducteur_nom,
  c.prenom as conducteur_prenom
FROM "Horaire" h
INNER JOIN "Trajet" t ON h."trajetId" = t.id
INNER JOIN "Vehicule" v ON h."vehiculeId" = v.id
INNER JOIN "Conducteur" c ON h."conducteurId" = c.id
WHERE c."userId" = 'user_cond_paul'
  AND h."dateDepart" >= NOW()
ORDER BY h."dateDepart"
LIMIT 10;

-- 5. Statistiques par conducteur
SELECT 
  c.nom,
  c.prenom,
  u.email,
  COUNT(h.id) as nombre_trajets,
  COUNT(CASE WHEN h."dateDepart" >= NOW() THEN 1 END) as trajets_futurs
FROM "Conducteur" c
LEFT JOIN "User" u ON c."userId" = u.id
LEFT JOIN "Horaire" h ON h."conducteurId" = c.id
WHERE c."userId" IS NOT NULL
GROUP BY c.id, c.nom, c.prenom, u.email
ORDER BY c.nom;

-- =====================================================
-- RÉSULTAT ATTENDU
-- =====================================================
/*
Après exécution de ce script :
✅ Tous les horaires futurs sont assignés aux 5 conducteurs
✅ Répartition équitable (rotation circulaire)
✅ Paul Mbarga aura des trajets assignés
✅ Le dashboard conducteur affichera ses trajets
*/
