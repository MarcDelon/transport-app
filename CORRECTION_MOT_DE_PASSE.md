# Correction - Mot de passe non hashé

## Problème

Si vous avez créé un utilisateur directement dans Supabase, le mot de passe est en **texte brut**. Le code de connexion attend un **hash bcrypt**, donc la connexion échoue.

## Solution rapide : Mettre à jour le mot de passe

### Option 1 : Utiliser le script automatique (Recommandé)

```bash
npm run update-password email@example.com nouveau-mot-de-passe
```

Exemple :
```bash
npm run update-password marcnzenang@gmail.com monmotdepasse123
```

Ce script :
- ✅ Trouve l'utilisateur par email
- ✅ Hash le mot de passe avec bcrypt
- ✅ Met à jour le mot de passe dans Supabase

### Option 2 : Hasher manuellement

1. **Générez le hash** :
```bash
npm run hash-password votre-mot-de-passe
```

2. **Copiez le hash généré**

3. **Dans Supabase** :
   - Allez dans **Table Editor** → **User**
   - Trouvez votre utilisateur
   - Remplacez le champ `password` par le hash
   - Sauvegardez

### Option 3 : Créer un nouvel utilisateur avec le script

Si vous préférez, supprimez l'utilisateur dans Supabase et créez-le avec le script :

```bash
npm run create-admin email@example.com motdepasse123 Nom Prenom +237 6XX XXX XXX
```

## Vérification

Après avoir mis à jour le mot de passe, essayez de vous connecter. Si ça ne fonctionne toujours pas :

1. **Vérifiez les logs du serveur** (terminal)
2. **Vérifiez la console du navigateur** (F12)
3. **Vérifiez que l'email est en lowercase** dans Supabase

## Format du hash

Un hash bcrypt valide :
- Commence par `$2a$10$` ou `$2b$10$`
- Fait environ 60 caractères
- Exemple : `$2a$10$ewHkQ1Touvt0bFQgTK7.ce1FrrmRzWB3kTq3l4v0Tf7be4nB.UpXy`

## Important

- ❌ Ne stockez JAMAIS les mots de passe en texte brut
- ✅ Toujours utiliser bcrypt pour hasher les mots de passe
- ✅ Utilisez le script `create-admin` ou `update-password` pour créer/modifier des utilisateurs

