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
  const [activeTab, setActiveTab] = useState<"bots" | "deploy" | "profile" | "referral">("bots")

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
              {activeTab === 'referral' && 'Referral Program'}
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-400">
              {activeTab === 'bots' && 'Manage and monitor your deployed chatbots'}
              {activeTab === 'deploy' && 'Create and deploy a new AI chatbot'}
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
            ) : activeTab === "referral" ? (
              <ReferralInviteCard
                referralCode={referralData.referralCode}
                invitesCount={referralData.invitesCount}
              />
            ) : null}
          </motion.div>
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
