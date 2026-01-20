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

    console.log('📝 Création véhicule:', { numeroImmatriculation, marque, modele, capaciteMaximale })

    // Vérifier si l'immatriculation existe déjà
    const { data: existing, error: checkError } = await supabase
      .from('Vehicule')
      .select('id')
      .eq('numeroImmatriculation', numeroImmatriculation)
      .maybeSingle()

    if (checkError) {
      console.error('Erreur vérification immatriculation:', checkError)
    }

    if (existing) {
      console.log('❌ Numéro d\'immatriculation déjà existant')
      return NextResponse.json(
        { error: 'Ce numéro d\'immatriculation existe déjà' },
        { status: 400 }
      )
    }

    // Générer un ID unique
    const vehiculeId = `vehicule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const { data: vehicule, error } = await supabase
      .from('Vehicule')
      .insert({
        id: vehiculeId,
        numeroImmatriculation,
        marque,
        modele,
        capaciteMaximale: parseInt(capaciteMaximale),
        statut: statut || 'EN_SERVICE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erreur insertion:', error)
      throw error
    }

    console.log('✅ Véhicule créé:', vehicule)
    return NextResponse.json(vehicule)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}


