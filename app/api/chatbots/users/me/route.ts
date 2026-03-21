import { NextResponse } from 'next/server'
import { getChatbotUserByAuthId, updateChatbotUserProfile } from '@/lib/supabase-chatbots-service'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1]
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify token
    const { data, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !data.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile
    const user = await getChatbotUserByAuthId(data.user.id)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('[v0] Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1]
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify token
    const { data, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !data.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current user
    const user = await getChatbotUserByAuthId(data.user.id)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    const updates = await request.json()
    
    // Allow only certain fields to be updated
    const allowedUpdates: Record<string, any> = {}
    if (updates.username) allowedUpdates.username = updates.username
    if (updates.email) allowedUpdates.email = updates.email
    if (updates.phone_number) allowedUpdates.phone_number = updates.phone_number
    if (updates.profile_image) allowedUpdates.profile_image = updates.profile_image

    // If email is being updated, also update it in Supabase Auth
    if (updates.email && updates.email !== user.email) {
      const { error: emailError } = await supabaseAdmin.auth.admin.updateUserById(
        data.user.id,
        { email: updates.email }
      )
      if (emailError) {
        console.error('[v0] Error updating email in auth:', emailError)
        return NextResponse.json(
          { error: 'Failed to update email' },
          { status: 500 }
        )
      }
    }

    const updatedUser = await updateChatbotUserProfile(user.id, allowedUpdates)
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
    })
  } catch (error) {
    console.error('[v0] Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
