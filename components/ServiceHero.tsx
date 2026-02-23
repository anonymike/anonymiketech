"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getAnimationDelay, getAnimationDuration } from "@/lib/animation-utils"

interface ServiceHeroProps {
  title: string
  subtitle: string
  description: string
  icon: ReactNode
  backgroundPattern?: string
}

export default function ServiceHero({
  title,
  subtitle,
  description,
  icon,
  backgroundPattern = "01",
}: ServiceHeroProps) {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="text-9xl font-tech font-bold text-hacker-green animate-pulse select-none">
          {Array.from({ length: 50 }, (_, i) => (
            <span
              key={i}
              className="inline-block animate-matrix-fall"
              style={{
                animationDelay: getAnimationDelay(i),
                animationDuration: getAnimationDuration(i),
              }}
            >
              {backgroundPattern}
            </span>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-hacker-green-bright hover:text-hacker-green transition-colors duration-300 font-tech glow-border rounded px-4 py-2 hover:animate-glow-pulse text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>

        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl sm:text-6xl text-hacker-green mb-6 flex justify-center animate-pulse"
          >
            {icon}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-tech font-bold glow-text mb-4 text-balance"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-hacker-green-bright mb-6 animate-flicker"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-lg text-hacker-green-dim leading-relaxed">{description}</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
