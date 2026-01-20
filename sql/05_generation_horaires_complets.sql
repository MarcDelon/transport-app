-- =====================================================
-- GÉNÉRATION D'HORAIRES POUR TOUS LES TRAJETS
-- Du 20 janvier 2026 au 28 février 2026
-- =====================================================

-- Ce script génère des horaires quotidiens pour tous les trajets disponibles
-- avec plusieurs départs par jour (matin, midi, après-midi, soir)

DO $$
DECLARE
    v_trajet RECORD;
    v_vehicule RECORD;
    v_conducteur RECORD;
    v_date DATE;
    v_heure_depart TIME;
    v_heure_arrivee TIME;
    v_horaire_id TEXT;
    v_counter INTEGER := 1;
BEGIN
    -- Supprimer les anciens horaires pour éviter les doublons
    DELETE FROM "Horaire" WHERE "dateDepart" >= '2026-01-20';
    
    RAISE NOTICE 'Génération des horaires pour tous les trajets...';
    
    -- Boucle sur chaque trajet disponible
    FOR v_trajet IN 
        SELECT * FROM "Trajet" WHERE "statut" = 'DISPONIBLE'
    LOOP
        RAISE NOTICE 'Trajet: % → %', v_trajet."villeDepart", v_trajet."villeArrivee";
        
        -- Sélectionner un véhicule aléatoire
        SELECT * INTO v_vehicule 
        FROM "Vehicule" 
        ORDER BY RANDOM() 
        LIMIT 1;
        
        -- Sélectionner un conducteur aléatoire
        SELECT * INTO v_conducteur 
        FROM "Conducteur" 
        ORDER BY RANDOM() 
        LIMIT 1;
        
        -- Boucle sur chaque jour entre aujourd'hui et le 28/02/2026
        v_date := '2026-01-20'::DATE;
        WHILE v_date <= '2026-02-28'::DATE LOOP
            
            -- Générer 4 horaires par jour (matin, midi, après-midi, soir)
            -- Horaire 1: 06h00
            v_heure_depart := '06:00:00'::TIME;
            v_heure_arrivee := v_heure_depart + (v_trajet."dureeEstimee" || ' minutes')::INTERVAL;
            v_horaire_id := 'horaire_gen_' || v_counter;
            
            INSERT INTO "Horaire" (
                "id", "trajetId", "vehiculeId", "conducteurId",
                "dateDepart", "dateArrivee",
                "createdAt", "updatedAt"
            ) VALUES (
                v_horaire_id,
                v_trajet."id",
                v_vehicule."id",
                v_conducteur."id",
                v_date + v_heure_depart,
                v_date + v_heure_arrivee,
                NOW(),
                NOW()
            );
            v_counter := v_counter + 1;
            
            -- Horaire 2: 10h00
            v_heure_depart := '10:00:00'::TIME;
            v_heure_arrivee := v_heure_depart + (v_trajet."dureeEstimee" || ' minutes')::INTERVAL;
            v_horaire_id := 'horaire_gen_' || v_counter;
            
            INSERT INTO "Horaire" (
                "id", "trajetId", "vehiculeId", "conducteurId",
                "dateDepart", "dateArrivee",
                "createdAt", "updatedAt"
            ) VALUES (
                v_horaire_id,
                v_trajet."id",
                v_vehicule."id",
                v_conducteur."id",
                v_date + v_heure_depart,
                v_date + v_heure_arrivee,
                NOW(),
                NOW()
            );
            v_counter := v_counter + 1;
            
            -- Horaire 3: 14h00
            v_heure_depart := '14:00:00'::TIME;
            v_heure_arrivee := v_heure_depart + (v_trajet."dureeEstimee" || ' minutes')::INTERVAL;
            v_horaire_id := 'horaire_gen_' || v_counter;
            
            INSERT INTO "Horaire" (
                "id", "trajetId", "vehiculeId", "conducteurId",
                "dateDepart", "dateArrivee",
                "createdAt", "updatedAt"
            ) VALUES (
                v_horaire_id,
                v_trajet."id",
                v_vehicule."id",
                v_conducteur."id",
                v_date + v_heure_depart,
                v_date + v_heure_arrivee,
                NOW(),
                NOW()
            );
            v_counter := v_counter + 1;
            
            -- Horaire 4: 18h00
            v_heure_depart := '18:00:00'::TIME;
            v_heure_arrivee := v_heure_depart + (v_trajet."dureeEstimee" || ' minutes')::INTERVAL;
            v_horaire_id := 'horaire_gen_' || v_counter;
            
            INSERT INTO "Horaire" (
                "id", "trajetId", "vehiculeId", "conducteurId",
                "dateDepart", "dateArrivee",
                "createdAt", "updatedAt"
            ) VALUES (
                v_horaire_id,
                v_trajet."id",
                v_vehicule."id",
                v_conducteur."id",
                v_date + v_heure_depart,
                v_date + v_heure_arrivee,
                NOW(),
                NOW()
            );
            v_counter := v_counter + 1;
            
            -- Passer au jour suivant
            v_date := v_date + INTERVAL '1 day';
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Génération terminée! Total horaires créés: %', v_counter - 1;
END $$;

-- Vérifier les horaires créés
SELECT 
    COUNT(*) as "Nombre total d'horaires",
    MIN("dateDepart") as "Premier départ",
    MAX("dateDepart") as "Dernier départ"
FROM "Horaire"
WHERE "dateDepart" >= '2026-01-20';

-- Afficher quelques exemples d'horaires par trajet
SELECT 
    t."villeDepart",
    t."villeArrivee",
    COUNT(h."id") as "Nombre d'horaires",
    MIN(h."dateDepart") as "Premier départ",
    MAX(h."dateDepart") as "Dernier départ"
FROM "Horaire" h
JOIN "Trajet" t ON h."trajetId" = t."id"
WHERE h."dateDepart" >= '2026-01-20'
GROUP BY t."villeDepart", t."villeArrivee"
ORDER BY t."villeDepart", t."villeArrivee";

-- =====================================================
-- RÉSUMÉ
-- =====================================================
-- Ce script génère automatiquement:
-- - 4 horaires par jour pour chaque trajet (06h, 10h, 14h, 18h)
-- - Du 20 janvier 2026 au 28 février 2026 (40 jours)
-- - Pour tous les trajets avec statut DISPONIBLE
-- 
-- Exemple: Si vous avez 20 trajets disponibles:
-- 20 trajets × 4 horaires/jour × 40 jours = 3200 horaires au total
-- =====================================================
