import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getChatbotUserByAuthId } from '@/lib/supabase-chatbots-service'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password' },
        { status: 400 }
      )
    }

    // Authenticate user with Supabase
    const { data, error: authError } = await supabaseAdmin.auth.signInWithPassword(
      email,
      password
    )

    if (authError || !data.user) {
      console.error('[v0] Auth error:', authError)
      return NextResponse.json(
        { error: authError?.message || 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Get chatbot user profile
    const chatbotUser = await getChatbotUserByAuthId(data.user.id)

    if (!chatbotUser) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_at: data.session?.expires_at,
      },
      user: {
        id: chatbotUser.id,
        email: chatbotUser.email,
        username: chatbotUser.username,
        coin_balance: chatbotUser.coin_balance,
      },
    }, { status: 200 })
  } catch (error) {
    console.error('[v0] Login error:', error)
    return NextResponse.json(
      { error: 'Failed to process login request' },
      { status: 500 }
    )
  }
}
