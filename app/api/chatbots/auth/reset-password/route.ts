import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validatePasswordResetToken, markPasswordResetTokenAsUsed } from '@/lib/supabase-chatbots-service'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Validate token
    const resetData = await validatePasswordResetToken(token)

    if (!resetData) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Update password in Supabase Auth
    console.log('[v0] Updating password for user:', resetData.userId)
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      resetData.userId,
      { password: newPassword }
    )

    if (updateError) {
      console.error('[v0] Error updating password:', updateError)
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      )
    }

    // Mark token as used
    await markPasswordResetTokenAsUsed(token)

    console.log('[v0] Password reset successful for user:', resetData.userId)

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now sign in with your new password.',
    })
  } catch (error: any) {
    console.error('[v0] Error in reset password:', error)
    return NextResponse.json(
      { error: error?.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
