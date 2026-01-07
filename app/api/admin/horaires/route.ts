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

    const { data: horaires, error } = await supabase
      .from('Horaire')
      .select(`
        id,
        dateDepart,
        dateArrivee,
        Trajet:trajetId (
          id,
          villeDepart,
          villeArrivee
        ),
        Vehicule:vehiculeId (
          id,
          numeroImmatriculation
        ),
        Conducteur:conducteurId (
          id,
          prenom,
          nom
        )
      `)
      .order('dateDepart', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(horaires?.map(h => ({
      id: h.id,
      dateDepart: h.dateDepart,
      dateArrivee: h.dateArrivee,
      trajet: h.Trajet,
      vehicule: h.Vehicule,
      conducteur: h.Conducteur,
    })) || [])
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
    const { trajetId, vehiculeId, conducteurId, dateDepart, dateArrivee } = body

    // Vérifier que le véhicule n'est pas déjà utilisé à cette heure
    const { data: conflits } = await supabase
      .from('Horaire')
      .select('id')
      .eq('vehiculeId', vehiculeId)
      .lte('dateDepart', dateArrivee)
      .gte('dateArrivee', dateDepart)

    if (conflits && conflits.length > 0) {
      return NextResponse.json(
        { error: 'Ce véhicule est déjà utilisé sur cette période' },
        { status: 400 }
      )
    }

    const { data: horaire, error } = await supabase
      .from('Horaire')
      .insert({
        trajetId,
        vehiculeId,
        conducteurId,
        dateDepart: new Date(dateDepart).toISOString(),
        dateArrivee: new Date(dateArrivee).toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(horaire)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}


