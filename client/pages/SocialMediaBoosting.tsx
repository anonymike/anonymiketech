import {
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Camera,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import MatrixRain from "../components/MatrixRain";
import ServiceHero from "../components/ServiceHero";
import PricingCard from "../components/PricingCard";
import ContactButtons from "../components/ContactButtons";
import MobileMenu from "../components/MobileMenu";
import BackToTop from "../components/BackToTop";

export default function SocialMediaBoosting() {
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
      description:
        "Strategic advertising campaigns for precise audience targeting.",
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
  ];

  const platforms = [
    {
      name: "Instagram",
      features: [
        "Story Templates",
        "Reel Creation",
        "IGTV Content",
        "Shopping Setup",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "TikTok",
      features: [
        "Viral Content",
        "Trending Hashtags",
        "Video Editing",
        "Content Creation",
      ],
      color: "from-black to-red-500",
    },
    {
      name: "Facebook",
      features: [
        "Page Optimization",
        "Event Promotion",
        "Group Management",
        "Ad Campaigns",
      ],
      color: "from-blue-600 to-blue-400",
    },
    {
      name: "Twitter/X",
      features: [
        "Thread Creation",
        "Engagement Strategy",
        "Trending Topics",
        "Community Building",
      ],
      color: "from-gray-800 to-gray-600",
    },
    {
      name: "LinkedIn",
      features: [
        "Professional Content",
        "Network Growth",
        "Industry Insights",
        "B2B Marketing",
      ],
      color: "from-blue-700 to-blue-500",
    },
    {
      name: "YouTube",
      features: [
        "Thumbnail Design",
        "SEO Optimization",
        "Channel Branding",
        "Analytics",
      ],
      color: "from-red-600 to-red-400",
    },
  ];

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
  ];

  const beforeAfterStats = [
    { metric: "Followers", before: "1.2K", after: "15.8K", growth: "+1,216%" },
    { metric: "Engagement", before: "2.3%", after: "8.7%", growth: "+278%" },
    { metric: "Reach", before: "500", after: "25K", growth: "+4,900%" },
    { metric: "Sales", before: "KSH 50K", after: "KSH 320K", growth: "+540%" },
  ];

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
                  <p className="text-hacker-green-dim leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </div>
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
                    See how our social media boosting services deliver instant,
                    authentic engagement across all platforms. Professional
                    growth that gets noticed!
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
                      <li
                        key={featureIndex}
                        className="flex items-center gap-2 text-hacker-green-bright"
                      >
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

        {/* Before/After Stats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-tech font-bold text-center mb-16 glow-text"
            >
              // SUCCESS METRICS
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {beforeAfterStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="glow-border rounded-lg p-6 bg-hacker-terminal/50 backdrop-blur-sm text-center"
                >
                  <h3 className="text-xl font-tech font-bold text-hacker-green-bright mb-4 glow-text">
                    {stat.metric}
                  </h3>
                  <div className="space-y-2">
                    <div className="text-sm text-hacker-green-dim">Before:</div>
                    <div className="text-lg font-tech text-red-400">
                      {stat.before}
                    </div>
                    <div className="text-sm text-hacker-green-dim">After:</div>
                    <div className="text-2xl font-tech font-bold text-hacker-green">
                      {stat.after}
                    </div>
                    <div className="text-sm text-hacker-green-bright animate-pulse">
                      {stat.growth}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
                  description:
                    "Engaging visual content with strategic hashtags",
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
                  <h3 className="text-lg font-tech font-bold text-hacker-green-bright mb-2">
                    {content.type}
                  </h3>
                  <p className="text-hacker-green-dim mb-3 text-sm">
                    {content.description}
                  </p>
                  <div className="text-hacker-green font-tech text-sm">
                    {content.engagement}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              {socialPlans.map((plan, index) => (
                <PricingCard
                  key={index}
                  title={plan.title}
                  price={plan.price}
                  period={plan.period}
                  features={plan.features}
                  popular={plan.popular}
                  delay={index * 0.2}
                />
              ))}
            </div>
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
                Ready to Go Viral?
              </h3>
              <p className="text-xl text-hacker-green-dim mb-8 max-w-2xl mx-auto">
                Let's boost your social media presence and turn your followers
                into customers with our proven strategies.
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
              transition={{ duration: 3, repeat: Infinity }}
            >
              © anonymiketech_inc@2025
            </motion.p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
