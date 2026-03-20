import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log('[v0] Login attempt for:', email)

    // Validate inputs
    if (!email || !password) {
      console.log('[v0] Missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Authenticate user with Supabase Auth
    console.log('[v0] Authenticating with Supabase...')
    const { data, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error('[v0] Auth error:', authError.message)
      return NextResponse.json(
        { error: authError.message || 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!data.user) {
      console.error('[v0] No user returned from auth')
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }

    console.log('[v0] Auth successful for user:', data.user.id)

    // Fetch chatbot user profile from chatbot_users table using admin client
    console.log('[v0] Fetching chatbot user profile...')
    const { data: chatbotUser, error: profileError } = await supabaseAdmin
      .from('chatbot_users')
      .select('*')
      .eq('auth_id', data.user.id)
      .single()

    if (profileError) {
      console.error('[v0] Profile fetch error:', {
        message: profileError.message,
        code: profileError.code,
      })
      return NextResponse.json(
        { error: 'User profile not found. Please contact support.' },
        { status: 404 }
      )
    }

    if (!chatbotUser) {
      console.error('[v0] No profile data returned')
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    console.log('[v0] Login successful for user:', chatbotUser.id)

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
  } catch (error: any) {
    console.error('[v0] Unexpected login error:', {
      message: error?.message,
      stack: error?.stack,
    })
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred during login' },
      { status: 500 }
    )
  }
}
