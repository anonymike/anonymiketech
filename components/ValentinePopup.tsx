'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart } from 'lucide-react'
import Link from 'next/link'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function ValentinePopup() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [navButtonRect, setNavButtonRect] = useState<DOMRect | null>(null)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isValentineOver, setIsValentineOver] = useState(false)

  const findValentineNavLink = useCallback(() => {
    // Find the Valentine nav link by id first, then fallback to selector
    const el = document.getElementById('valentine-nav-link')
    if (el) {
      const rect = el.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        setNavButtonRect(rect)
        return
      }
    }
    // Fallback: search all valentine links
    const links = document.querySelectorAll('a[href="/valentine"]')
    for (const link of links) {
      const rect = link.getBoundingClientRect()
      if (rect.top < 80 && rect.width > 0 && rect.height > 0) {
        setNavButtonRect(rect)
        return
      }
    }
    setNavButtonRect(null)
  }, [])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (pathname !== '/') {
      setIsOpen(false)
      return
    }

    const now = new Date()
    const valentineDate = new Date(2026, 1, 14, 23, 59, 59)

    if (now > valentineDate) {
      setIsValentineOver(true)
      return
    }

    const hasSeenValentinePopup = localStorage.getItem('hasSeenValentinePopup')
    if (!hasSeenValentinePopup) {
      // Slight delay so the navbar has rendered
      const timer = setTimeout(() => {
        findValentineNavLink()
        setIsOpen(true)
        localStorage.setItem('hasSeenValentinePopup', 'true')
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [pathname, findValentineNavLink])

  useEffect(() => {
    const calculateTimeLeft = () => {
      const valentineDate = new Date(2026, 1, 14, 23, 59, 59).getTime()
      const now = new Date().getTime()
      const difference = valentineDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  // Update position on scroll/resize for desktop bubble
  useEffect(() => {
    if (!isOpen || isMobile) return
    const update = () => findValentineNavLink()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [isOpen, isMobile, findValentineNavLink])

  const handleClose = () => {
    setIsOpen(false)
  }

  if (isValentineOver || !isOpen) return null

  // Desktop: Tooltip bubble pointing at the Valentine nav link
  if (!isMobile && navButtonRect) {
    const bubbleLeft = navButtonRect.left + navButtonRect.width / 2
    const bubbleTop = navButtonRect.bottom + 16

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed z-50"
          style={{ left: bubbleLeft, top: bubbleTop, transform: 'translateX(-50%)' }}
        >
          {/* Arrow pointing up */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-gradient-to-br from-rose-900/95 to-pink-900/95 border-l border-t border-rose-500/60" />

          {/* Bubble content */}
          <div className="relative w-72 rounded-2xl overflow-hidden border border-rose-500/50 shadow-2xl shadow-rose-500/30">
            <div className="bg-gradient-to-br from-rose-900/95 to-pink-900/95 backdrop-blur-xl p-5">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-rose-500/20 transition-colors"
              >
                <X className="w-4 h-4 text-rose-300" />
              </button>

              {/* Heart icon */}
              <div className="flex justify-center mb-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Heart className="w-8 h-8 text-rose-400 fill-rose-400" />
                </motion.div>
              </div>

              {/* Title */}
              <h3 className="text-center text-lg font-tech font-bold text-rose-200 mb-1">
                Valentine's is Coming!
              </h3>
              <p className="text-center text-rose-300/70 font-tech text-xs mb-4">
                Create a special message for your loved one
              </p>

              {/* Compact countdown */}
              <div className="flex justify-center gap-2 mb-4">
                {[
                  { label: 'D', value: timeLeft.days },
                  { label: 'H', value: timeLeft.hours },
                  { label: 'M', value: timeLeft.minutes },
                  { label: 'S', value: timeLeft.seconds },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="text-center px-2 py-1.5 rounded-md bg-rose-500/15 border border-rose-500/30"
                  >
                    <div className="text-sm font-tech font-bold text-rose-300 leading-tight">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <p className="text-[10px] text-rose-200/50 font-tech">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link href="/valentine" onClick={handleClose} className="block">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white font-tech font-bold text-sm text-center hover:from-rose-400 hover:to-pink-400 transition-all flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  Create Message
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Mobile: Compact bottom sheet style popup
  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />

      {/* Mobile popup - bottom positioned, compact */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto"
      >
        <div className="rounded-2xl overflow-hidden border border-rose-500/50 shadow-2xl shadow-rose-500/20">
          <div className="bg-gradient-to-br from-rose-900/95 to-pink-900/95 backdrop-blur-xl p-5">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-rose-500/20 transition-colors"
            >
              <X className="w-4 h-4 text-rose-300" />
            </button>

            {/* Header row */}
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <Heart className="w-8 h-8 text-rose-400 fill-rose-400 flex-shrink-0" />
              </motion.div>
              <div>
                <h3 className="text-base font-tech font-bold text-rose-200">
                  Valentine's is Coming!
                </h3>
                <p className="text-rose-300/70 font-tech text-xs">
                  Send a special message to your loved one
                </p>
              </div>
            </div>

            {/* Compact countdown */}
            <div className="flex gap-2 mb-4">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hrs', value: timeLeft.hours },
                { label: 'Min', value: timeLeft.minutes },
                { label: 'Sec', value: timeLeft.seconds },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex-1 text-center py-2 rounded-lg bg-rose-500/15 border border-rose-500/25"
                >
                  <div className="text-lg font-tech font-bold text-rose-300 leading-tight">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <p className="text-[10px] text-rose-200/50 font-tech">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <Link href="/valentine" onClick={handleClose} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white font-tech font-bold text-sm text-center flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  Create Message
                </motion.div>
              </Link>
              <button
                onClick={handleClose}
                className="px-4 py-2.5 rounded-lg bg-rose-900/40 border border-rose-500/40 text-rose-300 font-tech text-sm font-bold"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
