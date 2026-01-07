# Instructions - Remplir la base de données avec des données complètes

## Script SQL complet

Le fichier `supabase_complete_seed.sql` contient un script SQL complet pour remplir toutes les tables de votre base de données avec des données de test réalistes.

## Données incluses

### 1. Utilisateurs (11 utilisateurs)
- ✅ 1 Admin : `admin@nova.com` / `admin123`
- ✅ 10 Clients : `client123` pour tous
  - jean.dupont@email.com
  - marie.martin@email.com
  - pierre.bernard@email.com
  - sophie.durand@email.com
  - lucas.leroy@email.com
  - emma.moreau@email.com
  - thomas.simon@email.com
  - laura.roux@email.com
  - antoine.vincent@email.com
  - camille.michel@email.com

### 2. Trajets (20 trajets)
- ✅ Yaoundé ↔ Douala
- ✅ Yaoundé ↔ Bafoussam
- ✅ Douala ↔ Bafoussam
- ✅ Yaoundé ↔ Garoua
- ✅ Douala ↔ Buea
- ✅ Yaoundé ↔ Bamenda
- ✅ Douala ↔ Limbe
- ✅ Yaoundé ↔ Ebolowa
- ✅ Yaoundé ↔ Bertoua
- ✅ Douala ↔ Kribi

### 3. Véhicules (10 véhicules)
- ✅ 9 véhicules en service
- ✅ 1 véhicule en maintenance
- ✅ Capacités variées : 18, 22, 25, 28, 30 places
- ✅ Marques : Mercedes, Toyota, Ford, Iveco

### 4. Conducteurs (10 conducteurs)
- ✅ Expérience variée : 6 à 20 ans
- ✅ Noms camerounais réalistes

### 5. Horaires (20 horaires)
- ✅ Horaires pour les 7 prochains jours
- ✅ Départs à différents moments de la journée
- ✅ Répartition sur différents trajets

### 6. Réservations (10 réservations)
- ✅ Statuts variés : CONFIRMEE, EN_ATTENTE
- ✅ Nombre de places varié : 1 à 4 places
- ✅ Numéros de siège assignés

### 7. Paiements (6 paiements)
- ✅ Méthodes variées : CARTE_BANCAIRE, MOBILE_MONEY, ESPECES
- ✅ Factures générées
- ✅ Liés aux réservations confirmées

### 8. Abonnements (4 abonnements)
- ✅ 2 abonnements mensuels
- ✅ 2 abonnements annuels
- ✅ Réductions appliquées

### 9. Réductions (5 réductions)
- ✅ Étudiants : 15%
- ✅ Seniors : 20%
- ✅ Groupes : 10%
- ✅ Early Bird : 5%
- ✅ Promotion spéciale : 25%

### 10. Bagages (7 bagages)
- ✅ Bagages gratuits et payants
- ✅ Poids et volumes variés
- ✅ Étiquettes générées

## Comment utiliser

### Étape 1 : Accéder au SQL Editor
1. Allez sur https://kmjsdfxbbiefpnujutgj.supabase.co
2. Cliquez sur **SQL Editor** dans le menu de gauche
3. Cliquez sur **New query**

### Étape 2 : Exécuter le script
1. Ouvrez le fichier `supabase_complete_seed.sql`
2. **Copiez TOUT le contenu** du fichier
3. **Collez-le** dans l'éditeur SQL de Supabase
4. Cliquez sur **Run** (ou Ctrl+Enter / Cmd+Enter)

### Étape 3 : Vérifier
Le script affichera automatiquement le nombre d'enregistrements créés dans chaque table à la fin.

Vous devriez voir :
- User: 11
- Trajet: 20
- Vehicule: 10
- Conducteur: 10
- Horaire: 20
- Reservation: 10
- Paiement: 6
- Abonnement: 4
- Reduction: 5
- Bagage: 7

## Important

✅ **Les hash de mots de passe sont déjà inclus dans le script !**

Les utilisateurs peuvent se connecter directement avec :
- **Admin** : `admin@nova.com` / `admin123`
- **Clients** : Tous les clients utilisent `client123` comme mot de passe

Les hash bcrypt sont déjà générés et inclus dans le script SQL.

Si vous souhaitez changer les mots de passe après l'exécution du script, utilisez :

```bash
npm run update-password <email> <nouveau-mot-de-passe>
```

## Après l'exécution

Une fois le script exécuté :

1. ✅ Votre application aura des données complètes
2. ✅ Vous pourrez tester toutes les fonctionnalités
3. ✅ Les réservations, paiements, etc. seront visibles
4. ✅ Les horaires seront disponibles pour les prochains jours

## Test

1. Connectez-vous avec `admin@nova.com` / `admin123` (après avoir mis à jour le hash)
2. Allez sur `/admin/dashboard` pour voir toutes les données
3. Connectez-vous avec un client pour voir ses réservations
4. Testez la recherche de trajets sur `/reservation`

## Note

Si vous exécutez le script plusieurs fois, les `ON CONFLICT DO NOTHING` empêcheront les doublons. Pour réinitialiser, supprimez d'abord les données existantes.

