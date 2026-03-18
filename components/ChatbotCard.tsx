"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Power, RotateCcw, Trash2, Copy, Check } from "lucide-react"

interface ChatbotCardProps {
  bot: {
    id: string
    bot_name: string
    status: "active" | "stopped" | "error"
    session_id: string
    created_at: string
  }
  index: number
  onUpdate: () => void
}

export default function ChatbotCard({ bot, index, onUpdate }: ChatbotCardProps) {
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const token = typeof window !== "undefined" ? localStorage.getItem("chatbot_token") : null

  const handleStatusChange = async (newStatus: "active" | "stopped") => {
    if (!token) return
    setLoading(true)
    try {
      const response = await fetch(`/api/chatbots/bots/${bot.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        onUpdate()
      }
    } finally {
      setLoading(false)
      setShowMenu(false)
    }
  }

  const handleDelete = async () => {
    if (!token) return
    if (!window.confirm("Are you sure you want to delete this bot?")) return

    setLoading(true)
    try {
      const response = await fetch(`/api/chatbots/bots/${bot.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        onUpdate()
      }
    } finally {
      setLoading(false)
      setShowMenu(false)
    }
  }

  const copySessionId = () => {
    navigator.clipboard.writeText(bot.session_id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const statusColors = {
    active: "text-green-400 bg-green-500/10",
    stopped: "text-yellow-400 bg-yellow-500/10",
    error: "text-red-400 bg-red-500/10",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-6 rounded-lg border border-cyan-500/20 bg-gradient-to-br from-slate-900/50 to-black/50 hover:border-cyan-500/50 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{bot.bot_name}</h3>
          <p className="text-xs text-gray-500">
            Created {new Date(bot.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[bot.status]}`}>
          {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
        </div>
      </div>

      {/* Session ID */}
      <div className="mb-4 p-3 rounded-lg bg-slate-800/50 border border-cyan-500/10">
        <p className="text-xs text-gray-400 mb-1">Session ID</p>
        <div className="flex items-center gap-2">
          <code className="text-xs text-cyan-300 font-mono break-all flex-1">
            {bot.session_id.slice(0, 12)}...
          </code>
          <button
            onClick={copySessionId}
            className="text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            handleStatusChange(bot.status === "active" ? "stopped" : "active")
          }
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-colors disabled:opacity-50"
        >
          <Power className="w-4 h-4" />
          <span className="text-sm font-medium">
            {bot.status === "active" ? "Stop" : "Start"}
          </span>
        </motion.button>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMenu(!showMenu)}
            className="px-3 py-2 rounded-lg border border-gray-500/30 text-gray-400 hover:bg-gray-500/10 transition-colors"
          >
            ⋮
          </motion.button>

          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-32 rounded-lg border border-gray-500/30 bg-slate-900 shadow-lg z-10"
            >
              <button
                onClick={() => handleStatusChange("active")}
                disabled={loading || bot.status === "active"}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-800 transition-colors disabled:opacity-50 rounded-t-lg"
              >
                Resume
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 rounded-b-lg border-t border-gray-500/20"
              >
                Delete
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
