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

    const { data: paiements, error } = await supabase
      .from('Paiement')
      .select(`
        *,
        User:userId (nom, prenom, email),
        Reservation (id, nombrePlaces, Horaire (id, Trajet (villeDepart, villeArrivee)))
      `)
      .order('datePaiement', { ascending: false })

    if (error) {
      throw error
    }

    const totalRevenus = paiements.reduce((sum, p) => sum + parseFloat(p.montant), 0)

    return NextResponse.json({
      paiements: paiements.map(p => ({
        id: p.id,
        montant: parseFloat(p.montant),
        methodePaiement: p.methodePaiement,
        datePaiement: new Date(p.datePaiement).toISOString(),
        numeroFacture: p.numeroFacture,
        user: p.user,
        reservation: {
          id: p.reservation.id,
          nombrePlaces: p.reservation.nombrePlaces,
          horaire: {
            trajet: p.reservation.horaire.trajet,
          },
        },
      })),

      totalRevenus,
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}


