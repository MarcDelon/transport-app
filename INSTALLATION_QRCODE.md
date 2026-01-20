# Installation du système de QR Code

## 📦 Installation de qrcode

Exécutez cette commande dans le terminal :

```bash
npm install qrcode
npm install --save-dev @types/qrcode
```

## 🎯 Utilisation

Le QR code est généré automatiquement pour chaque réservation et contient :
- Numéro de réservation
- Nom du passager
- Trajet (départ → arrivée)
- Date et heure de départ
- Nombre de places
- Numéro de facture

Le QR code peut être :
- ✅ Affiché sur la page de réservation
- ✅ Inclus dans l'email du billet
- ✅ Scanné par l'admin au départ pour validation

## 🔐 Sécurité

Le QR code contient des données signées pour éviter la fraude.
