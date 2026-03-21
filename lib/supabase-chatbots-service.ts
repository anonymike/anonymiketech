import { getSupabaseClient } from './supabase-client'
import { v4 as uuidv4 } from 'uuid'

export interface ChatbotUser {
  id: string
  auth_id: string
  username: string
  email: string
  phone_number?: string
  coin_balance: number
  total_coins_purchased: number
  profile_image?: string
  created_at: string
  updated_at: string
}

export interface ChatbotType {
  id: string
  name: string
  description: string
  long_description?: string
  category: string
  icon: string
  image?: string
  cost_in_coins: number
  api_endpoint: string
  features: string[]
  is_active: boolean
  admin_only: boolean
  created_at: string
  updated_at: string
}

export interface DeployedBot {
  id: string
  user_id: string
  bot_type_id: string
  bot_name: string
  session_id: string
  status: 'active' | 'stopped' | 'error'
  webhook_url?: string
  config?: Record<string, any>
  error_message?: string
  last_activity?: string
  created_at: string
  updated_at: string
}

export interface CoinTransaction {
  id: string
  user_id: string
  amount: number
  transaction_type: 'purchase' | 'deployment' | 'refund'
  m_pesa_reference?: string
  m_pesa_checkout_id?: string
  status: 'pending' | 'completed' | 'failed'
  phone_number?: string
  payment_method: string
  description?: string
  created_at: string
  updated_at: string
}

// ========================
// CHATBOT USER FUNCTIONS
// ========================

export async function createChatbotUser(
  authId: string,
  email: string,
  username: string,
  phoneNumber?: string
): Promise<ChatbotUser | null> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('chatbot_users')
      .insert([
        {
          auth_id: authId,
          email,
          username,
          phone_number: phoneNumber,
          coin_balance: 0,
          total_coins_purchased: 0,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('[v0] Supabase error inserting chatbot user:', {
        message: error.message,
        code: error.code,
        details: error.details,
      })
      throw error
    }
    return data
  } catch (error: any) {
    console.error('[v0] Error creating chatbot user:', {
      message: error?.message,
      code: error?.code,
      hint: 'Ensure the chatbot_users table exists in Supabase. Run INITIALIZE_CHATBOTS_DB.md',
    })
    return null
  }
}

export async function getChatbotUserByAuthId(
  authId: string
): Promise<ChatbotUser | null> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('chatbot_users')
      .select('*')
      .eq('auth_id', authId)
      .single()

    if (error?.code === 'PGRST116') {
      // User doesn't exist
      return null
    }
    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Error getting chatbot user:', error)
    return null
  }
}

export async function getChatbotUser(userId: string): Promise<ChatbotUser | null> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('chatbot_users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Error getting chatbot user by ID:', error)
    return null
  }
}

export async function updateChatbotUserProfile(
  userId: string,
  updates: Partial<ChatbotUser>
): Promise<ChatbotUser | null> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('chatbot_users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Error updating chatbot user profile:', error)
    return null
  }
}

export async function updateCoinBalance(
  userId: string,
  coins: number
): Promise<ChatbotUser | null> {
  try {
    const supabase = getSupabaseClient()
    const { data: user, error: fetchError } = await supabase
      .from('chatbot_users')
      .select('coin_balance')
      .eq('id', userId)
      .single()

    if (fetchError) throw fetchError

    const newBalance = (user?.coin_balance || 0) + coins
    const { data, error } = await supabase
      .from('chatbot_users')
      .update({ coin_balance: newBalance })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Error updating coin balance:', error)
    return null
  }
}

// ========================
// CHATBOT TYPE FUNCTIONS
// ========================

export async function getChatbotTypes(): Promise<ChatbotType[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('chatbot_types')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('[v0] Error fetching chatbot types:', error)
    return []
  }
}

export async function getChatbotType(typeId: string): Promise<ChatbotType | null> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('chatbot_types')
      .select('*')
      .eq('id', typeId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Error fetching chatbot type:', error)
    return null
  }
}

// ========================
// DEPLOYED BOT FUNCTIONS
// ========================

