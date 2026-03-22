# WhatsApp Bot System - Implementation TODO

## Phase 1: Database Setup (1 hour)

### Task 1.1: Initialize Database
- [ ] Run setup script:
  ```bash
  node scripts/setup-whatsapp-bot-db.js
  ```
- [ ] Verify all 8 tables created in Supabase
- [ ] Verify 5 templates inserted
- [ ] Check RLS policies are enabled

**Location**: `scripts/setup-whatsapp-bot-db.js`

---

## Phase 2: Bot Runtime (1-2 days)

### Task 2.1: Install Baileys
```bash
npm install @whiskeysockets/baileys
npm install pino pino-pretty  # For logging
```

### Task 2.2: Create Bot Runner Service
**File**: `lib/whatsapp-bot-runner.ts`

```typescript
export class WhatsAppBotRunner {
  // Methods to implement:
  
  // Initialize Baileys connection for a bot
  async initializeBot(botId: string): Promise<void>
  
  // Handle incoming messages
  handleMessage(message: any): Promise<void>
  
  // Generate QR code for authentication
  generateQRCode(botId: string): Promise<string>
  
  // Save session to database
  saveSession(botId: string, sessionData: any): Promise<void>
  
  // Load session from database
  loadSession(botId: string): Promise<any>
  
  // Send message to user
  sendMessage(botId: string, phoneNumber: string, message: string): Promise<void>
  
  // Disconnect bot
  disconnect(botId: string): Promise<void>
  
  // Get connection status
  getStatus(botId: string): Promise<'connected' | 'disconnected' | 'error'>
}
```

### Task 2.3: Create Session Management API
**File**: `app/api/chatbots/whatsapp/bots/[id]/session/route.ts`

```typescript
// GET: Get session status and QR code
// Returns:
// {
//   status: 'connected' | 'disconnected' | 'waiting_qr',
//   qr_code: 'data:image/png;base64,...' (if waiting)
//   connected_at: '2024-01-01T00:00:00Z'
// }

// POST: Initialize new session
// Body: {} (empty)
// Returns: { status: 'initializing', message: 'Scan QR code' }

// DELETE: End session
// Returns: { status: 'disconnected' }
```

---

## Phase 3: Message Processing (1 day)

### Task 3.1: Create LLM Service
**File**: `lib/whatsapp-bot-ai.ts`

```typescript
export class WhatsAppBotAI {
  // Methods to implement:
  
  // Initialize LLM client (OpenAI, Anthropic, etc.)
  async initialize(): Promise<void>
  
  // Generate response based on bot prompt and user message
  async generateResponse(
    botPrompt: string,
    userMessage: string,
    conversationHistory?: any[]
  ): Promise<string>
  
  // Handle rate limiting
  async checkRateLimit(botId: string): Promise<boolean>
  
  // Record message usage
  async recordUsage(botId: string): Promise<void>
  
  // Get estimated tokens for message
  estimateTokens(message: string): number
}
```

### Task 3.2: Create Webhook Handler
**File**: `app/api/chatbots/whatsapp/bots/[id]/webhook/route.ts`

```typescript
// POST: Receive incoming messages from Baileys bot
// Body: {
//   from: '+1234567890',
//   message: 'User message',
//   timestamp: 1234567890,
//   messageId: 'msg_123'
// }
//
// Process:
// 1. Get bot config from database
// 2. Check rate limits
// 3. Call LLM to generate response
// 4. Send response via WhatsAppBotRunner.sendMessage()
// 5. Log message to database
// 6. Return: { status: 'processed' }
```

---

## Phase 4: Deployment Execution (2-3 days)

### Task 4.1: Create Deployment Executor
**File**: `lib/deployment-executor.ts`

```typescript
export class DeploymentExecutor {
  // Methods to implement:
  
  // Deploy to direct server
  async deployToDirectServer(
    botId: string,
    config: DeploymentConfig
  ): Promise<string> // Returns deployment URL
  
  // Deploy to Heroku
  async deployToHeroku(
    botId: string,
    config: DeploymentConfig
  ): Promise<string> // Returns Heroku app URL
  
  // Deploy to Railway
  async deployToRailway(
    botId: string,
    config: DeploymentConfig
  ): Promise<string> // Returns Railway service URL
  
  // Deploy to Render
  async deployToRender(
    botId: string,
    config: DeploymentConfig
  ): Promise<string> // Returns Render service URL
  
  // Generate Docker compose file
  async generateDockerCompose(
    botId: string,
    config: DeploymentConfig
  ): Promise<string> // Returns docker-compose.yml content
  
  // Get deployment status
  async getDeploymentStatus(botId: string): Promise<{
    status: 'deploying' | 'running' | 'failed' | 'stopped'
    logs: string
    url?: string
  }>
}
```

