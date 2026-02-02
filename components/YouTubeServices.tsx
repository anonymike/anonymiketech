"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Youtube } from "lucide-react"
import ServiceOrderModal from "@/components/ServiceOrderModal"

interface YouTubeService {
  id: string
  name: string
  originalPrice: number
  discountedPrice: number
  discount: number
  tags?: string[]
  status: "available" | "coming-soon"
}

const YOUTUBE_SERVICES: YouTubeService[] = [
  // YouTube Views [Ultrafast]
  {
    id: "yt-views-ultrafast-1m",
    name: "YouTube Native Ads Views [Min 1M] | Non Drop | Lifetime",
    originalPrice: 139,
    discountedPrice: 135,
    discount: 3,
    status: "available",
  },
  {
    id: "yt-views-ultrafast-500k",
    name: "YouTube Native Ads Views [Min 500k] | Non Drop | Lifetime",
    originalPrice: 141,
    discountedPrice: 137,
    discount: 3,
    status: "available",
  },
  {
    id: "yt-views-ultrafast-200k",
    name: "YouTube Native Ads Views [Min 200k] | Non Drop | Lifetime",
    originalPrice: 145,
    discountedPrice: 141,
    discount: 3,
    status: "available",
  },
  {
    id: "yt-views-ultrafast-100k",
    name: "YouTube Native Ads Views [Min 100k] | Non Drop | Lifetime",
    originalPrice: 156,
    discountedPrice: 152,
    discount: 3,
    status: "available",
  },
  {
    id: "yt-views-ultrafast-40k",
    name: "YouTube Native Ads Views [Min 40k] | Non Drop | Lifetime",
    originalPrice: 162,
    discountedPrice: 157,
    discount: 3,
    status: "available",
  },

  // YouTube : Short Service
  {
    id: "yt-shorts-view",
    name: "Youtube Shorts View - Lifetime",
    originalPrice: 207,
    discountedPrice: 288,
    discount: 3,
    status: "available",
  },
  {
    id: "yt-shorts-likes",
    name: "Youtube Shorts Likes - Lifetime",
    originalPrice: 234,
    discountedPrice: 227,
    discount: 3,
    status: "available",
  },

  // YouTube : Guaranteed Subscribers
  {
    id: "yt-subs-guaranteed-30",
    name: "YouTube Subscribers | HQ Accounts | 30 Days",
    originalPrice: 1810,
    discountedPrice: 1756,
    discount: 3,
    status: "available",
  },
  {
    id: "yt-subs-guaranteed-60",
    name: "YouTube Subscribers | HQ Accounts | 60 Days",
    originalPrice: 2425,
    discountedPrice: 2352,
    discount: 3,
    status: "available",
  },
  {
    id: "yt-subs-guaranteed-90",
    name: "YouTube Subscribers | HQ Accounts | 90 Days",
    originalPrice: 2586,
    discountedPrice: 2509,
    discount: 3,
    status: "available",
  },
  {
    id: "yt-subs-guaranteed-365",
    name: "YouTube Subscribers | HQ Accounts | 365 Days",
    originalPrice: 2748,
    discountedPrice: 2665,
    discount: 3,
    status: "available",
  },
  {
    id: "yt-subs-guaranteed-lifetime",
    name: "YouTube Subscribers | HQ Accounts | Drop 0% | Cancel Enable | Lifetime",
    originalPrice: 3491,
    discountedPrice: 3387,
    discount: 3,
    status: "available",
  },

  // YouTube Likes - Main Provider
  {
    id: "yt-likes-provider-norefill",
    name: "YouTube Likes | HQ | Non Drop | No Refill",
    originalPrice: 27.2,
    discountedPrice: 26.3,
    discount: 3,
    tags: ["⭐"],
    status: "available",
  },
  {
    id: "yt-likes-provider-30",
    name: "YouTube Likes | HQ | Non Drop | 30 Days",
    originalPrice: 29.0,
    discountedPrice: 29,
    discount: 3,
    tags: ["⭐"],
    status: "available",
  },
  {
    id: "yt-likes-provider-90",
    name: "YouTube Likes | HQ | Non Drop | 90 Days",
    originalPrice: 33,
    discountedPrice: 32,
    discount: 3,
    tags: ["⭐"],
    status: "available",
  },
  {
    id: "yt-likes-provider-365",
    name: "YouTube Likes | HQ | Non Drop | 365 Days",
    originalPrice: 39,
    discountedPrice: 37,
    discount: 3,
    tags: ["⭐"],
    status: "available",
  },

  // YouTube Subscribers [Best]
  {
    id: "yt-subs-best-norefill",
    name: "YouTube Subscribers | HQ Accounts | No Refill",
    originalPrice: 2457,
    discountedPrice: 2383,
    discount: 3,
    tags: ["NEW"],
    status: "available",
  },
  {
    id: "yt-subs-best-drop5-30",
    name: "YouTube Subscribers | HQ Accounts | Drop 5% | 30 Days",
    originalPrice: 2845,
    discountedPrice: 2760,
    discount: 3,
    tags: ["NEW"],
    status: "available",
  },
  {
    id: "yt-subs-best-drop0-365",
    name: "YouTube Subscribers | HQ Accounts | Drop 0% | 365 Days",
    originalPrice: 4655,
    discountedPrice: 4516,
    discount: 3,
    tags: ["NEW"],
    status: "available",
  },
  {
    id: "yt-subs-best-drop0-lifetime",
    name: "YouTube Subscribers | HQ Accounts | Drop 0% | Lifetime",
    originalPrice: 6207,
    discountedPrice: 6021,
    discount: 3,
    tags: ["NEW"],
    status: "available",
  },

  // Youtube : Views [Best Quality]
  {
    id: "yt-views-quality-watchhours",
    name: "YouTube Views + Watch Hours | HQ | %100 Real Views | Non Drop | Lifetime",
    originalPrice: 258,
    discountedPrice: 250,
    discount: 3,
    status: "available",
  },
  {
    id: "yt-views-quality-100real",
    name: "YouTube Views | HQ | %100 Real Views | Non Drop | Lifetime",
    originalPrice: 290,
    discountedPrice: 290,
    discount: 3,
    status: "available",
  },

  // Coming Soon Services
  {
    id: "yt-likes-norefill",
    name: "YouTube : Likes | No Refill",
    originalPrice: 0,
    discountedPrice: 0,
    discount: 0,
    status: "coming-soon",
  },
  {
    id: "yt-live-views",
    name: "YouTube : Live Views [Premium]",
    originalPrice: 0,
    discountedPrice: 0,
    discount: 0,
    status: "coming-soon",
  },
  {
    id: "yt-views-googleads",
    name: "YouTube : Views [Google Ads]",
    originalPrice: 0,
    discountedPrice: 0,
    discount: 0,
    status: "coming-soon",
  },
  {
    id: "yt-comments",
    name: "YouTube : Comments",
    originalPrice: 0,
    discountedPrice: 0,
    discount: 0,
    status: "coming-soon",
  },
  {
    id: "yt-views-realbulk",
    name: "YouTube : Views [Real Bulk]",
    originalPrice: 0,
    discountedPrice: 0,
    discount: 0,
    status: "coming-soon",
  },
  {
    id: "yt-watchtime",
    name: "YouTube : Watchtime",
    originalPrice: 0,
    discountedPrice: 0,
    discount: 0,
    status: "coming-soon",
  },
]

