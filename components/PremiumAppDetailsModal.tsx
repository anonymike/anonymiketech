"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, Star, Tag, Zap } from "lucide-react"
import { PremiumApp } from "@/lib/premium-apps-data"

interface PremiumAppDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  app: PremiumApp | null
  onInitiatePayment?: (app: PremiumApp) => void
}

export default function PremiumAppDetailsModal({
  isOpen,
  onClose,
  app,
  onInitiatePayment,
}: PremiumAppDetailsModalProps) {
  if (!app) return null

  const handleInitiatePayment = () => {
    if (onInitiatePayment) {
      onInitiatePayment(app)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
          >
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-green-500/40 rounded-lg shadow-2xl shadow-green-500/20">
              {/* Header */}
              <div className="sticky top-0 flex items-center justify-between p-6 border-b border-green-500/20 bg-slate-900/95 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{app.icon}</div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-green-400 font-mono">
                      {app.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400">{app.category}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-2 rounded-lg hover:bg-green-500/10 transition-colors text-slate-400 hover:text-green-400"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {app.isNew && (
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-500/20 border border-green-500/50 text-green-400">
                      ✨ NEW
                    </span>
                  )}
                  {app.isOffer && (
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-500/20 border border-red-500/50 text-red-400">
                      🔥 SPECIAL OFFER
                    </span>
                  )}
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-500/20 border border-blue-500/50 text-blue-400">
                    {app.category}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-bold text-green-400 mb-2 font-mono">Description</h3>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {app.longDescription}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-500/10 border border-green-500/30 rounded p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Download size={16} className="text-green-400" />
                      <span className="text-xs text-slate-400">Downloads</span>
                    </div>
                    <p className="text-lg font-bold text-green-400 font-mono">{app.downloads}+</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={16} className="text-blue-400" />
                      <span className="text-xs text-slate-400">Rating</span>
                    </div>
                    <p className="text-lg font-bold text-blue-400 font-mono">
                      {app.rating || "4.8"}/5
                    </p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={16} className="text-purple-400" />
                      <span className="text-xs text-slate-400">Status</span>
                    </div>
                    <p className="text-lg font-bold text-purple-400 font-mono">Active</p>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-bold text-green-400 mb-4 font-mono">
                    Key Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {app.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mt-0.5">
                          <span className="text-xs text-green-400 font-bold">✓</span>
                        </div>
                        <span className="text-sm sm:text-base text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t border-green-500/20 pt-6">
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Total Price</p>
                        {app.isOffer && app.offerPrice ? (
                          <div className="flex items-center gap-3">
                            <span className="text-2xl sm:text-3xl font-bold text-green-400 font-mono">
                              KSH {app.offerPrice}
                            </span>
                            <span className="text-lg text-slate-500 line-through">
                              KSH {app.price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-2xl sm:text-3xl font-bold text-green-400 font-mono">
                            KSH {app.price}
                          </span>
                        )}
                      </div>
                      <div className="text-4xl">💚</div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Secure payment via M-Pesa • Instant delivery after confirmation
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 flex gap-3 p-6 border-t border-green-500/20 bg-slate-900/95 backdrop-blur">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors font-mono text-sm font-bold"
                >
                  Close
                </button>
                <button
                  onClick={handleInitiatePayment}
                  className="flex-1 px-4 py-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30 transition-colors font-mono text-sm font-bold"
                >
                  Initiate Payment
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
