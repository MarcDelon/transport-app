import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET - Récupérer les trajets assignés au conducteur
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'CONDUCTEUR') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    const periode = searchParams.get('periode') || 'jour' // jour, semaine, mois

    console.log('🚗 Récupération trajets conducteur:', session.user.id, 'Date:', date, 'Période:', periode)

    // Trouver le conducteur associé à l'utilisateur
    const { data: conducteur, error: conducteurError } = await supabase
      .from('Conducteur')
      .select('id')
      .eq('userId', session.user.id)
      .single()

    if (conducteurError || !conducteur) {
      console.error('❌ Conducteur non trouvé:', conducteurError)
      return NextResponse.json(
        { error: 'Profil conducteur non trouvé' },
        { status: 404 }
      )
    }

    // Calculer les dates de début et fin selon la période
    let dateDebut = new Date(date)
    let dateFin = new Date(date)

    if (periode === 'semaine') {
      // Du lundi au dimanche
      const jour = dateDebut.getDay()
      const diff = dateDebut.getDate() - jour + (jour === 0 ? -6 : 1)
      dateDebut = new Date(dateDebut.setDate(diff))
      dateFin = new Date(dateDebut)
      dateFin.setDate(dateFin.getDate() + 6)
    } else if (periode === 'mois') {
      dateDebut = new Date(dateDebut.getFullYear(), dateDebut.getMonth(), 1)
      dateFin = new Date(dateDebut.getFullYear(), dateDebut.getMonth() + 1, 0)
    }

    dateFin.setHours(23, 59, 59, 999)

    console.log('📅 Période:', dateDebut.toISOString(), 'à', dateFin.toISOString())

    // Récupérer les horaires assignés au conducteur
    const { data: horaires, error: horairesError } = await supabase
      .from('Horaire')
      .select(`
        id,
        dateDepart,
        dateArrivee,
        statut,
        trajet:Trajet!trajetId (
          id,
          villeDepart,
          villeArrivee,
          distance,
          dureeEstimee
        ),
        vehicule:Vehicule!vehiculeId (
          id,
          numeroImmatriculation,
          marque,
          modele,
          capaciteMaximale
        )
      `)
      .eq('conducteurId', conducteur.id)
      .gte('dateDepart', dateDebut.toISOString())
      .lte('dateDepart', dateFin.toISOString())
      .order('dateDepart', { ascending: true })

    if (horairesError) {
      console.error('❌ Erreur récupération horaires:', horairesError)
      throw horairesError
    }

    // Pour chaque horaire, récupérer le nombre de réservations
    const horairesAvecStats = await Promise.all(
      (horaires || []).map(async (horaire) => {
        const { data: reservations } = await supabase
          .from('Reservation')
          .select('nombrePlaces, statut')
          .eq('horaireId', horaire.id)
          .in('statut', ['CONFIRMEE', 'EN_ATTENTE'])

        const totalPassagers = reservations?.reduce((sum, r) => sum + r.nombrePlaces, 0) || 0
        const capacite = (horaire.vehicule as any)?.capaciteMaximale || 0

        return {
          ...horaire,
          totalPassagers,
          capacite,
          tauxRemplissage: capacite > 0 ? Math.round((totalPassagers / capacite) * 100) : 0,
        }
      })
    )

    console.log('✅ Trajets trouvés:', horairesAvecStats.length)

    return NextResponse.json(horairesAvecStats)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
