"use client"

import { useState } from "react"
import { Server, Check, Globe, Zap, Shield, HardDrive } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

interface VPSPlan {
  id: string
  tier: string
  name: string
  description: string
  basePrice: number
  cpu: number
  ram: number
  storage: number
  bandwidth: string
  snapshots: number
  backups: number
  ipVersion: string
  features: string[]
}

const VPS_PLANS: VPSPlan[] = [
  {
    id: "s-plan",
    tier: "S",
    name: "Starter",
    description: "Perfect for small projects and development",
    basePrice: 7.5,
    cpu: 3,
    ram: 6,
    storage: 50,
    bandwidth: "Unlimited",
    snapshots: 1,
    backups: 1,
    ipVersion: "IPv4 + IPv6",
    features: ["Full root access", "SSD Storage", "DDoS Protection", "24/7 Support"],
  },
  {
    id: "m-plan",
    tier: "M",
    name: "Professional",
    description: "Great for growing applications",
    basePrice: 11.4,
    cpu: 6,
    ram: 16,
    storage: 100,
    bandwidth: "Unlimited",
    snapshots: 1,
    backups: 1,
    ipVersion: "IPv4 + IPv6",
    features: ["Full root access", "SSD Storage", "DDoS Protection", "24/7 Support", "Backups Included"],
    popular: true,
  },
  {
    id: "l-plan",
    tier: "L",
    name: "Business",
    description: "For established businesses and teams",
    basePrice: 19.6,
    cpu: 8,
    ram: 32,
    storage: 200,
    bandwidth: "Unlimited",
    snapshots: 2,
    backups: 2,
    ipVersion: "IPv4 + IPv6",
    features: ["Full root access", "SSD Storage", "DDoS Protection", "24/7 VIP Support", "Backups Included", "Priority Support"],
  },
  {
    id: "xl-plan",
    tier: "XL",
    name: "Enterprise",
    description: "Ultimate performance and reliability",
    basePrice: 36,
    cpu: 12,
    ram: 64,
    storage: 400,
    bandwidth: "Unlimited",
    snapshots: 2,
    backups: 2,
    ipVersion: "IPv4 + IPv6",
    features: ["Full root access", "SSD Storage", "DDoS Protection", "24/7 Premium Support", "Backups Included", "Dedicated Support", "Custom Solutions"],
  },
]

export default function VPSPage() {
  const [currency, setCurrency] = useState<"USD" | "KSH">("USD")
  const exchangeRate = 135

  const getPrice = (basePrice: number) => {
    const adjustedPrice = basePrice + 2 // Add $2 profit margin
    if (currency === "KSH") {
      return Math.round(adjustedPrice * exchangeRate)
    }
    return adjustedPrice
  }

  const currencySymbol = currency === "USD" ? "$" : "KSH "

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="relative z-10 pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex flex-row-reverse md:flex-row items-center justify-center gap-2 sm:gap-3 mb-4">
              <Server className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">ANONYMIKETECH VPS</h1>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-6">Cloud hosting built for speed, flexibility, and reliability</p>

            {/* Currency Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setCurrency("USD")}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  currency === "USD"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                USD
              </button>
              <button
                onClick={() => setCurrency("KSH")}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  currency === "KSH"
                    ? "bg-green-600 text-white shadow-lg shadow-green-500/50"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                KSH
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="relative z-10 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VPS_PLANS.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative rounded-2xl overflow-hidden group ${
                  plan.popular ? "lg:scale-105 ring-2 ring-blue-400" : ""
                }`}
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 ${
                    plan.popular
                      ? "bg-gradient-to-br from-blue-600/20 via-slate-800 to-slate-900"
                      : "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
                  }`}
                />

                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                      BEST SELLER
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-6 pt-4">
                    <div className="text-5xl font-bold text-blue-400 mb-2">{plan.tier}</div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-slate-400 text-sm">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold">{currencySymbol}</span>
                      <span className="text-5xl font-bold">{getPrice(plan.basePrice)}</span>
                      {currency === "USD" && <span className="text-slate-400">/month</span>}
                    </div>
                    <p className="text-slate-400 text-sm">From ${plan.basePrice.toFixed(2)}/month</p>
                  </div>

                  {/* Specs */}
                  <div className="space-y-3 mb-8 flex-1">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span>{plan.cpu} CPU Cores</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <HardDrive className="w-4 h-4 text-purple-400" />
                      <span>{plan.ram} GB RAM</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span>{plan.storage} GB NVMe</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span>{plan.bandwidth} Bandwidth</span>
                    </div>
                    <div className="text-sm text-slate-400 pt-2 border-t border-slate-700">
                      <p>{plan.snapshots} Snapshot • {plan.backups} Backup</p>
                      <p>{plan.ipVersion}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-300 text-sm">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/vps/checkout?plan=${plan.id}&currency=${currency}`}
                    className={`w-full py-3 rounded-lg font-bold text-center transition-all ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30"
                        : "bg-slate-700 hover:bg-slate-600 text-white"
                    }`}
                  >
                    Get It Now
                  </Link>
                </div>

                {/* Border glow effect */}
                <div
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity ${
                    plan.popular
                      ? "shadow-[inset_0_0_20px_rgba(59,130,246,0.3)]"
                      : "shadow-[inset_0_0_20px_rgba(148,163,184,0.1)]"
                  }`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20 px-4 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose ANONYMIKETECH VPS?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast Performance",
                description: "NVMe SSD storage and fast processors for maximum speed",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Reliable Infrastructure",
                description: "99.9% uptime guarantee with redundant systems",
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Global Locations",
                description: "Choose from multiple data center locations worldwide",
              },
              {
                icon: <Server className="w-8 h-8" />,
                title: "Full Root Access",
                description: "Complete control over your VPS configuration",
              },
              {
                icon: <Check className="w-8 h-8" />,
                title: "Easy Scaling",
                description: "Upgrade resources without downtime",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "DDoS Protection",
                description: "Advanced security against cyber attacks",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-700/50 rounded-xl p-8 hover:bg-slate-700 transition-colors"
              >
                <div className="text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="relative z-10 py-16 px-4 text-center">
        <p className="text-slate-400 text-sm">
          Questions? Contact us at <span className="text-blue-400">anonymiketech@gmail.com</span>
        </p>
      </div>
    </div>
  )
}
