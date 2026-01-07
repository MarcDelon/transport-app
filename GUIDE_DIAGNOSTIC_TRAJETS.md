# Guide de diagnostic - Trajets non affichés

## Problème
Les trajets sont dans la base de données mais ne s'affichent pas sur la page `/trajets` et les réservations sont impossibles.

## Solutions

### 1. Vérifier les données dans la base

Exécutez le script de test :
```bash
npm run test-trajets
```

Ce script vérifiera :
- ✅ Le nombre de trajets dans la base
- ✅ Les trajets avec statut `DISPONIBLE`
- ✅ Les horaires existants
- ✅ Les horaires futurs
- ✅ La recherche de trajets

### 2. Vérifier le statut des trajets

Dans Supabase SQL Editor, exécutez :
```sql
SELECT id, "villeDepart", "villeArrivee", statut 
FROM "Trajet" 
ORDER BY "villeDepart";
```

**Important** : Les trajets doivent avoir le statut `DISPONIBLE` (en majuscules) pour être affichés.

Si certains trajets ont un autre statut, mettez-les à jour :
```sql
UPDATE "Trajet" 
SET statut = 'DISPONIBLE' 
WHERE statut != 'DISPONIBLE';
```

### 3. Vérifier les horaires

Les horaires doivent être dans le futur pour être trouvés lors de la recherche.

Vérifiez les horaires :
```sql
SELECT 
  h.id,
  h."dateDepart",
  t."villeDepart",
  t."villeArrivee"
FROM "Horaire" h
JOIN "Trajet" t ON h."trajetId" = t.id
WHERE h."dateDepart" >= CURRENT_TIMESTAMP
ORDER BY h."dateDepart"
LIMIT 20;
```

Si les horaires sont dans le passé, recréez-en avec des dates futures :
```sql
-- Exemple : créer des horaires pour demain
INSERT INTO "Horaire" (id, "dateDepart", "dateArrivee", "trajetId", "vehiculeId", "conducteurId", "createdAt", "updatedAt")
SELECT 
  'horaire_new_' || t.id,
  CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '8 hours',
  CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '8 hours' + (t."dureeEstimee" || ' minutes')::interval,
  t.id,
  v.id,
  c.id,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Trajet" t
CROSS JOIN "Vehicule" v
CROSS JOIN "Conducteur" c
WHERE t.statut = 'DISPONIBLE'
  AND v.statut = 'EN_SERVICE'
LIMIT 10;
```

### 4. Vérifier la recherche avec accents

La recherche gère maintenant les accents automatiquement. Vous pouvez rechercher :
- `yaounde` ou `Yaoundé` → trouvera `Yaoundé`
- `douala` ou `Douala` → trouvera `Douala`

### 5. Vérifier les logs

Ouvrez la console du navigateur (F12) et regardez les logs lors de :
- La visite de `/trajets`
- La recherche sur `/reservation`

Les logs affichent maintenant :
- 🔍 Le nombre de trajets récupérés
- ✅ Les trajets trouvés
- ⚠️ Les avertissements si aucun résultat

### 6. Vérifier la connexion Supabase

Assurez-vous que les variables d'environnement sont correctes dans `.env` :
```env
NEXT_PUBLIC_SUPABASE_URL=https://kmjsdfxbbiefpnujutgj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
```

### 7. Redémarrer le serveur

Après avoir modifié les données dans Supabase, redémarrez le serveur Next.js :
```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer
npm run dev
```

## Corrections apportées

1. ✅ **Gestion des accents** : La recherche normalise maintenant les noms de villes (enlève les accents)
2. ✅ **Logs détaillés** : Ajout de logs pour déboguer les problèmes
3. ✅ **Gestion d'erreurs améliorée** : Meilleure gestion des erreurs et messages plus clairs
4. ✅ **Script de test** : Script pour vérifier rapidement les données

## Test rapide

1. Allez sur `/trajets` → Vous devriez voir tous les trajets avec statut `DISPONIBLE`
2. Allez sur `/reservation` → Recherchez `Yaoundé` → `Douala` avec une date future
3. Vérifiez la console du navigateur pour les logs détaillés

## Si le problème persiste

1. Exécutez `npm run test-trajets` et partagez les résultats
2. Vérifiez les logs dans la console du navigateur
3. Vérifiez les logs du serveur Next.js dans le terminal

