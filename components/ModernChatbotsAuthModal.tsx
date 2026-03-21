'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, X } from 'lucide-react'

interface ModernChatbotsAuthModalProps {
  isOpen: boolean
  onClose: () => void
  onShowForgotPassword?: () => void
}

export default function ModernChatbotsAuthModal({
  isOpen,
  onClose,
  onShowForgotPassword,
}: ModernChatbotsAuthModalProps) {
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
    referralCode: '',
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
          referralCode: formData.referralCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create account')
      } else {
        setSuccess('Account created successfully! You can now sign in.')
        setTimeout(() => {
          setIsSignUp(false)
          setFormData({ email: '', password: '', confirmPassword: '', username: '', phoneNumber: '', referralCode: '' })
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm sm:max-w-md bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-cyan-500/30 shadow-2xl overflow-hidden mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-cyan-600/20 border-b border-cyan-500/30">
              <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Form Container */}
            <form
              onSubmit={isSignUp ? handleSignUp : handleSignIn}
              className="p-4 sm:p-6 space-y-4 sm:space-y-5"
            >
              {/* Error Alert */}
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              {/* Success Alert */}
              {success && (
                <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm">
                  {success}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-cyan-400/50" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Username - Sign Up Only */}
              {isSignUp && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-cyan-400/50" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Choose a username"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Phone - Sign Up Only */}
              {isSignUp && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-2">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-cyan-400/50" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Referral Code - Sign Up Only */}
              {isSignUp && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-2">
                    Referral Code (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-cyan-400/50" />
                    <input
                      type="text"
                      name="referralCode"
                      value={formData.referralCode}
                      onChange={handleInputChange}
                      placeholder="Enter a referral code"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Join with a friend's code and get 50 bonus coins!
                  </p>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-cyan-400/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Min. 6 characters"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password - Sign Up Only */}
              {isSignUp && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-cyan-400/50" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-2.5 sm:py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity" />
                <span className="relative text-sm sm:text-base">
                  {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
                </span>
                {!isLoading && (
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative group-hover:translate-x-1 transition-transform" />
                )}
              </motion.button>

              {/* Forgot Password - Sign In Only */}
              {!isSignUp && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={onShowForgotPassword}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors text-xs sm:text-sm"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Toggle Form */}
              <div className="mt-6 text-center text-slate-400 text-xs sm:text-sm">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
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
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
