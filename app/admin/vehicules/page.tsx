'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Bus, Plus, Edit, Trash2 } from 'lucide-react'

interface Vehicule {
  id: string
  numeroImmatriculation: string
  marque: string
  modele: string
  capaciteMaximale: number
  statut: string
}

export default function AdminVehiculesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [vehicules, setVehicules] = useState<Vehicule[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingVehicule, setEditingVehicule] = useState<Vehicule | null>(null)
  const [formData, setFormData] = useState({
    numeroImmatriculation: '',
    marque: '',
    modele: '',
    capaciteMaximale: '',
    statut: 'EN_SERVICE',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion')
      return
    }

    if (session?.user?.role !== 'ADMIN') {
      router.push('/client/dashboard')
      return
    }

    fetchVehicules()
  }, [session, status, router])

  const fetchVehicules = async () => {
    try {
      const response = await fetch('/api/admin/vehicules')
      const data = await response.json()
      setVehicules(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingVehicule
        ? `/api/admin/vehicules/${editingVehicule.id}`
        : '/api/admin/vehicules'
      const method = editingVehicule ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          capaciteMaximale: parseInt(formData.capaciteMaximale),
        }),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingVehicule(null)
        setFormData({
          numeroImmatriculation: '',
          marque: '',
          modele: '',
          capaciteMaximale: '',
          statut: 'EN_SERVICE',
        })
        fetchVehicules()
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue')
    }
  }

  const handleEdit = (vehicule: Vehicule) => {
    setEditingVehicule(vehicule)
    setFormData({
      numeroImmatriculation: vehicule.numeroImmatriculation,
      marque: vehicule.marque,
      modele: vehicule.modele,
      capaciteMaximale: vehicule.capaciteMaximale.toString(),
      statut: vehicule.statut,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/vehicules/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchVehicules()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    )
  }

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'EN_SERVICE':
        return 'En service'
      case 'EN_MAINTENANCE':
        return 'En maintenance'
      case 'HORS_SERVICE':
        return 'Hors service'
      default:
        return statut
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Véhicules
          </h1>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingVehicule(null)
              setFormData({
                numeroImmatriculation: '',
                marque: '',
                modele: '',
                capaciteMaximale: '',
                statut: 'EN_SERVICE',
              })
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition border border-blue-700 shadow-sm windows-button"
          >
            <Plus className="w-5 h-5" />
            Ajouter un véhicule
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingVehicule ? 'Modifier le véhicule' : 'Nouveau véhicule'}
            </h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro d'immatriculation
                </label>
                <input
                  type="text"
                  value={formData.numeroImmatriculation}
                  onChange={(e) => setFormData({ ...formData, numeroImmatriculation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marque
                </label>
                <input
                  type="text"
                  value={formData.marque}
                  onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modèle
                </label>
                <input
                  type="text"
                  value={formData.modele}
                  onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacité maximale
                </label>
                <input
                  type="number"
                  value={formData.capaciteMaximale}
                  onChange={(e) => setFormData({ ...formData, capaciteMaximale: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="EN_SERVICE">En service</option>
                  <option value="EN_MAINTENANCE">En maintenance</option>
                  <option value="HORS_SERVICE">Hors service</option>
                </select>
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition border border-blue-700 shadow-sm windows-button"
                >
                  {editingVehicule ? 'Modifier' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingVehicule(null)
                  }}
                  className="bg-gray-200 text-gray-700 px-6 py-2 hover:bg-gray-300 transition border border-gray-400 shadow-sm windows-button"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des véhicules */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Immatriculation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marque / Modèle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacité
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
                {vehicules.map((vehicule) => (
                  <tr key={vehicule.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Bus className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">{vehicule.numeroImmatriculation}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vehicule.marque} {vehicule.modele}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicule.capaciteMaximale} places
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vehicule.statut === 'EN_SERVICE' ? 'bg-green-100 text-green-800' :
                        vehicule.statut === 'EN_MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {getStatutLabel(vehicule.statut)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(vehicule)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicule.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
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

