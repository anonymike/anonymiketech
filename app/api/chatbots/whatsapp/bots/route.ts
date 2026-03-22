import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as whatsappService from '@/lib/whatsapp-bot-service'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// GET /api/chatbots/whatsapp/bots - List all bots for authenticated user
export async function GET(request: NextRequest) {
  try {
    // Get auth token from request
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')

    // Verify token
    const { data: userData, error: authError } = await supabase.auth.getUser(token)
    if (authError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = userData.user.id

    // Fetch bots
    const bots = await whatsappService.getBots(userId)

    // Get config for each bot
    const botsWithConfig = await Promise.all(
      bots.map(async (bot) => {
        const config = await whatsappService.getBotConfig(bot.id)
        const deployment = await whatsappService.getDeploymentConfig(bot.id)
        const session = await whatsappService.getSession(bot.id)

        return {
          ...bot,
          config,
          deployment,
          session,
        }
      })
    )

    return NextResponse.json(botsWithConfig)
  } catch (error) {
    console.error('Error fetching bots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bots', details: String(error) },
      { status: 500 }
    )
  }
}

// POST /api/chatbots/whatsapp/bots - Create new bot
export async function POST(request: NextRequest) {
  try {
    // Get auth token
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')

    // Verify token
    const { data: userData, error: authError } = await supabase.auth.getUser(token)
    if (authError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = userData.user.id

    // Parse request body
    const body = await request.json()
    const { templateId, name, phoneNumber, credentialId } = body

    // Validate required fields
    if (!templateId || !name || !phoneNumber || !credentialId) {
      return NextResponse.json(
        { error: 'Missing required fields: templateId, name, phoneNumber, credentialId' },
        { status: 400 }
      )
    }

    // Verify credential belongs to user
    const { data: credentialData } = await supabase
      .from('whatsapp_credentials')
      .select('id')
      .eq('id', credentialId)
      .eq('userId', userId)
      .single()

    if (!credentialData) {
      return NextResponse.json(
        { error: 'Credential not found or does not belong to user' },
        { status: 404 }
      )
    }

    // Create bot
    const bot = await whatsappService.createBot(userId, templateId, name, phoneNumber, credentialId)

    return NextResponse.json(bot, { status: 201 })
  } catch (error) {
    console.error('Error creating bot:', error)
    return NextResponse.json(
      { error: 'Failed to create bot', details: String(error) },
      { status: 500 }
    )
  }
}
