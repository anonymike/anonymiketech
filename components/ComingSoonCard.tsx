'use client'

import { motion } from 'framer-motion'

export default function ComingSoonCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden rounded-lg glow-border h-[400px] bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-dashed border-hacker-green-bright/30"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-hacker-green-bright/20 via-transparent to-cyan-500/20 animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center">
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
          }}
          className="mb-6"
        >
          <div className="text-6xl mb-4">🔮</div>
        </motion.div>

        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-tech font-bold text-hacker-green-bright mb-3 glow-text"
        >
          More Showcases
        </motion.h3>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-300 mb-6 leading-relaxed text-sm max-w-xs"
        >
          Exciting new projects and innovative digital solutions coming very soon. Stay tuned for more extraordinary work.
        </motion.p>

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
          }}
          className="inline-block px-6 py-2 border-2 border-hacker-green-bright rounded-lg"
        >
          <span className="font-tech text-hacker-green-bright font-bold animate-pulse">COMING SOON</span>
        </motion.div>
      </div>
    </motion.div>
  )
}
