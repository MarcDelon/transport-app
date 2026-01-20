-- =====================================================
-- 6.2 REQUÊTES SQL AVANCÉES
-- 10-15 requêtes avec jointures, sous-requêtes, agrégations, vues
-- =====================================================

-- =====================================================
-- 1. JOINTURE SIMPLE : Liste des horaires avec détails du trajet
-- =====================================================
SELECT 
    h."id" AS horaire_id,
    h."dateDepart",
    h."dateArrivee",
    t."villeDepart",
    t."villeArrivee",
    t."tarifBase",
    v."numeroImmatriculation",
    v."marque",
    c."nom" AS conducteur_nom,
    c."prenom" AS conducteur_prenom
FROM "Horaire" h
INNER JOIN "Trajet" t ON h."trajetId" = t."id"
INNER JOIN "Vehicule" v ON h."vehiculeId" = v."id"
INNER JOIN "Conducteur" c ON h."conducteurId" = c."id"
WHERE h."dateDepart" >= CURRENT_DATE
ORDER BY h."dateDepart";

-- =====================================================
-- 2. JOINTURE MULTIPLE : Réservations complètes avec informations client et paiement
-- =====================================================
SELECT 
    r."id" AS reservation_id,
    u."nom" || ' ' || u."prenom" AS client,
    u."email",
    u."telephone",
    t."villeDepart",
    t."villeArrivee",
    h."dateDepart",
    r."nombrePlaces",
    r."statut" AS statut_reservation,
    p."montant",
    p."methodePaiement",
    p."numeroFacture"
FROM "Reservation" r
INNER JOIN "User" u ON r."userId" = u."id"
INNER JOIN "Horaire" h ON r."horaireId" = h."id"
INNER JOIN "Trajet" t ON h."trajetId" = t."id"
LEFT JOIN "Paiement" p ON r."id" = p."reservationId"
ORDER BY h."dateDepart" DESC;

-- =====================================================
-- 3. AGRÉGATION : Statistiques par trajet
-- =====================================================
SELECT 
    t."villeDepart",
    t."villeArrivee",
    COUNT(DISTINCT h."id") AS nombre_horaires,
    COUNT(DISTINCT r."id") AS nombre_reservations,
    SUM(r."nombrePlaces") AS total_places_reservees,
    AVG(t."tarifBase") AS tarif_moyen,
    SUM(p."montant") AS revenu_total
FROM "Trajet" t
LEFT JOIN "Horaire" h ON t."id" = h."trajetId"
LEFT JOIN "Reservation" r ON h."id" = r."horaireId"
LEFT JOIN "Paiement" p ON r."id" = p."reservationId"
GROUP BY t."id", t."villeDepart", t."villeArrivee"
ORDER BY revenu_total DESC NULLS LAST;

-- =====================================================
-- 4. SOUS-REQUÊTE : Clients ayant réservé plus de 2 fois
-- =====================================================
SELECT 
    u."id",
    u."nom",
    u."prenom",
    u."email",
    (SELECT COUNT(*) FROM "Reservation" WHERE "userId" = u."id") AS nombre_reservations,
    (SELECT SUM("montant") FROM "Paiement" WHERE "userId" = u."id") AS total_depense
FROM "User" u
WHERE u."role" = 'CLIENT'
AND (SELECT COUNT(*) FROM "Reservation" WHERE "userId" = u."id") > 2
ORDER BY nombre_reservations DESC;

-- =====================================================
-- 5. SOUS-REQUÊTE CORRÉLÉE : Horaires avec taux d'occupation
-- =====================================================
SELECT 
    h."id",
    t."villeDepart" || ' → ' || t."villeArrivee" AS trajet,
    h."dateDepart",
    v."capaciteMaximale",
    (SELECT COALESCE(SUM(r."nombrePlaces"), 0) 
     FROM "Reservation" r 
     WHERE r."horaireId" = h."id" 
     AND r."statut" != 'ANNULEE') AS places_reservees,
    ROUND((SELECT COALESCE(SUM(r."nombrePlaces"), 0) 
           FROM "Reservation" r 
           WHERE r."horaireId" = h."id" 
           AND r."statut" != 'ANNULEE') * 100.0 / v."capaciteMaximale", 2) AS taux_occupation
