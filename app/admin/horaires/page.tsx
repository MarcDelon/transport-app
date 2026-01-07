'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Calendar, Plus, Edit, Trash2, MapPin, Bus, User } from 'lucide-react'

interface Horaire {
  id: string
  dateDepart: string
  dateArrivee: string
  trajet: {
    id: string
    villeDepart: string
    villeArrivee: string
  }
  vehicule: {
    id: string
    numeroImmatriculation: string
  }
  conducteur: {
    id: string
    prenom: string
    nom: string
  }
}

interface Trajet {
  id: string
  villeDepart: string
  villeArrivee: string
}

interface Vehicule {
  id: string
  numeroImmatriculation: string
  statut: string
}

interface Conducteur {
  id: string
  prenom: string
  nom: string
}

export default function AdminHorairesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [horaires, setHoraires] = useState<Horaire[]>([])
  const [trajets, setTrajets] = useState<Trajet[]>([])
  const [vehicules, setVehicules] = useState<Vehicule[]>([])
  const [conducteurs, setConducteurs] = useState<Conducteur[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingHoraire, setEditingHoraire] = useState<Horaire | null>(null)
  const [formData, setFormData] = useState({
    trajetId: '',
    vehiculeId: '',
    conducteurId: '',
    dateDepart: '',
    dateArrivee: '',
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

    fetchData()
  }, [session, status, router])

  const fetchData = async () => {
    try {
      const [horairesRes, trajetsRes, vehiculesRes, conducteursRes] = await Promise.all([
        fetch('/api/admin/horaires'),
        fetch('/api/admin/trajets'),
        fetch('/api/admin/vehicules'),
        fetch('/api/admin/conducteurs'),
      ])

      const [horairesData, trajetsData, vehiculesData, conducteursData] = await Promise.all([
        horairesRes.json(),
        trajetsRes.json(),
        vehiculesRes.json(),
        conducteursRes.json(),
      ])

      setHoraires(horairesData)
      setTrajets(trajetsData)
      setVehicules(vehiculesData.filter((v: Vehicule) => v.statut === 'EN_SERVICE'))
      setConducteurs(conducteursData)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingHoraire
        ? `/api/admin/horaires/${editingHoraire.id}`
        : '/api/admin/horaires'
      const method = editingHoraire ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          dateDepart: new Date(formData.dateDepart).toISOString(),
          dateArrivee: new Date(formData.dateArrivee).toISOString(),
        }),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingHoraire(null)
        setFormData({
          trajetId: '',
          vehiculeId: '',
          conducteurId: '',
          dateDepart: '',
          dateArrivee: '',
        })
        fetchData()
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue')
    }
  }

  const handleEdit = (horaire: Horaire) => {
    setEditingHoraire(horaire)
    const dateDepart = new Date(horaire.dateDepart)
    const dateArrivee = new Date(horaire.dateArrivee)
    
    setFormData({
      trajetId: horaire.trajet.id,
      vehiculeId: horaire.vehicule.id,
      conducteurId: horaire.conducteur.id,
      dateDepart: dateDepart.toISOString().slice(0, 16),
      dateArrivee: dateArrivee.toISOString().slice(0, 16),
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet horaire ?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/horaires/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchData()
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
            Gestion des Horaires
          </h1>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingHoraire(null)
              setFormData({
                trajetId: '',
                vehiculeId: '',
                conducteurId: '',
                dateDepart: '',
                dateArrivee: '',
              })
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition border border-blue-700 shadow-sm windows-button"
          >
            <Plus className="w-5 h-5" />
            Ajouter un horaire
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingHoraire ? 'Modifier l\'horaire' : 'Nouvel horaire'}
            </h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trajet
                </label>
                <select
                  value={formData.trajetId}
                  onChange={(e) => setFormData({ ...formData, trajetId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un trajet</option>
                  {trajets.map((trajet) => (
                    <option key={trajet.id} value={trajet.id}>
                      {trajet.villeDepart} → {trajet.villeArrivee}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Véhicule
                </label>
                <select
                  value={formData.vehiculeId}
                  onChange={(e) => setFormData({ ...formData, vehiculeId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un véhicule</option>
                  {vehicules.map((vehicule) => (
                    <option key={vehicule.id} value={vehicule.id}>
                      {vehicule.numeroImmatriculation}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conducteur
                </label>
                <select
                  value={formData.conducteurId}
                  onChange={(e) => setFormData({ ...formData, conducteurId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un conducteur</option>
                  {conducteurs.map((conducteur) => (
                    <option key={conducteur.id} value={conducteur.id}>
                      {conducteur.prenom} {conducteur.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date et heure de départ
                </label>
                <input
                  type="datetime-local"
                  value={formData.dateDepart}
                  onChange={(e) => setFormData({ ...formData, dateDepart: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date et heure d'arrivée
                </label>
                <input
                  type="datetime-local"
                  value={formData.dateArrivee}
                  onChange={(e) => setFormData({ ...formData, dateArrivee: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition border border-blue-700 shadow-sm windows-button"
                >
                  {editingHoraire ? 'Modifier' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingHoraire(null)
                  }}
                  className="bg-gray-200 text-gray-700 px-6 py-2 hover:bg-gray-300 transition border border-gray-400 shadow-sm windows-button"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des horaires */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trajet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Départ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arrivée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Véhicule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conducteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {horaires.map((horaire) => (
                  <tr key={horaire.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">
                          {horaire.trajet.villeDepart} → {horaire.trajet.villeArrivee}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(horaire.dateDepart).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(horaire.dateArrivee).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Bus className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{horaire.vehicule.numeroImmatriculation}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{horaire.conducteur.prenom} {horaire.conducteur.nom}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(horaire)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(horaire.id)}
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

