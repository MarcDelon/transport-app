'use client'

import { useState, useEffect } from 'react'
import { Bus, User, X, CheckCircle2, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Siege {
  numero: number
  disponible: boolean
  statut: 'disponible' | 'occupe' | 'selectionne'
}

interface Configuration {
  nombreRangees: number
  siegesParRangee: number
  alleePosition: number
}

interface BusSeatSelectorProps {
  horaireId: string
  nombrePlacesMax: number
  onSiegesSelected: (sieges: number[]) => void
  className?: string
}

export default function BusSeatSelector({
  horaireId,
  nombrePlacesMax,
  onSiegesSelected,
  className = ''
}: BusSeatSelectorProps) {
  const [sieges, setSieges] = useState<Siege[]>([])
  const [configuration, setConfiguration] = useState<Configuration>({
    nombreRangees: 10,
    siegesParRangee: 4,
    alleePosition: 2
  })
  const [siegesSelectionnes, setSiegesSelectionnes] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statistiques, setStatistiques] = useState({
    capaciteTotal: 0,
    placesDisponibles: 0,
    placesOccupees: 0,
    tauxOccupation: 0
  })

  useEffect(() => {
    fetchSieges()
  }, [horaireId])

  useEffect(() => {
    onSiegesSelected(siegesSelectionnes)
  }, [siegesSelectionnes])

  const fetchSieges = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/horaires/${horaireId}/sieges`)
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des sièges')
      }

      const data = await response.json()
      setSieges(data.sieges)
      setConfiguration(data.configuration)
      setStatistiques(data.statistiques)
      setError(null)
    } catch (err) {
      console.error('Erreur:', err)
      setError('Impossible de charger les sièges')
    } finally {
      setLoading(false)
    }
  }

  const toggleSiege = (numeroSiege: number) => {
    const siege = sieges.find(s => s.numero === numeroSiege)
    if (!siege || !siege.disponible) return

    setSiegesSelectionnes(prev => {
      if (prev.includes(numeroSiege)) {
        // Désélectionner
        return prev.filter(n => n !== numeroSiege)
      } else {
        // Vérifier si on n'a pas dépassé le nombre max
        if (prev.length >= nombrePlacesMax) {
          return prev
        }
        // Sélectionner
        return [...prev, numeroSiege].sort((a, b) => a - b)
      }
    })
  }

  const getSiegeStatut = (numeroSiege: number): 'disponible' | 'occupe' | 'selectionne' => {
    if (siegesSelectionnes.includes(numeroSiege)) return 'selectionne'
    const siege = sieges.find(s => s.numero === numeroSiege)
    return siege?.disponible ? 'disponible' : 'occupe'
  }

  const getSiegeColor = (statut: string) => {
    switch (statut) {
      case 'disponible':
        return 'bg-green-100 hover:bg-green-200 border-green-300 text-green-800'
      case 'occupe':
        return 'bg-gray-300 border-gray-400 text-gray-600 cursor-not-allowed'
      case 'selectionne':
        return 'bg-blue-500 border-blue-600 text-white'
      default:
        return 'bg-gray-100 border-gray-300'
    }
  }

  const renderSiege = (numeroSiege: number) => {
    const statut = getSiegeStatut(numeroSiege)
    const estDisponible = statut === 'disponible' || statut === 'selectionne'

    return (
      <motion.button
        key={numeroSiege}
        whileHover={estDisponible ? { scale: 1.05 } : {}}
        whileTap={estDisponible ? { scale: 0.95 } : {}}
        onClick={() => toggleSiege(numeroSiege)}
        disabled={statut === 'occupe'}
        className={`
          relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 
          flex items-center justify-center font-semibold text-xs sm:text-sm
          transition-all duration-200 shadow-sm
          ${getSiegeColor(statut)}
          ${estDisponible ? 'hover:shadow-md' : ''}
        `}
        title={`Siège ${numeroSiege} - ${statut === 'occupe' ? 'Occupé' : statut === 'selectionne' ? 'Sélectionné' : 'Disponible'}`}
      >
        {statut === 'selectionne' ? (
          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : statut === 'occupe' ? (
          <User className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <span>{numeroSiege}</span>
        )}
      </motion.button>
    )
  }

  const renderBusLayout = () => {
    const { nombreRangees, siegesParRangee, alleePosition } = configuration
    const rangees: JSX.Element[] = []

    let siegeIndex = 1

    for (let rangee = 0; rangee < nombreRangees; rangee++) {
      const siegesRangee: JSX.Element[] = []

      for (let position = 0; position < siegesParRangee; position++) {
        // Ajouter l'allée au milieu
        if (position === alleePosition) {
          siegesRangee.push(
            <div key={`allee-${rangee}-${position}`} className="w-8 sm:w-10" />
          )
        }

        if (siegeIndex <= sieges.length) {
          siegesRangee.push(renderSiege(siegeIndex))
          siegeIndex++
        }
      }

      rangees.push(
        <div key={`rangee-${rangee}`} className="flex items-center justify-center gap-2 mb-2">
          {siegesRangee}
        </div>
      )
    }

    return rangees
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Chargement du plan du bus...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <X className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 font-medium">{error}</p>
        <button
          onClick={fetchSieges}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 sm:p-6 ${className}`}>
      {/* En-tête avec icône de bus */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Bus className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Sélectionnez vos sièges
            </h3>
            <p className="text-sm text-gray-600">
              {siegesSelectionnes.length} / {nombrePlacesMax} place(s) sélectionnée(s)
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-700">
            {statistiques.placesDisponibles}
          </div>
          <div className="text-xs text-green-600">Disponibles</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xl sm:text-2xl font-bold text-gray-700">
            {statistiques.placesOccupees}
          </div>
          <div className="text-xs text-gray-600">Occupées</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-700">
            {statistiques.tauxOccupation}%
          </div>
          <div className="text-xs text-blue-600">Taux</div>
        </div>
      </div>

      {/* Légende */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-100 border-2 border-green-300 rounded"></div>
          <span className="text-gray-700">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 border-2 border-blue-600 rounded"></div>
          <span className="text-gray-700">Sélectionné</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 border-2 border-gray-400 rounded"></div>
          <span className="text-gray-700">Occupé</span>
        </div>
      </div>

      {/* Plan du bus */}
      <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-4 sm:p-6 border-2 border-gray-200 overflow-x-auto">
        {/* Avant du bus */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-800 text-white px-6 py-2 rounded-t-full text-xs sm:text-sm font-semibold">
            AVANT
          </div>
        </div>

        {/* Sièges */}
        <div className="flex flex-col items-center">
          {renderBusLayout()}
        </div>

        {/* Arrière du bus */}
        <div className="flex justify-center mt-4">
          <div className="bg-gray-800 text-white px-6 py-2 rounded-b-full text-xs sm:text-sm font-semibold">
            ARRIÈRE
          </div>
        </div>
      </div>

      {/* Sièges sélectionnés */}
      <AnimatePresence>
        {siegesSelectionnes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-blue-900 mb-1">
                  Sièges sélectionnés :
                </p>
                <div className="flex flex-wrap gap-2">
                  {siegesSelectionnes.map(numero => (
                    <span
                      key={numero}
                      className="inline-flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {numero}
                      <button
                        onClick={() => toggleSiege(numero)}
                        className="hover:bg-blue-600 rounded-full p-0.5 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message si limite atteinte */}
      {siegesSelectionnes.length >= nombrePlacesMax && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
          <p className="text-sm text-yellow-800">
            Vous avez atteint le nombre maximum de places ({nombrePlacesMax})
          </p>
        </div>
      )}
    </div>
  )
}
