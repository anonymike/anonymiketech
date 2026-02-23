'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap } from 'lucide-react'
import Link from 'next/link'

export default function PremiumAppsAnnouncement() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Check if user has already seen the premium apps announcement
    const hasSeenPremiumAppsAnnouncement = localStorage.getItem('hasSeenPremiumAppsAnnouncement')

    if (!hasSeenPremiumAppsAnnouncement) {
      // Wait for other popups/modals to finish (WelcomeModal, ValentinePopup, CookieConsent)
      // These typically show around 800-2000ms, so we add extra buffer
      const timer = setTimeout(() => {
        setIsOpen(true)
        setHasShown(true)
      }, 3500)

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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full mx-auto px-4 sm:px-6 max-w-sm sm:max-w-md md:max-w-lg"
          >
            <div className="relative rounded-lg sm:rounded-xl border border-hacker-green/50 overflow-hidden shadow-2xl shadow-hacker-green/30 bg-hacker-terminal/95 backdrop-blur-md">
              {/* Animated background glow */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-hacker-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-8">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 text-hacker-green-dim hover:text-hacker-green transition-colors"
                  aria-label="Close announcement"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Header with icon */}
                <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-hacker-green/20 border border-hacker-green/40">
                      <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-hacker-green-bright animate-pulse" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-2xl font-tech font-bold text-hacker-green-bright mb-1">
                      NEW FEATURE!
                    </h2>
                    <p className="text-xs sm:text-sm text-hacker-green-dim font-mono">
                      Premium Apps Store Now Available
                    </p>
                  </div>
                </div>

                {/* Main content */}
                <div className="mb-6 sm:mb-8">
                  <p className="text-sm sm:text-base text-hacker-green-bright mb-3 sm:mb-4 leading-relaxed">
                    We just launched our Premium Apps Store featuring the latest premium modifications of your favorite apps!
                  </p>

                  {/* Featured apps */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                    {[
                      { icon: '💬', name: 'Telegram Premium' },
                      { icon: '🎵', name: 'Spotify Premium' },
                      { icon: '🎬', name: 'Flix Vision' },
                      { icon: '☎️', name: 'Truecaller Pro' },
                    ].map((app) => (
                      <div
                        key={app.name}
                        className="px-2 sm:px-3 py-2 rounded border border-hacker-green/30 bg-hacker-terminal/50 hover:border-hacker-green/60 hover:bg-hacker-terminal/80 transition-all text-center"
                      >
                        <div className="text-base sm:text-lg mb-1">{app.icon}</div>
                        <p className="text-xs font-tech text-hacker-green-dim">{app.name}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 sm:p-4 rounded border border-hacker-green/20 bg-hacker-green/5 backdrop-blur-sm">
                    <p className="text-xs sm:text-sm text-hacker-green font-mono">
                      ✓ KSH 100 per app | ✓ M-Pesa payment | ✓ Instant access
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    onClick={handleClose}
                    className="px-3 sm:px-4 py-2 sm:py-3 rounded text-xs sm:text-sm font-tech font-bold text-hacker-green border border-hacker-green/50 hover:border-hacker-green hover:bg-hacker-green/10 transition-all"
                  >
                    Maybe Later
                  </button>
                  <Link href="/premium-apps">
                    <button className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded text-xs sm:text-sm font-tech font-bold text-hacker-terminal bg-gradient-to-r from-hacker-green to-emerald-400 hover:shadow-lg hover:shadow-hacker-green/50 transition-all">
                      Explore Now →
                    </button>
                  </Link>
                </div>

                {/* Footer text */}
                <p className="text-center mt-3 sm:mt-4 text-xs text-hacker-green-dim font-mono">
                  {'// Get premium mods at unbeatable prices'}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
