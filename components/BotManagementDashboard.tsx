'use client'

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BotStatusCard } from './BotStatusCard'
import { BotLogsViewer } from './BotLogsViewer'
import { BotMetricsDashboard } from './BotMetricsDashboard'
import { Plus, Loader2 } from 'lucide-react'

interface Bot {
  id: string
  name: string
  template_id: string
  phone_number?: string
  status: string
  created_at: string
}

interface BotManagementDashboardProps {
  userId: string
}

export function BotManagementDashboard({ userId }: BotManagementDashboardProps) {
  const [bots, setBots] = useState<Bot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null)

  useEffect(() => {
    loadBots()
  }, [userId])

  const loadBots = async () => {
    try {
      setIsLoading(true)
      // This would fetch from your bots API
      // For now, we'll show an empty state
      setBots([])
    } catch (err) {
      console.error('[v0] Error loading bots:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedBot = bots.find((b) => b.id === selectedBotId) || bots[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bot Manager</h1>
          <p className="text-gray-600 mt-1">Deploy, manage, and monitor your WhatsApp bots</p>
        </div>
        <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Deploy New Bot
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </CardContent>
        </Card>
      ) : bots.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-48 gap-4">
            <p className="text-gray-600">No bots deployed yet</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Deploy Your First Bot
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Bots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bots.map((bot) => (
                <div
                  key={bot.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedBotId(bot.id)}
                >
                  <BotStatusCard
                    botId={bot.id}
                    botName={bot.name}
                    phoneNumber={bot.phone_number}
                    template={bot.template_id}
                    userId={userId}
                    onDelete={async (id) => {
                      setBots(bots.filter((b) => b.id !== id))
                    }}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            {selectedBot ? (
              <BotMetricsDashboard botId={selectedBot.id} userId={userId} />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-48 text-gray-500">
                  Select a bot to view metrics
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            {selectedBot ? (
              <BotLogsViewer botId={selectedBot.id} userId={userId} />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-48 text-gray-500">
                  Select a bot to view logs
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
