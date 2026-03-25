import { NextResponse } from 'next/server'
import { getChatbotUserByAuthId, recordTransaction, updateCoinBalance } from '@/lib/supabase-chatbots-service'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface CoinPackage {
  coins: number
  amount: number // in KES
}

const COIN_PACKAGES: Record<string, CoinPackage> = {
  small: { coins: 10, amount: 100 },
  medium: { coins: 60, amount: 500 },
  large: { coins: 130, amount: 1000 },
}

export async function POST(request: Request) {
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

    const { phone, packageKey } = await request.json()

    // Validate inputs
    if (!phone || !packageKey) {
      return NextResponse.json(
        { error: 'Missing required fields: phone, packageKey' },
        { status: 400 }
      )
    }

    if (!COIN_PACKAGES[packageKey]) {
      return NextResponse.json(
        { error: 'Invalid package' },
        { status: 400 }
      )
    }

    // Validate phone format (should be 254XXXXXXXXX)
    const phoneRegex = /^254[0-9]{9}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Expected 254XXXXXXXXX' },
        { status: 400 }
      )
    }

    // Get user
    const user = await getChatbotUserByAuthId(data.user.id)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const coinPackage = COIN_PACKAGES[packageKey]
    const apiKey = process.env.PAYFLOW_API_KEY
    const apiSecret = process.env.PAYFLOW_API_SECRET
    const paymentAccountId = process.env.PAYFLOW_PAYMENT_ACCOUNT_ID

    if (!apiKey || !apiSecret || !paymentAccountId) {
      console.error('[v0] Missing Payflow credentials')
      return NextResponse.json(
        { error: 'Payment service configuration error' },
        { status: 500 }
      )
    }

    // Generate reference
    const reference = `CHATBOT_COIN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create pending transaction
    const transaction = await recordTransaction(
      user.id,
      coinPackage.coins,
      'purchase',
      'pending',
      phone,
      undefined,
      reference,
      `Purchase ${coinPackage.coins} coins for chatbot platform`
    )

    if (!transaction) {
      return NextResponse.json(
        { error: 'Failed to create transaction' },
        { status: 500 }
      )
    }

    // DO NOT add coins yet - wait for webhook confirmation of payment
    // Coins will only be added when the webhook confirms the payment is successful
    console.log('[v0] Transaction created, awaiting payment confirmation for:', { userId: user.id, coins: coinPackage.coins, reference })

    // Initiate M-Pesa STK Push (reusing same Payflow API)
    const payflowBaseUrl = 'https://payflow.top/api/v2'
    const stkPushUrl = `${payflowBaseUrl}/stkpush.php`

    const payload = {
      payment_account_id: parseInt(paymentAccountId),
      phone,
      amount: coinPackage.amount,
      reference,
      description: `Purchase ${coinPackage.coins} coins for AI Chatbots Platform`,
    }

    console.log('[v0] Initiating Payflow STK Push for coins:', { phone, coins: coinPackage.coins, reference })

    const response = await fetch(stkPushUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'X-API-Secret': apiSecret,
      },
      body: JSON.stringify(payload),
    })

    const data_response = await response.json()

    if (!response.ok || !data_response.success) {
      console.error('[v0] Payflow API error:', data_response)
      return NextResponse.json(
        {
          error: data_response.error || data_response.message || 'Failed to initiate M-Pesa payment',
        },
        { status: response.status || 500 }
      )
    }

    if (!data_response.checkout_request_id) {
      console.error('[v0] No checkout_request_id in response')
      return NextResponse.json(
        { error: 'Invalid response from payment service' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      checkoutRequestId: data_response.checkout_request_id,
      transactionId: transaction.id,
      reference,
      coins: coinPackage.coins,
      amount: coinPackage.amount,
      message: 'STK Push initiated. Check your phone for M-Pesa prompt.',
    })
  } catch (error) {
    console.error('[v0] Coin purchase error:', error)
    return NextResponse.json(
      { error: 'Failed to process coin purchase request' },
      { status: 500 }
    )
  }
}
