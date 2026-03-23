'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { AlertCircle, Loader2, Save, Plus, Trash2, Clock, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { Switch } from '@/components/ui/switch'

interface BotConfig {
  id?: string
  prompt: string
  welcome_message: string
  goodbye_message: string
  commands: Record<string, string>
  response_timeout?: number
  rate_limit_messages?: number
  rate_limit_window?: number
  business_hours?: {
    enabled: boolean
    start_time: string
    end_time: string
    timezone: string
  }
  access_control?: {
    whitelist_enabled: boolean
    whitelist: string[]
  }
  branding?: {
    company_name: string
    logo_url?: string
    primary_color?: string
  }
}

interface Props {
  botId: string
  token?: string
  onConfigured?: () => void
  showLinkingPrompt?: boolean
}

const DEFAULT_CONFIG: BotConfig = {
  prompt: 'You are a helpful WhatsApp bot assistant. Be concise and friendly.',
  welcome_message: 'Hello! Welcome to our WhatsApp Bot. How can I help you today?',
  goodbye_message: 'Thank you for chatting with us. Goodbye!',
  commands: {
    '/help': 'Show available commands',
    '/menu': 'Show main menu',
    '/about': 'About this bot',
  },
  response_timeout: 30,
  rate_limit_messages: 100,
  rate_limit_window: 3600,
  business_hours: {
    enabled: false,
    start_time: '09:00',
    end_time: '17:00',
    timezone: 'UTC',
  },
  access_control: {
    whitelist_enabled: false,
    whitelist: [],
  },
  branding: {
    company_name: 'My Company',
  },
}

