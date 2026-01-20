import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET - Récupérer les détails d'un trajet avec les réservations
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'CONDUCTEUR') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    console.log('🚗 Détails trajet:', params.id)

    // Trouver le conducteur
    const { data: conducteur } = await supabase
      .from('Conducteur')
      .select('id')
      .eq('userId', session.user.id)
      .single()

    if (!conducteur) {
      return NextResponse.json(
        { error: 'Profil conducteur non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer l'horaire
    const { data: horaire, error: horaireError } = await supabase
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
          dureeEstimee,
          tarifBase
        ),
        vehicule:Vehicule!vehiculeId (
          id,
          numeroImmatriculation,
          marque,
          modele,
          capaciteMaximale
        )
      `)
      .eq('id', params.id)
      .eq('conducteurId', conducteur.id)
      .single()

    if (horaireError || !horaire) {
      console.error('❌ Horaire non trouvé:', horaireError)
      return NextResponse.json(
        { error: 'Trajet non trouvé ou non assigné à ce conducteur' },
        { status: 404 }
      )
    }

    // Récupérer les réservations avec les infos des passagers
    const { data: reservations, error: reservationsError } = await supabase
      .from('Reservation')
      .select(`
        id,
        nombrePlaces,
        statut,
        numeroSiege,
        createdAt,
        user:User!userId (
          nom,
          prenom,
          telephone,
          email
        ),
        bagages:Bagage (
          id,
          type,
          poids,
          numeroEtiquette
        )
      `)
      .eq('horaireId', params.id)
      .in('statut', ['CONFIRMEE', 'EN_ATTENTE'])
      .order('createdAt', { ascending: true })

    if (reservationsError) {
      console.error('❌ Erreur réservations:', reservationsError)
    }

    const totalPassagers = reservations?.reduce((sum, r) => sum + r.nombrePlaces, 0) || 0
    const capacite = (horaire.vehicule as any)?.capaciteMaximale || 0

    console.log('✅ Trajet chargé avec', reservations?.length || 0, 'réservations')

    return NextResponse.json({
      ...horaire,
      reservations: reservations || [],
      totalPassagers,
      capacite,
      tauxRemplissage: capacite > 0 ? Math.round((totalPassagers / capacite) * 100) : 0,
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}

// PATCH - Mettre à jour le statut du trajet
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'CONDUCTEUR') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { statut } = body

    console.log('🚗 Mise à jour statut trajet:', params.id, '→', statut)

    // Trouver le conducteur
    const { data: conducteur } = await supabase
      .from('Conducteur')
      .select('id')
      .eq('userId', session.user.id)
      .single()

    if (!conducteur) {
      return NextResponse.json(
        { error: 'Profil conducteur non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier que l'horaire appartient au conducteur
    const { data: horaireCheck } = await supabase
      .from('Horaire')
      .select('id')
      .eq('id', params.id)
      .eq('conducteurId', conducteur.id)
      .single()

    if (!horaireCheck) {
      return NextResponse.json(
        { error: 'Trajet non assigné à ce conducteur' },
        { status: 403 }
      )
    }

    // Mettre à jour le statut
    const { data: horaire, error } = await supabase
      .from('Horaire')
      .update({
        statut,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('❌ Erreur mise à jour:', error)
      throw error
    }

    console.log('✅ Statut mis à jour')
    return NextResponse.json(horaire)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
