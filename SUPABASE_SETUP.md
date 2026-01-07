# Configuration Supabase

Ce projet utilise Supabase (PostgreSQL) comme base de données.

## Étapes de configuration

### 1. Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Remplissez les informations :
   - **Name** : transport-management (ou un nom de votre choix)
   - **Database Password** : Choisissez un mot de passe fort (notez-le bien !)
   - **Region** : Choisissez la région la plus proche
5. Cliquez sur "Create new project"
6. Attendez que le projet soit créé (2-3 minutes)

### 2. Obtenir l'URL de connexion

1. Dans votre projet Supabase, allez dans **Settings** (icône d'engrenage en bas à gauche)
2. Cliquez sur **Database** dans le menu de gauche
3. Faites défiler jusqu'à la section **Connection string**
4. Sélectionnez **URI** dans le menu déroulant
5. Copiez l'URL qui ressemble à :
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-xx-region.pooler.supabase.com:6543/postgres
   ```

### 3. Configurer le fichier .env

1. Créez un fichier `.env` à la racine du projet
2. Ajoutez les variables suivantes :

```env
# Database - Supabase PostgreSQL
# Remplacez [YOUR-PASSWORD] par le mot de passe que vous avez choisi lors de la création du projet
DATABASE_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-xx-region.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="générez-un-secret-aléatoire-ici"
```

**Important** : 
- Remplacez `[YOUR-PASSWORD]` par votre mot de passe de base de données
- **Si votre mot de passe contient des caractères spéciaux** (@, #, $, %, &, etc.), vous devez les encoder dans l'URL. Utilisez le script :
  ```bash
  node scripts/fix-database-url.js "votre-mot-de-passe"
  ```
  Voir `GUIDE_DATABASE_URL.md` pour plus de détails.
- Pour `NEXTAUTH_SECRET`, générez un secret aléatoire avec :
  ```bash
  openssl rand -base64 32
  ```
  ou utilisez un générateur en ligne

### 4. Initialiser la base de données

Une fois le fichier `.env` configuré, exécutez :

```bash
npm run prisma:migrate
```

Cela créera toutes les tables dans votre base de données Supabase.

### 5. Vérifier dans Supabase

1. Allez dans **Table Editor** dans votre projet Supabase
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

## Utilisation

Une fois configuré, vous pouvez :
- Utiliser Prisma Studio pour visualiser vos données :
  ```bash
  npm run prisma:studio
  ```
- Accéder à votre base de données via le dashboard Supabase
- Utiliser les fonctionnalités Supabase (authentification, storage, etc.) si nécessaire

## Dépannage

### Erreur de connexion
- Vérifiez que votre mot de passe dans `DATABASE_URL` est correct
- Vérifiez que votre projet Supabase est actif (pas en pause)
- Assurez-vous que l'URL de connexion est correcte

### Erreur de migration
- Vérifiez que vous avez les permissions nécessaires
- Essayez de réinitialiser les migrations :
  ```bash
  npm run prisma:migrate reset
  ```

## Support

Pour plus d'informations sur Supabase :
- Documentation : [https://supabase.com/docs](https://supabase.com/docs)
- Discord : [https://discord.supabase.com](https://discord.supabase.com)

