# Installation du système d'envoi d'emails

## 📦 Installation de nodemailer

Exécutez cette commande dans le terminal :

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

## 🔧 Configuration Gmail (Recommandé pour les tests)

### Étape 1 : Créer un mot de passe d'application Gmail

1. Allez sur votre compte Google : https://myaccount.google.com/
2. Sécurité → Validation en deux étapes (activez-la si ce n'est pas fait)
3. Sécurité → Mots de passe des applications
4. Sélectionnez "Autre" et nommez-le "Nova Transport"
5. Copiez le mot de passe généré (16 caractères)

### Étape 2 : Configurer les variables d'environnement

Ajoutez ces lignes dans votre fichier `.env.local` :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
```

Remplacez :
- `votre-email@gmail.com` par votre adresse Gmail
- `xxxx xxxx xxxx xxxx` par le mot de passe d'application généré

## 🧪 Alternative pour les tests : Mailtrap

Si vous voulez tester sans envoyer de vrais emails :

1. Créez un compte gratuit sur https://mailtrap.io
2. Copiez les identifiants SMTP
3. Configurez dans `.env.local` :

```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=votre-username-mailtrap
SMTP_PASSWORD=votre-password-mailtrap
```

## ✅ Vérification

Après configuration, le système enverra automatiquement :
- 📧 Un billet de réservation après chaque réservation
- ✅ Une confirmation de paiement quand l'admin valide le paiement

Les emails contiennent :
- Numéro de réservation et facture
- Détails du trajet (départ, arrivée, date)
- Montant à payer
- Instructions pour le voyage
- Design professionnel en HTML
