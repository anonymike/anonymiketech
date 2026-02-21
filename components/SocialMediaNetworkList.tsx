"use client"

import { useState } from "react"
import { ChevronRight, Instagram, Youtube, MessageCircle, Twitter, Send, Linkedin, Music, HelpCircle, Paintbrush as Pinterest, Bot, Palette, FileText, Music2, Facebook } from 'lucide-react'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export interface NetworkItem {
  id: string
  name: string
  icon: string
  category?: string
}

interface SocialMediaNetworkListProps {
  networks: NetworkItem[]
  onNetworkSelect: (network: NetworkItem) => void
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  Instagram: <Instagram className="w-8 h-8" style={{ color: "#E4405F" }} />,
  YouTube: <Youtube className="w-8 h-8" style={{ color: "#FF0000" }} />,
  WhatsApp: <MessageCircle className="w-8 h-8" style={{ color: "#25D366" }} />,
  Twitter: <Twitter className="w-8 h-8" style={{ color: "#000000" }} />,
  Telegram: <Send className="w-8 h-8" style={{ color: "#0088cc" }} />,
  LinkedIn: <Linkedin className="w-8 h-8" style={{ color: "#0A66C2" }} />,
  Spotify: <Music className="w-8 h-8" style={{ color: "#1DB954" }} />,
  Quora: <HelpCircle className="w-8 h-8" style={{ color: "#B92B27" }} />,
  Pinterest: <Pinterest className="w-8 h-8" style={{ color: "#E60023" }} />,
  ChatGPT: <Bot className="w-8 h-8" style={{ color: "#00A67E" }} />,
  Canva: <Palette className="w-8 h-8" style={{ color: "#00C4CC" }} />,
  GoogleDocs: <FileText className="w-8 h-8" style={{ color: "#4285F4" }} />,
  TikTok: <Music2 className="w-8 h-8" style={{ color: "#000000" }} />,
  Facebook: <Facebook className="w-8 h-8" style={{ color: "#1877F2" }} />,
}

export default function SocialMediaNetworkList({
  networks,
  onNetworkSelect,
}: SocialMediaNetworkListProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null)

  const handleNetworkClick = (network: NetworkItem) => {
    setSelectedNetwork(network.id)
    onNetworkSelect(network)
  }

  const groupedNetworks = networks.reduce(
    (acc, network) => {
      const category = network.category || "All Networks"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(network)
      return acc
    },
    {} as Record<string, NetworkItem[]>
  )

  return (
    <div className="space-y-8">
      {Object.entries(groupedNetworks).map(([category, items], categoryIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
        >
          {category !== "All Networks" && (
            <h3 className="text-lg font-semibold text-hacker-green-bright mb-4 flex items-center gap-2">
              <span className="text-2xl">
                {category === "Favorite" ? "⭐" : category === "Free Services" ? "😊" : "📱"}
              </span>
              {category}
            </h3>
          )}

          <div className="space-y-3">
            {items.map((network, index) => (
              <motion.button
                key={network.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 + index * 0.05 }}
                onClick={() => handleNetworkClick(network)}
                className="w-full"
              >
                <div
                  className={`flex items-center justify-between p-5 rounded-lg border transition-all duration-300 ${
                    selectedNetwork === network.id
                      ? "bg-hacker-terminal border-hacker-green-bright shadow-lg shadow-hacker-green/50"
                      : "border-hacker-green/20 hover:border-hacker-green/50 hover:bg-hacker-terminal/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10">
                      {PLATFORM_ICONS[network.name] || <Music className="w-8 h-8" />}
                    </div>
                    <span className="text-lg font-semibold text-hacker-green-bright">
                      {network.name}
                    </span>
                  </div>
                  <ChevronRight className="w-6 h-6 text-hacker-green-bright" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
