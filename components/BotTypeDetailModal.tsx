'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { CheckCircle2, Zap, Shield, TrendingUp, X } from 'lucide-react'

interface BotTypeDetailModalProps {
  isOpen: boolean
  onClose: () => void
  botType: {
    id: string
    name: string
    cost: number
    description: string
    features: string[]
    benefits: string[]
    icon: string
    image: string
  } | null
}

const BOT_DETAILS = {
  whatsapp_pro: {
    id: 'whatsapp_pro',
    name: 'WhatsApp Bot Pro',
    cost: 10,
    icon: '💬',
    image: '/images/bots/whatsapp-pro.jpg',
    description: 'Professional WhatsApp automation solution for businesses looking to automate customer interactions at scale.',
    features: [
      'Real-time message processing',
      'Media file support (images, videos, documents)',
      'Message scheduling',
      'Bulk messaging capabilities',
      'Contact management system',
      'Message templates',
      'Webhook integrations',
      'Advanced routing'
    ],
    benefits: [
      'Automate customer responses 24/7',
      'Reduce response time significantly',
      'Handle multiple conversations simultaneously',
      'Integrate with your existing systems',
      'Professional support included'
    ]
  },
  customer_support: {
    id: 'customer_support',
    name: 'Customer Support Bot',
    cost: 15,
    icon: '🎯',
    image: '/images/bots/customer-support.jpg',
    description: 'AI-powered customer support automation with intelligent ticket management and response system.',
    features: [
      'AI-powered response generation',
      'Ticket management system',
      'Priority queue handling',
      'Knowledge base integration',
      'Multi-language support',
      'FAQ automation',
      'Escalation routing',
      'Customer analytics'
    ],
    benefits: [
      'Reduce support team workload by 70%',
      'Provide instant customer responses',
      'Improve customer satisfaction scores',
      'Track and analyze support metrics',
      'Scale support without adding staff'
    ]
  },
  ecommerce: {
    id: 'ecommerce',
    name: 'E-commerce Bot',
    cost: 20,
    icon: '🛍️',
    image: '/images/bots/ecommerce.jpg',
    description: 'Complete e-commerce solution with product catalog, shopping cart, and order management.',
    features: [
      'Dynamic product catalog',
      'Shopping cart functionality',
      'Order processing',
      'Inventory management',
      'Payment integration',
      'Order tracking',
      'Customer reviews',
      'Promotional campaigns'
    ],
    benefits: [
      'Increase sales with automated recommendations',
      'Reduce cart abandonment rates',
      'Streamline order processing',
      'Real-time inventory updates',
      'Boost customer engagement'
    ]
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing Bot',
    cost: 12,
    icon: '📢',
    image: '/images/bots/marketing.jpg',
    description: 'Campaign automation and lead generation platform for marketing teams.',
    features: [
      'Campaign management dashboard',
      'Lead capture forms',
      'A/B testing tools',
      'Analytics tracking',
      'Email integration',
      'Segment targeting',
      'Automated workflows',
      'Conversion reporting'
    ],
    benefits: [
      'Automate marketing campaigns',
      'Capture and qualify leads automatically',
      'Increase conversion rates',
      'Detailed campaign analytics',
      'Improve ROI on marketing spend'
    ]
  },
  lead_generation: {
    id: 'lead_generation',
    name: 'Lead Generation Bot',
    cost: 18,
    icon: '⚡',
    image: '/images/bots/lead-generation.jpg',
    description: 'Advanced lead capture and qualification system powered by AI.',
    features: [
      'Smart lead qualification',
      'Lead scoring system',
      'Contact database management',
      'CRM integration',
      'Automated follow-ups',
      'Lead nurturing workflows',
      'Advanced analytics',
      'Custom qualification rules'
    ],
    benefits: [
      'Automatically qualify hot leads',
      'Increase sales pipeline quality',
      'Reduce manual data entry',
      'Scale lead generation efforts',
      'Improve sales team efficiency'
    ]
  }
}

export default function BotTypeDetailModal({ isOpen, onClose, botType }: BotTypeDetailModalProps) {
  const details = botType ? BOT_DETAILS[botType.id as keyof typeof BOT_DETAILS] : null

  if (!details) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl flex items-center gap-3">
                <span className="text-4xl">{details.icon}</span>
                {details.name}
              </DialogTitle>
              <p className="text-sm text-gray-400 mt-2">{details.description}</p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Cost Badge */}
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-4 py-2">
              ${details.cost}/month
            </Badge>
            <span className="text-sm text-gray-400">Billed monthly</span>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-400" />
              Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {details.features.map((feature, idx) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  className="flex items-start gap-2 p-2 rounded-lg bg-slate-800/50"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              Benefits
            </h3>
            <div className="space-y-2">
              {details.benefits.map((benefit, idx) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  className="flex items-start gap-2 p-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5"
                >
                  <Shield className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3 pt-4 border-t border-slate-700"
          >
            <Button
              onClick={onClose}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11"
            >
              Deploy This Bot
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-11"
            >
              View Pricing
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
