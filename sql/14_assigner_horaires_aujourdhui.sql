-- =====================================================
-- ASSIGNER DES HORAIRES POUR AUJOURD'HUI (20 JANVIER 2026)
-- =====================================================

-- 1. Vérifier les conducteurs
SELECT 
  c.id,
  c.nom,
  c.prenom,
  c."userId"
FROM "Conducteur" c
WHERE c."userId" IS NOT NULL
ORDER BY c.nom;

-- 2. Vérifier les horaires existants pour aujourd'hui
SELECT 
  h.id,
  h."dateDepart",
  h."conducteurId",
  t."villeDepart",
  t."villeArrivee"
FROM "Horaire" h
INNER JOIN "Trajet" t ON h."trajetId" = t.id
WHERE DATE(h."dateDepart") = '2026-01-20'
ORDER BY h."dateDepart"
LIMIT 20;

-- 3. Créer des horaires pour AUJOURD'HUI si nécessaire
-- Insérer 5 horaires pour aujourd'hui avec rotation des conducteurs
INSERT INTO "Horaire" (id, "dateDepart", "dateArrivee", "trajetId", "vehiculeId", "conducteurId", statut, "createdAt", "updatedAt")
SELECT 
  'horaire_today_' || t.rn as id,
  ('2026-01-20 ' || LPAD((8 + (t.rn - 1) * 2)::text, 2, '0') || ':00:00')::timestamp as "dateDepart",
  ('2026-01-20 ' || LPAD((12 + (t.rn - 1) * 2)::text, 2, '0') || ':00:00')::timestamp as "dateArrivee",
  t.id as "trajetId",
  v.id as "vehiculeId",
  c.id as "conducteurId",
  'PROGRAMME' as statut,
  NOW() as "createdAt",
  NOW() as "updatedAt"
FROM 
  (SELECT id, row_number() OVER (ORDER BY id) as rn FROM "Trajet" LIMIT 5) t
  CROSS JOIN LATERAL (SELECT id FROM "Vehicule" LIMIT 1 OFFSET (t.rn - 1) % (SELECT COUNT(*) FROM "Vehicule")) v
  CROSS JOIN LATERAL (SELECT id FROM "Conducteur" WHERE "userId" IS NOT NULL ORDER BY nom LIMIT 1 OFFSET (t.rn - 1) % 5) c
ON CONFLICT (id) DO NOTHING;

-- 4. Assigner Paul Mbarga à au moins 2 horaires d'aujourd'hui
UPDATE "Horaire"
SET "conducteurId" = (SELECT id FROM "Conducteur" WHERE "userId" = 'user_cond_paul' LIMIT 1)
WHERE id IN (
  SELECT id FROM "Horaire"
  WHERE DATE("dateDepart") = '2026-01-20'
  ORDER BY "dateDepart"
  LIMIT 2
);

-- 5. Vérification : Horaires de Paul Mbarga pour aujourd'hui
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

-- 6. Statistiques globales
SELECT 
  DATE(h."dateDepart") as date,
  COUNT(*) as nombre_horaires,
  COUNT(DISTINCT h."conducteurId") as nombre_conducteurs
FROM "Horaire" h
WHERE DATE(h."dateDepart") = '2026-01-20'
GROUP BY DATE(h."dateDepart");

-- =====================================================
-- RÉSULTAT ATTENDU
-- =====================================================
/*
✅ Au moins 2 horaires créés pour aujourd'hui (20 janvier 2026)
✅ Paul Mbarga assigné à au moins 2 trajets
✅ Le dashboard conducteur affichera ses trajets
*/
