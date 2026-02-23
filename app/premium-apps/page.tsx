"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Download, Star, Zap, Lock } from "lucide-react"
import Link from "next/link"
import { premiumApps } from "@/lib/premium-apps-data"
import PremiumAppPaymentModal from "@/components/PremiumAppPaymentModal"
import MatrixRain from "@/components/MatrixRain"
import MobileMenu from "@/components/MobileMenu"
import BackToTop from "@/components/BackToTop"
import DesktopNavbar from "@/components/DesktopNavbar"

export default function PremiumAppsPage() {
  const [selectedApp, setSelectedApp] = useState<(typeof premiumApps)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleBuyNow = (app: (typeof premiumApps)[0]) => {
    setSelectedApp(app)
    setIsModalOpen(true)
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
                  KSH 100
                </div>
                <p className="text-xs sm:text-sm text-slate-400">Per App</p>
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

                <div className="relative p-5 sm:p-6 flex flex-col h-full">
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

                  {/* Price and Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-green-500/20">
                    <div className="text-lg sm:text-xl font-bold text-green-400 font-mono">
                      KSH {app.price}
                    </div>
                    <button
                      onClick={() => handleBuyNow(app)}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded border border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors font-mono text-xs sm:text-sm"
                    >
                      <ShoppingCart size={16} />
                      <span className="hidden sm:inline">Buy</span>
                    </button>
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
          price={selectedApp.price}
        />
      )}

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
