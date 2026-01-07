# Fix - Problème de connexion

## Problèmes identifiés

1. **NEXTAUTH_SECRET** : Le secret est toujours la valeur par défaut
2. **Gestion des erreurs** : Pas assez de logs pour déboguer
3. **Redirection** : Peut-être un problème avec router.push

## Solutions appliquées

### 1. Amélioration des logs
- ✅ Logs détaillés dans `lib/auth.ts` pour voir les erreurs Supabase
- ✅ Logs dans `app/connexion/page.tsx` pour suivre le processus
- ✅ Affichage des erreurs dans la console

### 2. Amélioration de la redirection
- ✅ Utilisation de `window.location.href` au lieu de `router.push` pour forcer la redirection
- ✅ Attente de 300ms pour que la session soit mise à jour

### 3. Normalisation de l'email
- ✅ Email normalisé (trim + lowercase) avant l'envoi

## Action requise : Configurer NEXTAUTH_SECRET

Le `NEXTAUTH_SECRET` doit être un secret aléatoire. Générez-en un :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Puis mettez à jour votre `.env` :
```env
NEXTAUTH_SECRET=votre-secret-genere-ici
```

## Vérifications

1. **Ouvrez la console du navigateur** (F12) et regardez les logs
2. **Regardez la console du serveur** (terminal où `npm run dev` tourne)
3. **Vérifiez que l'utilisateur existe** dans Supabase avec le bon email et mot de passe hashé

## Test

1. Redémarrez le serveur après avoir mis à jour NEXTAUTH_SECRET
2. Essayez de vous connecter
3. Regardez les logs dans la console du navigateur et du serveur
4. Partagez les erreurs si le problème persiste

