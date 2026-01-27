# Guide de la Sélection de Sièges - NOVA

## 🎯 Vue d'ensemble

La fonctionnalité de sélection de sièges permet aux clients de choisir leurs places dans le bus lors de la réservation, offrant une expérience utilisateur moderne et intuitive.

---

## 📋 Étapes d'installation

### 1. Exécuter la migration SQL

Exécutez le script suivant dans **Supabase SQL Editor** :

```bash
sql/19_gestion_sieges.sql
```

Ce script va :
- ✅ Créer la table `Siege` pour gérer les sièges individuellement
- ✅ Créer la table `ConfigurationVehicule` pour définir la disposition des sièges
- ✅ Ajouter des contraintes d'unicité (1 siège = 1 réservation par horaire)
- ✅ Créer des triggers pour synchroniser les données
- ✅ Générer des configurations par défaut pour tous les véhicules existants
- ✅ Activer les politiques RLS

### 2. Vérifier l'installation

Après l'exécution du script, vérifiez que les tables ont été créées :

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('Siege', 'ConfigurationVehicule');
```

---

## 🚀 Fonctionnalités implémentées

### 1. **API Routes**

#### `GET /api/horaires/[id]/sieges`
Récupère l'état de tous les sièges pour un horaire donné.

**Réponse :**
```json
{
  "horaireId": "horaire_123",
  "vehicule": {
    "id": "vehicule_456",
    "marque": "Mercedes",
    "modele": "Sprinter",
    "capacite": 40
  },
  "configuration": {
    "nombreRangees": 10,
    "siegesParRangee": 4,
    "alleePosition": 2
  },
  "sieges": [
    { "numero": 1, "disponible": true, "statut": "disponible" },
    { "numero": 2, "disponible": false, "statut": "occupe" },
    ...
  ],
  "statistiques": {
    "capaciteTotal": 40,
    "placesDisponibles": 25,
    "placesOccupees": 15,
    "tauxOccupation": 37
  }
}
```

#### `POST /api/reservations`
Modifiée pour accepter les sièges sélectionnés.

**Requête :**
```json
{
  "horaireId": "horaire_123",
  "nombrePlaces": 2,
  "sieges": [5, 6]
}
```

### 2. **Composant React : BusSeatSelector**

Composant interactif de visualisation et sélection des sièges.

**Props :**
- `horaireId`: ID de l'horaire
- `nombrePlacesMax`: Nombre maximum de places à sélectionner
- `onSiegesSelected`: Callback appelé quand les sièges changent

**Fonctionnalités :**
- ✅ Affichage du plan du bus en 2D
- ✅ Visualisation en temps réel des sièges disponibles/occupés
- ✅ Sélection/désélection interactive
- ✅ Limite automatique au nombre de places demandé
- ✅ Statistiques (places disponibles, taux d'occupation)
- ✅ Légende visuelle
- ✅ Responsive (mobile + desktop)
- ✅ Animations fluides

### 3. **Flow de réservation en 2 étapes**

**Étape 1 : Détails de la réservation**
- Sélection du nombre de places
- Affichage du tarif total
- Bouton "Continuer vers la sélection des sièges"

**Étape 2 : Sélection des sièges**
- Plan interactif du bus
- Résumé de la réservation
- Validation uniquement si tous les sièges sont sélectionnés
- Bouton retour pour modifier le nombre de places

---

## 🎨 Interface utilisateur

### Légende des couleurs

| Couleur | Statut | Description |
|---------|--------|-------------|
| 🟢 Vert | Disponible | Siège libre, cliquable |
| 🔵 Bleu | Sélectionné | Siège choisi par l'utilisateur |
| ⚫ Gris | Occupé | Siège déjà réservé, non cliquable |

### Disposition du bus

```
        AVANT
    ┌─────────────┐
    │ 1  2 │ 3  4 │
    │ 5  6 │ 7  8 │
    │ 9 10 │11 12 │
    │13 14 │15 16 │
    │17 18 │19 20 │
    └─────────────┘
       ARRIÈRE
