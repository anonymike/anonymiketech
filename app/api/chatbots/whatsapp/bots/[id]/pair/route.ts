import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getBotById, createOrUpdateSession } from '@/lib/whatsapp-bot-service'
import { getChatbotUserByAuthId } from '@/lib/supabase-chatbots-service'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Function to generate a random pairing code
function generatePairingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
    const { data, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user
    const user = await getChatbotUserByAuthId(data.user.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify bot ownership
    const bot = await getBotById(params.id, data.user.id)
    if (!bot) {
      return NextResponse.json(
        { error: 'Bot not found or not owned by user' },
        { status: 404 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { method } = body

    if (method === 'code') {
      // Generate pairing code
      const pairingCode = generatePairingCode()

      // Update session with pairing code
      await createOrUpdateSession(params.id, {
        pairingCode,
        pairingCodeGeneratedAt: new Date().toISOString(),
      })

      return NextResponse.json({
        success: true,
        data: {
          pairingCode,
          expiresIn: 600, // 10 minutes
        },
      })
    } else if (method === 'qr') {
      // Generate QR code (in a real implementation, this would generate an actual QR code)
      const qrData = `whatsapp://pair/${params.id}/${generatePairingCode()}`

      return NextResponse.json({
        success: true,
        data: {
          qrCode: qrData,
          expiresIn: 60, // 1 minute
        },
      })
    }

    return NextResponse.json(
      { error: 'Invalid pairing method' },
      { status: 400 }
    )
  } catch (error) {
    console.error('[v0] Error generating pairing code:', error)
    return NextResponse.json(
      { error: 'Failed to generate pairing code' },
      { status: 500 }
    )
  }
}
