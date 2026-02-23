import { NextResponse } from 'next/server'

interface PayflowValidationResponse {
  success: boolean
  message?: string
  transaction_code?: string
  status?: string
  amount?: number
  error?: string
}

// In-memory storage for validated transactions (in production, use a database)
const validatedTransactions = new Map<
  string,
  {
    phone: string
    transactionCode: string
    checkoutRequestId: string
    appName?: string
    timestamp: number
  }
>()

export async function POST(request: Request) {
  try {
    const { phone, transactionCode, checkoutRequestId } = await request.json()

    // Validate inputs
    if (!phone || !transactionCode || !checkoutRequestId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate phone format
    const phoneRegex = /^254[0-9]{9}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Validate transaction code format (typically alphanumeric)
    if (!/^[A-Z0-9]{6,15}$/.test(transactionCode.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid transaction code format' },
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

    // In a real implementation, verify with Payflow API
    // For now, we'll validate the transaction code format and store it
    console.log('[v0] Validating transaction:', {
      phone,
      transactionCode,
      checkoutRequestId,
    })

    // Create a unique key for this transaction
    const transactionKey = `${phone}_${checkoutRequestId}`

    // Store the validated transaction
    validatedTransactions.set(transactionKey, {
      phone,
      transactionCode,
      checkoutRequestId,
      timestamp: Date.now(),
    })

    // Optional: Call Payflow verification endpoint if available
    // For now, we accept the transaction code as valid if it was received
    // In production, you would verify this against the actual M-Pesa receipt

    return NextResponse.json({
      success: true,
      message: 'Transaction validated successfully',
      transactionCode: transactionCode,
      phone: phone,
    })
  } catch (error) {
    console.error('[v0] Transaction validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate transaction' },
      { status: 500 }
    )
  }
}

// GET endpoint to verify a transaction
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')
    const checkoutRequestId = searchParams.get('checkoutRequestId')

    if (!phone || !checkoutRequestId) {
      return NextResponse.json(
        { error: 'Missing phone or checkoutRequestId' },
        { status: 400 }
      )
    }

    const transactionKey = `${phone}_${checkoutRequestId}`
    const transaction = validatedTransactions.get(transactionKey)

    if (!transaction) {
      return NextResponse.json(
        { valid: false, error: 'Transaction not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      valid: true,
      transaction: {
        phone: transaction.phone,
        transactionCode: transaction.transactionCode,
        timestamp: transaction.timestamp,
      },
    })
  } catch (error) {
    console.error('[v0] Transaction verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify transaction' },
      { status: 500 }
    )
  }
}
