'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Share2, Mail, MessageCircle } from 'lucide-react'

interface ReferralInviteCardProps {
  referralCode?: string
  invitesCount?: number
}

export default function ReferralInviteCard({
  referralCode = 'LOADING',
  invitesCount = 0,
}: ReferralInviteCardProps) {
  const [copied, setCopied] = useState(false)

  const inviteLink = referralCode && referralCode !== 'LOADING'
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}?referral=${referralCode}`
    : ''

  const handleCopyCode = () => {
    if (referralCode && referralCode !== 'LOADING') {
      navigator.clipboard.writeText(referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShareEmail = () => {
    if (inviteLink) {
      const subject = 'Join me and earn free coins!'
      const body = `I found this awesome platform for building chatbots. Join using my referral code and we both get free coins!\n\n${inviteLink}`
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }
  }

  const handleShareWhatsApp = () => {
    if (inviteLink) {
      const message = `I found this awesome platform for building chatbots. Join using my referral code and we both get free coins!\n\n${inviteLink}`
      window.open(
        `https://wa.me/?text=${encodeURIComponent(message)}`,
        '_blank'
      )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-6 hover:border-cyan-500/50 transition"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">Invite Friends</h3>
          <p className="text-slate-400 text-sm">Get 50 coins for each person who joins</p>
        </div>
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg px-3 py-1">
          <p className="text-sm font-semibold text-purple-400">{invitesCount} invites</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Referral Code Section */}
        <div>
          <p className="text-slate-300 text-xs font-semibold mb-2 uppercase">Referral Code</p>
          <button
            onClick={handleCopyCode}
            className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 rounded-lg p-3 flex items-center justify-between group transition"
          >
            <code className="text-lg font-mono font-bold text-cyan-400">{referralCode}</code>
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition" />
            )}
          </button>
        </div>

        {/* Invite Link Section */}
        <div>
          <p className="text-slate-300 text-xs font-semibold mb-2 uppercase">Share Link</p>
          <button
            onClick={handleCopyLink}
            className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 rounded-lg p-3 flex items-center justify-between group transition text-left"
          >
            <span className="text-sm text-slate-400 truncate font-mono">
              {inviteLink ? inviteLink.replace(/^https?:\/\//i, '') : 'Loading...'}
            </span>
            {copied ? (
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
            ) : (
              <Copy className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition flex-shrink-0 ml-2" />
            )}
          </button>
        </div>

        {/* Share Buttons */}
        <div className="pt-2">
          <p className="text-slate-300 text-xs font-semibold mb-2 uppercase">Quick Share</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShareEmail}
              className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 rounded-lg p-3 flex items-center justify-center gap-2 group transition"
            >
              <Mail className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
              <span className="text-sm font-medium text-slate-300">Email</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 rounded-lg p-3 flex items-center justify-center gap-2 group transition"
            >
              <MessageCircle className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
              <span className="text-sm font-medium text-slate-300">WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg">
        <p className="text-xs text-slate-400">
          💡 Share your code to earn coins. Your friends get a fresh start too!
        </p>
      </div>
    </motion.div>
  )
}
