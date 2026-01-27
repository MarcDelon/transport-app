# Solution Définitive : Blocage des Réservations de Dates Passées

## 🎯 Objectif

Empêcher les utilisateurs de réserver des horaires dont la date de départ est déjà passée, tout en maintenant la base de données propre avec uniquement des horaires futurs.

## ✅ Solution Mise en Place

### 1. **Trigger de Base de Données (Déjà Actif)**

Le trigger `trigger_check_horaire_futur` est déjà configuré dans votre base de données Supabase. Il bloque automatiquement toute tentative de réservation sur un horaire passé.

**Fonction SQL :**
```sql
CREATE OR REPLACE FUNCTION check_horaire_futur()
RETURNS TRIGGER AS $$
DECLARE
    date_depart TIMESTAMP;
BEGIN
    SELECT "dateDepart" INTO date_depart
    FROM "Horaire"
    WHERE id = NEW."horaireId";

    IF date_depart < CURRENT_TIMESTAMP THEN
        RAISE EXCEPTION 'Impossible de réserver un trajet dont le départ est déjà passé';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 2. **Scripts de Maintenance**

Plusieurs scripts ont été créés pour maintenir la base de données propre :

#### **Script Principal : `npm run clean-horaires`**

Ce script nettoie automatiquement les horaires passés :
- ✅ Supprime les horaires passés sans réservations
- ✅ Met à jour les horaires passés avec réservations actives
- ✅ Affiche un rapport détaillé

```bash
npm run clean-horaires
```

#### **Script Alternatif : `npm run update-horaires`**

Met à jour tous les horaires passés vers le futur (demain à la même heure) :

```bash
npm run update-horaires
```

## 📋 Utilisation

### Pour Résoudre le Problème Actuel

1. **Exécutez le script de nettoyage :**
   ```bash
   npm run clean-horaires
   ```

2. **Vérifiez les résultats :**
   - Le script affiche le nombre d'horaires futurs vs passés
   - Les horaires sans réservations sont supprimés
   - Les horaires avec réservations sont mis à jour

3. **Si des horaires passés persistent :**
   - Ils ont probablement des conflits de véhicules/conducteurs
   - Gérez-les manuellement dans Supabase SQL Editor
   - Ou utilisez le script SQL : `sql/update_horaires_passes_simple.sql`

### Pour Tester une Réservation

Après avoir nettoyé les horaires passés, essayez de faire une réservation :

1. Allez sur votre page de réservation
2. Sélectionnez un horaire **futur**
3. Choisissez vos sièges
4. Confirmez la réservation

✅ **La réservation devrait fonctionner si l'horaire est dans le futur**

❌ **Si vous essayez de réserver un horaire passé, vous verrez l'erreur :**
```
Impossible de réserver un trajet dont le départ est déjà passé
```

## 🔧 Maintenance Régulière

### En Développement

Exécutez régulièrement (par exemple, chaque jour) :
```bash
npm run clean-horaires
```

### En Production

1. **Créez de nouveaux horaires futurs régulièrement**
   - Utilisez l'interface admin pour créer des horaires
   - Planifiez les horaires au moins 1 semaine à l'avance

2. **Nettoyage automatique (optionnel)**
   - Configurez un cron job pour exécuter le script de nettoyage
   - Ou créez une fonction Supabase Edge Function qui s'exécute quotidiennement

## 📊 Scripts Disponibles

| Script | Commande | Description |
|--------|----------|-------------|
| **Nettoyage** | `npm run clean-horaires` | Supprime/met à jour les horaires passés |
| **Mise à jour** | `npm run update-horaires` | Met à jour tous les horaires passés |
| **Vérification** | `npm run test-trajets` | Teste les trajets disponibles |

## 🗂️ Fichiers Créés

### Scripts TypeScript
- `scripts/nettoyer-horaires-passes.ts` - Script de nettoyage principal
- `scripts/update-horaires-simple.ts` - Script de mise à jour simple
- `scripts/solution-definitive-dates.ts` - Solution complète (nécessite permissions admin)

### Scripts SQL
- `sql/update_horaires_passes_simple.sql` - Requête SQL de mise à jour
- `sql/solution_definitive_dates.sql` - Solution SQL complète
- `sql/fix_horaires_passes.sql` - Script de correction

## ⚠️ Notes Importantes

1. **Le trigger est TOUJOURS actif** - Il bloque automatiquement les réservations de dates passées
2. **Pas besoin de désactiver le trigger** - La solution fonctionne avec le trigger actif
3. **Conflits de véhicules/conducteurs** - Certains horaires ne peuvent pas être mis à jour automatiquement à cause de contraintes de base de données
4. **Horaires avec réservations** - Sont préservés et mis à jour plutôt que supprimés

## 🎉 Résultat Attendu

Après avoir exécuté `npm run clean-horaires`, vous devriez voir :

```
✅ Horaires futurs : 10752
✅ Horaires passés : 0

🎉 SUCCÈS COMPLET : Tous les horaires sont maintenant dans le futur!
✅ Le trigger bloque automatiquement les réservations de dates passées
```

## 🆘 Dépannage

### Problème : "Il reste X horaire(s) passé(s)"

**Solution 1 :** Réexécutez le script
```bash
npm run clean-horaires
```

**Solution 2 :** Exécutez le SQL directement dans Supabase
```sql
-- Copier le contenu de sql/update_horaires_passes_simple.sql
-- et l'exécuter dans Supabase SQL Editor
```

**Solution 3 :** Suppression manuelle
```sql
-- Supprimer les horaires passés sans réservations
DELETE FROM "Horaire"
WHERE "dateDepart" < CURRENT_TIMESTAMP
AND id NOT IN (SELECT DISTINCT "horaireId" FROM "Reservation");
```

### Problème : "Erreur de connexion réseau"

Vérifiez que :
- Votre connexion internet fonctionne
- Les variables d'environnement sont correctes dans `.env.local`
- Supabase est accessible

## 📞 Support

Si vous rencontrez des problèmes persistants :
1. Vérifiez les logs dans la console
2. Consultez les erreurs dans Supabase Dashboard
3. Exécutez les scripts SQL manuellement dans Supabase SQL Editor
