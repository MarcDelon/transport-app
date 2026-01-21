'use client'

import { useState, useEffect } from 'react'
import { MapPin, Clock, DollarSign, ArrowRight, Bus, Search } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

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
  const [searchTerm, setSearchTerm] = useState('')
  const { t } = useLanguage()

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

  const filteredTrajets = trajets.filter(trajet => 
    trajet.villeDepart.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trajet.villeArrivee.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden w-full">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 md:py-16 overflow-hidden w-full">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-blue-800/60"></div>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto w-full px-4"
          >
            <Bus className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-yellow-400" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {t('routes.title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-100">
              {t('routes.subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Barre de recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />
          </div>
        </motion.div>

        {/* Compteur de résultats */}
        <div className="mb-6 text-center">
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
            {filteredTrajets.length} {filteredTrajets.length > 1 ? 'trajets disponibles' : 'trajet disponible'}
          </span>
        </div>

        {filteredTrajets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700"
          >
            <Bus className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">Aucun trajet trouvé</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Essayez avec une autre recherche</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
            {filteredTrajets.map((trajet, index) => (
              <motion.div
                key={trajet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 w-full"
              >
                {/* En-tête avec villes */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('routes.from')}</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{trajet.villeDepart}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('routes.to')}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{trajet.villeArrivee}</p>
                  </div>
                </div>

                {/* Infos */}
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100 dark:border-gray-700 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t('routes.duration')}</p>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {Math.floor(trajet.dureeEstimee / 60)}h {trajet.dureeEstimee % 60}min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t('routes.distance')}</p>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{trajet.distance} km</p>
                    </div>
                  </div>
                </div>

                {/* Prix et bouton */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('routes.price')}</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {trajet.tarifBase.toLocaleString('fr-FR')} <span className="text-sm">FCFA</span>
                    </p>
                  </div>
                  <Link
                    href={`/reservation?depart=${trajet.villeDepart}&arrivee=${trajet.villeArrivee}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2"
                  >
                    {t('reservation.book')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


