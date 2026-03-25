import { createClient } from '@supabase/supabase-js'
import { EventEmitter } from 'events'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// ============ Bot Runner Types ============

export interface BotInstance {
  botId: string
  userId: string
  status: 'running' | 'stopped' | 'error' | 'paused'
  startedAt: Date
  lastHeartbeat: Date
  processId?: number
  error?: string
}

export interface BotLog {
  id: string
  botId: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  metadata?: Record<string, any>
  createdAt: Date
}

export interface BotMetrics {
  botId: string
  uptime: number
  messagesProcessed: number
  errorCount: number
  lastMessage?: Date
  cpuUsage?: number
  memoryUsage?: number
}

// ============ Bot Runner Manager ============

class BotRunnerManager extends EventEmitter {
  private instances = new Map<string, BotInstance>()
  private logs = new Map<string, BotLog[]>()
  private metrics = new Map<string, BotMetrics>()
  private heartbeatInterval: NodeJS.Timer | null = null
  private logCleanupInterval: NodeJS.Timer | null = null

  constructor() {
    super()
    this.setupCleanup()
  }

  /**
   * Start a bot instance
   */
  async startBot(botId: string, userId: string): Promise<void> {
    try {
      // Check if already running
      if (this.instances.has(botId)) {
        const existing = this.instances.get(botId)!
        if (existing.status === 'running') {
          throw new Error('Bot is already running')
        }
      }

      // Fetch bot configuration
      const { data: botData, error: botError } = await supabase
        .from('whatsapp_bots')
        .select('id, name, template_id, status')
        .eq('id', botId)
        .eq('user_id', userId)
        .single()

      if (botError || !botData) {
        throw new Error('Bot not found or unauthorized')
      }

      // Create instance record
      const instance: BotInstance = {
        botId,
        userId,
        status: 'running',
        startedAt: new Date(),
        lastHeartbeat: new Date(),
      }

      this.instances.set(botId, instance)

      // Initialize metrics
      this.metrics.set(botId, {
        botId,
        uptime: 0,
        messagesProcessed: 0,
        errorCount: 0,
      })

      // Update database status
      await supabase
        .from('whatsapp_bots')
        .update({
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', botId)

      // Log startup
      this.addLog(botId, 'info', `Bot instance started`, {
        timestamp: new Date().toISOString(),
      })

      this.emit('bot:started', { botId, timestamp: new Date() })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      this.handleBotError(botId, userId, errorMsg)
      throw error
    }
  }

  /**
   * Stop a bot instance
   */
  async stopBot(botId: string, userId: string): Promise<void> {
    try {
      const instance = this.instances.get(botId)

      if (!instance) {
        throw new Error('Bot instance not found')
      }

      if (instance.userId !== userId) {
        throw new Error('Unauthorized')
      }

      // Calculate uptime
      const uptime = Date.now() - instance.startedAt.getTime()

      // Update instance
      instance.status = 'stopped'

      // Update database
      await supabase
        .from('whatsapp_bots')
        .update({
          status: 'inactive',
          updated_at: new Date().toISOString(),
        })
        .eq('id', botId)

      // Log shutdown
      this.addLog(botId, 'info', `Bot instance stopped`, {
        uptime,
        timestamp: new Date().toISOString(),
      })

      this.emit('bot:stopped', { botId, uptime, timestamp: new Date() })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      this.addLog(botId, 'error', `Failed to stop bot: ${errorMsg}`)
      throw error
    }
  }

  /**
   * Pause a bot instance
   */
  async pauseBot(botId: string, userId: string): Promise<void> {
    try {
      const instance = this.instances.get(botId)

      if (!instance || instance.userId !== userId) {
        throw new Error('Bot not found or unauthorized')
      }

      instance.status = 'paused'

      await supabase
        .from('whatsapp_bots')
        .update({
          status: 'paused',
          updated_at: new Date().toISOString(),
        })
        .eq('id', botId)

      this.addLog(botId, 'info', 'Bot instance paused')
      this.emit('bot:paused', { botId, timestamp: new Date() })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      this.addLog(botId, 'error', `Failed to pause bot: ${errorMsg}`)
      throw error
    }
  }

  /**
   * Resume a paused bot
   */
  async resumeBot(botId: string, userId: string): Promise<void> {
    try {
      const instance = this.instances.get(botId)

      if (!instance || instance.userId !== userId) {
        throw new Error('Bot not found or unauthorized')
      }

      instance.status = 'running'
      instance.lastHeartbeat = new Date()

      await supabase
        .from('whatsapp_bots')
        .update({
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', botId)

      this.addLog(botId, 'info', 'Bot instance resumed')
      this.emit('bot:resumed', { botId, timestamp: new Date() })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      this.addLog(botId, 'error', `Failed to resume bot: ${errorMsg}`)
      throw error
    }
  }

  /**
   * Get instance status
   */
  getInstanceStatus(botId: string): BotInstance | null {
    return this.instances.get(botId) || null
  }

  /**
   * Get all instances for user
   */
  getUserInstances(userId: string): BotInstance[] {
    return Array.from(this.instances.values()).filter(i => i.userId === userId)
  }

  /**
   * Add log entry
   */
  addLog(botId: string, level: 'info' | 'warn' | 'error' | 'debug', message: string, metadata?: Record<string, any>): void {
    const log: BotLog = {
      id: `${botId}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      botId,
      level,
      message,
      metadata,
      createdAt: new Date(),
    }

    if (!this.logs.has(botId)) {
      this.logs.set(botId, [])
    }

    this.logs.get(botId)!.push(log)

    // Keep only last 1000 logs in memory
    const botLogs = this.logs.get(botId)!
    if (botLogs.length > 1000) {
      this.logs.set(botId, botLogs.slice(-1000))
    }

    this.emit('log:created', log)
  }

  /**
   * Get logs for bot
   */
  getLogs(botId: string, limit: number = 100): BotLog[] {
    const logs = this.logs.get(botId) || []
    return logs.slice(-limit)
  }

  /**
   * Get metrics
   */
  getMetrics(botId: string): BotMetrics | null {
    const metrics = this.metrics.get(botId)
    if (!metrics) return null

    const instance = this.instances.get(botId)
    if (instance && instance.status === 'running') {
      metrics.uptime = Date.now() - instance.startedAt.getTime()
    }

    return metrics
  }

  /**
   * Update metrics
   */
  updateMetrics(botId: string, updates: Partial<BotMetrics>): void {
    const current = this.metrics.get(botId)
    if (current) {
      Object.assign(current, updates)
      this.emit('metrics:updated', current)
    }
  }

  /**
   * Handle bot error
   */
  private async handleBotError(botId: string, userId: string, error: string): Promise<void> {
    const instance = this.instances.get(botId)

    if (instance) {
      instance.status = 'error'
      instance.error = error
    } else {
      this.instances.set(botId, {
        botId,
        userId,
        status: 'error',
        error,
        startedAt: new Date(),
        lastHeartbeat: new Date(),
      })
    }

    // Update database
    await supabase
      .from('whatsapp_bots')
      .update({
        status: 'error',
        error_message: error,
        updated_at: new Date().toISOString(),
      })
      .eq('id', botId)

    this.addLog(botId, 'error', `Bot error: ${error}`)
    this.emit('bot:error', { botId, error, timestamp: new Date() })
  }

  /**
   * Setup periodic cleanup and heartbeat
   */
  private setupCleanup(): void {
    // Heartbeat check every 30 seconds
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now()
      for (const [botId, instance] of this.instances) {
        if (instance.status === 'running') {
          const timeSinceHeartbeat = now - instance.lastHeartbeat.getTime()
          if (timeSinceHeartbeat > 5 * 60 * 1000) {
            // 5 minute timeout
            this.addLog(botId, 'warn', 'Bot heartbeat timeout')
          }
        }
      }
    }, 30000)

    // Log cleanup every hour
    this.logCleanupInterval = setInterval(() => {
      for (const [botId, logs] of this.logs) {
        if (logs.length > 10000) {
          this.logs.set(botId, logs.slice(-5000))
          this.addLog(botId, 'debug', 'Log cleanup performed')
        }
      }
    }, 60 * 60 * 1000)
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval)
    if (this.logCleanupInterval) clearInterval(this.logCleanupInterval)
    this.instances.clear()
    this.logs.clear()
    this.metrics.clear()
  }
}

// Export singleton instance
export const botRunnerManager = new BotRunnerManager()
