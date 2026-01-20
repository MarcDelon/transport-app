import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

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
        user:User!userId (nom, prenom, email),
        reservation:Reservation!reservationId (
          id,
          nombrePlaces,
          horaire:Horaire!horaireId (
            id,
            trajet:Trajet!trajetId (
              villeDepart,
              villeArrivee
            )
          )
        )
      `)
      .order('datePaiement', { ascending: false })

    if (error) {
      console.error('❌ Erreur Supabase paiements:', error)
      throw error
    }

    console.log('✅ Paiements récupérés:', paiements?.length || 0)
    if (paiements && paiements.length > 0) {
      console.log('Exemple de paiement:', JSON.stringify(paiements[0], null, 2))
    }

    const totalRevenus = paiements?.reduce((sum, p) => sum + parseFloat(p.montant), 0) || 0

    return NextResponse.json({
      paiements: paiements?.map(p => ({
        id: p.id,
        montant: parseFloat(p.montant),
        methodePaiement: p.methodePaiement || null,
        statut: p.statut || 'EN_ATTENTE',
        datePaiement: new Date(p.datePaiement).toISOString(),
        numeroFacture: p.numeroFacture,
        user: p.user || null,
        reservation: p.reservation ? {
          id: p.reservation.id,
          nombrePlaces: p.reservation.nombrePlaces,
          horaire: p.reservation.horaire ? {
            trajet: p.reservation.horaire.trajet || null,
          } : null,
        } : null,
      })) || [],

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


