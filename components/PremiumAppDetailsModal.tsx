"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, Star, Tag, Zap, FileText, Settings, History } from "lucide-react"
import { PremiumApp } from "@/lib/premium-apps-data"

interface PremiumAppDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  app: PremiumApp | null
  onInitiatePayment?: (app: PremiumApp) => void
}

type TabType = "overview" | "installation" | "requirements" | "versions"

export default function PremiumAppDetailsModal({
  isOpen,
  onClose,
  app,
  onInitiatePayment,
}: PremiumAppDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview")

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
              <div className="sticky top-0 flex flex-col gap-4 p-6 border-b border-green-500/20 bg-slate-900/95 backdrop-blur z-10">
                <div className="flex items-center justify-between">
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

                {/* Tabs */}
                <div className="flex gap-2 border-b border-green-500/20 -mx-6 px-6 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-4 py-2 font-mono text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                      activeTab === "overview"
                        ? "border-green-400 text-green-400"
                        : "border-transparent text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    Overview
                  </button>
                  {app.installation_instructions && (
                    <button
                      onClick={() => setActiveTab("installation")}
                      className={`px-4 py-2 font-mono text-sm font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                        activeTab === "installation"
                          ? "border-green-400 text-green-400"
                          : "border-transparent text-slate-400 hover:text-slate-300"
                      }`}
                    >
                      <FileText size={16} />
                      Installation
                    </button>
                  )}
                  {app.system_requirements && (
                    <button
                      onClick={() => setActiveTab("requirements")}
                      className={`px-4 py-2 font-mono text-sm font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                        activeTab === "requirements"
                          ? "border-green-400 text-green-400"
                          : "border-transparent text-slate-400 hover:text-slate-300"
                      }`}
                    >
                      <Settings size={16} />
                      Requirements
                    </button>
                  )}
                  {app.version_history && (
                    <button
                      onClick={() => setActiveTab("versions")}
                      className={`px-4 py-2 font-mono text-sm font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                        activeTab === "versions"
                          ? "border-green-400 text-green-400"
                          : "border-transparent text-slate-400 hover:text-slate-300"
                      }`}
                    >
                      <History size={16} />
                      Versions
                    </button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <AnimatePresence mode="wait">
                  {activeTab === "overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
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
                    </motion.div>
                  )}

                  {activeTab === "installation" && app.installation_instructions && (
                    <motion.div
                      key="installation"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-bold text-green-400 font-mono">Installation Steps</h3>
                      <div className="space-y-3">
                        {app.installation_instructions.map((instruction, index) => (
                          <div key={index} className="bg-slate-800/50 border border-green-500/20 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                                <span className="text-sm font-bold text-green-400">{instruction.step}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-slate-200 text-sm mb-1">{instruction.title}</h4>
                                <p className="text-xs text-slate-400 mb-2">{instruction.description}</p>
                                {instruction.details && (
                                  <p className="text-xs text-slate-500 italic border-l-2 border-green-500/30 pl-2">
                                    💡 {instruction.details}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "requirements" && app.system_requirements && (
                    <motion.div
                      key="requirements"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-bold text-green-400 font-mono">System Requirements</h3>
                      <div className="space-y-2">
                        {app.system_requirements.map((req, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 border border-green-500/20 rounded-lg">
                            <span className="text-sm text-slate-300 font-medium">{req.name}</span>
                            <span className="text-sm font-mono text-green-400 font-bold">{req.value}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "versions" && app.version_history && (
                    <motion.div
                      key="versions"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-bold text-green-400 font-mono">Version History</h3>
                      <div className="space-y-3">
                        {app.version_history.map((version, index) => (
                          <div key={index} className="bg-slate-800/50 border border-green-500/20 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-mono font-bold text-green-400">{version.version}</p>
                                <p className="text-xs text-slate-400">{version.date}</p>
                              </div>
                              <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">{version.size}</span>
                            </div>
                            <div className="space-y-1">
                              {version.changes.map((change, changeIndex) => (
                                <p key={changeIndex} className="text-sm text-slate-300 flex items-start gap-2">
                                  <span className="text-green-400 mt-0.5">→</span>
                                  <span>{change}</span>
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
