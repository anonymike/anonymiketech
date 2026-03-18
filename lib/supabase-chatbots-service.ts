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

    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Error creating chatbot user:', error)
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
