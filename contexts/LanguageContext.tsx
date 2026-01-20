'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Language = 'fr' | 'en'

interface Translations {
  [key: string]: {
    fr: string
    en: string
  }
}

const translations: Translations = {
  // Navigation
  'nav.home': { fr: 'Accueil', en: 'Home' },
  'nav.routes': { fr: 'Trajets', en: 'Routes' },
  'nav.reservation': { fr: 'Réservation', en: 'Booking' },
  'nav.login': { fr: 'Connexion', en: 'Login' },
  'nav.register': { fr: 'Inscription', en: 'Register' },
  'nav.profile': { fr: 'Mon Profil', en: 'My Profile' },
  'nav.myReservations': { fr: 'Mes Réservations', en: 'My Bookings' },
  'nav.logout': { fr: 'Déconnexion', en: 'Logout' },
  'nav.admin': { fr: 'Administration', en: 'Admin Panel' },

  // Hero Section
  'hero.title': { fr: 'Voyagez en toute sérénité', en: 'Travel with peace of mind' },
  'hero.subtitle': { fr: 'Réservez vos billets de bus en quelques clics. Confort, sécurité et ponctualité garantis.', en: 'Book your bus tickets in just a few clicks. Comfort, safety and punctuality guaranteed.' },
  'hero.cta': { fr: 'Réserver maintenant', en: 'Book now' },
  'hero.explore': { fr: 'Explorer les trajets', en: 'Explore routes' },

  // Search Form
  'search.departure': { fr: 'Ville de départ', en: 'Departure city' },
  'search.arrival': { fr: "Ville d'arrivée", en: 'Arrival city' },
  'search.date': { fr: 'Date de voyage', en: 'Travel date' },
  'search.placeholder': { fr: 'Tapez ou sélectionnez une ville', en: 'Type or select a city' },
  'search.button': { fr: 'Rechercher des trajets', en: 'Search routes' },
  'search.searching': { fr: 'Recherche en cours...', en: 'Searching...' },

  // Features
  'features.title': { fr: 'Pourquoi choisir NOVA ?', en: 'Why choose NOVA?' },
  'features.comfort.title': { fr: 'Confort Premium', en: 'Premium Comfort' },
  'features.comfort.desc': { fr: 'Sièges spacieux, climatisation et WiFi gratuit à bord', en: 'Spacious seats, air conditioning and free WiFi on board' },
  'features.safety.title': { fr: 'Sécurité Maximale', en: 'Maximum Safety' },
  'features.safety.desc': { fr: 'Conducteurs expérimentés et véhicules régulièrement entretenus', en: 'Experienced drivers and regularly maintained vehicles' },
  'features.punctuality.title': { fr: 'Ponctualité', en: 'Punctuality' },
  'features.punctuality.desc': { fr: 'Respect des horaires pour une expérience sans stress', en: 'Schedule adherence for a stress-free experience' },
  'features.price.title': { fr: 'Prix Compétitifs', en: 'Competitive Prices' },
  'features.price.desc': { fr: 'Les meilleurs tarifs du marché avec des réductions régulières', en: 'Best market rates with regular discounts' },

  // Stats
  'stats.passengers': { fr: 'Passagers transportés', en: 'Passengers transported' },
  'stats.destinations': { fr: 'Destinations', en: 'Destinations' },
  'stats.buses': { fr: 'Bus modernes', en: 'Modern buses' },
  'stats.satisfaction': { fr: 'Satisfaction client', en: 'Customer satisfaction' },

  // Reservation
  'reservation.title': { fr: 'Réservez votre billet', en: 'Book your ticket' },
  'reservation.subtitle': { fr: 'Trouvez et réservez le trajet parfait pour votre voyage avec NOVA', en: 'Find and book the perfect trip for your journey with NOVA' },
  'reservation.available': { fr: 'Horaires disponibles', en: 'Available schedules' },
  'reservation.found': { fr: 'trajet(s) trouvé(s)', en: 'route(s) found' },
  'reservation.noResults': { fr: 'Aucun horaire disponible', en: 'No schedule available' },
  'reservation.book': { fr: 'Réserver', en: 'Book' },
  'reservation.seats': { fr: 'places disponibles', en: 'seats available' },
  'reservation.perPerson': { fr: 'par personne', en: 'per person' },

  // Routes
  'routes.title': { fr: 'Nos Trajets', en: 'Our Routes' },
  'routes.subtitle': { fr: 'Découvrez toutes nos destinations à travers le Sénégal', en: 'Discover all our destinations across Senegal' },
  'routes.from': { fr: 'De', en: 'From' },
  'routes.to': { fr: 'À', en: 'To' },
  'routes.duration': { fr: 'Durée', en: 'Duration' },
  'routes.distance': { fr: 'Distance', en: 'Distance' },
  'routes.price': { fr: 'À partir de', en: 'From' },

  // Auth
  'auth.login.title': { fr: 'Connexion', en: 'Login' },
  'auth.login.subtitle': { fr: 'Connectez-vous à votre compte NOVA', en: 'Sign in to your NOVA account' },
  'auth.register.title': { fr: 'Inscription', en: 'Register' },
  'auth.register.subtitle': { fr: 'Créez votre compte NOVA', en: 'Create your NOVA account' },
  'auth.email': { fr: 'Adresse email', en: 'Email address' },
  'auth.password': { fr: 'Mot de passe', en: 'Password' },
  'auth.confirmPassword': { fr: 'Confirmer le mot de passe', en: 'Confirm password' },
  'auth.firstName': { fr: 'Prénom', en: 'First name' },
  'auth.lastName': { fr: 'Nom', en: 'Last name' },
  'auth.phone': { fr: 'Téléphone', en: 'Phone' },
  'auth.loginButton': { fr: 'Se connecter', en: 'Sign in' },
  'auth.registerButton': { fr: "S'inscrire", en: 'Sign up' },
  'auth.noAccount': { fr: "Pas encore de compte ?", en: "Don't have an account?" },
  'auth.hasAccount': { fr: 'Déjà un compte ?', en: 'Already have an account?' },
  'auth.forgotPassword': { fr: 'Mot de passe oublié ?', en: 'Forgot password?' },
  'auth.required': { fr: 'Connexion requise', en: 'Login required' },
  'auth.requiredMessage': { fr: 'Vous devez être connecté pour réserver un billet.', en: 'You must be logged in to book a ticket.' },
  'auth.idNumber': { fr: "Numéro de pièce d'identité (optionnel)", en: 'ID number (optional)' },
  'auth.createAccount': { fr: 'Créer le compte', en: 'Create account' },

  // Footer
  'footer.description': { fr: 'Votre partenaire de confiance pour tous vos voyages en bus à travers le Sénégal.', en: 'Your trusted partner for all your bus travels across Senegal.' },
  'footer.quickLinks': { fr: 'Liens rapides', en: 'Quick Links' },
  'footer.contact': { fr: 'Contact', en: 'Contact' },
  'footer.followUs': { fr: 'Suivez-nous', en: 'Follow us' },
  'footer.rights': { fr: 'Tous droits réservés.', en: 'All rights reserved.' },

  // Common
  'common.loading': { fr: 'Chargement...', en: 'Loading...' },
  'common.error': { fr: 'Une erreur est survenue', en: 'An error occurred' },
  'common.success': { fr: 'Succès', en: 'Success' },
  'common.cancel': { fr: 'Annuler', en: 'Cancel' },
  'common.confirm': { fr: 'Confirmer', en: 'Confirm' },
  'common.save': { fr: 'Enregistrer', en: 'Save' },
  'common.delete': { fr: 'Supprimer', en: 'Delete' },
  'common.edit': { fr: 'Modifier', en: 'Edit' },
  'common.close': { fr: 'Fermer', en: 'Close' },
  'common.back': { fr: 'Retour', en: 'Back' },
  'common.next': { fr: 'Suivant', en: 'Next' },
  'common.previous': { fr: 'Précédent', en: 'Previous' },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang) {
      setLanguageState(savedLang)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('language', language)
      document.documentElement.lang = language
    }
  }, [language, mounted])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const t = (key: string): string => {
    const translation = translations[key]
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }
    return translation[language]
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
