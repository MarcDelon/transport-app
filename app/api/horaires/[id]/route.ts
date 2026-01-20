import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Recherche horaire:', params.id)

    const { data: horaire, error: horaireError } = await supabase
      .from('Horaire')
      .select(`
        *,
        trajet:Trajet!trajetId (
          id,
          villeDepart,
          villeArrivee,
          distance,
          dureeEstimee,
          tarifBase
        ),
        vehicule:Vehicule!vehiculeId (
          capaciteMaximale
        )
      `)
      .eq('id', params.id)
      .single()

    if (horaireError) {
      console.error('❌ Erreur Supabase:', horaireError)
      return NextResponse.json(
        { error: 'Horaire non trouvé' },
        { status: 404 }
      )
    }

    if (!horaire) {
      console.log('❌ Horaire non trouvé')
      return NextResponse.json(
        { error: 'Horaire non trouvé' },
        { status: 404 }
      )
    }

    console.log('✅ Horaire trouvé:', horaire.id)

    const { data: reservations } = await supabase
      .from('Reservation')
      .select('nombrePlaces')
      .eq('horaireId', params.id)
      .in('statut', ['CONFIRMEE', 'EN_ATTENTE'])

    const placesReservees = reservations?.reduce(
      (sum, r) => sum + r.nombrePlaces,
      0
    ) || 0

    const capaciteMaximale = (horaire.vehicule as any)?.capaciteMaximale || 0
    const placesDisponibles = capaciteMaximale - placesReservees

    console.log('📊 Places:', { capaciteMaximale, placesReservees, placesDisponibles })

    return NextResponse.json({
      id: horaire.id,
      dateDepart: horaire.dateDepart,
      dateArrivee: horaire.dateArrivee,
      trajet: horaire.trajet,
      placesDisponibles: Math.max(0, placesDisponibles),
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}



