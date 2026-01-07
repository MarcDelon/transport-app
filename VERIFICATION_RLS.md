# Vérification et correction RLS pour NextAuth

## Situation actuelle

Vous avez utilisé le script `supabase_schema.sql` qui active Row Level Security (RLS) avec des politiques basées sur `auth.uid()` de Supabase.

**Problème** : Ces politiques ne fonctionneront pas correctement avec NextAuth car :
- NextAuth ne passe pas par l'authentification Supabase
- Les politiques utilisent `auth.uid()` qui n'existera pas dans votre contexte

## Solutions

### Option 1 : Désactiver RLS (Recommandé) ✅

C'est la solution la plus simple et recommandée pour NextAuth. Votre application Next.js gérera déjà les permissions via les routes API et les middlewares.

**Exécutez ce script dans le SQL Editor de Supabase :**

```sql
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Trajet" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Vehicule" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Conducteur" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Horaire" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Reservation" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Paiement" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Abonnement" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Reduction" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Bagage" DISABLE ROW LEVEL SECURITY;
```

Ou utilisez le fichier `fix_rls_for_nextauth.sql` que j'ai créé.

### Option 2 : Garder RLS avec des politiques permissives

Si vous voulez garder RLS activé (pour une sécurité supplémentaire au niveau de la base de données), vous pouvez créer des politiques qui autorisent tout :

```sql
-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can view their own data" ON "User";
-- ... (supprimez toutes les autres politiques)

-- Créer des politiques permissives
CREATE POLICY "Allow all" ON "User" FOR ALL USING (true) WITH CHECK (true);
-- ... (pour toutes les tables)
```

## Vérification

Pour vérifier si RLS est activé sur une table :

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('User', 'Trajet', 'Vehicule', 'Conducteur', 'Horaire', 'Reservation', 'Paiement', 'Abonnement', 'Reduction', 'Bagage');
```

Si `rowsecurity` est `true`, RLS est activé.

## Recommandation

**Je recommande l'Option 1** (désactiver RLS) car :
- Votre application Next.js gère déjà les permissions via les routes API
- Le middleware protège les routes admin/client
- C'est plus simple et évite les conflits
- NextAuth ne nécessite pas RLS pour fonctionner

## Après correction

Une fois RLS désactivé ou ajusté :

1. Testez votre application :
   ```bash
   npm run dev
   ```

2. Essayez de créer un compte et de vous connecter

3. Vérifiez que vous pouvez accéder aux données

Si tout fonctionne, vous êtes prêt ! 🎉


