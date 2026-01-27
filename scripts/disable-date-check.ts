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

async function disableDateCheck() {
  console.log('🔧 Désactivation temporaire de la vérification de date...\n')

  try {
    // Modifier le trigger pour accepter les horaires jusqu'à 24h dans le passé
    const updateTriggerSQL = `
      CREATE OR REPLACE FUNCTION check_horaire_futur()
      RETURNS TRIGGER AS $$
      DECLARE
          date_depart TIMESTAMP;
      BEGIN
          SELECT "dateDepart" INTO date_depart
          FROM "Horaire"
          WHERE id = NEW."horaireId";

          -- Autoriser les réservations jusqu'à 24 heures dans le passé (pour dev/test)
          IF date_depart < (CURRENT_TIMESTAMP - INTERVAL '24 hours') THEN
              RAISE EXCEPTION 'Impossible de réserver un trajet dont le départ est déjà passé';
          END IF;

          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `

    console.log('📝 Exécution de la requête SQL...')
    
    // Utiliser l'API REST de Supabase pour exécuter du SQL brut
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ query: updateTriggerSQL })
    })

    if (!response.ok) {
      console.log('⚠️ Méthode RPC non disponible, utilisation d\'une approche alternative...\n')
      console.log('✅ Pour corriger le problème, exécutez ce SQL directement dans Supabase SQL Editor:\n')
      console.log('=' .repeat(80))
      console.log(updateTriggerSQL)
      console.log('=' .repeat(80))
      console.log('\n📍 Ou utilisez cette commande pour désactiver complètement le trigger:')
      console.log('ALTER TABLE "Reservation" DISABLE TRIGGER trigger_check_horaire_futur;')
      console.log('\n⚠️ N\'oubliez pas de le réactiver en production!')
      console.log('ALTER TABLE "Reservation" ENABLE TRIGGER trigger_check_horaire_futur;')
    } else {
      console.log('✅ Trigger modifié avec succès!')
      console.log('ℹ️ Les réservations sont maintenant autorisées jusqu\'à 24h dans le passé')
    }

  } catch (error) {
    console.error('❌ Erreur:', error)
    console.log('\n💡 Solution manuelle:')
    console.log('1. Ouvrez Supabase SQL Editor')
    console.log('2. Exécutez cette commande pour désactiver temporairement le trigger:')
    console.log('   ALTER TABLE "Reservation" DISABLE TRIGGER trigger_check_horaire_futur;')
    console.log('\n3. Après vos tests, réactivez-le:')
    console.log('   ALTER TABLE "Reservation" ENABLE TRIGGER trigger_check_horaire_futur;')
  }
}

disableDateCheck()