export async function deployBot(
  userId: string,
  botTypeId: string,
  botName: string,
  webhookUrl?: string,
  config?: Record<string, any>
): Promise<DeployedBot | null> {
  try {
    const supabase = getSupabaseClient()
    const sessionId = uuidv4()

    const { data, error } = await supabase
      .from('deployed_bots')
      .insert([
        {
          user_id: userId,
          bot_type_id: botTypeId,
          bot_name: botName,
          session_id: sessionId,
          status: 'active',
          webhook_url: webhookUrl,
          config: config || {},
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Error deploying bot:', error)
    return null
  }
}

export async function getUserDeployedBots(userId: string): Promise<DeployedBot[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('deployed_bots')
      .select('*, chatbot_types:bot_type_id(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('[v0] Error fetching user deployed bots:', error)
    return []
  }
}

export async function getDeployedBot(
  botId: string,
  userId: string
): Promise<DeployedBot | null> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('deployed_bots')
      .select('*')
      .eq('id', botId)
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Error fetching deployed bot:', error)
    return null
  }
}

export async function updateBotStatus(
  botId: string,
  status: 'active' | 'stopped' | 'error',
  errorMessage?: string
): Promise<DeployedBot | null> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('deployed_bots')
      .update({
        status,
        error_message: errorMessage,
        last_activity: new Date().toISOString(),
      })
      .eq('id', botId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Error updating bot status:', error)
    return null
  }
}

export async function deleteBot(botId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('deployed_bots')
      .delete()
      .eq('id', botId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('[v0] Error deleting bot:', error)
    return false
  }
}

// ========================
// COIN TRANSACTION FUNCTIONS
// ========================

export async function recordTransaction(
  userId: string,
  amount: number,
  transactionType: 'purchase' | 'deployment' | 'refund',
  status: 'pending' | 'completed' | 'failed' = 'pending',
  phoneNumber?: string,
  mPesaReference?: string,
  mPesaCheckoutId?: string,
  description?: string
): Promise<CoinTransaction | null> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('coin_transactions')
      .insert([
        {
          user_id: userId,
          amount,
          transaction_type: transactionType,
          status,
          phone_number: phoneNumber,
          m_pesa_reference: mPesaReference,
          m_pesa_checkout_id: mPesaCheckoutId,
          payment_method: 'mpesa',
          description,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Error recording transaction:', error)
    return null
  }
}

export async function getTransaction(
  transactionId: string
): Promise<CoinTransaction | null> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('coin_transactions')
      .select('*')
      .eq('id', transactionId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Error fetching transaction:', error)
    return null
  }
}

export async function getUserTransactions(userId: string): Promise<CoinTransaction[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('coin_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('[v0] Error fetching user transactions:', error)
    return []
  }
}

export async function updateTransactionStatus(
  transactionId: string,
  status: 'pending' | 'completed' | 'failed',
  mPesaReference?: string
): Promise<CoinTransaction | null> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('coin_transactions')
      .update({
        status,
        m_pesa_reference: mPesaReference,
      })
      .eq('id', transactionId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Error updating transaction status:', error)
    return null
  }
}

// ========================
// PASSWORD RESET FUNCTIONS
// ========================

export async function createPasswordResetToken(userId: string): Promise<string | null> {
  try {
    const supabase = getSupabaseClient()
    const token = uuidv4().replace(/-/g, '').substring(0, 32)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    const { data, error } = await supabase
      .from('password_reset_tokens')
      .insert([
        {
          user_id: userId,
          token,
          expires_at: expiresAt.toISOString(),
        },
      ])
      .select('token')
      .single()

    if (error) throw error
    return data?.token || null
  } catch (error) {
    console.error('[v0] Error creating password reset token:', error)
    return null
  }
}

