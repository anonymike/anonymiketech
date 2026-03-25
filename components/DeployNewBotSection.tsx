'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Loader2, QrCode, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import WhatsAppBotTemplateSelector from './WhatsAppBotTemplateSelector'
import WhatsAppQRAuth from './WhatsAppQRAuth'

interface Props {
  token?: string
  onBotCreated?: (botId: string) => void
}

type Step = 'template' | 'qr-auth' | 'configure'

export default function DeployNewBotSection({ token, onBotCreated }: Props) {
  const [currentStep, setCurrentStep] = useState<Step>('template')
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null)
  const [isQRAuthenticated, setIsQRAuthenticated] = useState(false)
  const [sessionPhoneNumber, setSessionPhoneNumber] = useState<string | null>(null)

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template)
    setCurrentStep('qr-auth')
  }

  const handleQRAuthSuccess = (phoneNumber: string) => {
    setIsQRAuthenticated(true)
    setSessionPhoneNumber(phoneNumber)
    setCurrentStep('configure')
  }

  const handleReset = () => {
    setCurrentStep('template')
    setSelectedTemplate(null)
    setIsQRAuthenticated(false)
    setSessionPhoneNumber(null)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Deploy New Bot</h2>
        <p className="text-muted-foreground">
          Create and deploy a new AI chatbot in three simple steps
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex gap-4 mb-8">
        {[
          { step: 'template', label: 'Choose Template', icon: '📋' },
          { step: 'qr-auth', label: 'Authenticate QR', icon: '🔐' },
          { step: 'configure', label: 'Configure Bot', icon: '⚙️' },
        ].map((item, idx) => (
          <motion.div
            key={item.step}
            className="flex items-center gap-3 flex-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                currentStep === item.step
                  ? 'bg-primary text-primary-foreground'
                  : ['template', 'qr-auth'].includes(currentStep) && currentStep === 'configure'
                  ? 'bg-green-500 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {item.icon}
            </div>
            <div className="text-sm font-medium hidden sm:block">{item.label}</div>
            {idx < 2 && (
              <div
                className={`flex-1 h-1 rounded-full ${
                  ['template', 'qr-auth', 'configure'].indexOf(currentStep) > idx
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Step 1: Template Selection */}
      {currentStep === 'template' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="p-6">
            <WhatsAppBotTemplateSelector
              onSelect={handleTemplateSelect}
              isLoading={false}
            />
          </Card>
        </motion.div>
      )}

      {/* Step 2: QR Authentication */}
      {currentStep === 'qr-auth' && selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <Card className="p-6 space-y-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <QrCode className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Authenticate Your WhatsApp Account</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Scan the QR code with your WhatsApp app to establish a secure session
                </p>
              </div>
            </div>

            <WhatsAppQRAuth
              botTemplate={selectedTemplate}
              onSuccess={handleQRAuthSuccess}
              token={token}
            />
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1"
            >
              Back
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Configuration Complete */}
      {currentStep === 'configure' && selectedTemplate && isQRAuthenticated && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="p-8 space-y-6 text-center">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <span className="text-3xl">✓</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Configuration Complete!</h3>
              <p className="text-muted-foreground">
                Your WhatsApp account is authenticated and ready to deploy bots.
              </p>
            </div>

            {sessionPhoneNumber && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Authenticated Phone Number</p>
                <p className="font-mono text-sm font-medium">{sessionPhoneNumber}</p>
              </div>
            )}

            <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg">
              <p className="text-sm text-primary font-medium mb-2">Template Selected</p>
              <div className="flex items-center gap-3 p-3 bg-background rounded">
                <span className="text-2xl">{selectedTemplate?.icon}</span>
                <div className="text-left">
                  <p className="font-medium text-sm">{selectedTemplate?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedTemplate?.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1"
              >
                Deploy Another Bot
              </Button>
              <Button
                onClick={() => {
                  // Trigger bot creation flow
                  onBotCreated?.(selectedTemplate.id)
                }}
                className="flex-1"
              >
                <Zap className="h-4 w-4 mr-2" />
                Create Bot Instance
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
