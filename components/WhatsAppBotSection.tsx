'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Plus, Settings, Rocket, Loader2 } from 'lucide-react'
import WhatsAppBotTemplateSelector from './WhatsAppBotTemplateSelector'
import WhatsAppBotCreationForm from './WhatsAppBotCreationForm'
import WhatsAppBotLinkingPanel from './WhatsAppBotLinkingPanel'
import WhatsAppBotConfigPanel from './WhatsAppBotConfigPanel'
import WhatsAppBotDeploymentPanel from './WhatsAppBotDeploymentPanel'
import { motion, AnimatePresence } from 'framer-motion'

interface Template {
  id: string
  name: string
  description: string
  icon: string
  category: string
  features: string[]
}

interface Bot {
  id: string
  bot_name: string
  status: 'draft' | 'configuring' | 'deployed' | 'paused' | 'error'
  phone_number: string
  created_at: string
}

interface Props {
  token?: string
}

type ViewMode = 'list' | 'select_template' | 'create_bot' | 'link_account' | 'configure' | 'deploy'

export default function WhatsAppBotSection({ token }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null)
  const [bots, setBots] = useState<Bot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreatingBot, setIsCreatingBot] = useState(false)

  useEffect(() => {
    fetchBots()
  }, [token])

  const fetchBots = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/chatbots/whatsapp/bots', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch bots')
      }

      const data = await response.json()
      setBots(data.data || [])
    } catch (err) {
      console.error('[v0] Error fetching bots:', err)
      setError(err instanceof Error ? err.message : 'Failed to load bots')
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    setViewMode('create_bot')
  }

  const handleBotCreated = (botId: string) => {
    setSelectedBotId(botId)
    setIsCreatingBot(false)
    setViewMode('link_account')
    fetchBots()
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedTemplate(null)
    setSelectedBotId(null)
    fetchBots()
  }

  const getStatusColor = (status: Bot['status']) => {
    switch (status) {
      case 'deployed':
        return 'text-green-600 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800'
      case 'configuring':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800'
      case 'paused':
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800'
      case 'error':
        return 'text-red-600 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
      default:
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800'
    }
  }

  const getStatusLabel = (status: Bot['status']) => {
    switch (status) {
      case 'deployed':
        return 'Running'
      case 'configuring':
        return 'Setting Up'
      case 'paused':
        return 'Paused'
      case 'error':
        return 'Error'
      default:
        return 'Draft'
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">WhatsApp Bot Builder</h2>
        <p className="text-muted-foreground">
          Create, configure, and deploy WhatsApp bots using Baileys
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* Main List View */}
        {viewMode === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">{error}</p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={fetchBots}
                    className="mt-2 p-0 h-auto"
                  >
                    Try again
                  </Button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : bots.length === 0 ? (
              <Card className="p-12 text-center space-y-4">
                <div className="text-5xl">🤖</div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    No WhatsApp Bots Yet
                  </h3>
                  <p className="text-muted-foreground">
                    Create your first WhatsApp bot to get started
                  </p>
                </div>
                <Button
                  onClick={() => setViewMode('select_template')}
                  className="mx-auto"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Bot
                </Button>
              </Card>
            ) : (
              <>
                <Button
                  onClick={() => setViewMode('select_template')}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Bot
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bots.map((bot) => (
                    <motion.div
                      key={bot.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h4 className="font-semibold text-foreground">
                                {bot.bot_name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {bot.phone_number}
                              </p>
                            </div>
                            <div
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(
                                bot.status
                              )}`}
                            >
                              {getStatusLabel(bot.status)}
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            Created {new Date(bot.created_at).toLocaleDateString()}
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBotId(bot.id)
                                setViewMode('configure')
                              }}
                            >
                              <Settings className="h-4 w-4 mr-1" />
                              Configure
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBotId(bot.id)
                                setViewMode('deploy')
                              }}
                            >
                              <Rocket className="h-4 w-4 mr-1" />
                              Deploy
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Template Selection */}
        {viewMode === 'select_template' && (
          <motion.div
            key="template"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Button
              variant="outline"
              onClick={handleBackToList}
              className="mb-4"
            >
              ← Back
            </Button>
            <WhatsAppBotTemplateSelector
              onSelect={handleTemplateSelect}
              isLoading={isCreatingBot}
            />
          </motion.div>
        )}

        {/* Bot Creation */}
        {viewMode === 'create_bot' && selectedTemplate && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            <WhatsAppBotCreationForm
              template={selectedTemplate}
              onSuccess={handleBotCreated}
              onBack={() => setViewMode('select_template')}
              token={token}
            />
          </motion.div>
        )}

        {/* Link WhatsApp Account */}
        {viewMode === 'link_account' && selectedBotId && (
          <motion.div
            key="link"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Button
              variant="outline"
              onClick={handleBackToList}
              className="mb-4"
            >
              ← Back
            </Button>
            <WhatsAppBotLinkingPanel
              botId={selectedBotId}
              token={token}
              onLinked={() => setViewMode('configure')}
            />
          </motion.div>
        )}

        {/* Configuration */}
        {viewMode === 'configure' && selectedBotId && (
          <motion.div
            key="config"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Button
              variant="outline"
              onClick={handleBackToList}
              className="mb-4"
            >
              ← Back
            </Button>
            <WhatsAppBotConfigPanel
              botId={selectedBotId}
              token={token}
              onConfigured={() => {
                // Optional: show success message or move to next step
              }}
            />
          </motion.div>
        )}

        {/* Deployment */}
        {viewMode === 'deploy' && selectedBotId && (
          <motion.div
            key="deploy"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Button
              variant="outline"
              onClick={handleBackToList}
              className="mb-4"
            >
              ← Back
            </Button>
            <WhatsAppBotDeploymentPanel
              botId={selectedBotId}
              token={token}
              onDeployed={() => {
                setTimeout(() => handleBackToList(), 2000)
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
