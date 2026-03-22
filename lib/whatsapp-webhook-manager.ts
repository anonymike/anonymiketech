import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export interface WebhookPayload {
  bot_id: string
  type: 'message' | 'status' | 'error'
  data: {
    from?: string
    to?: string
    message?: string
    status?: string
    timestamp?: string
    error?: string
  }
}

export interface WebhookConfig {
  bot_id: string
  webhook_url: string
  webhook_secret?: string
  enabled: boolean
  retry_attempts: number
  timeout_ms: number
}

export class WebhookSignature {
  static generateSignature(payload: WebhookPayload, secret: string): string {
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(JSON.stringify(payload))
    return hmac.digest('hex')
  }

  static verifySignature(payload: WebhookPayload, signature: string, secret: string): boolean {
    const expectedSignature = this.generateSignature(payload, secret)
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  }
}

export class WebhookManager {
  static async sendWebhook(
    payload: WebhookPayload,
    config: WebhookConfig,
    attempt: number = 1
  ): Promise<{ success: boolean; statusCode?: number; error?: string }> {
    if (!config.enabled || !config.webhook_url) {
      return { success: false, error: 'Webhook not configured' }
    }

    try {
      const signature = config.webhook_secret
        ? WebhookSignature.generateSignature(payload, config.webhook_secret)
        : undefined

      const response = await fetch(config.webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(signature && { 'X-Webhook-Signature': signature }),
          'X-Webhook-Bot-Id': payload.bot_id,
          'X-Webhook-Type': payload.type,
          'User-Agent': 'WhatsApp-Bot-Webhooks/1.0',
        },
        body: JSON.stringify(payload),
        timeout: config.timeout_ms || 10000,
      } as any)

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}`)
      }

      // Log successful webhook
      await this.logWebhookActivity(payload.bot_id, 'sent', true, {
        url: config.webhook_url,
        statusCode: response.status,
      })

      return { success: true, statusCode: response.status }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      // Log failed webhook
      await this.logWebhookActivity(payload.bot_id, 'failed', false, {
        url: config.webhook_url,
        error: errorMessage,
        attempt,
      })

      // Retry logic
      if (attempt < config.retry_attempts) {
        const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 30000)
        await new Promise(resolve => setTimeout(resolve, backoffMs))
        return this.sendWebhook(payload, config, attempt + 1)
      }

      return { success: false, error: errorMessage }
    }
  }

  static async getWebhookConfig(botId: string): Promise<WebhookConfig | null> {
    try {
      const { data } = await supabase
        .from('whatsapp_bot_config')
        .select('webhook_url, webhook_secret, webhook_enabled')
        .eq('bot_id', botId)
        .single()

      if (!data) return null

      return {
        bot_id: botId,
        webhook_url: data.webhook_url,
        webhook_secret: data.webhook_secret,
        enabled: data.webhook_enabled || false,
        retry_attempts: 3,
        timeout_ms: 10000,
      }
    } catch (error) {
      console.error('[v0] Webhook config fetch error:', error)
      return null
    }
  }

  static async updateWebhookConfig(
    botId: string,
    config: Partial<WebhookConfig>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('whatsapp_bot_config')
        .update({
          webhook_url: config.webhook_url,
          webhook_secret: config.webhook_secret,
          webhook_enabled: config.enabled,
        })
        .eq('bot_id', botId)

      return !error
    } catch (error) {
      console.error('[v0] Webhook config update error:', error)
      return false
    }
  }

  private static async logWebhookActivity(
    botId: string,
    type: 'sent' | 'failed',
    success: boolean,
    metadata: Record<string, any>
  ) {
    try {
      await supabase.from('whatsapp_bot_logs').insert({
        bot_id: botId,
        message_type: 'webhook',
        status: success ? 'success' : 'failed',
        metadata,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('[v0] Webhook log error:', error)
    }
  }
}

export class SessionManager {
  static async createSession(
    botId: string,
    sessionData: {
      qr_code: string
      status: 'pending' | 'connected' | 'authenticated'
      phone_number?: string
      connected_at?: string
    }
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('whatsapp_bot_sessions')
        .insert({
          bot_id: botId,
          qr_code: sessionData.qr_code,
          status: sessionData.status,
          phone_number: sessionData.phone_number,
          connected_at: sessionData.connected_at,
          created_at: new Date().toISOString(),
        })
        .select('id')
        .single()

      return data?.id || null
    } catch (error) {
      console.error('[v0] Session creation error:', error)
      return null
    }
  }

  static async getSession(
    botId: string
  ): Promise<{
    status: string
    qr_code?: string
    phone_number?: string
    connected_at?: string
  } | null> {
    try {
      const { data } = await supabase
        .from('whatsapp_bot_sessions')
        .select('*')
        .eq('bot_id', botId)
        .is('disconnected_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!data) return null

      return {
        status: data.status,
        qr_code: data.qr_code,
        phone_number: data.phone_number,
        connected_at: data.connected_at,
      }
    } catch (error) {
      console.error('[v0] Session fetch error:', error)
      return null
    }
  }

  static async updateSessionStatus(
    botId: string,
    status: 'connected' | 'authenticated' | 'disconnected',
    phoneNumber?: string
  ): Promise<boolean> {
    try {
      const updateData: Record<string, any> = { status }

      if (status === 'authenticated' && phoneNumber) {
        updateData.phone_number = phoneNumber
        updateData.connected_at = new Date().toISOString()
      }

      if (status === 'disconnected') {
        updateData.disconnected_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('whatsapp_bot_sessions')
        .update(updateData)
        .eq('bot_id', botId)
        .is('disconnected_at', null)

      return !error
    } catch (error) {
      console.error('[v0] Session update error:', error)
      return false
    }
  }

  static async getSessionStats(botId: string): Promise<{
    total_sessions: number
    active_sessions: number
    latest_session_date: string | null
  }> {
    try {
      const { data: sessions, error } = await supabase
        .from('whatsapp_bot_sessions')
        .select('*', { count: 'exact' })
        .eq('bot_id', botId)

      if (error) {
        return { total_sessions: 0, active_sessions: 0, latest_session_date: null }
      }

      const activeSessions = (sessions || []).filter(s => !s.disconnected_at).length
      const latestSession = (sessions || []).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0]

      return {
        total_sessions: sessions?.length || 0,
        active_sessions: activeSessions,
        latest_session_date: latestSession?.created_at || null,
      }
    } catch (error) {
      console.error('[v0] Session stats error:', error)
      return { total_sessions: 0, active_sessions: 0, latest_session_date: null }
    }
  }

  static async clearExpiredSessions(botId: string, hoursOld: number = 24): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - hoursOld * 60 * 60 * 1000)

      const { error } = await supabase
        .from('whatsapp_bot_sessions')
        .delete()
        .eq('bot_id', botId)
        .lt('created_at', cutoffDate.toISOString())
        .not('disconnected_at', 'is', null)

      return error ? 0 : 1
    } catch (error) {
      console.error('[v0] Session cleanup error:', error)
      return 0
    }
  }
}
