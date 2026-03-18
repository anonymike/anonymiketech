import { NextResponse } from 'next/server'
import {
  getChatbotUserByAuthId,
  getUserDeployedBots,
  deployBot,
  getChatbotType,
  updateCoinBalance,
  recordTransaction,
} from '@/lib/supabase-chatbots-service'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1]
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify token
    const { data, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !data.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user
    const user = await getChatbotUserByAuthId(data.user.id)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get user's deployed bots
    const bots = await getUserDeployedBots(user.id)

    return NextResponse.json({
      success: true,
      data: bots,
      coinBalance: user.coin_balance,
    })
  } catch (error) {
    console.error('[v0] Error fetching deployed bots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deployed bots' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1]
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify token
    const { data, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !data.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { botTypeId, botName, webhookUrl, config } = await request.json()

    // Validate inputs
    if (!botTypeId || !botName) {
      return NextResponse.json(
        { error: 'Missing required fields: botTypeId, botName' },
        { status: 400 }
      )
    }

    // Get user
    const user = await getChatbotUserByAuthId(data.user.id)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get bot type
    const botType = await getChatbotType(botTypeId)
    if (!botType) {
      return NextResponse.json(
        { error: 'Bot type not found' },
        { status: 404 }
      )
    }

    // Check if user has enough coins
    if (user.coin_balance < botType.cost_in_coins) {
      return NextResponse.json(
        {
          error: 'Insufficient coins',
          required: botType.cost_in_coins,
          available: user.coin_balance,
        },
        { status: 400 }
      )
    }

    // Deploy bot
    const deployedBot = await deployBot(
      user.id,
      botTypeId,
      botName,
      webhookUrl,
      config
    )

    if (!deployedBot) {
      return NextResponse.json(
        { error: 'Failed to deploy bot' },
        { status: 500 }
      )
    }

    // Deduct coins
    const updatedUser = await updateCoinBalance(user.id, -botType.cost_in_coins)
    
    // Record transaction
    await recordTransaction(
      user.id,
      botType.cost_in_coins,
      'deployment',
      'completed',
      undefined,
      undefined,
      undefined,
      `Deployed ${botType.name}: ${botName}`
    )

    return NextResponse.json({
      success: true,
      data: deployedBot,
      message: `Bot deployed successfully. ${botType.cost_in_coins} coins deducted.`,
      remainingCoins: updatedUser?.coin_balance || 0,
    }, { status: 201 })
  } catch (error) {
    console.error('[v0] Error deploying bot:', error)
    return NextResponse.json(
      { error: 'Failed to deploy bot' },
      { status: 500 }
    )
  }
}
