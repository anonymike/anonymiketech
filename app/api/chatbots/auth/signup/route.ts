import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createReferral, getUserByReferralCode, setUserReferralCode } from '@/lib/supabase-chatbots-service'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { email, password, username, phoneNumber, referralCode } = await request.json()

    console.log('[v0] Signup attempt for:', email)

    // Validate inputs
    if (!email || !password || !username) {
      console.log('[v0] Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields: email, password, username' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      console.log('[v0] Password too short')
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Create auth user with auto-confirmed email
    console.log('[v0] Creating Supabase auth user...')
    const { data, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      console.error('[v0] Auth creation error:', authError.message)
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

    // Create chatbot user profile using admin client with 50 free welcome coins
    console.log('[v0] Creating chatbot user profile for:', data.user.id)
    const FREE_WELCOME_COINS = 50
    const { data: chatbotUser, error: profileError } = await supabaseAdmin
      .from('chatbot_users')
      .insert([
        {
          auth_id: data.user.id,
          email,
          username,
          phone_number: phoneNumber,
          coin_balance: FREE_WELCOME_COINS,
          total_coins_purchased: 0,
        },
      ])
      .select()
      .single()

    if (profileError) {
      console.error('[v0] Failed to create chatbot user profile:', {
        message: profileError.message,
        code: profileError.code,
        details: profileError.details,
        hint: profileError.hint,
      })
      // Delete the auth user if profile creation failed
      console.log('[v0] Deleting auth user due to profile creation failure')
      await supabaseAdmin.auth.admin.deleteUser(data.user.id)
      
      // Provide better error message based on error code
      let errorMessage = 'Failed to create user profile'
      if (profileError.code === '42501') {
        errorMessage = 'Permission denied. RLS policies may be misconfigured.'
      } else if (profileError.code === 'PGRST205') {
        errorMessage = 'Database tables not found. Please run the SQL migration.'
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }

    if (!chatbotUser) {
      console.error('[v0] Profile creation returned no data')
      await supabaseAdmin.auth.admin.deleteUser(data.user.id)
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      )
    }

    console.log('[v0] Chatbot user created successfully:', chatbotUser.id)

    // Generate and set referral code for new user
    console.log('[v0] Generating referral code for:', chatbotUser.id)
    await setUserReferralCode(chatbotUser.id)

    // Handle referral reward if referral code was provided
    if (referralCode) {
      console.log('[v0] Processing referral code:', referralCode)
      const referrerUser = await getUserByReferralCode(referralCode)
      if (referrerUser) {
        console.log('[v0] Found referrer:', referrerUser.id)
        const success = await createReferral(referrerUser.id, chatbotUser.id)
        if (success) {
          console.log('[v0] Referral reward granted to referrer:', referrerUser.id)
        } else {
          console.error('[v0] Failed to grant referral reward')
        }
      } else {
        console.log('[v0] Invalid referral code')
      }
    } else {
      console.log('[v0] No referral code provided during signup')
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: chatbotUser.id,
        email: chatbotUser.email,
        username: chatbotUser.username,
        coin_balance: FREE_WELCOME_COINS,
      },
      welcomeBonus: {
        coins: FREE_WELCOME_COINS,
        message: `Welcome! You've received ${FREE_WELCOME_COINS} free coins as a gift to get you started.`,
      },
    }, { status: 201 })
  } catch (error: any) {
    console.error('[v0] Unexpected signup error:', {
      message: error?.message,
      stack: error?.stack,
    })
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred during signup' },
      { status: 500 }
    )
  }
}
