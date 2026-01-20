-- =====================================================
-- VERSION SIMPLE : CRÉER DES HORAIRES POUR AUJOURD'HUI
-- =====================================================

-- 1. Récupérer l'ID du conducteur Paul Mbarga
DO $$
DECLARE
  paul_conducteur_id TEXT;
  trajet_id TEXT;
  vehicule_id TEXT;
BEGIN
  -- Trouver l'ID du conducteur Paul Mbarga
  SELECT id INTO paul_conducteur_id 
  FROM "Conducteur" 
  WHERE "userId" = 'user_cond_paul' 
  LIMIT 1;
  
  -- Trouver un trajet
  SELECT id INTO trajet_id 
  FROM "Trajet" 
  LIMIT 1;
  
  -- Trouver un véhicule
  SELECT id INTO vehicule_id 
  FROM "Vehicule" 
  LIMIT 1;
  
  -- Créer horaire 1 : 08h00 - 12h00
  INSERT INTO "Horaire" (id, "dateDepart", "dateArrivee", "trajetId", "vehiculeId", "conducteurId", statut, "createdAt", "updatedAt")
  VALUES (
    'horaire_paul_1',
    '2026-01-20 08:00:00'::timestamp,
    '2026-01-20 12:00:00'::timestamp,
    trajet_id,
    vehicule_id,
    paul_conducteur_id,
    'PROGRAMME',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET "conducteurId" = paul_conducteur_id;
  
  -- Créer horaire 2 : 14h00 - 18h00
  INSERT INTO "Horaire" (id, "dateDepart", "dateArrivee", "trajetId", "vehiculeId", "conducteurId", statut, "createdAt", "updatedAt")
  VALUES (
    'horaire_paul_2',
    '2026-01-20 14:00:00'::timestamp,
    '2026-01-20 18:00:00'::timestamp,
    trajet_id,
    vehicule_id,
    paul_conducteur_id,
    'PROGRAMME',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET "conducteurId" = paul_conducteur_id;
  
  RAISE NOTICE 'Horaires créés pour Paul Mbarga (ID: %)', paul_conducteur_id;
END $$;

-- 2. Vérification : Afficher les horaires de Paul Mbarga pour aujourd'hui
SELECT 
  h.id,
  h."dateDepart",
  h."dateArrivee",
  h.statut,
  t."villeDepart",
  t."villeArrivee",
  v."numeroImmatriculation",
  c.nom,
  c.prenom
FROM "Horaire" h
INNER JOIN "Trajet" t ON h."trajetId" = t.id
INNER JOIN "Vehicule" v ON h."vehiculeId" = v.id
INNER JOIN "Conducteur" c ON h."conducteurId" = c.id
WHERE c."userId" = 'user_cond_paul'
  AND DATE(h."dateDepart") = '2026-01-20'
ORDER BY h."dateDepart";

-- =====================================================
-- RÉSULTAT ATTENDU
-- =====================================================
/*
✅ 2 horaires créés pour Paul Mbarga le 20 janvier 2026
  - Horaire 1 : 08h00 - 12h00
  - Horaire 2 : 14h00 - 18h00
✅ Le dashboard conducteur affichera ces 2 trajets
*/
