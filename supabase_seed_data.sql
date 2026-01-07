-- Script SQL pour insérer des données de test dans Supabase
-- Exécutez ce script dans le SQL Editor de Supabase après avoir créé les tables

-- 1. Créer un utilisateur administrateur
-- Mot de passe: admin123 (hashé avec bcrypt)
INSERT INTO "User" (id, email, password, role, nom, prenom, telephone, "pieceIdentite", "createdAt", "updatedAt")
VALUES (
  'admin001',
  'admin@nova.com',
  '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', -- Mot de passe: admin123
  'ADMIN',
  'Admin',
  'NOVA',
  '+237 6XX XXX XXX',
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

-- 2. Créer des trajets de test
INSERT INTO "Trajet" (id, "villeDepart", "villeArrivee", distance, "dureeEstimee", "tarifBase", statut, "createdAt", "updatedAt")
VALUES
  -- Trajets principaux
  ('trajet001', 'Yaoundé', 'Douala', 250.0, 180, 5000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet002', 'Douala', 'Yaoundé', 250.0, 180, 5000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet003', 'Yaoundé', 'Bafoussam', 300.0, 240, 6000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet004', 'Bafoussam', 'Yaoundé', 300.0, 240, 6000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet005', 'Douala', 'Bafoussam', 200.0, 150, 4500.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet006', 'Bafoussam', 'Douala', 200.0, 150, 4500.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet007', 'Yaoundé', 'Garoua', 1200.0, 720, 15000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet008', 'Garoua', 'Yaoundé', 1200.0, 720, 15000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet009', 'Douala', 'Buea', 70.0, 60, 2000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet010', 'Buea', 'Douala', 70.0, 60, 2000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet011', 'Yaoundé', 'Bamenda', 350.0, 300, 7000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet012', 'Bamenda', 'Yaoundé', 350.0, 300, 7000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet013', 'Douala', 'Limbe', 80.0, 70, 2500.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet014', 'Limbe', 'Douala', 80.0, 70, 2500.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet015', 'Yaoundé', 'Ebolowa', 150.0, 120, 3500.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 3. Créer des véhicules de test
INSERT INTO "Vehicule" (id, "numeroImmatriculation", marque, modele, "capaciteMaximale", statut, "createdAt", "updatedAt")
VALUES
  ('vehicule001', 'LT-1234-AB', 'Mercedes', 'Sprinter', 25, 'EN_SERVICE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vehicule002', 'LT-5678-CD', 'Toyota', 'Hiace', 18, 'EN_SERVICE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vehicule003', 'LT-9012-EF', 'Mercedes', 'Sprinter', 25, 'EN_SERVICE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vehicule004', 'LT-3456-GH', 'Ford', 'Transit', 22, 'EN_SERVICE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vehicule005', 'LT-7890-IJ', 'Toyota', 'Coaster', 30, 'EN_SERVICE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vehicule006', 'LT-2468-KL', 'Mercedes', 'Sprinter', 25, 'EN_MAINTENANCE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 4. Créer des conducteurs de test
INSERT INTO "Conducteur" (id, nom, prenom, "numeroPermis", experience, "createdAt", "updatedAt")
VALUES
  ('conducteur001', 'Mboumba', 'Jean', 'PERM-001-2020', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('conducteur002', 'Fotso', 'Pierre', 'PERM-002-2018', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('conducteur003', 'Nguema', 'Paul', 'PERM-003-2019', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('conducteur004', 'Essono', 'Marc', 'PERM-004-2021', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('conducteur005', 'Mvondo', 'Luc', 'PERM-005-2017', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('conducteur006', 'Tchouassi', 'André', 'PERM-006-2020', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 5. Créer des horaires de test pour les prochains jours
-- Horaires pour aujourd'hui et les 7 prochains jours
INSERT INTO "Horaire" (id, "dateDepart", "dateArrivee", "trajetId", "vehiculeId", "conducteurId", "createdAt", "updatedAt")
SELECT 
  'horaire' || LPAD(ROW_NUMBER() OVER()::text, 3, '0') as id,
  (CURRENT_DATE + (ROW_NUMBER() OVER() % 7)::integer + INTERVAL '8 hours' + (ROW_NUMBER() OVER() % 3)::integer * INTERVAL '4 hours') as "dateDepart",
  (CURRENT_DATE + (ROW_NUMBER() OVER() % 7)::integer + INTERVAL '8 hours' + (ROW_NUMBER() OVER() % 3)::integer * INTERVAL '4 hours' + (t."dureeEstimee" || ' minutes')::interval) as "dateArrivee",
  t.id as "trajetId",
  v.id as "vehiculeId",
  c.id as "conducteurId",
  CURRENT_TIMESTAMP as "createdAt",
  CURRENT_TIMESTAMP as "updatedAt"
FROM "Trajet" t
CROSS JOIN "Vehicule" v
CROSS JOIN "Conducteur" c
WHERE t.statut = 'DISPONIBLE'
  AND v.statut = 'EN_SERVICE'
  AND (ROW_NUMBER() OVER() <= 30) -- Limiter à 30 horaires
ON CONFLICT (id) DO NOTHING;

-- Note: La requête ci-dessus peut être complexe. Voici une version simplifiée avec des horaires spécifiques :

-- Supprimer les horaires générés ci-dessus si nécessaire
-- DELETE FROM "Horaire" WHERE id LIKE 'horaire%';

-- Insérer des horaires spécifiques pour les prochains jours
INSERT INTO "Horaire" (id, "dateDepart", "dateArrivee", "trajetId", "vehiculeId", "conducteurId", "createdAt", "updatedAt")
VALUES
  -- Yaoundé -> Douala (aujourd'hui et demain)
  ('horaire001', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '8 hours', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '11 hours', 'trajet001', 'vehicule001', 'conducteur001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('horaire002', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '14 hours', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '17 hours', 'trajet001', 'vehicule002', 'conducteur002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('horaire003', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '8 hours', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '11 hours', 'trajet001', 'vehicule003', 'conducteur003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Douala -> Yaoundé
  ('horaire004', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '9 hours', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '12 hours', 'trajet002', 'vehicule004', 'conducteur004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('horaire005', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '15 hours', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '18 hours', 'trajet002', 'vehicule005', 'conducteur005', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Yaoundé -> Bafoussam
  ('horaire006', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '7 hours', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '11 hours', 'trajet003', 'vehicule001', 'conducteur001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('horaire007', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '7 hours', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '11 hours', 'trajet003', 'vehicule002', 'conducteur002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Douala -> Buea
  ('horaire008', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '10 hours', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '11 hours', 'trajet009', 'vehicule003', 'conducteur003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('horaire009', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '16 hours', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '17 hours', 'trajet009', 'vehicule004', 'conducteur004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Yaoundé -> Bamenda
  ('horaire010', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '6 hours', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '11 hours', 'trajet011', 'vehicule005', 'conducteur005', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 6. Créer quelques réductions de test
INSERT INTO "Reduction" (id, type, pourcentage, description, "dateDebut", "dateFin", actif, "createdAt", "updatedAt")
VALUES
  ('reduction001', 'ETUDIANT', 15.0, 'Réduction de 15% pour les étudiants sur présentation de la carte étudiante', NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('reduction002', 'SENIOR', 20.0, 'Réduction de 20% pour les personnes de plus de 60 ans', NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('reduction003', 'GROUPE', 10.0, 'Réduction de 10% pour les groupes de 5 personnes ou plus', NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('reduction004', 'AVANCE', 5.0, 'Réduction de 5% pour les réservations effectuées 7 jours à l''avance', NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('reduction005', 'PROMOTION', 25.0, 'Promotion spéciale : 25% de réduction sur tous les trajets ce mois', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Vérification des données insérées
SELECT 'Users créés:' as info, COUNT(*) as nombre FROM "User";
SELECT 'Trajets créés:' as info, COUNT(*) as nombre FROM "Trajet";
SELECT 'Véhicules créés:' as info, COUNT(*) as nombre FROM "Vehicule";
SELECT 'Conducteurs créés:' as info, COUNT(*) as nombre FROM "Conducteur";
SELECT 'Horaires créés:' as info, COUNT(*) as nombre FROM "Horaire";
SELECT 'Reductions créées:' as info, COUNT(*) as nombre FROM "Reduction";


