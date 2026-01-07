# Vérification de la connexion Supabase

## Problème actuel
La connexion Prisma ne peut pas atteindre la base de données Supabase.

## Vérifications à faire

### 1. Vérifier que le projet est actif
- Allez sur https://kmjsdfxbbiefpnujutgj.supabase.co
- Vérifiez que le projet n'est **pas en pause**
- Si le projet est en pause, cliquez sur "Resume project" pour le réactiver

### 2. Vérifier le mot de passe
- Le mot de passe utilisé est : `Marcdelon2123`
- Vérifiez dans Supabase > Settings > Database > Database password
- Si vous avez réinitialisé le mot de passe, utilisez le nouveau

### 3. Tester la connexion depuis Supabase
Dans Supabase :
1. Allez dans **SQL Editor**
2. Exécutez cette requête :
   ```sql
   SELECT version();
   ```
3. Si cela fonctionne, la base de données est accessible

### 4. Vérifier les restrictions de connexion
Dans Supabase > Settings > Database :
- Vérifiez s'il y a des restrictions IP
- Vérifiez si "Connection pooling" est activé
- Certains projets peuvent nécessiter le format avec pooler

## Solutions alternatives

### Solution 1 : Utiliser le format avec pooler
Si les connexions directes ne fonctionnent pas, essayez le format avec pooler :

```env
DATABASE_URL="postgresql://postgres.kmjsdfxbbiefpnujutgj:Marcdelon2123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
```

### Solution 2 : Créer les tables manuellement
Si Prisma ne peut pas se connecter, vous pouvez :
1. Aller dans Supabase > SQL Editor
2. Exécuter le script `supabase_schema_simple.sql`
3. Créer les tables manuellement
4. Utiliser Prisma uniquement pour les requêtes (après avoir généré le client)

### Solution 3 : Vérifier la région
La région peut être différente. Dans Supabase :
- Settings > Database
- Regardez l'URL complète de connexion
- Notez la région mentionnée (ex: `eu-central-1`, `us-east-1`, etc.)

## Test rapide
Pour tester si c'est un problème de mot de passe ou de connexion :

1. Essayez de vous connecter avec un outil comme pgAdmin ou DBeaver
2. Utilisez les mêmes identifiants
3. Si cela ne fonctionne pas, le problème vient de la connexion ou du mot de passe

