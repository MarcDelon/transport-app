import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { horaireId, nombrePlaces } = body

    // Vérifier l'horaire
    const { data: horaire, error: horaireError } = await supabase
      .from('Horaire')
      .select(`
        *,
        Trajet (*),
        Vehicule (*)
      `)
      .eq('id', horaireId)
      .single()

    if (horaireError || !horaire) {
      return NextResponse.json(
        { error: 'Horaire non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer les réservations actives
    const { data: reservations } = await supabase
      .from('Reservation')
      .select('nombrePlaces')
      .eq('horaireId', horaireId)
      .in('statut', ['CONFIRMEE', 'EN_ATTENTE'])

    const placesReservees = reservations?.reduce(
      (sum, r) => sum + r.nombrePlaces,
      0
    ) || 0

    const placesDisponibles = (horaire.Vehicule as any).capaciteMaximale - placesReservees

    if (nombrePlaces > placesDisponibles) {
      return NextResponse.json(
        { error: 'Pas assez de places disponibles' },
        { status: 400 }
      )
    }

    // Générer un ID unique pour la réservation
    const reservationId = `reserv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Créer la réservation
    const { data: reservation, error: reservationError } = await supabase
      .from('Reservation')
      .insert({
        id: reservationId,
        userId: session.user.id,
        horaireId,
        nombrePlaces,
        statut: 'EN_ATTENTE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (reservationError) {
      console.error('❌ Erreur lors de la création de la réservation:', reservationError)
      throw reservationError
    }

    console.log('✅ Réservation créée avec succès:', reservationId)

    return NextResponse.json({
      message: 'Réservation créée avec succès',
      reservationId: reservation.id,
    })
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}



