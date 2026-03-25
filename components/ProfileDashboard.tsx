'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, User, Copy, Check, AlertCircle, Loader, Link as LinkIcon, Gift } from 'lucide-react'

interface ProfileDashboardProps {
  isOpen: boolean
  onClose: () => void
  authToken?: string
}

interface UserData {
  id: string
  username: string
  email: string
  coin_balance: number
}

interface ReferralData {
  referralCode: string | null
  invitesCount: number
  invitedUsers: Array<{
    id: string
    username: string
    email: string
    createdAt: string
  }>
}

export default function ProfileDashboard({ isOpen, onClose, authToken }: ProfileDashboardProps) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [editingUsername, setEditingUsername] = useState(false)
  const [editingEmail, setEditingEmail] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [copiedCode, setCopiedCode] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showWelcomeBonus, setShowWelcomeBonus] = useState(true)

  useEffect(() => {
    if (isOpen && authToken) {
      fetchUserData()
      fetchReferralData()
    }
  }, [isOpen, authToken])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/chatbots/users/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      })

      if (response.ok) {
        const data = await response.json()
        setUserData(data.data)
        setNewUsername(data.data.username)
        setNewEmail(data.data.email)
      }
    } catch (err) {
      console.error('[v0] Error fetching user data:', err)
    }
  }

  const fetchReferralData = async () => {
    try {
      const response = await fetch('/api/chatbots/referrals/info', {
        headers: { Authorization: `Bearer ${authToken}` },
      })

      if (response.ok) {
        const data = await response.json()
        setReferralData(data.data)
      }
    } catch (err) {
      console.error('[v0] Error fetching referral data:', err)
    }
  }

  const handleUsernameUpdate = async () => {
    if (!newUsername.trim()) {
      setError('Username cannot be empty')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/chatbots/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ username: newUsername }),
      })

      if (response.ok) {
        const data = await response.json()
        setUserData(data.data)
        setEditingUsername(false)
        setSuccess('Username updated successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const error = await response.json()
        setError(error.error || 'Failed to update username')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailUpdate = async () => {
    if (!newEmail.trim()) {
      setError('Email cannot be empty')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/chatbots/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ email: newEmail }),
      })

      if (response.ok) {
        const data = await response.json()
        setUserData(data.data)
        setEditingEmail(false)
        setSuccess('Email updated successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const error = await response.json()
        setError(error.error || 'Failed to update email')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyReferralCode = () => {
    if (referralData?.referralCode) {
      navigator.clipboard.writeText(referralData.referralCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const generateInviteLink = () => {
    if (referralData?.referralCode) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      return `${baseUrl}?referral=${referralData.referralCode}`
    }
    return ''
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50 my-8"
          >
            {/* Header */}
            <div className="relative h-40 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-40 h-40 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute top-10 right-0 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>
              <div className="relative h-full flex items-center justify-between px-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">Profile Settings</h1>
                  <p className="text-cyan-100">Manage your account and referrals</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/10 p-2 rounded-lg transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 max-h-96 overflow-y-auto">
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3"
                >
                  <Check className="w-5 h-5 text-green-500" />
                  <p className="text-sm text-green-400">{success}</p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </motion.div>
              )}

              {/* Account Info */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account Information
                </h2>

                {/* Welcome Bonus Alert */}
                {showWelcomeBonus && userData?.coin_balance === 50 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="mb-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg flex items-start gap-3"
                  >
                    <Gift className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-green-400 font-semibold">Welcome Gift! 🎁</p>
                      <p className="text-green-300 text-sm mt-1">You&apos;ve received 50 free coins to get you started. Use them to deploy your first chatbot!</p>
                    </div>
                    <button
                      onClick={() => setShowWelcomeBonus(false)}
                      className="text-green-400 hover:text-green-300 text-sm font-medium"
                    >
                      ✕
                    </button>
                  </motion.div>
                )}

                {/* Coin Balance */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-4">
                  <p className="text-slate-400 text-sm mb-1">Coin Balance</p>
                  <p className="text-2xl font-bold text-cyan-400">{userData?.coin_balance || 0} Coins</p>
                </div>

                {/* Username */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-4">
                  <label className="block text-slate-400 text-sm mb-2">Username</label>
                  {editingUsername ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                        disabled={isLoading}
                      />
                      <button
                        onClick={handleUsernameUpdate}
                        disabled={isLoading}
                        className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 text-white px-4 py-2 rounded font-medium transition"
                      >
                        {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingUsername(false)
                          setNewUsername(userData?.username || '')
                        }}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded font-medium transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-white text-lg">{userData?.username}</p>
                      <button
                        onClick={() => setEditingUsername(true)}
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <label className="block text-slate-400 text-sm mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  {editingEmail ? (
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                        disabled={isLoading}
                      />
                      <button
                        onClick={handleEmailUpdate}
                        disabled={isLoading}
                        className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 text-white px-4 py-2 rounded font-medium transition"
                      >
                        {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingEmail(false)
                          setNewEmail(userData?.email || '')
                        }}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded font-medium transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-white text-lg">{userData?.email}</p>
                      <button
                        onClick={() => setEditingEmail(true)}
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Referral Section */}
              {referralData && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5" />
                    Referral Program
                  </h2>

                  {/* Referral Code */}
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-4">
                    <p className="text-slate-400 text-sm mb-2">Your Referral Code</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono text-lg">
                        {referralData.referralCode || 'Loading...'}
                      </code>
                      <button
                        onClick={copyReferralCode}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded transition"
                      >
                        {copiedCode ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Invites Count */}
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-4">
                    <p className="text-slate-400 text-sm mb-1">Total Invites</p>
                    <p className="text-2xl font-bold text-purple-400">{referralData.invitesCount}</p>
                    <p className="text-slate-500 text-xs mt-2">
                      Earn 50 coins for each user who joins using your code!
                    </p>
                  </div>

                  {/* Invited Users */}
                  {referralData.invitedUsers.length > 0 && (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                      <p className="text-white font-semibold mb-3">Recently Invited Users</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {referralData.invitedUsers.slice(0, 5).map((user) => (
                          <div key={user.id} className="flex items-center justify-between text-sm bg-slate-900/50 p-2 rounded">
                            <div>
                              <p className="text-white">{user.username}</p>
                              <p className="text-slate-500 text-xs">{user.email}</p>
                            </div>
                            <span className="text-green-400 text-xs font-semibold">+50 coins</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-800/50 border-t border-slate-700 px-8 py-4">
              <button
                onClick={onClose}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