interface YouTubeServicesProps {
  onBack: () => void
  onOrderNow: () => void
}

export default function YouTubeServices({ onBack, onOrderNow }: YouTubeServicesProps) {
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [comingSoonTitle, setComingSoonTitle] = useState("")
  const [selectedService, setSelectedService] = useState<YouTubeService | null>(null)
  const [balance, setBalance] = useState(0)

  const handleComingSoon = (serviceName: string) => {
    setComingSoonTitle(serviceName)
    setShowComingSoon(true)
    setTimeout(() => setShowComingSoon(false), 3000)
  }

  const handleServiceClick = (service: YouTubeService) => {
    if (service.status === "available") {
      setSelectedService(service)
    }
  }

  const handleCreateOrder = (orderData: any) => {
    console.log("[v0] Order created:", orderData)
    // Update balance after order
    setBalance((prev) => prev - orderData.totalPrice)
    onOrderNow()
  }

  return (
    <div>
      {/* Coming Soon Alert */}
      <AnimatePresence>
        {showComingSoon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-hacker-green/20 to-hacker-green/10 border-2 border-hacker-green backdrop-blur-md rounded-lg px-8 py-4 shadow-2xl shadow-hacker-green/50">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="text-hacker-green text-2xl"
                >
                  ⏰
                </motion.div>
                <div>
                  <p className="text-hacker-green-bright font-bold text-lg">COMING SOON</p>
                  <p className="text-hacker-green-dim text-sm">{comingSoonTitle}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-6 text-hacker-green-dim hover:text-hacker-green-bright">
        ← Back to Networks
      </Button>

      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-tech font-bold text-hacker-green-bright mb-2 glow-text">
          YouTube Services
        </h2>
        <p className="text-hacker-green-dim">Choose your preferred YouTube growth service</p>
      </div>

      {/* Services Grid */}
      <div className="space-y-4">
        {YOUTUBE_SERVICES.map((service, index) => (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            onClick={() => {
              if (service.status === "coming-soon") {
                handleComingSoon(service.name)
              } else {
                handleServiceClick(service)
              }
            }}
            disabled={service.status === "coming-soon"}
            className="w-full"
          >
            <div
              className={`flex items-center justify-between p-5 rounded-lg border transition-all duration-300 ${
                service.status === "coming-soon"
                  ? "opacity-60 cursor-not-allowed border-hacker-green/10 bg-hacker-terminal/20"
                  : "border-hacker-green/20 hover:border-hacker-green/50 hover:bg-hacker-terminal/50 cursor-pointer"
              }`}
            >
              <div className="flex items-center gap-4">
                <Youtube className="w-6 h-6 text-red-500 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-hacker-green-bright font-semibold">{service.name}</p>
                  {service.tags && (
                    <div className="flex gap-2 mt-1">
                      {service.tags.map((tag) => (
                        <span key={tag} className="text-xs text-hacker-green-dim font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {service.status === "available" && (
                  <>
                    <div className="text-right">
                      <p className="text-hacker-green-dim line-through text-sm">{service.originalPrice} Ksh</p>
                      <div className="flex items-center gap-2">
                        <span className="text-hacker-green-bright font-bold">{service.discountedPrice} Ksh</span>
                        <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                          -{service.discount}%
                        </span>
                      </div>
                    </div>
                    <motion.div whileHover={{ x: 5 }} className="text-hacker-green-bright text-xl">
                      →
                    </motion.div>
                  </>
                )}

                {service.status === "coming-soon" && (
                  <div className="text-center">
                    <motion.p
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="text-hacker-green-bright font-bold text-sm"
                    >
                      COMING SOON
                    </motion.p>
                  </div>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* ServiceOrderModal component */}
      <ServiceOrderModal
        isOpen={!!selectedService}
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onCreateOrder={handleCreateOrder}
        balance={balance}
      />
    </div>
  )
}
