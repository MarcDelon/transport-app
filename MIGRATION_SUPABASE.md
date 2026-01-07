# Migration de Prisma vers Supabase

## ✅ Fichiers déjà migrés

- `lib/supabase.ts` - Client Supabase créé
- `lib/auth.ts` - Authentification migrée
- `app/api/auth/register/route.ts` - Inscription migrée
- `app/api/trajets/route.ts` - Liste des trajets migrée
- `app/api/trajets/search/route.ts` - Recherche migrée
- `app/api/reservations/route.ts` - Création réservation migrée
- `app/api/client/reservations/route.ts` - Réservations client migrées
- `app/api/horaires/[id]/route.ts` - Détails horaire migré

## ⚠️ Fichiers à migrer

### Routes Admin
- `app/api/admin/stats/route.ts`
- `app/api/admin/reservations/route.ts`
- `app/api/admin/reservations/[id]/route.ts`
- `app/api/admin/trajets/route.ts`
- `app/api/admin/trajets/[id]/route.ts`
- `app/api/admin/vehicules/route.ts`
- `app/api/admin/vehicules/[id]/route.ts`
- `app/api/admin/conducteurs/route.ts`
- `app/api/admin/conducteurs/[id]/route.ts`
- `app/api/admin/clients/route.ts`
- `app/api/admin/horaires/route.ts`
- `app/api/admin/horaires/[id]/route.ts`
- `app/api/admin/paiements/route.ts`
- `app/api/admin/abonnements/route.ts`

### Routes Client
- `app/api/client/reservations/[id]/route.ts`

## Guide de migration

### Remplacer les imports
```typescript
// Avant
import { prisma } from '@/lib/prisma'

// Après
import { supabase } from '@/lib/supabase'
```

### Exemples de conversion

#### 1. findUnique → select().eq().single()
```typescript
// Prisma
const user = await prisma.user.findUnique({
  where: { email: 'test@example.com' }
})

// Supabase
const { data: user } = await supabase
  .from('User')
  .select('*')
  .eq('email', 'test@example.com')
  .single()
```

#### 2. findMany → select()
```typescript
// Prisma
const trajets = await prisma.trajet.findMany({
  where: { statut: 'DISPONIBLE' },
  orderBy: { villeDepart: 'asc' }
})

// Supabase
const { data: trajets } = await supabase
  .from('Trajet')
  .select('*')
  .eq('statut', 'DISPONIBLE')
  .order('villeDepart', { ascending: true })
```

#### 3. create → insert()
```typescript
// Prisma
const user = await prisma.user.create({
  data: {
    email: 'test@example.com',
    password: 'hash',
    nom: 'Doe',
    prenom: 'John',
    role: 'CLIENT'
  }
})

// Supabase
const { data: user, error } = await supabase
  .from('User')
  .insert({
    email: 'test@example.com',
    password: 'hash',
    nom: 'Doe',
    prenom: 'John',
    role: 'CLIENT',
    updatedAt: new Date().toISOString()
  })
  .select()
  .single()
```

#### 4. include (relations) → select avec relations
```typescript
// Prisma
const reservation = await prisma.reservation.findUnique({
  where: { id: '123' },
  include: {
    horaire: {
      include: {
        trajet: true
      }
    }
  }
})

// Supabase
const { data: reservation } = await supabase
  .from('Reservation')
  .select(`
    *,
    Horaire (
      *,
      Trajet (*)
    )
  `)
  .eq('id', '123')
  .single()
```

#### 5. update → update()
```typescript
// Prisma
await prisma.user.update({
  where: { id: '123' },
  data: { nom: 'New Name' }
})

// Supabase
await supabase
  .from('User')
  .update({ nom: 'New Name', updatedAt: new Date().toISOString() })
  .eq('id', '123')
```

#### 6. delete → delete()
```typescript
// Prisma
await prisma.user.delete({
  where: { id: '123' }
})

// Supabase
await supabase
  .from('User')
  .delete()
  .eq('id', '123')
```

## Notes importantes

1. **Gestion des erreurs** : Supabase retourne `{ data, error }`, toujours vérifier `error`
2. **Dates** : Utiliser `new Date().toISOString()` pour les champs `updatedAt`
3. **Relations** : Utiliser la syntaxe `select()` avec les relations imbriquées
4. **Noms de tables** : Utiliser les noms exacts de vos tables (avec majuscules si nécessaire)

