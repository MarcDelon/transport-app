'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Truck, Calendar, Users, MapPin, Clock, TrendingUp } from 'lucide-react'

interface Trajet {
  id: string
  dateDepart: string
  dateArrivee: string
  statut: string
  trajet: {
    villeDepart: string
    villeArrivee: string
    distance: number
    dureeEstimee: number
  }
  vehicule: {
    numeroImmatriculation: string
    marque: string
    modele: string
    capaciteMaximale: number
  }
  totalPassagers: number
  capacite: number
  tauxRemplissage: number
}

export default function ConducteurDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [trajets, setTrajets] = useState<Trajet[]>([])
  const [loading, setLoading] = useState(true)
  const [periode, setPeriode] = useState<'jour' | 'semaine' | 'mois'>('jour')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/connexion')
      return
    }

    if (session?.user?.role && session.user.role !== 'CONDUCTEUR') {
      router.push('/')
      return
    }

    if (session?.user?.role === 'CONDUCTEUR') {
      fetchTrajets()
    }
  }, [status, session?.user?.role, periode, date])

  const fetchTrajets = async () => {
    try {
      const response = await fetch(`/api/conducteur/trajets?date=${date}&periode=${periode}`)
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setTrajets(data)
      } else {
        console.error('Données invalides:', data)
        setTrajets([])
      }
    } catch (error) {
      console.error('Erreur:', error)
      setTrajets([])
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

  const trajetsAujourdhui = trajets.filter(t => {
    const dateTrajet = new Date(t.dateDepart).toDateString()
    const aujourdhui = new Date().toDateString()
    return dateTrajet === aujourdhui
  })

  const prochainTrajet = trajetsAujourdhui.find(t => new Date(t.dateDepart) > new Date())

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'TERMINE':
        return 'bg-green-100 text-green-800'
      case 'EN_COURS':
        return 'bg-blue-100 text-blue-800'
      case 'ANNULE':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'TERMINE':
        return 'Terminé'
      case 'EN_COURS':
        return 'En cours'
      case 'ANNULE':
        return 'Annulé'
      default:
        return 'Programmé'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="w-8 h-8 text-blue-600" />
            Tableau de bord conducteur
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenue, {session?.user?.name}
          </p>
        </div>

        {/* Prochain trajet */}
        {prochainTrajet && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 mb-6 text-white">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Prochain trajet
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-blue-200 text-sm mb-1">Trajet</p>
                <p className="text-xl font-bold">
                  {prochainTrajet.trajet.villeDepart} → {prochainTrajet.trajet.villeArrivee}
                </p>
              </div>
              <div>
                <p className="text-blue-200 text-sm mb-1">Départ</p>
                <p className="text-lg font-semibold">
                  {new Date(prochainTrajet.dateDepart).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <p className="text-blue-200 text-sm mb-1">Passagers</p>
                <p className="text-lg font-semibold">
                  {prochainTrajet.totalPassagers} / {prochainTrajet.capacite}
                </p>
              </div>
            </div>
            <Link
              href={`/conducteur/trajets/${prochainTrajet.id}`}
              className="mt-4 inline-block bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
            >
              Voir les détails
            </Link>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Trajets aujourd&apos;hui</h3>
                <p className="text-3xl font-bold text-gray-900">{trajetsAujourdhui.length}</p>
              </div>
              <Calendar className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total passagers</p>
                <p className="text-3xl font-bold text-gray-900">
                  {trajets.reduce((sum, t) => sum + t.totalPassagers, 0)}
                </p>
              </div>
              <Users className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Taux de remplissage moyen</p>
                <p className="text-3xl font-bold text-gray-900">
                  {trajets.length > 0
                    ? Math.round(trajets.reduce((sum, t) => sum + t.tauxRemplissage, 0) / trajets.length)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Période
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setPeriode('jour')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    periode === 'jour'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Jour
                </button>
                <button
                  onClick={() => setPeriode('semaine')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    periode === 'semaine'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Semaine
                </button>
                <button
                  onClick={() => setPeriode('mois')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    periode === 'mois'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Mois
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des trajets */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Mes trajets</h2>

          {trajets.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun trajet pour cette période</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trajets.map((trajet) => (
                <Link
                  key={trajet.id}
                  href={`/conducteur/trajets/${trajet.id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="text-lg font-semibold">
                        {trajet.trajet.villeDepart} → {trajet.trajet.villeArrivee}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(trajet.statut)}`}>
                      {getStatutLabel(trajet.statut)}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Départ</p>
                      <p className="font-medium">
                        {new Date(trajet.dateDepart).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Véhicule</p>
                      <p className="font-medium">
                        {trajet.vehicule.marque} {trajet.vehicule.modele}
                      </p>
                      <p className="text-xs text-gray-500">{trajet.vehicule.numeroImmatriculation}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Passagers</p>
                      <p className="font-medium">
                        {trajet.totalPassagers} / {trajet.capacite}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Remplissage</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              trajet.tauxRemplissage >= 80 ? 'bg-green-600' :
                              trajet.tauxRemplissage >= 50 ? 'bg-blue-600' :
                              'bg-orange-600'
                            }`}
                            style={{ width: `${trajet.tauxRemplissage}%` }}
                          />
                        </div>
                        <span className="font-medium text-sm">{trajet.tauxRemplissage}%</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
