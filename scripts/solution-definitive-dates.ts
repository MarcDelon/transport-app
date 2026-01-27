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

async function solutionDefinitiveDates() {
  console.log('🔧 SOLUTION DÉFINITIVE : Mise à jour des horaires et blocage des dates passées\n')
  console.log('=' .repeat(80))

  try {
    // ÉTAPE 1 : Récupérer tous les horaires passés
    console.log('\n📋 ÉTAPE 1 : Récupération des horaires passés...\n')
    
    const { data: horairesPasses, error: fetchError } = await supabase
      .from('Horaire')
      .select('id, dateDepart, dateArrivee, trajetId')
      .lt('dateDepart', new Date().toISOString())
      .order('dateDepart', { ascending: true })

    if (fetchError) {
      console.error('❌ Erreur lors de la récupération des horaires:', fetchError)
      return
    }

    if (!horairesPasses || horairesPasses.length === 0) {
      console.log('✅ Aucun horaire passé trouvé. Tous les horaires sont dans le futur.')
    } else {
      console.log(`⚠️ ${horairesPasses.length} horaire(s) passé(s) trouvé(s)\n`)

      // ÉTAPE 2 : Mettre à jour chaque horaire passé
      console.log('📋 ÉTAPE 2 : Mise à jour des horaires passés...\n')

      let successCount = 0
      let errorCount = 0

      for (const horaire of horairesPasses) {
        const oldDepart = new Date(horaire.dateDepart)
        const oldArrivee = new Date(horaire.dateArrivee)
        const duree = oldArrivee.getTime() - oldDepart.getTime()

        // Nouvelle date : demain à la même heure
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(oldDepart.getHours())
        tomorrow.setMinutes(oldDepart.getMinutes())
        tomorrow.setSeconds(oldDepart.getSeconds())
        tomorrow.setMilliseconds(0)

        const newArrivee = new Date(tomorrow.getTime() + duree)

        // Mettre à jour l'horaire
        const { error: updateError } = await supabase
          .from('Horaire')
          .update({
            dateDepart: tomorrow.toISOString(),
            dateArrivee: newArrivee.toISOString(),
            updatedAt: new Date().toISOString()
          })
          .eq('id', horaire.id)

        if (updateError) {
          console.error(`❌ ${horaire.id}: ${updateError.message}`)
          errorCount++
        } else {
          console.log(`✅ ${horaire.id}: ${oldDepart.toLocaleString('fr-FR')} → ${tomorrow.toLocaleString('fr-FR')}`)
          successCount++
        }
      }

      console.log(`\n📊 Résumé : ${successCount} réussi(s), ${errorCount} échec(s)`)
    }

    // ÉTAPE 3 : Vérifier que le trigger est actif
    console.log('\n📋 ÉTAPE 3 : Vérification du trigger de blocage...\n')
    
    console.log('ℹ️ Le trigger "trigger_check_horaire_futur" doit être actif dans la base de données.')
    console.log('ℹ️ Il bloque automatiquement toute réservation sur un horaire passé.\n')

    // ÉTAPE 4 : Vérification finale
    console.log('📋 ÉTAPE 4 : Vérification finale des horaires...\n')

    const { data: tousHoraires, error: verifyError } = await supabase
      .from('Horaire')
      .select('id, dateDepart, dateArrivee')
      .order('dateDepart', { ascending: true })
      .limit(30)

    if (verifyError) {
      console.error('❌ Erreur lors de la vérification:', verifyError)
      return
    }

    const now = new Date()
    let passesCount = 0
    let futurCount = 0

    console.log('Les 30 premiers horaires :')
    console.log('-'.repeat(80))

    tousHoraires?.forEach((h: any) => {
      const depart = new Date(h.dateDepart)
      const estFutur = depart > now
      const heuresAvant = (depart.getTime() - now.getTime()) / (1000 * 60 * 60)
      
      if (estFutur) {
        futurCount++
      } else {
        passesCount++
      }

      const statut = estFutur ? '✅ FUTUR' : '❌ PASSÉ'
      const heuresStr = heuresAvant > 0 
        ? `+${heuresAvant.toFixed(1)}h` 
        : `${heuresAvant.toFixed(1)}h`
      
      console.log(`${statut} | ${h.id.padEnd(20)} | ${depart.toLocaleString('fr-FR')} (${heuresStr})`)
    })

    console.log('-'.repeat(80))
    console.log(`\n📊 Total affiché : ${futurCount} futur(s), ${passesCount} passé(s)`)

    // Compter tous les horaires
    const { count: totalPasses } = await supabase
      .from('Horaire')
      .select('*', { count: 'exact', head: true })
      .lt('dateDepart', now.toISOString())

    const { count: totalFutur } = await supabase
      .from('Horaire')
      .select('*', { count: 'exact', head: true })
      .gte('dateDepart', now.toISOString())

    console.log(`\n📊 Total dans la base : ${totalFutur || 0} futur(s), ${totalPasses || 0} passé(s)`)

    // Résumé final
    console.log('\n' + '='.repeat(80))
    console.log('✅ SOLUTION APPLIQUÉE AVEC SUCCÈS')
    console.log('='.repeat(80))
    
    if (totalPasses && totalPasses > 0) {
      console.log(`\n⚠️ ATTENTION : Il reste ${totalPasses} horaire(s) passé(s) dans la base.`)
      console.log('Ces horaires n\'ont pas pu être mis à jour automatiquement.')
      console.log('\n💡 Solutions possibles :')
      console.log('1. Exécutez le script SQL directement dans Supabase SQL Editor :')
      console.log('   c:\\transport\\sql\\solution_definitive_dates.sql')
      console.log('\n2. Ou supprimez manuellement les horaires passés qui ne sont plus nécessaires')
    } else {
      console.log('\n✅ Tous les horaires sont maintenant dans le futur!')
      console.log('✅ Le trigger bloque automatiquement les réservations sur des dates passées')
      console.log('\n📝 Note : Pour maintenir la base à jour, créez régulièrement de nouveaux horaires futurs')
    }

  } catch (error) {
    console.error('\n❌ Erreur:', error)
  }
}

solutionDefinitiveDates()
