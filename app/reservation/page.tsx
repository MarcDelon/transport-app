'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, Users, DollarSign, Search, Bus, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Logo from '@/components/Logo'

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
  const [villeDepart, setVilleDepart] = useState('')
  const [villeArrivee, setVilleArrivee] = useState('')
  const [date, setDate] = useState('')
  const [horaires, setHoraires] = useState<Horaire[]>([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)

  // Rediriger vers la connexion si non connecté
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion?redirect=/reservation')
    }
  }, [status, router])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!villeDepart || !villeArrivee || !date) {
      alert('Veuillez remplir tous les champs')
      return
    }

    setSearching(true)
    setLoading(true)

    try {
      console.log('🔍 Recherche de trajets:', { villeDepart, villeArrivee, date })
      const response = await fetch(
        `/api/trajets/search?depart=${encodeURIComponent(villeDepart)}&arrivee=${encodeURIComponent(villeArrivee)}&date=${date}`
      )
      
      if (!response.ok) {
        console.error(`❌ Erreur HTTP: ${response.status}`)
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📦 Horaires reçus:', data)
      console.log(`✅ ${Array.isArray(data) ? data.length : 0} horaires trouvés`)
      
      setHoraires(Array.isArray(data) ? data : [])
      
      if (Array.isArray(data) && data.length === 0) {
        console.warn('⚠️ Aucun horaire trouvé. Vérifiez:')
        console.warn('   - Que les trajets existent dans la base de données')
        console.warn('   - Que des horaires sont créés pour cette date')
        console.warn('   - Que les noms de villes correspondent (avec ou sans accents)')
      }
    } catch (error) {
      console.error('❌ Erreur lors de la recherche:', error)
      alert('Une erreur est survenue lors de la recherche. Vérifiez la console pour plus de détails.')
    } finally {
      setLoading(false)
      setSearching(false)
    }
  }

  const handleReserver = (horaireId: string) => {
    if (!session) {
      router.push('/connexion?redirect=/reservation')
      return
    }
    router.push(`/reservation/${horaireId}`)
  }

  // Afficher un message si non connecté
  if (status === 'unauthenticated' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connexion requise</h2>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour réserver un billet.</p>
          <Link
            href="/connexion?redirect=/reservation"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition windows-button"
          >
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 sm:py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-blue-800/50"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="mb-4 sm:mb-6">
              <Logo showText={true} size="lg" className="justify-center text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
              Réservez votre billet
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 px-2">
              Trouvez et réservez le trajet parfait pour votre voyage avec NOVA
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        {/* Formulaire de recherche amélioré */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 md:mb-12 border border-gray-100"
        >
          <form onSubmit={handleSearch} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2 text-blue-600" />
                  Ville de départ
                </label>
                <input
                  type="text"
                  value={villeDepart}
                  onChange={(e) => setVilleDepart(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base sm:text-lg"
                  placeholder="Ex: Yaoundé"
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2 text-green-600" />
                  Ville d&#39;arrivée
                </label>
                <input
                  type="text"
                  value={villeArrivee}
                  onChange={(e) => setVilleArrivee(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base sm:text-lg"
                  placeholder="Ex: Douala"
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2 text-purple-600" />
                  Date de voyage
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base sm:text-lg"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 hover:bg-blue-700 transition flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 text-base sm:text-lg font-semibold shadow-sm border border-blue-700 windows-button"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              {loading ? 'Recherche en cours...' : 'Rechercher des trajets'}
            </motion.button>
          </form>
        </motion.div>

        {/* Résultats avec design amélioré */}
        {searching && horaires.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300"
          >
            <Bus className="w-20 h-20 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600 font-medium">Aucun trajet trouvé pour cette recherche</p>
            <p className="text-gray-500 mt-2">Essayez avec d&#39;autres villes ou dates</p>
          </motion.div>
        )}

        {horaires.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 px-2">
              <Bus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              Trajets disponibles ({horaires.length})
            </h2>
            {horaires.map((horaire, index) => (
              <motion.div
                key={horaire.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 bg-blue-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span className="font-bold text-base sm:text-lg text-gray-900">
                          {horaire.trajet.villeDepart} → {horaire.trajet.villeArrivee}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className="font-semibold text-gray-900">Départ</div>
                          <div className="text-xs">
                            {new Date(horaire.dateDepart).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <div>
                          <div className="font-semibold text-gray-900">Durée</div>
                          <div className="text-xs">
                            {Math.floor(horaire.trajet.dureeEstimee / 60)}h {horaire.trajet.dureeEstimee % 60}min
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-green-500" />
                        <div>
                          <div className="font-semibold text-gray-900">Distance</div>
                          <div className="text-xs">{horaire.trajet.distance} km</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4 text-orange-500" />
                        <div>
                          <div className="font-semibold text-gray-900">Places</div>
                          <div className={`text-xs font-bold ${horaire.placesDisponibles < 5 ? 'text-red-600' : 'text-green-600'}`}>
                            {horaire.placesDisponibles} disponibles
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-end gap-3 sm:gap-4 lg:min-w-[200px] pt-4 sm:pt-0 border-t sm:border-t-0 lg:border-t-0 border-gray-200">
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                        {horaire.trajet.tarifBase.toLocaleString('fr-FR')} FCFA
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">par personne</div>
                    </div>
                    <motion.button
                      onClick={() => handleReserver(horaire.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto lg:w-full bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm sm:text-base font-semibold shadow-sm border border-blue-700 windows-button"
                    >
                      Réserver
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Section d'aide si pas de recherche */}
        {!searching && horaires.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {[
              { icon: MapPin, title: '50+ Destinations', desc: 'Voyagez vers de nombreuses villes' },
              { icon: Clock, title: 'Horaires Flexibles', desc: 'Plusieurs départs par jour' },
              { icon: DollarSign, title: 'Prix Compétitifs', desc: 'Meilleurs tarifs garantis' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md text-center"
              >
                <item.icon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-blue-600" />
                <h3 className="font-bold text-base sm:text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
