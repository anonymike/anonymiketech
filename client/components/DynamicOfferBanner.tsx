"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useOfferPricing } from "../hooks/useOfferPricing"
import CountdownTimer from "./CountdownTimer"

interface BannerContent {
  icon: string
  title: string
  subtitle: string
  bottomText: string
  gradient: string
  titleColor: string
  glowColor: string
  borderColor: string
}

export default function DynamicOfferBanner() {
  const { isOfferActive } = useOfferPricing()
  const [currentBanner, setCurrentBanner] = useState<BannerContent | null>(null)
  const [bannerKey, setBannerKey] = useState(0)

  useEffect(() => {
    const updateBanner = () => {
      // Get current time in Nairobi, Kenya (UTC+3)
      const nairobiTime = new Date().toLocaleString("en-US", {
        timeZone: "Africa/Nairobi",
      })
      const now = new Date(nairobiTime)
      const currentDay = now.getDay() // 0 = Sunday, 6 = Saturday
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      const currentTimeInMinutes = currentHour * 60 + currentMinute
      const offerStartTime = 18 * 60 // 6:00 PM
      const offerEndTime = 21 * 60 + 30 // 9:30 PM

      let banner: BannerContent

      // Weekend All Day Offers
      if (currentDay === 6 || currentDay === 0) {
        // Saturday or Sunday
        if (isOfferActive) {
          banner = {
            icon: "🎉",
            title: "WEEKEND MEGA DEALS ACTIVE!",
            subtitle: "All-day weekend pricing now live! Unlimited savings until Monday!",
            bottomText: "🌟 Weekend warriors get the best VPN deals - grab yours now!",
            gradient: "from-purple-900/80 to-pink-900/50",
            titleColor: "text-purple-300",
            glowColor: "text-purple-400",
            borderColor: "border-purple-500/50",
          }
        } else {
          banner = {
            icon: "🏖️",
            title: "WEEKEND RELAXATION MODE",
            subtitle: "Enjoying the weekend? Daily offers resume at 6:00 PM!",
            bottomText: "🌅 Weekend vibes - but don't forget your VPN security!",
            gradient: "from-blue-900/80 to-cyan-900/50",
            titleColor: "text-cyan-300",
            glowColor: "text-cyan-400",
            borderColor: "border-cyan-500/50",
          }
        }
      }
      // Daily Offer Time (6:00 PM - 9:30 PM)
      else if (isOfferActive && currentTimeInMinutes >= offerStartTime && currentTimeInMinutes < offerEndTime) {
        const timeLeft = offerEndTime - currentTimeInMinutes
        const hoursLeft = Math.floor(timeLeft / 60)
        const minutesLeft = timeLeft % 60

        banner = {
          icon: "🔥",
          title: "FLASH SALE LIVE NOW!",
          subtitle: `⚡ Daily offer active! ${hoursLeft}h ${minutesLeft}m remaining until 9:30 PM!`,
          bottomText: "💨 Lightning deals won't last - secure your VPN now!",
          gradient: "from-red-900/80 to-orange-900/50",
          titleColor: "text-red-300",
          glowColor: "text-red-400",
          borderColor: "border-red-500/50",
        }
      }
      // Before Daily Offer (Before 6:00 PM)
      else if (currentTimeInMinutes < offerStartTime) {
        const timeUntilOffer = offerStartTime - currentTimeInMinutes
        const hoursUntil = Math.floor(timeUntilOffer / 60)
        const minutesUntil = timeUntilOffer % 60

        banner = {
          icon: "⏰",
          title: "DAILY DEALS LOADING...",
          subtitle: `Get ready! Special pricing starts in ${hoursUntil}h ${minutesUntil}m at 6:00 PM!`,
          bottomText: "🎯 Set your reminder - exclusive VPN deals dropping soon!",
          gradient: "from-yellow-900/80 to-amber-900/50",
          titleColor: "text-yellow-300",
          glowColor: "text-yellow-400",
          borderColor: "border-yellow-500/50",
        }
      }
      // After Daily Offer (After 9:30 PM)
      else {
        const tomorrow = new Date(now)
        tomorrow.setDate(now.getDate() + 1)
        tomorrow.setHours(18, 0, 0, 0)
        const timeUntilTomorrow = tomorrow.getTime() - now.getTime()
        const hoursUntilTomorrow = Math.floor(timeUntilTomorrow / (1000 * 60 * 60))

        banner = {
          icon: "🌙",
          title: "OFFERS ENDED - SEE YOU TOMORROW!",
          subtitle: `Today's deals are over. Next flash sale in ${hoursUntilTomorrow}h at 6:00 PM tomorrow!`,
          bottomText: "🌟 Still need VPN? Regular pricing available 24/7!",
          gradient: "from-indigo-900/80 to-violet-900/50",
          titleColor: "text-indigo-300",
          glowColor: "text-indigo-400",
          borderColor: "border-indigo-500/50",
        }
      }

      // Special Events Override (can be customized for holidays, special occasions)
      const today = now.toDateString()
      const cutoffDate = new Date("2026-02-01").getTime()
      const currentDate = new Date().getTime()

      if (today.includes("Jan 1") && currentDate <= cutoffDate) {
        // New Year (only show until Feb 1st)
        banner = {
          icon: "🎊",
          title: "NEW YEAR, NEW VPN DEALS!",
          subtitle: "Start 2026 with ultimate online security at amazing prices!",
          bottomText: "🥳 New year resolution: Stay secure online with ANONYMIKETECH!",
          gradient: "from-cyan-600/80 to-blue-600/50",
          titleColor: "text-cyan-300",
          glowColor: "text-cyan-400",
          borderColor: "border-cyan-500/50",
        }
      }

      setCurrentBanner(banner)
      setBannerKey((prev) => prev + 1) // Force re-render with animation
    }

    // Update immediately
    updateBanner()

    // Update every minute for real-time changes
    const interval = setInterval(updateBanner, 60000)

    return () => clearInterval(interval)
  }, [isOfferActive])

  if (!currentBanner) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={bannerKey}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="mb-12"
      >
        <div
          className={`glow-border rounded-lg p-6 bg-gradient-to-r ${currentBanner.gradient} backdrop-blur-sm animate-glow-pulse max-w-4xl mx-auto border-2 ${currentBanner.borderColor}`}
        >
          {/* Animated Background Effects */}
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 ${currentBanner.glowColor} rounded-full opacity-30`}
                animate={{
                  x: [0, Math.random() * 100],
                  y: [0, Math.random() * 50],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            {/* Main Title with Icon */}
            <motion.div
              className="flex items-center justify-center gap-3 mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <motion.span
                className="text-4xl"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {currentBanner.icon}
              </motion.span>

              <motion.h3
                className={`text-2xl md:text-3xl font-tech font-bold ${currentBanner.titleColor} glow-text text-center`}
                animate={{
                  textShadow: [
                    `0 0 10px ${currentBanner.glowColor}`,
                    `0 0 20px ${currentBanner.glowColor}`,
                    `0 0 30px ${currentBanner.glowColor}`,
                    `0 0 20px ${currentBanner.glowColor}`,
                    `0 0 10px ${currentBanner.glowColor}`,
                  ],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                {currentBanner.title}
              </motion.h3>

              <motion.span
                className="text-4xl"
                animate={{
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
              >
                {currentBanner.icon}
              </motion.span>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className={`text-lg ${currentBanner.titleColor} animate-flicker text-center mb-4`}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              {currentBanner.subtitle}
            </motion.p>

            {/* Countdown Timer - Only show during active offers */}
            {isOfferActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.5 }}
                className="mt-4"
              >
                <CountdownTimer />
              </motion.div>
            )}

            {/* Bottom Text */}
            <motion.div
              className={`text-sm ${currentBanner.glowColor} mt-4 text-center`}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <motion.span
                animate={{
                  scale: [1, 1.05, 1],
                  textShadow: ["0 0 5px currentColor", "0 0 15px currentColor", "0 0 5px currentColor"],
                }}
                transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY }}
              >
                {currentBanner.bottomText}
              </motion.span>
            </motion.div>

            {/* Special Action Buttons for Active Offers */}
            {isOfferActive && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center mt-6"
              >
                <motion.div
                  className={`inline-flex items-center gap-2 bg-gradient-to-r ${currentBanner.gradient} border-2 ${currentBanner.borderColor} text-white px-6 py-3 rounded-full font-tech font-bold shadow-lg`}
                  animate={{
                    boxShadow: [
                      `0 0 20px ${currentBanner.glowColor}`,
                      `0 0 40px ${currentBanner.glowColor}`,
                      `0 0 20px ${currentBanner.glowColor}`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Sparkles className="w-5 h-5" />
                  <span>LIVE DEALS BELOW</span>
                  <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
                    ⬇️
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
