import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET - Récupérer le profil du client
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const { data: user, error } = await supabase
      .from('User')
      .select('id, nom, prenom, email, telephone, numeroIdentite')
      .eq('id', session.user.id)
      .single()

    if (error) {
      console.error('❌ Erreur récupération profil:', error)
      throw error
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}

// PATCH - Mettre à jour le profil du client
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { nom, prenom, email, telephone, numeroIdentite } = body

    console.log('📝 Mise à jour profil:', { nom, prenom, email, telephone })

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== session.user.email) {
      const { data: existingUser } = await supabase
        .from('User')
        .select('id')
        .eq('email', email)
        .neq('id', session.user.id)
        .maybeSingle()

      if (existingUser) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé par un autre compte' },
          { status: 400 }
        )
      }
    }

    const { data: user, error } = await supabase
      .from('User')
      .update({
        nom,
        prenom,
        email,
        telephone,
        numeroIdentite,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', session.user.id)
      .select()
      .single()

    if (error) {
      console.error('❌ Erreur mise à jour profil:', error)
      throw error
    }

    console.log('✅ Profil mis à jour avec succès')
    return NextResponse.json(user)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
