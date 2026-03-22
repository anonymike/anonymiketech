import { logActivity, updateSessionConnection, BotConfig } from './whatsapp-bot-service'
import { generateBotResponse, MessageContext, analyzeMessageSentiment } from './whatsapp-bot-ai'

// ============ Type Definitions ============

export interface BaileysBotConfig {
  botId: string
  phoneNumber: string
  botConfig: BotConfig
  webhookUrl: string
  llmProvider?: any
}

export interface BotRunnerEvent {
  type: 'connected' | 'disconnected' | 'qr' | 'error' | 'message_received'
  data?: any
}

export interface IncomingMessage {
  from: string
  to: string
  text: string
  timestamp: number
  messageId: string
}

export interface OutgoingMessage {
  to: string
  text: string
  messageId?: string
}

// ============ Bot Runner Class ============

export class WhatsAppBotRunner {
  private botId: string
  private phoneNumber: string
  private botConfig: BotConfig
  private webhookUrl: string
  private llmProvider: any
  private isConnected: boolean = false
  private qrCode: string | null = null
  private messageHandlers: Set<(event: BotRunnerEvent) => Promise<void>> = new Set()
  private conversationHistories: Map<string, Array<{ role: 'user' | 'assistant'; content: string }>> =
    new Map()

  // Note: In production, you would use actual Baileys library
  // This is a placeholder implementation that shows the structure

  constructor(config: BaileysBotConfig) {
    this.botId = config.botId
    this.phoneNumber = config.phoneNumber
    this.botConfig = config.botConfig
    this.webhookUrl = config.webhookUrl
    this.llmProvider = config.llmProvider
  }

  // ============ Connection Management ============

  async connect(): Promise<void> {
    try {
      await logActivity(this.botId, 'bot_start', `Bot starting on ${this.phoneNumber}`, {
        phoneNumber: this.phoneNumber,
      })

      // In production with Baileys:
      // const sock = makeWASocket({ ... })
      // This would initialize the actual WhatsApp connection

      // For now, simulate connection
      this.emit({
        type: 'qr',
        data: {
          qr: 'fake_qr_code_' + Date.now(),
          status: 'waiting_scan',
        },
      })

      // Simulate connection after delay
      setTimeout(async () => {
        this.isConnected = true
        await updateSessionConnection(this.botId, true)

        this.emit({
          type: 'connected',
          data: {
            status: 'authenticated',
            phone: this.phoneNumber,
          },
        })

        await logActivity(this.botId, 'bot_connected', 'Bot connected to WhatsApp', {
          phoneNumber: this.phoneNumber,
        })
      }, 3000)
    } catch (error) {
      await logActivity(this.botId, 'connection_error', String(error), {
        error: String(error),
      })

      this.emit({
        type: 'error',
        data: {
          message: 'Failed to connect',
          error: String(error),
        },
      })

      throw error
    }
  }

  async disconnect(): Promise<void> {
    try {
      this.isConnected = false
      await updateSessionConnection(this.botId, false)

      // In production, you would:
      // await sock.logout()

      this.emit({
        type: 'disconnected',
        data: {
          status: 'disconnected',
        },
      })

      await logActivity(this.botId, 'bot_disconnected', 'Bot disconnected from WhatsApp', {})
    } catch (error) {
      await logActivity(this.botId, 'disconnection_error', String(error), {
        error: String(error),
      })

      throw error
    }
  }

  // ============ Message Handling ============

  async handleMessage(message: IncomingMessage): Promise<void> {
    try {
      const { from, text, messageId } = message

      // Check if phone number is allowed
      if (
        this.botConfig.accessControl?.whitelistEnabled &&
        !this.botConfig.accessControl.phoneNumbers.includes(from)
      ) {
        await logActivity(this.botId, 'message_blocked', 'Message from unauthorized number', {
          from,
          reason: 'whitelist',
        })

        return
      }

      await logActivity(this.botId, 'message_received', `Message from ${from}`, {
        from,
        messageId,
        messageLength: text.length,
      })

      // Get or create conversation history
      let history = this.conversationHistories.get(from) || []

      // Analyze sentiment
      const sentiment = analyzeMessageSentiment(text)

      // Generate response
      const context: MessageContext = {
        userMessage: text,
        conversationHistory: history,
        botConfig: this.botConfig,
        userId: this.botId,
      }

      const response = await generateBotResponse(context, this.llmProvider)

      // Update conversation history
      if (!response.metadata.isCommand && !response.metadata.businessHoursClosed) {
        history.push(
          { role: 'user' as const, content: text },
          { role: 'assistant' as const, content: response.message }
        )

        // Keep last 20 messages
        if (history.length > 20) {
          history = history.slice(-20)
        }

        this.conversationHistories.set(from, history)
      }

      // Send response
      const outgoing: OutgoingMessage = {
        to: from,
        text: response.message,
      }

      await this.sendMessage(outgoing)

      // Log successful response
      await logActivity(this.botId, 'response_sent', `Response sent to ${from}`, {
        to: from,
        responseLength: response.message.length,
        confidence: response.confidence,
        sentiment,
        executedCommand: response.executedCommand,
      })

      // Call webhook if configured
      if (this.webhookUrl) {
        await this.callWebhook({
          type: 'message_processed',
          message: {
            from,
            to: this.phoneNumber,
            text,
            sentiment,
            response: response.message,
            timestamp: message.timestamp,
            messageId,
          },
        })
      }
    } catch (error) {
      await logActivity(this.botId, 'message_processing_error', String(error), {
        from: message.from,
        error: String(error),
      })

      this.emit({
        type: 'error',
        data: {
          message: 'Failed to process message',
          error: String(error),
          from: message.from,
        },
      })
    }
  }

