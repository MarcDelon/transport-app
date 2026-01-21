'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { User, Plus, Edit, Trash2, Search } from 'lucide-react'

interface Conducteur {
  id: string
  nom: string
  prenom: string
  numeroPermis: string
  experience: number
}

export default function AdminConducteursPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [conducteurs, setConducteurs] = useState<Conducteur[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingConducteur, setEditingConducteur] = useState<Conducteur | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    numeroPermis: '',
    experience: '',
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

    fetchConducteurs()
  }, [session, status, router])

  const fetchConducteurs = async () => {
    try {
      const response = await fetch('/api/admin/conducteurs')
      const data = await response.json()
      setConducteurs(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingConducteur
        ? `/api/admin/conducteurs/${editingConducteur.id}`
        : '/api/admin/conducteurs'
      const method = editingConducteur ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          experience: parseInt(formData.experience),
        }),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingConducteur(null)
        setFormData({
          nom: '',
          prenom: '',
          numeroPermis: '',
          experience: '',
        })
        fetchConducteurs()
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue')
    }
  }

  const handleEdit = (conducteur: Conducteur) => {
    setEditingConducteur(conducteur)
    setFormData({
      nom: conducteur.nom,
      prenom: conducteur.prenom,
      numeroPermis: conducteur.numeroPermis,
      experience: conducteur.experience.toString(),
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce conducteur ?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/conducteurs/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchConducteurs()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Filtrer les conducteurs selon la recherche
  const filteredConducteurs = conducteurs.filter((conducteur) => {
    const fullName = `${conducteur.prenom} ${conducteur.nom}`.toLowerCase()
    const query = searchQuery.toLowerCase()
    return fullName.includes(query) || 
           conducteur.numeroPermis.toLowerCase().includes(query)
  })

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
            Gestion des Conducteurs
          </h1>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingConducteur(null)
              setFormData({
                nom: '',
                prenom: '',
                numeroPermis: '',
                experience: '',
              })
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition border border-blue-700 shadow-sm windows-button"
          >
            <Plus className="w-5 h-5" />
            Ajouter un conducteur
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom ou numéro de permis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2">
              {filteredConducteurs.length} résultat{filteredConducteurs.length > 1 ? 's' : ''} trouvé{filteredConducteurs.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingConducteur ? 'Modifier le conducteur' : 'Nouveau conducteur'}
            </h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de permis
                </label>
                <input
                  type="text"
                  value={formData.numeroPermis}
                  onChange={(e) => setFormData({ ...formData, numeroPermis: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expérience (années)
                </label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition border border-blue-700 shadow-sm windows-button"
                >
                  {editingConducteur ? 'Modifier' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingConducteur(null)
                  }}
                  className="bg-gray-200 text-gray-700 px-6 py-2 hover:bg-gray-300 transition border border-gray-400 shadow-sm windows-button"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des conducteurs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom complet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numéro de permis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expérience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredConducteurs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      {searchQuery 
                        ? 'Aucun conducteur trouvé pour cette recherche'
                        : 'Aucun conducteur enregistré'}
                    </td>
                  </tr>
                ) : (
                  filteredConducteurs.map((conducteur) => (
                    <tr key={conducteur.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">
                            {conducteur.prenom} {conducteur.nom}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {conducteur.numeroPermis}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {conducteur.experience} ans
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(conducteur)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(conducteur.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

