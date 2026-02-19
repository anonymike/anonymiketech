"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Check if user has already seen the welcome modal
    const hasSeenWelcome = localStorage.getItem("anonymiketech_welcome_shown")

    if (!hasSeenWelcome) {
      // Wait for other alerts (cookies, etc.) to potentially show first
      const timer = setTimeout(() => {
        setIsOpen(true)
        setHasShown(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (hasShown) {
      localStorage.setItem("anonymiketech_welcome_shown", "true")
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full mx-auto px-4 sm:px-6 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl"
          >
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-black rounded-lg sm:rounded-xl border border-cyan-500/30 overflow-hidden shadow-2xl shadow-cyan-500/20">
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10 md:py-12 lg:py-16">
                {/* Welcome text */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-6 sm:mb-8"
                >
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-tech font-bold mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-200 bg-clip-text text-transparent">
                    WELCOME TO
                  </h2>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-tech font-bold mb-3 sm:mb-4 bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">
                    ANONYMIKETECH V2.0
                  </h1>
                </motion.div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center text-gray-300 mb-6 sm:mb-8 px-2 sm:px-0 max-w-xs sm:max-w-md mx-auto leading-relaxed text-sm sm:text-base font-light"
                >
                  Experience the next evolution of digital innovation. Explore cutting-edge solutions designed to transform your business and unlock unlimited potential.
                </motion.p>

                {/* Features list */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10"
                >
                  {[
                    "Next-Gen Security",
                    "Global Connectivity",
                    "Advanced Analytics",
                    "24/7 Support",
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-cyan-500/5 border border-cyan-400/20 hover:border-cyan-400/40 transition-all"
                    >
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 flex-shrink-0"></div>
                      <span className="text-xs sm:text-sm text-cyan-300 font-tech">{feature}</span>
                    </div>
                  ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center"
                >
                  <button
                    onClick={handleClose}
                    className="px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-tech font-bold text-xs sm:text-sm text-hacker-terminal bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/50 transition-all border-2 border-transparent hover:border-cyan-400"
                  >
                    Explore Now
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-tech font-bold text-xs sm:text-sm text-cyan-400 border-2 border-cyan-400/50 hover:border-cyan-400 hover:bg-cyan-400/5 transition-all"
                  >
                    Skip
                  </button>
                </motion.div>

                {/* Close button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={handleClose}
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-full bg-slate-700/50 hover:bg-slate-600 border border-cyan-400/30 hover:border-cyan-400 transition-all text-cyan-400 text-lg sm:text-xl font-light"
                  aria-label="Close modal"
                >
                  ×
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
