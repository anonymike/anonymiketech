'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function ChatbotsPromoBanner() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Don't show banner on valentine view pages
    if (pathname?.includes('/valentine/view')) {
      return
    }

    // Check if user has dismissed the banner
    const hasDismissedBanner = localStorage.getItem('anonymiketech_promo_banner_dismissed')

    if (!hasDismissedBanner) {
      // Show banner after cookie consent appears (2.5 seconds delay)
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [pathname])

  const handleDismiss = () => {
    // Store dismissal for 7 days
    const dismissUntil = new Date()
    dismissUntil.setDate(dismissUntil.getDate() + 7)
    localStorage.setItem('anonymiketech_promo_banner_dismissed', dismissUntil.toISOString())
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="ChatbotsPromoBanner fixed bottom-24 left-4 right-4 md:bottom-32 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl z-30"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-900/40 via-blue-900/40 to-purple-900/40 backdrop-blur-xl border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20 p-6 md:p-8">
            {/* Animated Background Glow */}
            <motion.div
              animate={{
                x: [-100, 100],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
              className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-full blur-3xl opacity-30 pointer-events-none"
            />

            {/* Animated Border */}
            <motion.div
              animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 pointer-events-none"
            />

            <div className="relative z-10 flex items-start gap-4 md:gap-6">
              {/* Icon Container */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
                className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50"
              >
                <MessageCircle className="w-7 h-7 text-white" />
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg md:text-xl font-tech font-bold text-white mb-1"
                >
                  Empower Your Business with AI Chatbots
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm md:text-base text-gray-300 mb-4 line-clamp-2"
                >
                  Deploy powerful WhatsApp bots and live chat AI solutions. Start from just KES 100 and scale as you grow.
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href="/chatbots-ai"
                    onClick={handleDismiss}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-tech text-sm font-bold rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-400/70 group"
                  >
                    <Zap className="w-4 h-4 group-hover:animate-pulse" />
                    Explore Packages
                  </Link>
                </motion.div>
              </div>

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                onClick={handleDismiss}
                className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300"
                aria-label="Dismiss banner"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            {/* Pulse Indicator */}
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
              className="absolute top-3 right-3 w-2 h-2 rounded-full bg-cyan-400"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
