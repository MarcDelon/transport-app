# Configuration du fichier .env

## ✅ Votre DATABASE_URL est prête !

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
# Database URL for Supabase
DATABASE_URL="postgresql://postgres:Marcdelon2123@db.kmjsdfxbbiefpnujutgj.supabase.co:5432/postgres"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
```

## 📝 Étapes

1. **Créez le fichier `.env`** à la racine du projet (même niveau que `package.json`)

2. **Copiez le contenu ci-dessus** dans le fichier `.env`

3. **Générez un secret pour NextAuth** (optionnel mais recommandé) :
   ```bash
   openssl rand -base64 32
   ```
   Remplacez `your-secret-key-change-this-in-production` par la valeur générée.

4. **Testez la connexion** :
   ```bash
   npx prisma db pull
   ```

Si cette commande fonctionne sans erreur, votre connexion à Supabase est correcte ! 🎉

## ⚠️ Important

- Le fichier `.env` ne doit **jamais** être commité dans Git (il est déjà dans `.gitignore`)
- Ne partagez jamais votre mot de passe de base de données
- En production, utilisez des variables d'environnement sécurisées

