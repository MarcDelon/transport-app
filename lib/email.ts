import nodemailer from 'nodemailer'

interface ReservationEmailData {
  email: string
  nom: string
  prenom: string
  numeroFacture: string
  villeDepart: string
  villeArrivee: string
  dateDepart: string
  nombrePlaces: number
  montant: number
  numeroReservation: string
  qrCodeDataUrl?: string
  passagerNom?: string
  passagerPrenom?: string
  numeroPlace?: number
}

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true pour 465, false pour les autres ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

// Template HTML pour le billet
function generateTicketHTML(data: ReservationEmailData): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Billet de Réservation - Nova Transport</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🚌 NOVA TRANSPORT</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Votre billet de réservation</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 16px; color: #333333; margin: 0 0 20px 0;">
                Bonjour <strong>${data.prenom} ${data.nom}</strong>,
              </p>
              
              <p style="font-size: 14px; color: #666666; margin: 0 0 30px 0;">
                Votre réservation a été confirmée avec succès ! Voici les détails de votre voyage :
              </p>

              <!-- QR Code -->
              ${data.qrCodeDataUrl ? `
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="${data.qrCodeDataUrl}" alt="QR Code" style="width: 200px; height: 200px; border: 2px solid #667eea; border-radius: 8px; padding: 10px; background: white;" />
                <p style="font-size: 12px; color: #666666; margin-top: 10px;">Présentez ce QR code au conducteur</p>
              </div>
              ` : ''}

              <!-- Ticket Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; border: 2px dashed #667eea; padding: 20px; margin-bottom: 30px;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-size: 14px; color: #666666; padding: 8px 0;">
                          <strong>Numéro de réservation</strong>
                        </td>
                        <td style="font-size: 14px; color: #333333; text-align: right; padding: 8px 0;">
                          ${data.numeroReservation}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 14px; color: #666666; padding: 8px 0;">
                          <strong>Numéro de facture</strong>
                        </td>
                        <td style="font-size: 14px; color: #333333; text-align: right; padding: 8px 0;">
                          ${data.numeroFacture}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="border-top: 1px solid #dee2e6; padding-top: 15px; padding-bottom: 5px;">
                          <div style="font-size: 12px; color: #666666; margin-bottom: 5px;">TRAJET</div>
                          <div style="font-size: 18px; color: #667eea; font-weight: bold;">
                            ${data.villeDepart} → ${data.villeArrivee}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 14px; color: #666666; padding: 8px 0;">
                          <strong>Date de départ</strong>
                        </td>
                        <td style="font-size: 14px; color: #333333; text-align: right; padding: 8px 0;">
                          ${new Date(data.dateDepart).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                      ${data.passagerNom ? `
                      <tr>
                        <td style="font-size: 14px; color: #666666; padding: 8px 0;">
                          <strong>Passager</strong>
                        </td>
                        <td style="font-size: 14px; color: #333333; text-align: right; padding: 8px 0;">
                          ${data.passagerPrenom} ${data.passagerNom}
                        </td>
                      </tr>
                      ` : ''}
                      ${data.numeroPlace ? `
                      <tr>
                        <td style="font-size: 14px; color: #666666; padding: 8px 0;">
                          <strong>Numéro de place</strong>
                        </td>
                        <td style="font-size: 14px; color: #333333; text-align: right; padding: 8px 0;">
                          Place ${data.numeroPlace}
                        </td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="font-size: 14px; color: #666666; padding: 8px 0;">
                          <strong>Nombre de places</strong>
                        </td>
                        <td style="font-size: 14px; color: #333333; text-align: right; padding: 8px 0;">
                          ${data.nombrePlaces} place${data.nombrePlaces > 1 ? 's' : ''}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 14px; color: #666666; padding: 8px 0; border-top: 2px solid #667eea; padding-top: 15px;">
                          <strong>MONTANT TOTAL</strong>
                        </td>
                        <td style="font-size: 20px; color: #28a745; font-weight: bold; text-align: right; padding: 8px 0; border-top: 2px solid #667eea; padding-top: 15px;">
                          ${data.montant.toLocaleString('fr-FR')} FCFA
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Payment Status -->
              ${data.qrCodeDataUrl ? `
              <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin-bottom: 30px; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #155724;">
                  ✅ <strong>Paiement confirmé</strong><br>
                  Votre billet est valide. Présentez le QR code ci-dessus au conducteur.
                </p>
              </div>
              ` : `
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 30px; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #856404;">
                  ⏳ <strong>Paiement en attente</strong><br>
                  Votre réservation sera confirmée définitivement après validation du paiement par notre équipe.
                </p>
              </div>
              `}

              <!-- Instructions -->
              <div style="background-color: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #1976D2;">📋 Instructions importantes</h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #0d47a1;">
                  <li style="margin-bottom: 8px;">Présentez-vous 15 minutes avant le départ</li>
                  <li style="margin-bottom: 8px;">Munissez-vous d'une pièce d'identité valide</li>
                  <li style="margin-bottom: 8px;">Conservez ce billet jusqu'à la fin du voyage</li>
                  <li>En cas de problème, contactez notre service client</li>
                </ul>
              </div>

              <p style="font-size: 14px; color: #666666; margin: 20px 0 0 0;">
                Merci d'avoir choisi Nova Transport !<br>
                Bon voyage ! 🚌
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #666666;">
                Nova Transport - Service de transport inter-urbain
              </p>
              <p style="margin: 0; font-size: 12px; color: #999999;">
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

// Fonction pour envoyer le billet par email
export async function sendReservationTicket(data: ReservationEmailData): Promise<boolean> {
  try {
    console.log('📧 Envoi du billet à:', data.email)

    const info = await transporter.sendMail({
      from: `"Nova Transport" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: `🎫 Votre billet de réservation - ${data.villeDepart} → ${data.villeArrivee}`,
      html: generateTicketHTML(data),
      text: `
Bonjour ${data.prenom} ${data.nom},

Votre réservation a été confirmée avec succès !

Détails de votre voyage :
- Numéro de réservation : ${data.numeroReservation}
- Numéro de facture : ${data.numeroFacture}
- Trajet : ${data.villeDepart} → ${data.villeArrivee}
- Date de départ : ${new Date(data.dateDepart).toLocaleString('fr-FR')}
- Nombre de places : ${data.nombrePlaces}
- Montant total : ${data.montant.toLocaleString('fr-FR')} FCFA

⏳ Paiement en attente
Votre réservation sera confirmée définitivement après validation du paiement.

Instructions importantes :
- Présentez-vous 15 minutes avant le départ
- Munissez-vous d'une pièce d'identité valide
- Conservez ce billet jusqu'à la fin du voyage

Merci d'avoir choisi Nova Transport !
Bon voyage ! 🚌
      `,
    })

    console.log('✅ Email envoyé avec succès:', info.messageId)
    return true
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error)
    return false
  }
}

