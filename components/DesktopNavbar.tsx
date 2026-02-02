"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import NewYearLogo from "./NewYearLogo"

export default function DesktopNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/web-development", label: "Web Development" },
    { href: "/social-media-boosting", label: "Social Media" },
    { href: "/chatbots-ai", label: "AI & Chatbots" },
    { href: "/internet-services", label: "Internet Services" },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-hacker-terminal/95 backdrop-blur-md shadow-lg shadow-hacker-green/10" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <NewYearLogo size="md" />
            <div>
              <h1 className="text-xl font-tech font-bold text-hacker-green-bright group-hover:text-hacker-green transition-colors">
                AnonyMikeTech
              </h1>
              <p className="text-xs text-hacker-green-dim font-tech">EXPLORE • DEVELOP • INNOVATE</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.span
                  whileHover={{ scale: 1.05, color: "#00ff41" }}
                  className="text-hacker-green-dim hover:text-hacker-green-bright font-tech font-medium transition-colors cursor-pointer relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-hacker-green group-hover:w-full transition-all duration-300"></span>
                </motion.span>
              </Link>
            ))}

            {/* CTA Button */}
            <Link href="/checkout">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-hacker-green to-emerald-400 text-hacker-terminal font-tech font-bold hover:shadow-lg hover:shadow-hacker-green/50 transition-all"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
