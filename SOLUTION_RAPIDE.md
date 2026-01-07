# Solution Rapide - Créer les tables directement dans Supabase

## Problème
Prisma ne peut pas se connecter à Supabase pour créer les tables automatiquement.

## Solution : Créer les tables manuellement via SQL Editor

### Étape 1 : Accéder au SQL Editor
1. Allez sur https://kmjsdfxbbiefpnujutgj.supabase.co
2. Connectez-vous à votre compte
3. Dans le menu de gauche, cliquez sur **SQL Editor**

### Étape 2 : Exécuter le script SQL
1. Cliquez sur **New query** (ou le bouton +)
2. Ouvrez le fichier `supabase_schema_simple.sql` dans votre projet
3. **Copiez TOUT le contenu** du fichier
4. **Collez-le** dans l'éditeur SQL de Supabase
5. Cliquez sur **Run** (ou appuyez sur Ctrl+Enter / Cmd+Enter)

### Étape 3 : Vérifier la création
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

### Étape 4 : Générer le client Prisma
Une fois les tables créées, générez le client Prisma :

```bash
npm run prisma:generate
```

### Étape 5 : Désactiver RLS (si nécessaire)
Si vous avez des problèmes d'accès, exécutez aussi le script `fix_rls_for_nextauth.sql` dans le SQL Editor.

### Étape 6 : Créer un admin et des données de test
```bash
npm run create-admin
```

Puis exécutez `supabase_seed_data.sql` dans le SQL Editor pour ajouter des trajets de test.

## Après ces étapes
Votre application devrait fonctionner ! Vous pouvez maintenant :
- Lancer l'application : `npm run dev`
- Vous connecter avec l'admin créé
- Tester les fonctionnalités

## Note importante
Même si Prisma ne peut pas se connecter pour les migrations, il pourra toujours :
- ✅ Générer le client Prisma (`prisma generate`)
- ✅ Faire des requêtes à la base de données
- ✅ Utiliser Prisma Studio pour visualiser les données

Le problème de connexion Prisma n'empêche pas l'application de fonctionner une fois les tables créées !

