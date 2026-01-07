import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const { data: trajets, error } = await supabase
      .from('Trajet')
      .select('*')
      .order('villeDepart', { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json(trajets || [])
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { villeDepart, villeArrivee, distance, dureeEstimee, tarifBase, statut } = body

    const { data: trajet, error } = await supabase
      .from('Trajet')
      .insert({
        villeDepart,
        villeArrivee,
        distance: parseFloat(distance),
        dureeEstimee: parseInt(dureeEstimee),
        tarifBase: parseFloat(tarifBase),
        statut: statut || 'DISPONIBLE',
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(trajet)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}