### Task 4.2: Integrate Deployment with API
**Update**: `app/api/chatbots/whatsapp/bots/[id]/deploy/route.ts`

- [ ] Call DeploymentExecutor based on deployment method
- [ ] Update bot status to 'deployed' on success
- [ ] Log deployment activity
- [ ] Return deployment URL to client
- [ ] Handle deployment errors gracefully

---

## Phase 5: Environment Setup (30 minutes)

### Task 5.1: Add Environment Variables
**File**: `.env.local`

```env
# Webhook for bot messages
WHATSAPP_BOT_WEBHOOK_URL=https://yourdomain.com/api/chatbots/whatsapp/bots

# LLM Provider (choose one)
OPENAI_API_KEY=sk-...
# OR
ANTHROPIC_API_KEY=sk-ant-...

# Optional: For deployment platforms
HEROKU_API_KEY=...
RAILWAY_API_TOKEN=...
RENDER_API_KEY=...
```

### Task 5.2: Install Required Packages
```bash
npm install @whiskeysockets/baileys
npm install axios  # For HTTP requests
npm install dotenv  # For env variables

# Choose your LLM SDK:
npm install openai  # For OpenAI
# OR
npm install @anthropic-ai/sdk  # For Claude
```

---

## Phase 6: Testing (1 day)

### Task 6.1: Unit Tests
- [ ] Test WhatsAppBotRunner class
- [ ] Test WhatsAppBotAI class
- [ ] Test DeploymentExecutor class
- [ ] Test API endpoints

### Task 6.2: Integration Tests
- [ ] Test bot creation to deployment flow
- [ ] Test message receiving and responding
- [ ] Test session persistence
- [ ] Test error handling

### Task 6.3: Manual Testing
- [ ] Create a test bot
- [ ] Configure test bot
- [ ] Deploy test bot
- [ ] Send test message
- [ ] Verify response
- [ ] Check database logging

**Test Scenarios**:
1. Happy path: Create → Configure → Deploy → Message → Response
2. Invalid phone number
3. Deployment with invalid credentials
4. Rate limiting enforcement
5. Business hours enforcement
6. Whitelist enforcement

---

## Implementation Order (Recommended)

1. **First**: Database setup (Task 1.1) - Prerequisite for everything
2. **Second**: Bot Runner (Task 2.2 + 2.3) - Needed for messages to work
3. **Third**: Webhook Handler (Task 3.2) - Needed to receive messages
4. **Fourth**: LLM Service (Task 3.1) - Needed to generate responses
5. **Fifth**: Deployment Executor (Task 4.1 + 4.2) - Needed for actual deployment

**Parallel Work**: While implementing core features, you can work on:
- Environment setup (Task 5.1 + 5.2)
- Testing (Task 6.x)

---

## Code Templates

### WhatsAppBotRunner Quick Start
```typescript
import makeWASocket, { DisconnectReason } from '@whiskeysockets/baileys'
import { useMultiFileAuthState } from '@whiskeysockets/baileys'

export class WhatsAppBotRunner {
  private sockets: Map<string, any> = new Map()
  
  async initializeBot(botId: string) {
    const { state, saveCreds } = await useMultiFileAuthState(
      `./sessions/${botId}`
    )
    
    const socket = makeWASocket({
      auth: state,
      printQRInTerminal: false, // We'll handle QR code separately
    })
    
    socket.ev.on('messages.upsert', ({ messages }) => {
      messages.forEach(msg => this.handleMessage(msg))
    })
    
    socket.ev.on('creds.update', saveCreds)
    
    this.sockets.set(botId, socket)
  }
  
  private async handleMessage(message: any) {
    // Implement message handling
  }
}
```

