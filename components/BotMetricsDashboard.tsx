'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface BotMetrics {
  botId: string
  uptime: number
  messagesProcessed: number
  errorCount: number
  lastMessage?: string
  cpuUsage?: number
  memoryUsage?: number
}

interface BotMetricsDashboardProps {
  botId: string
  userId: string
}

export function BotMetricsDashboard({ botId, userId }: BotMetricsDashboardProps) {
  const [metrics, setMetrics] = useState<BotMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(
          `/api/chatbots/whatsapp/bots/metrics?botId=${botId}&userId=${userId}`
        )
        if (response.ok) {
          const data = await response.json()
          setMetrics(data.metrics)
        }
      } catch (err) {
        console.error('[v0] Error fetching metrics:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [botId, userId])

  const formatUptime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m ${totalSeconds % 60}s`
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    )
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48 text-gray-500">
          No metrics available
        </CardContent>
      </Card>
    )
  }

  const metricsData = [
    {
      title: 'Uptime',
      value: formatUptime(metrics.uptime),
      unit: '',
      icon: '⏱️',
    },
    {
      title: 'Messages',
      value: metrics.messagesProcessed.toString(),
      unit: 'processed',
      icon: '💬',
    },
    {
      title: 'Errors',
      value: metrics.errorCount.toString(),
      unit: 'errors',
      icon: '⚠️',
    },
    ...(metrics.cpuUsage !== undefined
      ? [
          {
            title: 'CPU',
            value: metrics.cpuUsage.toFixed(1),
            unit: '%',
            icon: '🔧',
          },
        ]
      : []),
    ...(metrics.memoryUsage !== undefined
      ? [
          {
            title: 'Memory',
            value: (metrics.memoryUsage / 1024 / 1024).toFixed(1),
            unit: 'MB',
            icon: '💾',
          },
        ]
      : []),
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {metricsData.map((metric) => (
        <Card key={metric.title} className="bg-gradient-to-br from-gray-50 to-gray-100">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="text-2xl">{metric.icon}</div>
              <p className="text-xs text-gray-600">{metric.title}</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                {metric.unit && <span className="text-xs text-gray-500">{metric.unit}</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
