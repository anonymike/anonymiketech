'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Feature, Shield, Star } from 'lucide-react'
import { PremiumApp } from '@/lib/premium-apps-data'

interface UpdatedAppOverlayProps {
  app: PremiumApp | null
  isOpen: boolean
  onClose: () => void
}

export default function UpdatedAppOverlay({ app, isOpen, onClose }: UpdatedAppOverlayProps) {
  if (!app) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />

          {/* Overlay Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-green-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-green-500/20">
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 z-10"
              >
                <X size={24} />
              </motion.button>

              {/* Content */}
              <div className="p-6 sm:p-10">
                {/* Badge Section */}
                <div className="flex gap-3 mb-6">
                  {app.isNew && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="px-3 py-1 text-xs font-bold rounded-full bg-green-500/20 border border-green-500/50 text-green-400 animate-pulse"
                    >
                      🆕 NEW RELEASE
                    </motion.span>
                  )}
                  {app.isOffer && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="px-3 py-1 text-xs font-bold rounded-full bg-red-500/20 border border-red-500/50 text-red-400 animate-pulse"
                    >
                      🎉 LIMITED OFFER
                    </motion.span>
                  )}
                </div>

                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="text-6xl sm:text-7xl flex-shrink-0"
                    >
                      {app.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h2 className="text-3xl sm:text-4xl font-bold text-green-400 font-mono mb-2">
                        {app.name}
                      </h2>
                      <p className="text-sm text-green-300 font-mono">
                        {app.category}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
                    {app.longDescription}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                      <div className="text-2xl font-bold text-green-400 font-mono">
                        {app.downloads.toLocaleString()}
                      </div>
                      <p className="text-xs text-green-300 font-mono">Downloads</p>
                    </div>
                    <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                      <div className="text-2xl font-bold text-cyan-400 font-mono">
                        ⭐ 4.8
                      </div>
                      <p className="text-xs text-cyan-300 font-mono">Rating</p>
                    </div>
                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <div className="text-2xl font-bold text-emerald-400 font-mono">
                        {app.isOffer && app.offerPrice ? `KSH ${app.offerPrice}` : `KSH ${app.price}`}
                      </div>
                      <p className="text-xs text-emerald-300 font-mono">Price</p>
                    </div>
                  </div>

                  {/* Price Display */}
                  {app.isOffer && app.offerPrice && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 mb-6"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-red-400 font-bold text-lg">Special Offer:</span>
                        <span className="line-through text-slate-400 text-lg">KSH {app.price}</span>
                        <span className="text-green-400 font-bold text-2xl">KSH {app.offerPrice}</span>
                        <span className="text-yellow-400 font-bold text-sm">
                          ({Math.round(((app.price - app.offerPrice) / app.price) * 100)}% OFF)
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Features Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8"
                >
                  <h3 className="text-xl font-bold text-green-400 mb-4 font-mono flex items-center gap-2">
                    <Shield size={20} />
                    Premium Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {app.features && app.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20 hover:border-green-500/40 transition-all"
                      >
                        <Star className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 rounded-xl border-2 border-green-500/50 text-green-400 font-bold hover:bg-green-500/10 transition-all"
                  >
                    Back to Store
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-400 text-black font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all"
                  >
                    Get Now - {app.isOffer && app.offerPrice ? `KSH ${app.offerPrice}` : `KSH ${app.price}`}
                  </motion.button>
                </motion.div>

                {/* Footer Info */}
                <p className="text-center text-xs text-slate-500 mt-6 font-mono">
                  {'// Secure payment via M-Pesa | Instant delivery'}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