### WhatsAppBotAI Quick Start
```typescript
import OpenAI from 'openai'

export class WhatsAppBotAI {
  private openai: OpenAI
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }
  
  async generateResponse(
    botPrompt: string,
    userMessage: string
  ): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: botPrompt },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 500,
    })
    
    return response.choices[0].message.content || ''
  }
}
```

### Webhook Handler Quick Start
```typescript
import { NextResponse } from 'next/server'
import { WhatsAppBotRunner } from '@/lib/whatsapp-bot-runner'
import { WhatsAppBotAI } from '@/lib/whatsapp-bot-ai'

const botRunner = new WhatsAppBotRunner()
const botAI = new WhatsAppBotAI()

export async function POST(request: Request) {
  const { from, message, botId } = await request.json()
  
  try {
    // Get bot config
    const config = await getWhatsappBotConfig(botId)
    
    // Generate response
    const response = await botAI.generateResponse(
      config.prompt,
      message
    )
    
    // Send response
    await botRunner.sendMessage(botId, from, response)
    
    // Log message
    await logWhatsappBotActivity(botId, 'info', `Message from ${from}`)
    
    return NextResponse.json({ status: 'processed' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
```

---

## Debugging Tips

### Session Issues
- Check `whatsapp_bot_sessions` table for stored session data
- Verify QR code is being generated correctly
- Check Baileys logs for connection issues

### Message Issues
- Verify webhook URL is correct and accessible
- Check rate limits haven't been exceeded
- Verify bot config has valid AI prompt
- Check LLM API key is correct

### Deployment Issues
- Verify credentials for deployment platform
- Check environment variables are set
- Review deployment logs in database

---

## Success Criteria for Each Phase

### Phase 1 ✓
- [ ] All 8 tables exist in Supabase
- [ ] Templates table has 5 templates
- [ ] Can create new bot via API

### Phase 2 ✓
- [ ] Baileys connection works
- [ ] QR code generates and displays
- [ ] Session persists to database
- [ ] Bot status updates correctly

### Phase 3 ✓
- [ ] Webhook receives messages
- [ ] LLM generates responses
- [ ] Responses sent back to user
- [ ] Activity logged to database

### Phase 4 ✓
- [ ] Bot deploys to selected platform
- [ ] Deployment URL returned to user
- [ ] Bot accessible after deployment
- [ ] Deployment can be monitored

### Phase 5 ✓
- [ ] All env variables configured
- [ ] All packages installed
- [ ] No missing dependencies

### Phase 6 ✓
- [ ] All tests pass
- [ ] Manual testing successful
- [ ] Error cases handled gracefully
- [ ] Performance acceptable

---

## Estimated Timeline

| Phase | Tasks | Estimate | Notes |
|-------|-------|----------|-------|
| 1 | DB Setup | 1 hour | Easy, one script |
| 2 | Bot Runtime | 1-2 days | Most complex |
| 3 | Message Processing | 1 day | Moderate |
| 4 | Deployment | 2-3 days | Varies by platform count |
| 5 | Environment | 30 min | Quick setup |
| 6 | Testing | 1 day | Thorough testing |
| **Total** | | **~6-8 days** | **Full implementation** |

With focused effort, you could have a fully functional system in **1 week**.

---

## File Checklist

Files to create (5 new files):
- [ ] `lib/whatsapp-bot-runner.ts` (~200 lines)
- [ ] `lib/whatsapp-bot-ai.ts` (~150 lines)
- [ ] `lib/deployment-executor.ts` (~300 lines)
- [ ] `app/api/chatbots/whatsapp/bots/[id]/session/route.ts` (~150 lines)
- [ ] `app/api/chatbots/whatsapp/bots/[id]/webhook/route.ts` (~200 lines)

Files to update (1 existing file):
- [ ] `app/api/chatbots/whatsapp/bots/[id]/deploy/route.ts` (add actual deployment)

---

## Questions Before Starting?

1. Which LLM provider do you want to use? (OpenAI, Anthropic, Local, etc.)
2. Which deployment platform is priority? (Heroku seems easiest)
3. Should the free tier have rate limits? (Current: 100 msgs/hour)
4. Who pays for bot hosting?
5. Need user analytics dashboard?
6. Need webhook integrations with other services?

---

**Current Status**: Ready to implement ✓

All groundwork is done. You have the database schema, frontend UI, API routes, and service layer. Time to add the bot logic!

Good luck! 🚀
