"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

interface ChatbotsAuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatbotsAuthModal({ isOpen, onClose }: ChatbotsAuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    phoneNumber: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match")
      }

      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      const response = await fetch("/api/chatbots/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          phoneNumber: formData.phoneNumber,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Signup failed")
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
        router.push("/chatbots-ai/dashboard")
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      setSuccess(true)
      localStorage.setItem("chatbot_token", data.session?.access_token)
      setTimeout(() => {
        onClose()
        router.push("/chatbots-ai/dashboard")
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
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
                <h2 className="text-2xl font-bold text-cyan-400">
                  {mode === "login" ? "Sign In" : "Create Account"}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {success ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="text-4xl mb-4">✓</div>
                    <p className="text-green-400 font-semibold">
                      {mode === "login" ? "Welcome back!" : "Account created successfully!"}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">Redirecting to dashboard...</p>
                  </motion.div>
                ) : (
                  <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4">
                    {/* Email */}
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-cyan-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        required
                      />
                    </div>

                    {/* Signup fields */}
                    {mode === "signup" && (
                      <>
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">Username</label>
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="your_username"
                            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-cyan-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-300 mb-2">Phone Number (optional)</label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="254712345678"
                            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-cyan-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                          />
                        </div>
                      </>
                    )}

                    {/* Password */}
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-cyan-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        required
                      />
                    </div>

                    {/* Confirm Password (Signup) */}
                    {mode === "signup" && (
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-cyan-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                          required
                        />
                      </div>
                    )}

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
                      disabled={loading}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all duration-300"
                    >
                      {loading
                        ? "Processing..."
                        : mode === "login"
                          ? "Sign In"
                          : "Create Account"}
                    </button>

                    {/* Toggle Mode */}
                    <div className="text-center pt-4 border-t border-cyan-500/20">
                      <p className="text-gray-400 text-sm">
                        {mode === "login"
                          ? "Don't have an account? "
                          : "Already have an account? "}
                        <button
                          type="button"
                          onClick={() => {
                            setMode(mode === "login" ? "signup" : "login")
                            setError(null)
                            setFormData({
                              email: "",
                              password: "",
                              username: "",
                              phoneNumber: "",
                              confirmPassword: "",
                            })
                          }}
                          className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                        >
                          {mode === "login" ? "Sign up" : "Sign in"}
                        </button>
                      </p>
                    </div>
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
