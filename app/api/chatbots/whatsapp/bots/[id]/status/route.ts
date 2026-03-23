import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getBotById, getSession } from '@/lib/whatsapp-bot-service'
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

    // Get session to check linking status
    const session = await getSession(params.id)

    return NextResponse.json({
      success: true,
      data: {
        botId: params.id,
        isLinked: session?.isConnected || false,
        linkedPhoneNumber: session?.sessionData?.phoneNumber || null,
        qrCode: session?.qrCode || null,
        lastActivity: session?.lastActivity || null,
      },
    })
  } catch (error) {
    console.error('[v0] Error fetching bot status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bot status' },
      { status: 500 }
    )
  }
}
