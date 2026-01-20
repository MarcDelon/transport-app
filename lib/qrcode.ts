import QRCode from 'qrcode'

interface ReservationQRData {
  reservationId: string
  nom: string
  prenom: string
  villeDepart: string
  villeArrivee: string
  dateDepart: string
  nombrePlaces: number
  numeroFacture: string
}

export async function generateReservationQRCode(data: ReservationQRData): Promise<string> {
  try {
    // Créer une chaîne JSON avec les données de la réservation
    const qrData = JSON.stringify({
      id: data.reservationId,
      passager: `${data.prenom} ${data.nom}`,
      trajet: `${data.villeDepart} → ${data.villeArrivee}`,
      depart: data.dateDepart,
      places: data.nombrePlaces,
      facture: data.numeroFacture,
      timestamp: new Date().toISOString(),
    })

    // Générer le QR code en base64
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    return qrCodeDataURL
  } catch (error) {
    console.error('Erreur génération QR code:', error)
    throw error
  }
}

export async function generateQRCodeSVG(data: ReservationQRData): Promise<string> {
  try {
    const qrData = JSON.stringify({
      id: data.reservationId,
      passager: `${data.prenom} ${data.nom}`,
      trajet: `${data.villeDepart} → ${data.villeArrivee}`,
      depart: data.dateDepart,
      places: data.nombrePlaces,
      facture: data.numeroFacture,
    })

    // Générer le QR code en SVG
    const qrCodeSVG = await QRCode.toString(qrData, {
      errorCorrectionLevel: 'H',
      type: 'svg',
      width: 300,
    })

    return qrCodeSVG
  } catch (error) {
    console.error('Erreur génération QR code SVG:', error)
    throw error
  }
}

// Fonction générique pour générer un QR code à partir de n'importe quelles données
export async function generateQRCodeDataURL(data: any): Promise<string> {
  try {
    const qrData = JSON.stringify({
      ...data,
      timestamp: new Date().toISOString(),
    })

    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    return qrCodeDataURL
  } catch (error) {
    console.error('Erreur génération QR code:', error)
    throw error
  }
}