FROM "Horaire" h
INNER JOIN "Trajet" t ON h."trajetId" = t."id"
INNER JOIN "Vehicule" v ON h."vehiculeId" = v."id"
ORDER BY h."dateDepart";

-- =====================================================
-- 6. AGRÉGATION AVEC HAVING : Trajets populaires (plus de 5 réservations)
-- =====================================================
SELECT 
    t."villeDepart",
    t."villeArrivee",
    COUNT(r."id") AS nombre_reservations,
    SUM(r."nombrePlaces") AS total_passagers,
    AVG(p."montant") AS montant_moyen
FROM "Trajet" t
INNER JOIN "Horaire" h ON t."id" = h."trajetId"
INNER JOIN "Reservation" r ON h."id" = r."horaireId"
LEFT JOIN "Paiement" p ON r."id" = p."reservationId"
GROUP BY t."id", t."villeDepart", t."villeArrivee"
HAVING COUNT(r."id") >= 2
ORDER BY nombre_reservations DESC;

-- =====================================================
-- 7. JOINTURE EXTERNE : Véhicules et leur utilisation
-- =====================================================
SELECT 
    v."id",
    v."numeroImmatriculation",
    v."marque",
    v."modele",
    v."statut",
    COUNT(h."id") AS nombre_trajets_planifies,
    COALESCE(SUM(r."nombrePlaces"), 0) AS total_passagers_transportes
FROM "Vehicule" v
LEFT JOIN "Horaire" h ON v."id" = h."vehiculeId"
LEFT JOIN "Reservation" r ON h."id" = r."horaireId" AND r."statut" = 'CONFIRMEE'
GROUP BY v."id", v."numeroImmatriculation", v."marque", v."modele", v."statut"
ORDER BY nombre_trajets_planifies DESC;

-- =====================================================
-- 8. SOUS-REQUÊTE AVEC IN : Conducteurs les plus actifs
-- =====================================================
SELECT 
    c."id",
    c."nom",
    c."prenom",
    c."numeroPermis",
    c."experience",
    COUNT(h."id") AS nombre_voyages
FROM "Conducteur" c
INNER JOIN "Horaire" h ON c."id" = h."conducteurId"
WHERE c."id" IN (
    SELECT "conducteurId" 
    FROM "Horaire" 
    GROUP BY "conducteurId" 
    HAVING COUNT(*) >= 2
)
GROUP BY c."id", c."nom", c."prenom", c."numeroPermis", c."experience"
ORDER BY nombre_voyages DESC;

-- =====================================================
-- 9. AGRÉGATION PAR DATE : Revenus journaliers
-- =====================================================
SELECT 
    DATE(p."datePaiement") AS date_paiement,
    COUNT(p."id") AS nombre_paiements,
    SUM(p."montant") AS revenu_total,
    AVG(p."montant") AS montant_moyen,
    COUNT(DISTINCT p."userId") AS nombre_clients
FROM "Paiement" p
GROUP BY DATE(p."datePaiement")
ORDER BY date_paiement DESC;

-- =====================================================
-- 10. JOINTURE AVEC CONDITION : Réservations avec bagages excédentaires
-- =====================================================
SELECT 
    r."id" AS reservation_id,
    u."nom" || ' ' || u."prenom" AS client,
    t."villeDepart" || ' → ' || t."villeArrivee" AS trajet,
    b."poids",
    b."volume",
    b."supplement",
    b."etiquette"
FROM "Reservation" r
INNER JOIN "User" u ON r."userId" = u."id"
INNER JOIN "Horaire" h ON r."horaireId" = h."id"
INNER JOIN "Trajet" t ON h."trajetId" = t."id"
INNER JOIN "Bagage" b ON r."id" = b."reservationId"
WHERE b."estGratuit" = false
ORDER BY b."supplement" DESC;

-- =====================================================
-- 11. SOUS-REQUÊTE AVEC EXISTS : Utilisateurs avec abonnement actif
-- =====================================================
SELECT 
    u."id",
    u."nom",
    u."prenom",
    u."email",
    a."type" AS type_abonnement,
    a."reduction",
    a."dateFin"
