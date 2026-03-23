import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  getBotById,
  getBotConfig,
  createBotConfig,
  updateBotConfig,
} from '@/lib/whatsapp-bot-service'
import { getChatbotUserByAuthId } from '@/lib/supabase-chatbots-service'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
    const bot = await getBotById(params.id, data.user.id)
    if (!bot) {
      return NextResponse.json(
        { error: 'Bot not found or not owned by user' },
        { status: 404 }
      )
    }

    // Get config
    const config = await getBotConfig(params.id)

    return NextResponse.json({
      success: true,
      data: config,
    })
  } catch (error) {
    console.error('[v0] Error fetching WhatsApp bot config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bot config' },
      { status: 500 }
    )
  }
}

export async function POST(
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
    const bot = await getBotById(params.id, data.user.id)
    if (!bot) {
      return NextResponse.json(
        { error: 'Bot not found or not owned by user' },
        { status: 404 }
      )
    }

    const configData = await request.json()

    // Check if config already exists
    let config = await getBotConfig(params.id)

    if (config) {
      // Update existing config
      config = await updateBotConfig(params.id, configData)
      if (!config) {
        return NextResponse.json(
          { error: 'Failed to update bot config' },
          { status: 500 }
        )
      }
    } else {
      // Create new config
      config = await createBotConfig(params.id, configData)
      if (!config) {
        return NextResponse.json(
          { error: 'Failed to create bot config' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      data: config,
      message: 'Bot config saved successfully',
    })
  } catch (error) {
    console.error('[v0] Error saving WhatsApp bot config:', error)
    return NextResponse.json(
      { error: 'Failed to save bot config' },
      { status: 500 }
    )
  }
}
