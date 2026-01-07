# Instructions pour exécuter le script SQL dans Supabase

## Étapes pour créer la base de données

### 1. Accéder au SQL Editor

1. Allez sur votre projet Supabase : https://kmjsdfxbbiefpnujutgj.supabase.co
2. Connectez-vous à votre compte
3. Dans le menu de gauche, cliquez sur **SQL Editor**

### 2. Exécuter le script

1. Cliquez sur **New query** (ou utilisez le bouton +)
2. Ouvrez le fichier `supabase_schema_simple.sql` dans votre éditeur
3. Copiez tout le contenu du fichier
4. Collez-le dans l'éditeur SQL de Supabase
5. Cliquez sur **Run** (ou appuyez sur Ctrl+Enter / Cmd+Enter)

### 3. Vérifier la création

1. Allez dans **Table Editor** dans le menu de gauche
2. Vous devriez voir toutes les tables créées :
   - User
   - Trajet
   - Vehicule
   - Conducteur
   - Horaire
   - Reservation
   - Paiement
   - Abonnement
   - Reduction
   - Bagage

### 4. Vérifier les types ENUM

1. Dans le SQL Editor, exécutez cette requête pour voir les types créés :
```sql
SELECT typname FROM pg_type WHERE typtype = 'e';
```

Vous devriez voir :
- Role
- StatutVehicule
- StatutTrajet
- StatutReservation
- MethodePaiement
- TypeAbonnement

## Fichiers disponibles

- **supabase_schema_simple.sql** : Version simplifiée sans RLS (recommandée pour NextAuth)
- **supabase_schema.sql** : Version complète avec Row Level Security (si vous utilisez l'auth Supabase)

## Après l'exécution du script

Une fois le script exécuté avec succès :

1. Mettez à jour votre fichier `.env` avec votre `DATABASE_URL` de Supabase
2. Exécutez :
   ```bash
   npm run prisma:generate
   ```
3. Créez un utilisateur admin :
   ```bash
   npm run create-admin
   ```
4. Lancez l'application :
   ```bash
   npm run dev
   ```

## Dépannage

### Erreur "type already exists"
Si vous obtenez une erreur indiquant qu'un type existe déjà, vous pouvez :
- Soit supprimer les types existants et réexécuter le script
- Soit commenter les lignes CREATE TYPE dans le script

### Erreur "table already exists"
Si certaines tables existent déjà :
- Vous pouvez les supprimer manuellement depuis le Table Editor
- Ou utiliser `DROP TABLE IF EXISTS` avant chaque `CREATE TABLE`

### Script de nettoyage (si besoin)
Si vous voulez tout supprimer et recommencer :
```sql
-- ATTENTION : Ceci supprimera toutes les données !
DROP TABLE IF EXISTS "Bagage" CASCADE;
DROP TABLE IF EXISTS "Reduction" CASCADE;
DROP TABLE IF EXISTS "Abonnement" CASCADE;
DROP TABLE IF EXISTS "Paiement" CASCADE;
DROP TABLE IF EXISTS "Reservation" CASCADE;
DROP TABLE IF EXISTS "Horaire" CASCADE;
DROP TABLE IF EXISTS "Conducteur" CASCADE;
DROP TABLE IF EXISTS "Vehicule" CASCADE;
DROP TABLE IF EXISTS "Trajet" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

DROP TYPE IF EXISTS "TypeAbonnement";
DROP TYPE IF EXISTS "MethodePaiement";
DROP TYPE IF EXISTS "StatutReservation";
DROP TYPE IF EXISTS "StatutTrajet";
DROP TYPE IF EXISTS "StatutVehicule";
DROP TYPE IF EXISTS "Role";
```


