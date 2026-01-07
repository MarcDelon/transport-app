'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { MapPin, Calendar, Users, Ticket, Download } from 'lucide-react'

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

  useEffect(() => {
    if (!session) {
      router.push('/connexion')
      return
    }
    fetchReservation()
  }, [params.id, session, router])

  const fetchReservation = async () => {
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
  }

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
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition border border-blue-700 shadow-sm windows-button">
              <Download className="w-5 h-5" />
              Télécharger le billet
            </button>
          </div>
        )}
      </div>
    </div>
  )
}


