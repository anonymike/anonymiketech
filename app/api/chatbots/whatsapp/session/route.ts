import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { botRunnerManager } from '@/lib/whatsapp-bot-runner'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const botId = searchParams.get('bot_id')
    const authHeader = request.headers.get('Authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const { data: user, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user?.user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    if (!botId) {
      return NextResponse.json({ error: 'Missing bot_id' }, { status: 400 })
    }

    // Verify bot ownership
    const { data: bot } = await supabase
      .from('whatsapp_bots')
      .select('id, user_id')
      .eq('id', botId)
      .single()

    if (!bot || bot.user_id !== user.user.id) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    }

    // Get session data
    const { data: session } = await supabase
      .from('whatsapp_bot_sessions')
      .select('*')
      .eq('bot_id', botId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    return NextResponse.json({
      success: true,
      session,
      connected: !!botRunnerManager.getRunner(botId),
    })
  } catch (error) {
    console.error('[v0] Session retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const { data: user, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user?.user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { action, bot_id } = body

    if (!action) {
      return NextResponse.json(
        { error: 'Missing required field: action' },
        { status: 400 }
      )
    }

    // Handle pairing code generation for client WhatsApp linking
    if (action === 'generate_pairing_session') {
      try {
        // Generate a unique pairing code
        const pairingCode = Math.random().toString(36).substring(2, 10).toUpperCase()
        console.log('[v0] Generating pairing session for user:', user.user.id)
        
        // Check if table exists by trying to insert
        const expiresAt = new Date(Date.now() + 60000).toISOString() // 60 seconds
        
        const { data: session, error: sessionError } = await supabase
          .from('whatsapp_pairing_sessions')
          .insert({
            user_id: user.user.id,
            pairing_code: pairingCode,
            status: 'pending',
            expires_at: expiresAt,
          })
          .select()
          .single()

        if (sessionError) {
          console.error('[v0] Database error creating pairing session:', {
            error: sessionError,
            code: sessionError.code,
            message: sessionError.message,
            details: sessionError.details,
          })
          
          // Provide more helpful error messages
          if (sessionError.code === '42P01') {
            return NextResponse.json(
              { error: 'Database is not properly configured. Please contact support.' },
              { status: 500 }
            )
          }
          
          return NextResponse.json(
            { error: 'Failed to create pairing session. Please try again.' },
            { status: 500 }
          )
        }

        console.log('[v0] Pairing session created successfully:', session?.id)
        
        return NextResponse.json({
          success: true,
          data: {
            pairingCode,
            sessionId: session.id,
            expiresAt: session.expires_at,
          },
        })
      } catch (innerError) {
        console.error('[v0] Unexpected error in pairing session generation:', innerError)
        return NextResponse.json(
          { error: 'An unexpected error occurred. Please try again.' },
          { status: 500 }
        )
      }
    }

    // Handle bot-specific actions
    if (!bot_id) {
      return NextResponse.json(
        { error: 'Missing required field: bot_id for this action' },
        { status: 400 }
      )
    }

    // Verify bot ownership
    const { data: bot } = await supabase
      .from('whatsapp_bots')
      .select('id, user_id')
      .eq('id', bot_id)
      .single()

    if (!bot || bot.user_id !== user.user.id) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    }

    if (action === 'connect') {
      // Get bot configuration
      const { data: botConfig } = await supabase
        .from('whatsapp_bot_config')
        .select('*')
        .eq('bot_id', bot_id)
        .single()

      if (!botConfig) {
        return NextResponse.json(
          { error: 'Bot configuration not found' },
          { status: 404 }
        )
      }

      // Get bot details
      const { data: botDetails } = await supabase
        .from('whatsapp_bots')
        .select('phone_number')
        .eq('id', bot_id)
        .single()

      if (!botDetails) {
        return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
      }

      // Initialize bot runner with proper config
      const runnerConfig = {
        botId: bot_id,
        phoneNumber: botDetails.phone_number,
        botConfig: botConfig,
        webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/chatbots/whatsapp/webhook`,
      }

      const runner = botRunnerManager.createRunner(runnerConfig)
      
      // Wait for QR code (with timeout)
      let qrCode: string | null = null
      let attempts = 0
      while (!qrCode && attempts < 30) {
        qrCode = runner.getQRCode()
        if (!qrCode) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
        attempts++
      }

      return NextResponse.json({
        success: true,
        status: 'qr_generated',
        qr_code: qrCode,
        message: 'Scan the QR code with WhatsApp to authenticate',
      })
    } else if (action === 'disconnect') {
      // Disconnect bot
      botRunnerManager.removeRunner(bot_id)

      await supabase
        .from('whatsapp_bot_sessions')
        .update({ disconnected_at: new Date().toISOString() })
        .eq('bot_id', bot_id)
        .is('disconnected_at', null)

      return NextResponse.json({
        success: true,
        message: 'Bot disconnected successfully',
      })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('[v0] Session action error:', error)
    return NextResponse.json(
      { error: 'Failed to process session action' },
      { status: 500 }
    )
  }
}
