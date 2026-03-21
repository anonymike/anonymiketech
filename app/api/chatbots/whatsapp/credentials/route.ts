import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as whatsappService from '@/lib/whatsapp-bot-service'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// GET /api/chatbots/whatsapp/credentials - List user's credentials
export async function GET(request: NextRequest) {
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

    // Get credentials
    const credentials = await whatsappService.getCredentials(userId)

    // Don't send encrypted credentials in response
    const safeCredentials = credentials.map((cred) => ({
      id: cred.id,
      phoneNumber: cred.phoneNumber,
      isActive: cred.isActive,
      createdAt: cred.createdAt,
      updatedAt: cred.updatedAt,
    }))

    return NextResponse.json(safeCredentials)
  } catch (error) {
    console.error('Error fetching credentials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch credentials', details: String(error) },
      { status: 500 }
    )
  }
}

// POST /api/chatbots/whatsapp/credentials - Add new credentials
export async function POST(request: NextRequest) {
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

    // Parse request
    const body = await request.json()
    const { phoneNumber, credentials } = body

    if (!phoneNumber || !credentials) {
      return NextResponse.json(
        { error: 'Missing required fields: phoneNumber, credentials' },
        { status: 400 }
      )
    }

    // Encrypt credentials
    const encryptedCreds: Record<string, string> = {}
    for (const [key, value] of Object.entries(credentials)) {
      encryptedCreds[key] = whatsappService.encryptCredential(String(value))
    }

    // Create credentials
    const result = await whatsappService.createCredentials(
      userId,
      phoneNumber,
      encryptedCreds
    )

    return NextResponse.json(
      {
        id: result.id,
        phoneNumber: result.phoneNumber,
        isActive: result.isActive,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating credentials:', error)
    return NextResponse.json(
      { error: 'Failed to create credentials', details: String(error) },
      { status: 500 }
    )
  }
}
