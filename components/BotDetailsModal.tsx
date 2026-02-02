'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, Globe, CreditCard, Zap } from 'lucide-react'
import Link from 'next/link'

interface BotDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  price: string
  currency?: string
  period: string
}

export default function BotDetailsModal({ isOpen, onClose, title, subtitle, price, currency = 'KES', period }: BotDetailsModalProps) {
  const whatsappNumber = '+254782829321'
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}`
  const checkoutUrl = 'https://anonymiketech-checkouts.vercel.app/'
  const tillNumber = '4930086'

  // Bot type specific details
  const isBotPanel = title.includes('Whatsapp')
  const isLiveChat = title.includes('Live Chat')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Enhanced blur with stronger visibility */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-40 backdrop-blur-md"
          />

          {/* Modal - Responsive container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4 md:px-6 py-4"
          >
            <div className="bg-hacker-bg border-2 border-hacker-green-bright rounded-lg w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[90vh] md:max-h-[85vh] overflow-y-auto glow-border shadow-2xl shadow-hacker-green/50">
              {/* Header */}
              <div className="sticky top-0 bg-hacker-terminal/95 border-b border-hacker-green-dim p-4 sm:p-6 flex items-start sm:items-center justify-between gap-3 z-10 backdrop-blur-sm">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-tech font-bold text-hacker-green-bright glow-text break-words">{title}</h2>
                  {subtitle && <p className="text-xs sm:text-sm font-tech text-hacker-green mt-1">{subtitle}</p>}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  onClick={onClose}
                  className="text-hacker-green-bright hover:text-hacker-green transition-colors flex-shrink-0 p-1"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Price Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-hacker-terminal rounded-lg p-3 sm:p-4 border border-hacker-green-dim">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 mb-2">
                    <span className="text-2xl sm:text-3xl font-tech font-bold text-hacker-green">{currency} {price}</span>
                    <span className="text-xs sm:text-base text-hacker-green-dim font-tech">/{period}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-tech text-hacker-green">All features included in this package</p>
                </motion.div>

                {/* How It Operates */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h3 className="text-lg sm:text-xl font-tech font-bold text-hacker-green-bright mb-3 sm:mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-hacker-green flex-shrink-0" />
                    <span>How It Operates</span>
                  </h3>
                  <div className="space-y-2 sm:space-y-3 bg-hacker-terminal rounded-lg p-3 sm:p-4 border border-hacker-green-dim">
                    {isBotPanel ? (
                      <div className="space-y-2 text-xs sm:text-sm font-tech text-hacker-green-bright">
                        <p>✦ Secure hosting environment with real-time monitoring</p>
                        <p>✦ Automatic message processing and AI-driven responses</p>
                        <p>✦ Seamless WhatsApp integration via official API</p>
                        <p>✦ Advanced customization and automation rules</p>
                      </div>
                    ) : (
                      <div className="space-y-2 text-xs sm:text-sm font-tech text-hacker-green-bright">
                        <p>✦ Intelligent conversation flows with natural language processing</p>
                        <p>✦ Real-time chat widget embedded on your website</p>
                        <p>✦ Automatic lead capture and customer data management</p>
                        <p>✦ 24/7 availability with instant responses</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Key Benefits */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <h3 className="text-lg sm:text-xl font-tech font-bold text-hacker-green-bright mb-3 sm:mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-hacker-green flex-shrink-0" />
                    <span>Key Benefits</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm font-tech text-hacker-green-bright">
                    <div className="bg-hacker-terminal rounded p-2 sm:p-3 border border-hacker-green-dim">
                      <p className="font-bold text-hacker-green mb-1 text-xs sm:text-sm">24/7 Availability</p>
                      <p className="text-xs text-hacker-green-dim">Always online, never miss a customer</p>
                    </div>
                    <div className="bg-hacker-terminal rounded p-2 sm:p-3 border border-hacker-green-dim">
                      <p className="font-bold text-hacker-green mb-1 text-xs sm:text-sm">Cost Reduction</p>
                      <p className="text-xs text-hacker-green-dim">Reduce operational costs significantly</p>
                    </div>
                    <div className="bg-hacker-terminal rounded p-2 sm:p-3 border border-hacker-green-dim">
                      <p className="font-bold text-hacker-green mb-1 text-xs sm:text-sm">Instant Responses</p>
                      <p className="text-xs text-hacker-green-dim">Sub-second response times</p>
                    </div>
                    <div className="bg-hacker-terminal rounded p-2 sm:p-3 border border-hacker-green-dim">
                      <p className="font-bold text-hacker-green mb-1 text-xs sm:text-sm">Scalability</p>
                      <p className="text-xs text-hacker-green-dim">Handle unlimited conversations</p>
                    </div>
                  </div>
                </motion.div>

                {/* Payment Options */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <h3 className="text-lg sm:text-xl font-tech font-bold text-hacker-green-bright mb-3 sm:mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-hacker-green flex-shrink-0" />
                    <span>Payment Options</span>
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {/* Card Payment */}
                    <motion.a
                      href={checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02, boxShadow: '0 0 20px hsl(var(--hacker-green))' }}
                      className="block bg-gradient-to-r from-hacker-green-dim to-hacker-green text-hacker-bg rounded-lg p-3 sm:p-4 font-tech font-bold transition-all duration-300 cursor-pointer border border-hacker-green hover:border-hacker-green-bright"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm sm:text-base">💳 Card Payment</span>
                        <span className="text-xs sm:text-sm flex-shrink-0">→</span>
                      </div>
                      <p className="text-xs mt-1 opacity-80">Secure checkout via card or mobile money</p>
                    </motion.a>

                    {/* M-Pesa Till */}
                    <motion.div
                      whileHover={{ scale: 1.02, boxShadow: '0 0 20px hsl(var(--hacker-green-dim))' }}
                      className="bg-hacker-terminal rounded-lg p-3 sm:p-4 font-tech border border-hacker-green-dim cursor-help hover:border-hacker-green-bright transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <span className="font-bold text-hacker-green-bright text-sm sm:text-base">📱 M-Pesa Till</span>
                        <span className="text-xs text-hacker-green flex-shrink-0">Copy</span>
                      </div>
                      <div
                        onClick={() => {
                          navigator.clipboard.writeText(tillNumber)
                          alert('Till number copied to clipboard!')
                        }}
                        className="bg-hacker-bg rounded p-2 sm:p-3 border border-hacker-green-dim cursor-pointer hover:border-hacker-green transition-colors active:border-hacker-green"
                      >
                        <p className="text-hacker-green text-lg sm:text-xl font-bold text-center tracking-wider">{tillNumber}</p>
                        <p className="text-xs text-hacker-green-dim mt-1 text-center">Tap to copy and use in M-Pesa</p>
                      </div>
                    </motion.div>

                    {/* WhatsApp */}
                    <motion.a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)' }}
                      className="block bg-green-600 hover:bg-green-700 text-white rounded-lg p-3 sm:p-4 font-tech font-bold transition-all duration-300 cursor-pointer border border-green-500"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm sm:text-base">💬 WhatsApp Support</span>
                        <span className="text-xs sm:text-sm flex-shrink-0">→</span>
                      </div>
                      <p className="text-xs mt-1 opacity-90">Chat with us to discuss your needs</p>
                    </motion.a>
                  </div>
                </motion.div>

                {/* FAQ Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <h3 className="text-base sm:text-lg font-tech font-bold text-hacker-green-bright mb-2 sm:mb-3">Quick Questions?</h3>
                  <div className="bg-hacker-terminal rounded-lg p-3 sm:p-4 border border-hacker-green-dim space-y-2 sm:space-y-3 text-xs sm:text-sm font-tech text-hacker-green-bright">
                    <div>
                      <p className="font-bold text-hacker-green text-xs sm:text-sm">Can I customize the bot?</p>
                      <p className="text-xs text-hacker-green-dim mt-1">Yes, all plans include custom configuration to match your brand and requirements.</p>
                    </div>
                    <div>
                      <p className="font-bold text-hacker-green text-xs sm:text-sm">What about support?</p>
                      <p className="text-xs text-hacker-green-dim mt-1">We provide email support (Starter), priority support (Professional), and 24/7 support (Enterprise).</p>
                    </div>
                    <div>
                      <p className="font-bold text-hacker-green text-xs sm:text-sm">Is there a trial period?</p>
                      <p className="text-xs text-hacker-green-dim mt-1">Contact us via WhatsApp to discuss trial options for your specific needs.</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 bg-hacker-terminal/95 border-t border-hacker-green-dim p-3 sm:p-4 md:p-6 flex gap-2 sm:gap-3 z-10 backdrop-blur-sm">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={onClose}
                  className="flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-tech font-bold bg-hacker-terminal border border-hacker-green-dim text-hacker-green-bright hover:border-hacker-green-bright transition-all duration-300 text-xs sm:text-base"
                >
                  Close
                </motion.button>
                <motion.a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-tech font-bold bg-hacker-green text-hacker-bg hover:bg-hacker-green-bright transition-all duration-300 text-center text-xs sm:text-base"
                >
                  Chat on WhatsApp
                </motion.a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
