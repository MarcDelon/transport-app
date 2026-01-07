import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const paiements = await prisma.paiement.findMany({
      include: {
        user: {
          select: {
            nom: true,
            prenom: true,
            email: true,
          },
        },
        reservation: {
          include: {
            horaire: {
              include: {
                trajet: {
                  select: {
                    villeDepart: true,
                    villeArrivee: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        datePaiement: 'desc',
      },
    })

    const totalRevenus = paiements.reduce((sum, p) => sum + p.montant, 0)

    return NextResponse.json({
      paiements: paiements.map(p => ({
        id: p.id,
        montant: p.montant,
        methodePaiement: p.methodePaiement,
        datePaiement: p.datePaiement.toISOString(),
        numeroFacture: p.numeroFacture,
        user: p.user,
        reservation: {
          id: p.reservation.id,
          nombrePlaces: p.reservation.nombrePlaces,
          horaire: {
            trajet: p.reservation.horaire.trajet,
          },
        },
      })),
      totalRevenus,
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}


