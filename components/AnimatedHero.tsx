"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { ArrowRight, Code2 } from "lucide-react"
import LottieGlobe from "./LottieGlobe"

export default function AnimatedHero() {
  const [showContent, setShowContent] = useState(false)
  const [displayText, setDisplayText] = useState("Innovate Your")

  useEffect(() => {
    setShowContent(true)

    // Stable text animation that doesn't shift layout
    const textSequence = ["Innovate Your", "Transform Your"]
    let currentIndex = 0

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % textSequence.length
      setDisplayText(textSequence[currentIndex])
    }, 3000) // Change text every 3 seconds

    return () => clearInterval(interval)
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
        {/* Background Lottie Globe - positioned behind on mobile, left on desktop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={showContent ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute inset-0 z-0 lg:relative lg:z-10 flex items-center justify-center lg:justify-start"
        >
          {/* Glow effect behind globe */}
          <div className="absolute inset-0 bg-radial-gradient from-cyan-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl opacity-70 lg:opacity-100" />
          
          <div className="w-full h-full lg:w-[400px] lg:h-[500px] opacity-50 lg:opacity-100 relative z-10">
            <LottieGlobe />
          </div>
        </motion.div>

        <div className="container mx-auto px-4 md:px-8 py-20 relative z-20">
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

              {/* Main heading with stable animation */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-4"
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white h-auto">
                  <motion.span
                    key={displayText}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="block"
                  >
                    {displayText}
                  </motion.span>
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

              {/* Stats */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-3 gap-4 pt-8 border-t border-cyan-400/20"
              >
                <div>
                  <motion.div variants={itemVariants} className="text-3xl font-bold text-cyan-400">
                    500+
                  </motion.div>
                  <p className="text-sm text-gray-400">Projects Done</p>
                </div>
                <div>
                  <motion.div variants={itemVariants} className="text-3xl font-bold text-cyan-400">
                    99%
                  </motion.div>
                  <p className="text-sm text-gray-400">Satisfaction</p>
                </div>
                <div>
                  <motion.div variants={itemVariants} className="text-3xl font-bold text-cyan-400">
                    10+
                  </motion.div>
                  <p className="text-sm text-gray-400">Years XP</p>
                </div>
              </motion.div>
            </motion.div>


          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">Scroll to explore</p>
          <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex items-start justify-center p-2 mx-auto">
            <motion.div
              className="w-1 h-2 bg-cyan-400 rounded-full"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
