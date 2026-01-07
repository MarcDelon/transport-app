'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { User, LogOut, Settings, Menu, X, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'

export default function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link href="/" className="hover:opacity-80 transition">
            <Logo showText={true} size="md" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-lg transition font-medium ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Accueil
            </Link>
            <Link 
              href="/trajets" 
              className={`px-3 py-2 rounded-lg transition font-medium ${
                isActive('/trajets') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Trajets
            </Link>
            <Link 
              href="/reservation" 
              className={`px-3 py-2 rounded-lg transition font-medium ${
                isActive('/reservation') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Réservation
            </Link>

            {status === 'loading' ? (
              <div className="text-gray-500">Chargement...</div>
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-md font-semibold text-xs sm:text-sm windows-button"
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
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                      </div>
                      {session.user.role === 'ADMIN' ? (
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Dashboard Admin
                        </Link>
                      ) : (
                        <Link
                          href="/client/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
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
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition"
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
                className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-md font-semibold text-xs sm:text-sm windows-button"
              >
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Connexion</span>
                <span className="sm:hidden">Connexion</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition ${
                  isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Accueil
              </Link>
              <Link
                href="/trajets"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition ${
                  isActive('/trajets') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Trajets
              </Link>
              <Link
                href="/reservation"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition ${
                  isActive('/reservation') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Réservation
              </Link>
              {session ? (
                <>
                  <div className="px-4 py-2 border-b border-gray-200 mb-2">
                    <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                  </div>
                  {session.user.role === 'ADMIN' ? (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Dashboard Admin
                    </Link>
                  ) : (
                    <Link
                      href="/client/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Mon Profil
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/' })
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  href="/connexion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg bg-blue-600 text-white text-center font-semibold windows-button"
                >
                  Connexion
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
