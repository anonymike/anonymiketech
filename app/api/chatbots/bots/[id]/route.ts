import { NextResponse } from 'next/server'
import {
  getChatbotUserByAuthId,
  getDeployedBot,
  updateBotStatus,
  deleteBot,
} from '@/lib/supabase-chatbots-service'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const bot = await getDeployedBot(id, user.id)

    if (!bot) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: bot,
    })
  } catch (error) {
    console.error('[v0] Error fetching bot:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bot' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const bot = await getDeployedBot(id, user.id)

    if (!bot) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      )
    }

    const success = await deleteBot(id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete bot' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Bot deleted successfully',
    })
  } catch (error) {
    console.error('[v0] Error deleting bot:', error)
    return NextResponse.json(
      { error: 'Failed to delete bot' },
      { status: 500 }
    )
  }
}
