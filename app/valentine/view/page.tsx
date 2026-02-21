"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Heart, Download, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ValentineViewPage() {
  useEffect(() => {
    // Hide only the promotional banner on valentine preview page
    const promoElements = document.querySelectorAll('[class*="promo-banner"], [class*="ChatbotsPromoBanner"]')
    const originalDisplays = new Map()
    
    promoElements.forEach((el: any) => {
      originalDisplays.set(el, el.style.display)
      el.style.display = 'none'
    })

    return () => {
      // Restore on unmount
      promoElements.forEach((el: any) => {
        el.style.display = originalDisplays.get(el) || ''
      })
    }
  }, [])
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [valentineData, setValentineData] = useState<{
    recipient: string
    message: string
    sender: string
    date: string
    photo?: string
  } | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    try {
      const encodedData = searchParams.get("data")
      if (!encodedData) {
        setError(true)
        return
      }
      const decodedData = JSON.parse(decodeURIComponent(encodedData))
      setValentineData(decodedData)

      // Set browser tab title to show "Happy Valentines [name]"
      if (decodedData?.recipient) {
        document.title = `Happy Valentines ${decodedData.recipient}`
      }
    } catch (err) {
      setError(true)
    }
  }, [searchParams])

  if (error || !valentineData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-900/20 via-hacker-terminal to-purple-900/20 flex items-center justify-center pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Heart className="w-16 h-16 text-rose-500 mx-auto mb-4 opacity-50" />
          <h1 className="text-3xl font-tech font-bold text-rose-300 mb-2">
            Oops! Invalid Love Message
          </h1>
          <p className="text-rose-200/70 font-tech mb-6">
            This link seems to have expired or is invalid
          </p>
          <Link
            href="/valentine"
            className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white font-tech font-bold py-3 px-8 rounded-lg hover:from-rose-400 hover:to-pink-400 transition-all"
          >
            Create Your Own Message
          </Link>
        </motion.div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const heartVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 360],
    },
  }

  const downloadMessage = () => {
    const text = `Valentine Message
From: ${valentineData.sender}
To: ${valentineData.recipient}
Date: ${valentineData.date}

${valentineData.message}

---
Sent with love via ANONYMIKETECH Valentine Special`

    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text))
    element.setAttribute("download", `valentine-message-${Date.now()}.txt`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Downloaded!",
      description: "Your love message has been saved",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900/30 via-hacker-terminal to-purple-900/30 relative overflow-hidden pt-24 pb-16">
      {/* Floating hearts background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-500 text-6xl font-bold"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.5, 0],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              delay: Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            ♥
          </motion.div>
        ))}
      </div>

      {/* Particles effect */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-rose-500 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.5, 1, 0.5],
              x: [0, (Math.random() - 0.5) * 100, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              delay: Math.random() * 3,
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 max-w-2xl relative z-10"
      >
        {/* Animated header hearts */}
        <motion.div
          className="flex justify-center gap-4 mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              animate="animate"
              custom={i}
              variants={{
                ...itemVariants,
                animate: {
                  scale: [1, 1.3, 1],
                  rotate: [0, 360, 0],
                  transition: {
                    duration: 2 + i * 0.2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.1,
                  },
                },
              }}
            >
              <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* Main Valentine Card */}
        <motion.div
          variants={itemVariants}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 rounded-3xl blur-xl opacity-75 group-hover/card:opacity-100 transition-opacity animate-pulse" />

          <div className={`relative bg-hacker-terminal/95 backdrop-blur-xl border-2 border-rose-500/50 rounded-3xl shadow-2xl ${valentineData.photo ? 'pt-28 sm:pt-32 md:pt-36 p-6 sm:p-8 md:px-16 md:pb-16' : 'p-6 sm:p-8 md:p-16'}`}>
            {/* Circular Photo - positioned at top center, overlapping the card edge */}
            {valentineData.photo && (
              <motion.div
                variants={itemVariants}
                className="absolute -top-20 sm:-top-24 md:-top-28 left-1/2 -translate-x-1/2 z-20"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                  className="relative"
                >
                  {/* Glowing ring behind the photo */}
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(244, 63, 94, 0.4)",
                        "0 0 40px rgba(244, 63, 94, 0.7)",
                        "0 0 20px rgba(244, 63, 94, 0.4)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-rose-500/80 bg-hacker-terminal"
                  >
                    <img
                      src={valentineData.photo || "/placeholder.svg"}
                      alt={`Photo for ${valentineData.recipient}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  {/* Small decorative heart badge */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    className="absolute -bottom-1 -right-1 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center border-3 border-hacker-terminal"
                  >
                    <Heart className="w-5 h-5 md:w-6 md:h-6 text-white fill-white" />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* Sender info */}
            <motion.div
              variants={itemVariants}
              className="text-center mb-8"
            >
              <motion.p
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-rose-400/80 font-tech text-sm mb-2"
              >
                A message from
              </motion.p>
              <h2 className="text-2xl md:text-3xl font-tech font-bold text-rose-300 mb-4">
                {valentineData.sender}
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent mx-auto" />
            </motion.div>

            {/* Recipient name with special styling */}
            <motion.div
              variants={itemVariants}
              className="text-center mb-12"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-rose-400/70 font-tech text-lg mb-2"
              >
                Happy Valentines
              </motion.p>
              <motion.div
                animate={{
                  textShadow: [
                    "0 0 0px rgba(244, 63, 94, 0)",
                    "0 0 20px rgba(244, 63, 94, 0.8)",
                    "0 0 0px rgba(244, 63, 94, 0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-5xl md:text-6xl font-tech font-bold bg-gradient-to-r from-rose-400 via-pink-300 to-rose-400 bg-clip-text text-transparent"
              >
                {valentineData.recipient}
              </motion.div>
              <motion.p
                animate={{ scale: [0.9, 1, 0.9] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="text-rose-400/60 font-tech text-lg mt-4"
              >
                {'This one\'s for you'}
              </motion.p>
            </motion.div>

            {/* Main message */}
            <motion.div
              variants={itemVariants}
              className="mb-12 text-center"
            >
              <p className="text-lg md:text-xl text-rose-100/90 font-tech leading-relaxed whitespace-pre-wrap">
                {valentineData.message}
              </p>
            </motion.div>

            {/* Date and decorative elements */}
            <motion.div
              variants={itemVariants}
              className="text-center border-t-2 border-rose-500/30 pt-8"
            >
              <p className="text-rose-400/60 font-tech text-sm mb-4">
                Sent on {valentineData.date}
              </p>

              {/* Floating hearts decoration */}
              <motion.div className="flex justify-center gap-3 mb-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.span
                    key={i}
                    animate={{ scale: [0, 1, 0], rotate: [0, 180, 0] }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="text-rose-500"
                  >
                    ♥
                  </motion.span>
                ))}
              </motion.div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(244, 63, 94, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadMessage}
                  className="px-6 py-2 rounded-lg bg-rose-500/20 border-2 border-rose-500 text-rose-300 hover:text-rose-100 font-tech font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Save Message
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigator.share?.({
                      title: "I Got a Valentine Message!",
                      text: "Check out this special Valentine message!",
                      url: window.location.href,
                    })
                  }}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white font-tech font-bold hover:from-rose-400 hover:to-pink-400 transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </motion.button>
              </div>

              {/* Gift Developer Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mt-6"
              >
                <motion.a
                  href="https://anonymiketech-payments.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(236, 72, 153, 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 text-white font-tech font-bold hover:from-pink-500 hover:to-rose-500 transition-all flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
                >
                  <Heart className="w-5 h-5" />
                  LIKE OUR WORK GIFT US
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Create your own CTA */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-12"
        >
          <p className="text-rose-200/60 font-tech mb-4">
            Want to send your own love message?
          </p>
          <Link
            href="/valentine"
            className="inline-block bg-gradient-to-r from-rose-500/30 to-pink-500/30 hover:from-rose-500 hover:to-pink-500 border-2 border-rose-500/50 hover:border-rose-500 text-rose-300 hover:text-white font-tech font-bold py-3 px-8 rounded-lg transition-all"
          >
            Create Valentine Message
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
