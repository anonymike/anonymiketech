"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Send, Mail } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import MatrixRain from "@/components/MatrixRain"
import MobileMenu from "@/components/MobileMenu"
import BackToTop from "@/components/BackToTop"

declare global {
  interface Window {
    emailjs: any
  }
}

function getCurrentYear() {
  return new Date().getFullYear()
}

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCart()
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [emailInitialized, setEmailInitialized] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && !window.emailjs) {
      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"
      script.async = true
      script.onload = () => {
        window.emailjs.init("BX7qeorT4AXNJXwLH")
        setEmailInitialized(true)
        console.log("[v0] EmailJS initialized successfully")
      }
      script.onerror = () => {
        console.error("[v0] Failed to load EmailJS script")
        alert("Failed to load email service. Please refresh the page.")
      }
      document.head.appendChild(script)
    } else if (window.emailjs) {
      // EmailJS already loaded
      setEmailInitialized(true)
      console.log("[v0] EmailJS already initialized")
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!emailInitialized || !window.emailjs) {
      alert("Email service is still loading. Please wait a moment and try again.")
      return
    }

    setLoading(true)

    try {
      const orderId = `WEB-${Date.now()}`

      const customerEmail = items[0]?.email || ""

      if (!customerEmail) {
        alert("Customer email is missing. Please add items to cart again.")
        setLoading(false)
        return
      }

      // Format orders array to match EmailJS template structure
      const orders = items.map((item) => ({
        name: item.type,
        units: item.quantity,
        price: item.price.toLocaleString(),
      }))

      const customerEmailData = {
        order_id: orderId,
        email: customerEmail,
        orders: orders,
        customer_name: formData.fullName,
        customer_phone: formData.phone,
        total_amount: getTotalPrice().toLocaleString(),
        customer_message: formData.message || "No additional message",
        order_date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      }

      const adminEmailData = {
        order_id: orderId,
        email: customerEmail, // Keep customer email for Reply To field
        orders: orders,
        customer_name: formData.fullName,
        customer_phone: formData.phone,
        total_amount: getTotalPrice().toLocaleString(),
        customer_message: formData.message || "No additional message",
        order_date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      }

      console.log("[v0] Sending emails...")
      console.log("[v0] Customer email:", customerEmail)
      console.log("[v0] Customer data:", customerEmailData)
      console.log("[v0] Admin data:", adminEmailData)

      try {
        const customerResponse = await window.emailjs.send(
          "service_0cpfipj", // Service ID
          "template_yrrm59w", // Auto-Reply(web dev) template - sends to {{email}}
          customerEmailData,
        )
        console.log("[v0] Customer auto-reply sent successfully:", customerResponse)
      } catch (error) {
        console.error("[v0] Error sending customer auto-reply:", error)
        alert("Warning: Failed to send confirmation email to customer.")
      }

      try {
        const adminResponse = await window.emailjs.send(
          "service_0cpfipj", // Service ID
          "template_ekdmpwg", // Website Confirmation template - sends to anonymiketech@gmail.com
          adminEmailData,
        )
        console.log("[v0] Admin notification sent successfully:", adminResponse)
      } catch (error) {
        console.error("[v0] Error sending admin notification:", error)
        alert("Warning: Failed to send order notification to admin.")
      }

      // Record order in localStorage
      const allOrders = JSON.parse(localStorage.getItem("allOrders") || "[]")
      allOrders.push({
        id: Date.now(),
        orderId: orderId,
        type: "Website Development",
        items,
        totalPrice: getTotalPrice(),
        customerDetails: formData,
        orderDate: new Date().toISOString(),
        status: "pending",
      })
      localStorage.setItem("allOrders", JSON.stringify(allOrders))

      setSubmitted(true)
      clearCart()

      // Redirect after 3 seconds
      setTimeout(() => {
        window.location.href = "/web-development"
      }, 3000)
    } catch (error) {
      console.error("Error processing order:", error)
      alert("Error processing your order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && !submitted) {
    return (
      <div className="min-h-screen bg-hacker-bg text-hacker-green flex items-center justify-center">
        <MatrixRain />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-tech font-bold text-hacker-green-bright mb-4 glow-text">Cart is Empty</h1>
          <Link href="/web-development">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-hacker-green to-emerald-400 text-hacker-terminal font-tech font-bold"
            >
              Back to Services
            </motion.button>
          </Link>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-hacker-bg text-hacker-green flex items-center justify-center">
        <MatrixRain />
        <div className="relative z-10 text-center p-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl mb-4">
            ✓
          </motion.div>
          <h1 className="text-4xl font-tech font-bold text-hacker-green-bright mb-4 glow-text">Order Submitted!</h1>
          <p className="text-hacker-green-dim text-xl mb-4">We've sent a confirmation email. Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-green relative">
      <MobileMenu />
      <BackToTop />
      <MatrixRain />

      <div className="relative z-10 container mx-auto px-4 py-16">
        <Link href="/web-development">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-hacker-green-bright hover:text-hacker-green transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Services
          </motion.button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glow-border rounded-lg p-6 bg-hacker-terminal/50 backdrop-blur-sm sticky top-8"
            >
              <h2 className="text-2xl font-tech font-bold text-hacker-green-bright mb-6 glow-text">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="border-b border-hacker-green/20 pb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-tech font-bold text-hacker-green-bright">{item.type}</span>
                      <span className="text-hacker-green-dim">x{item.quantity}</span>
                    </div>
                    <p className="text-sm text-hacker-green-dim mb-2">{item.domain}</p>
                    <div className="flex justify-between text-hacker-green-bright">
                      <span>KSH {item.price.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-hacker-green/20">
                <div className="flex justify-between text-hacker-green-dim">
                  <span>Subtotal:</span>
                  <span>KSH {getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-hacker-green-dim">
                  <span>Tax:</span>
                  <span>KSH 0</span>
                </div>
                <div className="flex justify-between text-lg font-tech font-bold text-hacker-green-bright pt-2 border-t border-hacker-green/20">
                  <span>Total:</span>
                  <span className="glow-text">KSH {getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glow-border rounded-lg p-8 bg-hacker-terminal/50 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-tech font-bold text-hacker-green-bright mb-8 flex items-center gap-2 glow-text">
                <Mail className="w-6 h-6" />
                Checkout Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-hacker-green-bright font-tech font-bold mb-3">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Your Full Name"
                    className="w-full px-4 py-3 rounded-lg bg-hacker-terminal/50 border border-hacker-green/50 text-hacker-green-bright placeholder-hacker-green-dim/50 font-tech focus:outline-none focus:border-hacker-green focus:ring-1 focus:ring-hacker-green"
                  />
                </div>

                <div>
                  <label className="block text-hacker-green-bright font-tech font-bold mb-3">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+254 XXX XXX XXX"
                    className="w-full px-4 py-3 rounded-lg bg-hacker-terminal/50 border border-hacker-green/50 text-hacker-green-bright placeholder-hacker-green-dim/50 font-tech focus:outline-none focus:border-hacker-green focus:ring-1 focus:ring-hacker-green"
                  />
                </div>

                <div>
                  <label className="block text-hacker-green-bright font-tech font-bold mb-3">Additional Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Any special requirements or messages for us?"
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-hacker-terminal/50 border border-hacker-green/50 text-hacker-green-bright placeholder-hacker-green-dim/50 font-tech focus:outline-none focus:border-hacker-green focus:ring-1 focus:ring-hacker-green resize-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || !emailInitialized}
                  className="w-full py-4 rounded-lg bg-gradient-to-r from-hacker-green to-emerald-400 text-hacker-terminal font-tech font-bold hover:shadow-lg hover:shadow-hacker-green/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                >
                  <Send className="w-5 h-5" />
                  {!emailInitialized ? "Loading Email Service..." : loading ? "Processing Order..." : "Complete Order"}
                </motion.button>
              </form>

              <p className="text-center text-hacker-green-dim text-sm mt-8">
                By submitting this form, we will send you an order confirmation email with payment instructions.
              </p>
            </motion.div>
          </div>
        </div>

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
      </div>
    </div>
  )
}
