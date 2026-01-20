# 📧 Guide d'envoi automatique des billets par email

## 🎯 Fonctionnalité

Après confirmation du paiement, le système envoie automatiquement les billets électroniques par email avec :
- ✅ QR code unique par passager
- ✅ Détails complets du voyage
- ✅ Numéro de réservation et facture
- ✅ Instructions pour le voyage

---

## 📋 Cas d'usage

### 1. Réservation pour 1 personne
- **1 email envoyé** avec 1 QR code
- Le billet contient toutes les informations du voyage

### 2. Réservation pour plusieurs personnes
- **1 email par passager** avec QR code unique
- Chaque billet contient :
  - Nom du passager
  - Numéro de place
  - QR code individuel pour validation

---

## 🔧 Utilisation de l'API

### Endpoint
```
POST /api/paiements/send-tickets
```

### Authentification
Requiert une session utilisateur valide (NextAuth)

### Corps de la requête

#### Pour une réservation simple (1 personne)
```json
{
  "reservationId": "res_123456"
}
```

#### Pour une réservation multiple (plusieurs passagers)
```json
{
  "reservationId": "res_123456",
  "passagers": [
    {
      "nom": "Nzenang",
      "prenom": "Marc",
      "email": "marcnzenang@gmail.com"
    },
    {
      "nom": "Dupont",
      "prenom": "Marie",
      "email": "marie.dupont@example.com"
    },
    {
      "nom": "Martin",
      "prenom": "Jean",
      "email": "jean.martin@example.com"
    }
  ]
}
```

### Réponse

#### Succès
```json
{
  "success": true,
  "message": "3 billet(s) envoyé(s) avec succès",
  "ticketsSent": 3
}
```

#### Erreur - Paiement non validé
```json
{
  "error": "Le paiement doit être validé avant d'envoyer les billets"
}
```

---

## 📧 Contenu de l'email

Chaque email contient :

### 1. **QR Code**
- Image PNG 200x200px
- Encodé en base64 (data URL)
- Contient :
  - ID de réservation
  - Numéro de réservation
  - Nom du passager
  - Numéro de place
  - Date de départ
  - Trajet

### 2. **Détails du voyage**
- Numéro de réservation
- Numéro de facture
- Trajet (Ville départ → Ville arrivée)
- Date et heure de départ
- Nom du passager (si multiple)
- Numéro de place (si multiple)
- Nombre de places total
- Montant payé

### 3. **Statut du paiement**
- Badge vert "Paiement confirmé" avec QR code
- Badge jaune "Paiement en attente" sans QR code

### 4. **Instructions**
- Se présenter 15 minutes avant
- Pièce d'identité obligatoire
- Conserver le billet
- Contact service client

---

## 🔐 Sécurité

### Validation du paiement
Le système vérifie que :
- ✅ La réservation existe
- ✅ Le paiement est associé à la réservation
- ✅ Le statut du paiement est `VALIDE`

Si le paiement n'est pas validé, l'API retourne une erreur 400.

### QR Code unique
Chaque QR code contient :
- Timestamp de génération
- Données de réservation chiffrées en JSON
- Impossible de dupliquer ou falsifier

---

## 🧪 Test avec votre adresse email

Pour tester l'envoi de billets à votre adresse `marcnzenang@gmail.com` :

### 1. Créer une réservation
```bash
# Via l'interface web ou l'API
POST /api/reservations
```

### 2. Valider le paiement
```bash
# Via l'interface admin
PATCH /api/paiements/{id}
{
  "statut": "VALIDE"
}
```

### 3. Envoyer les billets
```bash
POST /api/paiements/send-tickets
{
  "reservationId": "votre_reservation_id",
  "passagers": [
    {
      "nom": "Nzenang",
      "prenom": "Marc",
      "email": "marcnzenang@gmail.com"
    }
  ]
}
```

---

## ⚙️ Configuration SMTP

Assurez-vous que les variables d'environnement sont configurées dans `.env.local` :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-application
```

### Pour Gmail
1. Activer la validation en 2 étapes
2. Générer un mot de passe d'application
3. Utiliser ce mot de passe dans `SMTP_PASSWORD`

---

## 📊 Logs

Le système affiche des logs détaillés :

```
📧 Envoi des billets pour la réservation: res_123456
📧 Envoi de 3 billets individuels
📧 Envoi du billet 1/3 à: marcnzenang@gmail.com
✅ Billet 1/3 envoyé: <message-id>
📧 Envoi du billet 2/3 à: marie.dupont@example.com
✅ Billet 2/3 envoyé: <message-id>
📧 Envoi du billet 3/3 à: jean.martin@example.com
✅ Billet 3/3 envoyé: <message-id>
✅ 3 billets envoyés avec succès
```

---

## 🎨 Personnalisation

### Template email
Le template HTML est dans `lib/email.ts` fonction `generateTicketHTML()`

### QR Code
Les paramètres du QR code sont dans `lib/qrcode.ts` fonction `generateQRCodeDataURL()`

---

## ✅ Checklist de mise en œuvre

- [x] Template email avec QR code
- [x] Fonction d'envoi individuel par passager
- [x] API `/api/paiements/send-tickets`
- [x] Validation du paiement avant envoi
- [x] Génération QR code unique
- [ ] Intégration dans le flux de paiement (à faire)
- [ ] Interface pour saisir les noms des passagers (à faire)
- [ ] Tests avec email réel

---

## 🚀 Prochaines étapes

1. **Ajouter un champ "Passagers" dans le formulaire de réservation**
   - Saisir nom/prénom/email de chaque passager
   - Stocker dans une table `Passager` liée à `Reservation`

2. **Appeler automatiquement l'API après validation du paiement**
   - Dans l'interface admin après validation
   - Ou automatiquement via webhook

3. **Tester l'envoi avec votre email**
   - Créer une réservation test
   - Valider le paiement
   - Vérifier la réception des emails

---

**Votre système est maintenant prêt à envoyer des billets électroniques avec QR codes ! 🎫**
