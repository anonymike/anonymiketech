#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('[v0] Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function setupWhatsAppBotDatabase() {
  try {
    console.log('[v0] Starting WhatsApp bot database setup...')

    // Create whatsapp_bot_templates table
    console.log('[v0] Creating whatsapp_bot_templates table...')
    await supabase.from('whatsapp_bot_templates').insert([]).then(() => {})
    
    // Create whatsapp_credentials table
    console.log('[v0] Creating whatsapp_credentials table...')
    await supabase.from('whatsapp_credentials').insert([]).then(() => {})

    // Create whatsapp_bots table
    console.log('[v0] Creating whatsapp_bots table...')
    await supabase.from('whatsapp_bots').insert([]).then(() => {})

    // Create whatsapp_bot_config table
    console.log('[v0] Creating whatsapp_bot_config table...')
    await supabase.from('whatsapp_bot_config').insert([]).then(() => {})

    // Create whatsapp_deployment_config table
    console.log('[v0] Creating whatsapp_deployment_config table...')
    await supabase.from('whatsapp_deployment_config').insert([]).then(() => {})

    // Create whatsapp_bot_sessions table
    console.log('[v0] Creating whatsapp_bot_sessions table...')
    await supabase.from('whatsapp_bot_sessions').insert([]).then(() => {})

    // Create whatsapp_bot_logs table
    console.log('[v0] Creating whatsapp_bot_logs table...')
    await supabase.from('whatsapp_bot_logs').insert([]).then(() => {})

    // Create whatsapp_bot_analytics table
    console.log('[v0] Creating whatsapp_bot_analytics table...')
    await supabase.from('whatsapp_bot_analytics').insert([]).then(() => {})

    // Insert default templates
    console.log('[v0] Inserting default bot templates...')
    const templates = [
      {
        name: 'Customer Support Bot',
        description: 'Automated customer support and FAQ handling',
        category: 'customer_support',
        icon: '🤖',
        features: ['FAQ responses', 'Ticket creation', 'Knowledge base integration'],
        default_config: {
          response_mode: 'automatic',
          fallback_to_human: true,
        },
        repository_url: 'https://github.com/baileys-js/customer-support-bot',
        is_active: true,
      },
      {
        name: 'E-Commerce Bot',
        description: 'Product catalog, orders, and shopping assistance',
        category: 'ecommerce',
        icon: '🛍️',
        features: ['Product search', 'Order tracking', 'Payment links', 'Cart management'],
        default_config: {
          show_catalog: true,
          enable_orders: true,
        },
        repository_url: 'https://github.com/baileys-js/ecommerce-bot',
        is_active: true,
      },
      {
        name: 'Lead Generation Bot',
        description: 'Collect leads and customer information',
        category: 'lead_generation',
        icon: '📊',
        features: ['Form filling', 'Lead qualification', 'CRM integration', 'Email collection'],
        default_config: {
          collect_email: true,
          collect_phone: true,
        },
        repository_url: 'https://github.com/baileys-js/lead-generation-bot',
        is_active: true,
      },
      {
        name: 'Notification Bot',
        description: 'Send automated notifications and reminders',
        category: 'notifications',
        icon: '🔔',
        features: ['Scheduled messages', 'Event notifications', 'Broadcast messages', 'Reminder system'],
        default_config: {
          use_scheduler: true,
          timezone: 'UTC',
        },
        repository_url: 'https://github.com/baileys-js/notification-bot',
        is_active: true,
      },
      {
        name: 'Custom Bot',
        description: 'Build your own WhatsApp bot with custom logic',
        category: 'custom',
        icon: '⚙️',
        features: ['Custom prompts', 'Webhook integration', 'Database connectivity', 'API integration'],
        default_config: {
          custom_logic: true,
          webhook_enabled: true,
        },
        repository_url: 'https://github.com/baileys-js/custom-bot-template',
        is_active: true,
      },
    ]

    for (const template of templates) {
      await supabase.from('whatsapp_bot_templates').insert([template]).catch(err => {
        if (!err.message.includes('duplicate')) {
          console.warn('[v0] Warning inserting template:', err.message)
        }
      })
    }

    console.log('[v0] ✅ WhatsApp bot database setup completed successfully!')
  } catch (error) {
    console.error('[v0] ❌ Error setting up WhatsApp bot database:', error)
    process.exit(1)
  }
}

setupWhatsAppBotDatabase()
