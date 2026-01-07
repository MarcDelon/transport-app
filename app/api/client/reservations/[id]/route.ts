import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const { data: reservation, error } = await supabase
      .from('Reservation')
      .select(`
        *,
        Horaire (
          *,
          Trajet (*)
        )
      `)
      .eq('id', params.id)
      .single()

    if (error || !reservation) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      )
    }

    if (reservation.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      id: reservation.id,
      horaire: {
        dateDepart: reservation.Horaire?.dateDepart,
        dateArrivee: reservation.Horaire?.dateArrivee,
        trajet: reservation.Horaire?.Trajet,
      },
      nombrePlaces: reservation.nombrePlaces,
      statut: reservation.statut,
      createdAt: reservation.createdAt,
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}



