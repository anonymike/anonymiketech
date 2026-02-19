'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronDown, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function DesktopNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [openServices, setOpenServices] = useState(false)
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
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Handle scroll direction for hide/show
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true)
      } else {
        setHidden(false)
      }

      setLastScrollY(currentScrollY)
      setScrolled(currentScrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Hide navbar on valentine view page
  useEffect(() => {
    const isViewingMessage = pathname === '/valentine/view' || pathname?.includes('/valentine/view')
    setHideNavbar(isViewingMessage)
  }, [pathname])

  // Don't render navbar when viewing valentine message
  if (hideNavbar) return null

  const primaryLinks = [
    { href: '/portfolio', label: 'Portfolio' },
    ...(isValentineActive ? [{ href: '/valentine', label: 'Valentine' }] : []),
    { href: '/contact', label: 'Contact' },
  ]

  const servicesLinks = [
    { href: '/web-development', label: 'Web Development' },
    { href: '/social-media-boosting', label: 'Social Media' },
    { href: '/chatbots-ai', label: 'AI & Chatbots' },
    { href: '/internet-services', label: 'Internet Services' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3 }}
      className={`hidden md:block fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-hacker-terminal/95 backdrop-blur-md shadow-lg shadow-hacker-green/10' : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <Image
              src="/logo.png"
              alt="ANONYMIKETECH Logo"
              width={40}
              height={40}
              priority
              loading="eager"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain group-hover:scale-110 transition-transform"
            />
            <div className="hidden sm:block">
              <h1 className="text-sm sm:text-base lg:text-lg font-tech font-bold text-hacker-green-bright group-hover:text-hacker-green transition-colors leading-tight">
                ANONYMIKETECH
              </h1>
              <p className="text-xs text-hacker-green-dim font-tech">EXPLORE • DEVELOP • INNOVATE</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 flex-1 justify-center">
            {pathname !== '/' && (
              <Link href="/">
                <motion.span
                  whileHover={{ scale: 1.05, color: '#00ff41' }}
                  className="text-hacker-green-dim hover:text-hacker-green-bright font-tech font-medium transition-colors cursor-pointer relative group text-xs sm:text-sm"
                >
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-hacker-green group-hover:w-full transition-all duration-300"></span>
                </motion.span>
              </Link>
            )}
            {primaryLinks.map((link) => (
              <Link key={link.href} href={link.href} id={link.href === '/valentine' ? 'valentine-nav-link' : undefined}>
                <motion.span
                  whileHover={{ scale: 1.05, color: '#00ff41' }}
                  className="text-hacker-green-dim hover:text-hacker-green-bright font-tech font-medium transition-colors cursor-pointer relative group text-xs sm:text-sm"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-hacker-green group-hover:w-full transition-all duration-300"></span>
                </motion.span>
              </Link>
            ))}

            {/* Services Dropdown */}
            <div className="relative group">
              <motion.button
                onMouseEnter={() => setOpenServices(true)}
                onMouseLeave={() => setOpenServices(false)}
                whileHover={{ scale: 1.05, color: '#00ff41' }}
                className="text-hacker-green-dim hover:text-hacker-green-bright font-tech font-medium transition-colors cursor-pointer relative flex items-center gap-1 text-xs sm:text-sm"
              >
                Services
                <motion.div animate={{ rotate: openServices ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                </motion.div>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-hacker-green group-hover:w-full transition-all duration-300"></span>
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {openServices && (
                  <motion.div
                    onMouseEnter={() => setOpenServices(true)}
                    onMouseLeave={() => setOpenServices(false)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-48 sm:w-56 rounded-lg bg-hacker-terminal border-2 border-hacker-green/40 shadow-2xl shadow-hacker-green/20 overflow-hidden"
                  >
                    <div className="p-2 sm:p-3 space-y-1 sm:space-y-2">
                      {servicesLinks.map((service) => (
                        <Link key={service.href} href={service.href}>
                          <motion.div
                            whileHover={{ x: 5, backgroundColor: 'rgba(0, 255, 65, 0.1)' }}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md cursor-pointer transition-colors text-hacker-green-dim hover:text-hacker-green-bright font-tech text-xs sm:text-sm"
                            onClick={() => setOpenServices(false)}
                          >
                            {service.label}
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Admin Link */}
          <Link href="/admin" className="flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-hacker-green-dim hover:text-hacker-green-bright transition-colors"
              title="Admin Panel"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </Link>

          {/* CTA Button */}
          <Link href="/contact" className="flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-hacker-green to-emerald-400 text-hacker-terminal font-tech font-bold hover:shadow-lg hover:shadow-hacker-green/50 transition-all whitespace-nowrap text-xs sm:text-sm"
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
