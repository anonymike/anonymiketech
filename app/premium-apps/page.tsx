"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Download, Star, Zap, Lock } from "lucide-react"
import Link from "next/link"
import { PremiumApp, premiumApps as staticPremiumApps } from "@/lib/premium-apps-data"
import { getPremiumAppsFromDB } from "@/lib/supabase-premium-apps-service"
import PremiumAppPaymentModal from "@/components/PremiumAppPaymentModal"
import PremiumAppDetailsModal from "@/components/PremiumAppDetailsModal"
import UpdatedAppOverlay from "@/components/UpdatedAppOverlay"
import MatrixRain from "@/components/MatrixRain"
import MobileMenu from "@/components/MobileMenu"
import BackToTop from "@/components/BackToTop"
import DesktopNavbar from "@/components/DesktopNavbar"

export default function PremiumAppsPage() {
  const [premiumApps, setPremiumApps] = useState<PremiumApp[]>([])
  const [selectedApp, setSelectedApp] = useState<PremiumApp | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAppForOverlay, setSelectedAppForOverlay] = useState<PremiumApp | null>(null)
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const [selectedAppForDetails, setSelectedAppForDetails] = useState<PremiumApp | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  useEffect(() => {
    const loadApps = async () => {
      try {
        // Try to load from database first
        const dbApps = await getPremiumAppsFromDB()
        if (dbApps && dbApps.length > 0) {
          console.log("[v0] Loaded apps from database:", dbApps.length)
          // Combine with static apps, with new packages first
          const newAppsFirst = [
            ...staticPremiumApps.filter(app => ["netflix-premium", "youtube-premium", "showmax-premium", "animations-premium", "peacock-premium"].includes(app.id)),
            ...dbApps
          ]
          setPremiumApps(newAppsFirst)
        } else {
          // Fallback to static data
          console.log("[v0] No database apps, using static data")
          const newAppsFirst = [
            ...staticPremiumApps.filter(app => ["netflix-premium", "youtube-premium", "showmax-premium", "animations-premium", "peacock-premium"].includes(app.id)),
            ...staticPremiumApps.filter(app => !["netflix-premium", "youtube-premium", "showmax-premium", "animations-premium", "peacock-premium"].includes(app.id))
          ]
          setPremiumApps(newAppsFirst)
        }
      } catch (error) {
        console.log("[v0] Database fetch failed, using static data:", error)
        // Fallback to static data if database is unavailable
        const newAppsFirst = [
          ...staticPremiumApps.filter(app => ["netflix-premium", "youtube-premium", "showmax-premium", "animations-premium", "peacock-premium"].includes(app.id)),
          ...staticPremiumApps.filter(app => !["netflix-premium", "youtube-premium", "showmax-premium", "animations-premium", "peacock-premium"].includes(app.id))
        ]
        setPremiumApps(newAppsFirst)
      }
    }
    loadApps()
  }, [])

  const handleBuyNow = (app: PremiumApp) => {
    setSelectedApp(app)
    setIsModalOpen(true)
  }

  const handleFindOut = (app: PremiumApp) => {
    setSelectedAppForOverlay(app)
    setIsOverlayOpen(true)
  }

  const handleReadMore = (app: PremiumApp) => {
    setSelectedAppForDetails(app)
    setIsDetailsModalOpen(true)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <MatrixRain />
      <MobileMenu />
      <DesktopNavbar />

      {/* Hero Section */}
      <section className="relative border-b border-green-500/30 py-12 sm:py-20 pt-20 md:pt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="mb-4 flex justify-center gap-2">
              <Zap className="text-green-400" size={24} />
              <Lock className="text-green-400" size={24} />
              <Zap className="text-green-400" size={24} />
            </div>
            <h2 className="mb-4 text-3xl sm:text-5xl font-bold text-green-400 font-mono">
              Professional Premium Apps
            </h2>
            <p className="mb-6 max-w-2xl text-base sm:text-lg text-slate-300 mx-auto">
              Unlock powerful applications designed for Everyone. Securely purchase with M-Pesa
              for just KSH 100 each.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mt-8">
              <div className="border border-green-500/30 rounded p-4 bg-green-500/5">
                <div className="text-2xl sm:text-3xl font-bold text-green-400 font-mono">
                  {premiumApps.length}
                </div>
                <p className="text-xs sm:text-sm text-slate-400">Premium Apps</p>
              </div>
              <div className="border border-green-500/30 rounded p-4 bg-green-500/5">
                <div className="text-2xl sm:text-3xl font-bold text-green-400 font-mono">
                  At Affordable price
                </div>
                <p className="text-xs sm:text-sm text-slate-400">Each App Has A Price</p>
              </div>
              <div className="border border-green-500/30 rounded p-4 bg-green-500/5">
                <div className="text-2xl sm:text-3xl font-bold text-green-400 font-mono">
                  {premiumApps.reduce((sum, app) => sum + app.downloads, 0)}+
                </div>
                <p className="text-xs sm:text-sm text-slate-400">Total Downloads</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Apps Grid */}
      <section className="relative py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {premiumApps.map((app) => (
              <motion.div
                key={app.id}
                variants={itemVariants}
                className="group relative border border-green-500/30 rounded-lg bg-slate-900/50 hover:bg-slate-900/80 overflow-hidden transition-all duration-300 hover:border-green-500/60"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:to-green-500/5 transition-all duration-300" />

                {/* Find Out Button Overlay - appears for new/updated apps */}
                {(app.isNew || app.isOffer) && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFindOut(app)}
                    className="absolute top-4 right-4 z-10 px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50 hover:shadow-green-500/70 transition-all"
                  >
                    Find Out →
                  </motion.button>
                )}

                <div className="relative p-5 sm:p-6 flex flex-col h-full">
                  {/* Badges */}
                  <div className="flex gap-2 mb-3">
                    {app.isNew && (
                      <span className="px-2 py-1 text-xs font-bold rounded bg-green-500/20 border border-green-500/50 text-green-400">
                        NEW
                      </span>
                    )}
                    {app.isOffer && (
                      <span className="px-2 py-1 text-xs font-bold rounded bg-red-500/20 border border-red-500/50 text-red-400">
                        OFFER
                      </span>
                    )}
                  </div>

                  {/* App Icon */}
                  <div className="text-4xl sm:text-5xl mb-4">{app.icon}</div>

                  {/* App Info */}
                  <h3 className="text-lg sm:text-xl font-bold text-green-400 mb-2 font-mono line-clamp-2">
                    {app.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 mb-3">
                    {app.description}
                  </p>

                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="inline-block px-2 sm:px-3 py-1 text-xs sm:text-sm rounded border border-green-500/30 text-green-400 bg-green-500/10 font-mono">
                      {app.category}
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className="text-xs sm:text-sm text-slate-400 space-y-1 mb-4 flex-1">
                    {app.features.slice(0, 3).map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">+</span>
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Downloads */}
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-400 mb-4">
                    <Download size={14} className="text-green-500" />
                    {app.downloads}+ downloads
                  </div>

                  {/* Price and Buttons */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-green-500/20">
                    <div className="text-lg sm:text-xl font-bold text-green-400 font-mono">
                      {app.isOffer && app.offerPrice ? (
                        <div className="flex flex-col">
                          <span className="line-through text-slate-400 text-sm">KSH {app.price}</span>
                          <span>KSH {app.offerPrice}</span>
                        </div>
                      ) : (
                        `KSH ${app.price}`
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReadMore(app)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded border border-slate-500 bg-slate-500/10 text-slate-300 hover:bg-slate-500/20 transition-colors font-mono text-xs sm:text-sm"
                      >
                        <span>Read More</span>
                      </button>
                      <button
                        onClick={() => handleBuyNow(app)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded border border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors font-mono text-xs sm:text-sm"
                      >
                        <ShoppingCart size={16} />
                        <span className="hidden sm:inline">Buy</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative border-t border-green-500/30 py-12 sm:py-20 bg-slate-900/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-green-400 mb-4 font-mono">
              Why Choose Premium Apps?
            </h2>
            <p className="text-slate-400">
              Professional tools designed by developers, for developers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Secure Payments",
                description: "M-Pesa integration for safe and quick transactions",
                icon: "🔐",
              },
              {
                title: "Instant Access",
                description: "Get immediate access after payment confirmation",
                icon: "⚡",
              },
              {
                title: "Professional Grade",
                description: "Production-ready tools used by professionals",
                icon: "💼",
              },
              {
                title: "Regular Updates",
                description: "Continuous improvements and new features",
                icon: "🔄",
              },
              {
                title: "24/7 Support",
                description: "Dedicated customer support available anytime",
                icon: "🛟",
              },
              {
                title: "Money Back",
                description: "30-day satisfaction guarantee on all purchases",
                icon: "💰",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border border-green-500/30 rounded p-6 bg-slate-900/50"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-green-400 mb-2 text-sm sm:text-base">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {selectedApp && (
        <PremiumAppPaymentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedApp(null)
          }}
          appName={selectedApp.name}
          appIcon={selectedApp.icon}
          price={selectedApp.isOffer && selectedApp.offerPrice ? selectedApp.offerPrice : selectedApp.price}
        />
      )}

      {/* Updated App Overlay */}
      <UpdatedAppOverlay
        app={selectedAppForOverlay}
        isOpen={isOverlayOpen}
        onClose={() => {
          setIsOverlayOpen(false)
          setSelectedAppForOverlay(null)
        }}
      />

      {/* App Details Modal */}
      <PremiumAppDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedAppForDetails(null)
        }}
        app={selectedAppForDetails}
        onInitiatePayment={(app) => {
          setIsDetailsModalOpen(false)
          setSelectedApp(app)
          setIsModalOpen(true)
        }}
      />

      {/* Footer */}
      <footer className="relative border-t border-green-500/30 bg-black py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-mono text-green-400 font-bold mb-4">PREMIUM APPS</h3>
              <p className="text-sm text-slate-400">
                Professional developer tools at affordable prices. Powered by M-Pesa.
              </p>
            </div>
            <div>
              <h3 className="font-mono text-green-400 font-bold mb-4">QUICK LINKS</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/" className="hover:text-green-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/checkout" className="hover:text-green-400 transition-colors">
                    Checkout
                  </Link>
                </li>
                <li>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-green-500/30 pt-8 text-center text-xs sm:text-sm text-slate-400">
            <p>
              © {new Date().getFullYear()} Premium Apps Store. All rights reserved. | Powered by
              Anonymiketech-labs
            </p>
          </div>
        </div>
      </footer>

      <BackToTop />
    </main>
  )
}
