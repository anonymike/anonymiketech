'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface Template {
  id: string
  name: string
  description: string
  category: string
  icon: string
  features: string[]
  repository_url: string
}

interface Props {
  onSelect: (template: Template) => void
  isLoading?: boolean
  onQRAuthClick?: () => void
}

export default function WhatsAppBotTemplateSelector({
  onSelect,
  isLoading = false,
  onQRAuthClick,
}: Props) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/chatbots/whatsapp/templates')

      if (!response.ok) {
        throw new Error('Failed to fetch templates')
      }

      const data = await response.json()
      setTemplates(data.data || [])
    } catch (err) {
      console.error('[v0] Error fetching templates:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to load templates'
      )
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Choose a Bot Template</h3>
        <p className="text-sm text-muted-foreground">
          Select a pre-configured template to get started with your WhatsApp bot
        </p>
      </div>

      {/* QR Authentication Quick Start */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border border-primary/30 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 space-y-3"
      >
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🔐</span>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-1">Quick Start: QR Code Authentication</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Before deploying a bot, you'll authenticate your WhatsApp account using a secure QR code. This establishes a session between your bot and WhatsApp Web.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={onQRAuthClick}
              >
                📱 Start QR Auth
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs h-7 text-muted-foreground"
                onClick={() => window.open('https://www.whatsapp.com/business/', '_blank')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">{error}</p>
            <Button
              variant="link"
              size="sm"
              onClick={fetchTemplates}
              className="mt-2 p-0 h-auto"
            >
              Try again
            </Button>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold mb-4">Select Your Bot Type</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedId === template.id
                  ? 'ring-2 ring-primary'
                  : 'hover:border-primary'
              }`}
              onClick={() => setSelectedId(template.id)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="text-4xl">{template.icon}</div>
                  {selectedId === template.id && (
                    <div className="h-5 w-5 rounded-full bg-primary" />
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">
                    {template.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Features:
                  </p>
                  <ul className="space-y-1">
                    {template.features.slice(0, 3).map((feature, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-muted-foreground flex items-center gap-2"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => onSelect(template)}
                  disabled={isLoading || selectedId !== template.id}
                  className="w-full"
                  variant={selectedId === template.id ? 'default' : 'outline'}
                >
                  {isLoading && selectedId === template.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Select Template'
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
        </div>
      </div>
    </div>
  )
}
