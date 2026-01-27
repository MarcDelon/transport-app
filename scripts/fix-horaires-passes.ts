import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes!')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixHorairesPasses() {
  console.log('🔧 Correction des horaires passés...\n')

  try {
    // Lire le script SQL
    const sqlPath = path.join(process.cwd(), 'sql', 'fix_horaires_passes.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8')

    // Extraire uniquement la requête UPDATE (ignorer les commentaires et SELECT)
    const updateQuery = `
      UPDATE "Horaire"
      SET 
          "dateDepart" = CASE 
              WHEN "dateDepart" < CURRENT_TIMESTAMP THEN
                  CURRENT_TIMESTAMP + INTERVAL '2 hours' + 
                  (EXTRACT(HOUR FROM "dateDepart") || ' hours')::INTERVAL +
                  (EXTRACT(MINUTE FROM "dateDepart") || ' minutes')::INTERVAL
              ELSE "dateDepart"
          END,
          "dateArrivee" = CASE 
              WHEN "dateDepart" < CURRENT_TIMESTAMP THEN
                  CURRENT_TIMESTAMP + INTERVAL '2 hours' + 
                  (EXTRACT(HOUR FROM "dateDepart") || ' hours')::INTERVAL +
                  (EXTRACT(MINUTE FROM "dateDepart") || ' minutes')::INTERVAL +
                  ("dateArrivee" - "dateDepart")
              ELSE "dateArrivee"
          END,
          "updatedAt" = CURRENT_TIMESTAMP
      WHERE "dateDepart" < CURRENT_TIMESTAMP
    `

    // Exécuter la mise à jour
    const { error: updateError } = await supabase.rpc('exec_sql', { 
      sql: updateQuery 
    }).single()

    if (updateError) {
      console.error('❌ Erreur lors de la mise à jour:', updateError)
      
      // Méthode alternative : mise à jour via l'API Supabase
      console.log('\n🔄 Tentative de mise à jour via l\'API Supabase...\n')
      
      // Récupérer tous les horaires passés
      const { data: horairesPasses, error: fetchError } = await supabase
        .from('Horaire')
        .select('*')
        .lt('dateDepart', new Date().toISOString())

      if (fetchError) {
        console.error('❌ Erreur lors de la récupération des horaires:', fetchError)
        return
      }

      if (!horairesPasses || horairesPasses.length === 0) {
        console.log('✅ Aucun horaire passé à corriger')
        return
      }

      console.log(`📋 ${horairesPasses.length} horaire(s) à mettre à jour\n`)

      // Mettre à jour chaque horaire
      for (const horaire of horairesPasses) {
        const oldDepart = new Date(horaire.dateDepart)
        const oldArrivee = new Date(horaire.dateArrivee)
        const duree = oldArrivee.getTime() - oldDepart.getTime()

        // Nouvelle date : maintenant + 2 heures + heure du jour original
        const now = new Date()
        const newDepart = new Date(now.getTime() + 2 * 60 * 60 * 1000)
        newDepart.setHours(oldDepart.getHours())
        newDepart.setMinutes(oldDepart.getMinutes())
        newDepart.setSeconds(0)
        newDepart.setMilliseconds(0)

        const newArrivee = new Date(newDepart.getTime() + duree)

        const { error: updateHoraireError } = await supabase
          .from('Horaire')
          .update({
            dateDepart: newDepart.toISOString(),
            dateArrivee: newArrivee.toISOString(),
            updatedAt: new Date().toISOString()
          })
          .eq('id', horaire.id)

        if (updateHoraireError) {
          console.error(`❌ Erreur pour ${horaire.id}:`, updateHoraireError)
        } else {
          console.log(`✅ ${horaire.id}: ${oldDepart.toLocaleString()} → ${newDepart.toLocaleString()}`)
        }
      }
    } else {
      console.log('✅ Mise à jour effectuée avec succès via RPC')
    }

    // Vérifier les horaires mis à jour
    console.log('\n📊 Vérification des horaires...\n')
    const { data: horaires, error: verifyError } = await supabase
      .from('Horaire')
      .select('id, dateDepart, dateArrivee')
      .order('dateDepart', { ascending: true })
      .limit(20)

    if (verifyError) {
      console.error('❌ Erreur lors de la vérification:', verifyError)
      return
    }

    const now = new Date()
    horaires?.forEach((h: any) => {
      const depart = new Date(h.dateDepart)
      const estFutur = depart > now
      const heuresAvant = (depart.getTime() - now.getTime()) / (1000 * 60 * 60)
      
      console.log(
        `${estFutur ? '✅' : '❌'} ${h.id}: ${depart.toLocaleString()} ` +
        `(${heuresAvant > 0 ? '+' : ''}${heuresAvant.toFixed(1)}h)`
      )
    })

    console.log('\n✅ Correction terminée!')

  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

fixHorairesPasses()
