'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, Users, DollarSign, Search, Bus, Clock, ArrowRight, ChevronDown, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

interface Trajet {
  id: string
  villeDepart: string
  villeArrivee: string
  distance: number
  dureeEstimee: number
  tarifBase: number
}

interface Horaire {
  id: string
  dateDepart: string
  dateArrivee: string
  trajet: Trajet
  placesDisponibles: number
}

export default function ReservationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useLanguage()
  
  // États pour les villes disponibles
  const [villesDepart, setVillesDepart] = useState<string[]>([])
  const [villesArrivee, setVillesArrivee] = useState<string[]>([])
  const [loadingVilles, setLoadingVilles] = useState(true)
  
  // États pour la sélection
  const [villeDepart, setVilleDepart] = useState('')
  const [villeArrivee, setVilleArrivee] = useState('')
  const [date, setDate] = useState('')
  
  // États pour les résultats
  const [horaires, setHoraires] = useState<Horaire[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedHoraire, setSelectedHoraire] = useState<string | null>(null)
  
  // États pour les dropdowns
  const [showDepartDropdown, setShowDepartDropdown] = useState(false)
  const [showArriveeDropdown, setShowArriveeDropdown] = useState(false)

  // Charger les villes disponibles au montage
  useEffect(() => {
    const fetchVilles = async () => {
      try {
        const response = await fetch('/api/villes')
        if (response.ok) {
          const data = await response.json()
          setVillesDepart(data.villesDepart || [])
          setVillesArrivee(data.villesArrivee || [])
        }
      } catch (error) {
        console.error('Erreur lors du chargement des villes:', error)
      } finally {
        setLoadingVilles(false)
      }
    }
    fetchVilles()
  }, [])

  // Rediriger vers la connexion si non connecté
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion?redirect=/reservation')
    }
  }, [status, router])

  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDepartDropdown(false)
      setShowArriveeDropdown(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Rechercher automatiquement quand tous les champs sont remplis
  useEffect(() => {
    if (villeDepart && villeArrivee && date) {
      handleSearch()
    }
  }, [villeDepart, villeArrivee, date])

  const handleSearch = async () => {
    if (!villeDepart || !villeArrivee || !date) return

    setLoading(true)
    setHasSearched(true)
    setSelectedHoraire(null)

    try {
      const response = await fetch(
        `/api/trajets/search?depart=${encodeURIComponent(villeDepart)}&arrivee=${encodeURIComponent(villeArrivee)}&date=${date}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setHoraires(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReserver = (horaireId: string) => {
    if (!session) {
      router.push('/connexion?redirect=/reservation')
      return
    }
    router.push(`/reservation/${horaireId}`)
  }

  const filteredVillesDepart = villesDepart.filter(v => 
    v.toLowerCase().includes(villeDepart.toLowerCase())
  )

  const filteredVillesArrivee = villesArrivee.filter(v => 
    v.toLowerCase().includes(villeArrivee.toLowerCase()) && v !== villeDepart
  )

  // Afficher un message si non connecté
  if (status === 'unauthenticated' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('auth.required')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{t('auth.requiredMessage')}</p>
          <Link
            href="/connexion?redirect=/reservation"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            {t('nav.login')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-x-hidden w-full">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 md:py-16 overflow-hidden w-full">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-blue-800/60"></div>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto w-full px-4"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {t('reservation.title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-100">
              {t('reservation.subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Formulaire de recherche */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-8 border border-gray-100 dark:border-gray-700 w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full">
            {/* Ville de départ */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <MapPin className="w-4 h-4 inline mr-2 text-blue-600" />
                {t('search.departure')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={villeDepart}
                  onChange={(e) => {
                    setVilleDepart(e.target.value)
                    setShowDepartDropdown(true)
                    setShowArriveeDropdown(false)
                  }}
                  onFocus={() => {
                    setShowDepartDropdown(true)
                    setShowArriveeDropdown(false)
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowDepartDropdown(false), 150)
                  }}
                  placeholder="Tapez ou sélectionnez une ville"
                  className={`w-full px-4 py-3 pr-10 border-2 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${
                    villeDepart && villesDepart.includes(villeDepart)
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                <ChevronDown 
                  className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform cursor-pointer ${showDepartDropdown ? 'rotate-180' : ''}`}
                  onClick={() => {
                    setShowDepartDropdown(!showDepartDropdown)
                    setShowArriveeDropdown(false)
                  }}
                />
                
                {showDepartDropdown && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-hidden">
                    <div className="overflow-y-auto max-h-60">
                      {loadingVilles ? (
                        <div className="p-4 text-center text-gray-500">Chargement...</div>
                      ) : filteredVillesDepart.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">Aucune ville trouvée</div>
                      ) : (
                        filteredVillesDepart.map((ville) => (
                          <button
                            key={ville}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault()
                              setVilleDepart(ville)
                              setShowDepartDropdown(false)
                              if (villeArrivee === ville) setVilleArrivee('')
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between ${
                              villeDepart === ville ? 'bg-blue-50 text-blue-600' : ''
                            }`}
                          >
                            <span>{ville}</span>
                            {villeDepart === ville && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Ville d'arrivée */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2 text-green-600" />
                Ville d&apos;arrivée
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={villeArrivee}
                  onChange={(e) => {
                    setVilleArrivee(e.target.value)
                    setShowArriveeDropdown(true)
                    setShowDepartDropdown(false)
                  }}
                  onFocus={() => {
                    setShowArriveeDropdown(true)
                    setShowDepartDropdown(false)
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowArriveeDropdown(false), 150)
                  }}
                  placeholder="Tapez ou sélectionnez une ville"
                  className={`w-full px-4 py-3 pr-10 border-2 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-green-500 text-base ${
                    villeArrivee && villesArrivee.includes(villeArrivee)
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                <ChevronDown 
                  className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform cursor-pointer ${showArriveeDropdown ? 'rotate-180' : ''}`}
                  onClick={() => {
                    setShowArriveeDropdown(!showArriveeDropdown)
                    setShowDepartDropdown(false)
                  }}
                />
                
                {showArriveeDropdown && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-hidden">
                    <div className="overflow-y-auto max-h-60">
                      {loadingVilles ? (
                        <div className="p-4 text-center text-gray-500">Chargement...</div>
                      ) : filteredVillesArrivee.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">Aucune ville trouvée</div>
                      ) : (
                        filteredVillesArrivee.map((ville) => (
                          <button
                            key={ville}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault()
                              setVilleArrivee(ville)
                              setShowArriveeDropdown(false)
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-green-50 flex items-center justify-between ${
                              villeArrivee === ville ? 'bg-green-50 text-green-600' : ''
                            }`}
                          >
                            <span>{ville}</span>
                            {villeArrivee === ville && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Date de voyage */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2 text-purple-600" />
                Date de voyage
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-purple-500 text-base ${
                  date 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Indicateur de progression */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full transition ${villeDepart ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`w-12 h-1 rounded transition ${villeDepart && villeArrivee ? 'bg-green-600' : 'bg-gray-200'}`} />
            <div className={`w-3 h-3 rounded-full transition ${villeArrivee ? 'bg-green-600' : 'bg-gray-300'}`} />
            <div className={`w-12 h-1 rounded transition ${villeDepart && villeArrivee && date ? 'bg-purple-600' : 'bg-gray-200'}`} />
            <div className={`w-3 h-3 rounded-full transition ${date ? 'bg-purple-600' : 'bg-gray-300'}`} />
          </div>

          {/* Message d'aide */}
          {(!villeDepart || !villeArrivee || !date) && (
            <p className="text-center text-gray-500 text-sm mt-4">
              {!villeDepart 
                ? '👆 Sélectionnez votre ville de départ' 
                : !villeArrivee 
                  ? '👆 Sélectionnez votre ville d\'arrivée'
                  : '👆 Choisissez votre date de voyage'}
            </p>
          )}
        </motion.div>

        {/* Loader */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}

        {/* Aucun résultat */}
        {hasSearched && !loading && horaires.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300"
          >
            <Bus className="w-20 h-20 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600 font-medium">Aucun horaire disponible</p>
            <p className="text-gray-500 mt-2">
              Aucun trajet n&apos;est disponible pour {villeDepart} → {villeArrivee} le {new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <p className="text-gray-400 text-sm mt-4">Essayez une autre date ou un autre itinéraire</p>
          </motion.div>
        )}

        {/* Liste des horaires */}
        {!loading && horaires.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-600" />
                Horaires disponibles
              </h2>
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                {horaires.length} trajet{horaires.length > 1 ? 's' : ''} trouvé{horaires.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid gap-4">
              {horaires.map((horaire, index) => (
                <motion.div
                  key={horaire.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedHoraire(horaire.id)}
                  className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all duration-200 border-2 ${
                    selectedHoraire === horaire.id 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-transparent hover:border-gray-200 hover:shadow-lg'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Infos horaire */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        {/* Heure de départ */}
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {new Date(horaire.dateDepart).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-sm text-gray-500">{horaire.trajet.villeDepart}</div>
                        </div>

                        {/* Ligne de trajet */}
                        <div className="flex-1 flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                          <div className="flex-1 border-t-2 border-dashed border-gray-300 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                              <span className="text-xs text-gray-500">
                                {Math.floor(horaire.trajet.dureeEstimee / 60)}h{horaire.trajet.dureeEstimee % 60 > 0 ? ` ${horaire.trajet.dureeEstimee % 60}min` : ''}
                              </span>
                            </div>
                          </div>
                          <div className="w-3 h-3 rounded-full bg-green-600"></div>
                        </div>

                        {/* Heure d'arrivée */}
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {new Date(horaire.dateArrivee).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-sm text-gray-500">{horaire.trajet.villeArrivee}</div>
                        </div>
                      </div>

                      {/* Infos supplémentaires */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{horaire.trajet.distance} km</span>
                        </div>
                        <div className={`flex items-center gap-1 ${horaire.placesDisponibles < 5 ? 'text-red-600' : 'text-green-600'}`}>
                          <Users className="w-4 h-4" />
                          <span className="font-medium">{horaire.placesDisponibles} places disponibles</span>
                        </div>
                      </div>
                    </div>

                    {/* Prix et bouton */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          {horaire.trajet.tarifBase.toLocaleString('fr-FR')}
                        </div>
                        <div className="text-sm text-gray-500">FCFA / personne</div>
                      </div>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReserver(horaire.id)
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition flex items-center gap-2 font-semibold shadow-md"
                      >
                        Réserver
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Section d'aide si pas de recherche */}
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: MapPin, title: '50+ Destinations', desc: 'Voyagez vers de nombreuses villes du Sénégal', color: 'blue' },
              { icon: Clock, title: 'Horaires Flexibles', desc: 'Plusieurs départs par jour pour chaque trajet', color: 'purple' },
              { icon: DollarSign, title: 'Prix Compétitifs', desc: 'Les meilleurs tarifs du marché garantis', color: 'green' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition"
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-full bg-${item.color}-100 flex items-center justify-center`}>
                  <item.icon className={`w-7 h-7 text-${item.color}-600`} />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
