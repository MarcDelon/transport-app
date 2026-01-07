# Solution - Erreur d'inscription

## Problème identifié
L'erreur "Une erreur est survenue lors de la création du compte" peut être causée par plusieurs choses.

## Solution 1 : Désactiver RLS (Row Level Security)

Si Row Level Security est activé sur la table User, cela peut bloquer les insertions.

### Étapes :
1. Allez sur https://kmjsdfxbbiefpnujutgj.supabase.co
2. Cliquez sur **SQL Editor**
3. Exécutez cette commande :

```sql
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
```

Ou exécutez le script complet `fix_rls_for_nextauth.sql` qui désactive RLS sur toutes les tables.

## Solution 2 : Vérifier les logs du serveur

1. Regardez la console du terminal où `npm run dev` est lancé
2. Vous devriez voir des erreurs détaillées comme :
   - `Erreur Supabase: ...`
   - `Détails de l'erreur: ...`
3. Partagez ces erreurs pour un diagnostic plus précis

## Solution 3 : Vérifier la structure de la table

Dans Supabase SQL Editor, exécutez :

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'User';
```

Vérifiez que toutes les colonnes existent et ont les bons types.

## Solution 4 : Tester directement dans Supabase

Testez l'insertion directement dans Supabase pour isoler le problème :

```sql
INSERT INTO "User" (id, email, password, role, nom, prenom, telephone, "updatedAt")
VALUES (
  'test_' || extract(epoch from now())::text,
  'test@example.com',
  '$2a$10$test', -- Hash bcrypt de test
  'CLIENT',
  'Test',
  'User',
  '+237 6XX XXX XXX',
  CURRENT_TIMESTAMP
);
```

Si cela fonctionne, le problème vient du code. Si cela ne fonctionne pas, le problème vient de la base de données.

## Code mis à jour

Le code a été amélioré pour :
- ✅ Générer automatiquement un ID unique
- ✅ Logger les erreurs Supabase complètes
- ✅ Afficher des messages d'erreur plus détaillés en développement

## Prochaines étapes

1. **Redémarrez le serveur** : Arrêtez `npm run dev` et relancez-le
2. **Désactivez RLS** : Exécutez la commande SQL ci-dessus
3. **Essayez de vous inscrire à nouveau**
4. **Regardez les logs** : Partagez l'erreur exacte de la console

