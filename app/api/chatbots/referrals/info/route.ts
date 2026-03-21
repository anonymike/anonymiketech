import { NextResponse } from 'next/server'
import { getChatbotUserByAuthId, getUserReferralInfo, getInvitedUsers } from '@/lib/supabase-chatbots-service'
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

    // Get referral info
    const referralInfo = await getUserReferralInfo(user.id)
    
    if (!referralInfo) {
      return NextResponse.json(
        { error: 'Failed to fetch referral info' },
        { status: 500 }
      )
    }

    // Get invited users
    const invitedUsers = await getInvitedUsers(user.id)

    return NextResponse.json({
      success: true,
      data: {
        referralCode: referralInfo.referralCode,
        invitesCount: referralInfo.invitesCount,
        invitedUsers: invitedUsers.map((u: any) => ({
          id: u.id,
          username: u.username,
          email: u.email,
          createdAt: u.created_at,
        })),
      },
    })
  } catch (error) {
    console.error('[v0] Error fetching referral info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch referral info' },
      { status: 500 }
    )
  }
}
