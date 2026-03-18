import { NextResponse } from 'next/server'
import { getChatbotTypes } from '@/lib/supabase-chatbots-service'

export async function GET() {
  try {
    const botTypes = await getChatbotTypes()
    
    return NextResponse.json({
      success: true,
      data: botTypes,
    })
  } catch (error) {
    console.error('[v0] Error fetching bot types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bot types' },
      { status: 500 }
    )
  }
}
