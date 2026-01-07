# Dépannage - Erreur lors de l'inscription

Si vous rencontrez une erreur lors de l'inscription, suivez ces étapes pour identifier et résoudre le problème.

## Vérifications à faire

### 1. Vérifier la configuration de la base de données

Assurez-vous que le fichier `.env` existe et contient la bonne `DATABASE_URL` :

```env
DATABASE_URL="postgresql://postgres.kmjsdfxbbiefpnujutgj:[VOTRE-MOT-DE-PASSE]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-aleatoire"
```

**Important** : Remplacez `[VOTRE-MOT-DE-PASSE]` par le mot de passe de votre base de données Supabase.

### 2. Vérifier que les tables existent dans Supabase

1. Allez sur votre projet Supabase : https://kmjsdfxbbiefpnujutgj.supabase.co
2. Cliquez sur **Table Editor** dans le menu de gauche
3. Vérifiez que la table `User` existe

Si la table n'existe pas :
- Exécutez le script SQL dans le SQL Editor de Supabase (voir `INSTRUCTIONS_SQL_EDITOR.md`)
- Ou exécutez : `npm run prisma:migrate`

### 3. Vérifier que Prisma Client est généré

Exécutez :
```bash
npm run prisma:generate
```

### 4. Vérifier les logs du serveur

Lorsque vous essayez de vous inscrire, regardez la console du serveur (terminal où vous avez lancé `npm run dev`). Les erreurs détaillées y seront affichées.

### 5. Tester la connexion à la base de données

Vous pouvez tester la connexion en exécutant :
```bash
npx prisma db pull
```

Si cela fonctionne, la connexion est bonne.

## Messages d'erreur courants

### "Impossible de se connecter à la base de données"
- Vérifiez que `DATABASE_URL` est correct dans `.env`
- Vérifiez que votre mot de passe Supabase est correct
- Vérifiez que votre projet Supabase est actif

### "Cet email est déjà utilisé"
- L'email que vous utilisez existe déjà dans la base de données
- Essayez avec un autre email ou connectez-vous avec cet email

### "Tous les champs sont requis"
- Assurez-vous de remplir tous les champs obligatoires (nom, prénom, email, téléphone, mot de passe)

### "Format d'email invalide"
- Vérifiez que l'email est au bon format (ex: user@example.com)

### "Le mot de passe doit contenir au moins 6 caractères"
- Votre mot de passe est trop court

## Solution rapide

1. Vérifiez que le fichier `.env` existe et contient `DATABASE_URL`
2. Exécutez :
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```
3. Redémarrez le serveur :
   ```bash
   npm run dev
   ```
4. Réessayez de vous inscrire

## Obtenir plus d'informations

Pour voir les erreurs détaillées :
1. Ouvrez la console du navigateur (F12)
2. Regardez l'onglet "Console" pour les erreurs côté client
3. Regardez le terminal où tourne `npm run dev` pour les erreurs côté serveur


