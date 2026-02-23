"use client"

import { useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"

const GlobeAnimation = dynamic(() => import("./GlobeAnimation"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 md:h-full bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
      <div className="text-cyan-400 animate-pulse">Loading 3D Globe...</div>
    </div>
  ),
})

interface Particle {
  id: number
  left: number
  top: number
  duration: number
  delay: number
}

export default function HeroSection() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const generatedParticles: Particle[] = [
      ...Array(20)
    ].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }))
    setParticles(generatedParticles)
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black z-0"></div>

      {/* Grid effect background */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(0,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Animated particles */}
      <div className="absolute inset-0 opacity-40 z-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              background: particle.id % 2 === 0 ? "#00d4ff" : "#ff00ff",
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex relative z-10 w-full h-full items-center justify-center pt-20 md:pt-0">
        <div className="grid grid-cols-2 gap-6 md:gap-8 lg:gap-12 container mx-auto px-4 md:px-6 py-8 md:py-0 h-full items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex flex-col justify-center items-start"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-4 relative z-20"
            >
              <span className="inline-block px-3 md:px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs md:text-sm font-tech">
                // Connected Security
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-3xl xs:text-3.5xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-tech font-bold mb-6 text-balance leading-tight bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-200 bg-clip-text text-transparent"
            >
              ANONYMIKETECH
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-cyan-300/80 mb-6 md:mb-8 font-tech text-balance max-w-md"
            >
              // Unleashing Digital Innovation & Cyber Excellence
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xs sm:text-sm md:text-base text-gray-400 mb-6 md:mb-8 max-w-md leading-relaxed"
            >
              Experience cutting-edge technology solutions with global reach and uncompromising security. Connect to our innovation lab and explore the future of digital transformation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex gap-3 md:gap-4 flex-wrap"
            >
              <a href="/contact">
                <button className="px-4 md:px-6 py-2 md:py-3 rounded-lg font-tech font-bold text-xs md:text-sm text-hacker-terminal bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/50 transition-all border-2 border-transparent hover:border-cyan-400">
                  Get Started
                </button>
              </a>
              <a href="#services">
                <button className="px-4 md:px-6 py-2 md:py-3 rounded-lg font-tech font-bold text-xs md:text-sm text-cyan-400 border-2 border-cyan-400/50 hover:border-cyan-400 hover:bg-cyan-400/5 transition-all">
                  Explore Services
                </button>
              </a>
            </motion.div>
          </motion.div>

          {/* Right side - 3D Globe */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex items-center justify-center h-full min-h-96"
          >
            <Suspense
              fallback={
                <div className="text-cyan-400 animate-pulse text-xs md:text-base">Loading 3D Globe...</div>
              }
            >
              <GlobeAnimation />
            </Suspense>
          </motion.div>
        </div>
      </div>

      {/* Mobile Layout - Overlay */}
      <div className="lg:hidden relative z-10 w-full h-full flex items-center justify-center pt-20">
        {/* Globe background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Suspense
            fallback={
              <div className="text-cyan-400 animate-pulse text-xs md:text-base">Loading 3D Globe...</div>
            }
          >
            <GlobeAnimation />
          </Suspense>
        </motion.div>

        {/* Text content overlay */}
        <div className="relative z-20 w-full container mx-auto px-4 py-8 flex flex-col justify-center items-start h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-4"
          >
            <span className="inline-block px-3 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-tech">
              // Connected Security
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-3xl xs:text-3.5xl sm:text-4xl font-tech font-bold mb-6 text-balance leading-tight bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-200 bg-clip-text text-transparent"
          >
            ANONYMIKETECH
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-sm sm:text-base text-cyan-300/80 mb-6 font-tech text-balance max-w-md"
          >
            // Unleashing Digital Innovation & Cyber Excellence
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xs sm:text-sm text-gray-400 mb-6 max-w-md leading-relaxed"
          >
            Experience cutting-edge technology solutions with global reach and uncompromising security. Connect to our innovation lab and explore the future of digital transformation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex gap-3 flex-wrap"
          >
            <a href="/contact">
              <button className="px-4 py-2 rounded-lg font-tech font-bold text-xs sm:text-sm text-hacker-terminal bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/50 transition-all border-2 border-transparent hover:border-cyan-400">
                Get Started
              </button>
            </a>
            <a href="#services">
              <button className="px-4 py-2 rounded-lg font-tech font-bold text-xs sm:text-sm text-cyan-400 border-2 border-cyan-400/50 hover:border-cyan-400 hover:bg-cyan-400/5 transition-all">
                Explore Services
              </button>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Floating accent elements */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl opacity-20 z-0"
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
      ></motion.div>
      <motion.div
        className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-20 z-0"
        animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
      ></motion.div>
    </motion.section>
  )
}
