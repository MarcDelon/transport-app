'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, CheckCircle, Mail, Lock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Logo from '@/components/Logo'
import { useLanguage } from '@/contexts/LanguageContext'

function ConnexionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()

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
        } else if (session?.user?.role === 'CONDUCTEUR') {
          window.location.href = '/conducteur/dashboard'
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo showText={true} size="lg" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('auth.login.title')}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t('auth.login.subtitle')}
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
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link href="#" className="text-sm text-blue-600 hover:text-blue-500">
              {t('auth.forgotPassword')}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? t('common.loading') : t('auth.loginButton')}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('auth.noAccount')}{' '}
            <Link href="/inscription" className="font-medium text-blue-600 hover:text-blue-500">
              {t('auth.registerButton')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-xl">Chargement...</div>
      </div>
    }>
      <ConnexionForm />
    </Suspense>
  )
}


