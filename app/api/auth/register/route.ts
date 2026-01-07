import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nom, prenom, email, telephone, password, pieceIdentite } = body

    // Validation des champs requis
    if (!nom || !prenom || !email || !telephone || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    // Validation du mot de passe
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser } = await supabase
      .from('User')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Générer un ID unique (format similaire à cuid)
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Créer l'utilisateur
    const { data: user, error } = await supabase
      .from('User')
      .insert({
        id: userId,
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.trim().toLowerCase(),
        telephone: telephone.trim(),
        password: hashedPassword,
        pieceIdentite: pieceIdentite ? pieceIdentite.trim() : null,
        role: 'CLIENT',
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur Supabase:', error)
      console.error('Détails de l\'erreur:', JSON.stringify(error, null, 2))
      
      // Code d'erreur PostgreSQL pour violation de contrainte unique
      if (error.code === '23505' || error.message?.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 400 }
        )
      }
      
      // Retourner le message d'erreur détaillé en développement
      const errorMessage = process.env.NODE_ENV === 'development' 
        ? error.message || 'Erreur lors de la création du compte'
        : 'Une erreur est survenue lors de la création du compte'
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Compte créé avec succès', userId: user.id },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Erreur lors de la création du compte:', error)
    console.error('Stack:', error.stack)
    
    // Message d'erreur plus détaillé en développement
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message || 'Une erreur est survenue lors de la création du compte'
      : 'Une erreur est survenue lors de la création du compte'
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}


