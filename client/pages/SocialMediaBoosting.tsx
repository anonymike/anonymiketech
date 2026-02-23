"use client"

import {
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Camera,
  Target,
  Heart,
  Eye,
  Star,
  Zap,
  Activity,
  TrendingDown,
  Crown,
  Sparkles,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import MatrixRain from "../components/MatrixRain"
import ServiceHero from "../components/ServiceHero"
import MobileMenu from "../components/MobileMenu"
import BackToTop from "../components/BackToTop"
import SocialMediaOrderForm from "../components/SocialMediaOrderForm"

function getCurrentYear() {
  return new Date().getFullYear()
}

export default function SocialMediaBoosting() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [liveCounts, setLiveCounts] = useState({
    followers: 15420,
    likes: 8340,
    views: 125600,
    engagement: 8.7,
  })
  const [selectedPlatform, setSelectedPlatform] = useState(0)
  const [orderFormOpen, setOrderFormOpen] = useState(false)
  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState("")

  // Animate counters
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounts((prev) => ({
        followers: prev.followers + Math.floor(Math.random() * 3),
        likes: prev.likes + Math.floor(Math.random() * 5),
        views: prev.views + Math.floor(Math.random() * 20),
        engagement: +(prev.engagement + (Math.random() * 0.1 - 0.05)).toFixed(1),
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const testimonials = [
    {
      name: "Sarah M.",
      business: "Fashion Boutique",
      image: "👩‍💼",
      rating: 5,
      text: "My Instagram followers grew from 800 to 15K in just 2 months! Sales increased by 400%.",
      metrics: { followers: "+1,420%", sales: "+400%" },
    },
    {
      name: "David K.",
      business: "Tech Startup",
      image: "👨‍💻",
      rating: 5,
      text: "ANONYMIKETECH helped us go viral on TikTok. We got 2.3M views on our product launch!",
      metrics: { views: "2.3M", leads: "+850%" },
    },
    {
      name: "Maria L.",
      business: "Food Blog",
      image: "👩‍🍳",
      rating: 5,
      text: "Professional content creation and perfect timing. My YouTube channel exploded!",
      metrics: { subscribers: "+2,100%", revenue: "+650%" },
    },
    {
      name: "James R.",
      business: "Fitness Coach",
      image: "💪",
      rating: 5,
      text: "From 500 to 25K followers in 3 months. My online coaching business is now fully booked!",
      metrics: { followers: "+4,900%", bookings: "100%" },
    },
  ]

  const platformIcons = {
    Instagram: "📷",
    TikTok: "🎵",
    Facebook: "👥",
    "Twitter/X": "🐦",
    LinkedIn: "💼",
    YouTube: "📺",
  }
  const services = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Content Creation",
      description: "Professional graphics, videos, and engaging post designs.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Audience Growth",
      description: "Organic follower growth and community building strategies.",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Smart Scheduling",
      description: "Automated posting at optimal times for maximum reach.",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Targeted Ads",
      description: "Strategic advertising campaigns for precise audience targeting.",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics & Insights",
      description: "Detailed performance tracking and growth analytics.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Engagement Boost",
      description: "Increase likes, comments, shares, and overall engagement.",
    },
  ]

  const platforms = [
    {
      name: "Instagram",
      features: ["Story Templates", "Reel Creation", "IGTV Content", "Shopping Setup"],
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "TikTok",
      features: ["Viral Content", "Trending Hashtags", "Video Editing", "Content Creation"],
      color: "from-black to-red-500",
    },
    {
      name: "Facebook",
      features: ["Page Optimization", "Event Promotion", "Group Management", "Ad Campaigns"],
      color: "from-blue-600 to-blue-400",
    },
    {
      name: "Twitter/X",
      features: ["Thread Creation", "Engagement Strategy", "Trending Topics", "Community Building"],
      color: "from-gray-800 to-gray-600",
    },
    {
      name: "LinkedIn",
      features: ["Professional Content", "Network Growth", "Industry Insights", "B2B Marketing"],
      color: "from-blue-700 to-blue-500",
    },
    {
      name: "YouTube",
      features: ["Thumbnail Design", "SEO Optimization", "Channel Branding", "Analytics"],
      color: "from-red-600 to-red-400",
    },
  ]

  const socialPlans = [
    {
      title: "📷 INSTAGRAM FOLLOWERS",
      price: "KES 120 - 2,500",
      period: "service",
      features: [
        "500 Followers @ KES 120",
        "1K Followers @ KES 240",
        "5K Followers @ KES 1,500",
        "10K Followers @ KES 2,500",
        "🔥 High Quality Accounts",
        "💬 Order on WhatsApp",
      ],
    },
    {
      title: "❤️ INSTAGRAM LIKES",
      price: "KES 100 - 950",
      period: "service",
      features: [
        "500 Likes @ KES 100",
        "1000 Likes @ KES 200",
        "5000 Likes @ KES 950",
        "⚡ Fast Delivery",
        "🔄 Instant Boost",
        "💬 Order on WhatsApp",
      ],
    },
    {
      title: "👁️ INSTAGRAM VIEWS",
      price: "KES 50 - 350",
      period: "service",
      features: [
        "1000 Views @ KES 50",
        "5000 Views @ KES 200",
        "10K Views @ KES 350",
        "📈 Viral Potential",
        "⚡ Fast Delivery",
        "💬 Order on WhatsApp",
      ],
    },
    {
      title: "🎵 TIKTOK FOLLOWERS",
      price: "KES 300 - 2,500",
      period: "service",
      features: [
        "1000 Followers @ KES 300",
        "5000 Followers @ KES 1,400",
        "10K Followers @ KES 2,500",
        "🔥 Real Active Users",
        "📈 Growth Boost",
        "💬 Order on WhatsApp",
      ],
    },
    {
      title: "💖 TIKTOK LIKES & VIEWS",
      price: "KES 250 - 750",
      period: "service",
      popular: true,
      features: [
        "1000 Likes @ KES 250",
        "5000 Views @ KES 400",
        "10K Views @ KES 750",
        "🎯 Viral Algorithm Boost",
        "⚡ Fast Delivery",
        "💬 Order on WhatsApp",
      ],
    },
    {
      title: "🎬 YOUTUBE SUBS & VIEWS",
      price: "KES 250 - 1,200",
      period: "service",
      features: [
        "100 Subscribers @ KES 250",
        "1000 Views @ KES 300",
        "5000 Views @ KES 1,200",
        "📊 Watch Time Boost",
        "🔔 Real Subscribers",
        "💬 Order on WhatsApp",
      ],
    },
    {
      title: "👍 FACEBOOK PAGE LIKES",
      price: "KES 200 - 1,600",
      period: "service",
      features: [
        "500 Likes @ KES 200",
        "1000 Likes @ KES 350",
        "5000 Likes @ KES 1,600",
        "👥 Real Page Fans",
        "📈 Business Growth",
        "💬 Order on WhatsApp",
      ],
    },
    {
      title: "🐦 TWITTER (X) BOOST",
      price: "KES 150 - 350",
      period: "service",
      features: [
        "500 Followers @ KES 200",
        "1000 Followers @ KES 350",
        "500 Likes @ KES 150",
        "🔥 Trending Boost",
        "💬 Engagement Growth",
        "💬 Order on WhatsApp",
      ],
    },
  ]

  const beforeAfterStats = [
    { metric: "Followers", before: "1.2K", after: "15.8K", growth: "+1,216%" },
    { metric: "Engagement", before: "2.3%", after: "8.7%", growth: "+278%" },
    { metric: "Reach", before: "500", after: "25K", growth: "+4,900%" },
    { metric: "Sales", before: "KSH 50K", after: "KSH 320K", growth: "+540%" },
  ]

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-green relative">
      <MobileMenu />
      <BackToTop />
      <MatrixRain />

      <div className="relative z-10">
        <ServiceHero
          title="SOCIAL MEDIA BOOSTING"
          subtitle="// Viral Growth Strategies"
          description="Amplify your online presence with data-driven social media strategies. From content creation to audience engagement, we help your brand dominate the digital landscape."
          icon={<TrendingUp />}
          backgroundPattern="📈"
        />

        {/* Services Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-tech font-bold text-center mb-16 glow-text"
            >
              // GROWTH SERVICES
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="glow-border rounded-lg p-6 bg-hacker-terminal/50 backdrop-blur-sm text-center group hover:animate-glow-pulse"
                >
                  <div className="text-hacker-green mb-4 flex justify-center group-hover:animate-pulse">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-tech font-bold text-hacker-green-bright mb-3 glow-text">
                    {service.title}
                  </h3>
                  <p className="text-hacker-green-dim leading-relaxed">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Growth Simulator */}
        <section className="py-16 bg-gradient-to-r from-hacker-terminal/30 to-hacker-bg/50">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-tech font-bold text-center mb-16 glow-text"
            >
              // LIVE GROWTH SIMULATOR
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Live Counter */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="glow-border rounded-lg p-8 bg-hacker-terminal/50 backdrop-blur-sm"
              >
                <h3 className="text-2xl font-tech font-bold text-hacker-green-bright mb-6 glow-text text-center">
                  📈 REAL-TIME GROWTH TRACKER
                </h3>

                <div className="grid grid-cols-2 gap-6">
                  <motion.div
                    className="text-center p-4 bg-hacker-bg/50 rounded-lg"
                    key={liveCounts.followers}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 0.3 }}
                  >
                    <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <motion.div
                      className="text-2xl font-tech font-bold text-blue-400"
                      animate={{
                        textShadow: ["0 0 10px #60a5fa", "0 0 20px #60a5fa", "0 0 10px #60a5fa"],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      {liveCounts.followers.toLocaleString()}
                    </motion.div>
                    <div className="text-xs text-hacker-green-dim">Followers</div>
                  </motion.div>

                  <motion.div
                    className="text-center p-4 bg-hacker-bg/50 rounded-lg"
                    key={liveCounts.likes}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <motion.div
                      className="text-2xl font-tech font-bold text-red-400"
                      animate={{
                        textShadow: ["0 0 10px #f87171", "0 0 20px #f87171", "0 0 10px #f87171"],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      {liveCounts.likes.toLocaleString()}
                    </motion.div>
                    <div className="text-xs text-hacker-green-dim">Likes</div>
                  </motion.div>

                  <motion.div
                    className="text-center p-4 bg-hacker-bg/50 rounded-lg"
                    key={liveCounts.views}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 0.3 }}
                  >
                    <Eye className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <motion.div
                      className="text-2xl font-tech font-bold text-green-400"
                      animate={{
                        textShadow: ["0 0 10px #4ade80", "0 0 20px #4ade80", "0 0 10px #4ade80"],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      {liveCounts.views.toLocaleString()}
                    </motion.div>
                    <div className="text-xs text-hacker-green-dim">Views</div>
                  </motion.div>

                  <motion.div
                    className="text-center p-4 bg-hacker-bg/50 rounded-lg"
                    key={liveCounts.engagement}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 0.3 }}
                  >
                    <Activity className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <motion.div
                      className="text-2xl font-tech font-bold text-yellow-400"
                      animate={{
                        textShadow: ["0 0 10px #facc15", "0 0 20px #facc15", "0 0 10px #facc15"],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      {liveCounts.engagement}%
                    </motion.div>
                    <div className="text-xs text-hacker-green-dim">Engagement</div>
                  </motion.div>
                </div>

                <motion.div
                  className="mt-6 text-center"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="text-hacker-green-bright font-tech text-sm mb-2">
                    🔥 These numbers are updating LIVE!
                  </div>
                  <div className="text-xs text-hacker-green-dim">See how your account could grow with our services</div>
                </motion.div>
              </motion.div>

              {/* Interactive Platform Showcase */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="glow-border rounded-lg p-8 bg-hacker-terminal/50 backdrop-blur-sm"
              >
                <h3 className="text-2xl font-tech font-bold text-hacker-green-bright mb-6 glow-text text-center">
                  🎯 PLATFORM SELECTOR
                </h3>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {platforms.slice(0, 6).map((platform, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedPlatform(index)}
                      className={`p-3 rounded-lg transition-all duration-300 font-tech font-bold text-sm ${
                        selectedPlatform === index
                          ? "bg-hacker-green text-hacker-bg glow-border"
                          : "bg-hacker-bg/50 text-hacker-green-bright hover:bg-hacker-green/20"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-2xl mb-1">{platformIcons[platform.name] || "📱"}</div>
                      {platform.name}
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedPlatform}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-hacker-bg/50 rounded-lg p-6"
                  >
                    <h4 className="text-xl font-tech font-bold text-hacker-green-bright mb-4">
                      {platformIcons[platforms[selectedPlatform]?.name] || "📱"} {platforms[selectedPlatform]?.name}{" "}
                      Services
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {platforms[selectedPlatform]?.features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: featureIndex * 0.1 }}
                          className="flex items-center gap-2 text-hacker-green-bright text-sm"
                        >
                          <Zap className="w-4 h-4 text-yellow-400" />
                          {feature}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Customer Success Stories Carousel */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-tech font-bold text-center mb-16 glow-text"
            >
              // SUCCESS STORIES
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="max-w-4xl mx-auto"
            >
              <div className="glow-border rounded-lg p-8 bg-hacker-terminal/50 backdrop-blur-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="text-6xl mb-4">{testimonials[activeTestimonial].image}</div>

                    <div className="flex justify-center mb-4">
                      {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        </motion.div>
                      ))}
                    </div>

                    <blockquote className="text-xl md:text-2xl font-tech text-hacker-green-bright mb-6 leading-relaxed">
                      "{testimonials[activeTestimonial].text}"
                    </blockquote>

                    <div className="text-lg font-tech font-bold text-hacker-green mb-2">
                      {testimonials[activeTestimonial].name}
                    </div>
                    <div className="text-hacker-green-dim mb-6">{testimonials[activeTestimonial].business}</div>

                    <div className="flex justify-center gap-6">
                      {Object.entries(testimonials[activeTestimonial].metrics).map(([key, value], index) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="bg-hacker-bg/50 rounded-lg p-3"
                        >
                          <div className="text-2xl font-tech font-bold text-hacker-green">{value}</div>
                          <div className="text-xs text-hacker-green-dim capitalize">{key}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Testimonial Navigation */}
                <div className="flex justify-center mt-8 gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === activeTestimonial ? "bg-hacker-green" : "bg-hacker-green/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Video Demonstration Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-tech font-bold text-center mb-16 glow-text"
            >
              // WATCH OUR SERVICES IN ACTION
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <div className="glow-border rounded-lg p-6 bg-hacker-terminal/50 backdrop-blur-sm">
                <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden">
                  <iframe
                    allow="fullscreen;autoplay"
                    allowFullScreen
                    height="100%"
                    src="https://streamable.com/e/7c03fs?autoplay=1"
                    width="100%"
                    style={{
                      border: "none",
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      left: "0px",
                      top: "0px",
                      overflow: "hidden",
                    }}
                    className="rounded-lg"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-center mt-6"
                >
                  <h3 className="text-xl font-tech font-bold text-hacker-green-bright mb-2 glow-text">
                    🚀 Real Results, Real Growth
                  </h3>
                  <p className="text-hacker-green-dim leading-relaxed">
                    See how our social media boosting services deliver instant, authentic engagement across all
                    platforms. Professional growth that gets noticed!
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Platforms Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-tech font-bold text-center mb-16 glow-text"
            >
              // SUPPORTED PLATFORMS
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {platforms.map((platform, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="glow-border rounded-lg p-6 bg-hacker-terminal/50 backdrop-blur-sm group"
                >
                  <h3 className="text-2xl font-tech font-bold text-hacker-green-bright mb-4 glow-text group-hover:animate-flicker">
                    {platform.name}
                  </h3>
                  <ul className="space-y-2">
                    {platform.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-hacker-green-bright">
                        <span className="text-hacker-green">▶</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Before/After Transformation Showcase */}
        <section className="py-16 bg-gradient-to-br from-hacker-terminal/20 to-hacker-bg">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-tech font-bold text-center mb-16 glow-text"
            >
              // TRANSFORMATION SHOWCASE
            </motion.h2>

            {/* Interactive Before/After Comparison */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="max-w-6xl mx-auto mb-16"
            >
              <div className="glow-border rounded-lg p-8 bg-hacker-terminal/50 backdrop-blur-sm">
                <h3 className="text-3xl font-tech font-bold text-center text-hacker-green-bright mb-8 glow-text">
                  📊 REAL CLIENT TRANSFORMATION
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Before Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="text-center"
                  >
                    <div className="bg-red-900/20 border-2 border-red-500/30 rounded-lg p-6 mb-4">
                      <h4 className="text-2xl font-tech font-bold text-red-400 mb-4">😞 BEFORE</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-hacker-green-dim">Followers:</span>
                          <span className="text-red-400 font-tech font-bold">1,200</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-hacker-green-dim">Engagement:</span>
                          <span className="text-red-400 font-tech font-bold">2.3%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-hacker-green-dim">Monthly Reach:</span>
                          <span className="text-red-400 font-tech font-bold">500</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-hacker-green-dim">Monthly Revenue:</span>
                          <span className="text-red-400 font-tech font-bold">KSH 50K</span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center">
                        <TrendingDown className="w-12 h-12 text-red-400" />
                      </div>
                    </div>
                  </motion.div>

                  {/* After Section */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="text-center"
                  >
                    <div className="bg-green-900/20 border-2 border-green-500/30 rounded-lg p-6 mb-4">
                      <h4 className="text-2xl font-tech font-bold text-green-400 mb-4">🚀 AFTER</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-hacker-green-dim">Followers:</span>
                          <motion.span
                            className="text-green-400 font-tech font-bold"
                            animate={{
                              textShadow: ["0 0 10px #4ade80", "0 0 20px #4ade80", "0 0 10px #4ade80"],
                            }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          >
                            15,800 <span className="text-yellow-400">(+1,216%)</span>
                          </motion.span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-hacker-green-dim">Engagement:</span>
                          <motion.span
                            className="text-green-400 font-tech font-bold"
                            animate={{
                              textShadow: ["0 0 10px #4ade80", "0 0 20px #4ade80", "0 0 10px #4ade80"],
                            }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          >
                            8.7% <span className="text-yellow-400">(+278%)</span>
                          </motion.span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-hacker-green-dim">Monthly Reach:</span>
                          <motion.span
                            className="text-green-400 font-tech font-bold"
                            animate={{
                              textShadow: ["0 0 10px #4ade80", "0 0 20px #4ade80", "0 0 10px #4ade80"],
                            }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          >
                            25,000 <span className="text-yellow-400">(+4,900%)</span>
                          </motion.span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-hacker-green-dim">Monthly Revenue:</span>
                          <motion.span
                            className="text-green-400 font-tech font-bold"
                            animate={{
                              textShadow: ["0 0 10px #4ade80", "0 0 20px #4ade80", "0 0 10px #4ade80"],
                            }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          >
                            KSH 320K <span className="text-yellow-400">(+540%)</span>
                          </motion.span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center">
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <TrendingUp className="w-12 h-12 text-green-400" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Success Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="mt-12"
                >
                  <h4 className="text-2xl font-tech font-bold text-center text-hacker-green-bright mb-8">
                    🎯 GROWTH TIMELINE
                  </h4>
                  <div className="flex justify-between items-center">
                    {[
                      {
                        week: "Week 1",
                        milestone: "Strategy Setup",
                        icon: "🎯",
                      },
                      {
                        week: "Week 2",
                        milestone: "Content Launch",
                        icon: "🚀",
                      },
                      { week: "Week 4", milestone: "Viral Moment", icon: "🔥" },
                      {
                        week: "Week 8",
                        milestone: "15K Followers",
                        icon: "👑",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 + index * 0.2 }}
                        className="text-center flex-1"
                      >
                        <div className="text-4xl mb-2">{item.icon}</div>
                        <div className="font-tech font-bold text-hacker-green-bright text-sm">{item.week}</div>
                        <div className="text-xs text-hacker-green-dim">{item.milestone}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Showcase */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-tech font-bold text-center mb-16 glow-text"
            >
              // CONTENT EXAMPLES
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  type: "Instagram Post",
                  description: "Engaging visual content with strategic hashtags",
                  engagement: "15.2K likes, 324 comments",
                },
                {
                  type: "TikTok Video",
                  description: "Viral short-form content with trending effects",
                  engagement: "2.3M views, 180K likes",
                },
                {
                  type: "LinkedIn Article",
                  description: "Professional thought leadership content",
                  engagement: "5.8K views, 89 shares",
                },
              ].map((content, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  className="glow-border rounded-lg p-6 bg-hacker-terminal/50 backdrop-blur-sm"
                >
                  <div className="aspect-square bg-gradient-to-br from-hacker-green/20 to-hacker-green/5 rounded-lg mb-4 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-hacker-green opacity-50" />
                  </div>
                  <h3 className="text-lg font-tech font-bold text-hacker-green-bright mb-2">{content.type}</h3>
                  <p className="text-hacker-green-dim mb-3 text-sm">{content.description}</p>
                  <div className="text-hacker-green font-tech text-sm">{content.engagement}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section with Animated Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-tech font-bold text-center mb-16 glow-text"
            >
              // SOCIAL MEDIA BOOSTING SERVICES
            </motion.h2>

            {/* Special Offer Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="mb-12"
            >
              <div className="glow-border rounded-lg p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm max-w-4xl mx-auto text-center">
                <motion.h3
                  className="text-2xl md:text-3xl font-tech font-bold text-transparent bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text mb-4"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  🔥 LAUNCH WEEK SPECIAL - 30% OFF ALL SERVICES!
                </motion.h3>
                <p className="text-lg text-hacker-green-bright mb-4">
                  Limited time offer: Get premium social media boosting at unbeatable prices!
                </p>
                <motion.div
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-3 rounded-full font-tech font-bold"
                  animate={{
                    boxShadow: ["0 0 20px #f59e0b", "0 0 40px #f59e0b", "0 0 20px #f59e0b"],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Crown className="w-5 h-5" />
                  Use Code: LAUNCH30
                </motion.div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              {socialPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    boxShadow: "0 20px 40px rgba(0, 255, 0, 0.2)",
                  }}
                  className="group"
                >
                  <div
                    className={`glow-border rounded-lg p-6 bg-hacker-terminal/50 backdrop-blur-sm h-full relative overflow-hidden ${
                      plan.popular ? "border-yellow-500 bg-gradient-to-br from-yellow-900/20 to-orange-900/20" : ""
                    }`}
                  >
                    {plan.popular && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-tech font-bold"
                      >
                        🔥 POPULAR
                      </motion.div>
                    )}

                    <motion.h3
                      className="text-xl font-tech font-bold text-hacker-green-bright mb-4 glow-text group-hover:animate-flicker"
                      whileHover={{ textShadow: "0 0 20px #00ff00" }}
                    >
                      {plan.title}
                    </motion.h3>

                    <motion.div
                      className="text-2xl font-tech font-bold text-hacker-green mb-2"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    >
                      {plan.price}
                    </motion.div>

                    <div className="text-hacker-green-dim mb-6 capitalize font-tech">per {plan.period}</div>

                    <ul className="space-y-3 mb-6 flex-1">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: index * 0.1 + featureIndex * 0.05,
                          }}
                          className="flex items-start gap-2 text-hacker-green-bright text-sm"
                        >
                          <motion.span
                            className="text-hacker-green mt-1 flex-shrink-0"
                            animate={{ rotate: [0, 360] }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: featureIndex * 0.2,
                            }}
                          >
                            ▶
                          </motion.span>
                          {feature}
                        </motion.li>
                      ))}
                    </ul>

                    <motion.button
                      onClick={() => {
                        setSelectedServiceForOrder(plan.title)
                        setOrderFormOpen(true)
                      }}
                      className="block w-full bg-hacker-green text-hacker-bg text-center py-3 rounded-lg font-tech font-bold hover:bg-hacker-green-bright transition-all duration-300 hover:animate-glow-pulse"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 20px rgba(0, 255, 0, 0.3)",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🛒 Order Now
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="py-16"
        >
          <div className="container mx-auto px-4">
            <div className="glow-border rounded-lg p-12 bg-gradient-to-br from-hacker-terminal/50 to-purple-900/30 backdrop-blur-sm text-center relative overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bg-hacker-green/10 rounded-full"
                    style={{
                      width: Math.random() * 100 + 50,
                      height: Math.random() * 100 + 50,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.1, 0.3, 0.1],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 4 + Math.random() * 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: Math.random() * 3,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="text-6xl mb-6"
                >
                  🚀
                </motion.div>

                <motion.h3
                  className="text-3xl md:text-4xl font-tech font-bold text-transparent bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text mb-6"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  Ready to Dominate Social Media?
                </motion.h3>

                <p className="text-xl text-hacker-green-bright mb-8 max-w-2xl mx-auto leading-relaxed">
                  Join <strong className="text-yellow-400">500+ successful clients</strong> who transformed their online
                  presence with our
                  <strong className="text-pink-400"> viral growth strategies</strong>. Your success story starts today!
                  🌟
                </p>

                {/* Success Stats */}
                <div className="grid grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
                  {[
                    { icon: "👥", stat: "500+", label: "Happy Clients" },
                    { icon: "🔥", stat: "2.3M+", label: "Viral Views" },
                    { icon: "💰", stat: "540%", label: "Avg Growth" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className="text-center"
                    >
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <motion.div
                        className="text-2xl font-tech font-bold text-hacker-green"
                        animate={{
                          textShadow: ["0 0 10px #00ff00", "0 0 20px #00ff00", "0 0 10px #00ff00"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: index * 0.5,
                        }}
                      >
                        {item.stat}
                      </motion.div>
                      <div className="text-xs text-hacker-green-dim">{item.label}</div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.a
                    href="https://wa.me/+254782829321"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-lg font-tech font-bold transition-all duration-300 text-lg"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 30px rgba(34, 197, 94, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    💬 Start Your Growth Journey
                    <Sparkles className="w-5 h-5" />
                  </motion.a>

                  <motion.div
                    className="text-sm text-hacker-green-bright font-tech"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    ⚡ Free consultation • Fast results • Proven methods
                  </motion.div>
                </motion.div>
              </div>
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

        {/* Order Form Modal */}
        <SocialMediaOrderForm
          isOpen={orderFormOpen}
          onClose={() => setOrderFormOpen(false)}
          initialService={selectedServiceForOrder}
        />
      </div>
    </div>
  )
}
