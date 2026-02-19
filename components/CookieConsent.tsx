"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X, Cookie } from "lucide-react"
import Link from "next/link"

export default function CookieConsent() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show on the home page
    if (pathname !== '/') {
      setIsVisible(false)
      return
    }

    // Check if user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem("anonymiketech_cookies_accepted")

    if (!hasAcceptedCookies) {
      // Show consent after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [pathname])

  const handleAccept = () => {
    // Store acceptance in localStorage with timestamp
    localStorage.setItem(
      "anonymiketech_cookies_accepted",
      JSON.stringify({
        accepted: true,
        timestamp: new Date().toISOString(),
      }),
    )
    setIsVisible(false)
  }

  const handleReject = () => {
    // Store rejection in localStorage
    localStorage.setItem(
      "anonymiketech_cookies_accepted",
      JSON.stringify({
        accepted: false,
        timestamp: new Date().toISOString(),
      }),
    )
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-6xl mx-auto bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/30 rounded-lg shadow-2xl backdrop-blur-sm">
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <Cookie className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">🍪 Cookie Consent</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                    By accepting, you agree to our use of cookies. Learn more in our{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/cookie-policy"
                      className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
                    >
                      Cookie Policy
                    </Link>
                    .
                  </p>
                </div>
                <button
                  onClick={handleReject}
                  className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-center justify-end">
                <button
                  onClick={handleReject}
                  className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 rounded-lg transition-all duration-200"
                >
                  Reject
                </button>
                <button
                  onClick={handleAccept}
                  className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg transition-all duration-200 shadow-lg hover:shadow-cyan-500/50"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
