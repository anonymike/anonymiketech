"use client"

import { useState } from "react"
import { MessageSquare, Zap, Bot, Users, Brain, BarChart3, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import MatrixRain from "@/components/MatrixRain"
import ServiceHero from "@/components/ServiceHero"
import PricingCard from "@/components/PricingCard"
import LiveChatDemo from "@/components/LiveChatDemo"
import ContactButtons from "@/components/ContactButtons"
import MobileMenu from "@/components/MobileMenu"
import BackToTop from "@/components/BackToTop"
import { getCurrentYear } from "@/utils/getCurrentYear"
import ChatbaseEmbed from "@/components/ChatbaseEmbed"
import ChatbotsAuthModal from "@/components/ChatbotsAuthModal"
import ChatbotsWelcomeAlert from "@/components/ChatbotsWelcomeAlert"

export default function ChatbotsAI() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const capabilities = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "WhatsApp Automation",
      description: "Intelligent WhatsApp bots that handle customer inquiries 24/7.",
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI Chatbots",
      description: "Natural language processing for human-like conversations.",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Machine Learning",
      description: "Advanced algorithms that learn and improve over time.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customer Support",
      description: "Automated support tickets and issue resolution.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Responses",
      description: "Real-time processing with sub-second response times.",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description: "Detailed insights into bot performance and user interactions.",
    },
  ]

  const useCases = [
    {
      title: "E-Commerce Support",
      description: "Handle product inquiries, orders, and returns automatically",
      features: ["Order tracking", "Product recommendations", "Payment assistance"],
    },
    {
      title: "Lead Generation",
      description: "Qualify and nurture leads through intelligent conversations",
      features: ["Lead scoring", "Appointment booking", "Follow-up automation"],
    },
    {
      title: "Customer Service",
      description: "Provide 24/7 support without human intervention",
      features: ["FAQ automation", "Ticket routing", "Issue resolution"],
    },
    {
      title: "Marketing Automation",
      description: "Engage customers and drive conversions with AI",
      features: ["Personalized messaging", "Campaign tracking", "A/B testing"],
    },
  ]

  const aiPlans = [
    {
      title: "Whatsapp Bot",
      subtitle: "Starter",
      price: "100",
      currency: "KES",
      period: "setup",
      features: [
        "Secure Panel Hosting",
        "24/7 Uptime Monitoring",
        "Fast Server Performance",
        "DDoS Protection",
        "Basic Analytics",
        "Email Support",
      ],
    },
    {
      title: "Whatsapp Bot",
      subtitle: "Professional",
      price: "150",
      currency: "KES",
      period: "service",
      features: [
        "Complete Bot Deployment",
        "Configuration Setup",
        "Custom Integration",
        "WhatsApp Connection",
        "Testing & Validation",
        "Documentation Provided",
      ],
    },
    {
      title: "Whatsapp Bot",
      subtitle: "Business",
      price: "150",
      currency: "KES",
      period: "monthly",
      features: [
        "Dedicated Panel Server",
        "Auto-scaling Resources",
        "Performance Monitoring",
        "Enhanced Security",
        "Priority Support",
        "Advanced Analytics",
        "Custom Configurations",
      ],
    },
    {
      title: "Website Live Chat AI",
      subtitle: "Starter",
      price: "500",
      currency: "KES",
      period: "month",
      features: [
        "Live Chat Integration",
        "Basic AI Responses",
        "Real-time Messaging",
        "Standard Analytics",
        "Email Support",
        "Basic Customization",
      ],
    },
    {
      title: "Website Live Chat AI",
      subtitle: "Professional",
      price: "3,000",
      currency: "KES",
      period: "6 months",
      popular: true,
      features: [
        "Advanced AI Engine",
        "Multi-page Support",
        "Unlimited Conversations",
        "Advanced Analytics",
        "Priority Support",
        "Custom Training",
        "API Integration",
        "Lead Capture",
      ],
    },
    {
      title: "Website Live Chat AI",
      subtitle: "Enterprise",
      price: "6,000",
      currency: "KES",
      period: "year",
      features: [
        "Enterprise AI Engine",
        "Unlimited Everything",
        "Real-time Intelligence",
        "24/7 Dedicated Support",
        "Advanced Security",
        "Full Analytics Suite",
        "Custom Integrations",
        "Consultation & Training",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-green relative">
      <ChatbaseEmbed />
      <MobileMenu />
      <BackToTop />
      <MatrixRain />

      <div className="relative z-10">
        <ServiceHero
          title="CHATBOTS & AI"
          subtitle="// Intelligent Automation"
          description="Harness the power of artificial intelligence to automate customer interactions, support, and sales. Our AI-driven solutions provide intelligent conversations, instant responses, and actionable insights."
          icon={<Bot />}
          backgroundPattern="<>"
          ctaText="Get Started Now"
          onCtaClick={() => setShowAuthModal(true)}
        />

        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-tech font-bold text-center mb-16 glow-text"
            >
              // AI CAPABILITIES
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {capabilities.map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="glow-border rounded-lg p-4 sm:p-6 bg-hacker-terminal/50 backdrop-blur-sm text-center group hover:animate-glow-pulse"
                >
                  <div className="text-5xl sm:text-6xl text-hacker-green mb-4 flex justify-center group-hover:animate-pulse">
                    {capability.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-tech font-bold text-hacker-green-bright mb-3 glow-text">
                    {capability.title}
                  </h3>
                  <p className="text-sm sm:text-base text-hacker-green-dim leading-relaxed">{capability.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-tech font-bold text-center mb-16 glow-text"
            >
              // USE CASES
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  className="glow-border rounded-lg p-4 sm:p-6 lg:p-8 bg-hacker-terminal/50 backdrop-blur-sm group"
                >
                  <h3 className="text-xl sm:text-2xl font-tech font-bold text-hacker-green-bright mb-4 glow-text group-hover:animate-flicker">
                    {useCase.title}
                  </h3>
                  <p className="text-sm sm:text-base text-hacker-green-dim mb-6 leading-relaxed">{useCase.description}</p>
                  <div className="space-y-2">
                    {useCase.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2 text-sm sm:text-base text-hacker-green-bright">
                        <span className="text-hacker-green font-bold">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-tech font-bold text-center mb-16 glow-text"
            >
              // AI PRICING PLANS
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-16">
              {aiPlans.map((plan, index) => (
                <PricingCard
                  key={index}
                  title={plan.title}
                  subtitle={plan.subtitle}
                  price={plan.price}
                  currency={plan.currency}
                  period={plan.period}
                  features={plan.features}
                  popular={plan.popular}
                  delay={index * 0.2}
                />
              ))}
            </div>
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="py-12 sm:py-16 px-4"
        >
          <div className="container mx-auto">
            <div className="glow-border rounded-lg p-6 sm:p-8 lg:p-12 bg-hacker-terminal/30 backdrop-blur-sm text-center">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-tech font-bold text-hacker-green-bright mb-4 sm:mb-6 glow-text">
                Ready to Deploy Your AI Bot?
              </h3>
              <p className="text-base sm:text-lg lg:text-xl text-hacker-green-dim mb-8 max-w-2xl mx-auto">
                Join thousands using our platform to automate WhatsApp interactions, boost sales, and improve customer support.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAuthModal(true)}
                className="relative px-8 sm:px-10 py-3 sm:py-4 font-tech font-bold text-base sm:text-lg text-hacker-bg rounded-lg overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-hacker-green via-hacker-green-bright to-hacker-green opacity-100 group-hover:opacity-110 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-hacker-green shadow-lg shadow-hacker-green/80 group-hover:shadow-hacker-green/100 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <span className="relative flex items-center justify-center gap-3 text-hacker-bg font-bold">
                  Start Your Free Trial
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            </div>
          </div>
        </motion.section>

        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="py-6 sm:py-8 border-t border-hacker-green/20 px-4"
        >
          <div className="container mx-auto text-center">
            <motion.p
              className="font-tech text-xs sm:text-sm text-hacker-green-dim hover:text-hacker-green transition-colors duration-300"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              © anonymiketech_inc@{getCurrentYear()}
            </motion.p>
          </div>
        </motion.footer>
      </div>

      {/* Auth Modal */}
      <ChatbotsAuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Welcome Alert */}
      {showWelcome && <ChatbotsWelcomeAlert onClose={() => setShowWelcome(false)} />}
    </div>
  )
}
