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

    return NextResponse.json({
      success: true,
      data: safeCredentials,
    })
  } catch (error) {
    console.error('Error fetching credentials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch credentials', details: String(error) },
      { status: 500 }
    )
  }
}

// POST /api/chatbots/whatsapp/credentials - Add new credentials or validate pairing code
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
    const { action, pairing_code, phone_number, phoneNumber, credentials } = body

    // Handle pairing code validation
    if (action === 'validate_pairing_code') {
      if (!pairing_code) {
        return NextResponse.json(
          { error: 'Missing required field: pairing_code' },
          { status: 400 }
        )
      }

      // Verify pairing session exists and is valid
      const { data: session, error: sessionError } = await supabase
        .from('whatsapp_pairing_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('pairing_code', pairing_code.toUpperCase())
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .single()

      if (sessionError || !session) {
        return NextResponse.json(
          { error: 'Invalid or expired pairing code' },
          { status: 400 }
        )
      }

      // Update session status to verified
      await supabase
        .from('whatsapp_pairing_sessions')
        .update({ status: 'verified', verified_at: new Date().toISOString() })
        .eq('id', session.id)

      // Create credentials for the paired account
      const credentialData = {
        method: 'whatsapp_pairing',
        paired_at: new Date().toISOString(),
      }

      const encryptedCreds: Record<string, string> = {}
      for (const [key, value] of Object.entries(credentialData)) {
        encryptedCreds[key] = whatsappService.encryptCredential(String(value))
      }

      // Create or update credentials
      const { data: credential, error: credError } = await supabase
        .from('whatsapp_credentials')
        .insert({
          user_id: userId,
          phone_number: phone_number || 'verified',
          credentials: encryptedCreds,
          is_active: true,
        })
        .select()
        .single()

      if (credError) {
        console.error('[v0] Error creating credential:', credError)
        return NextResponse.json(
          { error: 'Failed to create credential' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data: {
          id: credential.id,
          phoneNumber: credential.phone_number,
          isActive: credential.is_active,
          message: 'WhatsApp account successfully paired',
        },
      })
    }

    // Original credentials creation logic
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
        success: true,
        data: {
          id: result.id,
          phoneNumber: result.phoneNumber,
          isActive: result.isActive,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error with credentials:', error)
    return NextResponse.json(
      { error: 'Failed to process credentials', details: String(error) },
      { status: 500 }
    )
  }
}
