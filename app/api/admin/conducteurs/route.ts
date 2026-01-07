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

    // Vérifier si le permis existe déjà
    const { data: existing } = await supabase
      .from('Conducteur')
      .select('id')
      .eq('numeroPermis', numeroPermis)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Ce numéro de permis existe déjà' },
        { status: 400 }
      )
    }

    const { data: conducteur, error } = await supabase
      .from('Conducteur')
      .insert({
        nom,
        prenom,
        numeroPermis,
        experience: parseInt(experience),
        updatedAt: new Date().toISOString(),
      })
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


