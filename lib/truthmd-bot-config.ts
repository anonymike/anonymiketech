/**
 * TRUTH-MD Bot Configuration Helper
 * Provides default settings and utilities for TRUTH-MD bot deployment
 */

export interface TruthMDConfig {
  systemPrompt: string
  welcomeMessage: string
  defaultResponse: string
  commands: Record<string, string>
  aiProvider: 'openai' | 'anthropic' | 'groq'
  aiModel: string
  maxTokens: number
  temperature: number
  rateLimitMessagesPerMinute: number
  rateLimitUsersPerDay: number
  sessionTimeoutMinutes: number
  features: {
    mediaSupport: boolean
    commandProcessing: boolean
    aiResponses: boolean
    groupSupport: boolean
    typingIndicator: boolean
    readReceipts: boolean
  }
}

/**
 * Default TRUTH-MD Configuration
 */
export const DEFAULT_TRUTHMD_CONFIG: TruthMDConfig = {
  systemPrompt: `You are TRUTH-MD, an advanced WhatsApp AI assistant. You provide helpful, accurate, and friendly responses to user queries. You can process commands, handle media, and maintain conversation context. Always be professional, respectful, and honest.`,

  welcomeMessage: `Welcome to TRUTH-MD! 👋\n\nI'm an AI-powered WhatsApp assistant here to help you. You can:\n• Ask me questions\n• Use /help for available commands\n• Share images and media for processing\n\nHow can I assist you today?`,

  defaultResponse: `Sorry, I didn't understand that. Type /help to see available commands or ask me a question.`,

  commands: {
    '/help': 'Shows available commands and features',
    '/menu': 'Displays main menu options',
    '/status': 'Shows current bot status',
    '/info': 'Bot information and capabilities',
  },

  aiProvider: 'openai',
  aiModel: 'gpt-3.5-turbo',
  maxTokens: 150,
  temperature: 0.7,

  rateLimitMessagesPerMinute: 30,
  rateLimitUsersPerDay: 100,
  sessionTimeoutMinutes: 30,

  features: {
    mediaSupport: true,
    commandProcessing: true,
    aiResponses: true,
    groupSupport: true,
    typingIndicator: true,
    readReceipts: true,
  },
}

/**
 * Baileys Session Management Utilities
 */

export interface BaileysSessionData {
  sessionId: string
  phoneNumber: string
  connectionStatus: 'connected' | 'disconnected' | 'connecting'
  credentials?: {
    noiseKey: any
    signedIdentityKey: any
    signedPreKey: any
    registrationId: number
    advSecretKey: string
    processedPushName: string
    meStatus: string
    routingInfo: string
    platform: string
    lastAccountSyncTimestamp: number
    myAID: string
    mySigningKey: string
    myXmppJid: string
    signalIdentities: any
    accountSettings: string
    webFeatures: number
    phoneNumberCountryCode: string
    phoneNumberNationalNumber: string
    phoneId: string
    businessName: string
    businessDescription: string
  }
}

/**
 * Create default Baileys session placeholder
 */
export function createBaileysSessionPlaceholder(
  sessionId: string,
  phoneNumber?: string
): BaileysSessionData {
  return {
    sessionId,
    phoneNumber: phoneNumber || 'pending',
    connectionStatus: 'disconnected',
    credentials: undefined,
  }
}

/**
 * Validate Baileys session data
 */
export function validateBaileysSession(sessionData: any): boolean {
  if (!sessionData) return false
  if (!sessionData.sessionId) return false
  if (
    sessionData.connectionStatus !== 'connected' &&
    sessionData.connectionStatus !== 'disconnected' &&
    sessionData.connectionStatus !== 'connecting'
  ) {
    return false
  }
  return true
}

/**
 * Format phone number to international format
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '')

  // If starts with 1 (US), remove it
  if (cleaned.startsWith('1') && cleaned.length === 11) {
    return cleaned.substring(1)
  }

  return cleaned
}

/**
 * Build deployment environment variables for TRUTH-MD
 */
export function buildDeploymentEnvVars(config: TruthMDConfig): Record<string, string> {
  return {
    NODE_ENV: 'production',
    TRUTH_MD_SYSTEM_PROMPT: config.systemPrompt,
    TRUTH_MD_WELCOME_MESSAGE: config.welcomeMessage,
    TRUTH_MD_DEFAULT_RESPONSE: config.defaultResponse,
    TRUTH_MD_AI_PROVIDER: config.aiProvider,
    TRUTH_MD_AI_MODEL: config.aiModel,
    TRUTH_MD_MAX_TOKENS: config.maxTokens.toString(),
    TRUTH_MD_TEMPERATURE: config.temperature.toString(),
    TRUTH_MD_RATE_LIMIT_MESSAGES_PER_MINUTE: config.rateLimitMessagesPerMinute.toString(),
    TRUTH_MD_RATE_LIMIT_USERS_PER_DAY: config.rateLimitUsersPerDay.toString(),
    TRUTH_MD_SESSION_TIMEOUT_MINUTES: config.sessionTimeoutMinutes.toString(),
    TRUTH_MD_FEATURES_MEDIA_SUPPORT: config.features.mediaSupport ? 'true' : 'false',
    TRUTH_MD_FEATURES_COMMAND_PROCESSING: config.features.commandProcessing ? 'true' : 'false',
    TRUTH_MD_FEATURES_AI_RESPONSES: config.features.aiResponses ? 'true' : 'false',
    TRUTH_MD_FEATURES_GROUP_SUPPORT: config.features.groupSupport ? 'true' : 'false',
  }
}

/**
 * Parse command string from message content
 */
export function parseCommand(
  messageContent: string
): { command: string; args: string[] } | null {
  const trimmed = messageContent.trim()
  if (!trimmed.startsWith('/')) return null

  const parts = trimmed.split(/\s+/)
  const command = parts[0].toLowerCase()
  const args = parts.slice(1)

  return { command, args }
}

/**
 * Check if message matches a command
 */
export function matchesCommand(messageContent: string, command: string): boolean {
  const parsed = parseCommand(messageContent)
  return parsed?.command === command.toLowerCase() || false
}
