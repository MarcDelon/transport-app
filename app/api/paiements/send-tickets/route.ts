import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { sendIndividualTicket } from '@/lib/email'
import { generateQRCodeDataURL } from '@/lib/qrcode'

export const dynamic = 'force-dynamic'

// POST - Envoyer les billets par email après confirmation du paiement
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { reservationId, passagers } = await request.json()

    console.log('📧 Envoi des billets pour la réservation:', reservationId)

    // Récupérer la réservation avec tous les détails
    const { data: reservation, error: reservationError } = await supabase
      .from('Reservation')
      .select(`
        *,
        user:User!userId (
          nom,
          prenom,
          email
        ),
        horaire:Horaire!horaireId (
          dateDepart,
          dateArrivee,
          trajet:Trajet!trajetId (
            villeDepart,
            villeArrivee
          )
        ),
        paiement:Paiement (
          numeroFacture,
          montant,
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

    // Vérifier que le paiement est confirmé
    const paiement = Array.isArray(reservation.paiement) 
      ? reservation.paiement[0] 
      : reservation.paiement

    if (!paiement || paiement.statut !== 'VALIDE') {
      return NextResponse.json(
        { error: 'Le paiement doit être validé avant d\'envoyer les billets' },
        { status: 400 }
      )
    }

    const user = reservation.user as any
    const horaire = reservation.horaire as any
    const trajet = horaire.trajet

    // Préparer les données de base
    const baseData = {
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      numeroFacture: paiement.numeroFacture,
      villeDepart: trajet.villeDepart,
      villeArrivee: trajet.villeArrivee,
      dateDepart: horaire.dateDepart,
      nombrePlaces: reservation.nombrePlaces,
      montant: paiement.montant,
      numeroReservation: reservation.numeroReservation,
    }

    // Si des passagers sont fournis, envoyer un billet par passager
    if (passagers && Array.isArray(passagers) && passagers.length > 0) {
      console.log(`📧 Envoi de ${passagers.length} billets individuels`)

      const emailPromises = passagers.map(async (passager: any, index: number) => {
        // Générer un QR code unique pour chaque passager
        const qrData = {
          reservationId: reservation.id,
          numeroReservation: reservation.numeroReservation,
          passagerNom: passager.nom,
          passagerPrenom: passager.prenom,
          numeroPlace: index + 1,
          dateDepart: horaire.dateDepart,
          trajet: `${trajet.villeDepart} → ${trajet.villeArrivee}`,
        }

        const qrCodeDataUrl = await generateQRCodeDataURL(qrData)

        // Envoyer le billet individuel
        return sendIndividualTicket(
          {
            ...baseData,
            qrCodeDataUrl,
            passagerNom: passager.nom,
            passagerPrenom: passager.prenom,
            numeroPlace: index + 1,
            email: passager.email || user.email, // Email du passager ou email principal
          },
          index + 1,
          passagers.length
        )
      })

      await Promise.all(emailPromises)

      console.log(`✅ ${passagers.length} billets envoyés avec succès`)

      return NextResponse.json({
        success: true,
        message: `${passagers.length} billet(s) envoyé(s) avec succès`,
        ticketsSent: passagers.length,
      })
    } else {
      // Sinon, envoyer un seul billet pour toutes les places
      console.log('📧 Envoi d\'un billet groupé')

      const qrData = {
        reservationId: reservation.id,
        numeroReservation: reservation.numeroReservation,
        nombrePlaces: reservation.nombrePlaces,
        dateDepart: horaire.dateDepart,
        trajet: `${trajet.villeDepart} → ${trajet.villeArrivee}`,
      }

      const qrCodeDataUrl = await generateQRCodeDataURL(qrData)

      await sendIndividualTicket(
        {
          ...baseData,
          qrCodeDataUrl,
        },
        1,
        1
      )

      console.log('✅ Billet groupé envoyé avec succès')

      return NextResponse.json({
        success: true,
        message: 'Billet envoyé avec succès',
        ticketsSent: 1,
      })
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi des billets:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi des billets' },
      { status: 500 }
    )
  }
}
