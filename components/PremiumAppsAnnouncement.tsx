'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function PremiumAppsAnnouncement() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Check if user has already seen the premium apps announcement
    const hasSeenPremiumAppsAnnouncement = localStorage.getItem('hasSeenPremiumAppsAnnouncement')

    if (!hasSeenPremiumAppsAnnouncement) {
      // Delay until homepage content is fully loaded (after 6-7 seconds of animations)
      const timer = setTimeout(() => {
        setIsOpen(true)
        setHasShown(true)
      }, 6500)

      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (hasShown) {
      localStorage.setItem('hasSeenPremiumAppsAnnouncement', 'true')
    }
  }, [hasShown])

  const handleClose = () => {
    setIsOpen(false)
  }

  // Recent premium apps releases
  const recentApps = [
    { icon: '💬', name: 'Telegram', version: 'v10.2', badge: 'NEW' },
    { icon: '🎵', name: 'Spotify', version: 'v9.1', badge: 'HOT' },
    { icon: '🎬', name: 'NetFlix', version: 'v8.5', badge: 'NEW' },
    { icon: '☎️', name: 'Truecaller', version: 'v7.3', badge: 'UPDATED' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Star Container with Rotating Star and Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full mx-auto px-4 sm:px-6"
          >
            {/* Rotating Star Background */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                {/* Star SVG */}
                <svg
                  className="w-full h-full text-hacker-green/30"
                  viewBox="0 0 200 200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M100,10 L130,80 L200,100 L130,120 L100,190 L70,120 L0,100 L70,80 Z" />
                </svg>
              </div>
            </motion.div>

            {/* Modal Card - Smaller and Centered */}
            <div className="relative z-10 max-w-xs sm:max-w-sm mx-auto">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative rounded-lg sm:rounded-2xl border border-hacker-green/60 overflow-hidden shadow-2xl shadow-hacker-green/40 bg-gradient-to-br from-hacker-terminal/98 to-hacker-terminal/95 backdrop-blur-xl p-5 sm:p-7"
              >
                {/* Animated corner accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-hacker-green/40 rounded-br-lg"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-hacker-green/40 rounded-tl-lg"></div>

                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 text-hacker-green-dim hover:text-hacker-green transition-colors z-20"
                  aria-label="Close announcement"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Header */}
                <div className="text-center mb-4 sm:mb-5">
                  <div className="flex items-center justify-center mb-2">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-hacker-green-bright" />
                    </motion.div>
                  </div>
                  <h2 className="text-lg sm:text-xl font-tech font-bold text-hacker-green-bright">
                    LATEST RELEASES
                  </h2>
                  <p className="text-xs sm:text-sm text-hacker-green-dim font-mono mt-1">
                    Premium Apps Store
                  </p>
                </div>

                {/* Recent Apps Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-6">
                  {recentApps.map((app) => (
                    <motion.div
                      key={app.name}
                      whileHover={{ scale: 1.05 }}
                      className="relative px-2 sm:px-3 py-3 rounded-lg border border-hacker-green/40 bg-hacker-green/5 hover:bg-hacker-green/10 hover:border-hacker-green/60 transition-all text-center cursor-pointer group"
                    >
                      <div className="text-2xl sm:text-3xl mb-1">{app.icon}</div>
                      <p className="text-xs font-tech text-hacker-green-bright font-semibold">{app.name}</p>
                      <p className="text-xs text-hacker-green-dim font-mono">{app.version}</p>
                      {app.badge && (
                        <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-tech font-bold rounded-full bg-hacker-green text-hacker-terminal">
                          {app.badge}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Pricing Info */}
                <div className="p-2.5 sm:p-3.5 rounded-lg border border-hacker-green/30 bg-hacker-green/5 backdrop-blur-sm mb-5 sm:mb-6">
                  <p className="text-xs sm:text-sm text-center text-hacker-green font-mono font-bold">
                    Affordable Prices Just for you • M-Pesa payment • Instant delivery
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-tech font-bold text-hacker-green border border-hacker-green/50 hover:border-hacker-green hover:bg-hacker-green/10 transition-all"
                  >
                    Later
                  </button>
                  <Link href="/premium-apps" className="flex-1">
                    <button className="w-full px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-tech font-bold text-hacker-terminal bg-gradient-to-r from-hacker-green to-emerald-400 hover:shadow-lg hover:shadow-hacker-green/50 transition-all">
                      Shop →
                    </button>
                  </Link>
                </div>

                {/* Footer */}
                <p className="text-center mt-3 sm:mt-4 text-xs text-hacker-green-dim font-mono">
                  {'// Latest mods at amazing prices'}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
