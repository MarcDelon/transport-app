import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const statut = searchParams.get('statut')

    let query = supabase
      .from('Reservation')
      .select(`
        *,
        user:User!userId (
          nom,
          prenom,
          email
        ),
        horaire:Horaire!horaireId (
          dateDepart,
          dateArrivee,
          trajet:Trajet!trajetId (
            villeDepart,
            villeArrivee
          )
        )
      `)
      .order('createdAt', { ascending: false })

    if (statut) {
      query = query.eq('statut', statut)
    }

    const { data: reservations, error } = await query

    if (error) {
      console.error('Erreur Supabase:', error)
      throw error
    }

    console.log('Réservations récupérées:', reservations?.length || 0)
    if (reservations && reservations.length > 0) {
      console.log('Exemple de réservation:', JSON.stringify(reservations[0], null, 2))
    }

    return NextResponse.json(reservations || [])
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}



