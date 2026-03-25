import { NextRequest, NextResponse } from 'next/server'
import { initializeQRAuth, loadSessionCredentials } from '@/lib/whatsapp-qr-auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// Store active sessions in memory (in production, use Redis or database)
const activeSessions = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const { action, botId, sessionId, userId } = await request.json()

    if (!action || !botId || !sessionId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: action, botId, sessionId, userId' },
        { status: 400 }
      )
    }

    if (action === 'initiate') {
      // Check if user owns this bot
      const { data: bot, error: botError } = await supabase
        .from('whatsapp_bots')
        .select('id, user_id')
        .eq('id', botId)
        .single()

      if (botError || !bot || bot.user_id !== userId) {
        return NextResponse.json(
          { error: 'Unauthorized: You do not own this bot' },
          { status: 403 }
        )
      }

      // Check if session already exists
      if (activeSessions.has(sessionId)) {
        return NextResponse.json(
          { error: 'Session already active' },
          { status: 409 }
        )
      }

      // Initialize QR authentication
      const { socket, session, disconnect } = await initializeQRAuth(
        botId,
        sessionId,
        {
          onQRGenerated: async (qrCode: string) => {
            console.log(`[v0] QR code generated for session ${sessionId}`)
            // Store in database for real-time updates
            await supabase
              .from('bot_sessions')
              .update({
                qr_code: qrCode,
                connection_status: 'connecting',
                updated_at: new Date().toISOString(),
              })
              .eq('session_id', sessionId)
          },
          onConnected: async (phoneNumber: string) => {
            console.log(`[v0] Bot connected with phone: ${phoneNumber}`)
            await supabase
              .from('bot_sessions')
              .update({
                is_connected: true,
                phone_number: phoneNumber,
                connection_status: 'authenticated',
                updated_at: new Date().toISOString(),
              })
              .eq('session_id', sessionId)
          },
          onError: async (error: string) => {
            console.error(`[v0] QR Auth error: ${error}`)
            await supabase
              .from('bot_sessions')
              .update({
                connection_status: 'failed',
                error_message: error,
                updated_at: new Date().toISOString(),
              })
              .eq('session_id', sessionId)
          },
          onDisconnected: async () => {
            console.log(`[v0] Session disconnected: ${sessionId}`)
            activeSessions.delete(sessionId)
            await supabase
              .from('bot_sessions')
              .update({
                is_connected: false,
                connection_status: 'disconnected',
                updated_at: new Date().toISOString(),
              })
              .eq('session_id', sessionId)
          },
        }
      )

      // Store session
      activeSessions.set(sessionId, { socket, disconnect })

      // Create or update session record
      await supabase
        .from('bot_sessions')
        .upsert(
          {
            session_id: sessionId,
            bot_id: botId,
            qr_code: session.qrCode,
            is_connected: false,
            connection_status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'session_id' }
        )

      return NextResponse.json({
        success: true,
        sessionId,
        message: 'QR authentication initiated',
      })
    } else if (action === 'status') {
      // Get current session status
      const { data: session, error } = await supabase
        .from('bot_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        session: {
          sessionId: session.session_id,
          qrCode: session.qr_code,
          isConnected: session.is_connected,
          status: session.connection_status,
          phoneNumber: session.phone_number,
          error: session.error_message,
        },
      })
    } else if (action === 'disconnect') {
      // Disconnect session
      const activeSession = activeSessions.get(sessionId)
      if (activeSession) {
        await activeSession.disconnect()
      }

      await supabase
        .from('bot_sessions')
        .update({
          is_connected: false,
          connection_status: 'disconnected',
          updated_at: new Date().toISOString(),
        })
        .eq('session_id', sessionId)

      return NextResponse.json({
        success: true,
        message: 'Session disconnected',
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('[v0] QR auth error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
