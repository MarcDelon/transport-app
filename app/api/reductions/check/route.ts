import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// POST - Vérifier les réductions applicables
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
    const { nombrePlaces, montantBase, codePromo } = body

    console.log('🎫 Vérification réductions:', { nombrePlaces, montantBase, codePromo })

    let reductionAppliquee = 0
    let typeReduction = ''
    let messageReduction = ''

    // 1. Réduction groupe (5 places ou plus : 10%)
    if (nombrePlaces >= 5) {
      reductionAppliquee = 10
      typeReduction = 'GROUPE'
      messageReduction = 'Réduction groupe (5+ places) : -10%'
    }

    // 2. Vérifier si l'utilisateur a un abonnement actif
    const { data: abonnement } = await supabase
      .from('Abonnement')
      .select('*')
      .eq('userId', session.user.id)
      .gte('dateFin', new Date().toISOString())
      .order('dateFin', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (abonnement && abonnement.reduction > reductionAppliquee) {
      reductionAppliquee = abonnement.reduction
      typeReduction = abonnement.type
      messageReduction = `Abonnement ${abonnement.type} : -${abonnement.reduction}%`
    }

    // 3. Vérifier un code promo
    if (codePromo) {
      const { data: reduction } = await supabase
        .from('Reduction')
        .select('*')
        .eq('code', codePromo.toUpperCase())
        .gte('dateExpiration', new Date().toISOString())
        .single()

      if (reduction && reduction.pourcentage > reductionAppliquee) {
        reductionAppliquee = reduction.pourcentage
        typeReduction = reduction.type
        messageReduction = `Code promo "${codePromo}" : -${reduction.pourcentage}%`
      } else if (!reduction) {
        return NextResponse.json({
          error: 'Code promo invalide ou expiré'
        }, { status: 400 })
      }
    }

    // Calculer le montant final
    const montantReduction = (montantBase * reductionAppliquee) / 100
    const montantFinal = montantBase - montantReduction

    console.log('✅ Réduction appliquée:', {
      reductionAppliquee,
      typeReduction,
      montantReduction,
      montantFinal
    })

    return NextResponse.json({
      reductionAppliquee,
      typeReduction,
      messageReduction,
      montantBase,
      montantReduction,
      montantFinal,
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
