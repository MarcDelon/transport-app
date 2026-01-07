import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Vérifier que le véhicule n'est pas déjà utilisé à cette heure (sauf pour cet horaire)
    const { data: conflits } = await supabase
      .from('Horaire')
      .select('id')
      .eq('vehiculeId', vehiculeId)
      .neq('id', params.id)
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
      .update({
        trajetId,
        vehiculeId,
        conducteurId,
        dateDepart: new Date(dateDepart).toISOString(),
        dateArrivee: new Date(dateArrivee).toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .eq('id', params.id)
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('Horaire')
      .delete()
      .eq('id', params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ message: 'Horaire supprimé' })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}