export async function validatePasswordResetToken(
  token: string
): Promise<{ userId: string; email: string } | null> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('password_reset_tokens')
      .select('user_id, expires_at, used_at, chatbot_users(email)')
      .eq('token', token)
      .single()

    if (error) return null

    // Check if token has expired
    if (new Date(data.expires_at) < new Date()) {
      console.log('[v0] Password reset token expired')
      return null
    }

    // Check if token was already used
    if (data.used_at) {
      console.log('[v0] Password reset token already used')
      return null
    }

    const chatbotUser = Array.isArray(data.chatbot_users)
      ? data.chatbot_users[0]
      : data.chatbot_users

    return {
      userId: data.user_id,
      email: chatbotUser?.email,
    }
  } catch (error) {
    console.error('[v0] Error validating password reset token:', error)
    return null
  }
}

export async function markPasswordResetTokenAsUsed(token: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('password_reset_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('token', token)

    if (error) throw error
    return true
  } catch (error) {
    console.error('[v0] Error marking token as used:', error)
    return false
  }
}

// ========================
// REFERRAL SYSTEM FUNCTIONS
// ========================

export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function setUserReferralCode(userId: string): Promise<string | null> {
  try {
    const supabase = getSupabaseClient()
    const referralCode = generateReferralCode()

    const { data, error } = await supabase
      .from('chatbot_users')
      .update({ referral_code: referralCode })
      .eq('id', userId)
      .select('referral_code')
      .single()

    if (error) throw error
    return data?.referral_code || null
  } catch (error) {
    console.error('[v0] Error setting referral code:', error)
    return null
  }
}

export async function getUserByReferralCode(
  referralCode: string
): Promise<ChatbotUser | null> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('chatbot_users')
      .select('*')
      .eq('referral_code', referralCode)
      .single()

    if (error?.code === 'PGRST116') {
      return null
    }
    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Error getting user by referral code:', error)
    return null
  }
}

export async function createReferral(
  referrerId: string,
  referredUserId: string
): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()
    const { error: referralError } = await supabase
      .from('user_referrals')
      .insert([
        {
          referrer_id: referrerId,
          referred_user_id: referredUserId,
          reward_coins: 50,
          status: 'completed',
        },
      ])

    if (referralError) throw referralError

    // Update invites count and add coins to referrer
    const { data: user, error: fetchError } = await supabase
      .from('chatbot_users')
      .select('invites_count, coin_balance')
      .eq('id', referrerId)
      .single()

    if (fetchError) throw fetchError

    const newInvitesCount = (user?.invites_count || 0) + 1
    const newCoinBalance = (user?.coin_balance || 0) + 50

    const { error: updateError } = await supabase
      .from('chatbot_users')
      .update({
        invites_count: newInvitesCount,
        coin_balance: newCoinBalance,
      })
      .eq('id', referrerId)

    if (updateError) throw updateError
    return true
  } catch (error) {
    console.error('[v0] Error creating referral:', error)
    return false
  }
}

export async function getInvitedUsers(userId: string): Promise<ChatbotUser[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('user_referrals')
      .select('chatbot_users:referred_user_id(*)')
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data
      ?.map((ref: any) => {
        const user = Array.isArray(ref.chatbot_users)
          ? ref.chatbot_users[0]
          : ref.chatbot_users
        return user
      })
      .filter(Boolean) || []
  } catch (error) {
    console.error('[v0] Error getting invited users:', error)
    return []
  }
}

export async function getUserReferralInfo(userId: string): Promise<{
  referralCode: string | null
  invitesCount: number
} | null> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('chatbot_users')
      .select('referral_code, invites_count')
      .eq('id', userId)
      .single()

    if (error) throw error
    return {
      referralCode: data?.referral_code,
      invitesCount: data?.invites_count || 0,
    }
  } catch (error) {
    console.error('[v0] Error getting user referral info:', error)
    return null
  }
}

// ========================
// USER PROFILE UPDATE FUNCTIONS
// ========================

export async function updateUserEmail(
  userId: string,
  newEmail: string
): Promise<ChatbotUser | null> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('chatbot_users')
      .update({ email: newEmail })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Error updating user email:', error)
    return null
  }
}

export async function updateUserUsername(
  userId: string,
  newUsername: string
): Promise<ChatbotUser | null> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('chatbot_users')
      .update({ username: newUsername })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Error updating username:', error)
    return null
  }
}
