import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testTrajets() {
  console.log('🔍 Test de la base de données...\n')

  // 1. Vérifier les trajets
  console.log('1️⃣ Vérification des trajets...')
  const { data: trajets, error: trajetsError } = await supabase
    .from('Trajet')
    .select('*')
    .order('villeDepart', { ascending: true })

  if (trajetsError) {
    console.error('❌ Erreur:', trajetsError)
  } else {
    console.log(`✅ ${trajets?.length || 0} trajets trouvés`)
    if (trajets && trajets.length > 0) {
      console.log('   Statuts:', trajets.map(t => t.statut).filter((v, i, a) => a.indexOf(v) === i))
      console.log('   Exemples:')
      trajets.slice(0, 5).forEach(t => {
        console.log(`   - ${t.villeDepart} → ${t.villeArrivee} (${t.statut})`)
      })
    }
  }

  // 2. Vérifier les trajets disponibles
  console.log('\n2️⃣ Trajets avec statut DISPONIBLE...')
  const { data: trajetsDispo, error: dispoError } = await supabase
    .from('Trajet')
    .select('*')
    .eq('statut', 'DISPONIBLE')

  if (dispoError) {
    console.error('❌ Erreur:', dispoError)
  } else {
    console.log(`✅ ${trajetsDispo?.length || 0} trajets disponibles`)
  }

  // 3. Vérifier les horaires
  console.log('\n3️⃣ Vérification des horaires...')
  const { data: horaires, error: horairesError } = await supabase
    .from('Horaire')
    .select('*, Trajet(*)')
    .order('dateDepart', { ascending: true })
    .limit(10)

  if (horairesError) {
    console.error('❌ Erreur:', horairesError)
  } else {
    console.log(`✅ ${horaires?.length || 0} horaires trouvés (affichage des 10 premiers)`)
    if (horaires && horaires.length > 0) {
      horaires.forEach(h => {
        const trajet = h.Trajet as any
        const date = new Date(h.dateDepart)
        console.log(`   - ${trajet?.villeDepart} → ${trajet?.villeArrivee} le ${date.toLocaleDateString('fr-FR')} à ${date.toLocaleTimeString('fr-FR')}`)
      })
    }
  }

  // 4. Vérifier les horaires futurs
  console.log('\n4️⃣ Horaires futurs (à partir d\'aujourd\'hui)...')
  const maintenant = new Date()
  const { data: horairesFuturs, error: futursError } = await supabase
    .from('Horaire')
    .select('*, Trajet(*)')
    .gte('dateDepart', maintenant.toISOString())
    .order('dateDepart', { ascending: true })
    .limit(10)

  if (futursError) {
    console.error('❌ Erreur:', futursError)
  } else {
    console.log(`✅ ${horairesFuturs?.length || 0} horaires futurs trouvés`)
    if (horairesFuturs && horairesFuturs.length > 0) {
      horairesFuturs.slice(0, 5).forEach(h => {
        const trajet = h.Trajet as any
        const date = new Date(h.dateDepart)
        console.log(`   - ${trajet?.villeDepart} → ${trajet?.villeArrivee} le ${date.toLocaleDateString('fr-FR')} à ${date.toLocaleTimeString('fr-FR')}`)
      })
    } else {
      console.warn('⚠️ Aucun horaire futur trouvé. Les horaires dans le script SQL peuvent être dans le passé.')
    }
  }

  // 5. Test de recherche
  console.log('\n5️⃣ Test de recherche Yaoundé → Douala...')
  const { data: recherche, error: rechercheError } = await supabase
    .from('Trajet')
    .select('*')
    .eq('statut', 'DISPONIBLE')
    .ilike('villeDepart', '%yaounde%')
    .ilike('villeArrivee', '%douala%')

  if (rechercheError) {
    console.error('❌ Erreur:', rechercheError)
  } else {
    console.log(`✅ ${recherche?.length || 0} trajets trouvés avec la recherche`)
    if (recherche && recherche.length > 0) {
      recherche.forEach(t => {
        console.log(`   - ${t.villeDepart} → ${t.villeArrivee}`)
      })
    }
  }

  console.log('\n✅ Test terminé!')
}

testTrajets().catch(console.error)

