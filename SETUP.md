# Guide de démarrage rapide

## Installation et configuration

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer Supabase

1. **Créer un projet Supabase** :
   - Allez sur [supabase.com](https://supabase.com)
   - Créez un compte ou connectez-vous
   - Créez un nouveau projet
   - Notez votre mot de passe de base de données

2. **Obtenir l'URL de connexion** :
   - Dans votre projet Supabase, allez dans **Settings** > **Database**
   - Copiez la **Connection string** (URI)
   - Remplacez `[YOUR-PASSWORD]` par votre mot de passe

3. **Créer le fichier `.env`** :
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-key-aleatoire-ici"
```

Pour générer un secret aléatoire, vous pouvez utiliser :
```bash
openssl rand -base64 32
```

### 3. Initialiser la base de données
```bash
npm run prisma:generate
npm run prisma:migrate
```

Cela créera toutes les tables dans votre base de données Supabase.

### 4. Créer un utilisateur administrateur
```bash
npm run create-admin
```

Ou avec des paramètres personnalisés :
```bash
npm run create-admin admin@transport.com motdepasse123 Admin Système +237 6XX XXX XXX
```

### 5. Lancer l'application
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## Utilisation

### Connexion
- **Admin** : Utilisez les identifiants créés avec le script `create-admin`
- **Client** : Créez un compte via la page d'inscription

### Fonctionnalités principales

#### Pour les clients
1. Créer un compte sur `/inscription`
2. Rechercher des trajets sur `/reservation`
3. Réserver un billet
4. Consulter ses réservations sur `/client/dashboard`

#### Pour les administrateurs
1. Se connecter avec les identifiants admin
2. Accéder au dashboard sur `/admin/dashboard`
3. Gérer les trajets, véhicules, conducteurs, horaires
4. Valider les réservations
5. Suivre les paiements et statistiques

## Structure des données

### Créer des données de test

Vous pouvez utiliser Prisma Studio pour créer des données :
```bash
npm run prisma:studio
```

Ou créer manuellement via l'interface admin après connexion.

## Dépannage

### Erreur de base de données
Si vous rencontrez des erreurs liées à la base de données :
- Vérifiez que votre `DATABASE_URL` dans `.env` est correcte
- Vérifiez que votre projet Supabase est actif
- Réinitialisez les migrations si nécessaire :
```bash
npm run prisma:migrate reset
```

### Erreur d'authentification
Vérifiez que `NEXTAUTH_SECRET` est bien défini dans votre fichier `.env`

### Port déjà utilisé
Si le port 3000 est déjà utilisé, Next.js utilisera automatiquement le port 3001.

## Commandes utiles

- `npm run dev` - Lancer en mode développement
- `npm run build` - Construire pour la production
- `npm run start` - Lancer en mode production
- `npm run lint` - Vérifier le code
- `npm run prisma:studio` - Ouvrir Prisma Studio (interface graphique pour la base de données)
- `npm run create-admin` - Créer un utilisateur administrateur

