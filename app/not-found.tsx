"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Home, Terminal, RefreshCw, Search } from "lucide-react"

const glitchMessages = [
  "OOPS... LOOKS LIKE YOU GOT LOST IN THE MATRIX",
  "THIS PAGE HAS BEEN EATEN BY A BUG",
  "ERROR: BRAIN.EXE NOT FOUND",
  "EVEN HACKERS GET LOST SOMETIMES",
  "YOU TOOK A WRONG TURN IN CYBERSPACE",
  "THIS PAGE WENT ON VACATION",
  "404: PAGE IS PLAYING HIDE AND SEEK",
  "SOMEONE UNPLUGGED THE INTERNET CABLE",
]

const funnySubtexts = [
  "The page you're looking for has disappeared into the void... just like my motivation on Mondays.",
  "We searched every line of code. Twice. Still nothing.",
  "This page is as real as the cake. The cake is a lie.",
  "Looks like this page took the red pill and escaped the Matrix.",
  "Our hamster-powered server couldn't find what you wanted.",
  "The developer responsible for this page has been sent to a coding bootcamp.",
]

// Seeded pseudo-random to get deterministic values
function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

// Pre-compute deterministic values for floating binary elements
const binaryElements = Array.from({ length: 20 }).map((_, i) => ({
  xPercent: seededRandom(i * 7 + 3) * 100,
  duration: 8 + seededRandom(i * 13 + 5) * 12,
  delay: seededRandom(i * 17 + 11) * 5,
  text: seededRandom(i * 23 + 7) > 0.5 ? "01001" : "10110",
}))

function FloatingBinary() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {binaryElements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute text-hacker-green/5 font-mono text-xs select-none"
          style={{ left: `${el.xPercent}%` }}
          initial={{ y: -20 }}
          animate={{ y: "100vh" }}
          transition={{
            duration: el.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: el.delay,
            ease: "linear",
          }}
        >
          {el.text}
        </motion.div>
      ))}
    </div>
  )
}

export default function NotFound() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [currentSubtext, setCurrentSubtext] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [glitchActive, setGlitchActive] = useState(false)
  const [scanlineY, setScanlineY] = useState(0)

  // Terminal typing effect
  const fullCommand = "$ find / -name 'missing_page' 2>/dev/null"

  useEffect(() => {
    if (!isTyping) return
    if (typedText.length < fullCommand.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullCommand.slice(0, typedText.length + 1))
      }, 50 + Math.random() * 80)
      return () => clearTimeout(timeout)
    }
    setIsTyping(false)
  }, [typedText, isTyping])

  // Rotate funny messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % glitchMessages.length)
      setCurrentSubtext((prev) => (prev + 1) % funnySubtexts.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Random glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 200)
    }, 3000 + Math.random() * 4000)
    return () => clearInterval(interval)
  }, [])

  // Scanline animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanlineY((prev) => (prev + 2) % 100)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  const handleRetry = useCallback(() => {
    setTypedText("")
    setIsTyping(true)
  }, [])

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-green relative overflow-hidden flex items-center justify-center">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--hacker-green)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--hacker-green)) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)`,
        }}
      />
      <div
        className="absolute left-0 right-0 h-1 bg-hacker-green/10 pointer-events-none z-10"
        style={{ top: `${scanlineY}%` }}
      />

      {/* Floating binary in background - only rendered client-side to avoid hydration mismatch */}
      <FloatingBinary />

      <div className="relative z-20 w-full max-w-2xl mx-auto px-4 sm:px-6">
        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-xl border border-hacker-green/30 overflow-hidden shadow-2xl"
          style={{
            boxShadow: "0 0 40px rgba(0,255,0,0.08), 0 0 80px rgba(0,255,0,0.04)",
            background: "linear-gradient(180deg, hsl(var(--hacker-terminal)) 0%, hsl(var(--hacker-bg)) 100%)",
          }}
        >
          {/* Terminal header bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-hacker-terminal border-b border-hacker-green/20">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-hacker-green-dim font-mono text-xs ml-2">
              anonymiketech@server:~
            </span>
          </div>

          {/* Terminal content */}
          <div className="p-5 sm:p-8 space-y-6">
            {/* Typing command line */}
            <div className="font-mono text-sm text-hacker-green-dim">
              <span className="text-hacker-green-bright">{">"}</span>{" "}
              <span>{typedText}</span>
              {isTyping && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
                  className="inline-block w-2 h-4 bg-hacker-green ml-0.5 align-middle"
                />
              )}
            </div>

            {!isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-mono text-xs text-red-400/80"
              >
                {">> No results found. Error code: 404"}
              </motion.div>
            )}

            {/* Big 404 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
              className="text-center py-4"
            >
              <div
                className={`text-7xl sm:text-9xl font-mono font-black tracking-tighter transition-all ${
                  glitchActive ? "translate-x-1 skew-x-2" : ""
                }`}
                style={{
                  textShadow: glitchActive
                    ? "-3px 0 #ff0000, 3px 0 #00ffff"
                    : "0 0 20px hsl(var(--hacker-green-glow)), 0 0 40px hsl(var(--hacker-green-glow))",
                  color: "hsl(var(--hacker-green-bright))",
                }}
              >
                404
              </div>

              {/* Glitch duplicate layers */}
              {glitchActive && (
                <>
                  <div
                    className="absolute text-7xl sm:text-9xl font-mono font-black tracking-tighter text-red-500/30"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(calc(-50% - 4px), calc(-50% + 2px))",
                      clipPath: "inset(20% 0 40% 0)",
                    }}
                  >
                    404
                  </div>
                  <div
                    className="absolute text-7xl sm:text-9xl font-mono font-black tracking-tighter text-cyan-500/30"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(calc(-50% + 4px), calc(-50% - 2px))",
                      clipPath: "inset(50% 0 10% 0)",
                    }}
                  >
                    404
                  </div>
                </>
              )}
            </motion.div>

            {/* Rotating funny message */}
            <motion.div
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center space-y-3"
            >
              <h2 className="text-base sm:text-lg font-tech font-bold text-hacker-green-bright tracking-wider">
                {glitchMessages[currentMessage]}
              </h2>
              <p className="text-xs sm:text-sm text-hacker-green-dim font-tech leading-relaxed max-w-md mx-auto">
                {funnySubtexts[currentSubtext]}
              </p>
            </motion.div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-hacker-green/20" />
              <Terminal className="w-4 h-4 text-hacker-green/40" />
              <div className="flex-1 h-px bg-hacker-green/20" />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0,255,0,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-lg font-tech font-semibold text-sm border border-hacker-green bg-hacker-green/10 text-hacker-green-bright hover:bg-hacker-green/20 transition-all"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRetry}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-lg font-tech font-semibold text-sm border border-hacker-green/30 text-hacker-green-dim hover:text-hacker-green-bright hover:border-hacker-green/60 hover:bg-hacker-green/5 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </motion.button>

              <Link href="/contact" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-lg font-tech font-semibold text-sm border border-hacker-green/30 text-hacker-green-dim hover:text-hacker-green-bright hover:border-hacker-green/60 hover:bg-hacker-green/5 transition-all"
                >
                  <Search className="w-4 h-4" />
                  Contact Us
                </motion.button>
              </Link>
            </div>

            {/* Footer joke */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-center text-[10px] sm:text-xs text-hacker-green/30 font-mono"
            >
              {"// TODO: Add this page... eventually"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
