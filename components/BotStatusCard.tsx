'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Play, Pause, Square, RefreshCw, Trash2, Info } from 'lucide-react'
import DeploymentDetailsModal from './DeploymentDetailsModal'

interface BotStatusCardProps {
  botId: string
  botName: string
  phoneNumber?: string
  template: string
  userId: string
  onDelete?: (botId: string) => Promise<void>
}

export function BotStatusCard({
  botId,
  botName,
  phoneNumber,
  template,
  userId,
  onDelete,
}: BotStatusCardProps) {
  const [status, setStatus] = useState<'running' | 'stopped' | 'error' | 'paused' | 'loading'>('loading')
  const [isControlling, setIsControlling] = useState(false)
  const [uptime, setUptime] = useState<number>(0)
  const [showDeploymentModal, setShowDeploymentModal] = useState(false)

  // Fetch initial status
  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [botId])

  const fetchStatus = async () => {
    try {
      const response = await fetch(`/api/chatbots/whatsapp/bots/control?botId=${botId}&userId=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', botId, userId }),
      })

      if (response.ok) {
        const data = await response.json()
        setStatus(data.status.status)
        if (data.status.startedAt) {
          setUptime(Date.now() - new Date(data.status.startedAt).getTime())
        }
      }
    } catch (err) {
      console.error('[v0] Error fetching bot status:', err)
    }
  }

  const handleControl = async (action: 'start' | 'stop' | 'pause' | 'resume') => {
    setIsControlling(true)
    try {
      const response = await fetch('/api/chatbots/whatsapp/bots/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, botId, userId }),
      })

      if (response.ok) {
        const data = await response.json()
        setStatus(data.status)
      }
    } catch (err) {
      console.error('[v0] Error controlling bot:', err)
    } finally {
      setIsControlling(false)
    }
  }

  const formatUptime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'running':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'stopped':
        return 'bg-gray-100 text-gray-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{botName}</CardTitle>
            <CardDescription className="text-xs">
              {template} {phoneNumber && `• ${phoneNumber}`}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(status)}>
            {status === 'loading' ? 'Loading...' : status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Uptime */}
        {status === 'running' && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Uptime:</span>
            <span className="font-mono font-semibold">{formatUptime(uptime)}</span>
          </div>
        )}

        {/* Error state */}
        {status === 'error' && (
          <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">Bot encountered an error. Try restarting.</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2 pt-2 flex-wrap">
          {status === 'running' ? (
            <>
              <Button
                onClick={() => handleControl('pause')}
                disabled={isControlling}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button
                onClick={() => handleControl('stop')}
                disabled={isControlling}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </>
          ) : status === 'paused' ? (
            <>
              <Button
                onClick={() => handleControl('resume')}
                disabled={isControlling}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
              <Button
                onClick={() => handleControl('stop')}
                disabled={isControlling}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => handleControl('start')}
                disabled={isControlling}
                size="sm"
                className="flex-1"
              >
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
              {onDelete && (
                <Button
                  onClick={() => onDelete(botId)}
                  disabled={isControlling}
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </>
          )}

          <Button
            onClick={fetchStatus}
            disabled={isControlling}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => setShowDeploymentModal(true)}
            variant="outline"
            size="sm"
            title="Learn about deployment and TRUTH MD integration"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>

        {/* Deployment Details Modal */}
        <DeploymentDetailsModal
          isOpen={showDeploymentModal}
          onClose={() => setShowDeploymentModal(false)}
          botName={botName}
          botId={botId}
        />
      </CardContent>
    </Card>
  )
}
