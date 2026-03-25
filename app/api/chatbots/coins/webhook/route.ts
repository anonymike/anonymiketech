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
      const user = await getChatbotUser(updatedTransaction.user_id)
      if (!user) {
        console.error('[v0] User not found for transaction:', updatedTransaction.id)
        return NextResponse.json(
          { error: 'User not found' },
          { status: 500 }
        )
      }

      console.log('[v0] Adding coins to user after successful payment:', { userId: user.id, coins: updatedTransaction.amount })
      const updatedUser = await updateCoinBalance(user.id, updatedTransaction.amount)
      
      if (!updatedUser) {
        console.error('[v0] Failed to add coins to user balance after payment')
        return NextResponse.json(
          { error: 'Failed to add coins after payment confirmation' },
          { status: 500 }
        )
      }

      console.log('[v0] Payment confirmed and coins added to user balance:', { userId: user.id, newBalance: updatedUser.coin_balance })

      return NextResponse.json({
        success: true,
        message: 'Payment processed successfully and coins added',
        transactionId: updatedTransaction.id,
        status: 'completed',
        coinsAdded: updatedTransaction.amount,
      })
    } else {
      console.log('[v0] Payment failed with code:', result_code, 'description:', result_desc)
      
      // Update transaction status to failed
      const failedTransaction = await updateTransactionStatus(
        reference,
        'failed',
        reference
      )

      if (failedTransaction) {
        // Deduct coins if they were already added
        const user = await getChatbotUser(failedTransaction.user_id)
        if (user) {
          console.log('[v0] Deducting coins from user due to payment failure:', failedTransaction.user_id)
          // Deduct the coins by adding negative amount
          await updateCoinBalance(failedTransaction.user_id, -failedTransaction.amount)
        }
      }

      return NextResponse.json({
        success: false,
        message: `Payment failed: ${result_desc || 'Unknown error'}`,
        resultCode: result_code,
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
