'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, ExternalLink } from 'lucide-react'

interface AlternativePairingService {
  id: string
  name: string
  description: string
  url: string
  developer: string
  features: string[]
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

const ALTERNATIVE_SERVICES: AlternativePairingService[] = [
  {
    id: 'truth-md',
    name: 'TRUTH MD',
    description: 'A reliable WhatsApp bot pairing platform by Courtney Tech',
    url: 'https://truth-md.courtneytech.xyz/',
    developer: 'Courtney Tech',
    features: ['Easy pairing', 'Reliable connection', 'Multi-bot support'],
  },
  {
    id: 'baileys-web',
    description: 'The official Baileys web interface for WhatsApp pairing',
    url: 'https://github.com/WhiskeySockets/Baileys',
    developer: 'Baileys Community',
    name: 'Baileys Official',
    features: ['Official implementation', 'Open source', 'Active community'],
  },
]

export default function AlternativePairingModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50"
          >
            <Card className="bg-slate-900/95 border-slate-700 shadow-2xl">
              <div className="p-8 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-white">
                      Alternative Pairing Methods
                    </h2>
                    <p className="text-sm text-gray-400">
                      Try these other developers' WhatsApp bot pairing platforms
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Services Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                  {ALTERNATIVE_SERVICES.map((service) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="relative"
                    >
                      <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors h-full p-6 space-y-4">
                        {/* Service Info */}
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-white">
                            {service.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            By {service.developer}
                          </p>
                          <p className="text-sm text-gray-300">
                            {service.description}
                          </p>
                        </div>

                        {/* Features */}
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Features
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {service.features.map((feature) => (
                              <span
                                key={feature}
                                className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="pt-2">
                          <a
                            href={service.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                          >
                            <Button
                              className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
                            >
                              <span>Visit Platform</span>
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Info Box */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <p className="text-sm text-amber-200">
                    <strong>Note:</strong> These are third-party platforms provided by other developers. 
                    We recommend reviewing their documentation and security practices before use.
                  </p>
                </div>

                {/* Close Button */}
                <div className="flex gap-3">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1"
                  >
                    Back to Pairing
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
