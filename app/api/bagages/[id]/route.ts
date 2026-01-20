import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

// DELETE - Supprimer un bagage
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    // Vérifier que le bagage appartient à l'utilisateur
    const { data: bagage } = await supabase
      .from('Bagage')
      .select(`
        *,
        reservation:Reservation!reservationId (userId)
      `)
      .eq('id', params.id)
      .single()

    if (!bagage) {
      return NextResponse.json(
        { error: 'Bagage non trouvé' },
        { status: 404 }
      )
    }

    if ((bagage.reservation as any).userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('Bagage')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('❌ Erreur suppression bagage:', error)
      throw error
    }

    console.log('✅ Bagage supprimé:', params.id)
    return NextResponse.json({ message: 'Bagage supprimé avec succès' })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
