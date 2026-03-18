"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LogOut, Coins, Plus, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import ChatbotCard from "@/components/ChatbotCard"
import ChatbotCoinPurchaseModal from "@/components/ChatbotCoinPurchaseModal"
import ChatbotDeploymentForm from "@/components/ChatbotDeploymentForm"

interface User {
  id: string
  username: string
  email: string
  coin_balance: number
}

interface Bot {
  id: string
  bot_name: string
  status: "active" | "stopped" | "error"
  session_id: string
  created_at: string
}

export default function ChatbotsDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [bots, setBots] = useState<Bot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCoinModal, setShowCoinModal] = useState(false)
  const [showDeployForm, setShowDeployForm] = useState(false)
  const [activeTab, setActiveTab] = useState<"bots" | "deploy">("bots")

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("chatbot_token")
      
      if (!token) {
        router.push("/chatbots-ai")
        return
      }

      const response = await fetch("/api/chatbots/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }

      const data = await response.json()
      setUser(data.data)

      // Fetch bots
      const botsResponse = await fetch("/api/chatbots/bots", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (botsResponse.ok) {
        const botsData = await botsResponse.json()
        setBots(botsData.data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard")
      setTimeout(() => router.push("/chatbots-ai"), 2000)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("chatbot_token")
    router.push("/chatbots-ai")
  }

  const handleBotDeployed = () => {
    setShowDeployForm(false)
    setActiveTab("bots")
    fetchUserData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="text-cyan-400 text-lg">Loading dashboard...</div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-black text-white p-4 md:p-8">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(0,255,255,0.05) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400">Welcome back, {user?.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </motion.div>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="p-6 rounded-lg border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-black/50">
            <p className="text-gray-400 text-sm mb-2">Email</p>
            <p className="text-xl font-semibold text-white">{user?.email}</p>
          </div>
          <div className="p-6 rounded-lg border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-black/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Coin Balance</p>
                <p className="text-3xl font-bold text-purple-400">{user?.coin_balance}</p>
              </div>
              <Coins className="w-8 h-8 text-purple-400 opacity-50" />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCoinModal(true)}
            className="p-6 rounded-lg border border-green-500/20 bg-gradient-to-br from-green-500/10 to-black/50 hover:border-green-500/50 transition-all flex items-center justify-center gap-2 font-semibold text-green-400 hover:text-green-300"
          >
            <Plus className="w-5 h-5" />
            Buy Coins
          </motion.button>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 mb-6 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-4 mb-8 border-b border-cyan-500/20"
        >
          <button
            onClick={() => setActiveTab("bots")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "bots"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Active Bots ({bots.length})
          </button>
          <button
            onClick={() => setActiveTab("deploy")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "deploy"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Deploy New Bot
          </button>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          key={activeTab}
        >
          {activeTab === "bots" ? (
            <div>
              {bots.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">No bots deployed yet</p>
                  <button
                    onClick={() => setActiveTab("deploy")}
                    className="px-6 py-2 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-colors"
                  >
                    Deploy Your First Bot
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bots.map((bot, index) => (
                    <ChatbotCard key={bot.id} bot={bot} index={index} onUpdate={fetchUserData} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <ChatbotDeploymentForm
              coinBalance={user?.coin_balance || 0}
              onSuccess={handleBotDeployed}
            />
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <ChatbotCoinPurchaseModal
        isOpen={showCoinModal}
        onClose={() => setShowCoinModal(false)}
        onSuccess={() => {
          setShowCoinModal(false)
          fetchUserData()
        }}
      />
    </div>
  )
}
