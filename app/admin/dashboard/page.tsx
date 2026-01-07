'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Users, Bus, MapPin, Calendar, Ticket, DollarSign, 
  TrendingUp, AlertCircle, CheckCircle 
} from 'lucide-react'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalClients: 0,
    totalReservations: 0,
    reservationsEnAttente: 0,
    revenus: 0,
    trajets: 0,
    vehicules: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion')
      return
    }

    if (session?.user?.role !== 'ADMIN') {
      router.push('/client/dashboard')
      return
    }

    fetchStats()
  }, [session, status, router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    )
  }

  if (session?.user?.role !== 'ADMIN') {
    return null
  }

  const statCards = [
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'bg-blue-500',
      link: '/admin/clients',
    },
    {
      title: 'Réservations',
      value: stats.totalReservations,
      icon: Ticket,
      color: 'bg-green-500',
      link: '/admin/reservations',
    },
    {
      title: 'En Attente',
      value: stats.reservationsEnAttente,
      icon: AlertCircle,
      color: 'bg-yellow-500',
      link: '/admin/reservations?statut=EN_ATTENTE',
    },
    {
      title: 'Revenus',
      value: `${stats.revenus.toLocaleString('fr-FR')} FCFA`,
      icon: DollarSign,
      color: 'bg-purple-500',
      link: '/admin/paiements',
    },
    {
      title: 'Trajets',
      value: stats.trajets,
      icon: MapPin,
      color: 'bg-indigo-500',
      link: '/admin/trajets',
    },
    {
      title: 'Véhicules',
      value: stats.vehicules,
      icon: Bus,
      color: 'bg-red-500',
      link: '/admin/vehicules',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Administrateur
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenue, {session?.user?.name}
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              href={stat.link}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Menu de gestion */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Gestion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/admin/clients"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <Users className="w-5 h-5 text-blue-600 mb-2" />
              <h3 className="font-semibold">Gestion des Clients</h3>
              <p className="text-sm text-gray-600">Voir et gérer les clients</p>
            </Link>
            <Link
              href="/admin/trajets"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <MapPin className="w-5 h-5 text-blue-600 mb-2" />
              <h3 className="font-semibold">Gestion des Trajets</h3>
              <p className="text-sm text-gray-600">Créer et modifier les trajets</p>
            </Link>
            <Link
              href="/admin/vehicules"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <Bus className="w-5 h-5 text-blue-600 mb-2" />
              <h3 className="font-semibold">Gestion des Véhicules</h3>
              <p className="text-sm text-gray-600">Gérer la flotte de véhicules</p>
            </Link>
            <Link
              href="/admin/conducteurs"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <Users className="w-5 h-5 text-blue-600 mb-2" />
              <h3 className="font-semibold">Gestion des Conducteurs</h3>
              <p className="text-sm text-gray-600">Gérer les conducteurs</p>
            </Link>
            <Link
              href="/admin/reservations"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <Ticket className="w-5 h-5 text-blue-600 mb-2" />
              <h3 className="font-semibold">Gestion des Réservations</h3>
              <p className="text-sm text-gray-600">Voir toutes les réservations</p>
            </Link>
            <Link
              href="/admin/horaires"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <Calendar className="w-5 h-5 text-blue-600 mb-2" />
              <h3 className="font-semibold">Gestion des Horaires</h3>
              <p className="text-sm text-gray-600">Planifier les horaires</p>
            </Link>
            <Link
              href="/admin/paiements"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <DollarSign className="w-5 h-5 text-blue-600 mb-2" />
              <h3 className="font-semibold">Gestion des Paiements</h3>
              <p className="text-sm text-gray-600">Suivre les paiements</p>
            </Link>
            <Link
              href="/admin/abonnements"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <TrendingUp className="w-5 h-5 text-blue-600 mb-2" />
              <h3 className="font-semibold">Gestion des Abonnements</h3>
              <p className="text-sm text-gray-600">Gérer les abonnements</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}



