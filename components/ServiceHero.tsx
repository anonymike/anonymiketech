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
  ctaText?: string
  onCtaClick?: () => void
}

export default function ServiceHero({
  title,
  subtitle,
  description,
  icon,
  backgroundPattern = "01",
  ctaText,
  onCtaClick,
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

          {ctaText && onCtaClick && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-12"
            >
              <motion.button
                onClick={onCtaClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative px-10 py-4 font-tech font-bold text-lg text-hacker-bg rounded-lg overflow-hidden group cursor-pointer"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-hacker-green via-hacker-green-bright to-hacker-green opacity-100 group-hover:opacity-110 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-hacker-green shadow-lg shadow-hacker-green/80 group-hover:shadow-hacker-green/100 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                
                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-lg border-2 border-hacker-green group-hover:border-hacker-green-bright transition-all duration-300"></div>
                
                {/* Text content */}
                <span className="relative flex items-center justify-center gap-3 text-hacker-bg font-bold">
                  {ctaText}
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
