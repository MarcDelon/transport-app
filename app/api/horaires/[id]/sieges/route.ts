import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const horaireId = params.id

    // Récupérer les informations de l'horaire et du véhicule
    const { data: horaire, error: horaireError } = await supabase
      .from('Horaire')
      .select(`
        id,
        dateDepart,
        Vehicule (
          id,
          capaciteMaximale,
          marque,
          modele
        )
      `)
      .eq('id', horaireId)
      .single()

    if (horaireError || !horaire) {
      return NextResponse.json(
        { error: 'Horaire non trouvé' },
        { status: 404 }
      )
    }

    const vehicule = horaire.Vehicule as any
    const capacite = vehicule.capaciteMaximale

    // Récupérer la configuration du véhicule
    const { data: config } = await supabase
      .from('ConfigurationVehicule')
      .select('*')
      .eq('vehiculeId', vehicule.id)
      .single()

    // Récupérer tous les sièges réservés pour cet horaire
    const { data: siegesReserves } = await supabase
      .from('Siege')
      .select(`
        numeroSiege,
        Reservation!inner (
          statut,
          User (
            nom,
            prenom
          )
        )
      `)
      .eq('horaireId', horaireId)

    // Créer un Set des numéros de sièges occupés
    const siegesOccupes = new Set(
      siegesReserves
        ?.filter((s: any) => 
          s.Reservation.statut === 'CONFIRMEE' || 
          s.Reservation.statut === 'EN_ATTENTE'
        )
        .map((s: any) => s.numeroSiege) || []
    )

    // Générer la liste complète des sièges avec leur statut
    const sieges = Array.from({ length: capacite }, (_, i) => {
      const numeroSiege = i + 1
      const estOccupe = siegesOccupes.has(numeroSiege)
      
      return {
        numero: numeroSiege,
        disponible: !estOccupe,
        statut: estOccupe ? 'occupe' : 'disponible'
      }
    })

    // Calculer les statistiques
    const placesDisponibles = sieges.filter(s => s.disponible).length
    const placesOccupees = sieges.filter(s => !s.disponible).length

    return NextResponse.json({
      horaireId,
      vehicule: {
        id: vehicule.id,
        marque: vehicule.marque,
        modele: vehicule.modele,
        capacite: capacite
      },
      configuration: config || {
        nombreRangees: Math.ceil(capacite / 4),
        siegesParRangee: 4,
        alleePosition: 2
      },
      sieges,
      statistiques: {
        capaciteTotal: capacite,
        placesDisponibles,
        placesOccupees,
        tauxOccupation: Math.round((placesOccupees / capacite) * 100)
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des sièges:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
