import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify bot ownership
    const { data: bot } = await supabase
      .from('whatsapp_bots')
      .select('id, user_id')
      .eq('id', params.id)
      .single()

    if (!bot || bot.user_id !== user.user.id) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    }

    // Get today's date
    const today = new Date().toISOString().split('T')[0]

    // Get analytics
    const { data: analytics } = await supabase
      .from('whatsapp_bot_analytics')
      .select('*')
      .eq('bot_id', params.id)
      .eq('date', today)
      .single()

    // Get logs for message counts
    const { count: incomingCount } = await supabase
      .from('whatsapp_bot_logs')
      .select('id', { count: 'exact' })
      .eq('bot_id', params.id)
      .eq('message_type', 'incoming')
      .gte('timestamp', `${today}T00:00:00`)

    const { count: outgoingCount } = await supabase
      .from('whatsapp_bot_logs')
      .select('id', { count: 'exact' })
      .eq('bot_id', params.id)
      .eq('message_type', 'outgoing')
      .gte('timestamp', `${today}T00:00:00`)

    // Get all-time stats
    const { count: totalIncoming } = await supabase
      .from('whatsapp_bot_logs')
      .select('id', { count: 'exact' })
      .eq('bot_id', params.id)
      .eq('message_type', 'incoming')

    const { count: totalOutgoing } = await supabase
      .from('whatsapp_bot_logs')
      .select('id', { count: 'exact' })
      .eq('bot_id', params.id)
      .eq('message_type', 'outgoing')

    // Get unique users
    const { data: uniqueUsers } = await supabase
      .from('whatsapp_bot_logs')
      .select('from_number')
      .eq('bot_id', params.id)
      .eq('message_type', 'incoming')
      .gte('timestamp', `${today}T00:00:00`)

    const activeUsersSet = new Set(uniqueUsers?.map(log => log.from_number) || [])

    return NextResponse.json({
      success: true,
      data: {
        total_messages: (totalIncoming || 0) + (totalOutgoing || 0),
        messages_today: (incomingCount || 0) + (outgoingCount || 0),
        incoming_today: incomingCount || 0,
        outgoing_today: outgoingCount || 0,
        active_users: activeUsersSet.size,
        uptime_percentage: 99.5, // Placeholder - would need actual uptime tracking
        avg_response_time: 0.8, // Placeholder - would need actual timing
        ...analytics,
      },
    })
  } catch (error) {
    console.error('[v0] Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
