'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { User, LogOut, Settings, Menu, X, ChevronDown, Sun, Moon, Globe } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="w-full px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="hover:opacity-80 transition">
            <Logo showText={true} size="md" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-xl transition-all font-medium ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link 
              href="/trajets" 
              className={`px-4 py-2 rounded-xl transition-all font-medium ${
                isActive('/trajets') 
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {t('nav.routes')}
            </Link>
            <Link 
              href="/reservation" 
              className={`px-4 py-2 rounded-xl transition-all font-medium ${
                isActive('/reservation') 
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {t('nav.reservation')}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium uppercase">{language}</span>
              </button>
              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                  >
                    <button
                      onClick={() => { setLanguage('fr'); setLangMenuOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        language === 'fr' ? 'text-blue-600 font-medium' : 'text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      🇫🇷 Français
                    </button>
                    <button
                      onClick={() => { setLanguage('en'); setLangMenuOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        language === 'en' ? 'text-blue-600 font-medium' : 'text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      🇬🇧 English
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {status === 'loading' ? (
              <div className="text-gray-500">Chargement...</div>
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 apple-button apple-button-primary text-white px-4 py-2 font-semibold text-sm"
                >
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline max-w-[120px] truncate">{session.user.name || session.user.email}</span>
                  <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-apple-lg shadow-apple-lg border border-apple-gray-200 py-2 z-50"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <div className="px-4 py-3 border-b border-apple-gray-200">
                        <p className="text-sm font-semibold text-apple-gray-900">{session.user.name}</p>
                        <p className="text-xs text-apple-gray-600 truncate">{session.user.email}</p>
                      </div>
                      {session.user.role === 'ADMIN' ? (
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center gap-2 px-4 py-2.5 text-apple-gray-900 hover:bg-apple-gray-50 hover:text-apple-blue transition-all"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Dashboard Admin
                        </Link>
                      ) : (
                        <Link
                          href="/client/dashboard"
                          className="flex items-center gap-2 px-4 py-2.5 text-apple-gray-900 hover:bg-apple-gray-50 hover:text-apple-blue transition-all"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Mon Profil
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false)
                          signOut({ callbackUrl: '/' })
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/connexion"
                className="flex items-center gap-2 apple-button apple-button-primary text-white px-6 py-2 font-semibold text-sm"
              >
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Connexion</span>
                <span className="sm:hidden">Connexion</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay pour fermer le menu profil */}
      {profileMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl transition-all ${
                  isActive('/') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {t('nav.home')}
              </Link>
              <Link
                href="/trajets"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl transition-all ${
                  isActive('/trajets') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {t('nav.routes')}
              </Link>
              <Link
                href="/reservation"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl transition-all ${
                  isActive('/reservation') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {t('nav.reservation')}
              </Link>

              {/* Language selector mobile */}
              <div className="flex items-center gap-2 px-4 py-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <button
                  onClick={() => setLanguage('fr')}
                  className={`px-3 py-1 rounded-lg text-sm ${language === 'fr' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
                >
                  FR
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-lg text-sm ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
                >
                  EN
                </button>
              </div>

              {session ? (
                <>
                  <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 mt-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{session.user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user.email}</p>
                  </div>
                  {session.user.role === 'ADMIN' ? (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Settings className="w-4 h-4" />
                      {t('nav.admin')}
                    </Link>
                  ) : (
                    <Link
                      href="/client/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <User className="w-4 h-4" />
                      {t('nav.profile')}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/' })
                      setMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <Link
                  href="/connexion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl bg-blue-600 text-white text-center font-semibold hover:bg-blue-700 transition"
                >
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
