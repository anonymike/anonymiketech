'use client'

import { motion } from 'framer-motion'

export default function FloatingFlowers() {
  const flowers = [
    { emoji: '🌹', delay: 0 },
    { emoji: '🌺', delay: 0.5 },
    { emoji: '🌸', delay: 1 },
    { emoji: '🌼', delay: 1.5 },
    { emoji: '💐', delay: 2 },
  ]

  const floatingVariants = {
    animate: (delay: number) => ({
      y: [0, -100, 0],
      x: [0, Math.random() * 100 - 50, 0],
      opacity: [0, 1, 0],
      transition: {
        duration: 6,
        delay: delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    }),
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {flowers.map((flower, i) => (
        <motion.div
          key={i}
          custom={flower.delay}
          variants={floatingVariants}
          animate="animate"
          className="absolute text-4xl sm:text-5xl"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-50px',
          }}
        >
          {flower.emoji}
        </motion.div>
      ))}
    </div>
  )
}
