import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const depart = searchParams.get('depart')
    const arrivee = searchParams.get('arrivee')
    const date = searchParams.get('date')

    if (!depart || !arrivee || !date) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    const dateDebut = new Date(date)
    dateDebut.setHours(0, 0, 0, 0)
    const dateFin = new Date(date)
    dateFin.setHours(23, 59, 59, 999)

    // Normaliser les noms de villes (enlever accents, mettre en minuscules)
    const normalizeCity = (city: string) => {
      return city
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
        .trim()
    }

    const departNormalized = normalizeCity(depart)
    const arriveeNormalized = normalizeCity(arrivee)

    console.log('🔍 Recherche de trajets:', { depart, arrivee, date, departNormalized, arriveeNormalized })

    // Récupérer tous les trajets disponibles
    const { data: allTrajets, error: trajetsError } = await supabase
      .from('Trajet')
      .select('*')
      .eq('statut', 'DISPONIBLE')

    if (trajetsError) {
      console.error('❌ Erreur lors de la récupération des trajets:', trajetsError)
      return NextResponse.json([])
    }

    console.log(`📊 ${allTrajets?.length || 0} trajets disponibles au total`)

    // Filtrer manuellement pour gérer les accents
    const trajets = allTrajets?.filter(t => {
      const villeDepartNorm = normalizeCity(t.villeDepart)
      const villeArriveeNorm = normalizeCity(t.villeArrivee)
      return villeDepartNorm.includes(departNormalized) && 
             villeArriveeNorm.includes(arriveeNormalized)
    }) || []

    console.log(`✅ ${trajets.length} trajets correspondants trouvés`)

    if (trajets.length === 0) {
      return NextResponse.json([])
    }

    // Trouver les horaires pour ces trajets
    console.log('📅 Recherche d\'horaires pour la date:', date)
    console.log('   Date début:', dateDebut.toISOString())
    console.log('   Date fin:', dateFin.toISOString())
    console.log('   Trajets IDs:', trajets.map(t => t.id))

    const { data: horaires, error: horairesError } = await supabase
      .from('Horaire')
      .select(`
        *,
        Trajet (*)
      `)
      .in('trajetId', trajets.map(t => t.id))
      .gte('dateDepart', dateDebut.toISOString())
      .lte('dateDepart', dateFin.toISOString())
      .order('dateDepart', { ascending: true })

    if (horairesError) {
      console.error('❌ Erreur lors de la récupération des horaires:', horairesError)
      return NextResponse.json([])
    }

    console.log(`✅ ${horaires?.length || 0} horaires trouvés`)

    if (!horaires || horaires.length === 0) {
      console.log('⚠️ Aucun horaire trouvé pour cette date')
      return NextResponse.json([])
    }

    // Calculer les places disponibles pour chaque horaire
    console.log('🔢 Calcul des places disponibles...')
    const horairesAvecPlaces = await Promise.all(
      horaires.map(async (horaire) => {
        const { data: vehicule, error: vehiculeError } = await supabase
          .from('Vehicule')
          .select('capaciteMaximale')
          .eq('id', horaire.vehiculeId)
          .single()

        if (vehiculeError) {
          console.error(`❌ Erreur véhicule pour horaire ${horaire.id}:`, vehiculeError)
        }

        const { data: reservations, error: reservationsError } = await supabase
          .from('Reservation')
          .select('nombrePlaces')
          .eq('horaireId', horaire.id)
          .in('statut', ['CONFIRMEE', 'EN_ATTENTE'])

        if (reservationsError) {
          console.error(`❌ Erreur réservations pour horaire ${horaire.id}:`, reservationsError)
        }

        const placesReservees = reservations?.reduce(
          (sum, r) => sum + (r.nombrePlaces || 0),
          0
        ) || 0

        const capaciteMax = vehicule?.capaciteMaximale || 0
        const placesDisponibles = capaciteMax - placesReservees

        console.log(`   Horaire ${horaire.id}: ${placesDisponibles}/${capaciteMax} places disponibles`)

        return {
          id: horaire.id,
          dateDepart: horaire.dateDepart,
          dateArrivee: horaire.dateArrivee,
          trajet: horaire.Trajet,
          placesDisponibles: Math.max(0, placesDisponibles),
        }
      })
    )

    console.log(`✅ ${horairesAvecPlaces.length} horaires avec places calculées`)
    return NextResponse.json(horairesAvecPlaces)
  } catch (error) {
    console.error('Erreur lors de la recherche:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}



