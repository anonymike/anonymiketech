"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

interface ChristmasLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export default function ChristmasLogo({ className = "", size = "md" }: ChristmasLogoProps) {
  const sizes = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
  }

  return (
    <div className={`relative inline-block ${sizes[size]} ${className}`}>
      {/* Main logo circle */}
      <motion.div
        animate={{
          boxShadow: [
            "0 0 20px rgba(220, 38, 38, 0.6), 0 0 40px rgba(34, 197, 94, 0.4)",
            "0 0 40px rgba(34, 197, 94, 0.6), 0 0 60px rgba(220, 38, 38, 0.4)",
            "0 0 20px rgba(220, 38, 38, 0.6), 0 0 40px rgba(34, 197, 94, 0.4)",
          ],
        }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        className="relative w-full h-full rounded-full bg-gradient-to-br from-red-600 via-green-600 to-red-700 p-[2px]"
      >
        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
          {/* Logo text */}
          <div className="text-center">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="font-bold"
            >
              <span className="text-red-500 text-xl sm:text-2xl">A</span>
              <span className="text-green-500 text-xl sm:text-2xl">M</span>
              <span className="text-red-500 text-xl sm:text-2xl">T</span>
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
        <Star className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400 fill-yellow-400" />
      </motion.div>

      <motion.div
        animate={{ rotate: -360, scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear", delay: 0.5 }}
        className="absolute -bottom-1 -left-1"
      >
        <Star className="w-3 h-3 sm:w-5 sm:h-5 text-green-400 fill-green-400" />
      </motion.div>
    </div>
  )
}
