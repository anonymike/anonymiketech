'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, CheckCircle2, Zap, Shield, Clock, Server } from 'lucide-react'
import { motion } from 'framer-motion'

interface DeploymentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  botName?: string
  botId?: string
}

const deploymentSteps = [
  {
    number: 1,
    title: 'Pair Your WhatsApp',
    description: 'Visit TRUTH MD pairing platform and enter your WhatsApp number to generate a pairing code. Visit https://truth-md.courtneytech.xyz/',
    icon: '📱',
    color: 'bg-blue-500/10 border-blue-500/30',
  },
  {
    number: 2,
    title: 'Send Pairing Code',
    description: 'Copy your TECH-WORD code and send it to our TRUTH MD WhatsApp bot for authentication.',
    icon: '💬',
    color: 'bg-purple-500/10 border-purple-500/30',
  },
  {
    number: 3,
    title: 'Receive Session ID - It Will be sent to Your Whatsapp[Message Yourself]',
    description: 'Get your unique session ID from TRUTH MD after successful pairing verification.',
    icon: '🔐',
    color: 'bg-emerald-500/10 border-emerald-500/30',
  },
  {
    number: 4,
    title: 'Validate Session',
    description: 'Paste your session ID in our validator to activate your bot hosting capabilities.',
    icon: '✅',
    color: 'bg-cyan-500/10 border-cyan-500/30',
  },
  {
    number: 5,
    title: 'Deploy Bot',
    description: 'Select a template, configure your bot, and deploy it instantly on our platform.',
    icon: '🚀',
    color: 'bg-orange-500/10 border-orange-500/30',
  },
]

const features = [
  {
    icon: <Server className="h-5 w-5" />,
    title: 'Instant Hosting',
    description: 'Your bot is deployed and running immediately on our reliable infrastructure.',
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: 'High Performance',
    description: 'Optimized servers ensure your bot responds instantly to every message.',
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'Secure & Private',
    description: 'Enterprise-grade security with encrypted session management.',
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: '24/7 Uptime',
    description: 'Automatic failover and monitoring keep your bot online round the clock.',
  },
]

export default function DeploymentDetailsModal({
  isOpen,
  onClose,
  botName,
  botId,
}: DeploymentDetailsModalProps) {
  const [selectedStep, setSelectedStep] = useState(0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 border-slate-700">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-700">
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-bold text-white">
              Deploy Your Bot with TRUTH MD
            </DialogTitle>
            {botName && (
              <p className="text-sm text-gray-400">Bot: {botName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Introduction */}
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-300">
                Our platform provides seamless hosting and deployment for TRUTH MD bots. Follow the simple 5-step process below to get your bot live in minutes.
              </p>
            </div>
          </div>

          {/* Deployment Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Deployment Process</h3>
            <div className="grid gap-3">
              {deploymentSteps.map((step, index) => (
                <motion.button
                  key={step.number}
                  onClick={() => setSelectedStep(index)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-left transition-all"
                >
                  <Card
                    className={`p-4 cursor-pointer transition-all border ${selectedStep === index
                        ? 'bg-blue-500/20 border-blue-500/50'
                        : `${step.color} hover:border-opacity-50`
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 text-2xl flex-shrink-0">
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-400">Step {step.number}</span>
                          {selectedStep === index && (
                            <CheckCircle2 className="h-4 w-4 text-blue-400" />
                          )}
                        </div>
                        <h4 className="font-semibold text-white mb-1">{step.title}</h4>
                        <p className="text-sm text-gray-300">{step.description}</p>
                      </div>
                      <ChevronRightIcon className={`h-5 w-5 text-gray-600 transition-transform ${selectedStep === index ? 'rotate-90' : ''}`} />
                    </div>
                  </Card>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Why Choose Our Platform</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg space-y-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                      {feature.icon}
                    </div>
                    <h4 className="font-semibold text-white">{feature.title}</h4>
                  </div>
                  <p className="text-sm text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* TRUTH MD Integration */}
          <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              <h4 className="font-semibold text-white">TRUTH MD Integration</h4>
            </div>
            <p className="text-sm text-gray-300">
              We've partnered with TRUTH MD to provide the most seamless bot pairing and hosting experience. Your session is securely managed and can be used across our entire platform ecosystem.
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                One-time pairing process
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                Unlimited bot deployments
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                Session never expires
              </li>
            </ul>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700">
            <Button
              onClick={() => {
                onClose()
                window.open('https://truth-md.courtneytech.xyz/', '_blank')
              }}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold h-12"
            >
              <Zap className="h-4 w-4 mr-2" />
              Get Pairing Code
            </Button>
            <Button
              onClick={() => {
                onClose()
                window.location.href = '/chatbots-ai/validate'
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12"
            >
              Validate Session
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              className="flex-1 h-12"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Simple chevron icon component
function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  )
}
