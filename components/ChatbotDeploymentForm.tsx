"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AlertCircle, Zap } from "lucide-react"
import BotTypeCard from "./BotTypeCard"
import BotTypeDetailModal from "./BotTypeDetailModal"

interface BotType {
  id: string
  name: string
  description: string
  cost_in_coins: number
  features: string[]
  icon?: string
  image?: string
}

interface ChatbotDeploymentFormProps {
  coinBalance: number
  onSuccess: () => void
}

export default function ChatbotDeploymentForm({
  coinBalance,
  onSuccess,
}: ChatbotDeploymentFormProps) {
  const [botTypes, setBotTypes] = useState<BotType[]>([])
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [selectedBotDetail, setSelectedBotDetail] = useState<BotType | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const [formData, setFormData] = useState({
    botTypeId: "",
    botName: "",
    webhookUrl: "",
  })
  const [showFormFields, setShowFormFields] = useState(false)

  const token = typeof window !== "undefined" ? localStorage.getItem("chatbot_token") : null
  const selectedBotType = botTypes.find((b) => b.id === formData.botTypeId)
  const canDeploy =
    formData.botTypeId &&
    formData.botName &&
    selectedBotType &&
    coinBalance >= selectedBotType.cost_in_coins

  useEffect(() => {
    fetchBotTypes()
  }, [])

  const BOT_ICON_MAP: Record<string, string> = {
    whatsapp_pro: '💬',
    customer_support: '🎯',
    ecommerce: '🛍️',
    marketing: '📢',
    lead_generation: '⚡',
  }

  const BOT_IMAGE_MAP: Record<string, string> = {
    whatsapp_pro: '/images/bots/whatsapp-pro.jpg',
    customer_support: '/images/bots/customer-support.jpg',
    ecommerce: '/images/bots/ecommerce.jpg',
    marketing: '/images/bots/marketing.jpg',
    lead_generation: '/images/bots/lead-generation.jpg',
  }

  const fetchBotTypes = async () => {
    try {
      const response = await fetch("/api/chatbots/bot-types")
      const data = await response.json()
      const botsWithExtras = (data.data || []).map((bot: BotType) => ({
        ...bot,
        icon: BOT_ICON_MAP[bot.id] || '🤖',
        image: BOT_IMAGE_MAP[bot.id] || '/images/bots/default.jpg',
      }))
      setBotTypes(botsWithExtras)
      if (botsWithExtras.length > 0) {
        setFormData((prev) => ({ ...prev, botTypeId: botsWithExtras[0].id }))
      }
    } catch (err) {
      setError("Failed to load bot types")
    } finally {
      setLoading(false)
    }
  }

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setDeploying(true)

    try {
      if (!token) {
        throw new Error("Not authenticated")
      }

      if (!canDeploy) {
        throw new Error("Cannot deploy bot")
      }

      const response = await fetch("/api/chatbots/bots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          botTypeId: formData.botTypeId,
          botName: formData.botName,
          webhookUrl: formData.webhookUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Deployment failed")
      }

      setSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deployment failed")
    } finally {
      setDeploying(false)
    }
  }

  if (loading) {
    return (
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-center py-12 text-gray-400"
      >
        Loading bot types...
      </motion.div>
    )
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-4xl mb-4">✓</div>
        <p className="text-xl font-semibold text-green-400 mb-2">
          Bot deployed successfully!
        </p>
        <p className="text-gray-400">Redirecting to your bots...</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <form onSubmit={handleDeploy} className="space-y-6">
        {/* Bot Type Selection with Cards */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-6 text-lg">
            Select Your Bot Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {botTypes.map((bot) => (
              <BotTypeCard
                key={bot.id}
                id={bot.id}
                name={bot.name}
                cost={bot.cost_in_coins}
                description={bot.description}
                features={bot.features}
                icon={bot.icon || '🤖'}
                image={bot.image || '/images/bots/default.jpg'}
                onClick={() => {
                  setSelectedBotDetail(bot)
                  setShowDetailModal(true)
                }}
              />
            ))}
          </div>
        </div>

        {/* Bot Type Detail Modal */}
        <BotTypeDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          botType={selectedBotDetail}
        />

        {showFormFields && (
          <>
            {/* Bot Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Bot Name
              </label>
              <input
                type="text"
                value={formData.botName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, botName: e.target.value }))
                }
                placeholder="e.g., My Customer Support Bot"
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-cyan-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>

            {/* Webhook URL (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Webhook URL (Optional)
              </label>
              <input
                type="url"
                value={formData.webhookUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, webhookUrl: e.target.value }))
                }
                placeholder="https://your-api.com/webhook"
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-cyan-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1">
                URL where we'll send bot events and messages
              </p>
            </div>

            {/* Cost Summary */}
            {selectedBotType && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-300">Deployment Cost</span>
                  <span className="text-2xl font-bold text-cyan-400">
                    {selectedBotType.cost_in_coins}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Your Balance</span>
                  <span
                    className={`text-lg font-semibold ${
                      coinBalance >= selectedBotType.cost_in_coins
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {coinBalance}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Insufficient Coins Warning */}
            {selectedBotType && coinBalance < selectedBotType.cost_in_coins && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-semibold">Insufficient Coins</p>
                  <p className="text-red-300/70 text-sm">
                    You need {selectedBotType.cost_in_coins - coinBalance} more coins to
                    deploy this bot.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400"
              >
                {error}
              </motion.div>
            )}

            {/* Deploy Button */}
            <motion.button
              whileHover={canDeploy ? { scale: 1.02 } : {}}
              whileTap={canDeploy ? { scale: 0.98 } : {}}
              type="submit"
              disabled={!canDeploy || deploying}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              {deploying ? "Deploying..." : "Deploy Bot"}
            </motion.button>
          </>
        )}
      </form>
    </motion.div>
  )
}
