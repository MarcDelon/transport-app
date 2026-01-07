'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { Ticket, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Reservation {
  id: string
  user: {
    nom: string
    prenom: string
    email: string
  }
  horaire: {
    dateDepart: string
    trajet: {
      villeDepart: string
      villeArrivee: string
    }
  }
  nombrePlaces: number
  statut: string
  createdAt: string
}

export default function AdminReservationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('')

  const fetchReservations = useCallback(async () => {
    try {
      const url = filter
        ? `/api/admin/reservations?statut=${filter}`
        : '/api/admin/reservations'
      const response = await fetch(url)
      const data = await response.json()
      setReservations(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion')
      return
    }

    if (session?.user?.role !== 'ADMIN') {
      router.push('/client/dashboard')
      return
    }

    fetchReservations()
  }, [session, status, router, filter, fetchReservations])

  const updateStatut = async (reservationId: string, nouveauStatut: string) => {
    try {
      const response = await fetch(`/api/admin/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: nouveauStatut }),
      })

      if (response.ok) {
        fetchReservations()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    )
  }

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'CONFIRMEE':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'EN_ATTENTE':
        return <Clock className="w-5 h-5 text-yellow-600" />
      case 'ANNULEE':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'CONFIRMEE':
        return 'bg-green-100 text-green-800'
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800'
      case 'ANNULEE':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Réservations
          </h1>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('')}
              className={`px-4 py-2 border ${
                filter === '' ? 'bg-blue-600 text-white border-blue-700 shadow-sm windows-button' : 'bg-gray-200 text-gray-700 border-gray-400 shadow-sm windows-button'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter('EN_ATTENTE')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'EN_ATTENTE' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setFilter('CONFIRMEE')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'CONFIRMEE' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Confirmées
            </button>
            <button
              onClick={() => setFilter('ANNULEE')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'ANNULEE' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Annulées
            </button>
          </div>
        </div>

        {/* Liste des réservations */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trajet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de départ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Places
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.user ? `${reservation.user.prenom} ${reservation.user.nom}` : 'Utilisateur supprimé'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.user ? reservation.user.email : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {reservation.horaire.trajet.villeDepart} → {reservation.horaire.trajet.villeArrivee}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(reservation.horaire.dateDepart).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.nombrePlaces}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${getStatutColor(reservation.statut)}`}>
                        {getStatutIcon(reservation.statut)}
                        {reservation.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {reservation.statut === 'EN_ATTENTE' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateStatut(reservation.id, 'CONFIRMEE')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => updateStatut(reservation.id, 'ANNULEE')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Annuler
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}


