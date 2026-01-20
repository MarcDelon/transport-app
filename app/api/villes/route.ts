import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Récupérer tous les trajets disponibles
    const { data: trajets, error } = await supabase
      .from('Trajet')
      .select('villeDepart, villeArrivee')
      .eq('statut', 'DISPONIBLE')

    if (error) {
      console.error('Erreur lors de la récupération des villes:', error)
      return NextResponse.json({ villesDepart: [], villesArrivee: [] })
    }

    // Extraire les villes uniques
    const villesDepartSet = new Set<string>()
    const villesArriveeSet = new Set<string>()

    trajets?.forEach(trajet => {
      villesDepartSet.add(trajet.villeDepart)
      villesArriveeSet.add(trajet.villeArrivee)
    })

    const villesDepart = Array.from(villesDepartSet).sort()
    const villesArrivee = Array.from(villesArriveeSet).sort()

    return NextResponse.json({ villesDepart, villesArrivee })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
