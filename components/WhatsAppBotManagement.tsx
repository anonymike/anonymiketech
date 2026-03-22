'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertCircle,
  Loader2,
  Copy,
  MoreVertical,
  Play,
  Pause,
  Trash2,
  Settings,
  Activity,
  TrendingUp,
  MessageSquare,
  Clock,
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Bot {
  id: string
  name: string
  phone_number: string
  status: 'active' | 'paused' | 'error'
  created_at: string
  messages_sent: number
  messages_received: number
  last_activity: string
  template_id?: string
}

interface Analytics {
  total_messages: number
  messages_today: number
  active_users: number
  uptime_percentage: number
  avg_response_time: number
}

interface Props {
  token?: string
  botId?: string
  onBotSelect?: (botId: string) => void
}

export default function WhatsAppBotManagement({ token, botId, onBotSelect }: Props) {
  const [bots, setBots] = useState<Bot[]>([])
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetchBots()
    if (botId) {
      fetchAnalytics(botId)
    }
  }, [token, botId])

  const fetchBots = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/chatbots/whatsapp/bots', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error('Failed to fetch bots')

      const data = await response.json()
      setBots(data.data || [])

      if (botId && data.data) {
        const bot = data.data.find((b: Bot) => b.id === botId)
        if (bot) setSelectedBot(bot)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bots')
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async (id: string) => {
    try {
      const response = await fetch(`/api/chatbots/whatsapp/bots/${id}/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.data)
      }
    } catch (err) {
      console.error('[v0] Analytics fetch error:', err)
    }
  }

  const handleBotAction = async (
    botId: string,
    action: 'pause' | 'resume' | 'delete'
  ) => {
    try {
      setActionLoading(botId)
      setError(null)

      const response = await fetch(`/api/chatbots/whatsapp/bots/${botId}`, {
        method: action === 'delete' ? 'DELETE' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: action === 'delete' ? undefined : action,
          status: action === 'pause' ? 'paused' : action === 'resume' ? 'active' : undefined,
        }),
      })

      if (!response.ok) throw new Error(`Failed to ${action} bot`)

      setSuccess(`Bot ${action}d successfully`)
      setTimeout(() => setSuccess(null), 3000)
      fetchBots()
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} bot`)
    } finally {
      setActionLoading(null)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getStatusColor = (status: Bot['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
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
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Bot Management Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor and manage your WhatsApp bots
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/50 bg-green-50 dark:bg-green-950 p-4">
          <p className="text-sm text-green-700 dark:text-green-300">✓ {success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bots List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-semibold text-sm">Your Bots</h3>
          {bots.length === 0 ? (
            <Card className="p-4 text-center text-muted-foreground">
              <p className="text-sm">No bots created yet</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {bots.map((bot) => (
                <motion.div
                  key={bot.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => {
                    setSelectedBot(bot)
                    onBotSelect?.(bot.id)
                    fetchAnalytics(bot.id)
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    selectedBot?.id === bot.id
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 dark:border-gray-800 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{bot.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {bot.phone_number}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusColor(bot.status)}`}>
                      {bot.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Bot Details & Analytics */}
        <div className="lg:col-span-2 space-y-4">
          {selectedBot ? (
            <>
              <Card className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedBot.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedBot.phone_number}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          handleBotAction(
                            selectedBot.id,
                            selectedBot.status === 'active' ? 'pause' : 'resume'
                          )
                        }
                        disabled={actionLoading === selectedBot.id}
                      >
                        {selectedBot.status === 'active' ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause Bot
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Resume Bot
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleBotAction(selectedBot.id, 'delete')}
                        disabled={actionLoading === selectedBot.id}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      Messages Sent
                    </div>
                    <p className="text-xl font-semibold">
                      {selectedBot.messages_sent || 0}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      Messages Received
                    </div>
                    <p className="text-xl font-semibold">
                      {selectedBot.messages_received || 0}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Created
                    </div>
                    <p className="text-xs">
                      {new Date(selectedBot.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Activity className="h-3 w-3" />
                      Last Activity
                    </div>
                    <p className="text-xs">
                      {new Date(selectedBot.last_activity).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Bot ID */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Bot ID</p>
                      <p className="font-mono text-sm">{selectedBot.id}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedBot.id, selectedBot.id)}
                    >
                      {copiedId === selectedBot.id ? (
                        'Copied!'
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Analytics */}
              {analytics && (
                <Card className="p-6 space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Performance Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total Messages</p>
                      <p className="text-2xl font-bold">{analytics.total_messages}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Messages Today</p>
                      <p className="text-2xl font-bold">{analytics.messages_today}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Active Users</p>
                      <p className="text-2xl font-bold">{analytics.active_users}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                      <p className="text-2xl font-bold">{analytics.uptime_percentage}%</p>
                    </div>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card className="p-6 text-center text-muted-foreground">
              <p className="text-sm">Select a bot to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
