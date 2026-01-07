'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react'

interface Trajet {
  id: string
  villeDepart: string
  villeArrivee: string
  distance: number
  dureeEstimee: number
  tarifBase: number
  statut: string
}

export default function AdminTrajetsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [trajets, setTrajets] = useState<Trajet[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTrajet, setEditingTrajet] = useState<Trajet | null>(null)
  const [formData, setFormData] = useState({
    villeDepart: '',
    villeArrivee: '',
    distance: '',
    dureeEstimee: '',
    tarifBase: '',
    statut: 'DISPONIBLE',
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

    fetchTrajets()
  }, [session, status, router])

  const fetchTrajets = async () => {
    try {
      const response = await fetch('/api/admin/trajets')
      const data = await response.json()
      setTrajets(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingTrajet
        ? `/api/admin/trajets/${editingTrajet.id}`
        : '/api/admin/trajets'
      const method = editingTrajet ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          distance: parseFloat(formData.distance),
          dureeEstimee: parseInt(formData.dureeEstimee),
          tarifBase: parseFloat(formData.tarifBase),
        }),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingTrajet(null)
        setFormData({
          villeDepart: '',
          villeArrivee: '',
          distance: '',
          dureeEstimee: '',
          tarifBase: '',
          statut: 'DISPONIBLE',
        })
        fetchTrajets()
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue')
    }
  }

  const handleEdit = (trajet: Trajet) => {
    setEditingTrajet(trajet)
    setFormData({
      villeDepart: trajet.villeDepart,
      villeArrivee: trajet.villeArrivee,
      distance: trajet.distance.toString(),
      dureeEstimee: trajet.dureeEstimee.toString(),
      tarifBase: trajet.tarifBase.toString(),
      statut: trajet.statut,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/trajets/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchTrajets()
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Trajets
          </h1>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingTrajet(null)
              setFormData({
                villeDepart: '',
                villeArrivee: '',
                distance: '',
                dureeEstimee: '',
                tarifBase: '',
                statut: 'DISPONIBLE',
              })
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition border border-blue-700 shadow-sm windows-button"
          >
            <Plus className="w-5 h-5" />
            Ajouter un trajet
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingTrajet ? 'Modifier le trajet' : 'Nouveau trajet'}
            </h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville de départ
                </label>
                <input
                  type="text"
                  value={formData.villeDepart}
                  onChange={(e) => setFormData({ ...formData, villeDepart: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville d&#39;arrivée
                </label>
                <input
                  type="text"
                  value={formData.villeArrivee}
                  onChange={(e) => setFormData({ ...formData, villeArrivee: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée estimée (minutes)
                </label>
                <input
                  type="number"
                  value={formData.dureeEstimee}
                  onChange={(e) => setFormData({ ...formData, dureeEstimee: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarif de base (FCFA)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.tarifBase}
                  onChange={(e) => setFormData({ ...formData, tarifBase: e.target.value })}
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
                  <option value="DISPONIBLE">Disponible</option>
                  <option value="ANNULE">Annulé</option>
                  <option value="COMPLET">Complet</option>
                </select>
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition border border-blue-700 shadow-sm windows-button"
                >
                  {editingTrajet ? 'Modifier' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingTrajet(null)
                  }}
                  className="bg-gray-200 text-gray-700 px-6 py-2 hover:bg-gray-300 transition border border-gray-400 shadow-sm windows-button"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des trajets */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trajet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarif
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
                {trajets.map((trajet) => (
                  <tr key={trajet.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">
                          {trajet.villeDepart} → {trajet.villeArrivee}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {trajet.distance} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.floor(trajet.dureeEstimee / 60)}h {trajet.dureeEstimee % 60}min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      {trajet.tarifBase.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        trajet.statut === 'DISPONIBLE' ? 'bg-green-100 text-green-800' :
                        trajet.statut === 'ANNULE' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {trajet.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(trajet)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(trajet.id)}
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

