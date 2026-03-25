import { ChildProcess, spawn } from 'child_process'
import * as fs from 'fs/promises'
import * as path from 'path'
import { supabase } from './supabase'

interface BotConfig {
  botId: string
  sessionId: string
  phoneNumber?: string
  databaseUrl: string
  relayUrl?: string
}

interface BotProcess {
  process: ChildProcess
  logs: string[]
  startedAt: Date
  lastHealthCheck: Date
}

const activeBots = new Map<string, BotProcess>()

/**
 * Bot Runner Service - Manages TRUTH-MD bot deployment
 * Handles process lifecycle, logging, and health monitoring
 */
export class BotRunner {
  /**
   * Start a new bot instance with TRUTH-MD session
   */
  static async startBot(config: BotConfig): Promise<void> {
    try {
      console.log(`[v0] Starting bot: ${config.botId}`)

      // Validate session format
      if (!config.sessionId.startsWith('TRUTH-MD:~')) {
        throw new Error('Invalid session format. Must start with TRUTH-MD:~')
      }

      // Check if bot already running
      if (activeBots.has(config.botId)) {
        console.warn(`[v0] Bot ${config.botId} already running, stopping first`)
        await this.stopBot(config.botId)
      }

      // Create temporary working directory for bot
      const botDir = path.join(process.cwd(), '.bots', config.botId)
      await fs.mkdir(botDir, { recursive: true })

      // Create .env file with session
      const envContent = `SESSION_ID="${config.sessionId}"
DATABASE_URL="${config.databaseUrl}"
NODE_ENV="production"
RELAY_URL="${config.relayUrl || 'https://techcourtney-relay-one.vercel.app/api/repo'}"
BOT_ID="${config.botId}"
`

      const envFile = path.join(botDir, '.env')
      await fs.writeFile(envFile, envContent)

      // Download or copy index.js from TRUTH-MD
      const indexContent = await this.getTruthMdIndex()
      const indexFile = path.join(botDir, 'index.js')
      await fs.writeFile(indexFile, indexContent)

      // Create package.json
      const packageJson = {
        name: `bot-${config.botId}`,
        version: '1.0.0',
        main: 'index.js',
        scripts: { start: 'node index.js' },
        dependencies: {
          '@whiskeysockets/baileys': '^7.0.0-rc.9',
          'dotenv': '^16.6.1',
          'pg': '^8.20.0',
          'express': '^5.2.1',
          'axios': '^1.13.6',
          'sharp': '^0.32.6',
          'node-fetch': '^2.7.0',
        },
      }

      await fs.writeFile(
        path.join(botDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      )

      // Spawn Node.js process
      const botProcess = spawn('node', [indexFile], {
        cwd: botDir,
        env: {
          ...process.env,
          SESSION_ID: config.sessionId,
          DATABASE_URL: config.databaseUrl,
          NODE_ENV: 'production',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      })

      const logs: string[] = []

      // Capture stdout
      botProcess.stdout?.on('data', (data) => {
        const log = data.toString()
        logs.push(log)
        if (logs.length > 1000) logs.shift() // Keep last 1000 lines
        console.log(`[BOT ${config.botId}] ${log}`)
      })

      // Capture stderr
      botProcess.stderr?.on('data', (data) => {
        const log = data.toString()
        logs.push(log)
        if (logs.length > 1000) logs.shift()
        console.error(`[BOT ${config.botId}] ERROR: ${log}`)
      })

      // Handle process exit
      botProcess.on('exit', (code, signal) => {
        console.warn(
          `[v0] Bot ${config.botId} process exited with code ${code}, signal ${signal}`
        )
        activeBots.delete(config.botId)
        this.updateBotStatus(config.botId, 'stopped', logs.join('\n'))
      })

      botProcess.on('error', (error) => {
        console.error(`[v0] Bot ${config.botId} process error:`, error)
        activeBots.delete(config.botId)
        this.updateBotStatus(config.botId, 'error', error.message)
      })

      // Store active bot reference
      activeBots.set(config.botId, {
        process: botProcess,
        logs,
        startedAt: new Date(),
        lastHealthCheck: new Date(),
      })

      // Update database
      await this.updateBotStatus(config.botId, 'running', 'Bot started successfully')

      console.log(`[v0] Bot ${config.botId} started (PID: ${botProcess.pid})`)
    } catch (error) {
      console.error(`[v0] Failed to start bot ${config.botId}:`, error)
      await this.updateBotStatus(
        config.botId,
        'error',
        error instanceof Error ? error.message : 'Unknown error'
      )
      throw error
    }
  }

  /**
   * Stop a running bot instance
   */
  static async stopBot(botId: string): Promise<void> {
    try {
      const bot = activeBots.get(botId)

      if (!bot) {
        console.warn(`[v0] Bot ${botId} not found in active bots`)
        return
      }

      console.log(`[v0] Stopping bot ${botId}`)

      // Kill process tree
      if (bot.process.pid) {
        process.kill(-bot.process.pid) // Negative PID kills process group
      }

      activeBots.delete(botId)
      await this.updateBotStatus(botId, 'stopped', 'Bot stopped by user')

      console.log(`[v0] Bot ${botId} stopped`)
    } catch (error) {
      console.error(`[v0] Error stopping bot ${botId}:`, error)
    }
  }

  /**
   * Restart a bot instance
   */
  static async restartBot(botId: string, config: BotConfig): Promise<void> {
    console.log(`[v0] Restarting bot ${botId}`)
    await this.stopBot(botId)
    // Wait a bit before restarting
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await this.startBot(config)
  }

  /**
   * Get bot health status
   */
  static async getHealth(botId: string): Promise<{
    running: boolean
    pid?: number
    uptime?: number
    logs: string[]
  }> {
    const bot = activeBots.get(botId)

    if (!bot) {
      return { running: false, logs: [] }
    }

    return {
      running: true,
      pid: bot.process.pid,
      uptime: Date.now() - bot.startedAt.getTime(),
      logs: bot.logs.slice(-50), // Last 50 lines
    }
  }

  /**
   * Get recent logs for a bot
   */
  static getLogs(botId: string, lines = 100): string[] {
    const bot = activeBots.get(botId)
    return bot ? bot.logs.slice(-lines) : []
  }

  /**
   * Send message through bot instance
   */
  static async sendMessage(
    botId: string,
    phoneNumber: string,
    message: string
  ): Promise<boolean> {
    try {
      const bot = activeBots.get(botId)

      if (!bot) {
        throw new Error(`Bot ${botId} is not running`)
      }

      // For now, we'll use direct database insertion
      // In a full implementation, this would communicate with the bot process
      // via a local socket or HTTP endpoint

      console.log(`[v0] Sending message from ${botId} to ${phoneNumber}`)

      // Store outgoing message in database
      const { error } = await supabase.from('whatsapp_messages').insert({
        bot_id: botId,
        phone_number: phoneNumber,
        message,
        is_incoming: false,
        created_at: new Date().toISOString(),
      })

      if (error) throw error
      return true
    } catch (error) {
      console.error(`[v0] Failed to send message:`, error)
      return false
    }
  }

  /**
   * Update bot status in database
   */
  private static async updateBotStatus(
    botId: string,
    status: 'running' | 'stopped' | 'error',
    logs: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('whatsapp_bot_instances')
        .update({
          status,
          logs,
          last_started_at: status === 'running' ? new Date().toISOString() : undefined,
        })
        .eq('bot_id', botId)

      if (error) console.error('[v0] Failed to update bot status:', error)
    } catch (error) {
      console.error('[v0] Error updating bot status:', error)
    }
  }

  /**
   * Get TRUTH-MD index.js content
   * In production, this would fetch from the relay server
   */
  private static async getTruthMdIndex(): Promise<string> {
    // For now, return a minimal working index.js
    // In production, fetch from: https://techcourtney-relay-one.vercel.app/api/repo
    return `
require('dotenv').config();
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');

const SESSION_ID = process.env.SESSION_ID;
const BOT_ID = process.env.BOT_ID;

if (!SESSION_ID) {
  console.error('[TRUTH-MD] SESSION_ID not set. Set SESSION_ID environment variable.');
  process.exit(1);
}

async function startBot() {
  console.log('[TRUTH-MD] Starting bot with SESSION_ID...');
  
  // Parse session from SESSION_ID
  const [, sessionData] = SESSION_ID.split(':~');
  if (!sessionData) {
    console.error('[TRUTH-MD] Invalid SESSION_ID format');
    process.exit(1);
  }

  try {
    // Connect to WhatsApp
    const sock = makeWASocket({
      printQRInTerminal: false,
      auth: Buffer.from(sessionData, 'base64'),
    });

    // Handle connection update
    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === 'close') {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !== 401;
        console.log('[TRUTH-MD] Connection closed. Reconnecting:', shouldReconnect);
        if (shouldReconnect) startBot();
      } else if (connection === 'open') {
        console.log('[TRUTH-MD] ✓ Bot connected to WhatsApp');
      }
    });

    // Handle messages
    sock.ev.on('messages.upsert', (m) => {
      const msg = m.messages[0];
      if (!msg.key.fromMe && msg.message) {
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        console.log('[TRUTH-MD] Message from:', msg.key.remoteJid, '→', text);
        // Your message handling here
      }
    });

  } catch (error) {
    console.error('[TRUTH-MD] Error:', error);
    process.exit(1);
  }
}

startBot();
`
  }

  /**
   * Clean up all bot processes
   */
  static async cleanupAll(): Promise<void> {
    console.log('[v0] Cleaning up all bot processes...')

    for (const [botId] of activeBots) {
      await this.stopBot(botId)
    }

    activeBots.clear()
    console.log('[v0] All bots cleaned up')
  }
}

// Cleanup on process exit
process.on('SIGINT', async () => {
  console.log('[v0] SIGINT received, cleaning up...')
  await BotRunner.cleanupAll()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('[v0] SIGTERM received, cleaning up...')
  await BotRunner.cleanupAll()
  process.exit(0)
})

export default BotRunner
