"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X, Check } from "lucide-react"

interface DuplicateItemConfirmationProps {
  isOpen: boolean
  itemTitle: string
  currentQuantity: number
  onConfirm: () => void
  onCancel: () => void
}

export default function DuplicateItemConfirmation({
  isOpen,
  itemTitle,
  currentQuantity,
  onConfirm,
  onCancel,
}: DuplicateItemConfirmationProps) {
  const [isConfirmed, setIsConfirmed] = useState(false)

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm()
      setIsConfirmed(false)
    }
  }

  const handleCancel = () => {
    onCancel()
    setIsConfirmed(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-hacker-terminal border-2 border-yellow-500 rounded-lg p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-tech font-bold text-yellow-400">Duplicate Subscription</h3>
                <p className="text-sm text-hacker-green-dim">Confirmation Required</p>
              </div>
              <button onClick={handleCancel} className="ml-auto p-1 hover:bg-hacker-green/20 rounded transition-colors">
                <X className="w-5 h-5 text-hacker-green" />
              </button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <div className="bg-hacker-bg/50 rounded-lg p-4 mb-4 border border-hacker-green/30">
                <p className="text-hacker-green-bright font-tech mb-2">
                  📦 <strong>{itemTitle}</strong>
                </p>
                <p className="text-hacker-green-dim text-sm">
                  You already have <strong>{currentQuantity}</strong> of this plan in your cart.
                </p>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-400 font-tech font-bold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Multiple Subscriptions
                </h4>
                <p className="text-yellow-200 text-sm font-tech leading-relaxed">
                  Adding another subscription means you'll have <strong>{currentQuantity + 1}</strong> active
                  subscriptions of the same plan. Each subscription will be billed separately and run concurrently.
                </p>
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-1">
                  <input
                    type="checkbox"
                    checked={isConfirmed}
                    onChange={(e) => setIsConfirmed(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all duration-300 ${
                      isConfirmed
                        ? "bg-hacker-green border-hacker-green"
                        : "border-hacker-green-dim hover:border-hacker-green"
                    }`}
                  >
                    {isConfirmed && <Check className="w-3 h-3 text-hacker-bg m-0.5" />}
                  </div>
                </div>
                <span className="text-hacker-green-bright font-tech text-sm leading-relaxed">
                  ✅ Yes, I understand I'm purchasing an additional subscription of the same plan and want to proceed
                  with multiple active subscriptions.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={handleCancel}
                className="flex-1 py-3 px-4 bg-hacker-terminal border border-hacker-green-dim text-hacker-green-bright font-tech font-bold rounded-lg hover:bg-hacker-green/10 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>

              <motion.button
                onClick={handleConfirm}
                disabled={!isConfirmed}
                className={`flex-1 py-3 px-4 font-tech font-bold rounded-lg transition-all duration-300 ${
                  isConfirmed
                    ? "bg-yellow-500 text-black hover:bg-yellow-400 hover:scale-105"
                    : "bg-yellow-500/30 text-yellow-600 cursor-not-allowed"
                }`}
                whileHover={isConfirmed ? { scale: 1.02 } : {}}
                whileTap={isConfirmed ? { scale: 0.98 } : {}}
              >
                Add to Cart
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
