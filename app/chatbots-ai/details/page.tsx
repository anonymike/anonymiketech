'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Zap, X } from 'lucide-react'
import MatrixRain from '@/components/MatrixRain'
import BackToTop from '@/components/BackToTop'
import MobileMenu from '@/components/MobileMenu'

function BotDetailsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const title = searchParams.get('title') || 'Bot Details'
  const subtitle = searchParams.get('subtitle') || ''
  const price = searchParams.get('price') || '0'
  const currency = searchParams.get('currency') || 'KES'
  const period = searchParams.get('period') || 'month'

  const whatsappNumber = '+254782829321'
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}`
  const checkoutUrl = 'https://anonymiketech-checkouts.vercel.app/'
  const tillNumber = '4930086'

  const isBotPanel = title.includes('Whatsapp')

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-green relative">
      <MobileMenu />
      <BackToTop />
      <MatrixRain />

      <div className="relative z-10">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 bg-hacker-terminal/95 border-b border-hacker-green-dim backdrop-blur-md"
        >
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="flex items-center gap-2 text-hacker-green-bright hover:text-hacker-green-bright/80 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="font-tech font-bold hidden sm:inline">Back</span>
            </motion.button>
            <h1 className="text-xl sm:text-2xl font-tech font-bold text-hacker-green-bright glow-text text-center flex-1">
              {title}
            </h1>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="text-hacker-green-bright hover:text-hacker-green-bright/80 transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <section className="py-8 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glow-border rounded-lg bg-hacker-terminal/40 backdrop-blur-md p-6 md:p-10 space-y-8"
            >
              {/* Price Section */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-hacker-terminal rounded-lg p-6 border border-hacker-green-dim text-center"
              >
                <h2 className="text-2xl md:text-4xl font-tech font-bold text-hacker-green-bright glow-text mb-2">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-base md:text-lg font-tech text-hacker-green mb-4">{subtitle}</p>
                )}
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-4xl md:text-5xl font-tech font-bold text-hacker-green">
                    {currency} {price}
                  </span>
                  <span className="text-lg md:text-xl text-hacker-green-dim font-tech">/{period}</span>
                </div>
                <p className="text-sm md:text-base font-tech text-hacker-green">All features included in this package</p>
              </motion.div>

              {/* How It Operates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl md:text-2xl font-tech font-bold text-hacker-green-bright mb-4 flex items-center gap-2 glow-text">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-hacker-green flex-shrink-0" />
                  <span>How It Operates</span>
                </h3>
                <div className="space-y-3 bg-hacker-terminal rounded-lg p-4 md:p-6 border border-hacker-green-dim">
                  {isBotPanel ? (
                    <div className="space-y-3 text-sm md:text-base font-tech text-hacker-green-bright">
                      <p>✦ Secure hosting environment with real-time monitoring</p>
                      <p>✦ Automatic message processing and AI-driven responses</p>
                      <p>✦ Seamless WhatsApp integration via official API</p>
                      <p>✦ Advanced customization and automation rules</p>
                    </div>
                  ) : (
                    <div className="space-y-3 text-sm md:text-base font-tech text-hacker-green-bright">
                      <p>✦ Intelligent conversation flows with natural language processing</p>
                      <p>✦ Real-time chat widget embedded on your website</p>
                      <p>✦ Automatic lead capture and customer data management</p>
                      <p>✦ 24/7 availability with instant responses</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Key Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl md:text-2xl font-tech font-bold text-hacker-green-bright mb-4 flex items-center gap-2 glow-text">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-hacker-green flex-shrink-0" />
                  <span>Key Benefits</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-hacker-terminal rounded-lg p-4 border border-hacker-green-dim">
                    <p className="font-bold text-hacker-green mb-2 text-sm md:text-base">24/7 Availability</p>
                    <p className="text-xs md:text-sm text-hacker-green-dim">Always online, never miss a customer</p>
                  </div>
                  <div className="bg-hacker-terminal rounded-lg p-4 border border-hacker-green-dim">
                    <p className="font-bold text-hacker-green mb-2 text-sm md:text-base">Cost Reduction</p>
                    <p className="text-xs md:text-sm text-hacker-green-dim">Reduce operational costs significantly</p>
                  </div>
                  <div className="bg-hacker-terminal rounded-lg p-4 border border-hacker-green-dim">
                    <p className="font-bold text-hacker-green mb-2 text-sm md:text-base">Instant Responses</p>
                    <p className="text-xs md:text-sm text-hacker-green-dim">Sub-second response times</p>
                  </div>
                  <div className="bg-hacker-terminal rounded-lg p-4 border border-hacker-green-dim">
                    <p className="font-bold text-hacker-green mb-2 text-sm md:text-base">Scalability</p>
                    <p className="text-xs md:text-sm text-hacker-green-dim">Handle unlimited conversations</p>
                  </div>
                </div>
              </motion.div>

              {/* Payment Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl md:text-2xl font-tech font-bold text-hacker-green-bright mb-4 flex items-center gap-2 glow-text">
                  <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-hacker-green flex-shrink-0" />
                  <span>Payment Options</span>
                </h3>
                <div className="space-y-3">
                  {/* Card Payment */}
                  <motion.a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px hsl(var(--hacker-green))' }}
                    className="block bg-gradient-to-r from-hacker-green-dim to-hacker-green text-hacker-bg rounded-lg p-4 md:p-5 font-tech font-bold transition-all duration-300 cursor-pointer border border-hacker-green hover:border-hacker-green-bright"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm md:text-base">💳 Card Payment</span>
                      <span className="text-xs md:text-sm">→</span>
                    </div>
                    <p className="text-xs mt-1 opacity-80">Secure checkout via card or mobile money</p>
                  </motion.a>

                  {/* M-Pesa Till */}
                  <motion.div
                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px hsl(var(--hacker-green-dim))' }}
                    className="bg-hacker-terminal rounded-lg p-4 md:p-5 font-tech border border-hacker-green-dim cursor-help hover:border-hacker-green-bright transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <span className="font-bold text-hacker-green-bright text-sm md:text-base">📱 M-Pesa Till</span>
                      <span className="text-xs md:text-sm text-hacker-green">Copy</span>
                    </div>
                    <div
                      onClick={() => {
                        navigator.clipboard.writeText(tillNumber)
                        alert('Till number copied to clipboard!')
                      }}
                      className="bg-hacker-bg rounded-lg p-3 md:p-4 border border-hacker-green-dim cursor-pointer hover:border-hacker-green transition-colors active:border-hacker-green"
                    >
                      <p className="text-hacker-green text-2xl md:text-3xl font-bold text-center tracking-wider">{tillNumber}</p>
                      <p className="text-xs text-hacker-green-dim mt-2 text-center">Tap to copy and use in M-Pesa</p>
                    </div>
                  </motion.div>

                  {/* WhatsApp */}
                  <motion.a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)' }}
                    className="block bg-green-600 hover:bg-green-700 text-white rounded-lg p-4 md:p-5 font-tech font-bold transition-all duration-300 cursor-pointer border border-green-500"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm md:text-base">💬 WhatsApp Support</span>
                      <span className="text-xs md:text-sm">→</span>
                    </div>
                    <p className="text-xs mt-1 opacity-90">Chat with us to discuss your needs</p>
                  </motion.a>
                </div>
              </motion.div>

              {/* FAQ Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-lg md:text-xl font-tech font-bold text-hacker-green-bright mb-4 glow-text">
                  Quick Questions?
                </h3>
                <div className="bg-hacker-terminal rounded-lg p-4 md:p-6 border border-hacker-green-dim space-y-4">
                  <div>
                    <p className="font-bold text-hacker-green text-sm md:text-base mb-1">Can I customize the bot?</p>
                    <p className="text-xs md:text-sm text-hacker-green-dim">Yes, all plans include custom configuration to match your brand and requirements.</p>
                  </div>
                  <div>
                    <p className="font-bold text-hacker-green text-sm md:text-base mb-1">What about support?</p>
                    <p className="text-xs md:text-sm text-hacker-green-dim">We provide email support (Starter), priority support (Professional), and 24/7 support (Enterprise).</p>
                  </div>
                  <div>
                    <p className="font-bold text-hacker-green text-sm md:text-base mb-1">Is there a trial period?</p>
                    <p className="text-xs md:text-sm text-hacker-green-dim">Contact us via WhatsApp to discuss trial options for your specific needs.</p>
                  </div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-hacker-green-dim"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.back()}
                  className="flex-1 py-3 px-6 rounded-lg font-tech font-bold bg-hacker-terminal border border-hacker-green-dim text-hacker-green-bright hover:border-hacker-green-bright transition-all duration-300"
                >
                  ← Back to Pricing
                </motion.button>
                <motion.a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 px-6 rounded-lg font-tech font-bold bg-hacker-green text-hacker-bg hover:bg-hacker-green-bright transition-all duration-300 text-center"
                >
                  💬 Get Started
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default function BotDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-hacker-bg flex items-center justify-center"><div className="text-hacker-green font-tech">Loading...</div></div>}>
      <BotDetailsContent />
    </Suspense>
  )
}
