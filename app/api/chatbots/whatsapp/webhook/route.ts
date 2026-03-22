import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getBotById, logActivity, updateAnalytics } from '@/lib/whatsapp-bot-service'
import { generateBotResponse } from '@/lib/whatsapp-bot-ai'
import { botRunnerManager } from '@/lib/whatsapp-bot-runner'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bot_id, from, message, timestamp } = body

    if (!bot_id || !from || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get bot
    const { data: botData } = await supabase
      .from('whatsapp_bots')
      .select('*, user_id')
      .eq('id', bot_id)
      .single()

    if (!botData) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    }

    // Get bot config
    const { data: configData } = await supabase
      .from('whatsapp_bot_config')
      .select('*')
      .eq('bot_id', bot_id)
      .single()

    // Get deployment config
    const { data: deploymentData } = await supabase
      .from('whatsapp_deployment_config')
      .select('*')
      .eq('bot_id', bot_id)
      .single()

    // Log incoming message
    await supabase.from('whatsapp_bot_logs').insert({
      bot_id,
      message_type: 'incoming',
      from_number: from,
      message_text: message,
      timestamp: new Date(timestamp || Date.now()).toISOString(),
    })

    // Check if user is whitelisted
    if (configData?.whitelisted_numbers && configData.whitelisted_numbers.length > 0) {
      if (!configData.whitelisted_numbers.includes(from)) {
        return NextResponse.json({
          success: true,
          message: 'User not whitelisted'
        })
      }
    }

    // Check business hours
    if (configData?.working_hours_enabled) {
      const now = new Date()
      const hour = now.getHours()
      const day = now.getDay()

      const isWorkingDay = !configData.working_hours_days ||
        configData.working_hours_days.includes(day)
      const isWorkingHour = hour >= configData.working_hours_start &&
        hour < configData.working_hours_end

      if (isWorkingDay && !isWorkingHour) {
        const offHourMessage = configData.off_hours_message ||
          'Sorry, I am currently offline. Please try again during business hours.'
        
        // Send off-hours response
        await sendWhatsAppMessage(from, offHourMessage, botData.phone_number)
        return NextResponse.json({ success: true })
      }
    }

    // Check rate limiting
    if (configData?.rate_limit_enabled) {
      const limit = configData.rate_limit_messages || 100
      const window = (configData.rate_limit_period || 'hour') === 'hour' ? 3600000 : 86400000

      const oneHourAgo = new Date(Date.now() - window)
      const { data: recentMessages } = await supabase
        .from('whatsapp_bot_logs')
        .select('id', { count: 'exact' })
        .eq('bot_id', bot_id)
        .eq('from_number', from)
        .eq('message_type', 'incoming')
        .gt('timestamp', oneHourAgo.toISOString())

      if (recentMessages && recentMessages.length >= limit) {
        const rateLimitMessage = 'Rate limit exceeded. Please try again later.'
        await sendWhatsAppMessage(from, rateLimitMessage, botData.phone_number)
        return NextResponse.json({ success: true })
      }
    }

    // Process message with AI
    const aiService = new WhatsAppBotAI(configData || {})
    let response = await aiService.generateResponse(message, from, configData || {})

    // Get bot runner and send message
    const runner = botRunnerManager.getRunner(bot_id)
    if (runner) {
      await runner.sendMessage(from, response)
    } else {
      // Fallback: send via webhook
      await sendWhatsAppMessage(from, response, botData.phone_number)
    }

    // Log outgoing message
    await supabase.from('whatsapp_bot_logs').insert({
      bot_id,
      message_type: 'outgoing',
      to_number: from,
      message_text: response,
      timestamp: new Date().toISOString(),
    })

    // Update analytics
    await supabase
      .from('whatsapp_bot_analytics')
      .upsert({
        bot_id,
        date: new Date().toISOString().split('T')[0],
        messages_received: 1,
        messages_sent: 1,
      }, { onConflict: 'bot_id,date' })

    return NextResponse.json({ success: true, response })
  } catch (error) {
    console.error('[v0] Webhook error:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}

async function sendWhatsAppMessage(to: string, message: string, phoneNumber: string) {
  // This would integrate with WhatsApp API or Baileys
  // For now, this is a placeholder
  console.log(`[v0] Sending message from ${phoneNumber} to ${to}: ${message}`)
}