```

---

## 🔧 Configuration des véhicules

### Structure de ConfigurationVehicule

```typescript
{
  vehiculeId: string
  nombreRangees: number      // Nombre de rangées (ex: 10)
  siegesParRangee: number    // Sièges par rangée (ex: 4)
  alleePosition: number      // Position de l'allée (ex: 2 = après le 2e siège)
  siegesSpeciaux: string     // JSON pour sièges spéciaux (optionnel)
}
```

### Modifier la configuration d'un véhicule

```sql
UPDATE "ConfigurationVehicule"
SET 
  "nombreRangees" = 12,
  "siegesParRangee" = 4,
  "alleePosition" = 2
WHERE "vehiculeId" = 'votre_vehicule_id';
```

---

## 🛡️ Sécurité et contraintes

### Contraintes SQL

1. **Unicité des sièges** : Un siège ne peut être réservé qu'une fois par horaire
   ```sql
   UNIQUE INDEX "Siege_horaireId_numeroSiege_key"
   ```

2. **Cohérence des données** : Le nombre de sièges sélectionnés doit correspondre au nombre de places

3. **Vérification en temps réel** : L'API vérifie la disponibilité avant de confirmer

### Politiques RLS

- ✅ Tout le monde peut voir les sièges disponibles
- ✅ Seuls les utilisateurs connectés peuvent réserver
- ✅ Les admins peuvent modifier toutes les réservations

---

## 📱 Utilisation

### Pour les clients

1. **Rechercher un trajet** sur `/reservation`
2. **Sélectionner un horaire** et cliquer sur "Réserver"
3. **Choisir le nombre de places** (1-10)
4. **Cliquer sur "Continuer vers la sélection des sièges"**
5. **Sélectionner les sièges** sur le plan interactif
6. **Confirmer la réservation**

### Pour les admins

Les admins peuvent :
- Voir toutes les réservations avec les numéros de sièges
- Modifier les configurations des véhicules
- Gérer les conflits de sièges

---

## 🧪 Tests

### Tester la disponibilité des sièges

```sql
-- Voir les sièges disponibles pour un horaire
SELECT * FROM get_sieges_disponibles('votre_horaire_id');
```

### Tester une réservation

1. Créez un horaire de test
2. Réservez 2 places avec les sièges [5, 6]
3. Vérifiez que ces sièges apparaissent comme occupés
4. Tentez de réserver à nouveau le siège 5 → doit échouer

---

## 🐛 Dépannage

### Les sièges ne s'affichent pas

**Vérifier :**
1. Le script SQL a bien été exécuté
2. La table `ConfigurationVehicule` contient des données
3. L'API `/api/horaires/[id]/sieges` retourne des données

```sql
SELECT * FROM "ConfigurationVehicule" LIMIT 5;
```

### Erreur "Siège déjà occupé"

**Causes possibles :**
1. Deux utilisateurs ont sélectionné le même siège simultanément
2. Le cache du navigateur n'est pas à jour
3. Une réservation existe déjà

**Solution :** Rafraîchir la page et resélectionner

### Les configurations ne sont pas créées

**Exécuter manuellement :**
```sql
INSERT INTO "ConfigurationVehicule" (id, "vehiculeId", "nombreRangees", "siegesParRangee", "alleePosition", "createdAt", "updatedAt")
SELECT 
    'config_' || v.id,
    v.id,
    10,
    4,
    2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "Vehicule" v
WHERE NOT EXISTS (
    SELECT 1 FROM "ConfigurationVehicule" cv WHERE cv."vehiculeId" = v.id
);
```

---

## 🚀 Prochaines améliorations possibles

- [ ] Sièges premium (plus chers, plus d'espace)
- [ ] Sièges réservés pour PMR
- [ ] Sélection automatique des meilleurs sièges
- [ ] Historique des sièges préférés par client
- [ ] Vue 3D du bus
- [ ] Indication de la proximité des toilettes/sortie
- [ ] Sièges côté fenêtre vs côté allée

---

## 📞 Support

Pour toute question ou problème, consultez :
- Les logs de l'API : Console du navigateur
- Les logs SQL : Supabase Dashboard > Logs
- La documentation Supabase : https://supabase.com/docs

---

**Développé avec ❤️ pour NOVA Transport**
