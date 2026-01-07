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
        const statuts = [...new Set(allTrajets.map(t => t.statut))]
        console.log('   Statuts trouvés:', statuts)
      }
    }
    
    // Ensuite, filtrer par statut DISPONIBLE
    const { data: trajets, error } = await supabase
      .from('Trajet')
      .select('*')
      .eq('statut', 'DISPONIBLE')
      .order('villeDepart', { ascending: true })

    if (error) {
      console.error('❌ Erreur Supabase:', error)
      console.error('Détails:', JSON.stringify(error, null, 2))
      return NextResponse.json([], { status: 500 })
    }

    console.log(`✅ ${trajets?.length || 0} trajets avec statut DISPONIBLE trouvés`)
    if (trajets && trajets.length > 0) {
      console.log('Exemples de trajets:', trajets.slice(0, 3).map(t => `${t.villeDepart} → ${t.villeArrivee} (${t.statut})`))
    } else if (allTrajets && allTrajets.length > 0) {
      console.warn('⚠️ Aucun trajet avec statut DISPONIBLE. Les trajets ont peut-être un autre statut.')
    }

    // Toujours retourner un tableau, même s'il est vide
    return NextResponse.json(Array.isArray(trajets) ? trajets : [])
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des trajets:', error)
    // En cas d'erreur, retourner un tableau vide plutôt qu'un objet d'erreur
    return NextResponse.json([], { status: 500 })
  }
}


