'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DollarSign, CreditCard, Smartphone, Coins } from 'lucide-react'

interface Paiement {
  id: string
  montant: number
  methodePaiement: string
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

  const getMethodeIcon = (methode: string) => {
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

  const getMethodeLabel = (methode: string) => {
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paiements.map((paiement) => (
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
                        {paiement.reservation.horaire.trajet.villeDepart} → {paiement.reservation.horaire.trajet.villeArrivee}
                      </div>
                      <div className="text-sm text-gray-500">
                        {paiement.reservation.nombrePlaces} place{paiement.reservation.nombrePlaces > 1 ? 's' : ''}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}


