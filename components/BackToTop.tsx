"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp } from "lucide-react"

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
            boxShadow: [
              "0 0 5px hsl(var(--hacker-green)), 0 0 10px hsl(var(--hacker-green))",
              "0 0 10px hsl(var(--hacker-green)), 0 0 20px hsl(var(--hacker-green)), 0 0 30px hsl(var(--hacker-green))",
              "0 0 5px hsl(var(--hacker-green)), 0 0 10px hsl(var(--hacker-green))",
            ],
          }}
          exit={{ opacity: 0, scale: 0, rotate: 180 }}
          whileHover={{
            scale: 1.1,
            rotate: [0, -10, 10, 0],
            boxShadow: "0 0 20px hsl(var(--hacker-green)), 0 0 40px hsl(var(--hacker-green))",
          }}
          whileTap={{ scale: 0.9 }}
          transition={{
            duration: 0.5,
            boxShadow: { duration: 2, repeat: Number.POSITIVE_INFINITY },
            rotate: { duration: 0.3 },
          }}
          onClick={scrollToTop}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 p-5 bg-gradient-to-br from-gray-900 to-black rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 group border-2 border-orange-500/30 hover:border-orange-500"
          aria-label="Back to top"
        >
          <motion.div
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <ChevronUp className="w-7 h-7 text-orange-500 group-hover:text-orange-400 transition-colors duration-300" />
          </motion.div>

          {/* Rotating Border Effect */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute inset-0 rounded-full overflow-hidden opacity-40 pointer-events-none"
          >
            <div className="absolute inset-0 bg-conic-gradient from-orange-500 via-transparent to-orange-500"></div>
          </motion.div>

          {/* Inner Glow Ring */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute inset-1 rounded-full border border-orange-500/50 pointer-events-none"
          />

          {/* Outer Pulse Ring */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full border-2 border-orange-500/40 pointer-events-none"
          />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
