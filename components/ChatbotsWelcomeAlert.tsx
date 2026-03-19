"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Zap, Bot } from "lucide-react"

interface ChatbotsWelcomeAlertProps {
  onClose?: () => void
}

export default function ChatbotsWelcomeAlert({ onClose }: ChatbotsWelcomeAlertProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Show alert on component mount
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
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
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />

          {/* Alert Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="relative glow-border rounded-xl bg-gradient-to-br from-hacker-terminal/95 to-hacker-bg/95 backdrop-blur-xl p-8 border border-hacker-green/30 overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-hacker-green/10 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-hacker-green/5 rounded-full blur-3xl opacity-50"></div>

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="absolute top-4 right-4 text-hacker-green-dim hover:text-hacker-green transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-hacker-green/20 rounded-full blur-lg animate-pulse"></div>
                    <Bot className="w-16 h-16 text-hacker-green relative z-10" />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-tech font-bold text-hacker-green-bright text-center mb-3 glow-text"
                >
                  Welcome to AI Bots!
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-hacker-green text-center text-sm mb-2 font-tech"
                >
                  // NEW HOSTING PLATFORM
                </motion.p>

                {/* Main message */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-hacker-green-dim text-center mb-6 leading-relaxed"
                >
                  Host your powerful WhatsApp bots on our brand new secure platform. Deploy, manage, and scale with ease.
                </motion.p>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3 mb-8"
                >
                  {[
                    "⚡ Deploy in seconds",
                    "🔒 Enterprise-grade security",
                    "📊 Real-time analytics",
                    "🚀 Auto-scaling infrastructure",
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center gap-3 text-hacker-green-bright text-sm"
                    >
                      <span className="text-hacker-green font-bold">✓</span>
                      {feature}
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  onClick={handleClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full relative px-6 py-3 font-tech font-bold text-hacker-bg rounded-lg overflow-hidden group mb-3"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-hacker-green opacity-100 group-hover:opacity-110 transition-all duration-300"></div>
                  <div className="absolute inset-0 bg-hacker-green shadow-lg shadow-hacker-green/80 group-hover:shadow-hacker-green/100 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                  <span className="relative flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    Start Building Now
                  </span>
                </motion.button>

                {/* Close link */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  onClick={handleClose}
                  className="w-full text-hacker-green-dim hover:text-hacker-green-bright transition-colors text-sm font-tech"
                >
                  I'll explore later
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
