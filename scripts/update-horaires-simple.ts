import { createClient } from '@supabase/supabase-js'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateHorairesSimple() {
  console.log('🔧 Mise à jour des horaires passés vers le futur\n')
  console.log('=' .repeat(80))

  try {
    // Récupérer tous les horaires passés
    console.log('\n📋 Récupération des horaires passés...\n')
    
    const now = new Date()
    const { data: horairesPasses, error: fetchError } = await supabase
      .from('Horaire')
      .select('id, dateDepart, dateArrivee, trajetId')
      .lt('dateDepart', now.toISOString())
      .order('dateDepart', { ascending: true })

    if (fetchError) {
      console.error('❌ Erreur:', fetchError)
      return
    }

    if (!horairesPasses || horairesPasses.length === 0) {
      console.log('✅ Aucun horaire passé. Tous les horaires sont dans le futur!')
      
      // Afficher les prochains horaires
      const { data: prochains } = await supabase
        .from('Horaire')
        .select('id, dateDepart')
        .gte('dateDepart', now.toISOString())
        .order('dateDepart', { ascending: true })
        .limit(10)

      if (prochains && prochains.length > 0) {
        console.log('\n📅 Prochains horaires disponibles :')
        prochains.forEach((h: any) => {
          const depart = new Date(h.dateDepart)
          const heures = (depart.getTime() - now.getTime()) / (1000 * 60 * 60)
          console.log(`  ✅ ${h.id}: ${depart.toLocaleString('fr-FR')} (+${heures.toFixed(1)}h)`)
        })
      }
      
      return
    }

    console.log(`⚠️ ${horairesPasses.length} horaire(s) passé(s) trouvé(s)\n`)

    // Mettre à jour chaque horaire
    let successCount = 0
    let errorCount = 0
    const errors: any[] = []

    for (const horaire of horairesPasses) {
      const oldDepart = new Date(horaire.dateDepart)
      const oldArrivee = new Date(horaire.dateArrivee)
      const duree = oldArrivee.getTime() - oldDepart.getTime()

      // Nouvelle date : demain à la même heure
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(oldDepart.getHours(), oldDepart.getMinutes(), oldDepart.getSeconds(), 0)

      const newArrivee = new Date(tomorrow.getTime() + duree)

      const { error: updateError } = await supabase
        .from('Horaire')
        .update({
          dateDepart: tomorrow.toISOString(),
          dateArrivee: newArrivee.toISOString(),
          updatedAt: new Date().toISOString()
        })
        .eq('id', horaire.id)

      if (updateError) {
        errorCount++
        errors.push({ id: horaire.id, error: updateError.message })
        console.log(`❌ ${horaire.id}: ${updateError.message}`)
      } else {
        successCount++
        console.log(`✅ ${horaire.id}: ${oldDepart.toLocaleString('fr-FR')} → ${tomorrow.toLocaleString('fr-FR')}`)
      }
    }

    console.log('\n' + '='.repeat(80))
    console.log(`📊 Résumé : ${successCount} réussi(s), ${errorCount} échec(s)`)
    console.log('='.repeat(80))

    if (errorCount > 0) {
      console.log('\n⚠️ Erreurs rencontrées :')
      errors.forEach(e => {
        console.log(`  - ${e.id}: ${e.error}`)
      })
      console.log('\n💡 Ces erreurs sont probablement dues à des conflits de véhicules/conducteurs.')
      console.log('   Les horaires concernés peuvent être supprimés ou mis à jour manuellement.')
    }

    // Vérification finale
    console.log('\n📋 Vérification finale...\n')

    const { count: totalPasses } = await supabase
      .from('Horaire')
      .select('*', { count: 'exact', head: true })
      .lt('dateDepart', new Date().toISOString())

    const { count: totalFutur } = await supabase
      .from('Horaire')
      .select('*', { count: 'exact', head: true })
      .gte('dateDepart', new Date().toISOString())

    console.log(`📊 État de la base :`)
    console.log(`   - Horaires futurs : ${totalFutur || 0}`)
    console.log(`   - Horaires passés : ${totalPasses || 0}`)

    if (totalPasses === 0) {
      console.log('\n✅ SUCCÈS : Tous les horaires sont maintenant dans le futur!')
      console.log('✅ Le trigger existant bloque automatiquement les réservations de dates passées')
      console.log('\n📝 Note : Créez régulièrement de nouveaux horaires futurs pour vos clients')
    } else {
      console.log(`\n⚠️ Il reste ${totalPasses} horaire(s) passé(s) qui n'ont pas pu être mis à jour`)
      console.log('💡 Vous pouvez :')
      console.log('   1. Réexécuter ce script : npm run update-horaires')
      console.log('   2. Supprimer manuellement ces horaires dans Supabase')
      console.log('   3. Les mettre à jour individuellement')
    }

  } catch (error) {
    console.error('\n❌ Erreur:', error)
  }
}

updateHorairesSimple()
