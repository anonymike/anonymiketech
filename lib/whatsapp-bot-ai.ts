import { generateText, LanguageModel } from 'ai'
import type { BotConfig } from './whatsapp-bot-service'

// ============ LLM Configuration ============

export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'groq' | 'other'
  apiKey: string
  model: string
}

export interface MessageContext {
  userMessage: string
  conversationHistory?: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  botConfig: BotConfig
  userId?: string
}

export interface ResponseData {
  message: string
  confidence: number
  executedCommand?: string
  metadata: Record<string, any>
}

// ============ Rate Limiting Service ============

interface RateLimitBucket {
  count: number
  resetTime: number
}

const rateLimitBuckets = new Map<string, RateLimitBucket>()

export function checkRateLimit(
  botId: string,
  config: BotConfig,
  currentTime: number = Date.now()
): { allowed: boolean; remaining: number; resetIn: number } {
  if (!config.rateLimiting?.enabled) {
    return { allowed: true, remaining: -1, resetIn: 0 }
  }

  const bucketKey = `${botId}_hour`
  const bucket = rateLimitBuckets.get(bucketKey) || {
    count: 0,
    resetTime: currentTime + 3600000, // 1 hour
  }

  // Reset if time has passed
  if (currentTime > bucket.resetTime) {
    bucket.count = 0
    bucket.resetTime = currentTime + 3600000
  }

  const limit = config.rateLimiting.messagesPerHour || 100
  const allowed = bucket.count < limit
  const remaining = Math.max(0, limit - bucket.count)

  if (allowed) {
    bucket.count++
    rateLimitBuckets.set(bucketKey, bucket)
  }

  return {
    allowed,
    remaining,
    resetIn: Math.ceil((bucket.resetTime - currentTime) / 1000),
  }
}

// ============ Command Processing ============

export function processCommand(
  message: string,
  config: BotConfig
): { isCommand: boolean; response?: string; command?: string } {
  const trimmed = message.trim()

  // Check if message is a command (starts with /)
  if (!trimmed.startsWith('/')) {
    return { isCommand: false }
  }

  const [command, ...args] = trimmed.slice(1).split(' ')
  const commandLower = command.toLowerCase()

  // Built-in commands
  switch (commandLower) {
    case 'help':
      const helpText = config.customCommands
        .map((cmd) => `/${cmd.command} - ${cmd.description}`)
        .join('\n')
      return {
        isCommand: true,
        command: 'help',
        response: helpText || 'No commands available',
      }

    case 'about':
      return {
        isCommand: true,
        command: 'about',
        response: config.companyName || 'WhatsApp Bot',
      }

    default:
      // Check custom commands
      const customCommand = config.customCommands.find(
        (cmd) => cmd.command.toLowerCase() === commandLower
      )
      if (customCommand) {
        return {
          isCommand: true,
          command: customCommand.command,
          response: customCommand.response || 'Command executed',
        }
      }
  }

  return { isCommand: false }
}

// ============ Business Hours Check ============

export function isWithinBusinessHours(config: BotConfig, now: Date = new Date()): boolean {
  if (!config.businessHoursEnabled || !config.businessHours) {
    return true
  }

  const { startTime, endTime, timezone, daysOfWeek } = config.businessHours
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(now)
  const dayIndex = parseInt(parts.find((p) => p.type === 'weekday')?.value || '0')
  const timeStr = `${parts.find((p) => p.type === 'hour')?.value}:${parts.find((p) => p.type === 'minute')?.value}`

  // Check if day is in business days
  if (!daysOfWeek.includes(dayIndex)) {
    return false
  }

  // Check if time is within business hours
  return timeStr >= startTime && timeStr <= endTime
}

// ============ Access Control ============

export function isPhoneNumberAllowed(
  phoneNumber: string,
  config: BotConfig
): boolean {
  if (!config.accessControl?.whitelistEnabled) {
    return true
  }

  return config.accessControl.phoneNumbers.includes(phoneNumber)
}

// ============ Prompt Building ============

function buildSystemPrompt(config: BotConfig): string {
  let prompt = config.aiPrompt || 'You are a helpful WhatsApp bot assistant.'

  if (config.companyName) {
    prompt += `\n\nYou represent ${config.companyName}.`
  }

  return prompt
}

function buildUserMessage(
  userMessage: string,
  context: Partial<MessageContext> = {}
): string {
  let message = userMessage

  if (context.botConfig?.businessHoursEnabled && !isWithinBusinessHours(context.botConfig)) {
    message += '\n\n[Note: Outside business hours - consider mentioning availability]'
  }

  return message
}

// ============ LLM Integration ============

