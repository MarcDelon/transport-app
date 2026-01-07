# Guide - Configuration de DATABASE_URL pour Supabase

## Problème : "invalid domain character in database URL"

Cette erreur se produit lorsque votre mot de passe Supabase contient des caractères spéciaux qui doivent être encodés dans l'URL.

## Solution rapide

### Option 1 : Utiliser le script automatique

1. Exécutez le script avec votre mot de passe :
   ```bash
   node scripts/fix-database-url.js "votre-mot-de-passe-avec-@#\$%"
   ```

2. Le script générera automatiquement la bonne URL avec les caractères encodés

3. Copiez l'URL générée dans votre fichier `.env`

### Option 2 : Encoder manuellement

Si votre mot de passe contient des caractères spéciaux, vous devez les encoder :

**Caractères à encoder :**
- `@` devient `%40`
- `#` devient `%23`
- `$` devient `%24`
- `%` devient `%25`
- `&` devient `%26`
- `+` devient `%2B`
- `=` devient `%3D`
- `?` devient `%3F`
- `/` devient `%2F`
- `:` devient `%3A`
- ` ` (espace) devient `%20`

**Exemple :**
Si votre mot de passe est : `Mon@Mot#De$Passe123`

L'URL devrait être :
```
postgresql://postgres.kmjsdfxbbiefpnujutgj:Mon%40Mot%23De%24Passe123@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

### Option 3 : Utiliser encodeURIComponent (JavaScript)

Dans la console du navigateur ou Node.js :
```javascript
const password = "votre-mot-de-passe"
const encoded = encodeURIComponent(password)
console.log(encoded)
```

Puis utilisez la valeur encodée dans votre URL.

## Format complet de DATABASE_URL

```env
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[MOT_DE_PASSE_ENCODE]@aws-0-[REGION].pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"
```

**Remplacez :**
- `[PROJECT_REF]` : Votre référence de projet (ex: `kmjsdfxbbiefpnujutgj`)
- `[MOT_DE_PASSE_ENCODE]` : Votre mot de passe encodé
- `[REGION]` : Votre région (ex: `eu-central-1`, `us-east-1`)

## Comment trouver votre région

1. Allez sur votre projet Supabase
2. Settings > Database
3. Dans "Connection string", regardez l'URL - la région est dans le domaine (ex: `aws-0-eu-central-1`)

## Vérifier que ça fonctionne

Après avoir configuré `.env`, testez la connexion :

```bash
npx prisma db pull
```

Si cela fonctionne sans erreur, votre URL est correcte.

## Exemple complet

Si :
- Project Ref : `kmjsdfxbbiefpnujutgj`
- Mot de passe : `MyP@ss#123`
- Région : `eu-central-1`

Le mot de passe encodé devient : `MyP%40ss%23123`

L'URL finale :
```
DATABASE_URL="postgresql://postgres.kmjsdfxbbiefpnujutgj:MyP%40ss%23123@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"
```

## Alternative : Réinitialiser le mot de passe

Si vous préférez, vous pouvez réinitialiser le mot de passe Supabase pour utiliser un mot de passe sans caractères spéciaux :

1. Allez sur Supabase > Settings > Database
2. Cliquez sur "Reset database password"
3. Choisissez un nouveau mot de passe sans caractères spéciaux (ex: `MonMotDePasse123`)
4. Utilisez ce nouveau mot de passe dans votre `.env`


