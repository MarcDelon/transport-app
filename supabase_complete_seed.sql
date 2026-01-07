-- Script SQL complet pour remplir la base de données NOVA avec des données de test
-- Exécutez ce script dans le SQL Editor de Supabase
-- Ce script crée des données réalistes pour toutes les tables

-- ============================================
-- 1. UTILISATEURS (Clients et Admin)
-- ============================================

-- Admin (mot de passe: admin123)
INSERT INTO "User" (id, email, password, role, nom, prenom, telephone, "pieceIdentite", "createdAt", "updatedAt")
VALUES (
  'admin001',
  'admin@nova.com',
  '$2a$10$xiSy1ph.5Ipe.ZGQQmHGduqSGSlrqayCN9u2fAI.VLv4ry7Flw1C.', -- admin123 (hash réel)
  'ADMIN',
  'Admin',
  'NOVA',
  '+237 6XX XXX XXX',
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

-- Clients (mots de passe: client123 pour tous)
INSERT INTO "User" (id, email, password, role, nom, prenom, telephone, "pieceIdentite", "createdAt", "updatedAt")
VALUES
  ('client001', 'jean.dupont@email.com', '$2a$10$y5cLZxhbizhe6sHd3IFxguI1.gogEHuBe4hdzPuAPWHnResysanRu', 'CLIENT', 'Dupont', 'Jean', '+237 6XX XXX 001', 'CNI123456', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('client002', 'marie.martin@email.com', '$2a$10$y5cLZxhbizhe6sHd3IFxguI1.gogEHuBe4hdzPuAPWHnResysanRu', 'CLIENT', 'Martin', 'Marie', '+237 6XX XXX 002', 'CNI123457', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('client003', 'pierre.bernard@email.com', '$2a$10$y5cLZxhbizhe6sHd3IFxguI1.gogEHuBe4hdzPuAPWHnResysanRu', 'CLIENT', 'Bernard', 'Pierre', '+237 6XX XXX 003', 'CNI123458', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('client004', 'sophie.durand@email.com', '$2a$10$y5cLZxhbizhe6sHd3IFxguI1.gogEHuBe4hdzPuAPWHnResysanRu', 'CLIENT', 'Durand', 'Sophie', '+237 6XX XXX 004', 'CNI123459', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('client005', 'lucas.leroy@email.com', '$2a$10$y5cLZxhbizhe6sHd3IFxguI1.gogEHuBe4hdzPuAPWHnResysanRu', 'CLIENT', 'Leroy', 'Lucas', '+237 6XX XXX 005', 'CNI123460', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('client006', 'emma.moreau@email.com', '$2a$10$y5cLZxhbizhe6sHd3IFxguI1.gogEHuBe4hdzPuAPWHnResysanRu', 'CLIENT', 'Moreau', 'Emma', '+237 6XX XXX 006', 'CNI123461', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('client007', 'thomas.simon@email.com', '$2a$10$y5cLZxhbizhe6sHd3IFxguI1.gogEHuBe4hdzPuAPWHnResysanRu', 'CLIENT', 'Simon', 'Thomas', '+237 6XX XXX 007', 'CNI123462', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('client008', 'laura.roux@email.com', '$2a$10$y5cLZxhbizhe6sHd3IFxguI1.gogEHuBe4hdzPuAPWHnResysanRu', 'CLIENT', 'Roux', 'Laura', '+237 6XX XXX 008', 'CNI123463', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('client009', 'antoine.vincent@email.com', '$2a$10$y5cLZxhbizhe6sHd3IFxguI1.gogEHuBe4hdzPuAPWHnResysanRu', 'CLIENT', 'Vincent', 'Antoine', '+237 6XX XXX 009', 'CNI123464', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('client010', 'camille.michel@email.com', '$2a$10$y5cLZxhbizhe6sHd3IFxguI1.gogEHuBe4hdzPuAPWHnResysanRu', 'CLIENT', 'Michel', 'Camille', '+237 6XX XXX 010', 'CNI123465', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. TRAJETS
-- ============================================

INSERT INTO "Trajet" (id, "villeDepart", "villeArrivee", distance, "dureeEstimee", "tarifBase", statut, "createdAt", "updatedAt")
VALUES
  -- Trajets principaux
  ('trajet001', 'Yaoundé', 'Douala', 250.0, 180, 5000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet002', 'Douala', 'Yaoundé', 250.0, 180, 5000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet003', 'Yaoundé', 'Bafoussam', 280.0, 240, 6000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet004', 'Bafoussam', 'Yaoundé', 280.0, 240, 6000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet005', 'Douala', 'Bafoussam', 200.0, 180, 4500.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet006', 'Bafoussam', 'Douala', 200.0, 180, 4500.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet007', 'Yaoundé', 'Garoua', 1200.0, 720, 15000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet008', 'Garoua', 'Yaoundé', 1200.0, 720, 15000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet009', 'Douala', 'Buea', 70.0, 90, 3000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet010', 'Buea', 'Douala', 70.0, 90, 3000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet011', 'Yaoundé', 'Bamenda', 350.0, 300, 7000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet012', 'Bamenda', 'Yaoundé', 350.0, 300, 7000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet013', 'Douala', 'Limbe', 80.0, 100, 3500.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet014', 'Limbe', 'Douala', 80.0, 100, 3500.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet015', 'Yaoundé', 'Ebolowa', 150.0, 120, 4000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet016', 'Ebolowa', 'Yaoundé', 150.0, 120, 4000.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet017', 'Yaoundé', 'Bertoua', 320.0, 240, 6500.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet018', 'Bertoua', 'Yaoundé', 320.0, 240, 6500.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet019', 'Douala', 'Kribi', 120.0, 120, 4500.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('trajet020', 'Kribi', 'Douala', 120.0, 120, 4500.0, 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. VÉHICULES
-- ============================================

INSERT INTO "Vehicule" (id, "numeroImmatriculation", marque, modele, "capaciteMaximale", statut, "createdAt", "updatedAt")
VALUES
  ('vehicule001', 'CE-1234-AB', 'Mercedes', 'Sprinter', 25, 'EN_SERVICE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vehicule002', 'CE-5678-CD', 'Toyota', 'Hiace', 22, 'EN_SERVICE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vehicule003', 'CE-9012-EF', 'Ford', 'Transit', 18, 'EN_SERVICE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vehicule004', 'CE-3456-GH', 'Mercedes', 'Sprinter', 30, 'EN_SERVICE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vehicule005', 'CE-7890-IJ', 'Toyota', 'Coaster', 28, 'EN_SERVICE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vehicule006', 'CE-1357-KL', 'Iveco', 'Daily', 20, 'EN_SERVICE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vehicule007', 'CE-2468-MN', 'Mercedes', 'Sprinter', 25, 'EN_MAINTENANCE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vehicule008', 'CE-3691-OP', 'Toyota', 'Hiace', 22, 'EN_SERVICE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vehicule009', 'CE-4826-QR', 'Ford', 'Transit', 18, 'EN_SERVICE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vehicule010', 'CE-5927-ST', 'Mercedes', 'Sprinter', 30, 'EN_SERVICE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. CONDUCTEURS
-- ============================================

INSERT INTO "Conducteur" (id, nom, prenom, "numeroPermis", experience, "createdAt", "updatedAt")
VALUES
  ('conducteur001', 'Kouam', 'Jean', 'PERM001', 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('conducteur002', 'Fotso', 'Pierre', 'PERM002', 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('conducteur003', 'Nguema', 'Marc', 'PERM003', 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('conducteur004', 'Mvondo', 'Paul', 'PERM004', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('conducteur005', 'Tchouassi', 'André', 'PERM005', 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('conducteur006', 'Nkeng', 'Joseph', 'PERM006', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('conducteur007', 'Mvogo', 'Daniel', 'PERM007', 14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('conducteur008', 'Ndong', 'Michel', 'PERM008', 11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('conducteur009', 'Essono', 'Roger', 'PERM009', 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('conducteur010', 'Mvondo', 'Henri', 'PERM010', 16, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. HORAIRES (Pour les prochains jours)
-- ============================================

-- Horaires pour aujourd'hui et les 7 prochains jours
INSERT INTO "Horaire" (id, "dateDepart", "dateArrivee", "trajetId", "vehiculeId", "conducteurId", "createdAt", "updatedAt")
VALUES
  -- Aujourd'hui
  ('horaire001', CURRENT_TIMESTAMP + INTERVAL '2 hours', CURRENT_TIMESTAMP + INTERVAL '5 hours', 'trajet001', 'vehicule001', 'conducteur001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('horaire002', CURRENT_TIMESTAMP + INTERVAL '6 hours', CURRENT_TIMESTAMP + INTERVAL '9 hours', 'trajet002', 'vehicule002', 'conducteur002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('horaire003', CURRENT_TIMESTAMP + INTERVAL '8 hours', CURRENT_TIMESTAMP + INTERVAL '12 hours', 'trajet003', 'vehicule003', 'conducteur003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Demain
  ('horaire004', CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '6 hours', CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '9 hours', 'trajet001', 'vehicule001', 'conducteur001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('horaire005', CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '8 hours', CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '12 hours', 'trajet003', 'vehicule004', 'conducteur004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('horaire006', CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '10 hours', CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '13 hours', 'trajet005', 'vehicule005', 'conducteur005', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Après-demain
  ('horaire007', CURRENT_TIMESTAMP + INTERVAL '2 days' + INTERVAL '6 hours', CURRENT_TIMESTAMP + INTERVAL '2 days' + INTERVAL '9 hours', 'trajet001', 'vehicule002', 'conducteur002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('horaire008', CURRENT_TIMESTAMP + INTERVAL '2 days' + INTERVAL '8 hours', CURRENT_TIMESTAMP + INTERVAL '2 days' + INTERVAL '12 hours', 'trajet007', 'vehicule006', 'conducteur006', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('horaire009', CURRENT_TIMESTAMP + INTERVAL '2 days' + INTERVAL '14 hours', CURRENT_TIMESTAMP + INTERVAL '2 days' + INTERVAL '17 hours', 'trajet009', 'vehicule008', 'conducteur007', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- J+3
  ('horaire010', CURRENT_TIMESTAMP + INTERVAL '3 days' + INTERVAL '6 hours', CURRENT_TIMESTAMP + INTERVAL '3 days' + INTERVAL '9 hours', 'trajet001', 'vehicule001', 'conducteur001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('horaire011', CURRENT_TIMESTAMP + INTERVAL '3 days' + INTERVAL '10 hours', CURRENT_TIMESTAMP + INTERVAL '3 days' + INTERVAL '14 hours', 'trajet011', 'vehicule009', 'conducteur008', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- J+4
  ('horaire012', CURRENT_TIMESTAMP + INTERVAL '4 days' + INTERVAL '6 hours', CURRENT_TIMESTAMP + INTERVAL '4 days' + INTERVAL '9 hours', 'trajet001', 'vehicule003', 'conducteur003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('horaire013', CURRENT_TIMESTAMP + INTERVAL '4 days' + INTERVAL '8 hours', CURRENT_TIMESTAMP + INTERVAL '4 days' + INTERVAL '12 hours', 'trajet013', 'vehicule010', 'conducteur009', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- J+5
  ('horaire014', CURRENT_TIMESTAMP + INTERVAL '5 days' + INTERVAL '6 hours', CURRENT_TIMESTAMP + INTERVAL '5 days' + INTERVAL '9 hours', 'trajet001', 'vehicule001', 'conducteur001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('horaire015', CURRENT_TIMESTAMP + INTERVAL '5 days' + INTERVAL '14 hours', CURRENT_TIMESTAMP + INTERVAL '5 days' + INTERVAL '17 hours', 'trajet015', 'vehicule005', 'conducteur010', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- J+6
  ('horaire016', CURRENT_TIMESTAMP + INTERVAL '6 days' + INTERVAL '6 hours', CURRENT_TIMESTAMP + INTERVAL '6 days' + INTERVAL '9 hours', 'trajet001', 'vehicule002', 'conducteur002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('horaire017', CURRENT_TIMESTAMP + INTERVAL '6 days' + INTERVAL '10 hours', CURRENT_TIMESTAMP + INTERVAL '6 days' + INTERVAL '14 hours', 'trajet017', 'vehicule006', 'conducteur004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- J+7
  ('horaire018', CURRENT_TIMESTAMP + INTERVAL '7 days' + INTERVAL '6 hours', CURRENT_TIMESTAMP + INTERVAL '7 days' + INTERVAL '9 hours', 'trajet001', 'vehicule001', 'conducteur001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('horaire019', CURRENT_TIMESTAMP + INTERVAL '7 days' + INTERVAL '8 hours', CURRENT_TIMESTAMP + INTERVAL '7 days' + INTERVAL '12 hours', 'trajet019', 'vehicule008', 'conducteur005', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('horaire020', CURRENT_TIMESTAMP + INTERVAL '7 days' + INTERVAL '14 hours', CURRENT_TIMESTAMP + INTERVAL '7 days' + INTERVAL '17 hours', 'trajet002', 'vehicule009', 'conducteur006', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. RÉSERVATIONS
-- ============================================

INSERT INTO "Reservation" (id, "userId", "horaireId", "nombrePlaces", "numeroSiege", statut, "createdAt", "updatedAt")
VALUES
  ('reserv001', 'client001', 'horaire001', 2, 'A1,A2', 'CONFIRMEE', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ('reserv002', 'client002', 'horaire001', 1, 'B3', 'CONFIRMEE', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ('reserv003', 'client003', 'horaire004', 3, 'C1,C2,C3', 'EN_ATTENTE', CURRENT_TIMESTAMP - INTERVAL '12 hours', CURRENT_TIMESTAMP - INTERVAL '12 hours'),
  ('reserv004', 'client004', 'horaire004', 1, 'D5', 'CONFIRMEE', CURRENT_TIMESTAMP - INTERVAL '6 hours', CURRENT_TIMESTAMP - INTERVAL '6 hours'),
  ('reserv005', 'client005', 'horaire007', 2, 'E1,E2', 'CONFIRMEE', CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
  ('reserv006', 'client006', 'horaire010', 1, 'F4', 'EN_ATTENTE', CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
  ('reserv007', 'client007', 'horaire012', 4, 'G1,G2,G3,G4', 'CONFIRMEE', CURRENT_TIMESTAMP - INTERVAL '30 minutes', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
  ('reserv008', 'client008', 'horaire014', 2, 'H1,H2', 'EN_ATTENTE', CURRENT_TIMESTAMP - INTERVAL '15 minutes', CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
  ('reserv009', 'client009', 'horaire016', 1, 'I3', 'CONFIRMEE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('reserv010', 'client010', 'horaire018', 3, 'J1,J2,J3', 'EN_ATTENTE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. PAIEMENTS
-- ============================================

INSERT INTO "Paiement" (id, "reservationId", "userId", montant, "methodePaiement", "datePaiement", "numeroFacture", "createdAt", "updatedAt")
VALUES
  ('paiement001', 'reserv001', 'client001', 10000.0, 'CARTE_BANCAIRE', CURRENT_TIMESTAMP - INTERVAL '2 days', 'FACT-001', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ('paiement002', 'reserv002', 'client002', 5000.0, 'MOBILE_MONEY', CURRENT_TIMESTAMP - INTERVAL '1 day', 'FACT-002', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ('paiement003', 'reserv004', 'client004', 5000.0, 'CARTE_BANCAIRE', CURRENT_TIMESTAMP - INTERVAL '6 hours', 'FACT-003', CURRENT_TIMESTAMP - INTERVAL '6 hours', CURRENT_TIMESTAMP - INTERVAL '6 hours'),
  ('paiement004', 'reserv005', 'client005', 10000.0, 'MOBILE_MONEY', CURRENT_TIMESTAMP - INTERVAL '3 hours', 'FACT-004', CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
  ('paiement005', 'reserv007', 'client007', 20000.0, 'CARTE_BANCAIRE', CURRENT_TIMESTAMP - INTERVAL '30 minutes', 'FACT-005', CURRENT_TIMESTAMP - INTERVAL '30 minutes', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
  ('paiement006', 'reserv009', 'client009', 5000.0, 'ESPECES', CURRENT_TIMESTAMP, 'FACT-006', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. ABONNEMENTS
-- ============================================

INSERT INTO "Abonnement" (id, "userId", type, "dateDebut", "dateFin", reduction, "trajetsInclus", "createdAt", "updatedAt")
VALUES
  ('abonnement001', 'client001', 'MENSUEL', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP + INTERVAL '20 days', 15.0, 10, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '10 days'),
  ('abonnement002', 'client003', 'ANNUEL', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP + INTERVAL '335 days', 20.0, 120, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '30 days'),
  ('abonnement003', 'client005', 'MENSUEL', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '25 days', 15.0, 10, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '5 days'),
  ('abonnement004', 'client007', 'ANNUEL', CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_TIMESTAMP + INTERVAL '305 days', 20.0, 120, CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_TIMESTAMP - INTERVAL '60 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 9. RÉDUCTIONS
-- ============================================

INSERT INTO "Reduction" (id, type, pourcentage, description, "dateDebut", "dateFin", actif, "createdAt", "updatedAt")
VALUES
  ('reduction001', 'ETUDIANT', 15.0, 'Réduction pour les étudiants sur présentation de la carte étudiante', NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('reduction002', 'SENIOR', 20.0, 'Réduction pour les personnes de plus de 60 ans', NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('reduction003', 'GROUPE', 10.0, 'Réduction pour les groupes de 5 personnes ou plus', NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('reduction004', 'EARLY_BIRD', 5.0, 'Réduction pour les réservations effectuées 7 jours à l''avance', NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('reduction005', 'PROMOTION', 25.0, 'Promotion spéciale été 2024', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '90 days', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 10. BAGAGES
-- ============================================

INSERT INTO "Bagage" (id, "reservationId", poids, volume, "estGratuit", supplement, etiquette, "createdAt", "updatedAt")
VALUES
  ('bagage001', 'reserv001', 15.0, 0.05, true, NULL, 'BAG-001', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ('bagage002', 'reserv001', 25.0, 0.08, false, 2000.0, 'BAG-002', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ('bagage003', 'reserv003', 12.0, 0.04, true, NULL, 'BAG-003', CURRENT_TIMESTAMP - INTERVAL '12 hours', CURRENT_TIMESTAMP - INTERVAL '12 hours'),
  ('bagage004', 'reserv005', 30.0, 0.10, false, 3000.0, 'BAG-004', CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
  ('bagage005', 'reserv007', 18.0, 0.06, true, NULL, 'BAG-005', CURRENT_TIMESTAMP - INTERVAL '30 minutes', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
  ('bagage006', 'reserv007', 22.0, 0.07, false, 2500.0, 'BAG-006', CURRENT_TIMESTAMP - INTERVAL '30 minutes', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
  ('bagage007', 'reserv009', 10.0, 0.03, true, NULL, 'BAG-007', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Afficher le nombre d'enregistrements créés
SELECT 
  'User' as table_name, COUNT(*) as count FROM "User"
UNION ALL
SELECT 'Trajet', COUNT(*) FROM "Trajet"
UNION ALL
SELECT 'Vehicule', COUNT(*) FROM "Vehicule"
UNION ALL
SELECT 'Conducteur', COUNT(*) FROM "Conducteur"
UNION ALL
SELECT 'Horaire', COUNT(*) FROM "Horaire"
UNION ALL
SELECT 'Reservation', COUNT(*) FROM "Reservation"
UNION ALL
SELECT 'Paiement', COUNT(*) FROM "Paiement"
UNION ALL
SELECT 'Abonnement', COUNT(*) FROM "Abonnement"
UNION ALL
SELECT 'Reduction', COUNT(*) FROM "Reduction"
UNION ALL
SELECT 'Bagage', COUNT(*) FROM "Bagage";

