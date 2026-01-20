import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// POST - Valider un billet via QR code
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'CONDUCTEUR') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { qrData } = body

    console.log('🎫 Validation billet via QR code')

    // Parser les données du QR code
    let reservationData
    try {
      reservationData = JSON.parse(qrData)
    } catch (e) {
      return NextResponse.json(
        { error: 'QR code invalide' },
        { status: 400 }
      )
    }

    const reservationId = reservationData.id

    if (!reservationId) {
      return NextResponse.json(
        { error: 'QR code invalide - ID manquant' },
        { status: 400 }
      )
    }

    // Récupérer la réservation
    const { data: reservation, error: reservationError } = await supabase
      .from('Reservation')
      .select(`
        id,
        nombrePlaces,
        statut,
        horaireId,
        user:User!userId (
          nom,
          prenom,
          telephone
        ),
        horaire:Horaire!horaireId (
          id,
          dateDepart,
          conducteurId,
          trajet:Trajet!trajetId (
            villeDepart,
            villeArrivee
          )
        ),
        paiement:Paiement!reservationId (
          statut
        )
      `)
      .eq('id', reservationId)
      .single()

    if (reservationError || !reservation) {
      console.error('❌ Réservation non trouvée:', reservationError)
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier que le conducteur est bien assigné à ce trajet
    const { data: conducteur } = await supabase
      .from('Conducteur')
      .select('id')
      .eq('userId', session.user.id)
      .single()

    if (!conducteur || (reservation.horaire as any).conducteurId !== conducteur.id) {
      return NextResponse.json(
        { error: 'Ce billet n\'est pas pour votre trajet' },
        { status: 403 }
      )
    }

    // Vérifier le statut de la réservation
    if (reservation.statut === 'ANNULEE') {
      return NextResponse.json(
        { 
          valid: false,
          error: 'Réservation annulée',
          reservation 
        },
        { status: 200 }
      )
    }

    // Vérifier le statut du paiement
    const paiementStatut = (reservation.paiement as any)?.[0]?.statut
    if (paiementStatut !== 'VALIDE') {
      return NextResponse.json(
        { 
          valid: false,
          error: 'Paiement non validé',
          reservation 
        },
        { status: 200 }
      )
    }

    // Vérifier que le départ n'est pas trop en avance
    const dateDepart = new Date((reservation.horaire as any).dateDepart)
    const maintenant = new Date()
    const heuresAvantDepart = (dateDepart.getTime() - maintenant.getTime()) / (1000 * 60 * 60)

    if (heuresAvantDepart > 2) {
      return NextResponse.json(
        { 
          valid: false,
          error: `Départ dans ${Math.round(heuresAvantDepart)} heures. Trop tôt pour valider.`,
          reservation 
        },
        { status: 200 }
      )
    }

    // Tout est OK !
    console.log('✅ Billet valide:', reservationId)

    return NextResponse.json({
      valid: true,
      message: 'Billet valide',
      reservation: {
        id: reservation.id,
        passager: `${(reservation.user as any).prenom} ${(reservation.user as any).nom}`,
        telephone: (reservation.user as any).telephone,
        nombrePlaces: reservation.nombrePlaces,
        trajet: `${(reservation.horaire as any).trajet.villeDepart} → ${(reservation.horaire as any).trajet.villeArrivee}`,
        dateDepart: (reservation.horaire as any).dateDepart,
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
