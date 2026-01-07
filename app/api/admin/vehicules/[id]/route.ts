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
    const { numeroImmatriculation, marque, modele, capaciteMaximale, statut } = body

    // Vérifier si l'immatriculation existe déjà (sauf pour ce véhicule)
    if (numeroImmatriculation) {
      const { data: existing } = await supabase
        .from('Vehicule')
        .select('id')
        .eq('numeroImmatriculation', numeroImmatriculation)
        .neq('id', params.id)
        .single()

      if (existing) {
        return NextResponse.json(
          { error: 'Ce numéro d\'immatriculation existe déjà' },
          { status: 400 }
        )
      }
    }

    const { data: vehicule, error } = await supabase
      .from('Vehicule')
      .update({
        numeroImmatriculation,
        marque,
        modele,
        capaciteMaximale: parseInt(capaciteMaximale),
        statut,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(vehicule)
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
      .from('Vehicule')
      .delete()
      .eq('id', params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ message: 'Véhicule supprimé' })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}


