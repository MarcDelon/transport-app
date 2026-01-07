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

    const [
      { count: totalClients },
      { count: totalReservations },
      { count: reservationsEnAttente },
      { data: paiements },
      { count: trajets },
      { count: vehicules },
    ] = await Promise.all([
      supabase.from('User').select('*', { count: 'exact', head: true }).eq('role', 'CLIENT'),
      supabase.from('Reservation').select('*', { count: 'exact', head: true }),
      supabase.from('Reservation').select('*', { count: 'exact', head: true }).eq('statut', 'EN_ATTENTE'),
      supabase.from('Paiement').select('montant'),
      supabase.from('Trajet').select('*', { count: 'exact', head: true }),
      supabase.from('Vehicule').select('*', { count: 'exact', head: true }),
    ])

    const revenus = paiements?.reduce((sum, p) => sum + (p.montant || 0), 0) || 0

    return NextResponse.json({
      totalClients: totalClients || 0,
      totalReservations: totalReservations || 0,
      reservationsEnAttente: reservationsEnAttente || 0,
      revenus,
      trajets: trajets || 0,
      vehicules: vehicules || 0,
    })
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}



