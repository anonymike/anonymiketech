"use client"

import { Shield, Lock, Globe, Zap, Server, Eye } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import MatrixRain from "@/components/MatrixRain"
import ServiceHero from "@/components/ServiceHero"
import Cart from "@/components/Cart"
import ContactButtons from "@/components/ContactButtons"
import MobileMenu from "@/components/MobileMenu"
import BackToTop from "@/components/BackToTop"
import DuplicateItemConfirmation from "@/components/DuplicateItemConfirmation"
import OfferModal from "@/components/OfferModal"
import VPNPackageModal from "@/components/VPNPackageModal"
import ServerUpgradeAnnouncement from "@/components/ServerUpgradeAnnouncement"
import ClientConnectionStats from "@/components/ClientConnectionStats"
import { useOfferPricing } from "@/hooks/useOfferPricing"
import ChatbaseEmbed from "@/components/ChatbaseEmbed"

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

  const { updateVPNPlansWithPricing, hasDiscount, getOriginalPrice, isOfferActive } = useOfferPricing()

  const addToCart = (item: {
    id: string
    title: string
    price: string
    period: string
  }) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      setDuplicateConfirmation({
        isOpen: true,
        item: item,
        currentQuantity: existingItem.quantity,
      })
    } else {
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

  const getCurrentYear = () => {
    return new Date().getFullYear()
  }

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-green relative">
      <ChatbaseEmbed />
      <MobileMenu />
      <BackToTop />
      <MatrixRain />

      <OfferModal />

      <div className="relative z-10">
        <ServiceHero
          title="INTERNET SERVICES"
          subtitle="// Secure & Anonymous Connectivity"
          description="Access the internet with complete anonymity and security. Our VPN services and data bundles provide military-grade protection while ensuring lightning-fast speeds for all your online activities."
          icon={<Shield />}
          backgroundPattern="VPN"
        />

        <section className="py-8">
          <div className="container mx-auto px-4">
            <ServerUpgradeAnnouncement />
          </div>
        </section>

        <ClientConnectionStats />

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

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onCheckout={handleCheckout}
          onRequestDuplicateConfirmation={handleCartDuplicateRequest}
        />

        <DuplicateItemConfirmation
          isOpen={duplicateConfirmation.isOpen}
          itemTitle={duplicateConfirmation.item?.title || ""}
          currentQuantity={duplicateConfirmation.currentQuantity}
          onConfirm={confirmAddDuplicate}
          onCancel={cancelAddDuplicate}
        />

        {selectedPackage && (
          <VPNPackageModal
            isOpen={packageModalOpen}
            onClose={() => setPackageModalOpen(false)}
            packageData={selectedPackage}
            onAddToCart={addToCart}
          />
        )}

        <BackToTop />
      </div>
    </div>
  )
}
