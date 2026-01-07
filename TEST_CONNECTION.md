# Test de connexion Supabase

## Formats d'URL à tester

Essayez ces différents formats dans votre fichier `.env` :

### Format 1 : Connexion directe (sans pooler)
```env
DATABASE_URL="postgresql://postgres:Marcdelon2123@db.kmjsdfxbbiefpnujutgj.supabase.co:5432/postgres"
```

### Format 2 : Avec pooler (port 6543)
```env
DATABASE_URL="postgresql://postgres.kmjsdfxbbiefpnujutgj:Marcdelon2123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
```

### Format 3 : Avec pooler (port 5432)
```env
DATABASE_URL="postgresql://postgres.kmjsdfxbbiefpnujutgj:Marcdelon2123@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"
```

### Format 4 : Autres régions communes
Si votre projet est dans une autre région, essayez :
- `aws-0-us-east-1` (US East)
- `aws-0-us-west-1` (US West)
- `aws-0-eu-west-1` (EU West)
- `aws-0-ap-southeast-1` (Asia Pacific)

## Comment trouver votre région

1. Allez sur https://kmjsdfxbbiefpnujutgj.supabase.co
2. Dans le dashboard, regardez l'URL ou les informations du projet
3. La région peut être mentionnée dans les paramètres

## Vérifications importantes

1. **Le projet est-il actif ?**
   - Vérifiez que votre projet Supabase n'est pas en pause
   - Un projet en pause ne peut pas accepter de connexions

2. **Le mot de passe est-il correct ?**
   - Vérifiez que le mot de passe est bien `Marcdelon2123`
   - Si vous avez réinitialisé le mot de passe, utilisez le nouveau

3. **Les connexions directes sont-elles autorisées ?**
   - Certains projets Supabase peuvent avoir des restrictions
   - Vérifiez dans Settings > Database > Connection pooling

## Alternative : Utiliser le SQL Editor

Si la connexion Prisma ne fonctionne pas, vous pouvez :
1. Aller dans Supabase > SQL Editor
2. Exécuter directement les scripts SQL (`supabase_schema_simple.sql`)
3. Créer les tables manuellement
4. Utiliser Prisma uniquement pour les requêtes (pas pour les migrations)