export async function generateBotResponse(
  context: MessageContext,
  llmProvider?: any // Should be the actual LLM provider from ai SDK
): Promise<ResponseData> {
  try {
    // Check rate limiting
    const rateLimit = checkRateLimit(context.botConfig.id, context.botConfig)
    if (!rateLimit.allowed) {
      return {
        message: 'I am currently receiving too many messages. Please try again later.',
        confidence: 1,
        metadata: {
          rateLimited: true,
          resetIn: rateLimit.resetIn,
        },
      }
    }

    // Check business hours
    if (
      context.botConfig.businessHoursEnabled &&
      !isWithinBusinessHours(context.botConfig)
    ) {
      return {
        message: context.botConfig.goodbyeMessage || 'Thanks for reaching out. We are currently closed.',
        confidence: 1,
        metadata: {
          businessHoursClosed: true,
        },
      }
    }

    // Process commands
    const commandResult = processCommand(context.userMessage, context.botConfig)
    if (commandResult.isCommand) {
      return {
        message: commandResult.response || 'Command executed',
        confidence: 1,
        executedCommand: commandResult.command,
        metadata: {
          isCommand: true,
        },
      }
    }

    // Build conversation context
    const systemPrompt = buildSystemPrompt(context.botConfig)
    const userPrompt = buildUserMessage(context.userMessage, context)

    // If no LLM provider is available, return a generic response
    if (!llmProvider) {
      return {
        message: generateDefaultResponse(context.userMessage, context.botConfig),
        confidence: 0.5,
        metadata: {
          generated: 'default',
          timestamp: new Date().toISOString(),
        },
      }
    }

    // Call LLM to generate response
    try {
      const response = await generateText({
        model: llmProvider,
        system: systemPrompt,
        messages: [
          ...(context.conversationHistory || []),
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        maxTokens: 500,
      })

      return {
        message: response.text,
        confidence: 0.9,
        metadata: {
          model: 'llm',
          tokensUsed: response.usage?.totalTokens || 0,
          timestamp: new Date().toISOString(),
        },
      }
    } catch (llmError) {
      console.error('LLM generation error:', llmError)
      // Fallback to default response
      return {
        message: generateDefaultResponse(context.userMessage, context.botConfig),
        confidence: 0.5,
        metadata: {
          generated: 'fallback',
          error: String(llmError),
          timestamp: new Date().toISOString(),
        },
      }
    }
  } catch (error) {
    console.error('Error generating bot response:', error)
    return {
      message: 'Sorry, I encountered an error processing your message. Please try again.',
      confidence: 0,
      metadata: {
        error: String(error),
      },
    }
  }
}

// ============ Default Response Generation ============

function generateDefaultResponse(userMessage: string, config: BotConfig): string {
  // Simple keyword-based responses for when LLM is not available
  const lowerMessage = userMessage.toLowerCase()

  const responses: Record<string, string[]> = {
    greeting: [
      'Hi there! How can I help you?',
      'Hello! What can I assist you with?',
      'Hey! How are you doing?',
    ],
    help: [
      `I'm here to help! Type /help for available commands.`,
      'How can I assist you today?',
    ],
    goodbye: [
      'Thanks for reaching out. Have a great day!',
      'Goodbye! Feel free to message anytime.',
    ],
  }

  // Match keywords
  if (/^(hi|hello|hey|greetings|hola|bonjour)/i.test(lowerMessage)) {
    return getRandomResponse(responses.greeting)
  }

  if (/^(bye|goodbye|farewell|cya)/i.test(lowerMessage)) {
    return getRandomResponse(responses.goodbye)
  }

  if (/(help|assist|support)/i.test(lowerMessage)) {
    return getRandomResponse(responses.help)
  }

  // Default response
  return `Thanks for your message! I'm currently learning to better respond to your needs. Please check back soon or contact our support team.`
}

function getRandomResponse(options: string[]): string {
  return options[Math.floor(Math.random() * options.length)]
}

// ============ Conversation History Management ============

export function formatConversationHistory(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Array<{ role: 'user' | 'assistant'; content: string }> {
  // Keep last 10 messages to avoid token limits
  return messages.slice(-10)
}

export function addToConversationHistory(
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  userMessage: string,
  botResponse: string
): Array<{ role: 'user' | 'assistant'; content: string }> {
  const updated = [
    ...history,
    { role: 'user' as const, content: userMessage },
    { role: 'assistant' as const, content: botResponse },
  ]

  return formatConversationHistory(updated)
}

// ============ Response Validation ============

export function validateResponse(response: ResponseData): boolean {
  return (
    response.message &&
    response.message.length > 0 &&
    response.message.length <= 4096 // WhatsApp message limit
  )
}

// ============ Sentiment Analysis (Simple) ============

export function analyzeMessageSentiment(message: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = [
    'good',
    'great',
    'excellent',
    'happy',
    'love',
    'awesome',
    'fantastic',
    'perfect',
  ]
  const negativeWords = [
    'bad',
    'terrible',
    'hate',
    'angry',
    'upset',
    'horrible',
    'awful',
    'worst',
  ]

  const lowerMessage = message.toLowerCase()
  const positiveCount = positiveWords.filter((w) => lowerMessage.includes(w)).length
  const negativeCount = negativeWords.filter((w) => lowerMessage.includes(w)).length

  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}
