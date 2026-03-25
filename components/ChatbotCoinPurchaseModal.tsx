"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Zap } from "lucide-react"

interface CoinPackage {
  key: string
  coins: number
  amount: number
}

interface ChatbotCoinPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const COIN_PACKAGES: CoinPackage[] = [
  { key: "small", coins: 10, amount: 100 },
  { key: "medium", coins: 60, amount: 500 },
  { key: "large", coins: 130, amount: 1000 },
]

export default function ChatbotCoinPurchaseModal({
  isOpen,
  onClose,
  onSuccess,
}: ChatbotCoinPurchaseModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>("medium")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentInitiated, setPaymentInitiated] = useState(false)

  const token = typeof window !== "undefined" ? localStorage.getItem("chatbot_token") : null
  const selectedPkg = COIN_PACKAGES.find((p) => p.key === selectedPackage)

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch("/api/chatbots/coins/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone,
          packageKey: selectedPackage,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Payment initiation failed")
      }

      setPaymentInitiated(true)

      // Wait 5 seconds for webhook to process, then refresh balance
      setTimeout(() => {
        console.log('[v0] Payment prompt sent, waiting for user to complete M-Pesa transaction')
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed")
    } finally {
      setLoading(false)
    }
  }

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="bg-gradient-to-b from-slate-900 to-black border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-2xl font-bold text-cyan-400">Buy Coins</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {paymentInitiated ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/50">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap className="w-8 h-8 text-cyan-400" />
                      </motion.div>
                    </div>
                    <p className="text-white font-semibold mb-2">M-Pesa Prompt Sent</p>
                    <p className="text-gray-400 text-sm mb-4">
                      Check your phone for the M-Pesa payment prompt. Enter your PIN to complete the payment.
                    </p>
                    <p className="text-gray-500 text-xs mb-6">
                      ⚠️ Coins will only be added after payment is successfully completed and confirmed by our system. Please wait for confirmation.
                    </p>
                    <button
                      onClick={() => {
                        setPaymentInitiated(false)
                        onSuccess()
                      }}
                      className="mt-6 px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-colors"
                    >
                      Payment Completed
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handlePayment} className="space-y-6">
                    {/* Package Selection */}
                    <div>
                      <label className="block text-sm text-gray-300 mb-3">
                        Select Coin Package
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {COIN_PACKAGES.map((pkg) => (
                          <motion.button
                            key={pkg.key}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedPackage(pkg.key)}
                            className={`p-4 rounded-lg border transition-all ${
                              selectedPackage === pkg.key
                                ? "border-cyan-400 bg-cyan-500/20"
                                : "border-cyan-500/20 bg-slate-800/50 hover:border-cyan-500/50"
                            }`}
                          >
                            <div className="text-lg font-bold text-cyan-400">
                              {pkg.coins}
                            </div>
                            <div className="text-xs text-gray-400">
                              KES {pkg.amount}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="254712345678"
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-cyan-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        required
                      />
                      <p className="text-xs text-gray-400 mt-2">
                        Must be in format: 254XXXXXXXXX
                      </p>
                    </div>

                    {/* Order Summary */}
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-cyan-500/10">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Coins</span>
                        <span className="text-white font-semibold">
                          {selectedPkg?.coins}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-cyan-500/10 pt-2">
                        <span className="text-gray-400">Amount</span>
                        <span className="text-cyan-400 font-semibold">
                          KES {selectedPkg?.amount}
                        </span>
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                      >
                        {error}
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading || !phone}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all duration-300"
                    >
                      {loading ? "Processing..." : `Pay KES ${selectedPkg?.amount}`}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
