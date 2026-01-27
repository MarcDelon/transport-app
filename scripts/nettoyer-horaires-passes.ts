import { createClient } from '@supabase/supabase-js'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function nettoyerHorairesPasses() {
  console.log('🧹 Nettoyage des horaires passés\n')
  console.log('=' .repeat(80))

  try {
    const now = new Date()

    // Étape 1: Vérifier les horaires passés
    console.log('\n📋 ÉTAPE 1 : Vérification des horaires passés...\n')
    
    const { data: horairesPasses, error: fetchError } = await supabase
      .from('Horaire')
      .select('id, dateDepart, dateArrivee')
      .lt('dateDepart', now.toISOString())

    if (fetchError) {
      console.error('❌ Erreur:', fetchError)
      return
    }

    if (!horairesPasses || horairesPasses.length === 0) {
      console.log('✅ Aucun horaire passé trouvé!')
      return
    }

    console.log(`⚠️ ${horairesPasses.length} horaire(s) passé(s) trouvé(s)`)

    // Étape 2: Vérifier les réservations associées
    console.log('\n📋 ÉTAPE 2 : Vérification des réservations...\n')

    const horairesIds = horairesPasses.map(h => h.id)
    const { data: reservations } = await supabase
      .from('Reservation')
      .select('id, horaireId, statut')
      .in('horaireId', horairesIds)

    const horairesAvecReservations = new Set(reservations?.map(r => r.horaireId) || [])
    const horairesSansReservations = horairesPasses.filter(h => !horairesAvecReservations.has(h.id))

    console.log(`📊 Horaires avec réservations : ${horairesAvecReservations.size}`)
    console.log(`📊 Horaires sans réservations : ${horairesSansReservations.length}`)

    // Étape 3: Supprimer les horaires passés sans réservations
    if (horairesSansReservations.length > 0) {
      console.log('\n📋 ÉTAPE 3 : Suppression des horaires passés sans réservations...\n')

      let deleteCount = 0
      let errorCount = 0

      for (const horaire of horairesSansReservations) {
        const { error: deleteError } = await supabase
          .from('Horaire')
          .delete()
          .eq('id', horaire.id)

        if (deleteError) {
          console.log(`❌ ${horaire.id}: ${deleteError.message}`)
          errorCount++
        } else {
          console.log(`✅ ${horaire.id} supprimé`)
          deleteCount++
        }
      }

      console.log(`\n📊 ${deleteCount} horaire(s) supprimé(s), ${errorCount} erreur(s)`)
    }

    // Étape 4: Mettre à jour les horaires avec réservations
    if (horairesAvecReservations.size > 0) {
      console.log('\n📋 ÉTAPE 4 : Mise à jour des horaires avec réservations...\n')

      const horairesAMettreAJour = horairesPasses.filter(h => horairesAvecReservations.has(h.id))
      
      let updateCount = 0
      let errorCount = 0

      for (const horaire of horairesAMettreAJour) {
        const oldDepart = new Date(horaire.dateDepart)
        const oldArrivee = new Date(horaire.dateArrivee)
        const duree = oldArrivee.getTime() - oldDepart.getTime()

        // Nouvelle date : demain à la même heure
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(oldDepart.getHours(), oldDepart.getMinutes(), 0, 0)
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
          console.log(`❌ ${horaire.id}: ${updateError.message}`)
          errorCount++
        } else {
          console.log(`✅ ${horaire.id}: ${oldDepart.toLocaleString('fr-FR')} → ${tomorrow.toLocaleString('fr-FR')}`)
          updateCount++
        }
      }

      console.log(`\n📊 ${updateCount} horaire(s) mis à jour, ${errorCount} erreur(s)`)
    }

    // Vérification finale
    console.log('\n📋 ÉTAPE 5 : Vérification finale...\n')

    const { count: restePasses } = await supabase
      .from('Horaire')
      .select('*', { count: 'exact', head: true })
      .lt('dateDepart', new Date().toISOString())

    const { count: totalFutur } = await supabase
      .from('Horaire')
      .select('*', { count: 'exact', head: true })
      .gte('dateDepart', new Date().toISOString())

    console.log('=' .repeat(80))
    console.log('📊 RÉSULTAT FINAL')
    console.log('=' .repeat(80))
    console.log(`✅ Horaires futurs : ${totalFutur || 0}`)
    console.log(`${restePasses === 0 ? '✅' : '⚠️'} Horaires passés : ${restePasses || 0}`)

    if (restePasses === 0) {
      console.log('\n🎉 SUCCÈS COMPLET : Tous les horaires sont maintenant dans le futur!')
      console.log('✅ Le trigger bloque automatiquement les réservations de dates passées')
    } else {
      console.log(`\n⚠️ Il reste ${restePasses} horaire(s) passé(s) avec des conflits`)
      console.log('💡 Ces horaires ont probablement des réservations actives')
      console.log('   Vous pouvez les gérer manuellement dans Supabase')
    }

  } catch (error) {
    console.error('\n❌ Erreur:', error)
  }
}

nettoyerHorairesPasses()
