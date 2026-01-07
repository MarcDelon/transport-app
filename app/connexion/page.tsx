'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, CheckCircle } from 'lucide-react'
import Logo from '@/components/Logo'

export default function ConnexionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Récupérer le paramètre redirect depuis l'URL
  const redirect = searchParams?.get('redirect') || null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const normalizedEmail = email.trim().toLowerCase()
      console.log('Tentative de connexion avec:', normalizedEmail)
      
      const result = await signIn('credentials', {
        email: normalizedEmail,
        password,
        redirect: false,
      })

      console.log('Résultat de signIn:', result)
      console.log('Result OK:', result?.ok)
      console.log('Result Error:', result?.error)
      console.log('Result URL:', result?.url)

      if (result?.error) {
        console.error('Erreur de connexion:', result.error)
        setError('Email ou mot de passe incorrect')
        setLoading(false)
        return
      }

      if (result?.ok) {
        // Afficher un message de succès
        setError('')
        setSuccess(true)
        
        // Attendre un peu pour que la session soit mise à jour
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Récupérer la session pour vérifier le rôle
        const response = await fetch('/api/auth/session')
        const session = await response.json()
        
        console.log('Session récupérée:', session)

        // Rediriger selon le paramètre redirect ou le rôle
        if (redirect) {
          window.location.href = redirect
        } else if (session?.user?.role === 'ADMIN') {
          window.location.href = '/admin/dashboard'
        } else {
          window.location.href = '/client/dashboard'
        }
      } else {
        console.error('Connexion échouée, résultat:', result)
        setError(result?.error === 'CredentialsSignin' 
          ? 'Email ou mot de passe incorrect' 
          : result?.error || 'Une erreur est survenue lors de la connexion')
        setSuccess(false)
      }
    } catch (err: any) {
      console.error('Erreur lors de la connexion:', err)
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center mb-6">
            <Logo showText={true} size="lg" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connectez-vous à votre compte NOVA
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link href="/inscription" className="font-medium text-blue-600 hover:text-blue-500">
              créez un nouveau compte
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Connexion réussie ! Redirection en cours...</span>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-blue-700 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm windows-button"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


