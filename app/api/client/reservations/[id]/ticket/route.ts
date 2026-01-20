import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { jsPDF } from 'jspdf'
import { generateQRCodeDataURL } from '@/lib/qrcode'

export const dynamic = 'force-dynamic'

// GET - Télécharger le billet en PDF
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    console.log('📄 Génération du billet PDF pour:', params.id)

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
            villeArrivee,
            distance,
            dureeEstimee
          )
        ),
        paiement:Paiement (
          numeroFacture,
          montant,
          statut
        )
      `)
      .eq('id', params.id)
      .single()

    if (reservationError) {
      console.error('❌ Erreur Supabase:', reservationError)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de la réservation: ' + reservationError.message },
        { status: 500 }
      )
    }

    if (!reservation) {
      console.error('❌ Réservation non trouvée:', params.id)
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      )
    }

    console.log('📦 Réservation récupérée:', {
      id: reservation.id,
      userId: reservation.userId,
      sessionUserId: session.user.id,
      hasUser: !!reservation.user,
      hasHoraire: !!reservation.horaire,
      hasPaiement: !!reservation.paiement
    })

    // Vérifier que l'utilisateur est propriétaire de la réservation
    if (reservation.userId !== session.user.id) {
      console.error('❌ Non autorisé - userId mismatch')
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    if (!reservation.user || !reservation.horaire) {
      console.error('❌ Données manquantes:', { 
        hasUser: !!reservation.user, 
        hasHoraire: !!reservation.horaire 
      })
      return NextResponse.json(
        { error: 'Données de réservation incomplètes' },
        { status: 500 }
      )
    }

    const user = reservation.user as any
    const horaire = reservation.horaire as any
    const trajet = horaire?.trajet || {}
    const paiement = Array.isArray(reservation.paiement) 
      ? reservation.paiement[0] 
      : reservation.paiement

    // Valeurs par défaut pour éviter les erreurs
    const villeDepart = trajet.villeDepart || 'N/A'
    const villeArrivee = trajet.villeArrivee || 'N/A'
    const nomPassager = user?.nom || ''
    const prenomPassager = user?.prenom || ''
    const numeroReservation = reservation.numeroReservation || 'N/A'

    // Générer le QR code
    const qrData = {
      reservationId: reservation.id,
      numeroReservation: numeroReservation,
      passagerNom: nomPassager,
      passagerPrenom: prenomPassager,
      dateDepart: horaire?.dateDepart || new Date().toISOString(),
      trajet: `${villeDepart} → ${villeArrivee}`,
    }

    const qrCodeDataUrl = await generateQRCodeDataURL(qrData)

    // Créer le PDF
    const doc = new jsPDF()

    // Header avec dégradé simulé (plusieurs rectangles)
    doc.setFillColor(67, 97, 238)
    doc.rect(0, 0, 210, 50, 'F')
    doc.setFillColor(79, 109, 245)
    doc.rect(0, 0, 210, 45, 'F')
    doc.setFillColor(102, 126, 234)
    doc.rect(0, 0, 210, 40, 'F')

    // Logo et titre
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text('NOVA TRANSPORT', 105, 22, { align: 'center' })
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text('Billet de Voyage Electronique', 105, 32, { align: 'center' })

    // Section QR Code avec cadre élégant
    doc.setFillColor(248, 249, 250)
    doc.roundedRect(150, 45, 50, 55, 3, 3, 'F')
    doc.setDrawColor(102, 126, 234)
    doc.setLineWidth(0.3)
    doc.roundedRect(150, 45, 50, 55, 3, 3, 'S')
    
    doc.addImage(qrCodeDataUrl, 'PNG', 157, 50, 36, 36)
    
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Scannez ce code', 175, 93, { align: 'center' })

    // Carte principale du billet avec ombre
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(15, 55, 130, 110, 4, 4, 'F')
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.5)
    doc.roundedRect(15, 55, 130, 110, 4, 4, 'S')

    // Badge statut en haut
    if (paiement?.statut === 'VALIDE') {
      doc.setFillColor(34, 197, 94)
      doc.roundedRect(20, 60, 40, 8, 2, 2, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('CONFIRME', 40, 65, { align: 'center' })
    }

    // Trajet principal - Grand et visible
    let y = 75
    doc.setTextColor(102, 126, 234)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(villeDepart, 20, y)
    
    doc.setFontSize(16)
    doc.text('>', 70, y)
    
    doc.text(villeArrivee, 80, y)
    y += 12

    // Ligne séparatrice
    doc.setDrawColor(230, 230, 230)
    doc.setLineWidth(0.3)
    doc.line(20, y, 140, y)
    y += 8

    // Informations en deux colonnes
    doc.setTextColor(80, 80, 80)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')

    // Colonne gauche
    let leftY = y
    
    // Numéro de réservation
    doc.setTextColor(120, 120, 120)
    doc.text('No. Reservation', 20, leftY)
    doc.setTextColor(40, 40, 40)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text(numeroReservation || 'N/A', 20, leftY + 5)
    leftY += 14

    // Date de départ
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(120, 120, 120)
    doc.text('Date de depart', 20, leftY)
    doc.setTextColor(40, 40, 40)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    const dateDepart = new Date(horaire?.dateDepart || new Date())
    const dateStr = dateDepart.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
    const timeStr = dateDepart.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
    doc.text(dateStr, 20, leftY + 5)
    doc.setFontSize(12)
    doc.setTextColor(102, 126, 234)
    doc.text(timeStr, 20, leftY + 11)
    leftY += 20

    // Passager
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(120, 120, 120)
    doc.text('Passager', 20, leftY)
    doc.setTextColor(40, 40, 40)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    const passagerNom = `${prenomPassager} ${nomPassager}`.trim() || 'N/A'
    doc.text(passagerNom, 20, leftY + 5)

    // Colonne droite
    let rightY = y

    // Numéro de facture
    if (paiement?.numeroFacture) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(120, 120, 120)
      doc.text('No. Facture', 90, rightY)
      doc.setTextColor(40, 40, 40)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text(String(paiement.numeroFacture), 90, rightY + 5)
      rightY += 14
    }

    // Nombre de places
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(120, 120, 120)
    doc.text('Places', 90, rightY)
    doc.setTextColor(40, 40, 40)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    const nbPlaces = reservation.nombrePlaces || 1
    doc.text(`${nbPlaces}`, 90, rightY + 5)
    rightY += 14

    // Montant
    if (paiement?.montant) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(120, 120, 120)
      doc.text('Montant', 90, rightY)
      doc.setTextColor(34, 197, 94)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      const montant = parseFloat(paiement.montant) || 0
      doc.text(`${montant.toLocaleString('fr-FR')} F`, 90, rightY + 6)
    }

    // Section Instructions avec design moderne
    y = 175
    doc.setFillColor(249, 250, 251)
    doc.roundedRect(15, y, 180, 50, 3, 3, 'F')
    doc.setDrawColor(229, 231, 235)
    doc.setLineWidth(0.3)
    doc.roundedRect(15, y, 180, 50, 3, 3, 'S')
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(75, 85, 99)
    doc.text('Informations importantes', 20, y + 10)
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(107, 114, 128)
    
    // Icônes simulées avec des points
    doc.setFillColor(102, 126, 234)
    doc.circle(22, y + 18, 1.5, 'F')
    doc.text('Presentez-vous 15 minutes avant le depart', 27, y + 19)
    
    doc.circle(22, y + 26, 1.5, 'F')
    doc.text('Munissez-vous d\'une piece d\'identite valide', 27, y + 27)
    
    doc.circle(22, y + 34, 1.5, 'F')
    doc.text('Conservez ce billet jusqu\'a la fin du voyage', 27, y + 35)
    
    doc.circle(22, y + 42, 1.5, 'F')
    doc.text('Contact: +237 6XX XX XX XX', 27, y + 43)

    // Ligne décorative en bas
    doc.setDrawColor(102, 126, 234)
    doc.setLineWidth(2)
    doc.line(15, 235, 195, 235)

    // Footer moderne
    doc.setTextColor(156, 163, 175)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('NOVA TRANSPORT', 105, 245, { align: 'center' })
    doc.setFontSize(7)
    doc.text('Service de transport inter-urbain premium', 105, 250, { align: 'center' })
    
    const now = new Date()
    const genDate = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    const genTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    doc.text(`Genere le ${genDate} a ${genTime}`, 105, 255, { align: 'center' })

    // Générer le PDF en buffer
    const pdfBuffer = doc.output('arraybuffer')

    // Retourner le PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="billet-${reservation.numeroReservation}.pdf"`,
      },
    })
  } catch (error) {
    console.error('❌ Erreur génération PDF:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération du billet' },
      { status: 500 }
    )
  }
}
