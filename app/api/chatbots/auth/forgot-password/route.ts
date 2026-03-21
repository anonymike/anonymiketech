import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createPasswordResetToken, getChatbotUser } from '@/lib/supabase-chatbots-service'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email
    const { data: users, error: queryError } = await supabaseAdmin
      .from('chatbot_users')
      .select('id')
      .eq('email', email)
      .limit(1)

    if (queryError) {
      console.error('[v0] Error querying user by email:', queryError)
      return NextResponse.json(
        { error: 'Failed to process request' },
        { status: 500 }
      )
    }

    const user = users?.[0]

    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      })
    }

    // Create password reset token
    const token = await createPasswordResetToken(user.id)

    if (!token) {
      return NextResponse.json(
        { error: 'Failed to create reset token' },
        { status: 500 }
      )
    }

    // In a real app, you would send an email with the reset link here
    // For now, we'll just return the token for testing
    // Email format would be: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

    console.log('[v0] Password reset token created for email:', email)

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
      // Remove this in production - only for testing
      token: process.env.NODE_ENV === 'development' ? token : undefined,
    })
  } catch (error: any) {
    console.error('[v0] Error in forgot password:', error)
    return NextResponse.json(
      { error: error?.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
