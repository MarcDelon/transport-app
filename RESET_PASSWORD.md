# Réinitialiser le mot de passe Supabase

## Étapes pour réinitialiser votre mot de passe

### 1. Accéder aux paramètres Supabase

1. Allez sur votre projet Supabase : **https://kmjsdfxbbiefpnujutgj.supabase.co**
2. Connectez-vous à votre compte Supabase
3. Cliquez sur l'icône **Settings** (⚙️) en bas à gauche
4. Cliquez sur **Database** dans le menu de gauche

### 2. Réinitialiser le mot de passe

1. Faites défiler jusqu'à la section **Database password**
2. Cliquez sur le bouton **Reset database password**
3. Entrez un **nouveau mot de passe** (notez-le bien !)
4. Confirmez le nouveau mot de passe
5. Cliquez sur **Reset password**

⚠️ **Important** : 
- Choisissez un mot de passe fort mais simple (sans caractères spéciaux si possible pour éviter les problèmes d'encodage)
- Notez-le dans un endroit sûr
- Le mot de passe doit contenir au moins 8 caractères

### 3. Mettre à jour votre fichier .env

Une fois le mot de passe réinitialisé, vous devez mettre à jour votre fichier `.env`.

#### Option A : Mot de passe simple (sans caractères spéciaux)

Si votre nouveau mot de passe est simple (ex: `MonNouveauMotDePasse123`), mettez à jour directement :

```env
DATABASE_URL="postgresql://postgres.kmjsdfxbbiefpnujutgj:MonNouveauMotDePasse123@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

**Remplacez** :
- `MonNouveauMotDePasse123` par votre nouveau mot de passe
- `[REGION]` par votre région (ex: `eu-central-1`, `us-east-1`)

#### Option B : Mot de passe avec caractères spéciaux

Si votre mot de passe contient des caractères spéciaux (@, #, $, %, &, etc.), utilisez le script :

```bash
node scripts/fix-database-url.js "votre-nouveau-mot-de-passe"
```

Le script générera automatiquement l'URL avec le mot de passe encodé. Copiez-la dans votre `.env`.

### 4. Obtenir la région

Pour trouver votre région :
1. Dans Supabase, allez dans **Settings** > **Database**
2. Dans la section **Connection string**, regardez l'URL
3. La région est dans le domaine, par exemple : `aws-0-eu-central-1` → région = `eu-central-1`

### 5. Vérifier que ça fonctionne

Après avoir mis à jour votre `.env`, testez la connexion :

```bash
# Générer Prisma Client
npm run prisma:generate

# Tester la connexion
npx prisma db pull
```

Si cela fonctionne sans erreur, votre configuration est correcte ! ✅

## Exemple complet

Si :
- Nouveau mot de passe : `NovaTransport2024`
- Région : `eu-central-1`

Votre `.env` devrait contenir :

```env
DATABASE_URL="postgresql://postgres.kmjsdfxbbiefpnujutgj:NovaTransport2024@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-aleatoire"
```

## Après la réinitialisation

Une fois le mot de passe réinitialisé et le `.env` mis à jour :

1. Redémarrez votre serveur de développement :
   ```bash
   npm run dev
   ```

2. Testez l'inscription à nouveau

## Aide supplémentaire

Si vous avez des problèmes :
- Vérifiez que le fichier `.env` est bien à la racine du projet
- Vérifiez qu'il n'y a pas d'espaces dans l'URL
- Vérifiez que vous utilisez le bon port (5432 pour Prisma)
- Consultez `GUIDE_DATABASE_URL.md` pour plus de détails sur l'encodage


