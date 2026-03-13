"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, AlertCircle, Clock } from "lucide-react"
import { useState, useEffect } from "react"

export default function InternetServicesAlertModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if modal was already shown this session
    const hasShownModal = sessionStorage.getItem("internetServices_AlertShown")
    if (!hasShownModal) {
      setIsOpen(true)
      sessionStorage.setItem("internetServices_AlertShown", "true")
    }
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="relative bg-gradient-to-b from-slate-900 to-black border-2 border-cyan-500/50 rounded-lg p-8 shadow-2xl shadow-cyan-500/20">
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <X size={24} />
              </button>

              {/* Content */}
              <div className="text-center space-y-6">
                {/* Icon */}
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="flex justify-center"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full"></div>
                    <AlertCircle size={64} className="text-cyan-400 relative" />
                  </div>
                </motion.div>

                {/* Title */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-2 font-mono">
                    SERVICE NOTICE
                  </h2>
                  <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                </div>

                {/* Message */}
                <div className="space-y-4">
                  <p className="text-cyan-300 text-lg font-semibold flex items-center justify-center gap-2">
                    <Clock size={20} />
                    Our Internet Services Will Resume Soon
                  </p>
                  <p className="text-cyan-200 text-sm leading-relaxed">
                    We're currently upgrading our infrastructure to provide you with faster and more reliable connectivity. Thank you for your patience!
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-3">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    className="w-2 h-2 bg-yellow-400 rounded-full"
                  ></motion.div>
                  <span className="text-cyan-300 text-sm">Status: Maintenance in Progress</span>
                </div>

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border border-cyan-400/50 text-cyan-300 hover:text-cyan-200 font-mono font-bold transition-all hover:border-cyan-400"
                >
                  Proceed to Services
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
