# NOVA - Système de Gestion de Transport Interurbain

Application web complète développée avec Next.js 14, React, TypeScript, Prisma et NextAuth pour la gestion de la compagnie de transport interurbain **NOVA**.

## Fonctionnalités

### Pour les Clients
- ✅ Inscription et connexion sécurisée
- ✅ Recherche et réservation de billets
- ✅ Gestion des réservations personnelles
- ✅ Visualisation des trajets disponibles
- ✅ Dashboard client avec historique des réservations

### Pour les Administrateurs
- ✅ Dashboard administratif avec statistiques
- ✅ Gestion des clients (passagers)
- ✅ Gestion des trajets
- ✅ Gestion des véhicules
- ✅ Gestion des conducteurs
- ✅ Gestion des horaires et planning
- ✅ Gestion des réservations et billets
- ✅ Suivi des paiements
- ✅ Gestion des abonnements et réductions
- ✅ Gestion des bagages

## Technologies utilisées

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Prisma** - ORM pour la base de données
- **NextAuth.js** - Authentification avec gestion des rôles
- **Tailwind CSS** - Framework CSS utilitaire
- **Supabase (PostgreSQL)** - Base de données cloud

## Installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd transport
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer Supabase**

   - Créez un projet sur [supabase.com](https://supabase.com)
   - Obtenez votre URL de connexion dans Settings > Database
   - Créez un fichier `.env` à la racine du projet :
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-key-ici"
```

4. **Initialiser la base de données**
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. **Créer un utilisateur administrateur** (optionnel)

Vous pouvez créer un utilisateur admin via Prisma Studio :
```bash
npx prisma studio
```

Ou créer un script de seed (voir section suivante).

6. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## Structure du projet

```
transport/
├── app/                    # Pages et routes Next.js
│   ├── admin/             # Pages admin
│   ├── client/            # Pages client
│   ├── api/               # API routes
│   ├── connexion/         # Page de connexion
│   ├── inscription/       # Page d'inscription
│   └── reservation/       # Pages de réservation
├── components/            # Composants React réutilisables
├── lib/                   # Utilitaires et configurations
├── prisma/                # Schéma Prisma
├── types/                 # Types TypeScript
└── public/                # Fichiers statiques
```

## Schéma de base de données

Le système gère les entités suivantes :
- **User** - Utilisateurs (clients et admins)
- **Trajet** - Trajets entre villes
- **Vehicule** - Flotte de véhicules
- **Conducteur** - Conducteurs
- **Horaire** - Horaires des trajets
- **Reservation** - Réservations de billets
- **Paiement** - Transactions de paiement
- **Abonnement** - Abonnements clients
- **Reduction** - Réductions et promotions
- **Bagage** - Gestion des bagages

## Création d'un utilisateur admin

Pour créer un utilisateur administrateur, vous pouvez utiliser Prisma Studio ou créer un script :

```typescript
// scripts/create-admin.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('motdepasse', 10)
  
  await prisma.user.create({
    data: {
      email: 'admin@transport.com',
      password: hashedPassword,
      nom: 'Admin',
      prenom: 'Système',
      telephone: '+237 6XX XXX XXX',
      role: 'ADMIN',
    },
  })
  
  console.log('Admin créé avec succès')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

## Routes principales

### Pages publiques
- `/` - Page d'accueil
- `/connexion` - Connexion
- `/inscription` - Inscription
- `/reservation` - Recherche et réservation de billets
- `/trajets` - Liste des trajets disponibles

### Pages client
- `/client/dashboard` - Dashboard client
- `/client/reservations/[id]` - Détails d'une réservation

### Pages admin
- `/admin/dashboard` - Dashboard administrateur
- `/admin/clients` - Gestion des clients
- `/admin/trajets` - Gestion des trajets
- `/admin/vehicules` - Gestion des véhicules
- `/admin/conducteurs` - Gestion des conducteurs
- `/admin/reservations` - Gestion des réservations
- `/admin/horaires` - Gestion des horaires
- `/admin/paiements` - Gestion des paiements
- `/admin/abonnements` - Gestion des abonnements

## API Routes

- `POST /api/auth/register` - Inscription
- `GET /api/trajets/search` - Recherche de trajets
- `GET /api/horaires/[id]` - Détails d'un horaire
- `POST /api/reservations` - Créer une réservation
- `GET /api/client/reservations` - Réservations du client
- `GET /api/admin/stats` - Statistiques admin
- `GET /api/admin/reservations` - Liste des réservations (admin)
- `PATCH /api/admin/reservations/[id]` - Modifier une réservation

## Développement

### Commandes disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint

# Prisma
npm run prisma:generate    # Générer le client Prisma
npm run prisma:migrate     # Créer une migration
npm run prisma:studio      # Ouvrir Prisma Studio
```

## Fonctionnalités implémentées

✅ **Authentification et gestion des rôles**
- Inscription et connexion sécurisée
- Gestion des rôles (Admin/Client)
- Protection des routes selon les rôles

✅ **Gestion des clients**
- Inscription avec informations personnelles
- Dashboard client avec historique des réservations
- Visualisation des détails de réservation

✅ **Gestion des trajets**
- Création, modification et suppression de trajets
- Recherche de trajets disponibles
- Affichage des trajets avec horaires

✅ **Gestion des véhicules**
- CRUD complet pour les véhicules
- Gestion des statuts (En service, En maintenance, Hors service)
- Vérification des immatriculations uniques

✅ **Gestion des conducteurs**
- CRUD complet pour les conducteurs
- Suivi de l'expérience
- Vérification des numéros de permis uniques

✅ **Gestion des horaires**
- Planification des horaires de trajets
- Attribution de véhicules et conducteurs
- Vérification des conflits de disponibilité

✅ **Gestion des réservations**
- Création de réservations par les clients
- Validation et gestion par les admins
- Suivi des statuts (Confirmée, En attente, Annulée)

✅ **Gestion des paiements**
- Suivi de tous les paiements
- Calcul des revenus totaux
- Support de plusieurs méthodes de paiement

✅ **Gestion des abonnements**
- Visualisation des abonnements actifs/expirés
- Suivi des réductions et trajets inclus

## Prochaines étapes

- [ ] Système de paiement intégré (intégration avec passerelles de paiement)
- [ ] Génération de QR codes pour les billets
- [ ] Gestion complète des bagages
- [ ] Notifications par email
- [ ] Export de rapports (PDF, Excel)
- [ ] Gestion des réductions et promotions
- [ ] Tests unitaires et d'intégration
- [ ] Interface mobile responsive améliorée

## Licence

Ce projet est sous licence MIT.


