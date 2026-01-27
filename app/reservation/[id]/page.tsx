'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { MapPin, Calendar, Users, DollarSign, User, Package, ArrowLeft } from 'lucide-react'
import BagageManager from '@/components/BagageManager'
import BusSeatSelector from '@/components/BusSeatSelector'

interface Horaire {
  id: string
  dateDepart: string
  dateArrivee: string
  trajet: {
    id: string
    villeDepart: string
    villeArrivee: string
    distance: number
    dureeEstimee: number
    tarifBase: number
  }
  placesDisponibles: number
}

export default function ReservationDetailPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const [horaire, setHoraire] = useState<Horaire | null>(null)
  const [nombrePlaces, setNombrePlaces] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [supplementBagages, setSupplementBagages] = useState(0)
  const [reservationId, setReservationId] = useState<string | null>(null)
  const [step, setStep] = useState<'details' | 'sieges' | 'confirmation'>('details')
  const [siegesSelectionnes, setSiegesSelectionnes] = useState<number[]>([])

  const fetchHoraire = useCallback(async () => {
    try {
      const response = await fetch(`/api/horaires/${params.id}`)
      const data = await response.json()
      setHoraire(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    if (!session) {
      router.push('/connexion?redirect=/reservation/' + params.id)
      return
    }
    fetchHoraire()
  }, [session, router, fetchHoraire, params.id])

  const handleContinuerVersSelection = () => {
    if (nombrePlaces < 1 || nombrePlaces > horaire!.placesDisponibles) {
      alert('Nombre de places invalide')
      return
    }
    setStep('sieges')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!horaire) return

    if (nombrePlaces > horaire.placesDisponibles) {
      alert('Pas assez de places disponibles')
      return
    }

    if (siegesSelectionnes.length !== nombrePlaces) {
      alert(`Veuillez sélectionner exactement ${nombrePlaces} siège(s)`)
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          horaireId: horaire.id,
          nombrePlaces,
          sieges: siegesSelectionnes,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('❌ Erreur lors de la création de la réservation:', data)
        alert(data.error || 'Une erreur est survenue lors de la création de la réservation')
        return
      }

      console.log('✅ Réservation créée avec succès:', data.reservationId)
      router.push(`/client/reservations/${data.reservationId}`)
    } catch (error) {
      console.error('❌ Erreur lors de la création de la réservation:', error)
      alert('Une erreur est survenue. Vérifiez la console pour plus de détails.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    )
  }

  if (!horaire) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Horaire non trouvé</div>
      </div>
    )
  }

  const total = horaire.trajet.tarifBase * nombrePlaces

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="flex items-center gap-4 mb-4 sm:mb-6 md:mb-8">
          {step === 'sieges' && (
            <button
              onClick={() => setStep('details')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold">
            {step === 'details' ? 'Finaliser la réservation' : 'Sélectionnez vos sièges'}
          </h1>
        </div>

        {step === 'details' ? (
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Détails du trajet */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Détails du trajet</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">
                  {horaire.trajet.villeDepart} → {horaire.trajet.villeArrivee}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>
                  {new Date(horaire.dateDepart).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div>
                <span className="font-medium">Durée:</span> {Math.floor(horaire.trajet.dureeEstimee / 60)}h {horaire.trajet.dureeEstimee % 60}min
              </div>
              <div>
                <span className="font-medium">Distance:</span> {horaire.trajet.distance} km
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>{horaire.placesDisponibles} places disponibles</span>
              </div>
            </div>
          </div>

          {/* Formulaire de réservation */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Réservation</h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de places
                </label>
                <input
                  type="number"
                  min="1"
                  max={horaire.placesDisponibles}
                  value={nombrePlaces}
                  onChange={(e) => setNombrePlaces(parseInt(e.target.value))}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  required
                />
              </div>

              <div className="border-t pt-3 sm:pt-4">
                <div className="flex justify-between mb-2 text-sm sm:text-base">
                  <span>Tarif unitaire:</span>
                  <span className="font-semibold">
                    {horaire.trajet.tarifBase.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="flex justify-between mb-2 text-sm sm:text-base">
                  <span>Nombre de places:</span>
                  <span className="font-semibold">{nombrePlaces}</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-bold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    {total.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleContinuerVersSelection}
                disabled={nombrePlaces < 1 || nombrePlaces > horaire.placesDisponibles}
                className="w-full bg-blue-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed border border-blue-700 shadow-sm windows-button text-sm sm:text-base"
              >
                Continuer vers la sélection des sièges
              </button>
            </form>
          </div>
        </div>
        ) : (
          <div className="space-y-6">
            {/* Résumé de la réservation */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">Résumé de votre réservation</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Trajet</span>
                  <p className="font-semibold">{horaire.trajet.villeDepart} → {horaire.trajet.villeArrivee}</p>
                </div>
                <div>
                  <span className="text-gray-600">Date</span>
                  <p className="font-semibold">
                    {new Date(horaire.dateDepart).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short'
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Places</span>
                  <p className="font-semibold">{nombrePlaces}</p>
                </div>
                <div>
                  <span className="text-gray-600">Total</span>
                  <p className="font-semibold text-blue-600">{total.toLocaleString('fr-FR')} FCFA</p>
                </div>
              </div>
            </div>

            {/* Sélecteur de sièges */}
            <BusSeatSelector
              horaireId={horaire.id}
              nombrePlacesMax={nombrePlaces}
              onSiegesSelected={setSiegesSelectionnes}
            />

            {/* Bouton de confirmation */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <button
                onClick={handleSubmit}
                disabled={submitting || siegesSelectionnes.length !== nombrePlaces}
                className="w-full bg-blue-600 text-white px-5 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed border border-blue-700 shadow-sm windows-button"
              >
                {submitting ? 'Traitement...' : `Confirmer la réservation (${siegesSelectionnes.length}/${nombrePlaces} sièges)`}
              </button>
              {siegesSelectionnes.length !== nombrePlaces && (
                <p className="text-center text-sm text-gray-600 mt-3">
                  Sélectionnez {nombrePlaces - siegesSelectionnes.length} siège(s) supplémentaire(s)
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


