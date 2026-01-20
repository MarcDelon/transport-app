import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { sendPaymentConfirmation, sendIndividualTicket } from '@/lib/email'
import { generateQRCodeDataURL } from '@/lib/qrcode'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { statut, methodePaiement } = body

    console.log('📝 Validation paiement:', { id: params.id, statut, methodePaiement })

    // Vérifier que le paiement existe
    const { data: paiementExistant, error: checkError } = await supabase
      .from('Paiement')
      .select('*')
      .eq('id', params.id)
      .single()

    if (checkError || !paiementExistant) {
      return NextResponse.json(
        { error: 'Paiement non trouvé' },
        { status: 404 }
      )
    }

    // Si on valide le paiement, la méthode de paiement est obligatoire
    if (statut === 'VALIDE' && !methodePaiement) {
      return NextResponse.json(
        { error: 'La méthode de paiement est obligatoire pour valider un paiement' },
        { status: 400 }
      )
    }

    // Mettre à jour le paiement
    const { data: paiement, error } = await supabase
      .from('Paiement')
      .update({
        statut,
        methodePaiement: methodePaiement || paiementExistant.methodePaiement,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('❌ Erreur mise à jour paiement:', error)
      throw error
    }

    // Si le paiement est validé, mettre à jour la réservation en CONFIRMEE
    if (statut === 'VALIDE') {
      const { error: reservationError } = await supabase
        .from('Reservation')
        .update({
          statut: 'CONFIRMEE',
          updatedAt: new Date().toISOString(),
        })
        .eq('id', paiementExistant.reservationId)

      if (reservationError) {
        console.error('⚠️ Erreur mise à jour réservation:', reservationError)
      } else {
        console.log('✅ Réservation confirmée:', paiementExistant.reservationId)
      }

      // Envoyer l'email de confirmation de paiement ET les billets avec QR codes
      try {
        const { data: reservation } = await supabase
          .from('Reservation')
          .select(`
            *,
            user:User!userId (nom, prenom, email),
            horaire:Horaire!horaireId (
              dateDepart,
              trajet:Trajet!trajetId (villeDepart, villeArrivee)
            )
          `)
          .eq('id', paiementExistant.reservationId)
          .single()

        if (reservation && reservation.user) {
          const user = reservation.user as any
          const horaire = reservation.horaire as any
          const trajet = horaire?.trajet

          // 1. Envoyer l'email de confirmation
          await sendPaymentConfirmation({
            email: user.email,
            nom: user.nom,
            prenom: user.prenom,
            numeroFacture: paiementExistant.numeroFacture,
            villeDepart: trajet?.villeDepart || '',
            villeArrivee: trajet?.villeArrivee || '',
            dateDepart: horaire?.dateDepart || '',
            nombrePlaces: reservation.nombrePlaces,
            montant: parseFloat(paiementExistant.montant),
            numeroReservation: reservation.numeroReservation,
          })
          console.log('✅ Email de confirmation envoyé à:', user.email)

          // 2. Générer et envoyer les billets avec QR codes
          console.log(`📧 Génération de ${reservation.nombrePlaces} billet(s) avec QR code`)

          // Pour chaque place, générer un billet avec QR code unique
          for (let i = 0; i < reservation.nombrePlaces; i++) {
            const qrData = {
              reservationId: reservation.id,
              numeroReservation: reservation.numeroReservation,
              numeroPlace: i + 1,
              passagerNom: user.nom,
              passagerPrenom: user.prenom,
              dateDepart: horaire?.dateDepart,
              trajet: `${trajet?.villeDepart} → ${trajet?.villeArrivee}`,
            }

            const qrCodeDataUrl = await generateQRCodeDataURL(qrData)

            await sendIndividualTicket(
              {
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                numeroFacture: paiementExistant.numeroFacture,
                villeDepart: trajet?.villeDepart || '',
                villeArrivee: trajet?.villeArrivee || '',
                dateDepart: horaire?.dateDepart || '',
                nombrePlaces: reservation.nombrePlaces,
                montant: parseFloat(paiementExistant.montant),
                numeroReservation: reservation.numeroReservation,
                qrCodeDataUrl,
                passagerNom: user.nom,
                passagerPrenom: user.prenom,
                numeroPlace: i + 1,
              },
              i + 1,
              reservation.nombrePlaces
            )
          }

          console.log(`✅ ${reservation.nombrePlaces} billet(s) avec QR code envoyé(s) à:`, user.email)
        }
      } catch (emailError) {
        console.error('⚠️ Erreur lors de l\'envoi des emails:', emailError)
        // Ne pas bloquer la validation si l'email échoue
      }
    }

    // Si le paiement est refusé, annuler la réservation
    if (statut === 'REFUSE') {
      const { error: reservationError } = await supabase
        .from('Reservation')
        .update({
          statut: 'ANNULEE',
          updatedAt: new Date().toISOString(),
        })
        .eq('id', paiementExistant.reservationId)

      if (reservationError) {
        console.error('⚠️ Erreur annulation réservation:', reservationError)
      } else {
        console.log('✅ Réservation annulée:', paiementExistant.reservationId)
      }
    }

    console.log('✅ Paiement mis à jour avec succès')
    return NextResponse.json(paiement)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
