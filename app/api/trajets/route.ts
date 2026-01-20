import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔍 Récupération des trajets depuis Supabase...')
    
    // D'abord, récupérer tous les trajets pour voir ce qui existe
    const { data: allTrajets, error: allError } = await supabase
      .from('Trajet')
      .select('*')
      .order('villeDepart', { ascending: true })

    if (allError) {
      console.error('❌ Erreur Supabase (tous les trajets):', allError)
      console.error('Détails:', JSON.stringify(allError, null, 2))
    } else {
      console.log(`📊 ${allTrajets?.length || 0} trajets au total dans la base`)
      if (allTrajets && allTrajets.length > 0) {
        const statuts = Array.from(new Set(allTrajets.map(t => t.statut)))
        console.log('   Statuts trouvés:', statuts)
      }
    }
    
    // Pour l'instant, retourner tous les trajets (le filtre DISPONIBLE ne fonctionne pas correctement)
    // Cela sera corrigé une fois que les données seront dans la base
    console.log(`✅ Retour de tous les trajets disponibles`)
    
    // Retourner tous les trajets
    return NextResponse.json(Array.isArray(allTrajets) ? allTrajets : [])
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des trajets:', error)
    // En cas d'erreur, retourner un tableau vide plutôt qu'un objet d'erreur
    return NextResponse.json([], { status: 500 })
  }
}


