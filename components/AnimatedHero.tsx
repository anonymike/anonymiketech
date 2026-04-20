"use client"

import { motion } from "framer-motion"
import { TypeAnimation } from "react-type-animation"
import Globe3D from "./Globe3D"
import { useState, useEffect } from "react"
import { ArrowRight, Code2, Zap } from "lucide-react"

export default function AnimatedHero() {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    setShowContent(true)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Deep blue radial gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
        <div className="absolute inset-0 bg-radial-gradient from-blue-900/40 via-transparent to-transparent" />
      </div>

      {/* Animated background stars and particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(80)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2.5 + 0.5,
              height: Math.random() * 2.5 + 0.5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
            animate={{
              opacity: [Math.random() * 0.7 + 0.3, Math.random() * 0.3 + 0.8, Math.random() * 0.7 + 0.3],
              y: [0, Math.random() * 30 - 15, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Glow orbs */}
      <motion.div
        className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          y: [0, 30, 0],
          x: [0, 20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-20 left-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"
        animate={{
          y: [0, -20, 0],
          x: [0, -15, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
      />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-4 md:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={showContent ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Logo section */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-2"
              >
                <Code2 className="w-8 h-8 text-cyan-400" />
                <span className="text-xl font-bold text-white">AnonymikeTech</span>
              </motion.div>

              {/* Main heading with typing effect */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-4"
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white">
                  <TypeAnimation
                    sequence={[
                      "Innovate Your",
                      1000,
                      "Transform Your",
                      1000,
                    ]}
                    speed={50}
                    style={{ fontSize: "inherit", fontWeight: "inherit" }}
                    repeat={Infinity}
                  />
                  <span className="block mt-2">
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Digital Future.
                    </span>
                  </span>
                </h1>
              </motion.div>

              {/* Description with fade-in */}
              <motion.p
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="text-lg text-gray-300 leading-relaxed max-w-md"
              >
                Empower your business with cutting-edge web development, intelligent AI chatbots, and secure internet solutions designed for success.
              </motion.p>

              {/* Features list with staggered animation */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {["Web & App Development", "AI-Powered Chatbots", "Secure Internet Services"].map((feature, idx) => (
                  <motion.div key={idx} variants={itemVariants} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-gray-200">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row gap-4 pt-8"
              >
                <a href="/portfolio" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                  >
                    Discover Innovations
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </a>
                <a href="/contact" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-8 py-4 rounded-lg border-2 border-cyan-400/50 text-cyan-300 font-semibold hover:bg-cyan-500/10 transition-all"
                  >
                    Contact Us
                  </motion.button>
                </a>
              </motion.div>

              {/* Stats section */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex gap-12 pt-8 border-t border-white/10"
              >
                <motion.div variants={itemVariants}>
                  <div className="text-3xl font-bold text-cyan-400">500+</div>
                  <div className="text-sm text-gray-400">Projects Delivered</div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <div className="text-3xl font-bold text-cyan-400">99%</div>
                  <div className="text-sm text-gray-400">Client Satisfaction</div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <div className="text-3xl font-bold text-cyan-400">10+</div>
                  <div className="text-sm text-gray-400">Years Experience</div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right side - 3D Globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={showContent ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.8, x: 50 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative h-full min-h-96 md:min-h-screen flex items-center justify-center"
            >
              {/* Glow ring around globe */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="absolute w-96 h-96 rounded-full border-2 border-cyan-400/30"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.div
                  className="absolute w-80 h-80 rounded-full border border-blue-400/20"
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>

              {/* 3D Globe */}
              <div className="relative w-full h-full max-w-lg max-h-96">
                <Globe3D />
              </div>

              {/* Connection lines visualization */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ filter: "drop-shadow(0 0 20px rgba(34, 211, 238, 0.3))" }}
              >
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <motion.line
                  x1="10%"
                  y1="30%"
                  x2="60%"
                  y2="50%"
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
                <motion.line
                  x1="20%"
                  y1="70%"
                  x2="70%"
                  y2="40%"
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.7 }}
                />
              </svg>

              {/* Floating UI cards */}
              <motion.div
                className="absolute bottom-10 right-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 max-w-xs"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: 0.5,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-semibold text-sm">99.9% Uptime</span>
                </div>
                <p className="text-gray-300 text-xs">Enterprise-grade reliability guaranteed</p>
              </motion.div>

              <motion.div
                className="absolute top-1/4 left-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 max-w-xs"
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  delay: 0.3,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-white font-semibold text-sm">Latest Tech Stack</span>
                </div>
                <p className="text-gray-300 text-xs">Built with Next.js, React & TypeScript</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-2">Scroll to explore</p>
          <svg className="w-6 h-6 mx-auto text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </div>
  )
}