FROM "User" u
INNER JOIN "Abonnement" a ON u."id" = a."userId"
WHERE EXISTS (
    SELECT 1 
    FROM "Abonnement" 
    WHERE "userId" = u."id" 
    AND "dateFin" >= CURRENT_DATE
)
ORDER BY a."dateFin";

-- =====================================================
-- 12. UNION : Tous les départs depuis Dakar (trajets + horaires)
-- =====================================================
SELECT 
    'Trajet' AS type,
    t."id",
    t."villeDepart",
    t."villeArrivee",
    NULL::TIMESTAMP AS date_depart,
    t."tarifBase" AS tarif
FROM "Trajet" t
WHERE t."villeDepart" = 'Dakar'

UNION ALL

SELECT 
    'Horaire' AS type,
    h."id",
    t."villeDepart",
    t."villeArrivee",
    h."dateDepart",
    t."tarifBase"
FROM "Horaire" h
INNER JOIN "Trajet" t ON h."trajetId" = t."id"
WHERE t."villeDepart" = 'Dakar'
ORDER BY date_depart NULLS FIRST;

-- =====================================================
-- 13. CASE WHEN : Classification des réservations par montant
-- =====================================================
SELECT 
    r."id",
    u."nom" || ' ' || u."prenom" AS client,
    p."montant",
    CASE 
        WHEN p."montant" < 3000 THEN 'Économique'
        WHEN p."montant" BETWEEN 3000 AND 6000 THEN 'Standard'
        WHEN p."montant" > 6000 THEN 'Premium'
        ELSE 'Non payé'
    END AS categorie,
    r."statut"
FROM "Reservation" r
INNER JOIN "User" u ON r."userId" = u."id"
LEFT JOIN "Paiement" p ON r."id" = p."reservationId"
ORDER BY p."montant" DESC NULLS LAST;

-- =====================================================
-- 14. WINDOW FUNCTION : Classement des clients par dépenses
-- =====================================================
SELECT 
    u."id",
    u."nom",
    u."prenom",
    COUNT(r."id") AS nombre_reservations,
    COALESCE(SUM(p."montant"), 0) AS total_depense,
    RANK() OVER (ORDER BY COALESCE(SUM(p."montant"), 0) DESC) AS rang_depense,
    ROUND(AVG(p."montant"), 2) AS montant_moyen_par_reservation
FROM "User" u
LEFT JOIN "Reservation" r ON u."id" = r."userId"
LEFT JOIN "Paiement" p ON r."id" = p."reservationId"
WHERE u."role" = 'CLIENT'
GROUP BY u."id", u."nom", u."prenom"
ORDER BY total_depense DESC;

-- =====================================================
-- 15. VUE : Vue synthétique des réservations actives
-- =====================================================
CREATE OR REPLACE VIEW "vue_reservations_actives" AS
SELECT 
    r."id" AS reservation_id,
    u."nom" || ' ' || u."prenom" AS client,
    u."email",
    u."telephone",
    t."villeDepart",
    t."villeArrivee",
    h."dateDepart",
    h."dateArrivee",
    r."nombrePlaces",
    r."numeroSiege",
    t."tarifBase" * r."nombrePlaces" AS montant_total,
    r."statut",
    v."numeroImmatriculation",
    c."nom" || ' ' || c."prenom" AS conducteur
FROM "Reservation" r
INNER JOIN "User" u ON r."userId" = u."id"
INNER JOIN "Horaire" h ON r."horaireId" = h."id"
INNER JOIN "Trajet" t ON h."trajetId" = t."id"
INNER JOIN "Vehicule" v ON h."vehiculeId" = v."id"
INNER JOIN "Conducteur" c ON h."conducteurId" = c."id"
WHERE r."statut" IN ('CONFIRMEE', 'EN_ATTENTE')
AND h."dateDepart" >= CURRENT_DATE;

-- Utilisation de la vue
SELECT * FROM "vue_reservations_actives" ORDER BY "dateDepart";

-- =====================================================
-- FIN DES REQUÊTES SQL AVANCÉES
-- =====================================================
