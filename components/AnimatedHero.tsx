"use client"

import { motion } from "framer-motion"
import { TypeAnimation } from "react-type-animation"
import Globe3D from "./Globe3D"
import { useState, useEffect } from "react"

export default function AnimatedHero() {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    setShowContent(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-900/30 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Text content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={showContent ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Logo/Brand */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={showContent ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg" />
                <span className="text-sm font-semibold text-blue-300">ANONYMIKETECH</span>
              </motion.div>

              {/* Main headline with typing animation */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  <TypeAnimation
                    sequence={[
                      "Revolutionize",
                      1000,
                      "Build",
                      1000,
                      "Create",
                      1000,
                      "Revolutionize",
                    ]}
                    repeat={Infinity}
                    style={{ color: "#00D4FF" }}
                    cursor={true}
                    omitDeletionAnimation={false}
                  />
                  <br />
                  <span className="text-white">Your Digital</span>
                  <br />
                  <span className="text-white">Future.</span>
                </h1>
              </div>

              {/* Description with staggered animation */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-blue-100 max-w-lg leading-relaxed"
              >
                Streamline your digital presence with AI-powered solutions, innovative web design, and
                global connectivity. Transform your business with cutting-edge technology.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <button className="px-8 py-3 bg-white text-blue-900 font-semibold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/30">
                  Explore Solutions
                </button>
                <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300">
                  Contact Us
                </button>
              </motion.div>

              {/* Team collaboration section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={showContent ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-8 border-t border-blue-500/30"
              >
                <p className="text-sm text-blue-200 mb-4">Trusted by 1000+ teams worldwide</p>
                <div className="flex items-center gap-4">
                  {/* Avatar circles */}
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-blue-900 flex items-center justify-center text-white font-bold text-sm"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-white font-semibold">Seamless</p>
                    <p className="text-blue-300 text-sm">Collaboration+</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right side - 3D Globe and floating cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={showContent ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8 }}
              className="relative h-96 md:h-[500px] lg:h-[600px]"
            >
              {/* Globe */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe3D />
              </div>

              {/* Floating info cards */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-20 right-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 w-64 shadow-2xl"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <p className="text-sm font-semibold text-white">Live Integration</p>
                </div>
                <p className="text-xs text-blue-200">
                  https://api.meeting-792-online
                </p>
                <p className="text-xs text-blue-300 mt-2">
                  https://api.meeting-229-code
                </p>
              </motion.div>

              {/* Bottom floating card */}
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-20 left-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 w-56 shadow-2xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full border border-cyan-400" />
                  <p className="text-sm font-semibold text-white">Connection Status</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border border-blue-900"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-cyan-300 font-semibold">Active</span>
                </div>
              </motion.div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-radial from-cyan-500/20 to-transparent rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </motion.div>
    </div>
  )
}
