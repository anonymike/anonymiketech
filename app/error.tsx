"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Home, RefreshCw, Terminal, AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [glitchActive, setGlitchActive] = useState(false)

  useEffect(() => {
    console.error(error)
  }, [error])

  // Random glitch
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 150)
    }, 4000 + Math.random() * 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-green relative overflow-hidden flex items-center justify-center">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--hacker-green)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--hacker-green)) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)`,
        }}
      />

      <div className="relative z-20 w-full max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-xl border border-red-500/30 overflow-hidden shadow-2xl"
          style={{
            boxShadow: "0 0 40px rgba(255,0,0,0.08), 0 0 80px rgba(255,0,0,0.04)",
            background: "linear-gradient(180deg, hsl(var(--hacker-terminal)) 0%, hsl(var(--hacker-bg)) 100%)",
          }}
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-hacker-terminal border-b border-red-500/20">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80 animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/40" />
            </div>
            <span className="text-red-400/80 font-mono text-xs ml-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" />
              SYSTEM ERROR DETECTED
            </span>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-8 space-y-6">
            {/* Error output */}
            <div className="font-mono text-sm space-y-1">
              <div className="text-red-400/80">
                <span className="text-red-500">{"[ERROR]"}</span>{" "}
                Something went wrong while processing your request
              </div>
              <div className="text-hacker-green-dim text-xs">
                <span className="text-yellow-500/70">{"[WARN]"}</span>{" "}
                {"Don't worry, our digital hamsters are investigating..."}
              </div>
            </div>

            {/* Big error icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
              className="text-center py-4"
            >
              <div
                className={`text-7xl sm:text-8xl font-mono font-black tracking-tighter transition-all inline-block ${
                  glitchActive ? "translate-x-1 skew-x-2" : ""
                }`}
                style={{
                  textShadow: glitchActive
                    ? "-3px 0 #ff0000, 3px 0 #00ffff"
                    : "0 0 20px rgba(255,0,0,0.3), 0 0 40px rgba(255,0,0,0.15)",
                  color: "#ef4444",
                }}
              >
                {":("}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-4 space-y-2"
              >
                <h2 className="text-base sm:text-lg font-tech font-bold text-red-400 tracking-wider">
                  SOMETHING BROKE
                </h2>
                <p className="text-xs sm:text-sm text-hacker-green-dim font-tech leading-relaxed max-w-md mx-auto">
                  {"Our code just had an existential crisis. Give it a moment to find itself, then try again."}
                </p>
              </motion.div>
            </motion.div>

            {/* Error details (collapsed) */}
            {error.digest && (
              <div className="font-mono text-[10px] text-hacker-green/30 bg-hacker-bg/50 rounded-lg p-3 border border-hacker-green/10">
                Error ID: {error.digest}
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-red-500/20" />
              <Terminal className="w-4 h-4 text-red-500/40" />
              <div className="flex-1 h-px bg-red-500/20" />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0,255,0,0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={reset}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-lg font-tech font-semibold text-sm border border-hacker-green bg-hacker-green/10 text-hacker-green-bright hover:bg-hacker-green/20 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </motion.button>

              <a href="/" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-lg font-tech font-semibold text-sm border border-hacker-green/30 text-hacker-green-dim hover:text-hacker-green-bright hover:border-hacker-green/60 hover:bg-hacker-green/5 transition-all"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </motion.button>
              </a>
            </div>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center text-[10px] sm:text-xs text-hacker-green/30 font-mono"
            >
              {"// The bug has been reported. Probably."}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
