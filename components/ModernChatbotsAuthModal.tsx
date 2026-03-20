'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

interface ModernChatbotsAuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ModernChatbotsAuthModal({ isOpen, onClose }: ModernChatbotsAuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    phoneNumber: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (!formData.email || !formData.password || !formData.username) {
      setError('All fields are required')
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/chatbots/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          phoneNumber: formData.phoneNumber,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create account')
      } else {
        setSuccess('Account created successfully! You can now sign in.')
        setTimeout(() => {
          setIsSignUp(false)
          setFormData({ email: '', password: '', confirmPassword: '', username: '', phoneNumber: '' })
        }, 2000)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (!formData.email || !formData.password) {
      setError('Email and password are required')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/chatbots/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid email or password')
      } else {
        setSuccess('Login successful! Redirecting...')
        setTimeout(() => {
          localStorage.setItem('chatbot_user', JSON.stringify(data.user))
          localStorage.setItem('chatbot_token', data.session.access_token)
          window.location.href = '/chatbots-ai/dashboard'
        }, 1500)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50"
          >
            {/* Header */}
            <div className="relative h-32 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-40 h-40 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute top-10 right-0 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>
              <div className="relative h-full flex items-center justify-center">
                <h1 className="text-3xl font-bold text-white text-center">
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </h1>
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-black/20 rounded-full p-2 backdrop-blur-sm"
              >
                ✕
              </button>
            </div>

            {/* Form Container */}
            <div className="p-8">
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-200">{error}</p>
                </motion.div>
              )}

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-200">{success}</p>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Username - Sign Up Only */}
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Username</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Choose a username"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Phone - Sign Up Only */}
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Phone Number (Optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Min. 6 characters"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-12 pr-12 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password - Sign Up Only */}
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm password"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity" />
                  <span className="relative">
                    {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
                  </span>
                  {!isLoading && <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />}
                </motion.button>
              </form>

              {/* Toggle Form */}
              <div className="mt-6 text-center text-slate-400">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError('')
                    setSuccess('')
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </div>

              {/* Terms */}
              <p className="text-xs text-slate-500 text-center mt-4">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
