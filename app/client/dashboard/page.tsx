'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Ticket, Calendar, DollarSign, User, Plus, Settings } from 'lucide-react'

interface Reservation {
  id: string
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

export default function ClientDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion')
      return
    }

    if (session?.user?.role === 'ADMIN') {
      router.push('/admin/dashboard')
      return
    }

    if (session) {
      fetchReservations()
    }
  }, [session, status, router])

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/client/reservations')
      const data = await response.json()
      
      // S'assurer que data est toujours un tableau
      if (Array.isArray(data)) {
        setReservations(data)
      } else {
        console.error('Les données reçues ne sont pas un tableau:', data)
        setReservations([])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error)
      setReservations([])
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    )
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

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'CONFIRMEE':
        return 'Confirmée'
      case 'EN_ATTENTE':
        return 'En attente'
      case 'ANNULEE':
        return 'Annulée'
      default:
        return statut
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Mon Compte
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Bienvenue, {session?.user?.name}
          </p>
        </div>

        {/* Actions rapides */}
        <div className="mb-4 sm:mb-6 md:mb-8 flex flex-wrap gap-3">
          <Link
            href="/reservation"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 hover:bg-blue-700 transition border border-blue-700 shadow-sm windows-button text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Nouvelle réservation
          </Link>
          <Link
            href="/client/profil"
            className="inline-flex items-center gap-2 bg-white text-gray-700 px-4 sm:px-6 py-2 sm:py-3 hover:bg-gray-50 transition border border-gray-300 shadow-sm windows-button text-sm sm:text-base"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            Mon profil
          </Link>
        </div>

        {/* Mes réservations */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              Mes Réservations
            </h2>
          </div>

          {reservations.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Ticket className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Aucune réservation pour le moment</p>
              <Link
                href="/reservation"
                className="text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium"
              >
                Faire une réservation
              </Link>
            </div>
          ) : (
            <>
              {/* Version mobile - Cartes */}
              <div className="block md:hidden space-y-4">
                {reservations.map((reservation) => (
                  <div key={reservation.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm mb-1">
                          {reservation.horaire.trajet.villeDepart} → {reservation.horaire.trajet.villeArrivee}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(reservation.horaire.dateDepart).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatutColor(reservation.statut)}`}>
                        {getStatutLabel(reservation.statut)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{reservation.nombrePlaces} place(s)</span>
                      <span>{new Date(reservation.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <Link
                      href={`/client/reservations/${reservation.id}`}
                      className="block w-full text-center bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition border border-blue-700 shadow-sm windows-button text-sm"
                    >
                      Voir les détails
                    </Link>
                  </div>
                ))}
              </div>

              {/* Version desktop - Tableau */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
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
                      Date de réservation
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
                          {reservation.horaire.trajet.villeDepart} → {reservation.horaire.trajet.villeArrivee}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(reservation.horaire.dateDepart).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {reservation.nombrePlaces}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutColor(reservation.statut)}`}>
                          {getStatutLabel(reservation.statut)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/client/reservations/${reservation.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Voir détails
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}


