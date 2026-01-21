'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Bus, MapPin, Clock, Shield, Ticket, Users, Star, ArrowRight, CheckCircle, TrendingUp, Wifi, Snowflake, Headphones } from 'lucide-react'
import { motion } from 'framer-motion'
import Logo from '@/components/Logo'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Home() {
  const { t, language } = useLanguage()
  const features = [
    {
      icon: Bus,
      title: 'Véhicules Modernes',
      description: 'Voyagez en toute sécurité avec notre flotte de véhicules modernes et confortables',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Ticket,
      title: 'Réservation en Ligne',
      description: 'Réservez vos billets en quelques clics depuis votre appareil, 24/7',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Shield,
      title: 'Paiement Sécurisé',
      description: 'Plusieurs méthodes de paiement disponibles et sécurisées',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Users,
      title: 'Abonnements',
      description: 'Bénéficiez de réductions avec nos abonnements mensuels ou annuels',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: MapPin,
      title: 'Multiples Destinations',
      description: 'Accédez à de nombreuses villes avec nos trajets réguliers',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Clock,
      title: 'Horaires Flexibles',
      description: 'Plusieurs départs par jour pour s\'adapter à votre emploi du temps',
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  const stats = [
    { number: '50+', label: 'Villes desservies' },
    { number: '100+', label: 'Trajets quotidiens' },
    { number: '10K+', label: 'Clients satisfaits' },
    { number: '99%', label: 'Ponctualité' }
  ]

  const advantages = [
    'WiFi gratuit dans tous les véhicules',
    'Sièges confortables et spacieux',
    'Climatisation dans tous les bus',
    'Bagages inclus jusqu\'à 20kg',
    'Assistance 24/7',
    'Annulation gratuite jusqu\'à 24h avant'
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Hero Section avec image de fond */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-12 sm:py-16 md:py-24 overflow-hidden w-full">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-blue-800/50"></div>
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto w-full"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-4 sm:mb-6"
            >
              <Logo showText={true} size="lg" className="text-white" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-4">
              Voyagez en toute{' '}
              <span className="text-yellow-400">sérénité</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-blue-100 px-4 max-w-3xl mx-auto">
              Réservez vos billets de transport interurbain facilement et rapidement.
              Voyagez confortablement vers votre destination avec NOVA.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 max-w-md mx-auto sm:max-w-none">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link
                  href="/reservation"
                  className="bg-yellow-400 text-blue-900 px-6 sm:px-8 py-3.5 sm:py-4 font-semibold text-sm sm:text-base md:text-lg hover:bg-yellow-300 transition-all rounded-xl flex items-center gap-2 justify-center w-full sm:w-auto shadow-lg"
                >
                  Réserver maintenant
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link
                  href="/trajets"
                  className="bg-white/20 backdrop-blur-sm text-white px-6 sm:px-8 py-3.5 sm:py-4 font-semibold text-sm sm:text-base md:text-lg hover:bg-white/30 transition-all rounded-xl flex items-center gap-2 justify-center w-full sm:w-auto border border-white/30"
                >
                  Voir les trajets
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Formes décoratives */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-8 sm:py-12 md:py-16 bg-white dark:bg-gray-900 w-full overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section avec images */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 w-full overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
              {t('features.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
              {language === 'fr' ? 'Nous offrons le meilleur service de transport interurbain avec confort et sécurité' : 'We offer the best intercity transport service with comfort and safety'}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all group border border-gray-100 dark:border-gray-700"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-3 sm:p-4 mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section avec image et avantages */}
      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900 w-full overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-2 md:order-1"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80"
                  alt="Bus moderne"
                  width={800}
                  height={500}
                  className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
              </div>
              {/* Badge flottant */}
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-yellow-400 text-blue-900 px-4 py-3 sm:px-6 sm:py-4 rounded-xl shadow-xl">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                  <div>
                    <div className="font-bold text-xl sm:text-2xl">4.8/5</div>
                    <div className="text-xs sm:text-sm">Note moyenne</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
              {language === 'fr' ? 'Voyagez dans les meilleures conditions' : 'Travel in the best conditions'}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
                Nous mettons tout en œuvre pour rendre votre voyage agréable et mémorable.
                Découvrez tous les avantages inclus dans votre billet.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {advantages.map((advantage, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 sm:gap-3"
                  >
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{advantage}</span>
                  </motion.div>
                ))}
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 sm:mt-8"
              >
                <Link
                  href="/reservation"
                  className="inline-flex items-center gap-2 apple-button apple-button-primary text-white px-5 py-2.5 sm:px-6 sm:py-3 font-semibold text-sm sm:text-base"
                >
                  Réserver maintenant
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section témoignages */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
              {language === 'fr' ? 'Ce que disent nos clients' : 'What our customers say'}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 px-2">
              {language === 'fr' ? 'Des milliers de voyageurs nous font confiance chaque jour' : 'Thousands of travelers trust us every day'}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                name: 'Marie Dubois',
                role: 'Voyageuse régulière',
                comment: 'Service impeccable ! Les bus sont toujours à l\'heure et très confortables. Je recommande vivement.',
                rating: 5
              },
              {
                name: 'Jean Martin',
                role: 'Entrepreneur',
                comment: 'Parfait pour mes déplacements professionnels. Le WiFi fonctionne bien et les sièges sont spacieux.',
                rating: 5
              },
              {
                name: 'Sophie Laurent',
                role: 'Étudiante',
                comment: 'Prix très compétitifs et service client au top. J\'utilise leurs abonnements mensuels.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="flex gap-1 mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 italic">&quot;{testimonial.comment}&quot;</p>
                <div>
                  <div className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section finale */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-blue-800/60"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <TrendingUp className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 sm:mb-6 text-yellow-400" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2">
              Prêt à voyager ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-blue-100 max-w-2xl mx-auto px-2">
              Rejoignez des milliers de voyageurs satisfaits. Créez un compte gratuitement et commencez à réserver vos trajets dès aujourd’hui.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link
                  href="/inscription"
                  className="bg-yellow-400 text-blue-900 px-6 sm:px-8 py-3 sm:py-4 font-semibold text-base sm:text-lg hover:bg-yellow-300 transition-all apple-button inline-flex items-center gap-2 justify-center w-full sm:w-auto"
                >
                  Créer un compte gratuit
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link
                  href="/reservation"
                  className="apple-glass text-white px-6 sm:px-8 py-3 sm:py-4 font-semibold text-base sm:text-lg hover:bg-white/30 transition-all rounded-apple inline-flex items-center gap-2 justify-center w-full sm:w-auto border border-white/30"
                >
                  Réserver sans compte
                  <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
