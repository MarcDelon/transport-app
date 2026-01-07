# Test complet de connexion

## Étapes de test

### 1. Vérifier que le serveur est bien démarré
Le serveur doit tourner sur **http://localhost:3000** (ou 3001 si 3000 est occupé)

### 2. Vérifier les variables d'environnement
Le fichier `.env` doit contenir :
```env
NEXT_PUBLIC_SUPABASE_URL=https://kmjsdfxbbiefpnujutgj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=GjFOtP4rj+4O5ebXTqTm/AhxGO9tqDE6rYBvfG9oSCA=
```

### 3. Tester l'inscription
1. Allez sur http://localhost:3000/inscription
2. Remplissez le formulaire
3. Vérifiez que vous voyez "Compte créé avec succès"

### 4. Vérifier dans Supabase
1. Allez dans **Table Editor** → **User**
2. Trouvez l'utilisateur créé
3. Vérifiez que :
   - Email est en lowercase
   - Password commence par `$2a$10$`
   - Role est `CLIENT`

### 5. Tester la connexion
1. Allez sur http://localhost:3000/connexion
2. Entrez l'email et le mot de passe
3. Cliquez sur "Se connecter"

### 6. Regarder les logs

#### Console du serveur (terminal)
Vous devriez voir :
```
Tentative de connexion avec: email@example.com
Utilisateur trouvé: { id: '...', email: '...', role: 'CLIENT' }
Connexion réussie pour: email@example.com
JWT callback - User reçu: { id: '...', email: '...', role: 'CLIENT', name: '...' }
JWT callback - Token mis à jour: { role: 'CLIENT', id: '...', email: '...' }
Session callback - Token: { role: 'CLIENT', id: '...', email: '...' }
Session callback - Session mise à jour: { user: { ... } }
```

#### Console du navigateur (F12)
Vous devriez voir :
```
Tentative de connexion avec: email@example.com
Résultat de signIn: { ok: true, error: null, status: 200, url: null }
Result OK: true
Result Error: null
```

## Si ça ne fonctionne pas

### Erreur : "Aucun utilisateur trouvé"
- Vérifiez que l'email dans Supabase est exactement le même (en lowercase)
- Vérifiez que l'utilisateur existe bien dans la table User

### Erreur : "Mot de passe incorrect"
- Le mot de passe dans Supabase n'est pas hashé correctement
- Utilisez `npm run update-password` pour corriger

### Erreur : "Result OK: false"
- Regardez `Result Error:` pour voir l'erreur exacte
- Vérifiez les logs du serveur pour plus de détails

### La page ne redirige pas
- Vérifiez que `Result OK: true` dans la console
- Vérifiez que la session est bien créée
- Essayez de rafraîchir la page manuellement

## Partagez les logs

Si le problème persiste, partagez :
1. Les logs de la console du serveur
2. Les logs de la console du navigateur
3. L'email utilisé (sans le mot de passe)
4. Le message d'erreur affiché à l'écran

