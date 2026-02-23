"use client"

import { Shield, Lock, Globe, Zap, Server, Eye } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { ShoppingCart } from "lucide-react"
import MatrixRain from "../components/MatrixRain"
import ServiceHero from "../components/ServiceHero"
import PricingCardWithCart from "../components/PricingCardWithCart"
import Cart from "../components/Cart"
import ContactButtons from "../components/ContactButtons"
import MobileMenu from "../components/MobileMenu"
import BackToTop from "../components/BackToTop"
import DuplicateItemConfirmation from "../components/DuplicateItemConfirmation"
import OfferModal from "../components/OfferModal"
import VPNPackageModal from "../components/VPNPackageModal"
import DynamicOfferBanner from "../components/DynamicOfferBanner"
import ServerUpgradeAnnouncement from "../components/ServerUpgradeAnnouncement"
import ClientConnectionStats from "../components/ClientConnectionStats"
import BingwaServicesButton from "../components/BingwaServicesButton"
import VPNAppComingSoon from "../components/VPNAppComingSoon"
import { useOfferPricing } from "../hooks/useOfferPricing"

function getCurrentYear() {
  return new Date().getFullYear()
}

interface CartItem {
  id: string
  title: string
  price: string
  period: string
  quantity: number
}

export default function InternetServices() {
  const [isMobile, setIsMobile] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [duplicateConfirmation, setDuplicateConfirmation] = useState<{
    isOpen: boolean
    item: { id: string; title: string; price: string; period: string } | null
    currentQuantity: number
  }>({ isOpen: false, item: null, currentQuantity: 0 })
  const [packageModalOpen, setPackageModalOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<{
    id: string
    title: string
    price: string
    period: string
    features: string[]
    popular?: boolean
    hasDiscount?: boolean
    originalPrice?: string
  } | null>(null)

  // Dynamic pricing hook
  const { updateVPNPlansWithPricing, hasDiscount, getOriginalPrice, isOfferActive } = useOfferPricing()

  const addToCart = (item: {
    id: string
    title: string
    price: string
    period: string
  }) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      // Show confirmation dialog for duplicate items
      setDuplicateConfirmation({
        isOpen: true,
        item: item,
        currentQuantity: existingItem.quantity,
      })
    } else {
      // Add new item directly
      setCartItems((prev) => [...prev, { ...item, quantity: 1 }])
    }
  }

  const confirmAddDuplicate = () => {
    if (duplicateConfirmation.item) {
      setCartItems((prev) =>
        prev.map((cartItem) =>
          cartItem.id === duplicateConfirmation.item!.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        ),
      )
    }
    setDuplicateConfirmation({ isOpen: false, item: null, currentQuantity: 0 })
  }

  const cancelAddDuplicate = () => {
    setDuplicateConfirmation({ isOpen: false, item: null, currentQuantity: 0 })
  }

  const handlePackageDetails = (packageData: {
    id: string
    title: string
    price: string
    period: string
    features: string[]
    popular?: boolean
    hasDiscount?: boolean
    originalPrice?: string
  }) => {
    setSelectedPackage(packageData)
    setPackageModalOpen(true)
  }

  const handleCartDuplicateRequest = (cartItem: CartItem) => {
    setDuplicateConfirmation({
      isOpen: true,
      item: {
        id: cartItem.id,
        title: cartItem.title,
        price: cartItem.price,
        period: cartItem.period,
      },
      currentQuantity: cartItem.quantity,
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)))
  }

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleCheckout = () => {
    const whatsappUrl = "https://wa.me/p/24385815697736941/254782829321"
    window.open(whatsappUrl, "_blank")
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

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
  const features = [
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Military-Grade Encryption",
      description: "AES-256 encryption protecting your data from prying eyes.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Server Network",
      description: "Access content worldwide with servers in 50+ countries.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast Speeds",
      description: "Premium bandwidth with no throttling or speed limits.",
    },
    {
      icon: <Server className="w-8 h-8" />,
      title: "Dedicated Servers",
      description: "Exclusive server access for maximum performance.",
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Zero Logs Policy",
      description: "Complete anonymity with no activity logging.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "DDoS Protection",
      description: "Advanced protection against cyber attacks.",
    },
  ]

  const vpnPlans = [
    {
      id: "trial-plan",
      title: "♻️ 3 DAYS TRIAL",
      price: "KES 50",
      period: "3 days",
      features: [
        "🔒 Trial VPN Access",
        "🌍 3 Server Locations",
        "📱 1 Device Connection",
        "⚡ Standard Speed",
        "💬 Basic Support",
        "🛡️ Basic Protection",
      ],
    },
    {
      id: "weekly-plan",
      title: "♻️ WEEKLY VPN",
      price: "KES 100",
      period: "week",
      features: [
        "🔒 Effecient VPN Access",
        "🌍 5 Server Locations",
        "📱 1 Device Connections",
        "⚡ Standard Speed",
        "💬 Email Support",
        "🛡️ Kill Switch Protection",
      ],
    },
    {
      id: "two-weeks-plan",
      title: "♻️ TWO WEEKS VPN",
      price: "KES 180",
      period: "2 weeks",
      features: [
        "🔒 Enhanced VPN Access",
        "🌍 15 Server Locations",
        "📱 2 Device Connections",
        "⚡ High Speed",
        "💬 Priority Support",
        "🛡️ Advanced Kill Switch",
        "📊 Usage Analytics",
      ],
    },
    {
      id: "three-weeks-plan",
      title: " ♻️ THREE WEEKS VPN",
      price: "KES 260",
      period: "3 weeks",
      popular: true,
      features: [
        "🔒 Premium VPN Access",
        "🌍 25+ Server Locations",
        "📱 Unlimited Devices",
        "⚡ Ultra High Speed",
        "💬 VIP Support",
        " 🪖 Military-Grade Protection",
        "📊 Advanced Analytics",
        "🔥 Split Tunneling",
      ],
    },
    {
      id: "monthly-plan",
      title: "♻️ MONTHLY VPN",
      price: "KES 340",
      period: "month",
      features: [
        "🔒 Elite VPN Access",
        "🌍 50+ Global Servers",
        "📱 Unlimited Devices",
        "⚡ Maximum Speed",
        "💬 24/7 VIP Support",
        "🛡️ Zero-Log Policy",
        "📊 Real-time Analytics",
        "🔥 Custom Server Setup",
        "🎁 Dedicated IP Option",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-green relative">
      <MobileMenu />
      <BackToTop />
      <MatrixRain />

      {/* Offer Notifications */}
      <OfferModal />

      <div className="relative z-10">
        <ServiceHero
          title="INTERNET SERVICES"
          subtitle="// Secure & Anonymous Connectivity"
          description="Access the internet with complete anonymity and security. Our VPN services and data bundles provide military-grade protection while ensuring lightning-fast speeds for all your online activities."
          icon={<Shield />}
          backgroundPattern="VPN"
        />

        {/* Server Upgrade Announcement */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <ServerUpgradeAnnouncement />
          </div>
        </section>

        {/* Live Client Connection Statistics */}
        <ClientConnectionStats />

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-tech font-bold text-center mb-16 glow-text"
            >
              // SECURITY FEATURES
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="glow-border rounded-lg p-6 bg-hacker-terminal/50 backdrop-blur-sm text-center group hover:animate-glow-pulse"
                >
                  <div className="text-hacker-green mb-4 flex justify-center group-hover:animate-pulse">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-tech font-bold text-hacker-green-bright mb-3 glow-text">
                    {feature.title}
                  </h3>
                  <p className="text-hacker-green-dim leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bingwa Services Button */}
        <BingwaServicesButton />

        {/* Requirements Section */}
        <section className="py-16 bg-gradient-to-r from-hacker-terminal/30 to-hacker-bg/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-tech font-bold glow-text mb-4">📱 REQUIREMENTS</h2>
              <p className="text-xl text-hacker-green-bright mb-8">
                // Before purchasing VPN services, ensure you have the required app
              </p>
            </motion.div>

            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="glow-border rounded-lg p-8 bg-hacker-terminal/50 backdrop-blur-sm mb-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Left side - App info and download */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F1ae476251e0647bcae5627e268461ecc%2F392455a8bc654d8f86417ccfa66ace56?format=webp&width=800"
                        alt="HTTP Injector App Icon"
                        className="w-16 h-16 rounded-lg shadow-lg animate-pulse"
                      />
                      <div>
                        <h3 className="text-2xl font-tech font-bold text-hacker-green-bright glow-text">
                          HTTP Injector
                        </h3>
                        <p className="text-hacker-green-dim font-tech">Required Application</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-hacker-green flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-hacker-bg font-tech font-bold text-sm">1</span>
                        </div>
                        <div>
                          <h4 className="font-tech font-bold text-hacker-green-bright mb-1">Download HTTP Injector</h4>
                          <p className="text-hacker-green-dim">
                            Install the required app from Google Play Store to use our VPN services
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-hacker-green flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-hacker-bg font-tech font-bold text-sm">2</span>
                        </div>
                        <div>
                          <h4 className="font-tech font-bold text-hacker-green-bright mb-1">Purchase VPN Package</h4>
                          <p className="text-hacker-green-dim">
                            Choose your preferred VPN package from our selection below
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-hacker-green flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-hacker-bg font-tech font-bold text-sm">3</span>
                        </div>
                        <div>
                          <h4 className="font-tech font-bold text-hacker-green-bright mb-1">Receive Configuration</h4>
                          <p className="text-hacker-green-dim">
                            Get your device ID and setup instructions via WhatsApp
                          </p>
                        </div>
                      </div>
                    </div>

                    <motion.a
                      href="https://play.google.com/store/apps/details?id=com.evozi.injector"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-lg font-tech font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                      </svg>
                      Download from Play Store
                    </motion.a>
                  </div>

                  {/* Right side - Sequential 3D Phone Display */}
                  <div className="flex justify-center w-full">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg"
                      style={{ perspective: "1000px" }}
                    >
                      {/* 3D Phone Container - Responsive */}
                      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[26rem] mx-auto">
                        {/* Phone 1 - Hotshare (appears first) */}
                        <motion.div
                          initial={{
                            opacity: 0,
                            rotateY: -90,
                            z: -200,
                            scale: 0.8,
                          }}
                          whileInView={{
                            opacity: 1,
                            rotateY: 0,
                            z: 0,
                            scale: 1,
                          }}
                          animate={{
                            opacity: [1, 1, 1, 0, 0, 0],
                            rotateY: [0, 0, 0, 90, 90, 90],
                            z: [0, 0, 0, -200, -200, -200],
                          }}
                          transition={{
                            duration: 6,
                            times: [0, 0.33, 0.5, 0.67, 0.83, 1],
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                          whileHover={{
                            rotateY: -5,
                            z: 30,
                            transition: { duration: 0.3 },
                          }}
                          className="absolute top-4 sm:top-6 md:top-8 left-1/2 transform -translate-x-1/2 w-40 h-56 sm:w-48 sm:h-64 md:w-56 md:h-80 lg:w-64 lg:h-[22rem] bg-gray-900 rounded-[1.5rem] sm:rounded-[2rem] p-2 sm:p-3 shadow-lg sm:shadow-xl md:shadow-2xl border-2 sm:border-3 md:border-4 border-gray-700 transform-gpu"
                          style={{
                            transformStyle: "preserve-3d",
                            transformOrigin: "center center",
                          }}
                        >
                          <div className="w-full h-full rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden bg-gray-800 relative">
                            <img
                              src="https://cdn.builder.io/api/v1/image/assets%2F1ae476251e0647bcae5627e268461ecc%2Fa9bc052da0ae41529ae4a3d615fe660f?format=webp&width=800"
                              alt="HTTP Injector Hotshare Interface"
                              className="w-full h-full object-cover"
                            />
                            {/* Screen Glare Effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"
                              animate={{
                                background: [
                                  "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
                                  "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                                  "linear-gradient(45deg, transparent 50%, rgba(255,255,255,0.1) 100%)",
                                ],
                              }}
                              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                            />
                          </div>
                          {/* Home Indicator - Responsive */}
                          <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gray-600 rounded-full"></div>
                        </motion.div>

                        {/* Phone 2 - Tools (appears second) */}
                        <motion.div
                          initial={{
                            opacity: 0,
                            rotateY: -90,
                            z: -200,
                            scale: 0.8,
                          }}
                          animate={{
                            opacity: [0, 0, 1, 1, 1, 0],
                            rotateY: [90, 90, 0, 0, 0, 90],
                            z: [-200, -200, 0, 0, 0, -200],
                            scale: [0.8, 0.8, 1, 1, 1, 0.8],
                          }}
                          transition={{
                            duration: 6,
                            times: [0, 0.33, 0.5, 0.67, 0.83, 1],
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                            delay: 0.2,
                          }}
                          whileHover={{
                            rotateY: 5,
                            z: 30,
                            transition: { duration: 0.3 },
                          }}
                          className="absolute top-4 sm:top-6 md:top-8 left-1/2 transform -translate-x-1/2 w-40 h-56 sm:w-48 sm:h-64 md:w-56 md:h-80 lg:w-64 lg:h-[22rem] bg-gray-900 rounded-[1.5rem] sm:rounded-[2rem] p-2 sm:p-3 shadow-lg sm:shadow-xl md:shadow-2xl border-2 sm:border-3 md:border-4 border-gray-700 transform-gpu"
                          style={{
                            transformStyle: "preserve-3d",
                            transformOrigin: "center center",
                          }}
                        >
                          <div className="w-full h-full rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden bg-gray-800 relative">
                            <img
                              src="https://cdn.builder.io/api/v1/image/assets%2F1ae476251e0647bcae5627e268461ecc%2F43a19db412704b789b528b2116d5850a?format=webp&width=800"
                              alt="HTTP Injector Tools Interface"
                              className="w-full h-full object-cover"
                            />
                            {/* Screen Reflection */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-tl from-cyan-400/10 via-transparent to-transparent"
                              animate={{ opacity: [0.3, 0.6, 0.3] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                            />
                          </div>
                          <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gray-600 rounded-full"></div>
                        </motion.div>

                        {/* Phone 3 - Settings (appears third) */}
                        <motion.div
                          initial={{
                            opacity: 0,
                            rotateY: -90,
                            z: -200,
                            scale: 0.8,
                          }}
                          animate={{
                            opacity: [0, 0, 0, 0, 1, 1],
                            rotateY: [90, 90, 90, 90, 0, 0],
                            z: [-200, -200, -200, -200, 0, 0],
                            scale: [0.8, 0.8, 0.8, 0.8, 1, 1],
                          }}
                          transition={{
                            duration: 6,
                            times: [0, 0.33, 0.5, 0.67, 0.83, 1],
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                            delay: 0.4,
                          }}
                          whileHover={{
                            rotateY: -5,
                            z: 30,
                            transition: { duration: 0.3 },
                          }}
                          className="absolute top-4 sm:top-6 md:top-8 left-1/2 transform -translate-x-1/2 w-40 h-56 sm:w-48 sm:h-64 md:w-56 md:h-80 lg:w-64 lg:h-[22rem] bg-gray-900 rounded-[1.5rem] sm:rounded-[2rem] p-2 sm:p-3 shadow-lg sm:shadow-xl md:shadow-2xl border-2 sm:border-3 md:border-4 border-gray-700 transform-gpu"
                          style={{
                            transformStyle: "preserve-3d",
                            transformOrigin: "center center",
                          }}
                        >
                          <div className="w-full h-full rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden bg-gray-800 relative">
                            <img
                              src="https://cdn.builder.io/api/v1/image/assets%2F1ae476251e0647bcae5627e268461ecc%2F8ad536082d404fd4b412042bb4a90eb3?format=webp&width=800"
                              alt="HTTP Injector Settings Interface"
                              className="w-full h-full object-cover"
                            />
                            {/* Screen Glow */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-tr from-blue-400/10 via-transparent to-transparent"
                              animate={{ opacity: [0.2, 0.5, 0.2] }}
                              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                            />
                          </div>
                          <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gray-600 rounded-full"></div>
                        </motion.div>

                        {/* Floating Particles around phone - Responsive */}
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-hacker-green rounded-full"
                            style={{
                              left: `${15 + Math.random() * 70}%`,
                              top: `${10 + Math.random() * 80}%`,
                            }}
                            animate={{
                              y: [0, -10, 0],
                              opacity: [0.2, 0.8, 0.2],
                              scale: [0.3, 1, 0.3],
                            }}
                            transition={{
                              duration: 4 + Math.random() * 2,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.5,
                              ease: "easeInOut",
                            }}
                          />
                        ))}

                        {/* Touch indicator for mobile */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: 2,
                            repeatDelay: 4,
                          }}
                          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center sm:hidden"
                        >
                          <div className="text-xs font-tech text-hacker-green-dim bg-hacker-terminal/50 backdrop-blur-sm px-3 py-1 rounded-full border border-hacker-green/20">
                            👆 Tap to interact
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Important Notice */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="mt-8 p-6 bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-lg border border-yellow-500/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-black font-tech font-bold">⚠</span>
                    </div>
                    <div>
                      <h4 className="font-tech font-bold text-yellow-400 mb-2">Important Notice</h4>
                      <p className="text-yellow-200 font-tech">
                        HTTP Injector app is <strong>mandatory</strong> for all VPN services. Without this app, you
                        won't be able to use our VPN configurations. Download it before making any purchase.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bingwa Services Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-6xl font-tech font-bold glow-text mb-4">🔒 VPN PACKAGES</h2>
              <p className="text-xl text-hacker-green-bright mb-6">// Military-grade encryption & anonymous browsing</p>

              {/* Dynamic Offer Banner - Changes based on time and events */}
              <DynamicOfferBanner />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
              {updateVPNPlansWithPricing(vpnPlans).map((plan, index) => (
                <PricingCardWithCart
                  key={plan.id}
                  id={plan.id}
                  title={plan.title}
                  price={plan.price}
                  period={plan.period}
                  features={plan.features}
                  popular={plan.popular}
                  delay={index * 0.2}
                  onAddToCart={addToCart}
                  hasDiscount={hasDiscount(plan.id)}
                  originalPrice={getOriginalPrice(plan.id)}
                  onMoreDetails={handlePackageDetails}
                />
              ))}
            </div>

            {/* Payment Methods - Integrated directly in VPN packages section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-gradient-to-r from-hacker-terminal/40 to-hacker-bg/60 backdrop-blur-sm border-2 border-hacker-green/30 rounded-2xl p-8 relative overflow-hidden"
                style={{
                  boxShadow: "0 0 30px rgba(16, 185, 129, 0.2), inset 0 0 30px rgba(16, 185, 129, 0.05)",
                }}
              >
                {/* Animated border glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-hacker-green/20 pointer-events-none"
                  animate={{
                    boxShadow: [
                      "0 0 15px rgba(16, 185, 129, 0.2)",
                      "0 0 30px rgba(16, 185, 129, 0.4)",
                      "0 0 15px rgba(16, 185, 129, 0.2)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <motion.h3
                      className="text-2xl md:text-3xl font-tech font-bold glow-text mb-2"
                      animate={{
                        textShadow: [
                          "0 0 10px rgba(16, 185, 129, 0.5)",
                          "0 0 20px rgba(16, 185, 129, 0.8)",
                          "0 0 10px rgba(16, 185, 129, 0.5)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      💳 PAYMENT METHODS
                    </motion.h3>
                    <p className="text-hacker-green-bright font-tech">// Choose your preferred payment option</p>
                  </div>

                  {/* Payment Methods Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Send Money */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      whileHover={{ scale: 1.05 }}
                      className="glow-border rounded-xl p-6 bg-hacker-bg/60 backdrop-blur-sm text-center group hover:bg-hacker-bg/80 transition-all duration-300"
                    >
                      <motion.div
                        className="text-hacker-green mb-4 text-3xl group-hover:animate-pulse"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        📱
                      </motion.div>
                      <h5 className="font-tech font-bold text-hacker-green-bright mb-3 text-lg">Send Money</h5>
                      <div className="bg-hacker-terminal/80 rounded-lg p-4 font-tech text-hacker-green-bright mb-3 text-xl font-bold border border-hacker-green/20">
                        0113313240
                      </div>
                      <p className="text-sm text-hacker-green-dim font-tech">Direct M-Pesa Transfer</p>
                    </motion.div>

                    {/* Till Number */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      whileHover={{ scale: 1.05 }}
                      className="glow-border rounded-xl p-6 bg-hacker-bg/60 backdrop-blur-sm text-center group hover:bg-hacker-bg/80 transition-all duration-300"
                    >
                      <motion.div
                        className="text-hacker-green mb-4 text-3xl group-hover:animate-pulse"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                      >
                        💳
                      </motion.div>
                      <h5 className="font-tech font-bold text-hacker-green-bright mb-3 text-lg">Till Number</h5>
                      <div className="bg-hacker-terminal/80 rounded-lg p-4 font-tech text-hacker-green-bright mb-3 text-xl font-bold border border-hacker-green/20">
                        4930086
                      </div>
                      <p className="text-sm text-hacker-green-dim font-tech">Lipa na M-Pesa</p>
                    </motion.div>

                    {/* Paybill */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      className="glow-border rounded-xl p-6 bg-hacker-bg/60 backdrop-blur-sm text-center group hover:bg-hacker-bg/80 transition-all duration-300"
                    >
                      <motion.div
                        className="text-hacker-green mb-4 text-3xl group-hover:animate-pulse"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                      >
                        🏢
                      </motion.div>
                      <h5 className="font-tech font-bold text-hacker-green-bright mb-3 text-lg">Paybill</h5>
                      <div className="bg-hacker-terminal/80 rounded-lg p-4 font-tech text-hacker-green-bright mb-3 text-sm font-bold border border-hacker-green/20">
                        Business No: 247247
                        <br />
                        Account No: 0790181410905
                      </div>
                      <p className="text-sm text-hacker-green-dim font-tech">M-Pesa Paybill</p>
                    </motion.div>
                  </div>

                  {/* Quick M-Pesa Payment Buttons - Only show on mobile */}
                  {isMobile && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="mb-8"
                    >
                      <h4 className="font-tech font-bold text-hacker-green-bright mb-4 text-center">
                        ⚡ QUICK M-PESA PAYMENT
                      </h4>
                      <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
                        {/* USSD Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            window.location.href = "tel:*334%23"
                          }}
                          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-tech font-bold transition-all duration-300 hover:animate-glow-pulse w-full"
                        >
                          📞 Dial *334# (M-Pesa Menu)
                        </motion.button>

                        {/* M-Pesa App Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            const mpesaAppUrl = "mpesa://"
                            const fallbackUrl = "https://play.google.com/store/apps/details?id=com.safaricom.mpesa"
                            window.location.href = mpesaAppUrl
                            setTimeout(() => {
                              window.location.href = fallbackUrl
                            }, 1500)
                          }}
                          className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 py-4 rounded-lg font-tech font-bold transition-all duration-300 hover:animate-glow-pulse w-full"
                        >
                          📱 Open M-Pesa App
                        </motion.button>

                        {/* Send Money Quick Link */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            const sendMoneyUSSD = "*334*1*0113313240#"
                            window.location.href = `tel:${encodeURIComponent(sendMoneyUSSD)}`
                          }}
                          className="flex items-center justify-center gap-2 bg-hacker-green hover:bg-hacker-green-bright text-hacker-bg px-6 py-4 rounded-lg font-tech font-bold transition-all duration-300 hover:animate-glow-pulse w-full"
                        >
                          💸 Quick Send to 0113313240
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* After Payment Instructions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="text-center border-t border-hacker-green/20 pt-8"
                  >
                    <h4 className="font-tech font-bold text-hacker-green-bright mb-4 text-lg">📸 AFTER PAYMENT:</h4>
                    <div className="space-y-4">
                      <p className="font-tech text-hacker-green-bright">
                        🔶 Send screenshot of your payment to WhatsApp
                      </p>
                      <motion.a
                        href="https://wa.me/+254113313240"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-hacker-green text-hacker-bg px-8 py-4 rounded-xl font-tech font-bold hover:bg-hacker-green-bright transition-all duration-300 shadow-lg"
                        whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(16, 185, 129, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        💬 +254113313240
                      </motion.a>
                      <div className="bg-hacker-terminal/40 rounded-lg p-4 border border-hacker-green/20 max-w-md mx-auto">
                        <p className="text-hacker-green-bright font-tech font-bold mb-2">
                          🔷 DEVICE ID HTTP INJECTOR ✅
                        </p>
                        <p className="text-sm text-hacker-green-dim">
                          You'll receive setup instructions after payment confirmation
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating Cart Button - Only appears when items are in cart */}
            {totalItems > 0 && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => setIsCartOpen(true)}
                className="fixed bottom-32 right-6 z-40 bg-hacker-green text-hacker-bg p-4 rounded-full shadow-lg hover:bg-hacker-green-bright transition-all duration-300 animate-glow-pulse"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-tech font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.div>
                </div>
              </motion.button>
            )}

            {/* VPN App Coming Soon Announcement */}
            <VPNAppComingSoon />
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="py-16"
        >
          <div className="container mx-auto px-4">
            <div className="glow-border rounded-lg p-12 bg-hacker-terminal/30 backdrop-blur-sm text-center">
              <h3 className="text-3xl md:text-4xl font-tech font-bold text-hacker-green-bright mb-6 glow-text">
                Ready to Go Anonymous?
              </h3>
              <p className="text-xl text-hacker-green-dim mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust ANONYMIKETECH for secure and private internet access.
              </p>
              <ContactButtons />
            </div>
          </div>
        </motion.section>

        {/* Copyright Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="py-8 border-t border-hacker-green/20"
        >
          <div className="container mx-auto px-4 text-center">
            <motion.p
              className="font-tech text-hacker-green-dim hover:text-hacker-green transition-colors duration-300"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              © anonymiketech_inc@{getCurrentYear()}
            </motion.p>
          </div>
        </motion.footer>

        {/* Cart Component */}
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onCheckout={handleCheckout}
          onRequestDuplicateConfirmation={handleCartDuplicateRequest}
        />

        {/* Duplicate Item Confirmation */}
        <DuplicateItemConfirmation
          isOpen={duplicateConfirmation.isOpen}
          itemTitle={duplicateConfirmation.item?.title || ""}
          currentQuantity={duplicateConfirmation.currentQuantity}
          onConfirm={confirmAddDuplicate}
          onCancel={cancelAddDuplicate}
        />

        {/* VPN Package Details Modal */}
        {selectedPackage && (
          <VPNPackageModal
            isOpen={packageModalOpen}
            onClose={() => setPackageModalOpen(false)}
            packageData={selectedPackage}
            onAddToCart={addToCart}
          />
        )}

        {/* Back to top */}
        <BackToTop />
      </div>
    </div>
  )
}
