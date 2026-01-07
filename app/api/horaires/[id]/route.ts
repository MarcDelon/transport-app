import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: horaire, error: horaireError } = await supabase
      .from('Horaire')
      .select(`
        *,
        Trajet (*)
      `)
      .eq('id', params.id)
      .single()

    if (horaireError || !horaire) {
      return NextResponse.json(
        { error: 'Horaire non trouvé' },
        { status: 404 }
      )
    }

    const { data: vehicule } = await supabase
      .from('Vehicule')
      .select('capaciteMaximale')
      .eq('id', horaire.vehiculeId)
      .single()

    const { data: reservations } = await supabase
      .from('Reservation')
      .select('nombrePlaces')
      .eq('horaireId', params.id)
      .in('statut', ['CONFIRMEE', 'EN_ATTENTE'])

    const placesReservees = reservations?.reduce(
      (sum, r) => sum + r.nombrePlaces,
      0
    ) || 0

    const placesDisponibles = (vehicule?.capaciteMaximale || 0) - placesReservees

    return NextResponse.json({
      id: horaire.id,
      dateDepart: horaire.dateDepart,
      dateArrivee: horaire.dateArrivee,
      trajet: horaire.Trajet,
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



