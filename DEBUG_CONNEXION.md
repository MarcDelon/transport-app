# Debug - Problème de connexion après inscription

## Problème
L'inscription fonctionne mais la connexion ne fonctionne pas.

## Vérifications à faire

### 1. Vérifier les logs du serveur
Regardez la console du terminal où `npm run dev` est lancé. Vous devriez voir :
- `Tentative de connexion avec: [email]`
- `Utilisateur trouvé: ...` ou `Aucun utilisateur trouvé...`
- `Mot de passe incorrect...` ou `Connexion réussie...`
- `JWT callback - User reçu: ...`
- `Session callback - Token: ...`

### 2. Vérifier les logs du navigateur
Ouvrez la console du navigateur (F12 → Console) et regardez :
- `Tentative de connexion avec: [email]`
- `Résultat de signIn: ...`
- `Result OK: true/false`
- `Result Error: ...`

### 3. Vérifier dans Supabase
1. Allez dans **Table Editor** → **User**
2. Trouvez l'utilisateur que vous avez créé
3. Vérifiez :
   - ✅ L'email est en **lowercase** (minuscules)
   - ✅ Le champ `password` commence par `$2a$10$` (hash bcrypt)
   - ✅ Le champ `role` est `CLIENT`
   - ✅ Les champs `nom` et `prenom` sont remplis

### 4. Tester le hash du mot de passe
Si vous connaissez le mot de passe utilisé lors de l'inscription, testez-le :

```bash
node -e "const bcrypt = require('bcryptjs'); const hash = 'HASH_DE_LA_BASE'; bcrypt.compare('votre-mot-de-passe', hash).then(result => console.log('Match:', result));"
```

## Solutions possibles

### Solution 1 : Vérifier que NEXTAUTH_SECRET est correct
Le secret doit être configuré dans `.env`. Vérifiez :
```env
NEXTAUTH_SECRET=GjFOtP4rj+4O5ebXTqTm/AhxGO9tqDE6rYBvfG9oSCA=
```

### Solution 2 : Redémarrer le serveur
Après avoir modifié `.env`, redémarrez toujours le serveur :
1. Arrêtez le serveur (Ctrl+C)
2. Relancez : `npm run dev`

### Solution 3 : Vérifier l'email
Assurez-vous d'utiliser exactement le même email (même casse) que lors de l'inscription. Le code normalise en lowercase, mais vérifiez quand même.

## Prochaines étapes

1. **Redémarrez le serveur** si vous venez de modifier `.env`
2. **Essayez de vous connecter**
3. **Regardez les logs** dans :
   - La console du serveur (terminal)
   - La console du navigateur (F12)
4. **Partagez les logs** si le problème persiste

Les logs vous diront exactement où ça bloque :
- Si l'utilisateur n'est pas trouvé
- Si le mot de passe est incorrect
- Si la session n'est pas créée
- Si le JWT n'est pas généré

