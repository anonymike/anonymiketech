"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Shield, Code, Bot, TrendingUp, Home, User, Mail, Heart, Settings, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { getAnimationDelay, getAnimationDuration } from "@/lib/animation-utils"
import NewBadge from "./NewBadge"

interface MobileMenuProps {
  showAfterIntro?: boolean
}

export default function MobileMenu({ showAfterIntro = true }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [hideNavbar, setHideNavbar] = useState(false)
  const [isValentineActive, setIsValentineActive] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // Check if Valentine's Day has passed
    const now = new Date()
    const valentineDate = new Date(2026, 1, 14, 23, 59, 59)
    setIsValentineActive(now <= valentineDate)
  }, [])

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      const isMobileDevice = mobileRegex.test(userAgent)
      const isSmallScreen = window.innerWidth <= 768
      setIsMobile(isMobileDevice || isSmallScreen)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Handle scroll to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down - hide navbar
        setIsNavVisible(false)
      } else {
        // Scrolling up - show navbar
        setIsNavVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Hide navbar on valentine view page
  useEffect(() => {
    const isViewingMessage = pathname === '/valentine/view' || pathname?.includes('/valentine/view')
    setHideNavbar(isViewingMessage)
  }, [pathname])

  // Don't render navbar when viewing valentine message
  if (hideNavbar) return null

  const menuItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: "Portfolio",
      path: "/portfolio",
      icon: <User className="w-5 h-5" />,
    },
    {
      name: "Premium Apps",
      path: "/premium-apps",
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      name: "Internet Services",
      path: "/internet-services",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      name: "Web Development",
      path: "/web-development",
      icon: <Code className="w-5 h-5" />,
    },
    {
      name: "AI Chatbots",
      path: "/chatbots-ai",
      icon: <Bot className="w-5 h-5" />,
    },
    {
      name: "Social Media Boosting",
      path: "/social-media-boosting",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    ...(isValentineActive
      ? [
          {
            name: "Valentine Special",
            path: "/valentine",
            icon: <Heart className="w-5 h-5" />,
          },
        ]
      : []),
    {
      name: "Contact",
      path: "/contact",
      icon: <Mail className="w-5 h-5" />,
    },
    {
      name: "Admin Panel",
      path: "/admin",
      icon: <Settings className="w-5 h-5" />,
    },
  ]

  if (!isMobile || !showAfterIntro) return null

  return (
    <>
      {/* Mobile Navigation Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: isNavVisible ? 1 : 0, y: isNavVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 md:hidden z-50 bg-hacker-terminal border-b border-hacker-green/30 safe-top pointer-events-auto"
        style={{
          visibility: isNavVisible ? "visible" : "hidden",
        }}
      >
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group flex-1">
            <Image
              src="/logo.png"
              alt="ANONYMIKETECH Logo"
              width={32}
              height={32}
              priority
              loading="eager"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain group-hover:scale-110 transition-transform"
            />
            <div>
              <h2 className="text-xs sm:text-sm font-tech font-bold text-hacker-green-bright glow-text leading-tight">ANONYMIKETECH</h2>
              <p className="text-xs text-hacker-green-dim font-tech leading-tight">EXPLORE • DEVELOP • INNOVATE</p>
            </div>
          </Link>

          {/* Menu Button - Minimalist Style */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 sm:p-2.5 bg-transparent hover:bg-hacker-green/10 rounded-md transition-all duration-300 ml-2 flex-shrink-0 group"
          >
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: 0 }}
                animate={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="relative w-5 h-5 sm:w-6 sm:h-6"
              >
                <X className="w-full h-full text-hacker-green group-hover:text-hacker-green-bright transition-colors" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 0 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.2 }}
                className="relative w-5 h-5 sm:w-6 sm:h-6"
              >
                <Menu className="w-full h-full text-hacker-green group-hover:text-hacker-green-bright transition-colors" strokeWidth={2.5} />
              </motion.div>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 top-16 sm:top-20"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-16 sm:top-20 left-0 h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] w-72 sm:w-80 bg-hacker-terminal glow-border z-50 overflow-y-auto flex flex-col"
            >
              {/* Menu Items */}
              <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2 flex-1 overflow-y-auto">
                {menuItems
                  .filter((item) => item.path !== '/' || pathname !== '/')
                  .map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <Link
                        href={item.path}
                        className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg font-tech transition-all duration-300 text-sm sm:text-base touch-manipulation ${
                          pathname === item.path
                            ? "bg-hacker-green text-hacker-bg animate-glow-pulse"
                            : "text-hacker-green-bright hover:bg-hacker-green/20 hover:text-hacker-green active:bg-hacker-green/30"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span className="flex-1 flex items-center">
                          {item.name}
                          {item.name === "Premium Apps" && <NewBadge />}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
              </div>

              {/* Contact Section */}
              <div className="p-3 sm:p-4 border-t border-hacker-green/30 flex-shrink-0">
                <div className="text-center space-y-3">
                  <p className="text-xs sm:text-sm font-tech text-hacker-green-dim">Need Help?</p>
                  <a
                    href="https://wa.me/+254113313240"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-hacker-green text-hacker-bg px-4 py-2.5 sm:py-3 rounded-lg font-tech font-bold hover:bg-hacker-green-bright transition-all duration-300 active:scale-95 text-sm sm:text-base touch-manipulation w-full justify-center"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>

              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
                <div className="text-9xl font-tech font-bold text-hacker-green animate-pulse select-none">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={i}
                      className="animate-matrix-fall"
                      style={{
                        animationDelay: getAnimationDelay(i),
                        animationDuration: getAnimationDuration(i),
                      }}
                    >
                      01010101
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
