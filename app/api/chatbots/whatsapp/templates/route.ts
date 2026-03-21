import { NextResponse } from 'next/server'
import { getWhatsappBotTemplates } from '@/lib/whatsapp-bot-service'

export async function GET() {
  try {
    const templates = await getWhatsappBotTemplates()

    return NextResponse.json({
      success: true,
      data: templates,
    })
  } catch (error) {
    console.error('[v0] Error fetching WhatsApp bot templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}
