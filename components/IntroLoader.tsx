"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface IntroLoaderProps {
  onComplete: () => void
}

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [stage, setStage] = useState(0)
  const [loadingText, setLoadingText] = useState("")
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("anonymiketech_intro_seen")
    if (hasSeenIntro) {
      onComplete()
      return
    }
  }, [onComplete])

  const hackingSequence = [
    "INITIALIZING SYSTEM...",
    "LOADING SECURITY PROTOCOLS...",
    "ESTABLISHING SECURE CONNECTION...",
    "VERIFYING CREDENTIALS...",
    "OPTIMIZING PERFORMANCE...",
    "CONFIGURING SERVICES...",
    "ANONYMIKETECH SYSTEMS ONLINE",
    "WELCOME TO ANONYMIKETECH WORLD",
  ]

  const matrixChars = "01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ"

  const generateMatrixString = (length: number) => {
    return Array.from({ length }, () => matrixChars[Math.floor(Math.random() * matrixChars.length)]).join("")
  }

  useEffect(() => {
    const sequence = async () => {
      for (let i = 0; i < hackingSequence.length; i++) {
        setStage(i)

        const text = hackingSequence[i]
        for (let j = 0; j <= text.length; j++) {
          setLoadingText(text.substring(0, j))
          await new Promise((resolve) => setTimeout(resolve, 30))
        }

        await new Promise((resolve) => setTimeout(resolve, 250))
      }

      setTimeout(() => {
        setIsVisible(false)
        setTimeout(onComplete, 600)
      }, 500)
    }

    sequence()
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center overflow-hidden"
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 80%, rgba(0, 255, 255, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 20%, rgba(0, 255, 255, 0.3) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          />

          {/* Colorful matrix background with cyan, blue, purple */}
          <div className="absolute inset-0 opacity-25">
            {Array.from({ length: 50 }, (_, i) => (
              <motion.div
                key={i}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: "100vh", opacity: [0, 1, 0] }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                  ease: "linear",
                }}
                className={`absolute font-tech text-sm font-bold ${
                  ["text-cyan-400", "text-blue-400", "text-purple-400", "text-emerald-400", "text-pink-400"][i % 5]
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  transform: "translateX(-50%)",
                  textShadow: "0 0 10px currentColor",
                }}
              >
                {generateMatrixString(20)}
              </motion.div>
            ))}
          </div>

          {/* Glitch Effect Overlay */}
          <motion.div
            animate={{
              opacity: [0, 0.1, 0],
              scaleX: [1, 1.02, 1],
              skewX: [0, 0.5, 0],
            }}
            transition={{
              duration: 0.1,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: Math.random() * 2,
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mix-blend-screen"
          />

          {/* Main Content */}
          <div className="relative z-10 text-center max-w-4xl px-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.5, type: "spring" }}
              className="mb-12"
            >
              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-tech font-bold mb-4"
                style={{
                  background: "linear-gradient(to right, #00ffff, #0088ff, #ff00ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                animate={{
                  textShadow: [
                    "0 0 10px #00ffff, 0 0 20px #0088ff, 0 0 30px #ff00ff",
                    "0 0 20px #00ffff, 0 0 40px #0088ff, 0 0 60px #ff00ff",
                    "0 0 10px #00ffff, 0 0 20px #0088ff, 0 0 30px #ff00ff",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                ANONYMIKETECH
              </motion.h1>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-6"
              >
                <div
                  className="w-full h-full border-4"
                  style={{
                    borderImage: "linear-gradient(45deg, #00ffff, #0088ff, #ff00ff) 1",
                    clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                    boxShadow: "0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 136, 255, 0.6)",
                  }}
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="bg-black/80 border-2 rounded-lg p-6 max-w-2xl mx-auto backdrop-blur-sm"
              style={{
                borderImage: "linear-gradient(135deg, #00ffff, #0088ff) 1",
                boxShadow:
                  "0 0 30px rgba(0, 255, 255, 0.5), 0 0 60px rgba(0, 136, 255, 0.3), inset 0 0 30px rgba(0, 255, 255, 0.1)",
              }}
            >
              {/* Terminal Header */}
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-cyan-500/50">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                <span className="ml-2 text-cyan-400 font-tech text-sm">SYSTEM_INIT.exe</span>
              </div>

              {/* Loading Text */}
              <div className="font-tech text-left">
                {hackingSequence.slice(0, stage + 1).map((text, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-1 ${index === stage ? "text-cyan-300 font-bold" : "text-cyan-500/70"}`}
                  >
                    {index === stage ? (
                      <>
                        <span className="text-purple-400">{"> "}</span>
                        {loadingText}
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                          className="ml-1 text-cyan-400"
                        >
                          █
                        </motion.span>
                      </>
                    ) : (
                      <>
                        <span className="text-purple-400">{"> "}</span>
                        <span>{text}</span>
                        <span className="text-green-400 ml-2">✓</span>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="w-full bg-slate-800 rounded-full h-2 border border-cyan-500/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((stage + 1) / hackingSequence.length) * 100}%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(to right, #00ffff, #0088ff, #ff00ff)",
                      boxShadow: "0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 136, 255, 0.6)",
                    }}
                  />
                </div>
                <div className="text-center mt-2 text-cyan-400 font-tech text-sm">
                  {Math.round(((stage + 1) / hackingSequence.length) * 100)}% COMPLETE
                </div>
              </div>
            </motion.div>

            {/* Scan Lines Effect */}
            <motion.div
              animate={{ y: ["-100vh", "100vh"] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-10 h-4 pointer-events-none"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
