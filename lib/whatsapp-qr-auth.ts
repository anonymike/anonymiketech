import { makeWASocket, useMultiFileAuthState, WAConnection, proto } from '@whiskeysockets/baileys'
import QRCode from 'qrcode'
import fs from 'fs'
import path from 'path'

// ============ QR Auth Types ============

export interface QRAuthSession {
  botId: string
  sessionId: string
  qrCode: string
  createdAt: Date
  expiresAt: Date
  isAuthenticated: boolean
  phoneNumber?: string
  connectionStatus: 'pending' | 'connecting' | 'authenticated' | 'failed' | 'expired'
  error?: string
}

export interface QRAuthCallback {
  onQRGenerated: (qrCode: string, sessionId: string) => Promise<void>
  onConnected: (phoneNumber: string, sessionId: string) => Promise<void>
  onError: (error: string, sessionId: string) => Promise<void>
  onDisconnected: (sessionId: string) => Promise<void>
}

// ============ QR Code Generator ============

export async function generateQRCode(text: string): Promise<string> {
  try {
    const qrDataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300,
    })
    return qrDataUrl
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// ============ WhatsApp QR Authentication ============

/**
 * Initialize WhatsApp authentication with QR code
 * @param botId - Unique bot identifier
 * @param sessionId - Unique session identifier
 * @param callbacks - Callbacks for QR and connection events
 * @returns Authentication session manager
 */
export async function initializeQRAuth(
  botId: string,
  sessionId: string,
  callbacks: QRAuthCallback
): Promise<{
  socket: any
  session: QRAuthSession
  disconnect: () => Promise<void>
}> {
  const sessionDir = path.join(process.cwd(), '.auth', botId, sessionId)
  
  // Ensure session directory exists
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true })
  }

  const session: QRAuthSession = {
    botId,
    sessionId,
    qrCode: '',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minute QR timeout
    isAuthenticated: false,
    connectionStatus: 'pending',
  }

  try {
    // Load or create auth state
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir)

    // Check if already authenticated from previous session
    if (state.creds.noiseKey && state.creds.signedIdentityKey) {
      session.isAuthenticated = true
      session.connectionStatus = 'authenticated'
    }

    // Initialize socket
    const socket = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      syncFullHistory: false,
      generateHighQualityLinkPreview: true,
    })

    // Handle QR code generation
    socket.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update

      if (qr) {
        try {
          const qrDataUrl = await generateQRCode(qr)
          session.qrCode = qrDataUrl
          session.connectionStatus = 'connecting'
          await callbacks.onQRGenerated(qrDataUrl, sessionId)
        } catch (err) {
          const errorMsg = `QR generation failed: ${err instanceof Error ? err.message : 'Unknown error'}`
          session.error = errorMsg
          session.connectionStatus = 'failed'
          await callbacks.onError(errorMsg, sessionId)
        }
      }

      if (connection === 'open') {
        session.isAuthenticated = true
        session.connectionStatus = 'authenticated'
        session.phoneNumber = socket.user?.id?.split(':')[0]
        await callbacks.onConnected(session.phoneNumber || '', sessionId)
      }

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== 401
        session.isAuthenticated = false
        session.connectionStatus = 'failed'

        if (shouldReconnect) {
          // Auto-reconnect logic
          setTimeout(() => {
            initializeQRAuth(botId, sessionId, callbacks)
          }, 3000)
        } else {
          await callbacks.onDisconnected(sessionId)
        }
      }
    })

    // Save credentials whenever they update
    socket.ev.on('creds.update', saveCreds)

    return {
      socket,
      session,
      disconnect: async () => {
        try {
          socket.end(new Error('User disconnected'))
          // Cleanup session directory
          if (fs.existsSync(sessionDir)) {
            fs.rmSync(sessionDir, { recursive: true })
          }
        } catch (err) {
          console.error('[v0] Error disconnecting socket:', err)
        }
      }
    }
  } catch (error) {
    const errorMsg = `Failed to initialize QR auth: ${error instanceof Error ? error.message : 'Unknown error'}`
    session.error = errorMsg
    session.connectionStatus = 'failed'
    await callbacks.onError(errorMsg, sessionId)
    throw new Error(errorMsg)
  }
}

/**
 * Load existing session credentials
 * @param botId - Bot identifier
 * @param sessionId - Session identifier
 * @returns Session credentials if they exist
 */
export async function loadSessionCredentials(botId: string, sessionId: string) {
  const sessionDir = path.join(process.cwd(), '.auth', botId, sessionId)
  
  if (!fs.existsSync(path.join(sessionDir, 'creds.json'))) {
    return null
  }

  try {
    const { state } = await useMultiFileAuthState(sessionDir)
    return {
      creds: state.creds,
      hasValidAuth: !!(state.creds.noiseKey && state.creds.signedIdentityKey),
    }
  } catch (err) {
    console.error('[v0] Error loading session credentials:', err)
    return null
  }
}

/**
 * Cleanup expired sessions
 * @param expirationTimeMinutes - Sessions older than this will be cleaned up
 */
export async function cleanupExpiredSessions(expirationTimeMinutes: number = 30) {
  const authDir = path.join(process.cwd(), '.auth')
  
  if (!fs.existsSync(authDir)) {
    return
  }

  try {
    const now = Date.now()
    const expirationTime = expirationTimeMinutes * 60 * 1000

    for (const botDir of fs.readdirSync(authDir)) {
      const botPath = path.join(authDir, botDir)
      
      for (const sessionDir of fs.readdirSync(botPath)) {
        const sessionPath = path.join(botPath, sessionDir)
        const stats = fs.statSync(sessionPath)
        
        if (now - stats.mtimeMs > expirationTime) {
          fs.rmSync(sessionPath, { recursive: true })
          console.log(`[v0] Cleaned up expired session: ${botDir}/${sessionDir}`)
        }
      }
    }
  } catch (err) {
    console.error('[v0] Error cleaning up expired sessions:', err)
  }
}
