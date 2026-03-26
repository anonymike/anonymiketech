"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import ChatbotCard from "@/components/ChatbotCard"
import ChatbotCoinPurchaseModal from "@/components/ChatbotCoinPurchaseModal"
import ChatbotDeploymentForm from "@/components/ChatbotDeploymentForm"
import ProfileDashboard from "@/components/ProfileDashboard"
import ReferralInviteCard from "@/components/ReferralInviteCard"
import DashboardNavbar from "@/components/DashboardNavbar"
import WhatsAppBotSection from "@/components/WhatsAppBotSection"
import FlowVisualization from "@/components/FlowVisualization"
import { BarChart3, Zap, Users, TrendingUp } from "lucide-react"

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
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [referralData, setReferralData] = useState({ referralCode: '', invitesCount: 0 })
  const [activeTab, setActiveTab] = useState<"bots" | "deploy" | "whatsapp" | "profile" | "referral">("bots")

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

      // Fetch referral info
      const referralResponse = await fetch("/api/chatbots/referrals/info", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (referralResponse.ok) {
        const referralDataResponse = await referralResponse.json()
        setReferralData(referralDataResponse.data || { referralCode: '', invitesCount: 0 })
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
    localStorage.removeItem("chatbot_user")
    router.push("/chatbots-ai")
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

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400">Failed to load user data</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-black text-white flex flex-col">
      {/* Navbar */}
      <DashboardNavbar
        username={user.username}
        coinBalance={user.coin_balance}
        onLogout={handleLogout}
        onProfileClick={() => setShowProfileModal(true)}
        onBuyCoinsClick={() => setShowCoinModal(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(0,255,255,0.05) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Quick Stats */}
          {activeTab === 'bots' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
            >
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-lg p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm mb-1">Active Bots</p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-blue-400">{bots.length}</h3>
                  </div>
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 opacity-50" />
                </div>
                <p className="text-xs text-gray-500">Total deployed</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-lg p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm mb-1">Coin Balance</p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-yellow-400">{user?.coin_balance}</h3>
                  </div>
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 opacity-50" />
                </div>
                <p className="text-xs text-gray-500">Available coins</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-lg p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm mb-1">Invites</p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-purple-400">{referralData.invitesCount}</h3>
                  </div>
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 opacity-50" />
                </div>
                <p className="text-xs text-gray-500">Successful referrals</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 rounded-lg p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm mb-1">Earnings</p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-emerald-400">{referralData.invitesCount * 50}</h3>
                  </div>
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 opacity-50" />
                </div>
                <p className="text-xs text-gray-500">From referrals</p>
              </div>
            </motion.div>
          )}

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 sm:mb-12"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
              {activeTab === 'bots' && 'Your Bots'}
              {activeTab === 'deploy' && 'Deploy New Bot'}
              {activeTab === 'whatsapp' && 'WhatsApp Bots'}
              {activeTab === 'referral' && 'Referral Program'}
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-400">
              {activeTab === 'bots' && 'Manage and monitor your deployed chatbots'}
              {activeTab === 'deploy' && 'Create and deploy a new AI chatbot'}
              {activeTab === 'whatsapp' && 'Build and deploy WhatsApp bots with Baileys'}
              {activeTab === 'referral' && 'Invite friends and earn coins'}
            </p>
          </motion.div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-400 text-sm sm:text-base">{error}</h3>
                <p className="text-xs sm:text-sm text-red-300/80 mt-1">Redirecting to home...</p>
              </div>
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "bots" ? (
              <div>
                {bots.length === 0 ? (
                  <div className="text-center py-12 sm:py-16">
                    <p className="text-gray-400 mb-4 text-sm sm:text-base">No bots deployed yet</p>
                    <button
                      onClick={() => setActiveTab("deploy")}
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-colors text-xs sm:text-sm"
                    >
                      Deploy Your First Bot
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {bots.map((bot, index) => (
                      <ChatbotCard 
                        key={bot.id} 
                        bot={bot} 
                        index={index} 
                        onUpdate={fetchUserData} 
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === "deploy" ? (
              <ChatbotDeploymentForm
                coinBalance={user.coin_balance || 0}
                onSuccess={() => {
                  setActiveTab("bots")
                  fetchUserData()
                }}
              />
            ) : activeTab === "whatsapp" ? (
              <div className="space-y-12">
                <FlowVisualization />
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6 sm:p-8">
                  <WhatsAppBotSection token={localStorage.getItem("chatbot_token") || undefined} />
                </div>
              </div>
            ) : activeTab === "referral" ? (
              <div className="space-y-6">
                <ReferralInviteCard
                  referralCode={referralData.referralCode}
                  invitesCount={referralData.invitesCount}
                />
                
                {/* Referral Benefits Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-6 sm:p-8"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Referral Benefits</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h4 className="text-cyan-400 font-semibold mb-2">You Get</h4>
                      <p className="text-sm text-gray-400">50 coins for each friend who joins using your referral code</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h4 className="text-cyan-400 font-semibold mb-2">They Get</h4>
                      <p className="text-sm text-gray-400">A fresh start with bonus coins to deploy their first bot</p>
                    </div>
                  </div>
                </motion.div>

                {/* How It Works Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl p-6 sm:p-8"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-6">How It Works</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-cyan-500/20 border border-cyan-500/50">
                          <span className="text-cyan-400 font-bold text-sm">1</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Copy Your Code</h4>
                        <p className="text-sm text-gray-400">Share your unique referral code or link with friends</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-cyan-500/20 border border-cyan-500/50">
                          <span className="text-cyan-400 font-bold text-sm">2</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">They Sign Up</h4>
                        <p className="text-sm text-gray-400">Your friends create an account using your referral code</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-cyan-500/20 border border-cyan-500/50">
                          <span className="text-cyan-400 font-bold text-sm">3</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Earn Coins</h4>
                        <p className="text-sm text-gray-400">Instantly receive 50 coins for each successful referral</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : null}
          </motion.div>

          {/* Additional Quick Action Cards */}
          {activeTab === 'bots' && bots.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
            >
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 rounded-lg p-6 hover:border-emerald-500/50 transition">
                <h3 className="text-white font-semibold mb-2">Documentation</h3>
                <p className="text-sm text-gray-400 mb-4">Learn how to optimize your chatbot performance</p>
                <button className="text-emerald-400 hover:text-emerald-300 font-medium text-sm transition">
                  Read Docs →
                </button>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-lg p-6 hover:border-blue-500/50 transition">
                <h3 className="text-white font-semibold mb-2">Support</h3>
                <p className="text-sm text-gray-400 mb-4">Get help with deployment issues and best practices</p>
                <button className="text-blue-400 hover:text-blue-300 font-medium text-sm transition">
                  Contact Support →
                </button>
              </div>
            </motion.div>
          )}
        </div>
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

      <ProfileDashboard
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        authToken={typeof window !== 'undefined' ? localStorage.getItem('chatbot_token') || '' : ''}
      />
    </div>
  )
}
