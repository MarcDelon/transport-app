import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { supabase } from './supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Normaliser l'email (lowercase et trim)
        const normalizedEmail = credentials.email.trim().toLowerCase()

        const { data: user, error } = await supabase
          .from('User')
          .select('*')
          .eq('email', normalizedEmail)
          .single()

        if (error) {
          console.error('Erreur Supabase lors de la connexion:', error)
          console.error('Code erreur:', error.code)
          console.error('Message erreur:', error.message)
          return null
        }

        if (!user) {
          console.error('Aucun utilisateur trouvé avec cet email:', normalizedEmail)
          return null
        }

        console.log('Utilisateur trouvé:', { id: user.id, email: user.email, role: user.role })

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          console.error('Mot de passe incorrect pour:', normalizedEmail)
          return null
        }

        console.log('Connexion réussie pour:', normalizedEmail)
        console.log('Données utilisateur retournées:', {
          id: user.id,
          email: user.email,
          role: user.role,
          name: `${user.prenom} ${user.nom}`
        })

        const userData = {
          id: user.id,
          email: user.email,
          role: user.role,
          name: `${user.prenom} ${user.nom}`
        }

        console.log('Retour de authorize:', userData)
        return userData
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('JWT callback - User reçu:', user)
        token.role = (user as any).role
        token.id = (user as any).id
        token.email = user.email
        console.log('JWT callback - Token mis à jour:', { role: token.role, id: token.id, email: token.email })
      }
      return token
    },
    async session({ session, token }) {
      console.log('Session callback - Token:', token)
      if (session.user && token) {
        const tokenAny = token as any
        const userAny = session.user as any
        userAny.role = tokenAny.role || null
        userAny.id = tokenAny.id || tokenAny.sub || null
        console.log('Session callback - Session mise à jour:', {
          email: session.user.email,
          role: userAny.role,
          id: userAny.id
        })
      }
      return session
    }
  },
  pages: {
    signIn: '/connexion',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

