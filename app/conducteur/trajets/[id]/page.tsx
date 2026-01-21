'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MapPin, Calendar, Users, Truck, QrCode, CheckCircle, XCircle, Package, Phone, Mail, ArrowLeft } from 'lucide-react'

interface Reservation {
  id: string
  nombrePlaces: number
  statut: string
  numeroSiege: string | null
  user: {
    nom: string
    prenom: string
    telephone: string
    email: string
  }
  bagages: Array<{
    id: string
    type: string
    poids: number
    numeroEtiquette: string
  }>
}

interface TrajetDetail {
  id: string
  dateDepart: string
  dateArrivee: string
  statut: string
  trajet: {
    villeDepart: string
    villeArrivee: string
    distance: number
    dureeEstimee: number
    tarifBase: number
  }
  vehicule: {
    numeroImmatriculation: string
    marque: string
    modele: string
    capaciteMaximale: number
  }
  reservations: Reservation[]
  totalPassagers: number
  capacite: number
  tauxRemplissage: number
}

export default function TrajetDetailPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const [trajet, setTrajet] = useState<TrajetDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showScanner, setShowScanner] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push('/connexion')
      return
    }

    if (session?.user?.role !== 'CONDUCTEUR') {
      router.push('/')
      return
    }

    fetchTrajet()
  }, [session, router, params.id])

  const fetchTrajet = async () => {
    try {
      const response = await fetch(`/api/conducteur/trajets/${params.id}`)
      if (!response.ok) {
        router.push('/conducteur/dashboard')
        return
      }
      const data = await response.json()
      setTrajet(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatut = async (nouveauStatut: string) => {
    if (!confirm(`Changer le statut du trajet en "${nouveauStatut}" ?`)) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/conducteur/trajets/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: nouveauStatut }),
      })

      if (response.ok) {
        fetchTrajet()
      } else {
        alert('Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue')
    } finally {
      setUpdating(false)
    }
  }

  const handleScanQR = async (qrData: string) => {
    try {
      const response = await fetch('/api/conducteur/validation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrData }),
      })

      const data = await response.json()
      setScanResult(data)
    } catch (error) {
      console.error('Erreur:', error)
      setScanResult({ valid: false, error: 'Erreur de validation' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    )
  }

  if (!trajet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Trajet non trouvé</div>
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

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/conducteur/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Détails du trajet</h1>
        </div>

        {/* Informations du trajet */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold">
                {trajet.trajet.villeDepart} → {trajet.trajet.villeArrivee}
              </h2>
            </div>
            <div className="flex gap-2">
              {trajet.statut !== 'EN_COURS' && trajet.statut !== 'TERMINE' && (
                <button
                  onClick={() => handleUpdateStatut('EN_COURS')}
                  disabled={updating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  Démarrer
                </button>
              )}
              {trajet.statut === 'EN_COURS' && (
                <button
                  onClick={() => handleUpdateStatut('TERMINE')}
                  disabled={updating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                >
                  Terminer
                </button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Départ</p>
              <p className="text-lg font-semibold">
                {new Date(trajet.dateDepart).toLocaleString('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Arrivée estimée</p>
              <p className="text-lg font-semibold">
                {new Date(trajet.dateArrivee).toLocaleString('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Distance</p>
              <p className="text-lg font-semibold">{trajet.trajet.distance} km</p>
            </div>
          </div>
        </div>

        {/* Véhicule */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            Véhicule assigné
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Modèle</p>
              <p className="font-medium">{trajet.vehicule.marque} {trajet.vehicule.modele}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Immatriculation</p>
              <p className="font-medium">{trajet.vehicule.numeroImmatriculation}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Capacité</p>
              <p className="font-medium">{trajet.vehicule.capaciteMaximale} places</p>
            </div>
          </div>
        </div>

        {/* Statistiques passagers */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Passagers
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total</p>
              <p className="text-3xl font-bold">{trajet.totalPassagers} / {trajet.capacite}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Réservations</p>
              <p className="text-3xl font-bold">{trajet.reservations.length}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Taux de remplissage</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      trajet.tauxRemplissage >= 80 ? 'bg-green-600' :
                      trajet.tauxRemplissage >= 50 ? 'bg-blue-600' :
                      'bg-orange-600'
                    }`}
                    style={{ width: `${trajet.tauxRemplissage}%` }}
                  />
                </div>
                <span className="text-2xl font-bold">{trajet.tauxRemplissage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scanner QR Code */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-600" />
            Validation des billets
          </h3>
          <p className="text-gray-600 mb-4">
            Scannez le QR code des billets pour valider l'embarquement des passagers
          </p>
          <button
            onClick={() => setShowScanner(!showScanner)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {showScanner ? 'Fermer le scanner' : 'Ouvrir le scanner QR'}
          </button>

          {showScanner && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                Scanner QR code (fonctionnalité à implémenter avec une bibliothèque de scan)
              </p>
              <input
                type="text"
                placeholder="Ou collez les données du QR code ici..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleScanQR((e.target as HTMLInputElement).value)
                  }
                }}
              />
            </div>
          )}

          {scanResult && (
            <div className={`mt-4 p-4 rounded-lg ${
              scanResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {scanResult.valid ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className={`font-semibold ${scanResult.valid ? 'text-green-900' : 'text-red-900'}`}>
                    {scanResult.valid ? '✅ Billet valide' : '❌ Billet invalide'}
                  </p>
                  {scanResult.valid && scanResult.reservation && (
                    <div className="mt-2 text-sm text-green-800">
                      <p><strong>Passager:</strong> {scanResult.reservation.passager}</p>
                      <p><strong>Places:</strong> {scanResult.reservation.nombrePlaces}</p>
                      <p><strong>Téléphone:</strong> {scanResult.reservation.telephone}</p>
                    </div>
                  )}
                  {!scanResult.valid && (
                    <p className="mt-1 text-sm text-red-800">{scanResult.error}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Liste des réservations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Liste des passagers</h3>
          
          {trajet.reservations.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucune réservation pour ce trajet</p>
          ) : (
            <div className="space-y-4">
              {trajet.reservations.map((reservation) => (
                <div key={reservation.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-lg">
                        {reservation.user.prenom} {reservation.user.nom}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {reservation.user.telephone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {reservation.user.email}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(reservation.statut)}`}>
                      {reservation.statut === 'CONFIRMEE' ? 'Confirmée' :
                       reservation.statut === 'EN_ATTENTE' ? 'En attente' :
                       'Annulée'}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Nombre de places</p>
                      <p className="font-medium">{reservation.nombrePlaces}</p>
                    </div>
                    {reservation.bagages && reservation.bagages.length > 0 && (
                      <div>
                        <p className="text-gray-600 mb-1">Bagages</p>
                        {reservation.bagages.map((bagage) => (
                          <div key={bagage.id} className="flex items-center gap-2 text-xs">
                            <Package className="w-4 h-4" />
                            <span>{bagage.type === 'MAIN' ? 'À main' : 'Soute'} - {bagage.poids}kg</span>
                            <span className="text-gray-500">({bagage.numeroEtiquette})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
