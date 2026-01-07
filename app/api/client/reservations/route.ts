import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const { data: reservations, error } = await supabase
      .from('Reservation')
      .select(`
        id,
        nombrePlaces,
        statut,
        createdAt,
        updatedAt,
        horaireId,
        userId,
        Horaire:Horaire (
          id,
          dateDepart,
          dateArrivee,
          trajetId,
          Trajet:Trajet (
            id,
            villeDepart,
            villeArrivee,
            distance,
            dureeEstimee,
            tarifBase
          )
        )
      `)
      .eq('userId', session.user.id)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Erreur Supabase:', error)
      console.error('Détails:', JSON.stringify(error, null, 2))
      // Retourner un tableau vide en cas d'erreur plutôt qu'une erreur
      return NextResponse.json([])
    }

    // Transformer les données pour correspondre à l'interface attendue
    const formattedReservations = Array.isArray(reservations) 
      ? reservations.map((r: any) => ({
          id: r.id,
          nombrePlaces: r.nombrePlaces,
          statut: r.statut,
          createdAt: r.createdAt,
          horaire: {
            dateDepart: r.Horaire?.dateDepart || r.horaireId,
            trajet: r.Horaire?.Trajet || {
              villeDepart: 'N/A',
              villeArrivee: 'N/A'
            }
          }
        }))
      : []

    return NextResponse.json(formattedReservations)
  } catch (error: any) {
    console.error('Erreur lors du chargement des réservations:', error)
    // Toujours retourner un tableau, même en cas d'erreur
    return NextResponse.json([])
  }
}



