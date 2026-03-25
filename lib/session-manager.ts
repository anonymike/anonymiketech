import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// ============ Session Manager Types ============

export interface Session {
  sessionId: string
  botId: string
  phoneNumber?: string
  qrCode?: string
  credentials: Record<string, any>
  isActive: boolean
  connectedAt?: Date
  lastActivity: Date
  expiresAt: Date
  metadata?: Record<string, any>
}

export interface SessionCredentials {
  noiseKey: string
  signedIdentityKey: string
  signedPreKey: string
  registrationId: number
  advSecretKey: string
  processedPushName: string
  firstUnuploadedPreKeyId: number
  accountSettings?: Record<string, any>
}

// ============ Session Manager ============

class SessionManager {
  private sessions = new Map<string, Session>()
  private sessionDir = path.join(process.cwd(), '.sessions')

  constructor() {
    this.ensureSessionDir()
  }

  /**
   * Ensure session directory exists
   */
  private ensureSessionDir(): void {
    if (!fs.existsSync(this.sessionDir)) {
      fs.mkdirSync(this.sessionDir, { recursive: true })
    }
  }

  /**
   * Create a new session
   */
  async createSession(botId: string, sessionId: string): Promise<Session> {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days

    const session: Session = {
      sessionId,
      botId,
      credentials: {},
      isActive: false,
      lastActivity: now,
      expiresAt,
      metadata: {
        createdAt: now.toISOString(),
        userAgent: 'AnonymiKey-Bot-Platform/1.0',
      },
    }

    this.sessions.set(sessionId, session)
    await this.saveSessionToDB(session)

    return session
  }

  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<Session | null> {
    // Check memory first
    if (this.sessions.has(sessionId)) {
      return this.sessions.get(sessionId) || null
    }

    // Check database
    try {
      const { data } = await supabase
        .from('bot_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single()

      if (data) {
        const session: Session = {
          sessionId: data.session_id,
          botId: data.bot_id,
          phoneNumber: data.phone_number,
          qrCode: data.qr_code,
          credentials: data.credentials || {},
          isActive: data.is_connected,
          connectedAt: data.connected_at ? new Date(data.connected_at) : undefined,
          lastActivity: new Date(data.updated_at),
          expiresAt: new Date(data.expires_at),
          metadata: data.metadata,
        }
        this.sessions.set(sessionId, session)
        return session
      }
    } catch (err) {
      console.error('[v0] Error fetching session from DB:', err)
    }

    return null
  }

  /**
   * Update session
   */
  async updateSession(sessionId: string, updates: Partial<Session>): Promise<Session | null> {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    Object.assign(session, updates, { lastActivity: new Date() })
    this.sessions.set(sessionId, session)
    await this.saveSessionToDB(session)

    return session
  }

  /**
   * Update session credentials
   */
  async updateCredentials(
    sessionId: string,
    credentials: Partial<SessionCredentials>
  ): Promise<boolean> {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    session.credentials = { ...session.credentials, ...credentials }
    session.lastActivity = new Date()

    this.sessions.set(sessionId, session)
    await this.saveSessionToDB(session)

    // Save credentials to file for persistence
    if (session.botId) {
      await this.saveCredentialsToFile(session.botId, sessionId, session.credentials)
    }

    return true
  }

  /**
   * Mark session as connected
   */
  async markAsConnected(
    sessionId: string,
    phoneNumber: string
  ): Promise<Session | null> {
    return this.updateSession(sessionId, {
      isActive: true,
      phoneNumber,
      connectedAt: new Date(),
    })
  }

  /**
   * Mark session as disconnected
   */
  async markAsDisconnected(sessionId: string): Promise<Session | null> {
    return this.updateSession(sessionId, {
      isActive: false,
    })
  }

  /**
   * Check if session is expired
   */
  isExpired(session: Session): boolean {
    return new Date() > session.expiresAt
  }

  /**
   * Get all sessions for a bot
   */
  async getBotSessions(botId: string): Promise<Session[]> {
    try {
      const { data } = await supabase
        .from('bot_sessions')
        .select('*')
        .eq('bot_id', botId)

      return (data || []).map((d: any) => ({
        sessionId: d.session_id,
        botId: d.bot_id,
        phoneNumber: d.phone_number,
        qrCode: d.qr_code,
        credentials: d.credentials || {},
        isActive: d.is_connected,
        connectedAt: d.connected_at ? new Date(d.connected_at) : undefined,
        lastActivity: new Date(d.updated_at),
        expiresAt: new Date(d.expires_at),
        metadata: d.metadata,
      }))
    } catch (err) {
      console.error('[v0] Error fetching bot sessions:', err)
      return []
    }
  }

  /**
   * Delete session
   */
  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      const session = this.sessions.get(sessionId)

      // Delete from memory
      this.sessions.delete(sessionId)

      // Delete from database
      await supabase
        .from('bot_sessions')
        .delete()
        .eq('session_id', sessionId)

      // Delete credentials file if exists
      if (session && session.botId) {
        const credPath = this.getCredentialsPath(session.botId, sessionId)
        if (fs.existsSync(credPath)) {
          fs.unlinkSync(credPath)
        }
      }

      return true
    } catch (err) {
      console.error('[v0] Error deleting session:', err)
      return false
    }
  }

  /**
   * Cleanup expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    let cleanedCount = 0

    for (const [sessionId, session] of this.sessions) {
      if (this.isExpired(session)) {
        await this.deleteSession(sessionId)
        cleanedCount++
      }
    }

    return cleanedCount
  }

  /**
   * Save session to database
   */
  private async saveSessionToDB(session: Session): Promise<void> {
    try {
      await supabase
        .from('bot_sessions')
        .upsert(
          {
            session_id: session.sessionId,
            bot_id: session.botId,
            phone_number: session.phoneNumber,
            qr_code: session.qrCode,
            credentials: session.credentials,
            is_connected: session.isActive,
            connected_at: session.connectedAt?.toISOString(),
            updated_at: session.lastActivity.toISOString(),
            expires_at: session.expiresAt.toISOString(),
            metadata: session.metadata,
          },
          { onConflict: 'session_id' }
        )
    } catch (err) {
      console.error('[v0] Error saving session to DB:', err)
    }
  }

  /**
   * Get credentials file path
   */
  private getCredentialsPath(botId: string, sessionId: string): string {
    return path.join(this.sessionDir, botId, `${sessionId}-creds.json`)
  }

  /**
   * Save credentials to file
   */
  private async saveCredentialsToFile(
    botId: string,
    sessionId: string,
    credentials: Record<string, any>
  ): Promise<void> {
    try {
      const dir = path.dirname(this.getCredentialsPath(botId, sessionId))
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      const credPath = this.getCredentialsPath(botId, sessionId)
      const encrypted = Buffer.from(JSON.stringify(credentials)).toString('base64')
      fs.writeFileSync(credPath, encrypted)
    } catch (err) {
      console.error('[v0] Error saving credentials to file:', err)
    }
  }

  /**
   * Load credentials from file
   */
  async loadCredentialsFromFile(
    botId: string,
    sessionId: string
  ): Promise<Record<string, any> | null> {
    try {
      const credPath = this.getCredentialsPath(botId, sessionId)
      if (!fs.existsSync(credPath)) return null

      const encrypted = fs.readFileSync(credPath, 'utf-8')
      const credentials = JSON.parse(Buffer.from(encrypted, 'base64').toString())
      return credentials
    } catch (err) {
      console.error('[v0] Error loading credentials from file:', err)
      return null
    }
  }
}

// Export singleton
export const sessionManager = new SessionManager()
