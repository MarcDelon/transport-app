'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { MapPin, Calendar, Users, Ticket, Download, XCircle, AlertTriangle } from 'lucide-react'

interface Reservation {
  id: string
  horaire: {
    dateDepart: string
    dateArrivee: string
    trajet: {
      villeDepart: string
      villeArrivee: string
      distance: number
      dureeEstimee: number
      tarifBase: number
    }
  }
  nombrePlaces: number
  statut: string
  createdAt: string
}

export default function ReservationDetailPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelResult, setCancelResult] = useState<any>(null)
  const [downloading, setDownloading] = useState(false)

  const fetchReservation = useCallback(async () => {
    try {
      const response = await fetch(`/api/client/reservations/${params.id}`)
      if (!response.ok) {
        router.push('/client/dashboard')
        return
      }
      const data = await response.json()
      setReservation(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }, [params.id, router])

  useEffect(() => {
    if (!session) {
      router.push('/connexion')
      return
    }
    fetchReservation()
  }, [session, fetchReservation, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Réservation non trouvée</div>
      </div>
    )
  }

  const total = reservation.horaire.trajet.tarifBase * reservation.nombrePlaces

  const handleDownloadTicket = async () => {
    setDownloading(true)
    try {
      console.log('📥 Téléchargement du billet pour:', params.id)
      const response = await fetch(`/api/client/reservations/${params.id}/ticket`)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Erreur API:', errorData)
        throw new Error(errorData.error || 'Erreur lors du téléchargement du billet')
      }

      const blob = await response.blob()
      console.log('✅ PDF reçu, taille:', blob.size, 'bytes')
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `billet-${reservation.id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      console.log('✅ Téléchargement terminé')
    } catch (error: any) {
      console.error('❌ Erreur téléchargement:', error)
      alert(error.message || 'Erreur lors du téléchargement du billet')
    } finally {
      setDownloading(false)
    }
  }

  const handleCancelReservation = async () => {
    setCancelling(true)
    try {
      const response = await fetch(`/api/client/reservations/${params.id}/annuler`, {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setCancelResult(data)
        fetchReservation()
      } else {
        alert(data.error || 'Une erreur est survenue')
        setShowCancelModal(false)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue')
      setShowCancelModal(false)
    } finally {
      setCancelling(false)
    }
  }

  const calculateRefundInfo = () => {
    const dateDepart = new Date(reservation.horaire.dateDepart)
    const maintenant = new Date()
    const heuresAvantDepart = (dateDepart.getTime() - maintenant.getTime()) / (1000 * 60 * 60)

    if (heuresAvantDepart >= 48) {
      return { pourcentage: 90, condition: 'Plus de 48h avant le départ : remboursement de 90%' }
    } else if (heuresAvantDepart >= 24) {
      return { pourcentage: 70, condition: 'Entre 24h et 48h avant le départ : remboursement de 70%' }
    } else if (heuresAvantDepart >= 6) {
      return { pourcentage: 50, condition: 'Entre 6h et 24h avant le départ : remboursement de 50%' }
    } else if (heuresAvantDepart > 0) {
      return { pourcentage: 20, condition: 'Moins de 6h avant le départ : remboursement de 20%' }
    } else {
      return { pourcentage: 0, condition: 'Départ déjà passé : aucun remboursement' }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Détails de la réservation</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Réservation #{reservation.id.slice(0, 8)}</h2>
              <p className="text-gray-600">
                Créée le {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full font-semibold ${
              reservation.statut === 'CONFIRMEE' ? 'bg-green-100 text-green-800' :
              reservation.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {reservation.statut === 'CONFIRMEE' ? 'Confirmée' :
               reservation.statut === 'EN_ATTENTE' ? 'En attente' :
               'Annulée'}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Trajet
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-xl font-bold mb-2">
                  {reservation.horaire.trajet.villeDepart} → {reservation.horaire.trajet.villeArrivee}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Distance:</span> {reservation.horaire.trajet.distance} km
                  </div>
                  <div>
                    <span className="font-medium">Durée:</span> {Math.floor(reservation.horaire.trajet.dureeEstimee / 60)}h {reservation.horaire.trajet.dureeEstimee % 60}min
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Horaires
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div>
                  <span className="font-medium">Départ:</span>{' '}
                  {new Date(reservation.horaire.dateDepart).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div>
                  <span className="font-medium">Arrivée estimée:</span>{' '}
                  {new Date(reservation.horaire.dateArrivee).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Détails
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Nombre de places:</span>
                  <span className="font-semibold">{reservation.nombrePlaces}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tarif unitaire:</span>
                  <span className="font-semibold">
                    {reservation.horaire.trajet.tarifBase.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    {total.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {reservation.statut === 'CONFIRMEE' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-blue-600" />
              Votre billet
            </h3>
            <p className="text-gray-600 mb-4">
              Votre réservation est confirmée. Vous pouvez télécharger votre billet ou le présenter sur votre téléphone.
            </p>
            <button 
              onClick={handleDownloadTicket}
              disabled={downloading}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition border border-blue-700 shadow-sm windows-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              {downloading ? 'Téléchargement...' : 'Télécharger le billet'}
            </button>
          </div>
        )}

        {(reservation.statut === 'CONFIRMEE' || reservation.statut === 'EN_ATTENTE') && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              Annuler la réservation
            </h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                <div>
                  <p className="text-sm text-yellow-700 font-medium mb-2">
                    Conditions d'annulation :
                  </p>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Plus de 48h avant : remboursement de 90%</li>
                    <li>• Entre 24h et 48h : remboursement de 70%</li>
                    <li>• Entre 6h et 24h : remboursement de 50%</li>
                    <li>• Moins de 6h : remboursement de 20%</li>
                  </ul>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCancelModal(true)}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 hover:bg-red-700 transition border border-red-700 shadow-sm windows-button"
            >
              <XCircle className="w-5 h-5" />
              Annuler ma réservation
            </button>
          </div>
        )}

        {/* Modal de confirmation d'annulation */}
        {showCancelModal && !cancelResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Confirmer l&apos;annulation
              </h2>
              <p className="text-gray-600 mb-4">
                Êtes-vous sûr de vouloir annuler cette réservation ?
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  {calculateRefundInfo().condition}
                </p>
                <p className="text-lg font-bold text-blue-600">
                  Montant remboursé : {Math.round(total * calculateRefundInfo().pourcentage / 100).toLocaleString('fr-FR')} FCFA
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Frais d&apos;annulation : {Math.round(total * (100 - calculateRefundInfo().pourcentage) / 100).toLocaleString('fr-FR')} FCFA
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelReservation}
                  disabled={cancelling}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400"
                >
                  {cancelling ? 'Annulation...' : 'Confirmer l&apos;annulation'}
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelling}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Retour
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de résultat d'annulation */}
        {cancelResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Réservation annulée
                </h2>
                <p className="text-gray-600">
                  Votre réservation a été annulée avec succès
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Montant initial :</span>
                  <span className="font-medium">{cancelResult.remboursement.montantTotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frais d&apos;annulation :</span>
                  <span className="font-medium text-red-600">-{cancelResult.remboursement.fraisAnnulation.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Montant remboursé :</span>
                  <span className="text-green-600">{cancelResult.remboursement.montantRembourse.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {cancelResult.remboursement.conditionAnnulation}
              </p>
              <button
                onClick={() => router.push('/client/dashboard')}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Retour au dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


