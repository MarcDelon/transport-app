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

    const abonnements = await prisma.abonnement.findMany({
      include: {
        user: {
          select: {
            nom: true,
            prenom: true,
            email: true,
          },
        },
      },
      orderBy: {
        dateDebut: 'desc',
      },
    })

    return NextResponse.json(abonnements.map(a => ({
      id: a.id,
      type: a.type,
      dateDebut: a.dateDebut.toISOString(),
      dateFin: a.dateFin.toISOString(),
      reduction: a.reduction,
      trajetsInclus: a.trajetsInclus,
      user: a.user,
    })))
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}


