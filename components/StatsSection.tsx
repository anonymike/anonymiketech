"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface StatItem {
  value: number
  label: string
  icon: string
  suffix?: string
}

const stats: StatItem[] = [
  { value: 50, label: "Projects Completed", icon: "🚀" },
  { value: 100, label: "Satisfied Clients", icon: "👥", suffix: "+" },
  { value: 99, label: "Uptime Guarantee", icon: "⚡", suffix: "%" },
  { value: 24, label: "Hour Support", icon: "🛡️", suffix: "/7" },
]

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayValue((prev) => {
        if (prev < value) {
          return Math.min(prev + value / 20, value)
        }
        return value
      })
    }, 50)

    return () => clearInterval(interval)
  }, [value])

  return (
    <>
      {Math.floor(displayValue)}
      {suffix}
    </>
  )
}

export default function StatsSection({ delay = 6 }: { delay?: number }) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 50 }}
      transition={{ duration: 1 }}
      className="container mx-auto px-4 mb-16"
    >
      <div className="glow-border rounded-lg p-8 md:p-12 bg-gradient-to-r from-hacker-terminal/40 to-hacker-terminal/20 backdrop-blur-sm">
        <h2 className="text-3xl md:text-4xl font-tech font-bold text-center mb-12 glow-text">// OUR ACHIEVEMENTS</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 0.5, y: showContent ? 0 : 20 }}
              transition={{
                delay: delay + 0.15 * index,
                type: "spring",
                stiffness: 100,
              }}
              className="text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 1,
                }}
                className="text-5xl md:text-6xl mb-3"
              >
                {stat.icon}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showContent ? 1 : 0 }}
                transition={{ delay: delay + 0.5 + 0.15 * index }}
                className="font-tech font-bold text-4xl md:text-5xl mb-2 glow-text"
              >
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </motion.div>

              <p className="font-tech text-hacker-green-bright text-sm md:text-base">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
