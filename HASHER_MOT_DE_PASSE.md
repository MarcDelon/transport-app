# Comment hasher un mot de passe pour Supabase

## Problème

Si vous créez un utilisateur directement dans Supabase, le mot de passe est en **texte brut**. Mais le code de connexion attend un **hash bcrypt**.

## Solution 1 : Utiliser le script create-admin (Recommandé)

Le script hash automatiquement le mot de passe :

```bash
npm run create-admin email@example.com motdepasse123 Nom Prenom +237 6XX XXX XXX
```

## Solution 2 : Hasher manuellement un mot de passe

### Option A : Via Node.js (dans votre terminal)

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('votre-mot-de-passe', 10).then(hash => console.log(hash));"
```

### Option B : Créer un script temporaire

Créez un fichier `hash-password.js` :

```javascript
const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'admin123';

bcrypt.hash(password, 10).then(hash => {
  console.log('\n✅ Hash généré :\n');
  console.log(hash);
  console.log('\n📋 Copiez ce hash dans Supabase pour le champ "password"\n');
});
```

Puis exécutez :
```bash
node hash-password.js votre-mot-de-passe
```

## Solution 3 : Mettre à jour le mot de passe dans Supabase

1. Générez le hash avec une des méthodes ci-dessus
2. Allez dans Supabase → Table Editor → User
3. Trouvez votre utilisateur
4. Remplacez le champ `password` par le hash généré
5. Sauvegardez

## Vérification

Pour vérifier qu'un hash est correct, vous pouvez tester :

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.compare('votre-mot-de-passe', 'hash-de-la-base').then(result => console.log('Match:', result));"
```

## Important

- ✅ Le hash doit commencer par `$2a$10$` ou `$2b$10$`
- ✅ Le hash fait environ 60 caractères
- ✅ Ne stockez JAMAIS les mots de passe en texte brut

