import { NextResponse } from 'next/server'

interface PayflowStatusResponse {
  success: boolean
  status?: 'success' | 'pending' | 'failed'
  message?: string
  transaction_code?: string
  amount?: number
  phone?: string
  error?: string
}

export async function POST(request: Request) {
  try {
    const { checkoutRequestId } = await request.json()

    // Validate input
    if (!checkoutRequestId) {
      return NextResponse.json(
        { error: 'Missing checkoutRequestId' },
        { status: 400 }
      )
    }

    // Get Payflow credentials from environment
    const apiKey = process.env.PAYFLOW_API_KEY
    const apiSecret = process.env.PAYFLOW_API_SECRET

    if (!apiKey || !apiSecret) {
      console.error('[v0] Missing Payflow credentials')
      return NextResponse.json(
        { error: 'Payment service configuration error' },
        { status: 500 }
      )
    }

    // Prepare request to Payflow API for status check
    const payflowBaseUrl = 'https://payflow.top/api/v2'
    const statusCheckUrl = `${payflowBaseUrl}/checkstatus.php`

    const payload = {
      checkout_request_id: checkoutRequestId,
    }

    console.log('[v0] Checking payment status:', checkoutRequestId)

    // Make request to Payflow API
    const response = await fetch(statusCheckUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'X-API-Secret': apiSecret,
      },
      body: JSON.stringify(payload),
    })

    const data: PayflowStatusResponse = await response.json()

    if (!response.ok) {
      console.error('[v0] Payflow status check error:', data)
      return NextResponse.json(
        {
          status: 'pending',
          message: 'Still waiting for payment confirmation',
        },
        { status: 200 } // Return 200 to continue polling
      )
    }

    if (!data.success) {
      console.error('[v0] Status check failed:', data)
      return NextResponse.json({
        status: 'failed',
        error: data.error || data.message || 'Payment check failed',
      })
    }

    // Return the payment status
    const paymentStatus = data.status || 'pending'

    return NextResponse.json({
      status: paymentStatus,
      transactionCode: data.transaction_code,
      amount: data.amount,
      phone: data.phone,
      message:
        paymentStatus === 'success'
          ? 'Payment successful'
          : 'Payment still pending',
    })
  } catch (error) {
    console.error('[v0] Status check error:', error)
    return NextResponse.json(
      {
        status: 'pending',
        message: 'Error checking status, will retry',
      },
      { status: 200 } // Return 200 to continue polling
    )
  }
}
