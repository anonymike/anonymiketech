"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const technologies = [
  { name: "React", icon: "⚛️", color: "from-cyan-400 to-blue-500" },
  { name: "Next.js", icon: "▲", color: "from-gray-400 to-gray-600" },
  { name: "Node.js", icon: "⬢", color: "from-green-400 to-green-600" },
  { name: "TypeScript", icon: "TS", color: "from-blue-400 to-blue-600" },
  { name: "MongoDB", icon: "🍃", color: "from-green-400 to-emerald-600" },
  { name: "PostgreSQL", icon: "🐘", color: "from-blue-400 to-blue-600" },
  { name: "Docker", icon: "🐳", color: "from-blue-400 to-cyan-500" },
  { name: "Git", icon: "🔗", color: "from-orange-400 to-red-600" },
]

export default function TechStackSection({ delay = 5.5 }: { delay?: number }) {
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
      <motion.h2
        className="text-4xl md:text-5xl font-tech font-bold text-center mb-12 glow-text"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      >
        // TECH STACK & EXPERTISE
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {technologies.map((tech, index) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, scale: 0.5, rotateZ: -10 }}
            animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
            transition={{
              delay: delay + 0.1 * index,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 30px rgba(0, 255, 0, 0.6)",
              y: -5,
            }}
            className="relative group"
          >
            <div
              className={`glow-border rounded-lg p-6 bg-gradient-to-br ${tech.color} bg-opacity-10 backdrop-blur-sm h-full flex items-center justify-center cursor-pointer`}
            >
              <motion.div
                animate={{
                  rotateZ: [0, 5, -5, 0],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
                className="text-center"
              >
                <div className={`text-5xl mb-3 bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}>
                  {tech.icon}
                </div>
                <h3 className="font-tech font-bold text-hacker-green-bright text-sm">{tech.name}</h3>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 rounded-lg bg-hacker-green/10 blur-lg -z-10"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ delay: delay + 1, duration: 1 }}
        className="text-center text-hacker-green-dim mt-8 font-tech text-sm md:text-base"
      >
        // Cutting-edge technologies for next-generation solutions
      </motion.p>
    </motion.section>
  )
}
