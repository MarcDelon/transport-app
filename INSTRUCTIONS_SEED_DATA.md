# Instructions pour insérer les données de test

## Option 1 : Via SQL Editor de Supabase (Recommandé)

1. Allez dans votre projet Supabase : https://kmjsdfxbbiefpnujutgj.supabase.co
2. Cliquez sur **SQL Editor** dans le menu de gauche
3. Cliquez sur **New query**
4. Ouvrez le fichier `supabase_seed_data.sql`
5. Copiez tout le contenu
6. Collez-le dans l'éditeur SQL
7. Cliquez sur **Run** (ou Ctrl+Enter)

**Important** : Le mot de passe de l'admin dans le script SQL est un placeholder. Vous devrez le mettre à jour avec un vrai hash bcrypt.

## Option 2 : Créer l'admin via le script Node.js

1. Assurez-vous que votre fichier `.env` contient la bonne `DATABASE_URL` de Supabase
2. Exécutez :
```bash
npm run create-admin admin@nova.com admin123 Admin NOVA +237 6XX XXX XXX
```

## Option 3 : Créer l'admin manuellement via Prisma Studio

1. Exécutez :
```bash
npm run prisma:studio
```

2. Allez dans la table `User`
3. Cliquez sur "Add record"
4. Remplissez les champs :
   - email: `admin@nova.com`
   - password: (vous devrez le hasher avec bcrypt - utilisez plutôt le script)
   - role: `ADMIN`
   - nom: `Admin`
   - prenom: `NOVA`
   - telephone: `+237 6XX XXX XXX`

## Données qui seront créées

### Utilisateur Admin
- **Email** : admin@nova.com
- **Mot de passe** : admin123 (à changer après la première connexion)
- **Rôle** : ADMIN

### Trajets (15 trajets)
- Yaoundé ↔ Douala
- Yaoundé ↔ Bafoussam
- Douala ↔ Bafoussam
- Yaoundé ↔ Garoua
- Douala ↔ Buea
- Yaoundé ↔ Bamenda
- Douala ↔ Limbe
- Yaoundé ↔ Ebolowa

### Véhicules (6 véhicules)
- 5 véhicules en service
- 1 véhicule en maintenance
- Capacités : 18, 22, 25, 30 places

### Conducteurs (6 conducteurs)
- Avec différents niveaux d'expérience

### Horaires (10 horaires)
- Pour les prochains jours
- Différents horaires de départ

### Reductions (5 réductions)
- Étudiants : 15%
- Seniors : 20%
- Groupes : 10%
- Réservation à l'avance : 5%
- Promotion spéciale : 25%

## Après l'insertion

1. Connectez-vous avec :
   - Email : `admin@nova.com`
   - Mot de passe : `admin123`

2. Testez la recherche de trajets sur `/reservation`

3. Créez des horaires supplémentaires depuis le dashboard admin si nécessaire

## Note importante

Le hash de mot de passe dans le script SQL (`$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq`) est un placeholder. 

**Pour obtenir le vrai hash**, exécutez :
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"
```

Puis remplacez le hash dans le script SQL avant de l'exécuter.

Ou utilisez directement le script Node.js qui génère automatiquement le hash correct.


