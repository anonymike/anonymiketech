import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createChatbotUser } from '@/lib/supabase-chatbots-service'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { email, password, username, phoneNumber } = await request.json()

    // Validate inputs
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, username' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Create auth user
    const { data, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
    })

    if (authError) {
      console.error('[v0] Auth error:', authError)
      return NextResponse.json(
        { error: authError.message || 'Failed to create user' },
        { status: 400 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'User creation failed' },
        { status: 500 }
      )
    }

    // Create chatbot user profile
    console.log('[v0] Creating chatbot user profile for:', data.user.id)
    const chatbotUser = await createChatbotUser(
      data.user.id,
      email,
      username,
      phoneNumber
    )

    if (!chatbotUser) {
      console.error('[v0] Failed to create chatbot user profile. Tables may not exist. Check Supabase SQL migration.')
      // Delete the auth user if profile creation failed
      await supabaseAdmin.auth.admin.deleteUser(data.user.id)
      return NextResponse.json(
        { error: 'Failed to create user profile. Database tables not initialized. Please run the SQL migration in Supabase.' },
        { status: 500 }
      )
    }
    console.log('[v0] Chatbot user created successfully:', chatbotUser.id)

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: chatbotUser.id,
        email: chatbotUser.email,
        username: chatbotUser.username,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('[v0] Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to process signup request' },
      { status: 500 }
    )
  }
}
