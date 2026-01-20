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

    const { data: conducteurs, error } = await supabase
      .from('Conducteur')
      .select('*')
      .order('nom', { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json(conducteurs || [])
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
    const { nom, prenom, numeroPermis, experience } = body

    console.log('📝 Création conducteur:', { nom, prenom, numeroPermis, experience })

    // Vérifier si le permis existe déjà
    const { data: existing, error: checkError } = await supabase
      .from('Conducteur')
      .select('id')
      .eq('numeroPermis', numeroPermis)
      .maybeSingle()

    if (checkError) {
      console.error('Erreur vérification permis:', checkError)
    }

    if (existing) {
      console.log('❌ Numéro de permis déjà existant')
      return NextResponse.json(
        { error: 'Ce numéro de permis existe déjà' },
        { status: 400 }
      )
    }

    // Générer un ID unique
    const conducteurId = `conducteur_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const { data: conducteur, error } = await supabase
      .from('Conducteur')
      .insert({
        id: conducteurId,
        nom,
        prenom,
        numeroPermis,
        experience: parseInt(experience),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erreur insertion:', error)
      throw error
    }

    console.log('✅ Conducteur créé:', conducteur)
    return NextResponse.json(conducteur)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}


