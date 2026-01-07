# Configuration Simple - Supabase

## Méthode 1 : Utiliser Prisma (actuel - recommandé)

Pour Prisma, vous avez besoin de la **Connection String** complète avec le mot de passe.

### Obtenir la Connection String

1. Allez sur votre projet Supabase : https://kmjsdfxbbiefpnujutgj.supabase.co
2. Cliquez sur **Settings** (⚙️) > **Database**
3. Faites défiler jusqu'à **Connection string**
4. Sélectionnez **URI** (pas Connection pooling)
5. Copiez l'URL qui ressemble à :
   ```
   postgresql://postgres.kmjsdfxbbiefpnujutgj:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
   ```

### Configurer .env

Créez un fichier `.env` à la racine du projet :

```env
# Database - Remplacez [YOUR-PASSWORD] par votre mot de passe Supabase
DATABASE_URL="postgresql://postgres.kmjsdfxbbiefpnujutgj:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="générez-un-secret-aléatoire"
```

**Important** : Si votre mot de passe contient des caractères spéciaux, utilisez le script :
```bash
node scripts/fix-database-url.js "votre-mot-de-passe"
```

---

## Méthode 2 : Utiliser le Client Supabase JS (alternative)

Si vous préférez utiliser uniquement l'API Supabase (sans Prisma), vous pouvez utiliser :

### Configurer .env

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://kmjsdfxbbiefpnujutgj.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttanNkZnhiYmllZnBudWp1dGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NTk1MzUsImV4cCI6MjA4MzIzNTUzNX0.397B_dFsuudXE6y6ivPNwC-NNDx3Jtv1i8t3QH-iqTo"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="générez-un-secret-aléatoire"
```

**Note** : Cette méthode nécessiterait de refactoriser tout le code pour utiliser le client Supabase au lieu de Prisma.

---

## Quelle méthode choisir ?

- **Méthode 1 (Prisma)** : ✅ Actuellement utilisée dans le projet, plus simple à maintenir
- **Méthode 2 (Supabase JS)** : Nécessite de réécrire tout le code d'accès à la base de données

**Recommandation** : Utilisez la Méthode 1 avec Prisma.

---

## Obtenir votre mot de passe Supabase

Si vous avez oublié votre mot de passe, consultez **`RESET_PASSWORD.md`** pour un guide détaillé.

**Résumé rapide** :
1. Allez sur https://kmjsdfxbbiefpnujutgj.supabase.co
2. **Settings** > **Database**
3. Faites défiler jusqu'à **Database password**
4. Cliquez sur **Reset database password**
5. Entrez un nouveau mot de passe (sans caractères spéciaux pour simplifier)
6. Utilisez ce nouveau mot de passe dans votre `.env`

---

## Vérification

Après avoir configuré `.env`, testez la connexion :

```bash
# Générer Prisma Client
npm run prisma:generate

# Tester la connexion
npx prisma db pull
```

Si cela fonctionne, votre configuration est correcte ! ✅

