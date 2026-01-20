import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// POST - Ajouter un bagage à une réservation
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { reservationId, type, poids, volume, description } = body

    console.log('📦 Ajout bagage:', { reservationId, type, poids, volume })

    // Vérifier que la réservation appartient à l'utilisateur
    const { data: reservation, error: reservationError } = await supabase
      .from('Reservation')
      .select('userId')
      .eq('id', reservationId)
      .single()

    if (reservationError || !reservation) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      )
    }

    if (reservation.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    // Calculer le supplément selon le type et le poids
    let supplement = 0
    
    if (type === 'SOUTE') {
      // Bagage en soute : gratuit jusqu'à 20kg, puis 500 FCFA par kg supplémentaire
      if (poids > 20) {
        supplement = (poids - 20) * 500
      }
    } else if (type === 'MAIN') {
      // Bagage à main : gratuit jusqu'à 10kg, puis 300 FCFA par kg supplémentaire
      if (poids > 10) {
        supplement = (poids - 10) * 300
      }
    }

    // Générer un ID unique et un numéro d'étiquette
    const bagageId = `bagage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const numeroEtiquette = `BAG-${new Date().getFullYear()}-${String(Date.now()).slice(-8)}`

    const { data: bagage, error } = await supabase
      .from('Bagage')
      .insert({
        id: bagageId,
        reservationId,
        type,
        poids: parseFloat(poids),
        volume: parseFloat(volume),
        description: description || null,
        supplement,
        numeroEtiquette,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erreur insertion bagage:', error)
      throw error
    }

    console.log('✅ Bagage ajouté avec succès:', bagageId)
    return NextResponse.json(bagage)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}

// GET - Récupérer les bagages d'une réservation
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const reservationId = searchParams.get('reservationId')

    if (!reservationId) {
      return NextResponse.json(
        { error: 'reservationId requis' },
        { status: 400 }
      )
    }

    // Vérifier que la réservation appartient à l'utilisateur
    const { data: reservation } = await supabase
      .from('Reservation')
      .select('userId')
      .eq('id', reservationId)
      .single()

    if (reservation && reservation.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const { data: bagages, error } = await supabase
      .from('Bagage')
      .select('*')
      .eq('reservationId', reservationId)
      .order('createdAt', { ascending: true })

    if (error) {
      console.error('❌ Erreur récupération bagages:', error)
      throw error
    }

    return NextResponse.json(bagages || [])
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
