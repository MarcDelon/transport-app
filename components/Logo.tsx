'use client'

import { motion } from 'framer-motion'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' }
  }

  const currentSize = sizes[size]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cercle de fond avec gradient */}
          <defs>
            <linearGradient id="novaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
          </defs>
          
          {/* Cercle principal - garde la forme arrondie */}
          <circle cx="50" cy="50" r="45" fill="url(#novaGradient)" />
          
          {/* Étoile NOVA */}
          <path
            d="M50 20 L55 40 L75 40 L60 52 L65 72 L50 58 L35 72 L40 52 L25 40 L45 40 Z"
            fill="white"
            stroke="#fbbf24"
            strokeWidth="2"
          />
          
          {/* Lignes de vitesse */}
          <path
            d="M20 50 L30 50 M70 50 L80 50 M50 20 L50 30 M50 70 L50 80"
            stroke="#fbbf24"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
      
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent ${currentSize.text}`}>
          NOVA
        </span>
      )}
    </div>
  )
}