export default function WhatsAppBotConfigPanel({
  botId,
  token,
  onConfigured,
  showLinkingPrompt = false,
}: Props) {
  const [config, setConfig] = useState<BotConfig>(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [newCommand, setNewCommand] = useState('')
  const [newCommandDesc, setNewCommandDesc] = useState('')
  const [newWhitelistItem, setNewWhitelistItem] = useState('')
  const [isLinked, setIsLinked] = useState(true)
  const [checkingLinkStatus, setCheckingLinkStatus] = useState(true)

  useEffect(() => {
    fetchConfig()
    if (showLinkingPrompt) {
      checkLinkingStatus()
    }
  }, [botId, token, showLinkingPrompt])

  const checkLinkingStatus = async () => {
    try {
      setCheckingLinkStatus(true)
      const response = await fetch(
        `/api/chatbots/whatsapp/bots/${botId}/status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setIsLinked(data.data.isLinked)
      } else {
        setIsLinked(false)
      }
    } catch (err) {
      console.error('[v0] Error checking linking status:', err)
      setIsLinked(false)
    } finally {
      setCheckingLinkStatus(false)
    }
  }

  const fetchConfig = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/chatbots/whatsapp/bots/${botId}/config`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.ok) {
        const data = await response.json()
        if (data.data) {
          setConfig(data.data)
        } else {
          setConfig(DEFAULT_CONFIG)
        }
      } else if (response.status === 404) {
        setConfig(DEFAULT_CONFIG)
      } else {
        throw new Error('Failed to fetch config')
      }
    } catch (err) {
      console.error('[v0] Error fetching config:', err)
      setConfig(DEFAULT_CONFIG)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      const response = await fetch(
        `/api/chatbots/whatsapp/bots/${botId}/config`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(config),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save config')
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      onConfigured?.()
    } catch (err) {
      console.error('[v0] Error saving config:', err)
      setError(err instanceof Error ? err.message : 'Failed to save config')
    } finally {
      setSaving(false)
    }
  }

  const addCommand = () => {
    if (newCommand.trim() && newCommandDesc.trim()) {
      setConfig({
        ...config,
        commands: {
          ...config.commands,
          [newCommand.trim()]: newCommandDesc.trim(),
        },
      })
      setNewCommand('')
      setNewCommandDesc('')
    }
  }

  const removeCommand = (command: string) => {
    const { [command]: _, ...rest } = config.commands
    setConfig({ ...config, commands: rest })
  }

  const addWhitelistItem = () => {
    if (newWhitelistItem.trim() && config.access_control) {
      setConfig({
        ...config,
        access_control: {
          ...config.access_control,
          whitelist: [...config.access_control.whitelist, newWhitelistItem.trim()],
        },
      })
      setNewWhitelistItem('')
    }
  }

  const removeWhitelistItem = (item: string) => {
    if (config.access_control) {
      setConfig({
        ...config,
        access_control: {
          ...config.access_control,
          whitelist: config.access_control.whitelist.filter(w => w !== item),
        },
      })
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Configure Your Bot</h3>
        <p className="text-sm text-muted-foreground">
          Customize your bot's behavior, messages, and settings
        </p>
      </div>

      {showLinkingPrompt && !checkingLinkStatus && !isLinked && (
        <div className="rounded-lg border border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950 p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
              WhatsApp Account Not Linked
            </p>
            <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-1">
              You must link your WhatsApp account before configuring the bot. Please go back and complete the linking process.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/50 bg-green-50 dark:bg-green-950 p-4">
          <p className="text-sm text-green-700 dark:text-green-300">
            ✓ Configuration saved successfully!
          </p>
        </div>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="commands">Commands</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>AI Prompt</Label>
              <Textarea
                value={config.prompt}
                onChange={(e) =>
                  setConfig({ ...config, prompt: e.target.value })
                }
                placeholder="Define how your bot should behave..."
                rows={4}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                This prompt defines your bot's personality and behavior
              </p>
            </div>

            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={config.branding?.company_name || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    branding: {
                      ...config.branding,
                      company_name: e.target.value,
                    },
                  })
                }
                placeholder="Your company name"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Primary Color (Hex)</Label>
              <Input
                value={config.branding?.primary_color || '#000000'}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    branding: {
                      ...config.branding,
                      primary_color: e.target.value,
                    },
                  })
                }
                type="color"
                className="bg-background h-10"
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Welcome Message</Label>
              <Textarea
                value={config.welcome_message}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    welcome_message: e.target.value,
                  })
                }
                placeholder="Welcome message when user starts chat..."
                rows={3}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Goodbye Message</Label>
              <Textarea
                value={config.goodbye_message}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    goodbye_message: e.target.value,
                  })
                }
                placeholder="Goodbye message when conversation ends..."
                rows={3}
                className="bg-background"
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="commands" className="space-y-4">
          <Card className="p-6 space-y-4">
            <div className="space-y-3">
              <p className="text-sm font-medium">Add Custom Commands</p>
              <div className="grid grid-cols-1 gap-2">
                <Input
                  placeholder="Command (e.g., /help)"
                  value={newCommand}
                  onChange={(e) => setNewCommand(e.target.value)}
                  className="bg-background"
                />
                <Input
                  placeholder="Command description"
                  value={newCommandDesc}
                  onChange={(e) => setNewCommandDesc(e.target.value)}
                  className="bg-background"
                />
                <Button
                  onClick={addCommand}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Command
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Available Commands</p>
              <div className="space-y-2">
                {Object.entries(config.commands).map(([cmd, desc]) => (
                  <div
                    key={cmd}
                    className="flex items-center justify-between bg-muted p-3 rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-mono font-semibold">{cmd}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <Button
                      onClick={() => removeCommand(cmd)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card className="p-6 space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Business Hours
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="cursor-pointer">
                      Enable Business Hours
                    </Label>
                    <Switch
                      checked={config.business_hours?.enabled || false}
                      onCheckedChange={(checked) =>
                        setConfig({
                          ...config,
                          business_hours: {
                            ...config.business_hours,
                            enabled: checked,
                          },
                        })
                      }
                    />
                  </div>

                  {config.business_hours?.enabled && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Input
                          type="time"
                          value={config.business_hours.start_time}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              business_hours: {
                                ...config.business_hours,
                                start_time: e.target.value,
                              },
                            })
                          }
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Input
                          type="time"
                          value={config.business_hours.end_time}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              business_hours: {
                                ...config.business_hours,
                                end_time: e.target.value,
                              },
                            })
                          }
                          className="bg-background"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Access Control
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="cursor-pointer">Enable Whitelist</Label>
                    <Switch
                      checked={config.access_control?.whitelist_enabled || false}
                      onCheckedChange={(checked) =>
                        setConfig({
                          ...config,
                          access_control: {
                            ...config.access_control,
                            whitelist_enabled: checked,
                          },
                        })
                      }
                    />
                  </div>

                  {config.access_control?.whitelist_enabled && (
                    <div className="space-y-2">
                      <Input
                        placeholder="Add phone number (e.g., +1234567890)"
                        value={newWhitelistItem}
                        onChange={(e) =>
                          setNewWhitelistItem(e.target.value)
                        }
                        className="bg-background"
                      />
                      <Button
                        onClick={addWhitelistItem}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Whitelist
                      </Button>

                      {config.access_control.whitelist.length > 0 && (
                        <div className="space-y-2">
                          {config.access_control.whitelist.map((item) => (
                            <div
                              key={item}
                              className="flex items-center justify-between bg-muted p-2 rounded text-sm"
                            >
                              <span>{item}</span>
                              <Button
                                onClick={() => removeWhitelistItem(item)}
                                variant="ghost"
                                size="sm"
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Rate Limiting</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Messages per Period</Label>
                    <Input
                      type="number"
                      value={config.rate_limit_messages || 100}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          rate_limit_messages: parseInt(e.target.value),
                        })
                      }
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Period (seconds)</Label>
                    <Input
                      type="number"
                      value={config.rate_limit_window || 3600}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          rate_limit_window: parseInt(e.target.value),
                        })
                      }
                      className="bg-background"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={saving || (showLinkingPrompt && !isLinked)}
          className="flex-1"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
}