  async sendMessage(message: OutgoingMessage): Promise<string> {
    try {
      const messageId = message.messageId || `msg_${Date.now()}`

      // Validate message
      if (message.text.length > 4096) {
        throw new Error('Message exceeds WhatsApp limit (4096 characters)')
      }

      await logActivity(this.botId, 'message_sent', `Message sent to ${message.to}`, {
        to: message.to,
        messageId,
        messageLength: message.text.length,
      })

      // In production with Baileys:
      // await sock.sendMessage(message.to + '@s.whatsapp.net', { text: message.text })

      return messageId
    } catch (error) {
      await logActivity(this.botId, 'send_error', String(error), {
        to: message.to,
        error: String(error),
      })

      throw error
    }
  }

  // ============ Event Management ============

  on(handler: (event: BotRunnerEvent) => Promise<void>): void {
    this.messageHandlers.add(handler)
  }

  off(handler: (event: BotRunnerEvent) => Promise<void>): void {
    this.messageHandlers.delete(handler)
  }

  private emit(event: BotRunnerEvent): void {
    this.messageHandlers.forEach((handler) => {
      handler(event).catch((error) => {
        console.error('Error in event handler:', error)
      })
    })
  }

  // ============ Webhook Integration ============

  private async callWebhook(payload: any): Promise<void> {
    try {
      if (!this.webhookUrl) return

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Bot-ID': this.botId,
          'X-Timestamp': Date.now().toString(),
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}`)
      }
    } catch (error) {
      console.error('Webhook error:', error)
      await logActivity(this.botId, 'webhook_error', String(error), {
        url: this.webhookUrl,
        error: String(error),
      })
    }
  }

  // ============ Status & Utilities ============

  isRunning(): boolean {
    return this.isConnected
  }

  getQRCode(): string | null {
    return this.qrCode
  }

  clearConversationHistory(userId?: string): void {
    if (userId) {
      this.conversationHistories.delete(userId)
    } else {
      this.conversationHistories.clear()
    }
  }

  getConversationHistory(userId: string): Array<{ role: 'user' | 'assistant'; content: string }> {
    return this.conversationHistories.get(userId) || []
  }

  // ============ Error Handling & Reconnection ============

  async handleConnectionError(error: Error): Promise<void> {
    await logActivity(this.botId, 'connection_error', error.message, {
      error: error.message,
      stack: error.stack,
    })

    this.isConnected = false
    await updateSessionConnection(this.botId, false)

    // Attempt reconnection after delay
    await this.attemptReconnection()
  }

  private async attemptReconnection(maxAttempts = 5, delayMs = 5000): Promise<void> {
    let attempts = 0

    while (attempts < maxAttempts && !this.isConnected) {
      try {
        await new Promise((resolve) => setTimeout(resolve, delayMs))
        await logActivity(
          this.botId,
          'reconnection_attempt',
          `Reconnection attempt ${attempts + 1}/${maxAttempts}`,
          {}
        )

        await this.connect()
        return
      } catch (error) {
        attempts++
        if (attempts === maxAttempts) {
          await logActivity(
            this.botId,
            'reconnection_failed',
            `Failed to reconnect after ${maxAttempts} attempts`,
            {
              error: String(error),
            }
          )
        }
      }
    }
  }

  // ============ Bot Management Commands ============

  async updateConfiguration(newConfig: Partial<BotConfig>): Promise<void> {
    this.botConfig = { ...this.botConfig, ...newConfig }

    await logActivity(this.botId, 'config_updated', 'Bot configuration updated', {
      changes: Object.keys(newConfig),
    })
  }

  async restart(): Promise<void> {
    await this.disconnect()
    await this.connect()

    await logActivity(this.botId, 'bot_restarted', 'Bot restarted successfully', {})
  }
}

// ============ Bot Runner Manager ============

export class BotRunnerManager {
  private runners: Map<string, WhatsAppBotRunner> = new Map()

  createRunner(config: BaileysBotConfig): WhatsAppBotRunner {
    const runner = new WhatsAppBotRunner(config)
    this.runners.set(config.botId, runner)
    return runner
  }

  getRunner(botId: string): WhatsAppBotRunner | undefined {
    return this.runners.get(botId)
  }

  removeRunner(botId: string): void {
    const runner = this.runners.get(botId)
    if (runner) {
      runner.disconnect().catch(console.error)
      this.runners.delete(botId)
    }
  }

  getAllRunners(): WhatsAppBotRunner[] {
    return Array.from(this.runners.values())
  }

  getRunningBots(): string[] {
    return Array.from(this.runners.entries())
      .filter(([, runner]) => runner.isRunning())
      .map(([botId]) => botId)
  }
}

// Global instance
export const botRunnerManager = new BotRunnerManager()
