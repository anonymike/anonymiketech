import { NextResponse } from 'next/server'
import { updateTransactionStatus, updateCoinBalance, getChatbotUser } from '@/lib/supabase-chatbots-service'

/**
 * Payment webhook handler for M-Pesa payment status updates
 * Receives payment confirmation and updates transaction + coin balance
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('[v0] Payment webhook received:', body)

    const { 
      reference, 
      checkout_request_id,
      result_code, 
      result_desc,
      amount,
      phone
    } = body

    // Validate webhook payload
    if (!reference || result_code === undefined) {
      console.warn('[v0] Invalid webhook payload - missing required fields')
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      )
    }

    // Parse the reference to get transaction info
    // Reference format: CHATBOT_COIN_{timestamp}_{random}
    const isValidReference = reference.startsWith('CHATBOT_COIN_')
    if (!isValidReference) {
      console.warn('[v0] Invalid reference format:', reference)
      return NextResponse.json(
        { error: 'Invalid reference format' },
        { status: 400 }
      )
    }

    // Payment success code is typically 0
    const paymentSuccess = result_code === 0 || result_code === '0'

    if (paymentSuccess) {
      console.log('[v0] Payment successful for reference:', reference)
      
      // Update transaction status to completed
      const updatedTransaction = await updateTransactionStatus(
        reference,
        'completed',
        reference
      )

      if (!updatedTransaction) {
        console.error('[v0] Failed to update transaction status for reference:', reference)
        return NextResponse.json(
          { error: 'Failed to update transaction' },
          { status: 500 }
        )
      }

      console.log('[v0] Transaction updated successfully:', updatedTransaction.id)

      // NOW add coins to user balance after payment is confirmed
      console.log('[v0] Adding coins to user balance after payment confirmation:', { userId: updatedTransaction.user_id, coins: updatedTransaction.amount })
      const updatedUser = await updateCoinBalance(updatedTransaction.user_id, updatedTransaction.amount)
      
      if (!updatedUser) {
        console.error('[v0] Failed to add coins after payment confirmation')
        return NextResponse.json(
          { error: 'Failed to add coins to balance' },
          { status: 500 }
        )
      }

      console.log('[v0] Coins successfully added to user:', { userId: updatedUser.id, newBalance: updatedUser.coin_balance })

      return NextResponse.json({
        success: true,
        message: 'Payment processed successfully and coins added',
        transactionId: updatedTransaction.id,
        status: 'completed',
        coinsAdded: updatedTransaction.amount,
        newBalance: updatedUser.coin_balance,
      })
    } else {
      console.log('[v0] Payment failed with code:', result_code, 'description:', result_desc)
      
      // Update transaction status to failed
      const failedTransaction = await updateTransactionStatus(
        reference,
        'failed',
        reference
      )

      console.log('[v0] Payment failed for transaction:', failedTransaction?.id)

      return NextResponse.json({
        success: false,
        message: `Payment failed: ${result_desc || 'Unknown error'}`,
        resultCode: result_code,
        transactionId: failedTransaction?.id,
      })
    }
  } catch (error) {
    console.error('[v0] Payment webhook error:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}
