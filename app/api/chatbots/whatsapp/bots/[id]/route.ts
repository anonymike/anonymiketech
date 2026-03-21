import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as whatsappService from '@/lib/whatsapp-bot-service'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// GET /api/chatbots/whatsapp/bots/[id] - Get specific bot
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')

    const { data: userData, error: authError } = await supabase.auth.getUser(token)
    if (authError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = userData.user.id
    const botId = params.id

    // Get bot
    const bot = await whatsappService.getBotById(botId, userId)
    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    }

    // Get related data
    const config = await whatsappService.getBotConfig(botId)
    const deployment = await whatsappService.getDeploymentConfig(botId)
    const session = await whatsappService.getSession(botId)
    const logs = await whatsappService.getLogs(botId, 50)
    const analytics = await whatsappService.getAnalytics(botId, 30)

    return NextResponse.json({
      ...bot,
      config,
      deployment,
      session,
      logs,
      analytics,
    })
  } catch (error) {
    console.error('Error fetching bot:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bot', details: String(error) },
      { status: 500 }
    )
  }
}

// DELETE /api/chatbots/whatsapp/bots/[id] - Delete bot
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')

    const { data: userData, error: authError } = await supabase.auth.getUser(token)
    if (authError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = userData.user.id
    const botId = params.id

    // Verify ownership
    const bot = await whatsappService.getBotById(botId, userId)
    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    }

    // Delete bot
    await whatsappService.deleteBot(botId, userId)

    return NextResponse.json({ message: 'Bot deleted successfully' })
  } catch (error) {
    console.error('Error deleting bot:', error)
    return NextResponse.json(
      { error: 'Failed to delete bot', details: String(error) },
      { status: 500 }
    )
  }
}
