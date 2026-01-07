'use client'

import { useState, useEffect } from 'react'
import { MapPin, Clock, DollarSign } from 'lucide-react'
import Link from 'next/link'

interface Trajet {
  id: string
  villeDepart: string
  villeArrivee: string
  distance: number
  dureeEstimee: number
  tarifBase: number
  statut: string
}

export default function TrajetsPage() {
  const [trajets, setTrajets] = useState<Trajet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrajets()
  }, [])

  const fetchTrajets = async () => {
    try {
      console.log('🔍 Chargement des trajets...')
      const response = await fetch('/api/trajets')
      
      if (!response.ok) {
        console.error(`❌ Erreur HTTP: ${response.status}`)
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📦 Données reçues:', data)
      console.log(`✅ ${Array.isArray(data) ? data.length : 0} trajets reçus`)
      
      // S'assurer que data est un tableau
      if (Array.isArray(data)) {
        setTrajets(data)
        if (data.length === 0) {
          console.warn('⚠️ Aucun trajet disponible. Vérifiez que les trajets ont le statut DISPONIBLE dans la base de données.')
        }
      } else if (data && data.error) {
        // Si l'API retourne une erreur
        console.error('❌ Erreur API:', data.error)
        setTrajets([])
      } else {
        console.error('❌ Les données reçues ne sont pas un tableau:', data)
        setTrajets([])
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des trajets:', error)
      setTrajets([])
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

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 px-2">Trajets disponibles</h1>

        {trajets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
            <p className="text-sm sm:text-base text-gray-600">Aucun trajet disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {trajets.map((trajet) => (
              <div
                key={trajet.id}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  <h3 className="text-lg sm:text-xl font-semibold">
                    {trajet.villeDepart} → {trajet.villeArrivee}
                  </h3>
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>
                      Durée: {Math.floor(trajet.dureeEstimee / 60)}h {trajet.dureeEstimee % 60}min
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Distance:</span> {trajet.distance} km
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="font-semibold text-blue-600 text-base sm:text-lg">
                      {trajet.tarifBase.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                </div>
                <Link
                  href={`/reservation?depart=${trajet.villeDepart}&arrivee=${trajet.villeArrivee}`}
                  className="block w-full text-center bg-blue-600 text-white px-4 py-2.5 sm:py-2 hover:bg-blue-700 transition border border-blue-700 shadow-sm windows-button text-sm sm:text-base"
                >
                  Réserver
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


