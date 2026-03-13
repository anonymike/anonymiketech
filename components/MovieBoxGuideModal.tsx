"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, Play, Heart, ExternalLink, CheckCircle2 } from "lucide-react"
import { useState } from "react"

interface MovieBoxGuideModalProps {
  isOpen: boolean
  onClose: () => void
  onGiftUs?: (amount: number) => void
}

export default function MovieBoxGuideModal({ isOpen, onClose, onGiftUs }: MovieBoxGuideModalProps) {
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [donationAmount, setDonationAmount] = useState("50")

  const steps = [
    {
      number: 1,
      title: "Download MovieBox",
      description: "Download your movie from MovieBox. If you don't have the app, purchase our premium MovieBox app or visit their website.",
      link: "https://www.moviesbox.com.co/",
      linkText: "Visit MovieBox Website",
    },
    {
      number: 2,
      title: "Download Movie or Series",
      description: "Select and download your favorite movie or series of your choice from the MovieBox app.",
    },
    {
      number: 3,
      title: "Install Files App",
      description: "Install the Files Marc app from Google Play Store to manage downloaded files on your device.",
      link: "https://play.google.com/store/apps/details?id=com.marc.files",
      linkText: "Get Files App from Play Store",
    },
    {
      number: 4,
      title: "Locate Downloaded Files",
      description: "After installing the Files Marc app, open it and navigate to: android > data > com.community.mbox.in",
      description2: "You will see all the movies/series you downloaded from MovieBox.",
    },
    {
      number: 5,
      title: "Copy & Enjoy",
      description: "Copy the files to your desired location in your device and enjoy your movies/series offline!",
    },
  ]

  const donationOptions = [50, 100, 200, 500, 1000]

  const handleGiftClick = () => {
    if (onGiftUs && donationAmount) {
      onGiftUs(parseInt(donationAmount))
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
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-purple-500/40 rounded-xl shadow-2xl shadow-purple-500/20">
              {/* Header with Gradient Background */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-b border-purple-500/20 backdrop-blur">
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">🎬</div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-mono">
                        MovieBox Local Storage Guide
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">Save movies offline easily</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-purple-500/10 transition-colors text-slate-400 hover:text-purple-400"
                    aria-label="Close modal"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Info Banner */}
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-sm text-blue-200 flex items-start gap-2">
                    <span className="text-lg">💡</span>
                    <span>
                      Follow these simple steps to save your MovieBox downloads to your device's local storage and enjoy them offline anytime!
                    </span>
                  </p>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 hover:bg-slate-800/70 transition-all"
                    >
                      <div className="flex gap-4">
                        {/* Step Number */}
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm">
                            {step.number}
                          </div>
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 space-y-2">
                          <h3 className="font-bold text-purple-300 text-base sm:text-lg">
                            {step.title}
                          </h3>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {step.description}
                          </p>
                          {step.description2 && (
                            <p className="text-sm text-slate-300 leading-relaxed">
                              {step.description2}
                            </p>
                          )}
                          {step.link && (
                            <a
                              href={step.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-mono transition-colors mt-2"
                            >
                              <ExternalLink size={14} />
                              {step.linkText}
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Success Indicator */}
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-300">
                    <CheckCircle2 size={20} />
                    <span className="text-sm font-medium">You're all set! Enjoy your movies offline.</span>
                  </div>
                </div>
              </div>

              {/* Footer with Gift Button */}
              <div className="sticky bottom-0 bg-slate-900/95 border-t border-purple-500/20 backdrop-blur p-6 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors font-mono text-sm font-bold"
                >
                  Close
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDonationModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all font-mono text-sm font-bold shadow-lg shadow-purple-500/50"
                >
                  <Heart size={18} />
                  Gift Us
                </motion.button>
              </div>

              {/* Donation Modal */}
              <AnimatePresence>
                {showDonationModal && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowDonationModal(false)}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 rounded-xl"
                    />

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="absolute inset-0 z-50 flex items-center justify-center p-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="bg-slate-900 border border-purple-500/40 rounded-lg p-6 w-full max-w-sm shadow-2xl shadow-purple-500/20">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            Support Us ❤️
                          </h3>
                          <button
                            onClick={() => setShowDonationModal(false)}
                            className="p-1 hover:bg-purple-500/10 rounded transition-colors"
                          >
                            <X size={20} className="text-slate-400" />
                          </button>
                        </div>

                        <p className="text-sm text-slate-300 mb-4">
                          Help us keep improving MovieBox guides and other services. Your support means a lot!
                        </p>

                        {/* Quick Amount Buttons */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {donationOptions.map((amount) => (
                            <button
                              key={amount}
                              onClick={() => setDonationAmount(amount.toString())}
                              className={`py-2 rounded-lg font-mono text-sm font-bold transition-all ${
                                donationAmount === amount.toString()
                                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border border-purple-400"
                                  : "bg-slate-800 text-slate-300 border border-slate-700 hover:border-purple-500/50"
                              }`}
                            >
                              {amount}
                            </button>
                          ))}
                        </div>

                        {/* Custom Amount Input */}
                        <input
                          type="number"
                          placeholder="Enter custom amount (KSH)"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono text-sm mb-4"
                        />

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => setShowDonationModal(false)}
                            className="flex-1 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors font-mono text-sm font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleGiftClick}
                            disabled={!donationAmount || parseInt(donationAmount) < 50}
                            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600 transition-all font-mono text-sm font-bold"
                          >
                            Initiate Payment
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
