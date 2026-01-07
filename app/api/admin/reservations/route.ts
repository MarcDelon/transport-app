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
        User:userId (
          nom,
          prenom,
          email
        ),
        Horaire (
          *,
          Trajet (*)
        )
      `)
      .order('createdAt', { ascending: false })

    if (statut) {
      query = query.eq('statut', statut)
    }

    const { data: reservations, error } = await query

    if (error) {
      throw error
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



