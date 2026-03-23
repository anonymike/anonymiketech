import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_TEMPLATES = [
  {
    id: 'customer-support',
    name: 'Customer Support Bot',
    description: 'Handles customer inquiries and support tickets',
    icon: '🎧',
    category: 'Support',
    features: ['Ticket Management', 'FAQ System', 'Customer History'],
    repository_url: 'https://github.com/example/customer-support-bot',
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
    category: 'Sales',
    features: ['Product Catalog', 'Order Management', 'Payment Integration'],
    repository_url: 'https://github.com/example/ecommerce-bot',
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
    category: 'Scheduling',
    features: ['Calendar Integration', 'Reminder Notifications', 'Availability Management'],
    repository_url: 'https://github.com/example/appointment-scheduler-bot',
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
    category: 'Marketing',
    features: ['Subscription Management', 'Content Distribution', 'Analytics'],
    repository_url: 'https://github.com/example/newsletter-bot',
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
    category: 'General',
    features: ['Natural Language Understanding', 'Context Awareness', 'Multi-turn Conversations'],
    repository_url: 'https://github.com/example/general-ai-chatbot',
    system_prompt: 'You are a helpful, friendly AI assistant. Answer questions and engage in conversations helpfully and accurately.',
    welcome_message: 'Hi! I\'m an AI assistant. Feel free to ask me anything!',
    commands: [
      { command: '/help', description: 'Show help information' }
    ]
  }
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: DEFAULT_TEMPLATES,
    })
  } catch (error) {
    console.error('[v0] Error fetching WhatsApp bot templates:', error)
    return NextResponse.json({
      success: true,
      data: DEFAULT_TEMPLATES,
    })
  }
}
