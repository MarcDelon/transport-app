# Debug - Problème d'inscription

## Problème
Erreur lors de l'inscription : "Une erreur est survenue lors de la création du compte"

## Solutions à vérifier

### 1. Vérifier les logs du serveur
Regardez la console du terminal où `npm run dev` est lancé. Vous devriez voir des erreurs détaillées.

### 2. Vérifier que la table User existe dans Supabase
1. Allez sur https://kmjsdfxbbiefpnujutgj.supabase.co
2. Cliquez sur **Table Editor**
3. Vérifiez que la table **User** existe

### 3. Vérifier les colonnes de la table User
Les colonnes doivent être :
- `id` (TEXT, PRIMARY KEY)
- `email` (TEXT, UNIQUE)
- `password` (TEXT)
- `role` (Role enum)
- `nom` (TEXT)
- `prenom` (TEXT)
- `telephone` (TEXT)
- `pieceIdentite` (TEXT, nullable)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### 4. Vérifier les permissions RLS
Si Row Level Security (RLS) est activé, il faut le désactiver ou créer des politiques.

Exécutez dans le SQL Editor de Supabase :
```sql
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
```

### 5. Tester directement dans Supabase
Essayez d'insérer un utilisateur directement dans Supabase pour voir si ça fonctionne :

```sql
INSERT INTO "User" (id, email, password, role, nom, prenom, telephone, "updatedAt")
VALUES (
  'test_123',
  'test@example.com',
  'hashed_password_here',
  'CLIENT',
  'Test',
  'User',
  '+237 6XX XXX XXX',
  CURRENT_TIMESTAMP
);
```

### 6. Vérifier les logs de l'API
Dans le code, les erreurs sont maintenant loggées avec plus de détails. Regardez la console du serveur.

## Correction appliquée

Le code a été mis à jour pour :
1. Générer automatiquement un ID unique
2. Améliorer la gestion des erreurs avec plus de détails
3. Logger les erreurs Supabase complètes

## Prochaines étapes

1. Redémarrez le serveur : `npm run dev`
2. Essayez de vous inscrire à nouveau
3. Regardez les logs dans la console du serveur
4. Partagez l'erreur exacte si le problème persiste

