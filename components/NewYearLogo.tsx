"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { useEffect, useState } from "react"

interface NewYearLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export default function NewYearLogo({ className = "", size = "md" }: NewYearLogoProps) {
  const [shouldShow, setShouldShow] = useState(true)

  useEffect(() => {
    // Hide New Year logo after February 1st, 2026
    const cutoffDate = new Date("2026-02-01").getTime()
    const now = new Date().getTime()
    setShouldShow(now <= cutoffDate)
  }, [])

  const sizes = {
    sm: "w-10 h-10 sm:w-12 sm:h-12",
    md: "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20",
    lg: "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32",
  }

  if (!shouldShow) return null

  return (
    <div className={`relative inline-block ${sizes[size]} ${className}`}>
      {/* Main logo circle with New Year colors */}
      <motion.div
        animate={{
          boxShadow: [
            "0 0 20px rgba(34, 197, 94, 0.6), 0 0 40px rgba(168, 85, 247, 0.4)",
            "0 0 40px rgba(168, 85, 247, 0.6), 0 0 60px rgba(34, 197, 94, 0.4)",
            "0 0 20px rgba(34, 197, 94, 0.6), 0 0 40px rgba(168, 85, 247, 0.4)",
          ],
        }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        className="relative w-full h-full rounded-full bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600 p-[2px]"
      >
        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
          {/* Logo text */}
          <div className="text-center">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="font-bold flex items-center justify-center gap-0.5"
            >
              <span className="text-cyan-400 text-xs sm:text-sm md:text-xl">A</span>
              <span className="text-purple-400 text-xs sm:text-sm md:text-xl">M</span>
              <span className="text-blue-400 text-xs sm:text-sm md:text-xl">T</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Decorative stars */}
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="absolute -top-1 -right-1"
      >
        <Star className="w-2.5 h-2.5 sm:w-4 sm:h-4 md:w-6 md:h-6 text-cyan-400 fill-cyan-400" />
      </motion.div>

      <motion.div
        animate={{ rotate: -360, scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear", delay: 0.5 }}
        className="absolute -bottom-1 -left-1"
      >
        <Star className="w-2 h-2 sm:w-3 sm:h-3 md:w-5 md:h-5 text-purple-400 fill-purple-400" />
      </motion.div>
    </div>
  )
}
