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

    const { data: vehicules, error } = await supabase
      .from('Vehicule')
      .select('*')
      .order('numeroImmatriculation', { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json(vehicules || [])
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
    const { numeroImmatriculation, marque, modele, capaciteMaximale, statut } = body

    // Vérifier si l'immatriculation existe déjà
    const { data: existing } = await supabase
      .from('Vehicule')
      .select('id')
      .eq('numeroImmatriculation', numeroImmatriculation)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Ce numéro d\'immatriculation existe déjà' },
        { status: 400 }
      )
    }

    const { data: vehicule, error } = await supabase
      .from('Vehicule')
      .insert({
        numeroImmatriculation,
        marque,
        modele,
        capaciteMaximale: parseInt(capaciteMaximale),
        statut: statut || 'EN_SERVICE',
        updatedAt: new Date().toISOString(),
      })
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


