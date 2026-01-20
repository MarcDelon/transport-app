-- =====================================================
-- 6.1 SCRIPT DE PEUPLEMENT DE LA BASE DE DONNÉES
-- Insertion de données de test (5-10 lignes par table)
-- =====================================================

-- =====================================================
-- TABLE USER (Utilisateurs)
-- =====================================================

INSERT INTO "User" ("id", "email", "password", "role", "nom", "prenom", "telephone", "pieceIdentite", "createdAt", "updatedAt") VALUES
('user_001', 'admin@nova.sn', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', 'ADMIN', 'Diop', 'Amadou', '+221771234567', 'CNI123456', NOW(), NOW()),
('user_002', 'client1@gmail.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', 'CLIENT', 'Ndiaye', 'Fatou', '+221772345678', 'CNI234567', NOW(), NOW()),
('user_003', 'client2@gmail.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', 'CLIENT', 'Sow', 'Moussa', '+221773456789', 'CNI345678', NOW(), NOW()),
('user_004', 'client3@gmail.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', 'CLIENT', 'Fall', 'Aissatou', '+221774567890', 'CNI456789', NOW(), NOW()),
('user_005', 'client4@gmail.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', 'CLIENT', 'Sarr', 'Ibrahima', '+221775678901', 'CNI567890', NOW(), NOW()),
('user_006', 'client5@gmail.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', 'CLIENT', 'Gueye', 'Mariama', '+221776789012', 'CNI678901', NOW(), NOW()),
('user_007', 'client6@gmail.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', 'CLIENT', 'Ba', 'Ousmane', '+221777890123', 'CNI789012', NOW(), NOW()),
('user_008', 'admin2@nova.sn', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', 'ADMIN', 'Cisse', 'Awa', '+221778901234', 'CNI890123', NOW(), NOW());

-- =====================================================
-- TABLE TRAJET (Routes)
-- =====================================================

INSERT INTO "Trajet" ("id", "villeDepart", "villeArrivee", "distance", "dureeEstimee", "tarifBase", "statut", "createdAt", "updatedAt") VALUES
('trajet_001', 'Dakar', 'Saint-Louis', 270, 240, 5000, 'DISPONIBLE', NOW(), NOW()),
('trajet_002', 'Dakar', 'Thiès', 70, 60, 2000, 'DISPONIBLE', NOW(), NOW()),
('trajet_003', 'Dakar', 'Kaolack', 195, 180, 4000, 'DISPONIBLE', NOW(), NOW()),
('trajet_004', 'Dakar', 'Ziguinchor', 450, 480, 8000, 'DISPONIBLE', NOW(), NOW()),
('trajet_005', 'Saint-Louis', 'Thiès', 200, 180, 3500, 'DISPONIBLE', NOW(), NOW()),
('trajet_006', 'Thiès', 'Kaolack', 125, 120, 2500, 'DISPONIBLE', NOW(), NOW()),
('trajet_007', 'Dakar', 'Touba', 195, 180, 4000, 'DISPONIBLE', NOW(), NOW()),
('trajet_008', 'Dakar', 'Mbour', 80, 90, 2500, 'DISPONIBLE', NOW(), NOW()),
('trajet_009', 'Kaolack', 'Tambacounda', 210, 240, 5000, 'DISPONIBLE', NOW(), NOW()),
('trajet_010', 'Saint-Louis', 'Louga', 90, 90, 2000, 'DISPONIBLE', NOW(), NOW());

-- =====================================================
-- TABLE VEHICULE (Véhicules)
-- =====================================================

INSERT INTO "Vehicule" ("id", "numeroImmatriculation", "marque", "modele", "capaciteMaximale", "statut", "createdAt", "updatedAt") VALUES
('vehicule_001', 'DK-1234-A', 'Mercedes-Benz', 'Sprinter', 45, 'EN_SERVICE', NOW(), NOW()),
('vehicule_002', 'DK-2345-B', 'Iveco', 'Daily', 35, 'EN_SERVICE', NOW(), NOW()),
('vehicule_003', 'DK-3456-C', 'Volkswagen', 'Crafter', 40, 'EN_SERVICE', NOW(), NOW()),
('vehicule_004', 'DK-4567-D', 'Mercedes-Benz', 'Tourismo', 50, 'EN_SERVICE', NOW(), NOW()),
('vehicule_005', 'DK-5678-E', 'Renault', 'Master', 30, 'EN_MAINTENANCE', NOW(), NOW()),
('vehicule_006', 'DK-6789-F', 'Fiat', 'Ducato', 35, 'EN_SERVICE', NOW(), NOW()),
('vehicule_007', 'DK-7890-G', 'Mercedes-Benz', 'Sprinter', 45, 'EN_SERVICE', NOW(), NOW()),
('vehicule_008', 'DK-8901-H', 'Iveco', 'Eurocargo', 40, 'HORS_SERVICE', NOW(), NOW());

-- =====================================================
-- TABLE CONDUCTEUR (Chauffeurs)
-- =====================================================

INSERT INTO "Conducteur" ("id", "nom", "prenom", "numeroPermis", "experience", "createdAt", "updatedAt") VALUES
('conducteur_001', 'Diallo', 'Mamadou', 'PERMIS001', 15, NOW(), NOW()),
('conducteur_002', 'Thiam', 'Cheikh', 'PERMIS002', 10, NOW(), NOW()),
('conducteur_003', 'Kane', 'Abdoulaye', 'PERMIS003', 8, NOW(), NOW()),
('conducteur_004', 'Sy', 'Boubacar', 'PERMIS004', 12, NOW(), NOW()),
('conducteur_005', 'Diouf', 'Malick', 'PERMIS005', 20, NOW(), NOW()),
('conducteur_006', 'Mbaye', 'Saliou', 'PERMIS006', 7, NOW(), NOW()),
('conducteur_007', 'Ndao', 'Pape', 'PERMIS007', 9, NOW(), NOW()),
('conducteur_008', 'Faye', 'Lamine', 'PERMIS008', 11, NOW(), NOW());

-- =====================================================
-- TABLE HORAIRE (Planification)
-- =====================================================

INSERT INTO "Horaire" ("id", "dateDepart", "dateArrivee", "trajetId", "vehiculeId", "conducteurId", "createdAt", "updatedAt") VALUES
('horaire_001', '2026-01-25 08:00:00', '2026-01-25 12:00:00', 'trajet_001', 'vehicule_001', 'conducteur_001', NOW(), NOW()),
('horaire_002', '2026-01-25 09:00:00', '2026-01-25 10:00:00', 'trajet_002', 'vehicule_002', 'conducteur_002', NOW(), NOW()),
('horaire_003', '2026-01-25 10:00:00', '2026-01-25 13:00:00', 'trajet_003', 'vehicule_003', 'conducteur_003', NOW(), NOW()),
('horaire_004', '2026-01-26 06:00:00', '2026-01-26 14:00:00', 'trajet_004', 'vehicule_004', 'conducteur_004', NOW(), NOW()),
('horaire_005', '2026-01-26 08:00:00', '2026-01-26 11:00:00', 'trajet_005', 'vehicule_006', 'conducteur_005', NOW(), NOW()),
('horaire_006', '2026-01-26 14:00:00', '2026-01-26 16:00:00', 'trajet_006', 'vehicule_007', 'conducteur_006', NOW(), NOW()),
('horaire_007', '2026-01-27 07:00:00', '2026-01-27 10:00:00', 'trajet_007', 'vehicule_001', 'conducteur_007', NOW(), NOW()),
('horaire_008', '2026-01-27 15:00:00', '2026-01-27 16:30:00', 'trajet_008', 'vehicule_002', 'conducteur_008', NOW(), NOW()),
('horaire_009', '2026-01-28 09:00:00', '2026-01-28 13:00:00', 'trajet_009', 'vehicule_003', 'conducteur_001', NOW(), NOW()),
('horaire_010', '2026-01-28 11:00:00', '2026-01-28 12:30:00', 'trajet_010', 'vehicule_004', 'conducteur_002', NOW(), NOW());

-- =====================================================
-- TABLE RESERVATION (Réservations)
-- =====================================================

INSERT INTO "Reservation" ("id", "userId", "horaireId", "nombrePlaces", "numeroSiege", "statut", "createdAt", "updatedAt") VALUES
('reservation_001', 'user_002', 'horaire_001', 2, 'A1,A2', 'CONFIRMEE', NOW(), NOW()),
('reservation_002', 'user_003', 'horaire_002', 1, 'B5', 'CONFIRMEE', NOW(), NOW()),
('reservation_003', 'user_004', 'horaire_003', 3, 'C1,C2,C3', 'CONFIRMEE', NOW(), NOW()),
('reservation_004', 'user_005', 'horaire_004', 1, 'D10', 'EN_ATTENTE', NOW(), NOW()),
('reservation_005', 'user_006', 'horaire_005', 2, 'E3,E4', 'CONFIRMEE', NOW(), NOW()),
('reservation_006', 'user_007', 'horaire_006', 1, 'F7', 'CONFIRMEE', NOW(), NOW()),
('reservation_007', 'user_002', 'horaire_007', 4, 'G1,G2,G3,G4', 'CONFIRMEE', NOW(), NOW()),
('reservation_008', 'user_003', 'horaire_008', 2, 'H5,H6', 'ANNULEE', NOW(), NOW());

-- =====================================================
-- TABLE PAIEMENT (Paiements)
-- =====================================================

INSERT INTO "Paiement" ("id", "reservationId", "userId", "montant", "methodePaiement", "datePaiement", "numeroFacture", "createdAt", "updatedAt") VALUES
('paiement_001', 'reservation_001', 'user_002', 10000, 'MOBILE_MONEY', NOW(), 'FACT-2026-001', NOW(), NOW()),
('paiement_002', 'reservation_002', 'user_003', 2000, 'CARTE_BANCAIRE', NOW(), 'FACT-2026-002', NOW(), NOW()),
('paiement_003', 'reservation_003', 'user_004', 12000, 'ESPECES', NOW(), 'FACT-2026-003', NOW(), NOW()),
('paiement_004', 'reservation_005', 'user_006', 7000, 'MOBILE_MONEY', NOW(), 'FACT-2026-004', NOW(), NOW()),
('paiement_005', 'reservation_006', 'user_007', 2500, 'CARTE_BANCAIRE', NOW(), 'FACT-2026-005', NOW(), NOW()),
('paiement_006', 'reservation_007', 'user_002', 16000, 'MOBILE_MONEY', NOW(), 'FACT-2026-006', NOW(), NOW());

-- =====================================================
-- TABLE ABONNEMENT (Abonnements)
-- =====================================================

INSERT INTO "Abonnement" ("id", "userId", "type", "dateDebut", "dateFin", "reduction", "trajetsInclus", "createdAt", "updatedAt") VALUES
('abonnement_001', 'user_002', 'MENSUEL', '2026-01-01', '2026-01-31', 15, 10, NOW(), NOW()),
('abonnement_002', 'user_003', 'ANNUEL', '2026-01-01', '2026-12-31', 25, 100, NOW(), NOW()),
('abonnement_003', 'user_004', 'MENSUEL', '2026-01-15', '2026-02-14', 15, 10, NOW(), NOW()),
('abonnement_004', 'user_006', 'ANNUEL', '2025-12-01', '2026-11-30', 25, 100, NOW(), NOW()),
('abonnement_005', 'user_007', 'MENSUEL', '2026-01-10', '2026-02-09', 15, 10, NOW(), NOW());

-- =====================================================
-- TABLE REDUCTION (Promotions)
-- =====================================================

INSERT INTO "Reduction" ("id", "type", "pourcentage", "description", "dateDebut", "dateFin", "actif", "createdAt", "updatedAt") VALUES
('reduction_001', 'ETUDIANT', 20, 'Réduction pour les étudiants', '2026-01-01', '2026-12-31', true, NOW(), NOW()),
('reduction_002', 'SENIOR', 15, 'Réduction pour les personnes âgées (60+)', '2026-01-01', '2026-12-31', true, NOW(), NOW()),
('reduction_003', 'FAMILLE', 10, 'Réduction famille nombreuse (4+ personnes)', '2026-01-01', '2026-12-31', true, NOW(), NOW()),
('reduction_004', 'PROMO_RAMADAN', 25, 'Promotion spéciale Ramadan', '2026-03-01', '2026-04-30', true, NOW(), NOW()),
('reduction_005', 'EARLY_BIRD', 30, 'Réservation anticipée (30 jours avant)', '2026-01-01', '2026-12-31', true, NOW(), NOW()),
('reduction_006', 'WEEKEND', 5, 'Réduction weekend', '2026-01-01', '2026-12-31', false, NOW(), NOW());

-- =====================================================
-- TABLE BAGAGE (Bagages)
-- =====================================================

INSERT INTO "Bagage" ("id", "reservationId", "poids", "volume", "estGratuit", "supplement", "etiquette", "createdAt", "updatedAt") VALUES
('bagage_001', 'reservation_001', 15, 0.5, true, NULL, 'BAG-001', NOW(), NOW()),
('bagage_002', 'reservation_001', 8, 0.3, true, NULL, 'BAG-002', NOW(), NOW()),
('bagage_003', 'reservation_002', 25, 0.8, false, 2000, 'BAG-003', NOW(), NOW()),
('bagage_004', 'reservation_003', 12, 0.4, true, NULL, 'BAG-004', NOW(), NOW()),
('bagage_005', 'reservation_005', 18, 0.6, true, NULL, 'BAG-005', NOW(), NOW()),
('bagage_006', 'reservation_006', 10, 0.35, true, NULL, 'BAG-006', NOW(), NOW()),
('bagage_007', 'reservation_007', 30, 1.0, false, 3000, 'BAG-007', NOW(), NOW()),
('bagage_008', 'reservation_007', 22, 0.7, false, 1500, 'BAG-008', NOW(), NOW());

-- =====================================================
-- FIN DU SCRIPT DE PEUPLEMENT
-- =====================================================
