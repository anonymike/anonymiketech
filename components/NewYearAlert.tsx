"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, Star, Zap } from "lucide-react"

export default function NewYearAlert() {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldShowAlert, setShouldShowAlert] = useState(true)

  useEffect(() => {
    // Check if we should show the New Year alert
    // It should hide after February 1st, 2026
    const cutoffDate = new Date("2026-02-01").getTime()
    const now = new Date().getTime()

    if (now > cutoffDate) {
      setShouldShowAlert(false)
      return
    }

    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, 800)

    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, 8800)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!shouldShowAlert) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={handleClose}
          />

          {/* New Year Alert Card */}
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90%] max-w-lg"
          >
            <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-[3px] rounded-2xl shadow-2xl">
              {/* Animated border glow */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 30px rgba(168, 85, 247, 0.8), 0 0 60px rgba(34, 197, 94, 0.6)",
                    "0 0 60px rgba(34, 197, 94, 0.8), 0 0 90px rgba(168, 85, 247, 0.6)",
                    "0 0 30px rgba(168, 85, 247, 0.8), 0 0 60px rgba(34, 197, 94, 0.6)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute inset-0 rounded-2xl"
              />

              <div className="relative bg-slate-900 rounded-2xl overflow-hidden">
                {/* Animated sparkles background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {Array.from({ length: 30 }, (_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: -20, x: Math.random() * 400, opacity: 0 }}
                      animate={{
                        y: 600,
                        x: Math.random() * 400 + Math.sin(i) * 50,
                        opacity: [0, 1, 0],
                        rotate: 360,
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: Math.random() * 2,
                        ease: "linear",
                      }}
                      className="absolute"
                    >
                      <Sparkles className="w-3 h-3 text-white" />
                    </motion.div>
                  ))}
                </div>

                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all duration-300 group"
                >
                  <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Content */}
                <div className="relative p-8 text-center">
                  {/* Animated celebration icon */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="mb-6 inline-block"
                  >
                    <div className="relative">
                      <Zap className="w-20 h-20 text-yellow-400 mx-auto" strokeWidth={2} />
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                        className="absolute -top-2 -right-2"
                      >
                        <Star className="w-8 h-8 text-cyan-400 fill-cyan-400" />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                  >
                    Happy New Year 2026!
                  </motion.h2>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg sm:text-xl text-white/90 mb-4 font-medium"
                  >
                    Welcome to a Year of Innovation
                  </motion.p>

                  {/* Message */}
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm sm:text-base text-white/70 mb-6 leading-relaxed px-4"
                  >
                    Step into 2026 with cutting-edge tech solutions and exclusive New Year deals. Transform your digital
                    presence with AnonyMikeTech!
                  </motion.p>

                  {/* Special offer badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="inline-block"
                  >
                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 px-6 py-3 rounded-full font-bold text-sm sm:text-base shadow-lg">
                      🎉 New Year Exclusive Offers Live
                    </div>
                  </motion.div>

                  {/* Decorative elements */}
                  <div className="mt-6 flex justify-center gap-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Star className="w-6 h-6 text-cyan-400 fill-cyan-400" />
                    </motion.div>
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Star className="w-6 h-6 text-purple-400 fill-purple-400" />
                    </motion.div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Star className="w-6 h-6 text-blue-400 fill-blue-400" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
