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
    const { nom, prenom, numeroPermis, experience } = body

    // Vérifier si le permis existe déjà (sauf pour ce conducteur)
    if (numeroPermis) {
      const { data: existing } = await supabase
        .from('Conducteur')
        .select('id')
        .eq('numeroPermis', numeroPermis)
        .neq('id', params.id)
        .single()

      if (existing) {
        return NextResponse.json(
          { error: 'Ce numéro de permis existe déjà' },
          { status: 400 }
        )
      }
    }

    const { data: conducteur, error } = await supabase
      .from('Conducteur')
      .update({
        nom,
        prenom,
        numeroPermis,
        experience: parseInt(experience),
        updatedAt: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(conducteur)
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
      .from('Conducteur')
      .delete()
      .eq('id', params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ message: 'Conducteur supprimé' })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}


