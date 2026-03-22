import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// ============ Type Definitions ============

export interface WhatsAppBotTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: string
  defaultPrompt: string
  defaultWelcomeMessage: string
  defaultGoodbyeMessage: string
  features: string[]
}

export interface WhatsAppCredentials {
  id: string
  userId: string
  phoneNumber: string
  credentials: Record<string, string>
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface WhatsAppBot {
  id: string
  userId: string
  templateId: string
  name: string
  phoneNumber: string
  credentialId: string
  status: 'active' | 'inactive' | 'error' | 'pending'
  createdAt: string
  updatedAt: string
}

export interface BotConfig {
  id: string
  botId: string
  aiPrompt: string
  companyName: string
  primaryBrandColor: string
  welcomeMessage: string
  goodbyeMessage: string
  customCommands: Array<{
    command: string
    description: string
    response?: string
  }>
  businessHoursEnabled: boolean
  businessHours?: {
    startTime: string
    endTime: string
    timezone: string
    daysOfWeek: number[]
  }
  accessControl?: {
    whitelistEnabled: boolean
    phoneNumbers: string[]
  }
  rateLimiting?: {
    enabled: boolean
    messagesPerHour: number
    messagesPerDay: number
  }
  updatedAt: string
}

export interface DeploymentConfig {
  id: string
  botId: string
  deploymentMethod: 'direct-server' | 'heroku' | 'railway' | 'render' | 'docker'
  environmentVariables: Array<{
    key: string
    value: string
    encrypted: boolean
  }>
  deploymentStatus: 'pending' | 'deploying' | 'active' | 'failed' | 'paused'
  deploymentUrl?: string
  lastDeployedAt?: string
  updatedAt: string
}

export interface BotSession {
  id: string
  botId: string
  sessionData: Record<string, any>
  qrCode?: string
  isConnected: boolean
  lastActivity: string
  createdAt: string
  updatedAt: string
}

export interface BotLog {
  id: string
  botId: string
  eventType: string
  message: string
  metadata: Record<string, any>
  createdAt: string
}

export interface BotAnalytics {
  id: string
  botId: string
  date: string
  messagesSent: number
  messagesReceived: number
  activeUsers: number
  avgResponseTime: number
  errorCount: number
  updatedAt: string
}

// ============ Template Service ============

export async function getTemplates(): Promise<WhatsAppBotTemplate[]> {
  try {
    const { data, error } = await supabase
      .from('whatsapp_bot_templates')
      .select('*')
      .eq('isActive', true)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching templates:', error)
    throw error
  }
}

export async function getTemplateById(id: string): Promise<WhatsAppBotTemplate | null> {
  try {
    const { data, error } = await supabase
      .from('whatsapp_bot_templates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching template:', error)
    return null
  }
}

// ============ Credentials Service ============

export async function createCredentials(
  userId: string,
  phoneNumber: string,
  credentials: Record<string, string>
): Promise<WhatsAppCredentials> {
  try {
    const { data, error } = await supabase
      .from('whatsapp_credentials')
      .insert([
        {
          userId,
          phoneNumber,
          credentials,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating credentials:', error)
    throw error
  }
}

export async function getCredentials(userId: string): Promise<WhatsAppCredentials[]> {
  try {
    const { data, error } = await supabase
      .from('whatsapp_credentials')
      .select('*')
      .eq('userId', userId)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching credentials:', error)
    throw error
  }
}

export async function deleteCredentials(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('whatsapp_credentials')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting credentials:', error)
    throw error
  }
}

// ============ Bot Service ============

export async function createBot(
  userId: string,
  templateId: string,
  name: string,
  phoneNumber: string,
  credentialId: string
): Promise<WhatsAppBot> {
  try {
    const { data, error } = await supabase
      .from('whatsapp_bots')
      .insert([
        {
          userId,
          templateId,
          name,
          phoneNumber,
          credentialId,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error

    // Create default config for the bot
    const template = await getTemplateById(templateId)
    if (template) {
      await createBotConfig(data.id, {
        aiPrompt: template.defaultPrompt,
        companyName: '',
        primaryBrandColor: '#000000',
        welcomeMessage: template.defaultWelcomeMessage,
        goodbyeMessage: template.defaultGoodbyeMessage,
        customCommands: [],
        businessHoursEnabled: false,
        accessControl: {
          whitelistEnabled: false,
          phoneNumbers: [],
        },
        rateLimiting: {
          enabled: true,
          messagesPerHour: 100,
          messagesPerDay: 1000,
        },
      })
    }

    return data
  } catch (error) {
    console.error('Error creating bot:', error)
    throw error
  }
}

export async function getBots(userId: string): Promise<WhatsAppBot[]> {
  try {
    const { data, error } = await supabase
      .from('whatsapp_bots')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching bots:', error)
    throw error
  }
}

export async function getBotById(id: string, userId: string): Promise<WhatsAppBot | null> {
  try {
    const { data, error } = await supabase
      .from('whatsapp_bots')
      .select('*')
      .eq('id', id)
      .eq('userId', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching bot:', error)
    return null
  }
}

export async function updateBotStatus(
  botId: string,
  status: WhatsAppBot['status']
): Promise<void> {
  try {
    const { error } = await supabase
      .from('whatsapp_bots')
      .update({
        status,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', botId)

    if (error) throw error
  } catch (error) {
    console.error('Error updating bot status:', error)
    throw error
  }
}

export async function deleteBot(botId: string, userId: string): Promise<void> {
  try {
    // Verify ownership
    const bot = await getBotById(botId, userId)
    if (!bot) throw new Error('Bot not found')

    // Delete all related data
    await supabase.from('whatsapp_bot_config').delete().eq('botId', botId)
    await supabase.from('whatsapp_deployment_config').delete().eq('botId', botId)
    await supabase.from('whatsapp_bot_sessions').delete().eq('botId', botId)
    await supabase.from('whatsapp_bot_logs').delete().eq('botId', botId)
    await supabase.from('whatsapp_bot_analytics').delete().eq('botId', botId)

    // Delete the bot
    const { error } = await supabase
      .from('whatsapp_bots')
      .delete()
      .eq('id', botId)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting bot:', error)
    throw error
  }
}

// ============ Bot Config Service ============

export async function createBotConfig(botId: string, config: Partial<BotConfig>): Promise<BotConfig> {
  try {
    const { data, error } = await supabase
      .from('whatsapp_bot_config')
      .insert([
        {
          botId,
          ...config,
          updatedAt: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating bot config:', error)
    throw error
  }
}

export async function getBotConfig(botId: string): Promise<BotConfig | null> {
  try {
    const { data, error } = await supabase
      .from('whatsapp_bot_config')
      .select('*')
      .eq('botId', botId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching bot config:', error)
    return null
  }
}

export async function updateBotConfig(botId: string, config: Partial<BotConfig>): Promise<BotConfig> {
  try {
    const { data, error } = await supabase
      .from('whatsapp_bot_config')
      .update({
        ...config,
        updatedAt: new Date().toISOString(),
      })
      .eq('botId', botId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating bot config:', error)
    throw error
  }
}

// ============ Deployment Config Service ============

export async function createDeploymentConfig(
  botId: string,
  deploymentMethod: DeploymentConfig['deploymentMethod'],
  environmentVariables: Array<{ key: string; value: string }> = []
): Promise<DeploymentConfig> {
  try {
    const { data, error } = await supabase
      .from('whatsapp_deployment_config')
      .insert([
        {
          botId,
          deploymentMethod,
          environmentVariables: environmentVariables.map((v) => ({
            ...v,
            encrypted: false,
          })),
          deploymentStatus: 'pending',
          updatedAt: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating deployment config:', error)
    throw error
  }
}

export async function getDeploymentConfig(botId: string): Promise<DeploymentConfig | null> {
  try {
    const { data, error } = await supabase
      .from('whatsapp_deployment_config')
      .select('*')
      .eq('botId', botId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching deployment config:', error)
    return null
  }
}

export async function updateDeploymentConfig(
  botId: string,
  config: Partial<DeploymentConfig>
): Promise<DeploymentConfig> {
  try {
    const { data, error } = await supabase
      .from('whatsapp_deployment_config')
      .update({
        ...config,
        updatedAt: new Date().toISOString(),
      })
      .eq('botId', botId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating deployment config:', error)
    throw error
  }
}

// ============ Session Service ============

export async function createOrUpdateSession(
  botId: string,
  sessionData: Record<string, any>,
  qrCode?: string
): Promise<BotSession> {
  try {
    // Check if session exists
    const existing = await supabase
      .from('whatsapp_bot_sessions')
      .select('id')
      .eq('botId', botId)
      .single()

    if (existing.data) {
      // Update existing
      const { data, error } = await supabase
        .from('whatsapp_bot_sessions')
        .update({
          sessionData,
          qrCode,
          lastActivity: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .eq('botId', botId)
        .select()
        .single()

      if (error) throw error
      return data
    } else {
      // Create new
      const { data, error } = await supabase
        .from('whatsapp_bot_sessions')
        .insert([
          {
            botId,
            sessionData,
            qrCode,
            isConnected: false,
            lastActivity: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error
      return data
    }
  } catch (error) {
    console.error('Error managing session:', error)
    throw error
  }
}

export async function getSession(botId: string): Promise<BotSession | null> {
  try {
    const { data, error } = await supabase
      .from('whatsapp_bot_sessions')
      .select('*')
      .eq('botId', botId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching session:', error)
    return null
  }
}

export async function updateSessionConnection(
  botId: string,
  isConnected: boolean
): Promise<void> {
  try {
    const { error } = await supabase
      .from('whatsapp_bot_sessions')
      .update({
        isConnected,
        lastActivity: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .eq('botId', botId)

    if (error) throw error
  } catch (error) {
    console.error('Error updating session connection:', error)
    throw error
  }
}

// ============ Logging Service ============

export async function logActivity(
  botId: string,
  eventType: string,
  message: string,
  metadata: Record<string, any> = {}
): Promise<BotLog> {
  try {
    const { data, error } = await supabase
      .from('whatsapp_bot_logs')
      .insert([
        {
          botId,
          eventType,
          message,
          metadata,
          createdAt: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error logging activity:', error)
    throw error
  }
}

export async function getLogs(botId: string, limit = 100): Promise<BotLog[]> {
  try {
    const { data, error } = await supabase
      .from('whatsapp_bot_logs')
      .select('*')
      .eq('botId', botId)
      .order('createdAt', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching logs:', error)
    throw error
  }
}

// ============ Analytics Service ============

export async function updateAnalytics(
  botId: string,
  date: string,
  updates: Partial<Omit<BotAnalytics, 'id' | 'botId' | 'date' | 'updatedAt'>>
): Promise<BotAnalytics> {
  try {
    // Check if record exists
    const existing = await supabase
      .from('whatsapp_bot_analytics')
      .select('id')
      .eq('botId', botId)
      .eq('date', date)
      .single()

    if (existing.data) {
      // Update
      const { data, error } = await supabase
        .from('whatsapp_bot_analytics')
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .eq('botId', botId)
        .eq('date', date)
        .select()
        .single()

      if (error) throw error
      return data
    } else {
      // Create
      const { data, error } = await supabase
        .from('whatsapp_bot_analytics')
        .insert([
          {
            botId,
            date,
            messagesSent: updates.messagesSent || 0,
            messagesReceived: updates.messagesReceived || 0,
            activeUsers: updates.activeUsers || 0,
            avgResponseTime: updates.avgResponseTime || 0,
            errorCount: updates.errorCount || 0,
            updatedAt: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error
      return data
    }
  } catch (error) {
    console.error('Error updating analytics:', error)
    throw error
  }
}

export async function getAnalytics(botId: string, days = 30): Promise<BotAnalytics[]> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('whatsapp_bot_analytics')
      .select('*')
      .eq('botId', botId)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching analytics:', error)
    throw error
  }
}

// ============ Utility Functions ============

export async function verifyBotOwnership(botId: string, userId: string): Promise<boolean> {
  try {
    const bot = await getBotById(botId, userId)
    return !!bot
  } catch {
    return false
  }
}

export function encryptCredential(value: string): string {
  // TODO: Implement actual encryption using a library like crypto-js
  // For now, just return base64 encoded value
  return Buffer.from(value).toString('base64')
}

export function decryptCredential(encrypted: string): string {
  // TODO: Implement actual decryption
  // For now, just return base64 decoded value
  return Buffer.from(encrypted, 'base64').toString('utf-8')
}
