'use client'

import { useState, useEffect } from 'react'
import { Package, Plus, Trash2, Tag } from 'lucide-react'

interface Bagage {
  id: string
  type: 'MAIN' | 'SOUTE'
  poids: number
  volume: number
  description: string | null
  supplement: number
  numeroEtiquette: string
}

interface BagageManagerProps {
  reservationId: string
  onBagagesChange?: (totalSupplement: number) => void
}

export default function BagageManager({ reservationId, onBagagesChange }: BagageManagerProps) {
  const [bagages, setBagages] = useState<Bagage[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'SOUTE' as 'MAIN' | 'SOUTE',
    poids: '',
    volume: '',
    description: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (reservationId) {
      fetchBagages()
    }
  }, [reservationId])

  useEffect(() => {
    const totalSupplement = bagages.reduce((sum, b) => sum + b.supplement, 0)
    onBagagesChange?.(totalSupplement)
  }, [bagages, onBagagesChange])

  const fetchBagages = async () => {
    try {
      const response = await fetch(`/api/bagages?reservationId=${reservationId}`)
      if (response.ok) {
        const data = await response.json()
        setBagages(data)
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/bagages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservationId,
          ...formData,
        }),
      })

      if (response.ok) {
        const newBagage = await response.json()
        setBagages([...bagages, newBagage])
        setFormData({
          type: 'SOUTE',
          poids: '',
          volume: '',
          description: '',
        })
        setShowForm(false)
      } else {
        const data = await response.json()
        alert(data.error || 'Une erreur est survenue')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (bagageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bagage ?')) return

    try {
      const response = await fetch(`/api/bagages/${bagageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setBagages(bagages.filter(b => b.id !== bagageId))
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue')
    }
  }

  const calculateSupplementPreview = () => {
    const poids = parseFloat(formData.poids) || 0
    let supplement = 0

    if (formData.type === 'SOUTE' && poids > 20) {
      supplement = (poids - 20) * 500
    } else if (formData.type === 'MAIN' && poids > 10) {
      supplement = (poids - 10) * 300
    }

    return supplement
  }

  const totalSupplement = bagages.reduce((sum, b) => sum + b.supplement, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          Bagages
        </h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Ajouter un bagage
          </button>
        )}
      </div>

      {/* Informations sur les bagages gratuits */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <p className="font-medium text-blue-900 mb-2">📦 Franchise bagages :</p>
        <ul className="text-blue-800 space-y-1">
          <li>• <strong>Bagage à main</strong> : gratuit jusqu&apos;à 10 kg (300 FCFA/kg supplémentaire)</li>
          <li>• <strong>Bagage en soute</strong> : gratuit jusqu&apos;à 20 kg (500 FCFA/kg supplémentaire)</li>
        </ul>
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de bagage *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'MAIN' | 'SOUTE' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="MAIN">Bagage à main (gratuit jusqu&apos;à 10 kg)</option>
              <option value="SOUTE">Bagage en soute (gratuit jusqu&apos;à 20 kg)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poids (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={formData.poids}
                onChange={(e) => setFormData({ ...formData, poids: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume (L) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnel)
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Valise bleue, Sac à dos..."
            />
          </div>

          {/* Aperçu du supplément */}
          {calculateSupplementPreview() > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Supplément :</strong> {calculateSupplementPreview().toLocaleString('fr-FR')} FCFA
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {submitting ? 'Ajout...' : 'Ajouter'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setFormData({ type: 'SOUTE', poids: '', volume: '', description: '' })
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Liste des bagages */}
      {bagages.length > 0 && (
        <div className="space-y-3">
          {bagages.map((bagage) => (
            <div key={bagage.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">
                      {bagage.type === 'MAIN' ? 'Bagage à main' : 'Bagage en soute'}
                    </span>
                    {bagage.supplement > 0 && (
                      <span className="text-sm text-orange-600 font-medium">
                        +{bagage.supplement.toLocaleString('fr-FR')} FCFA
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• Poids : {bagage.poids} kg</p>
                    <p>• Volume : {bagage.volume} L</p>
                    {bagage.description && <p>• {bagage.description}</p>}
                    <p className="flex items-center gap-1 text-blue-600">
                      <Tag className="w-4 h-4" />
                      Étiquette : {bagage.numeroEtiquette}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(bagage.id)}
                  className="text-red-600 hover:text-red-800 p-2"
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {/* Total des suppléments */}
          {totalSupplement > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-orange-900">Total suppléments bagages :</span>
                <span className="text-lg font-bold text-orange-600">
                  {totalSupplement.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {bagages.length === 0 && !showForm && !loading && (
        <p className="text-center text-gray-500 py-4">
          Aucun bagage ajouté. Les bagages dans les limites sont gratuits.
        </p>
      )}
    </div>
  )
}
