"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Zap, Heart, Users, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"

interface WebsiteTypeModalProps {
  isOpen: boolean
  onClose: () => void
  type: {
    title: string
    icon: React.ReactNode
    description: string
    features: string[]
    color: string
    use_cases: string[]
    price: number
  } | null
}

export default function WebsiteTypeModal({ isOpen, onClose, type }: WebsiteTypeModalProps) {
  const [quantity, setQuantity] = useState<number>(1)
  const [link, setLink] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const { addToCart } = useCart()

  if (!type) return null

  const totalPrice = type.price * quantity
  const discount = Math.floor(totalPrice * 0.1) // 10% discount
  const finalPrice = totalPrice - discount

  const handleAddToCart = async () => {
    if (!link.trim()) {
      alert("Please enter your website domain")
      return
    }

    if (!email.trim()) {
      alert("Please enter your email address")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address")
      return
    }

    setLoading(true)

    try {
      const cartItem = {
        id: `${type.title}-${Date.now()}`,
        type: type.title,
        price: finalPrice,
        quantity,
        email, // Store email correctly
        domain: link,
        timestamp: Date.now(),
      }

      console.log("[v0] Adding to cart:", cartItem)
      addToCart(cartItem)

      // Show success message
      alert(`${quantity} ${type.title} project(s) added to cart!`)

      // Reset form
      setQuantity(1)
      setLink("")
      setEmail("")
      onClose()
    } catch (error) {
      alert("Error adding to cart. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.3 }}
            className="glow-border rounded-lg bg-hacker-terminal/95 backdrop-blur-md w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-hacker-green/20 bg-hacker-terminal/95 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${type.color} text-white`}>{type.icon}</div>
                <h2 className="text-2xl font-tech font-bold text-hacker-green-bright glow-text">{type.title}</h2>
              </div>
              <button onClick={onClose} className="text-hacker-green-dim hover:text-hacker-green transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Description */}
              <div>
                <p className="text-hacker-green-dim text-lg">{type.description}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-hacker-green-bright font-tech font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Key Features
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {type.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-hacker-green-dim">
                      <span className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${type.color}`}></span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Use Cases */}
              <div>
                <h3 className="text-hacker-green-bright font-tech font-bold mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Perfect For
                </h3>
                <div className="flex flex-wrap gap-2">
                  {type.use_cases.map((useCase, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm font-tech bg-hacker-green/10 text-hacker-green-bright rounded border border-hacker-green-dim/50"
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>

              {/* Order Section */}
              <div className="space-y-6 p-6 bg-hacker-green/5 rounded-lg border border-hacker-green/20">
                {/* Email Input */}
                <div>
                  <label className="block text-hacker-green-bright font-tech font-bold mb-3">Your Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg bg-hacker-terminal/50 border border-hacker-green/50 text-hacker-green-bright placeholder-hacker-green-dim/50 font-tech focus:outline-none focus:border-hacker-green focus:ring-1 focus:ring-hacker-green"
                  />
                </div>

                {/* Quantity Selection */}
                <div>
                  <label className="block text-hacker-green-bright font-tech font-bold mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Number of Projects
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-hacker-green/50 text-hacker-green-bright hover:border-hacker-green hover:bg-hacker-green/10 transition-colors font-tech font-bold"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                      className="flex-1 px-4 py-2 rounded-lg bg-hacker-terminal/50 border border-hacker-green/50 text-hacker-green-bright font-tech text-center focus:outline-none focus:border-hacker-green focus:ring-1 focus:ring-hacker-green"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-hacker-green/50 text-hacker-green-bright hover:border-hacker-green hover:bg-hacker-green/10 transition-colors font-tech font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Link Input */}
                <div>
                  <label className="block text-hacker-green-bright font-tech font-bold mb-3">Your Website Domain</label>
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="e.g., www.mywebsite.com or my-business.ke"
                    className="w-full px-4 py-3 rounded-lg bg-hacker-terminal/50 border border-hacker-green/50 text-hacker-green-bright placeholder-hacker-green-dim/50 font-tech focus:outline-none focus:border-hacker-green focus:ring-1 focus:ring-hacker-green"
                  />
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-2 pt-4 border-t border-hacker-green/20">
                  <div className="flex justify-between text-hacker-green-dim">
                    <span>
                      Base Price (KSH {type.price.toLocaleString()} × {quantity}):
                    </span>
                    <span>KSH {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-hacker-green-dim">
                    <span>Discount (10%):</span>
                    <span className="text-hacker-green">-KSH {discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-tech font-bold text-hacker-green-bright pt-2 border-t border-hacker-green/20">
                    <span>Total Price:</span>
                    <span className="glow-text">KSH {finalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-hacker-green to-emerald-400 text-hacker-terminal font-tech font-bold hover:shadow-lg hover:shadow-hacker-green/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {loading ? "Adding to Cart..." : "Add to Cart"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