// Fonction pour envoyer un billet individuel avec QR code
export async function sendIndividualTicket(
  data: ReservationEmailData,
  passagerIndex: number,
  totalPassagers: number
): Promise<boolean> {
  try {
    const subject = totalPassagers > 1 
      ? `🎫 Votre billet ${passagerIndex}/${totalPassagers} - ${data.villeDepart} → ${data.villeArrivee}`
      : `🎫 Votre billet de réservation - ${data.villeDepart} → ${data.villeArrivee}`

    console.log(`📧 Envoi du billet ${passagerIndex}/${totalPassagers} à:`, data.email)

    const info = await transporter.sendMail({
      from: `"Nova Transport" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject,
      html: generateTicketHTML(data),
    })

    console.log(`✅ Billet ${passagerIndex}/${totalPassagers} envoyé:`, info.messageId)
    return true
  } catch (error) {
    console.error(`❌ Erreur lors de l'envoi du billet ${passagerIndex}:`, error)
    return false
  }
}

// Fonction pour envoyer la confirmation de paiement
export async function sendPaymentConfirmation(data: ReservationEmailData): Promise<boolean> {
  try {
    console.log('📧 Envoi de la confirmation de paiement à:', data.email)

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">✅ Paiement Confirmé</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 16px; color: #333333;">
                Bonjour <strong>${data.prenom} ${data.nom}</strong>,
              </p>
              <p style="font-size: 14px; color: #666666;">
                Votre paiement a été validé avec succès ! Votre réservation est maintenant <strong style="color: #28a745;">CONFIRMÉE</strong>.
              </p>
              <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #155724;">
                  ✅ <strong>Réservation confirmée</strong><br>
                  Numéro : ${data.numeroReservation}<br>
                  Montant payé : ${data.montant.toLocaleString('fr-FR')} FCFA
                </p>
              </div>
              <p style="font-size: 14px; color: #666666;">
                Vous pouvez voyager en toute sérénité. N'oubliez pas de vous présenter 15 minutes avant le départ avec une pièce d'identité.
              </p>
              <p style="font-size: 14px; color: #666666; margin-top: 20px;">
                Bon voyage ! 🚌
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    await transporter.sendMail({
      from: `"Nova Transport" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: '✅ Paiement confirmé - Votre voyage est validé !',
      html,
    })

    console.log('✅ Email de confirmation envoyé')
    return true
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error)
    return false
  }
}
