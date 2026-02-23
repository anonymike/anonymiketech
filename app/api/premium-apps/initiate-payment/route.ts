import { NextResponse } from 'next/server'

interface PayflowSTKResponse {
  success: boolean
  message?: string
  checkout_request_id?: string
  error?: string
}

export async function POST(request: Request) {
  try {
    const { phone, amount, appName } = await request.json()

    // Validate inputs
    if (!phone || !amount || !appName) {
      return NextResponse.json(
        { error: 'Missing required fields: phone, amount, appName' },
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

    // Validate amount
    if (typeof amount !== 'number' || amount < 1) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Get Payflow credentials from environment
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

    // Prepare request to Payflow API
    const payflowBaseUrl = 'https://payflow.top/api/v2'
    const stkPushUrl = `${payflowBaseUrl}/stkpush.php`

    // Generate reference (unique transaction identifier)
    const reference = `PREMIUM_APP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const payload = {
      payment_account_id: parseInt(paymentAccountId),
      phone: phone,
      amount: amount,
      reference: reference,
      description: `Purchase: ${appName}`,
    }

    console.log('[v0] Initiating Payflow STK Push:', { phone, amount, appName, reference })

    // Make request to Payflow API
    const response = await fetch(stkPushUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'X-API-Secret': apiSecret,
      },
      body: JSON.stringify(payload),
    })

    const data: PayflowSTKResponse = await response.json()

    if (!response.ok || !data.success) {
      console.error('[v0] Payflow API error:', data)
      return NextResponse.json(
        {
          error: data.error || data.message || 'Failed to initiate M-Pesa payment',
        },
        { status: response.status || 500 }
      )
    }

    // Return checkout request ID for status polling
    if (!data.checkout_request_id) {
      console.error('[v0] No checkout_request_id in response')
      return NextResponse.json(
        { error: 'Invalid response from payment service' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      checkoutRequestId: data.checkout_request_id,
      reference: reference,
      message: 'STK Push initiated. Check your phone for M-Pesa prompt.',
    })
  } catch (error) {
    console.error('[v0] Payment initiation error:', error)
    return NextResponse.json(
      { error: 'Failed to process payment request' },
      { status: 500 }
    )
  }
}
