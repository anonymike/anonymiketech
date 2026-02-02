"use client"

import { motion } from "framer-motion"
import { Check, Star } from "lucide-react"
import { useRouter } from "next/navigation"

interface PricingCardProps {
  title: string
  subtitle?: string
  price: string
  currency?: string
  period: string
  features: string[]
  popular?: boolean
  delay?: number
}

export default function PricingCard({ title, subtitle, price, currency = "KES", period, features, popular = false, delay = 0 }: PricingCardProps) {
  const router = useRouter()

  const handleFindOut = () => {
    const params = new URLSearchParams({
      title: title,
      subtitle: subtitle || "",
      price: price,
      currency: currency,
      period: period,
    })
    router.push(`/chatbots-ai/details?${params.toString()}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay }}
      whileHover={{
        scale: 1.05,
        boxShadow: popular ? "0 0 40px hsl(var(--hacker-green))" : "0 0 25px hsl(var(--hacker-green-dim))",
      }}
      className={`glow-border rounded-lg p-5 md:p-6 lg:p-5 bg-hacker-terminal/50 backdrop-blur-sm relative h-full ${
        popular ? "border-hacker-green animate-glow-pulse" : "border-hacker-green-dim"
      }`}
    >
      {popular && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.3 }}
          className="absolute -top-4 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-hacker-green text-hacker-bg px-4 py-2 rounded-full font-tech font-bold text-sm flex items-center gap-1">
            <Star className="w-4 h-4 fill-current" />
            MOST POPULAR
          </div>
        </motion.div>
      )}

      <div className="text-center mb-6 md:mb-5">
        <h3 className="text-xl md:text-lg lg:text-xl font-tech font-bold text-hacker-green-bright mb-1 glow-text">{title}</h3>
        {subtitle && (
          <p className="text-xs md:text-xs lg:text-sm font-tech text-hacker-green mb-2">{subtitle}</p>
        )}
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-3xl md:text-2xl lg:text-3xl font-tech font-bold text-hacker-green">{currency} {price}</span>
          <span className="text-xs md:text-xs lg:text-sm text-hacker-green-dim font-tech">/{period}</span>
        </div>
      </div>

      <ul className="space-y-2 md:space-y-2 lg:space-y-3 mb-6 md:mb-4 flex-1">
        {features.map((feature, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1 * (index + 1) }}
            className="flex items-start gap-2 text-hacker-green-bright text-xs md:text-xs lg:text-sm"
          >
            <div className="flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-hacker-green" />
            </div>
            <span className="font-tech leading-tight">{feature}</span>
          </motion.li>
        ))}
      </ul>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.5 }}
        className="text-center mt-auto space-y-2"
      >
        <motion.a
          href="https://anonymiketech-checkouts.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`block w-full py-2 md:py-2 lg:py-3 px-4 md:px-4 lg:px-6 rounded-lg font-tech font-bold text-xs md:text-xs lg:text-sm transition-all duration-300 text-center ${
            popular
              ? "bg-hacker-green text-hacker-bg hover:bg-hacker-green-bright hover:animate-glow-pulse"
              : "glow-border bg-hacker-terminal text-hacker-green-bright hover:bg-hacker-green hover:text-hacker-bg"
          }`}
        >
          💳 Pay Now
        </motion.a>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFindOut}
          className="w-full py-2 md:py-2 lg:py-3 px-4 md:px-4 lg:px-6 rounded-lg font-tech font-bold text-xs md:text-xs lg:text-sm transition-all duration-300 text-center glow-border bg-hacker-terminal/50 text-hacker-green-bright hover:border-hacker-green-bright"
        >
          🔍 Details
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
