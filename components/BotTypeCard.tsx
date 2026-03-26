'use client'

import React from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

interface BotTypeCardProps {
  id: string
  name: string
  cost: number
  description: string
  features: string[]
  icon: string
  image: string
  onClick: () => void
}

export default function BotTypeCard({
  name,
  cost,
  description,
  features,
  icon,
  image,
  onClick,
}: BotTypeCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        onClick={onClick}
        className="relative h-80 overflow-hidden cursor-pointer group border border-slate-700 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Gradient Overlay - Dark fade to transparent */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent group-hover:via-slate-900/40 transition-all duration-300" />

          {/* Accent accent overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/5 group-hover:via-blue-600/10 group-hover:to-cyan-600/5 transition-all duration-300" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-5 sm:p-6">
          {/* Icon and Cost Badge */}
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <span className="text-3xl sm:text-4xl">{icon}</span>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold"
            >
              ${cost}
            </motion.div>
          </div>

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-cyan-300 transition-colors"
          >
            {name}
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-sm text-gray-300 mb-3 line-clamp-2 group-hover:text-gray-200 transition-colors"
          >
            {description}
          </motion.p>

          {/* Features Tags */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-1.5 mb-3 sm:mb-4"
          >
            {features.slice(0, 2).map((feature) => (
              <span
                key={feature}
                className="text-xs px-2 py-1 rounded-full bg-cyan-600/40 backdrop-blur-sm text-cyan-200 border border-cyan-500/30 group-hover:border-cyan-400/50 transition-colors"
              >
                {feature}
              </span>
            ))}
            {features.length > 2 && (
              <span className="text-xs px-2 py-1 rounded-full bg-cyan-600/40 backdrop-blur-sm text-cyan-200">
                +{features.length - 2} more
              </span>
            )}
          </motion.div>

          {/* Click CTA */}
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="flex items-center gap-1 text-sm font-semibold text-blue-400 group-hover:text-cyan-300 transition-colors"
          >
            Learn More
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}
