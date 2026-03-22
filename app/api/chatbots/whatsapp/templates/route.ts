import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getWhatsappBotTemplates } from '@/lib/whatsapp-bot-service'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const DEFAULT_TEMPLATES = [
  {
    id: 'customer-support',
    name: 'Customer Support Bot',
    description: 'Handles customer inquiries and support tickets',
    icon: '🎧',
    system_prompt: 'You are a helpful customer support agent. Respond professionally to customer inquiries and help resolve issues.',
    welcome_message: 'Welcome! How can I help you today?',
    commands: [
      { command: '/help', description: 'Show available commands' },
      { command: '/ticket', description: 'Create a support ticket' }
    ]
  },
  {
    id: 'ecommerce-sales',
    name: 'E-Commerce Sales Bot',
    description: 'Sells products and assists with orders',
    icon: '🛒',
    system_prompt: 'You are an e-commerce sales assistant. Help customers find products, answer questions about items, and guide them through the purchase process.',
    welcome_message: 'Welcome to our store! Browse our products or ask me for recommendations.',
    commands: [
      { command: '/products', description: 'List available products' },
      { command: '/cart', description: 'View shopping cart' }
    ]
  },
  {
    id: 'appointment-scheduler',
    name: 'Appointment Scheduler',
    description: 'Books appointments and sends reminders',
    icon: '📅',
    system_prompt: 'You are an appointment scheduling assistant. Help users book appointments by collecting their preferred date, time, and service type.',
    welcome_message: 'Book an appointment with us! What service are you interested in?',
    commands: [
      { command: '/schedule', description: 'Schedule an appointment' },
      { command: '/cancel', description: 'Cancel an appointment' }
    ]
  },
  {
    id: 'newsletter-bot',
    name: 'Newsletter Bot',
    description: 'Manages newsletter subscriptions and delivery',
    icon: '📰',
    system_prompt: 'You are a newsletter management bot. Help users subscribe, unsubscribe, and manage their preferences.',
    welcome_message: 'Subscribe to our newsletter for weekly updates!',
    commands: [
      { command: '/subscribe', description: 'Subscribe to newsletter' },
      { command: '/unsubscribe', description: 'Unsubscribe from newsletter' }
    ]
  },
  {
    id: 'ai-chatbot',
    name: 'General AI Chatbot',
    description: 'Conversational AI for general queries',
    icon: '🤖',
    system_prompt: 'You are a helpful, friendly AI assistant. Answer questions and engage in conversations helpfully and accurately.',
    welcome_message: 'Hi! I\'m an AI assistant. Feel free to ask me anything!',
    commands: [
      { command: '/help', description: 'Show help information' }
    ]
  }
]

export async function GET(request: NextRequest) {
  try {
    const templates = await getWhatsappBotTemplates()

    return NextResponse.json({
      success: true,
      data: templates || DEFAULT_TEMPLATES,
    })
  } catch (error) {
    console.error('[v0] Error fetching WhatsApp bot templates:', error)
    // Return default templates if database fails
    return NextResponse.json({
      success: true,
      data: DEFAULT_TEMPLATES,
    })
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { name, description, icon, system_prompt, welcome_message, commands } = body

    if (!name || !system_prompt) {
      return NextResponse.json(
        { error: 'Name and system_prompt are required' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Template creation not yet implemented'
    }, { status: 201 })
  } catch (error) {
    console.error('[v0] Template creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}
