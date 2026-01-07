# Qu'est-ce que Prisma ?

## Définition simple

**Prisma** est un outil qui permet de travailler avec votre base de données Supabase en utilisant du code TypeScript/JavaScript, au lieu d'écrire du SQL directement.

## Analogie

Imaginez que votre base de données Supabase est une bibliothèque avec des étagères (tables) :
- **Sans Prisma** : Vous devez parler en "langage bibliothèque" (SQL) pour chercher des livres
- **Avec Prisma** : Vous parlez en "langage normal" (TypeScript) et Prisma traduit pour vous

## Dans votre projet

### 1. **Prisma Schema** (`prisma/schema.prisma`)
- C'est la "carte" de votre base de données
- Décrit toutes les tables (User, Trajet, Reservation, etc.)
- Prisma utilise ce fichier pour comprendre la structure

### 2. **Prisma Client** (généré automatiquement)
- C'est l'outil qui vous permet d'écrire du code comme :
  ```typescript
  const user = await prisma.user.findUnique({
    where: { email: 'admin@example.com' }
  })
  ```
- Au lieu de :
  ```sql
  SELECT * FROM "User" WHERE email = 'admin@example.com'
  ```

### 3. **Avantages**
- ✅ **Type-safe** : TypeScript vous aide à éviter les erreurs
- ✅ **Plus simple** : Code plus lisible que le SQL
- ✅ **Auto-complétion** : Votre éditeur vous aide
- ✅ **Sécurisé** : Protection contre les injections SQL

## Workflow

1. **Vous créez les tables dans Supabase** (déjà fait ✅)
2. **Prisma génère le client** (`npm run prisma:generate`)
3. **Vous utilisez Prisma dans votre code** pour lire/écrire des données

## Exemple concret

Au lieu d'écrire :
```sql
INSERT INTO "User" (email, password, nom, prenom, telephone, role) 
VALUES ('admin@example.com', 'hash123', 'Admin', 'User', '+237...', 'ADMIN')
```

Vous écrivez :
```typescript
await prisma.user.create({
  data: {
    email: 'admin@example.com',
    password: 'hash123',
    nom: 'Admin',
    prenom: 'User',
    telephone: '+237...',
    role: 'ADMIN'
  }
})
```

C'est plus simple et plus sûr ! 🎉

