import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import BotRunner from '@/lib/bot-runner'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const botId = params.id
    const token = request.headers.get('authorization')?.split('Bearer ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
    const { data, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await request.json()
    if (!action) {
      return NextResponse.json(
        { error: 'Action is required (start, stop, restart, status)' },
        { status: 400 }
      )
    }

    console.log(`[v0] Bot deployment request: ${botId}, action: ${action}`)

    // Get bot
    const { data: bot, error: botError } = await supabaseAdmin
      .from('chatbots')
      .select('*')
      .eq('id', botId)
      .single()

    if (botError || !bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    }

    // Get session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('whatsapp_bot_instances')
      .select('*')
      .eq('bot_id', botId)
      .single()

    if (sessionError || !session?.session_id) {
      return NextResponse.json(
        { error: 'No session configured. Please upload a TRUTH-MD session first.' },
        { status: 400 }
      )
    }

    // Validate session format
    if (!session.session_id.startsWith('TRUTH-MD:~')) {
      return NextResponse.json(
        { error: 'Invalid session format. Must start with TRUTH-MD:~' },
        { status: 400 }
      )
    }

    let result
    switch (action) {
      case 'start': {
        await BotRunner.startBot({
          botId,
          sessionId: session.session_id,
          databaseUrl: process.env.DATABASE_URL!,
          relayUrl: process.env.TRUTH_MD_RELAY_URL,
        })
        result = { success: true, message: 'Bot deployment started' }
        break
      }

      case 'stop': {
        await BotRunner.stopBot(botId)
        result = { success: true, message: 'Bot stopped' }
        break
      }

      case 'restart': {
        await BotRunner.restartBot(botId, {
          botId,
          sessionId: session.session_id,
          databaseUrl: process.env.DATABASE_URL!,
          relayUrl: process.env.TRUTH_MD_RELAY_URL,
        })
        result = { success: true, message: 'Bot restarting' }
        break
      }

      case 'status': {
        const health = await BotRunner.getHealth(botId)
        result = { success: true, ...health }
        break
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[v0] Deployment error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Deployment failed' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
    const { data, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user
    const user = await getChatbotUserByAuthId(data.user.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify bot ownership
    const bot = await getWhatsappBot(params.id)
    if (!bot || bot.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Bot not found or not owned by user' },
        { status: 404 }
      )
    }

    // Get deployment config
    const deploymentConfig = await getWhatsappDeploymentConfig(params.id)

    return NextResponse.json({
      success: true,
      data: {
        bot: bot,
        deployment: deploymentConfig,
      },
    })
  } catch (error) {
    console.error('[v0] Error fetching deployment config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deployment config' },
      { status: 500 }
    )
  }
}
