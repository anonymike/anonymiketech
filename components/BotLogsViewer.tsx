'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Download, X, Loader2 } from 'lucide-react'

interface BotLog {
  id: string
  botId: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  metadata?: Record<string, any>
  createdAt: string
}

interface BotLogsViewerProps {
  botId: string
  userId: string
}

export function BotLogsViewer({ botId, userId }: BotLogsViewerProps) {
  const [logs, setLogs] = useState<BotLog[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'info' | 'warn' | 'error' | 'debug'>('all')
  const logsEndRef = useRef<HTMLDivElement>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [logs])

  // Load initial logs and start streaming
  useEffect(() => {
    loadInitialLogs()
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [botId, userId])

  const loadInitialLogs = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `/api/chatbots/whatsapp/bots/logs?botId=${botId}&userId=${userId}&limit=100`
      )
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || [])
        startStreamingLogs()
      }
    } catch (err) {
      console.error('[v0] Error loading logs:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const startStreamingLogs = () => {
    try {
      const url = `/api/chatbots/whatsapp/bots/logs?botId=${botId}&userId=${userId}&stream=true`
      const eventSource = new EventSource(url)

      eventSource.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data)

          if (data.type === 'initial_logs') {
            setLogs(data.logs)
          } else if (data.type === 'new_log') {
            setLogs((prev) => [...prev, data.log])
          }
        } catch (err) {
          console.error('[v0] Error parsing log event:', err)
        }
      })

      eventSource.onerror = () => {
        eventSource.close()
        setIsStreaming(false)
      }

      eventSourceRef.current = eventSource
      setIsStreaming(true)
    } catch (err) {
      console.error('[v0] Error starting log stream:', err)
    }
  }

  const filteredLogs = logs.filter((log) => filter === 'all' || log.level === filter)

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'warn':
        return 'bg-yellow-100 text-yellow-800'
      case 'debug':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const exportLogs = () => {
    const content = logs
      .map(
        (log) =>
          `[${new Date(log.createdAt).toISOString()}] [${log.level.toUpperCase()}] ${log.message}`
      )
      .join('\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bot-logs-${botId}-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Bot Logs</CardTitle>
            <CardDescription>Real-time activity and events</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {isStreaming && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                Live
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 gap-4">
        {/* Filters and Actions */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 flex-wrap">
            {(['all', 'info', 'warn', 'error', 'debug'] as const).map((level) => (
              <Button
                key={level}
                onClick={() => setFilter(level)}
                variant={filter === level ? 'default' : 'outline'}
                size="sm"
              >
                {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={exportLogs} variant="outline" size="sm" disabled={logs.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={clearLogs} variant="outline" size="sm" disabled={logs.length === 0}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Logs Container */}
        <div className="flex-1 bg-gray-900 rounded-lg overflow-y-auto border border-gray-700 p-4 font-mono text-sm">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading logs...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              No logs yet
            </div>
          ) : (
            <div className="space-y-1">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex gap-3 text-gray-300 hover:bg-gray-800 px-2 py-1 rounded">
                  <span className="text-gray-500 flex-shrink-0 w-20">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </span>
                  <Badge variant="outline" className={`flex-shrink-0 ${getLevelColor(log.level)}`}>
                    {log.level}
                  </Badge>
                  <span className="flex-1">{log.message}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>

        {/* Log Count */}
        <div className="text-xs text-gray-500 flex justify-between items-center">
          <span>
            Showing {filteredLogs.length} of {logs.length} logs
          </span>
          <span>Total: {logs.length} logs</span>
        </div>
      </CardContent>
    </Card>
  )
}
