'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DollarSign, CreditCard, Smartphone, Coins, Check, X, Clock } from 'lucide-react'

interface Paiement {
  id: string
  montant: number
  methodePaiement: string | null
  statut: 'EN_ATTENTE' | 'VALIDE' | 'REFUSE'
  datePaiement: string
  numeroFacture: string | null
  user: {
    nom: string
    prenom: string
    email: string
  }
  reservation: {
    id: string
    nombrePlaces: number
    horaire: {
      trajet: {
        villeDepart: string
        villeArrivee: string
      }
    }
  }
}

export default function AdminPaiementsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [paiements, setPaiements] = useState<Paiement[]>([])
  const [loading, setLoading] = useState(true)
  const [totalRevenus, setTotalRevenus] = useState(0)
  const [filter, setFilter] = useState<string>('')
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null)
  const [methodePaiement, setMethodePaiement] = useState<string>('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion')
      return
    }

    if (session?.user?.role !== 'ADMIN') {
      router.push('/client/dashboard')
      return
    }

    fetchPaiements()
  }, [session, status, router])

  const fetchPaiements = async () => {
    try {
      const response = await fetch('/api/admin/paiements')
      const data = await response.json()
      setPaiements(data.paiements || [])
      setTotalRevenus(data.totalRevenus || 0)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMethodeIcon = (methode: string | null) => {
    if (!methode) return <Clock className="w-5 h-5 text-gray-400" />
    switch (methode) {
      case 'CARTE_BANCAIRE':
        return <CreditCard className="w-5 h-5" />
      case 'MOBILE_MONEY':
        return <Smartphone className="w-5 h-5" />
      case 'ESPECES':
        return <Coins className="w-5 h-5" />
      default:
        return <DollarSign className="w-5 h-5" />
    }
  }

  const getMethodeLabel = (methode: string | null) => {
    if (!methode) return 'En attente'
    switch (methode) {
      case 'CARTE_BANCAIRE':
        return 'Carte bancaire'
      case 'MOBILE_MONEY':
        return 'Mobile Money'
      case 'ESPECES':
        return 'Espèces'
      default:
        return methode
    }
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'VALIDE':
        return (
          <span className="px-2 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            <Check className="w-4 h-4" />
            Validé
          </span>
        )
      case 'EN_ATTENTE':
        return (
          <span className="px-2 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4" />
            En attente
          </span>
        )
      case 'REFUSE':
        return (
          <span className="px-2 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            <X className="w-4 h-4" />
            Refusé
          </span>
        )
      default:
        return null
    }
  }

  const handleValidation = async (statut: 'VALIDE' | 'REFUSE') => {
    if (!selectedPaiement) return

    if (statut === 'VALIDE' && !methodePaiement) {
      alert('Veuillez sélectionner une méthode de paiement')
      return
    }

    try {
      const response = await fetch(`/api/admin/paiements/${selectedPaiement.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          statut,
          methodePaiement: statut === 'VALIDE' ? methodePaiement : null,
        }),
      })

      if (response.ok) {
        setShowValidationModal(false)
        setSelectedPaiement(null)
        setMethodePaiement('')
        fetchPaiements()
      } else {
        alert('Erreur lors de la validation du paiement')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue')
    }
  }

  const openValidationModal = (paiement: Paiement) => {
    setSelectedPaiement(paiement)
    setMethodePaiement(paiement.methodePaiement || '')
    setShowValidationModal(true)
  }

  const filteredPaiements = filter
    ? paiements.filter(p => p.statut === filter)
    : paiements

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Paiements
          </h1>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-semibold text-blue-900">
                Total des revenus: {totalRevenus.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setFilter('')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === '' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('EN_ATTENTE')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'EN_ATTENTE' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            En attente
          </button>
          <button
            onClick={() => setFilter('VALIDE')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'VALIDE' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Validés
          </button>
          <button
            onClick={() => setFilter('REFUSE')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'REFUSE' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Refusés
          </button>
        </div>

        {/* Liste des paiements */}
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
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Méthode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facture
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
                {filteredPaiements.map((paiement) => (
                  <tr key={paiement.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {paiement.user ? `${paiement.user.prenom} ${paiement.user.nom}` : 'Utilisateur supprimé'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {paiement.user ? paiement.user.email : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {paiement.reservation?.horaire?.trajet ? 
                          `${paiement.reservation.horaire.trajet.villeDepart} → ${paiement.reservation.horaire.trajet.villeArrivee}` : 
                          'Trajet supprimé'
                        }
                      </div>
                      <div className="text-sm text-gray-500">
                        {paiement.reservation?.nombrePlaces || 0} place{(paiement.reservation?.nombrePlaces || 0) > 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">
                        {paiement.montant.toLocaleString('fr-FR')} FCFA
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getMethodeIcon(paiement.methodePaiement)}
                        <span className="text-sm text-gray-700">
                          {getMethodeLabel(paiement.methodePaiement)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(paiement.datePaiement).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {paiement.numeroFacture || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatutBadge(paiement.statut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {paiement.statut === 'EN_ATTENTE' && (
                        <button
                          onClick={() => openValidationModal(paiement)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Valider
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de validation */}
        {showValidationModal && selectedPaiement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Validation du paiement
              </h2>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Client</div>
                <div className="font-medium">
                  {selectedPaiement.user.prenom} {selectedPaiement.user.nom}
                </div>
                
                <div className="text-sm text-gray-600 mt-3 mb-2">Montant</div>
                <div className="font-bold text-green-600 text-lg">
                  {selectedPaiement.montant.toLocaleString('fr-FR')} FCFA
                </div>
                
                <div className="text-sm text-gray-600 mt-3 mb-2">Facture</div>
                <div className="font-medium">
                  {selectedPaiement.numeroFacture}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Méthode de paiement *
                </label>
                <select
                  value={methodePaiement}
                  onChange={(e) => setMethodePaiement(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner une méthode</option>
                  <option value="ESPECES">Espèces</option>
                  <option value="CARTE_BANCAIRE">Carte bancaire</option>
                  <option value="MOBILE_MONEY">Mobile Money</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleValidation('VALIDE')}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                >
                  <Check className="w-5 h-5 inline mr-2" />
                  Valider
                </button>
                <button
                  onClick={() => handleValidation('REFUSE')}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                >
                  <X className="w-5 h-5 inline mr-2" />
                  Refuser
                </button>
                <button
                  onClick={() => {
                    setShowValidationModal(false)
                    setSelectedPaiement(null)
                    setMethodePaiement('')
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


