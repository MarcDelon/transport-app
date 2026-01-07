import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

interface User {
  nom: string;
  prenom: string;
  email: string;
}

interface Abonnement {
  id: string;
  type: string;
  dateDebut: string;
  dateFin: string;
  reduction: number;
  trajetsInclus: number | null;
  user: User;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const { data: abonnements, error } = await supabase
      .from('Abonnement')
      .select(`
        *,
        user:User (nom, prenom, email)
      `)
      .order('dateDebut', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(abonnements.map((a: Abonnement) => ({
      id: a.id,
      type: a.type,
      dateDebut: a.dateDebut,
      dateFin: a.dateFin,
      reduction: a.reduction,
      trajetsInclus: a.trajetsInclus,
      user: a.user,
    })))
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}


