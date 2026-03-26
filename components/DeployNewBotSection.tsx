'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Loader2, Zap, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import WhatsAppBotTemplateSelector from './WhatsAppBotTemplateSelector'

interface Props {
  token?: string
  onBotCreated?: (botId: string) => void
  sessionValidated?: boolean
}

type Step = 'check-session' | 'template' | 'create'

export default function DeployNewBotSection({ token, onBotCreated, sessionValidated = false }: Props) {
  const [currentStep, setCurrentStep] = useState<Step>('check-session')
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null)
  const [isSessionValidated, setIsSessionValidated] = useState(sessionValidated)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if session is validated from localStorage
    const sessionValidated = localStorage.getItem('session_validated') === 'true'
    const hasSession = localStorage.getItem('truthmd_session')

    if (sessionValidated && hasSession) {
      setIsSessionValidated(true)
      setCurrentStep('template')
    } else {
      setCurrentStep('check-session')
    }
    setLoading(false)
  }, [])

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template)
    setCurrentStep('create')
  }

  const handleReset = () => {
    setCurrentStep('template')
    setSelectedTemplate(null)
  }

  const handleCreateBot = () => {
    if (selectedTemplate) {
      onBotCreated?.(selectedTemplate.id)
    }
  }

  const redirectToValidation = () => {
    window.location.href = '/chatbots-ai/validate'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Deploy New Bot</h2>
        <p className="text-muted-foreground">
          Select a template and create your bot
        </p>
      </div>

      {/* Step 1: Check Session */}
      {currentStep === 'check-session' && !isSessionValidated && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-8 space-y-6 text-center bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <div className="flex justify-center">
              <AlertCircle className="h-12 w-12 text-amber-600 dark:text-amber-400" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-100">
                Session Not Validated
              </h3>
              <p className="text-amber-800 dark:text-amber-200">
                You need to validate your TRUTH MD session before deploying bots.
              </p>
            </div>

            <div className="p-4 bg-white/50 dark:bg-black/30 rounded-lg text-sm text-left space-y-2">
              <p className="font-semibold text-amber-900 dark:text-amber-100">Steps to validate:</p>
              <ol className="space-y-2 ml-4 list-decimal text-amber-800 dark:text-amber-200">
                <li>Get your pairing code from the pairing platform</li>
                <li>Send the code to TRUTH MD WhatsApp</li>
                <li>Receive your session ID</li>
                <li>Validate it here</li>
              </ol>
            </div>

            <Button
              onClick={redirectToValidation}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12"
            >
              Go to Session Validator
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Progress Steps */}
      {isSessionValidated && (
        <div className="flex gap-4 mb-8">
          {[
            { step: 'template', label: 'Choose Template', icon: '📋' },
            { step: 'create', label: 'Create Bot', icon: '⚙️' },
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
                    : currentStep === 'create'
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {item.icon}
              </div>
              <div className="text-sm font-medium hidden sm:block">{item.label}</div>
              {idx < 1 && (
                <div
                  className={`flex-1 h-1 rounded-full ${
                    ['template', 'create'].indexOf(currentStep) > idx
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                />
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Step 2: Template Selection */}
      {currentStep === 'template' && isSessionValidated && (
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

      {/* Step 3: Create Bot */}
      {currentStep === 'create' && selectedTemplate && isSessionValidated && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="p-8 space-y-6 text-center">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Ready to Deploy!</h3>
              <p className="text-muted-foreground">
                Your session is validated and you can now create and deploy bots.
              </p>
            </div>

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
                Choose Different Template
              </Button>
              <Button
                onClick={handleCreateBot}
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
