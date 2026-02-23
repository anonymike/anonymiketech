"use client"

import { useState } from "react"
import { TrendingUp, Bell, Plus, Settings } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import MatrixRain from "@/components/MatrixRain"
import ServiceHero from "@/components/ServiceHero"
import ContactButtons from "@/components/ContactButtons"
import MobileMenu from "@/components/MobileMenu"
import BackToTop from "@/components/BackToTop"
import SocialMediaNetworkList, { type NetworkItem } from "@/components/SocialMediaNetworkList"
import YouTubeServices from "@/components/YouTubeServices"
import DynamicSocialServices from "@/components/DynamicSocialServices"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCurrentYear } from "@/utils/getCurrentYear"
import ChatbaseEmbed from "@/components/ChatbaseEmbed"

export default function SocialMediaBoosting() {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkItem | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [balance, setBalance] = useState(0.09)
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false)

  const allNetworks: NetworkItem[] = [
    { id: "instagram", name: "Instagram", icon: "📷", category: "Popular" },
    { id: "youtube", name: "YouTube", icon: "▶️", category: "Popular" },
    { id: "whatsapp", name: "WhatsApp", icon: "💬", category: "Popular" },
    { id: "twitter", name: "X - Twitter", icon: "𝕏", category: "Popular" },
    { id: "telegram-classic", name: "Telegram Classic", icon: "📲", category: "Popular" },
    { id: "telegram-premium", name: "Telegram Premium", icon: "⭐", category: "Popular" },
    { id: "linkedin", name: "LinkedIn", icon: "💼", category: "Popular" },
    { id: "spotify", name: "Spotify", icon: "🎵", category: "Popular" },
    { id: "quora", name: "Quora", icon: "❓", category: "All Platforms" },
    { id: "pinterest", name: "Pinterest", icon: "📌", category: "All Platforms" },
    { id: "chatgpt", name: "ChatGPT", icon: "🤖", category: "Free Services" },
    { id: "canva", name: "Canva", icon: "🎨", category: "Free Services" },
    { id: "google-docs", name: "Google Docs Votes", icon: "📄", category: "Free Services" },
    { id: "tiktok", name: "TikTok", icon: "🎵", category: "Free Services" },
    { id: "facebook", name: "Facebook", icon: "f", category: "Free Services" },
  ]

  const filteredNetworks = allNetworks.filter((network) =>
    network.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddFunds = () => {
    setBalance(0.0)
    window.open("https://anonymiketech-checkouts.vercel.app/", "_blank")
  }

  const handleOrderNow = () => {
    setIsOrderConfirmed(true)
    setBalance((prevBalance) => prevBalance + 100)
    setTimeout(() => setIsOrderConfirmed(false), 2000)
  }

  const handleNetworkSelect = (network: NetworkItem) => {
    setSelectedNetwork(network)
  }

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-green relative">
      <ChatbaseEmbed />
      <MobileMenu />
      <BackToTop />
      <MatrixRain />

      <div className="relative z-10">
        {/* Admin Access Link */}
        <div className="fixed top-4 right-4 z-50">
          <Link href="/admin?tab=services">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-hacker-green/20 border border-hacker-green text-hacker-green-bright hover:bg-hacker-green/30 transition-all text-sm"
              title="Admin Panel - Services Management"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </motion.button>
          </Link>
        </div>

        <ServiceHero
          title="SOCIAL MEDIA BOOSTING"
          subtitle="// Select Your Network"
          description="Choose your platform and boost your social media presence with our tailored growth packages"
          icon={<TrendingUp />}
          backgroundPattern="#"
        />

        {/* Network Selection Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Header Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 p-4 rounded-lg bg-hacker-terminal/30 border border-hacker-green/20"
            >
              <div className="flex-1 w-full md:w-auto">
                <Input
                  placeholder="Search service or order id"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-hacker-terminal border-hacker-green/30 text-hacker-green-bright placeholder:text-hacker-green-dim"
                />
              </div>

              <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                <Button variant="ghost" size="sm" className="text-hacker-green-dim hover:text-hacker-green-bright">
                  <Bell className="w-5 h-5" />
                </Button>

                <div className="flex items-center gap-2 px-3 py-2 bg-hacker-terminal border border-hacker-green/30 rounded-lg">
                  <span className="text-hacker-green-bright font-semibold">{balance.toFixed(2)} Ksh</span>
                </div>

                <Button
                  onClick={handleAddFunds}
                  size="sm"
                  className="bg-hacker-green text-hacker-bg hover:bg-hacker-green/90"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add funds
                </Button>

                <div className="flex items-center gap-2 px-3 py-2 bg-hacker-green/20 border border-hacker-green rounded-full">
                  <span className="text-hacker-green-bright text-xs md:text-sm font-semibold">Discount</span>
                  <span className="bg-hacker-green text-hacker-bg px-2 py-1 rounded-full text-xs font-bold">3%</span>
                </div>
              </div>
            </motion.div>

            {/* Network List or Services */}
            {selectedNetwork ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {selectedNetwork.id === "youtube" ? (
                  <YouTubeServices onBack={() => setSelectedNetwork(null)} onOrderNow={handleOrderNow} />
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedNetwork(null)}
                      className="mb-6 text-hacker-green-dim hover:text-hacker-green-bright"
                    >
                      ← Back to Networks
                    </Button>

                    <div className="mb-8">
                      <h2 className="text-3xl md:text-4xl font-tech font-bold text-hacker-green-bright mb-2 glow-text">
                        {selectedNetwork.name} Packages
                      </h2>
                      <p className="text-hacker-green-dim">Choose the perfect plan for your growth</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        {
                          name: "Starter Package",
                          price: "KSH 5,000",
                          period: "month",
                          features: ["3 Posts Per Week", "Basic Graphics", "Single Platform", "Monthly Report"],
                        },
                        {
                          name: "Growth Package",
                          price: "KSH 12,000",
                          period: "month",
                          popular: true,
                          features: [
                            "Daily Posts",
                            "Professional Graphics",
                            "Multi-Platform (3-4)",
                            "Weekly Reports",
                            "Video Content",
                          ],
                        },
                        {
                          name: "Premium Package",
                          price: "KSH 25,000",
                          period: "month",
                          features: [
                            "Unlimited Posts",
                            "Custom Video Content",
                            "All Major Platforms",
                            "Real-time Analytics",
                            "Dedicated Account Manager",
                          ],
                        },
                      ].map((pkg, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className={`relative rounded-lg border p-8 transition-all duration-300 ${
                            pkg.popular
                              ? "bg-hacker-terminal border-hacker-green-bright shadow-lg shadow-hacker-green/50"
                              : "bg-hacker-terminal/50 border-hacker-green/30 hover:border-hacker-green/60"
                          }`}
                        >
                          {pkg.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-hacker-green text-hacker-bg px-4 py-1 rounded-full text-sm font-bold">
                              Most Popular
                            </div>
                          )}

                          <h3 className="text-xl font-bold text-hacker-green-bright mb-2">{pkg.name}</h3>
                          <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-3xl md:text-4xl font-tech font-bold text-hacker-green">
                              {pkg.price}
                            </span>
                            <span className="text-hacker-green-dim">per {pkg.period}</span>
                          </div>

                          <ul className="space-y-3 mb-8">
                            {pkg.features.map((feature, fIndex) => (
                              <li key={fIndex} className="flex items-center gap-3 text-hacker-green-bright">
                                <span className="text-hacker-green">◆</span>
                                {feature}
                              </li>
                            ))}
                          </ul>

                          <Button
                            onClick={handleOrderNow}
                            className="w-full bg-hacker-green text-hacker-bg hover:bg-hacker-green/90 font-semibold"
                          >
                            Order Now
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <DynamicSocialServices />
              </motion.div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="py-16"
        >
          <div className="container mx-auto px-4">
            <div className="glow-border rounded-lg p-12 bg-hacker-terminal/30 backdrop-blur-sm text-center">
              <h3 className="text-3xl md:text-4xl font-tech font-bold text-hacker-green-bright mb-6 glow-text">
                Need Help Choosing?
              </h3>
              <p className="text-xl text-hacker-green-dim mb-8 max-w-2xl mx-auto">
                Our specialists can help you find the perfect package for your social media goals. Get in touch today!
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
      </div>
    </div>
  )
}
