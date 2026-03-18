import { NextResponse } from 'next/server'
import {
  getChatbotUserByAuthId,
  getDeployedBot,
  updateBotStatus,
} from '@/lib/supabase-chatbots-service'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(
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
    const { status, errorMessage } = await request.json()

    // Validate status
    if (!['active', 'stopped', 'error'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const bot = await getDeployedBot(id, user.id)

    if (!bot) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      )
    }

    const updatedBot = await updateBotStatus(id, status, errorMessage)
    
    if (!updatedBot) {
      return NextResponse.json(
        { error: 'Failed to update bot status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedBot,
      message: `Bot status updated to ${status}`,
    })
  } catch (error) {
    console.error('[v0] Error updating bot status:', error)
    return NextResponse.json(
      { error: 'Failed to update bot status' },
      { status: 500 }
    )
  }
}
