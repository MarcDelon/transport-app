import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    console.log('🚫 Demande d\'annulation de réservation:', params.id)

    // Récupérer la réservation avec les détails
    const { data: reservation, error: reservationError } = await supabase
      .from('Reservation')
      .select(`
        *,
        horaire:Horaire!horaireId (
          dateDepart,
          trajet:Trajet!trajetId (
            villeDepart,
            villeArrivee,
            tarifBase
          )
        ),
        paiement:Paiement!reservationId (
          id,
          montant,
          statut
        )
      `)
      .eq('id', params.id)
      .eq('userId', session.user.id)
      .single()

    if (reservationError || !reservation) {
      console.error('❌ Réservation non trouvée:', reservationError)
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier que la réservation n'est pas déjà annulée
    if (reservation.statut === 'ANNULEE') {
      return NextResponse.json(
        { error: 'Cette réservation est déjà annulée' },
        { status: 400 }
      )
    }

    // Calculer le délai avant le départ
    const dateDepart = new Date((reservation.horaire as any).dateDepart)
    const maintenant = new Date()
    const heuresAvantDepart = (dateDepart.getTime() - maintenant.getTime()) / (1000 * 60 * 60)

    console.log('⏰ Heures avant départ:', heuresAvantDepart)

    // Déterminer le pourcentage de remboursement selon les conditions
    let pourcentageRemboursement = 0
    let fraisAnnulation = 0
    let montantRembourse = 0
    let conditionAnnulation = ''

    const montantTotal = parseFloat((reservation.paiement as any)?.montant || 0)

    if (heuresAvantDepart >= 48) {
      // Annulation plus de 48h avant : remboursement complet (90% - 10% de frais)
      pourcentageRemboursement = 90
      conditionAnnulation = 'Annulation plus de 48h avant le départ'
    } else if (heuresAvantDepart >= 24) {
      // Annulation entre 24h et 48h : remboursement partiel (70%)
      pourcentageRemboursement = 70
      conditionAnnulation = 'Annulation entre 24h et 48h avant le départ'
    } else if (heuresAvantDepart >= 6) {
      // Annulation entre 6h et 24h : remboursement réduit (50%)
      pourcentageRemboursement = 50
      conditionAnnulation = 'Annulation entre 6h et 24h avant le départ'
    } else if (heuresAvantDepart > 0) {
      // Annulation moins de 6h avant : remboursement minimal (20%)
      pourcentageRemboursement = 20
      conditionAnnulation = 'Annulation moins de 6h avant le départ'
    } else {
      // Départ déjà passé : pas de remboursement
      return NextResponse.json(
        { error: 'Impossible d\'annuler une réservation après le départ' },
        { status: 400 }
      )
    }

    fraisAnnulation = montantTotal * (100 - pourcentageRemboursement) / 100
    montantRembourse = montantTotal - fraisAnnulation

    console.log('💰 Calcul remboursement:', {
      montantTotal,
      pourcentageRemboursement,
      fraisAnnulation,
      montantRembourse
    })

    // Mettre à jour la réservation
    const { error: updateError } = await supabase
      .from('Reservation')
      .update({
        statut: 'ANNULEE',
        updatedAt: new Date().toISOString(),
      })
      .eq('id', params.id)

    if (updateError) {
      console.error('❌ Erreur mise à jour réservation:', updateError)
      throw updateError
    }

    // Mettre à jour le paiement si validé
    if ((reservation.paiement as any)?.statut === 'VALIDE') {
      const { error: paiementError } = await supabase
        .from('Paiement')
        .update({
          statut: 'REFUSE', // On marque comme refusé pour indiquer l'annulation
          updatedAt: new Date().toISOString(),
        })
        .eq('reservationId', params.id)

      if (paiementError) {
        console.error('⚠️ Erreur mise à jour paiement:', paiementError)
      }
    }

    console.log('✅ Réservation annulée avec succès')

    return NextResponse.json({
      message: 'Réservation annulée avec succès',
      remboursement: {
        montantTotal,
        pourcentageRemboursement,
        fraisAnnulation,
        montantRembourse,
        conditionAnnulation,
        delaiHeures: Math.round(heuresAvantDepart * 10) / 10,
      }
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
