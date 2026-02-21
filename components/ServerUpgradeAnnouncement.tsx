"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Server, Zap, Shield, TrendingUp, CheckCircle, Rocket, Crown, Sparkles } from "lucide-react"

export default function ServerUpgradeAnnouncement() {
  const [isVisible, setIsVisible] = useState(true)
  const [currentFeature, setCurrentFeature] = useState(0)

  const upgradedFeatures = [
    { icon: Zap, text: "⚡ 5x Faster Speeds", color: "text-yellow-400" },
    { icon: Shield, text: "🛡️ Enhanced Security", color: "text-blue-400" },
    { icon: TrendingUp, text: "📈 99.9% Uptime", color: "text-green-400" },
    { icon: Server, text: "🚀 Latest Hardware", color: "text-purple-400" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % upgradedFeatures.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.9 }}
        transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
        className="relative overflow-hidden"
      >
        {/* Main Announcement Banner */}
        <div className="bg-gradient-to-r from-green-900/90 via-emerald-900/90 to-green-900/90 border-2 border-green-500/50 rounded-lg p-6 mb-8 relative">
          {/* Animated Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-green-400 rounded-full opacity-60"
                animate={{
                  x: [0, Math.random() * 200],
                  y: [0, Math.random() * 100],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 3,
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Glowing Border Effect */}
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-green-400/30 pointer-events-none"
            animate={{
              boxShadow: [
                "0 0 20px #22c55e",
                "0 0 40px #22c55e",
                "0 0 60px #22c55e",
                "0 0 40px #22c55e",
                "0 0 20px #22c55e",
              ],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          />

          <div className="relative z-10">
            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 p-2 hover:bg-green-700/30 rounded-lg transition-colors z-20"
              aria-label="Dismiss announcement"
            >
              <X className="w-5 h-5 text-green-300 hover:text-white" />
            </button>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Left Side - Icon and Status */}
              <div className="flex flex-col items-center lg:items-start space-y-4">
                {/* Animated Server Icon */}
                <motion.div
                  className="relative"
                  animate={{
                    rotateY: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotateY: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                    scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                  }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-2xl">
                    <Server className="w-10 h-10 text-white" />
                  </div>

                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white"
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-green-600 text-white px-4 py-2 rounded-full font-tech font-bold text-sm shadow-lg"
                >
                  🟢 SERVERS ONLINE
                </motion.div>
              </div>

              {/* Center - Main Message */}
              <div className="flex-1 text-center lg:text-left space-y-4">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl lg:text-4xl font-tech font-bold text-white"
                >
                  <motion.span
                    animate={{
                      textShadow: [
                        "0 0 10px #22c55e",
                        "0 0 20px #22c55e",
                        "0 0 30px #22c55e",
                        "0 0 20px #22c55e",
                        "0 0 10px #22c55e",
                      ],
                    }}
                    transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    🚀 NEW SERVERS ARE BACK!
                  </motion.span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg text-green-100 font-tech leading-relaxed"
                >
                  Server upgrade complete! Experience blazing-fast VPN speeds, enhanced security, and rock-solid
                  reliability like never before.
                </motion.p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center lg:justify-start gap-3"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                      className={upgradedFeatures[currentFeature].color}
                    >
                      {React.createElement(upgradedFeatures[currentFeature].icon, {
                        className: "w-6 h-6",
                      })}
                    </motion.div>
                    <span className={`font-tech font-bold text-lg ${upgradedFeatures[currentFeature].color}`}>
                      {upgradedFeatures[currentFeature].text}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Side - Call to Action */}
              <div className="flex flex-col items-center space-y-4">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    y: [0, -5, 0],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  className="text-yellow-400"
                >
                  <Crown className="w-12 h-12" />
                </motion.div>

                <motion.a
                  href="/internet-services"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-lg font-tech font-bold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-green-500/50"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                >
                  <Rocket className="w-5 h-5" />
                  Experience New Speeds
                  <Sparkles className="w-5 h-5" />
                </motion.a>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-center text-green-200 font-tech text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Latency: &lt;10ms</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Bandwidth: Unlimited</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Bottom Progress Bar Animation */}
            <motion.div
              className="mt-6 h-1 bg-green-800 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="mt-4 text-center text-green-300 font-tech text-xs"
            >
              🗓️ Upgraded:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              • Next-gen infrastructure now live
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
