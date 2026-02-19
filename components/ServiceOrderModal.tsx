"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Copy, Heart, Zap, TrendingUp } from "lucide-react"

declare global {
  interface Window {
    emailjs: any
  }
}

interface ServiceOrderModalProps {
  isOpen: boolean
  service: {
    id: string
    name: string
    originalPrice: number
    discountedPrice: number
    discount: number
  } | null
  onClose: () => void
  onCreateOrder: (orderData: any) => void
  balance: number
}

const QUANTITY_PRESETS = [100, 500, 1000, 2500, 5000, 10000]

export default function ServiceOrderModal({
  isOpen,
  service,
  onClose,
  onCreateOrder,
  balance,
}: ServiceOrderModalProps) {
  const [selectedQuantity, setSelectedQuantity] = useState(1000)
  const [customQuantity, setCustomQuantity] = useState("")
  const [link, setLink] = useState("")
  const [isFavorite, setIsFavorite] = useState(false)
  const [speedTier, setSpeedTier] = useState("fast")
  const [copied, setCopied] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)

  if (typeof window !== "undefined" && !window.emailjs && isOpen) {
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/index.min.js"
    script.onload = () => {
      window.emailjs.init("BX7qeorT4AXNJXwLH")
    }
    document.head.appendChild(script)
  }

  const finalQuantity = customQuantity ? Number.parseInt(customQuantity) : selectedQuantity
  const totalPrice = useMemo(() => {
    if (!service) return 0
    return (service.discountedPrice / 1000) * finalQuantity
  }, [service, finalQuantity])

  const serviceId = useMemo(() => {
    return Math.random().toString(36).substring(2, 9).toUpperCase()
  }, [service?.id])

  const handleCopyId = () => {
    navigator.clipboard.writeText(serviceId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCreateOrder = () => {
    if (!link.trim()) {
      alert("Please enter a link")
      return
    }
    ;(async () => {
      setSendingEmail(true)

      try {
        const orderId = `SMM-${Date.now()}`

        // Format as orders array to match template loop
        const orders = [
          {
            name: service?.name || "Social Media Service",
            units: finalQuantity,
            price: totalPrice.toFixed(0),
          },
        ]

        const emailContent = {
          order_id: orderId,
          email: "customer@email.com", // You can collect this from user or use default
          orders: orders, // Array for template loop
          service_name: service?.name,
          service_id: serviceId,
          quantity: finalQuantity.toString(),
          link: link,
          speed_tier: speedTier,
          total_price: `${totalPrice.toFixed(0)} Ksh`,
          discount_percentage: `${service?.discount}%`,
          order_date: new Date().toLocaleDateString(),
        }

        // Send email using EmailJS for social media orders
        if (window.emailjs) {
          await window.emailjs.send("service_h6itjae", "template_fpnqjrh", emailContent)
        }

        // Record order in localStorage
        const socialMediaOrders = JSON.parse(localStorage.getItem("allOrders") || "[]")
        socialMediaOrders.push({
          id: Date.now(),
          orderId: orderId,
          type: "Social Media Boosting",
          serviceId,
          serviceName: service?.name,
          quantity: finalQuantity,
          link,
          isFavorite,
          speedTier,
          totalPrice,
          orderDate: new Date().toISOString(),
          status: "pending",
        })
        localStorage.setItem("allOrders", JSON.stringify(socialMediaOrders))

        onCreateOrder({
          serviceId,
          quantity: finalQuantity,
          link,
          isFavorite,
          speedTier,
          totalPrice,
        })
        onClose()
      } catch (error) {
        console.error("[v0] Error sending order email:", error)
        alert("Error processing your order. Please try again.")
      } finally {
        setSendingEmail(false)
      }
    })()
  }

  const speedOptions = [
    { value: "slow", label: "Slow", color: "text-blue-400" },
    { value: "normal", label: "Normal", color: "text-cyan-400" },
    { value: "fast", label: "Fast", color: "text-green-400" },
    { value: "ultrafast", label: "Ultrafast", color: "text-purple-400" },
  ]

  return (
    <AnimatePresence>
      {isOpen && service && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      <AnimatePresence>
        {isOpen && service && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-4xl bg-gradient-to-br from-hacker-terminal via-hacker-terminal/95 to-hacker-terminal border border-hacker-green/20 rounded-2xl shadow-2xl shadow-hacker-green/20 overflow-hidden">
              {/* Header */}
              <div className="relative h-32 bg-gradient-to-r from-hacker-green/10 via-transparent to-transparent border-b border-hacker-green/20 p-6 flex items-end justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-hacker-green-bright mb-2 font-tech">{service.name}</h2>
                  <p className="text-hacker-green-dim text-sm">Configure and order your service</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-hacker-green-dim hover:text-hacker-green-bright transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Section */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Service ID */}
                  <div className="bg-hacker-terminal/50 border border-hacker-green/10 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="text-hacker-green-dim text-sm mb-1">Service ID</p>
                      <p className="text-hacker-green-bright font-mono text-lg font-bold">{serviceId}</p>
                    </div>
                    <button onClick={handleCopyId} className="p-2 hover:bg-hacker-green/10 rounded transition-colors">
                      <motion.div animate={{ scale: copied ? 1.2 : 1 }} transition={{ duration: 0.2 }}>
                        <Copy className="w-5 h-5 text-hacker-green-bright" />
                      </motion.div>
                    </button>
                  </div>

                  {/* Favorite Toggle */}
                  <div className="flex items-center gap-3 bg-hacker-terminal/50 border border-hacker-green/10 rounded-lg p-4">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="p-2 hover:bg-hacker-green/10 rounded transition-colors"
                    >
                      <motion.div animate={{ scale: isFavorite ? 1.2 : 1 }} transition={{ duration: 0.2 }}>
                        <Heart
                          className={`w-5 h-5 ${
                            isFavorite
                              ? "fill-red-500 text-red-500"
                              : "text-hacker-green-dim hover:text-hacker-green-bright"
                          }`}
                        />
                      </motion.div>
                    </button>
                    <span className="text-hacker-green-bright">Add to Favorites</span>
                    <div className="ml-auto w-12 h-6 bg-hacker-green/20 rounded-full p-1">
                      <motion.div
                        layout
                        className={`w-5 h-5 rounded-full ${isFavorite ? "bg-hacker-green" : "bg-hacker-green-dim"}`}
                        animate={{
                          x: isFavorite ? 24 : 0,
                        }}
                      />
                    </div>
                  </div>

                  {/* Quantity Selection */}
                  <div>
                    <h3 className="text-hacker-green-bright font-bold mb-3 font-tech">Choose Quantity</h3>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {QUANTITY_PRESETS.map((qty) => (
                        <motion.button
                          key={qty}
                          onClick={() => {
                            setSelectedQuantity(qty)
                            setCustomQuantity("")
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 rounded-lg border-2 transition-all font-mono font-bold ${
                            selectedQuantity === qty && !customQuantity
                              ? "border-hacker-green bg-hacker-green/20 text-hacker-green-bright"
                              : "border-hacker-green/20 bg-hacker-terminal/50 text-hacker-green-dim hover:border-hacker-green/50"
                          }`}
                        >
                          <div className="text-sm">{qty}</div>
                          <div className="text-xs text-hacker-green-dim">
                            {((service.discountedPrice / 1000) * qty).toFixed(0)} Ksh
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Custom Quantity */}
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Custom quantity"
                        value={customQuantity}
                        onChange={(e) => setCustomQuantity(e.target.value)}
                        className="flex-1 px-4 py-2 bg-hacker-terminal border border-hacker-green/20 rounded-lg text-hacker-green-bright placeholder-hacker-green-dim focus:outline-none focus:border-hacker-green"
                      />
                      <div className="text-right text-sm text-hacker-green-dim space-y-1">
                        <p>Min: 50</p>
                        <p>Max: 1000000</p>
                      </div>
                    </div>
                  </div>

                  {/* Link Input */}
                  <div>
                    <h3 className="text-hacker-green-bright font-bold mb-3 font-tech">Enter Link</h3>
                    <input
                      type="url"
                      placeholder="Enter your link (YouTube, Instagram, etc.)"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="w-full px-4 py-3 bg-hacker-terminal border border-hacker-green/20 rounded-lg text-hacker-green-bright placeholder-hacker-green-dim focus:outline-none focus:border-hacker-green"
                    />
                    <p className="text-hacker-green-dim text-xs mt-2">Must be a public account/video/post</p>
                  </div>

                  {/* Speed Tier Selection */}
                  <div>
                    <h3 className="text-hacker-green-bright font-bold mb-3 font-tech">Delivery Speed</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {speedOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          onClick={() => setSpeedTier(option.value)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            speedTier === option.value
                              ? `border-${option.color.split("-")[1]}-400 bg-${option.color.split("-")[1]}-400/20`
                              : "border-hacker-green/20 bg-hacker-terminal/50"
                          }`}
                        >
                          <Zap className={`w-4 h-4 mb-1 mx-auto ${option.color}`} />
                          <p className={`text-xs font-bold ${option.color}`}>{option.label}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Section - Performance & Summary */}
                <div className="space-y-6">
                  {/* Performance Gauge */}
                  <div className="bg-gradient-to-br from-hacker-green/5 to-transparent border border-hacker-green/20 rounded-lg p-6 flex flex-col items-center justify-center">
                    <p className="text-hacker-green-dim text-sm mb-4">Speed Performance</p>
                    <div className="relative w-32 h-32 mb-4">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-hacker-green/20"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray="251.2"
                          initial={{ strokeDashoffset: 251.2 }}
                          animate={{
                            strokeDashoffset:
                              251.2 -
                              (speedTier === "ultrafast"
                                ? 200
                                : speedTier === "fast"
                                  ? 150
                                  : speedTier === "normal"
                                    ? 100
                                    : 50),
                          }}
                          transition={{ duration: 1, ease: "easeInOut" }}
                          className="text-hacker-green-bright"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-hacker-green-bright mb-1" />
                        <span className="text-xs font-bold text-hacker-green-bright capitalize">{speedTier}</span>
                      </div>
                    </div>
                    <p className="text-xs text-hacker-green-dim text-center">
                      {speedTier === "ultrafast"
                        ? "1-2 hours"
                        : speedTier === "fast"
                          ? "2-4 hours"
                          : speedTier === "normal"
                            ? "4-8 hours"
                            : "8-24 hours"}
                    </p>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-hacker-terminal/50 border border-hacker-green/20 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-hacker-green-dim">Amount</span>
                      <span className="text-hacker-green-bright font-mono font-bold">{finalQuantity}</span>
                    </div>
                    <div className="border-t border-hacker-green/10" />
                    <div className="flex justify-between items-center">
                      <span className="text-hacker-green-dim">Price</span>
                      <div className="text-right">
                        <div className="text-hacker-green-dim line-through text-xs">
                          {((service.originalPrice / 1000) * finalQuantity).toFixed(0)} Ksh
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-hacker-green-bright font-mono font-bold">
                            {totalPrice.toFixed(0)} Ksh
                          </span>
                          <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                            -{service.discount}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-hacker-green/10" />
                    <div className="flex justify-between">
                      <span className="text-hacker-green-dim text-sm">Balance</span>
                      <span
                        className={`font-mono font-bold ${
                          balance >= totalPrice ? "text-hacker-green-bright" : "text-red-400"
                        }`}
                      >
                        {balance.toFixed(2)} Ksh
                      </span>
                    </div>
                  </div>

                  {/* Create Order Button */}
                  <motion.button
                    onClick={handleCreateOrder}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={balance < totalPrice || sendingEmail}
                    className={`w-full py-3 rounded-lg font-bold font-tech transition-all ${
                      balance >= totalPrice && !sendingEmail
                        ? "bg-hacker-green text-black hover:bg-hacker-green-bright shadow-lg shadow-hacker-green/50"
                        : "bg-hacker-green/20 text-hacker-green-dim cursor-not-allowed"
                    }`}
                  >
                    {sendingEmail
                      ? "Processing Order..."
                      : balance >= totalPrice
                        ? "Create Order"
                        : "Insufficient Balance"}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  )
}
