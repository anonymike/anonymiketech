"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Star, CreditCard, ShoppingCart, Shield, Zap, MessageCircle, Info } from "lucide-react"

interface VPNPackageModalProps {
  isOpen: boolean
  onClose: () => void
  packageData: {
    id: string
    title: string
    price: string
    period: string
    features: string[]
    popular?: boolean
    hasDiscount?: boolean
    originalPrice?: string
  }
  onAddToCart: (item: {
    id: string
    title: string
    price: string
    period: string
  }) => void
}

export default function VPNPackageModal({ isOpen, onClose, packageData, onAddToCart }: VPNPackageModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!isOpen) return null

  const handleAddToCart = () => {
    onAddToCart({
      id: packageData.id,
      title: packageData.title,
      price: packageData.price,
      period: packageData.period,
    })
    onClose()
  }

  const handleDirectPayment = () => {
    window.open("https://anonymiketech-checkouts.vercel.app/", "_blank")
  }

  const handleWhatsAppOrder = () => {
    const message =
      `🔒 VPN SERVICE INQUIRY\\n\\n` +
      `📦 Package: ${packageData.title}\\n` +
      `💰 Price: ${packageData.price}/${packageData.period}\\n\\n` +
      `I'm interested in this VPN package. Please provide more details and payment instructions.`

    const whatsappUrl = `https://wa.me/+254782829321?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const packageIcons = {
    "trial-plan": "🔄",
    "weekly-plan": "📅",
    "two-weeks-plan": "📆",
    "three-weeks-plan": "👑",
    "monthly-plan": "🏆",
  }

  const detailedFeatures = {
    security: [
      "🛡️ Military-grade AES-256 encryption",
      "🔒 Zero-logs policy verified",
      "🛡️ Kill switch protection",
      "🔐 DNS leak prevention",
      "🛡️ IP masking technology",
    ],
    performance: [
      "⚡ Ultra-fast server speeds",
      "🌐 Premium bandwidth allocation",
      "📡 Low latency connections",
      "🔄 Unlimited data transfer",
      "📊 99.9% uptime guarantee",
    ],
    support: [
      "💬 24/7 WhatsApp support",
      "📱 HTTP Injector setup help",
      "🔧 Device configuration assistance",
      "📚 Comprehensive tutorials",
      "🚀 Quick response times",
    ],
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-hacker-terminal border-2 border-hacker-green rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{packageIcons[packageData.id as keyof typeof packageIcons] || "🔒"}</div>
              <div>
                <h3 className="text-2xl font-tech font-bold text-hacker-green-bright glow-text">{packageData.title}</h3>
                {packageData.popular && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 font-tech text-sm font-bold">MOST POPULAR</span>
                  </div>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-hacker-green/20 rounded-lg transition-colors">
              <X className="w-6 h-6 text-hacker-green" />
            </button>
          </div>

          {/* Price Section */}
          <div className="bg-hacker-bg/50 rounded-lg p-6 mb-6 text-center">
            {packageData.hasDiscount && packageData.originalPrice ? (
              <div className="space-y-2">
                <div className="text-2xl font-tech font-bold text-hacker-green-dim line-through opacity-60">
                  {packageData.originalPrice}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-5xl font-tech font-bold text-yellow-400 animate-pulse">
                    {packageData.price}
                  </span>
                  <span className="text-yellow-300 font-tech text-lg">/{packageData.period}</span>
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="bg-red-500 text-white text-sm font-tech font-bold px-3 py-1 rounded-full ml-2"
                  >
                    SALE!
                  </motion.span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span className="text-5xl font-tech font-bold text-hacker-green">{packageData.price}</span>
                <span className="text-hacker-green-dim font-tech text-lg">/{packageData.period}</span>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: "overview", label: "Overview", icon: Info },
              { id: "security", label: "Security", icon: Shield },
              { id: "performance", label: "Performance", icon: Zap },
              { id: "support", label: "Support", icon: MessageCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-tech font-bold text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-hacker-green text-hacker-bg"
                    : "bg-hacker-bg/50 text-hacker-green-bright hover:bg-hacker-green/20"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mb-6">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h4 className="text-xl font-tech font-bold text-hacker-green-bright mb-4">📋 Package Features</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {packageData.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-hacker-bg/30 rounded-lg"
                      >
                        <Check className="w-5 h-5 text-hacker-green flex-shrink-0" />
                        <span className="font-tech text-hacker-green-bright">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h4 className="text-xl font-tech font-bold text-hacker-green-bright mb-4">🛡️ Security Features</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {detailedFeatures.security.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-hacker-bg/30 rounded-lg"
                      >
                        <Shield className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <span className="font-tech text-hacker-green-bright">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "performance" && (
                <motion.div
                  key="performance"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h4 className="text-xl font-tech font-bold text-hacker-green-bright mb-4">⚡ Performance Features</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {detailedFeatures.performance.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-hacker-bg/30 rounded-lg"
                      >
                        <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                        <span className="font-tech text-hacker-green-bright">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "support" && (
                <motion.div
                  key="support"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h4 className="text-xl font-tech font-bold text-hacker-green-bright mb-4">💬 Support & Setup</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {detailedFeatures.support.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-hacker-bg/30 rounded-lg"
                      >
                        <MessageCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="font-tech text-hacker-green-bright">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <h4 className="text-lg font-tech font-bold text-hacker-green-bright text-center mb-4">
              🚀 Get Started Now
            </h4>

            <motion.button
              onClick={handleAddToCart}
              className="w-full bg-hacker-green text-hacker-bg py-4 rounded-lg font-tech font-bold transition-all duration-300 flex items-center justify-center gap-3 hover:bg-hacker-green-bright hover:shadow-lg hover:shadow-hacker-green/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingCart className="w-5 h-5" />🛒 Add to Cart
            </motion.button>

            <motion.button
              onClick={handleDirectPayment}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-lg font-tech font-bold transition-all duration-300 flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CreditCard className="w-5 h-5" />💳 Pay Direct - {packageData.price}
            </motion.button>

            <motion.button
              onClick={handleWhatsAppOrder}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-lg font-tech font-bold transition-all duration-300 flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageCircle className="w-5 h-5" />💬 WhatsApp Inquiry
            </motion.button>
          </div>

          {/* Requirements Note */}
          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-tech font-bold text-yellow-400 mb-2">📱 Setup Requirements</h5>
                <div className="text-sm text-yellow-200 space-y-1">
                  <p>• HTTP Injector app required (download from Play Store)</p>
                  <p>• Device ID needed for configuration</p>
                  <p>• Setup instructions provided after purchase</p>
                  <p>• 24/7 support available for setup assistance</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
