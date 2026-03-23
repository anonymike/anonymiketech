import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// POST /api/chatbots/whatsapp/bots/[id]/session - Import TRUTH MD session
export async function POST(
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

    // Verify bot belongs to user
    const { data: bot, error: botError } = await supabase
      .from('whatsapp_bots')
      .select('id, user_id')
      .eq('id', botId)
      .eq('user_id', userId)
      .single()

    if (botError || !bot) {
      return NextResponse.json({ error: 'Bot not found or access denied' }, { status: 404 })
    }

    const body = await request.json()
    const { session_string, source } = body

    if (!session_string || !session_string.startsWith('TRUTH-MD:~')) {
      return NextResponse.json(
        { error: 'Invalid session format. Must start with TRUTH-MD:~' },
        { status: 400 }
      )
    }

    console.log('[v0] Importing TRUTH MD session for bot:', botId)

    // Store session in database
    const { data: sessionData, error: sessionError } = await supabase
      .from('whatsapp_bot_sessions')
      .upsert(
        {
          bot_id: botId,
          session_string: session_string,
          source: source || 'truth_md',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'bot_id' }
      )
      .select()
      .single()

    if (sessionError) {
      console.error('[v0] Error storing session:', sessionError)
      return NextResponse.json(
        { error: 'Failed to store session in database' },
        { status: 500 }
      )
    }

    console.log('[v0] Session imported successfully for bot:', botId)

    // Update bot status to "configuring" or "ready_to_deploy"
    const { data: updatedBot, error: updateError } = await supabase
      .from('whatsapp_bots')
      .update({
        status: 'configuring',
        updated_at: new Date().toISOString(),
      })
      .eq('id', botId)
      .select()
      .single()

    if (updateError) {
      console.error('[v0] Error updating bot status:', updateError)
    }

    // Log the activity
    await supabase.from('chatbot_activity_logs').insert({
      bot_id: botId,
      user_id: userId,
      event_type: 'session_imported',
      message: 'TRUTH MD session imported successfully',
      data: {
        source: source,
        timestamp: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        botId,
        sessionId: sessionData?.id,
        status: 'session_stored',
        message: 'Session imported successfully. Bot is ready to be deployed.',
      },
    })
  } catch (error) {
    console.error('[v0] Error in session import:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/chatbots/whatsapp/bots/[id]/session - Get bot session
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

    // Verify bot belongs to user
    const { data: bot, error: botError } = await supabase
      .from('whatsapp_bots')
      .select('id, user_id')
      .eq('id', botId)
      .eq('user_id', userId)
      .single()

    if (botError || !bot) {
      return NextResponse.json({ error: 'Bot not found or access denied' }, { status: 404 })
    }

    // Get session
    const { data: sessionData, error: sessionError } = await supabase
      .from('whatsapp_bot_sessions')
      .select('*')
      .eq('bot_id', botId)
      .single()

    if (sessionError && sessionError.code !== 'PGRST116') {
      console.error('[v0] Error fetching session:', sessionError)
      return NextResponse.json(
        { error: 'Failed to fetch session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: sessionData || null,
    })
  } catch (error) {
    console.error('[v0] Error in GET session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/chatbots/whatsapp/bots/[id]/session - Delete bot session
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

    // Verify bot belongs to user
    const { data: bot, error: botError } = await supabase
      .from('whatsapp_bots')
      .select('id, user_id')
      .eq('id', botId)
      .eq('user_id', userId)
      .single()

    if (botError || !bot) {
      return NextResponse.json({ error: 'Bot not found or access denied' }, { status: 404 })
    }

    console.log('[v0] Deleting session for bot:', botId)

    // Delete session
    const { error: deleteError } = await supabase
      .from('whatsapp_bot_sessions')
      .delete()
      .eq('bot_id', botId)

    if (deleteError) {
      console.error('[v0] Error deleting session:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete session' },
        { status: 500 }
      )
    }

    // Update bot status back to draft
    await supabase
      .from('whatsapp_bots')
      .update({
        status: 'draft',
        updated_at: new Date().toISOString(),
      })
      .eq('id', botId)

    // Log the activity
    await supabase.from('chatbot_activity_logs').insert({
      bot_id: botId,
      user_id: userId,
      event_type: 'session_deleted',
      message: 'Bot session removed',
      data: {
        timestamp: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Session deleted successfully',
    })
  } catch (error) {
    console.error('[v0] Error in DELETE session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
