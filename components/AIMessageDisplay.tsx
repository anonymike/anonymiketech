"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"

interface AIMessageDisplayProps {
  message: string
  recipientName: string
  onClose: () => void
  isVisible: boolean
}

export default function AIMessageDisplay({
  message,
  recipientName,
  onClose,
  isVisible,
}: AIMessageDisplayProps) {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-gradient-to-br from-hacker-terminal via-rose-900/20 to-hacker-terminal border-2 border-rose-500/50 rounded-2xl shadow-2xl shadow-rose-500/30 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500/20 to-pink-500/20 border-b border-rose-500/30 px-6 py-4 flex items-center justify-between">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-tech font-bold text-rose-300"
          >
            ✨ AI Generated Love Message ✨
          </motion.h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 hover:bg-rose-500/20 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-rose-400" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="text-sm text-rose-400/60 font-tech mb-2">To</p>
            <h2 className="text-2xl md:text-3xl font-tech font-bold text-rose-300 glow-text">
              {recipientName}
            </h2>
          </motion.div>

          {/* Message with staggered animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-hacker-terminal/50 border border-rose-500/30 rounded-xl p-6 min-h-32"
          >
            <p className="text-rose-100/90 font-tech leading-relaxed whitespace-pre-wrap text-center md:text-left">
              {message.split(" ").map((word, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.03, duration: 0.4 }}
                  className="inline-block mr-1"
                >
                  {word}
                </motion.span>
              ))}
            </p>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            className="flex justify-center gap-2"
          >
            <span className="text-2xl">💕</span>
            <span className="text-2xl">💖</span>
            <span className="text-2xl">💝</span>
          </motion.div>

          {/* Action hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-rose-400/60 font-tech text-center"
          >
            Click outside or press X to use this message, or generate another one
          </motion.p>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 border-t border-rose-500/30 px-6 py-4 flex gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-tech font-bold rounded-lg hover:from-rose-400 hover:to-pink-400 transition-all"
          >
            Use This Message
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-rose-500/20 border border-rose-500/50 text-rose-300 font-tech font-bold rounded-lg hover:bg-rose-500/30 transition-all"
          >
            Generate Another
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
