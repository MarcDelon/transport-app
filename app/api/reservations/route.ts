import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { sendReservationTicket } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    console.log('🔍 Session récupérée:', session ? 'OUI' : 'NON')
    if (session) {
      console.log('👤 Role utilisateur:', session.user?.role)
      console.log('🆔 ID utilisateur:', session.user?.id)
    }

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé - Vous devez être connecté' },
        { status: 403 }
      )
    }

    // Accepter les CLIENT et les ADMIN (pour les tests)
    if (session.user.role !== 'CLIENT' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé - Seuls les clients peuvent faire des réservations' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { horaireId, nombrePlaces } = body

    // Vérifier l'horaire
    const { data: horaire, error: horaireError } = await supabase
      .from('Horaire')
      .select(`
        *,
        Trajet (*),
        Vehicule (*)
      `)
      .eq('id', horaireId)
      .single()

    if (horaireError || !horaire) {
      return NextResponse.json(
        { error: 'Horaire non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer les réservations actives
    const { data: reservations } = await supabase
      .from('Reservation')
      .select('nombrePlaces')
      .eq('horaireId', horaireId)
      .in('statut', ['CONFIRMEE', 'EN_ATTENTE'])

    const placesReservees = reservations?.reduce(
      (sum, r) => sum + r.nombrePlaces,
      0
    ) || 0

    const placesDisponibles = (horaire.Vehicule as any).capaciteMaximale - placesReservees

    if (nombrePlaces > placesDisponibles) {
      return NextResponse.json(
        { error: 'Pas assez de places disponibles' },
        { status: 400 }
      )
    }

    // Générer un ID unique pour la réservation
    const reservationId = `reserv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Calculer le montant total (tarif de base * nombre de places)
    const montantTotal = (horaire.Trajet as any).tarifBase * nombrePlaces
    console.log(`💰 Montant calculé: ${montantTotal} FCFA (${(horaire.Trajet as any).tarifBase} x ${nombrePlaces})`)

    // Créer la réservation
    const { data: reservation, error: reservationError } = await supabase
      .from('Reservation')
      .insert({
        id: reservationId,
        userId: session.user.id,
        horaireId,
        nombrePlaces,
        statut: 'EN_ATTENTE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (reservationError) {
      console.error('❌ Erreur lors de la création de la réservation:', reservationError)
      throw reservationError
    }

    console.log('✅ Réservation créée avec succès:', reservationId)

    // Créer automatiquement un paiement EN_ATTENTE
    const paiementId = `paie_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const numeroFacture = `FACT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

    const { data: paiement, error: paiementError } = await supabase
      .from('Paiement')
      .insert({
        id: paiementId,
        reservationId: reservation.id,
        userId: session.user.id,
        montant: montantTotal,
        methodePaiement: null, // Sera renseigné par l'admin lors de la validation
        statut: 'EN_ATTENTE',
        numeroFacture: numeroFacture,
        datePaiement: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (paiementError) {
      console.error('⚠️ Erreur lors de la création du paiement:', paiementError)
      // Ne pas bloquer la réservation si le paiement échoue
      console.log('⚠️ La réservation a été créée mais le paiement n\'a pas pu être créé automatiquement')
    } else {
      console.log('✅ Paiement EN_ATTENTE créé avec succès:', paiementId, '- Montant:', montantTotal, 'FCFA')
    }

    // Récupérer les informations de l'utilisateur pour l'email
    const { data: user } = await supabase
      .from('User')
      .select('nom, prenom, email')
      .eq('id', session.user.id)
      .single()

    // Envoyer le billet par email
    if (user && user.email) {
      try {
        await sendReservationTicket({
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          numeroFacture: numeroFacture,
          villeDepart: (horaire.Trajet as any).villeDepart,
          villeArrivee: (horaire.Trajet as any).villeArrivee,
          dateDepart: horaire.dateDepart,
          nombrePlaces: nombrePlaces,
          montant: montantTotal,
          numeroReservation: reservationId,
        })
        console.log('✅ Billet envoyé par email à:', user.email)
      } catch (emailError) {
        console.error('⚠️ Erreur lors de l\'envoi de l\'email:', emailError)
        // Ne pas bloquer la réservation si l'email échoue
      }
    }

    return NextResponse.json({
      message: 'Réservation créée avec succès',
      reservationId: reservation.id,
      paiementId: paiement?.id,
      montant: montantTotal,
      numeroFacture: numeroFacture,
    })
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}



