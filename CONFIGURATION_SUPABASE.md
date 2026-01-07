# Configuration Supabase - Guide rapide

## ⚠️ Important : Deux types de connexion

**Pour Prisma (utilisé dans ce projet)** : Vous avez besoin de la **Connection String** complète avec le mot de passe PostgreSQL, pas seulement l'URL et la clé anon.

**L'anon key et l'URL du projet** sont utilisés pour l'API REST Supabase, mais Prisma nécessite une connexion PostgreSQL directe avec mot de passe.

## Informations de votre projet

- **Project URL** : https://kmjsdfxbbiefpnujutgj.supabase.co
- **Project Reference** : kmjsdfxbbiefpnujutgj
- **Anon Key** : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttanNkZnhiYmllZnBudWp1dGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NTk1MzUsImV4cCI6MjA4MzIzNTUzNX0.397B_dFsuudXE6y6ivPNwC-NNDx3Jtv1i8t3QH-iqTo

**Note** : L'anon key n'est pas utilisée pour Prisma. Vous avez besoin du mot de passe de la base de données.

## Obtenir l'URL de connexion complète

### Étape 1 : Accéder aux paramètres de la base de données

1. Allez sur https://kmjsdfxbbiefpnujutgj.supabase.co
2. Connectez-vous à votre projet
3. Cliquez sur l'icône **Settings** (⚙️) en bas à gauche
4. Cliquez sur **Database** dans le menu de gauche

### Étape 2 : Obtenir la connection string

1. Faites défiler jusqu'à la section **Connection string**
2. Vous verrez plusieurs options :
   - **URI** : Pour les migrations Prisma (port 5432)
   - **Connection pooling** : Pour l'application en production (port 6543)

3. **Pour Prisma migrations**, sélectionnez **URI** et copiez l'URL qui ressemble à :
   ```
   postgresql://postgres.kmjsdfxbbiefpnujutgj:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
   ```

4. **Important** : Remplacez `[YOUR-PASSWORD]` par le mot de passe que vous avez défini lors de la création du projet Supabase.

### Étape 3 : Mettre à jour le fichier .env

Ouvrez le fichier `.env` et remplacez la ligne `DATABASE_URL` par l'URL complète que vous venez de copier.

**⚠️ ATTENTION - Encodage du mot de passe :**

Si votre mot de passe contient des caractères spéciaux (@, #, $, %, &, etc.), vous devez les encoder dans l'URL. 

**Option 1 : Utiliser le script automatique** (recommandé)
```bash
node scripts/fix-database-url.js "votre-mot-de-passe-avec-caracteres-speciaux"
```

**Option 2 : Encoder manuellement**
- `@` devient `%40`
- `#` devient `%23`
- `$` devient `%24`
- `%` devient `%25`
- etc.

**Exemple avec mot de passe simple** :
```env
DATABASE_URL="postgresql://postgres.kmjsdfxbbiefpnujutgj:VotreMotDePasse123@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

**Exemple avec mot de passe contenant des caractères spéciaux** :
Si votre mot de passe est `Mon@Passe#123`, l'URL devient :
```env
DATABASE_URL="postgresql://postgres.kmjsdfxbbiefpnujutgj:Mon%40Passe%23123@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

Voir `GUIDE_DATABASE_URL.md` pour plus de détails.

## Si vous avez oublié votre mot de passe

Si vous avez oublié le mot de passe de votre base de données :

1. Allez dans **Settings** > **Database**
2. Faites défiler jusqu'à **Database password**
3. Cliquez sur **Reset database password**
4. Entrez un nouveau mot de passe
5. Mettez à jour votre fichier `.env` avec le nouveau mot de passe

## Après avoir configuré DATABASE_URL

Une fois le fichier `.env` correctement configuré avec le mot de passe, exécutez :

```bash
# Générer le client Prisma
npm run prisma:generate

# Créer les tables dans Supabase
npm run prisma:migrate

# Créer un utilisateur admin
npm run create-admin

# Lancer l'application
npm run dev
```

## Vérification

Pour vérifier que tout fonctionne :

1. Allez dans votre projet Supabase
2. Cliquez sur **Table Editor** dans le menu de gauche
3. Vous devriez voir toutes les tables créées :
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

## Support

Si vous rencontrez des problèmes :
- Vérifiez que votre projet Supabase est actif (pas en pause)
- Vérifiez que le mot de passe dans DATABASE_URL est correct
- Vérifiez que vous utilisez le port 5432 pour les migrations (pas 6543)

