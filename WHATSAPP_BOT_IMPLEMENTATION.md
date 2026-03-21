# WhatsApp Bot Deployment System - Implementation Guide

## Overview
This document outlines the complete WhatsApp bot deployment system integrated into the chatbots-ai dashboard at `/chatbots-ai/dashboard?tab=whatsapp`.

## What Has Been Implemented

### 1. **Database Service Layer** (`lib/whatsapp-bot-service.ts`)
Complete TypeScript service providing:
- WhatsApp bot templates management
- User credentials storage and verification
- Bot creation and lifecycle management
- Bot configuration (prompts, messages, commands)
- Deployment configuration for multiple platforms
- Session management for Baileys library
- Activity logging and analytics
- Type-safe interfaces for all data models

### 2. **API Endpoints**
Located under `/api/chatbots/whatsapp/`:

#### Bot Management
- `GET/POST /bots` - List user's bots or create new bot
- `GET/POST /bots/[id]/config` - Get/save bot configuration
- `GET/POST /bots/[id]/deploy` - Configure and deploy bot

#### Templates
- `GET /templates` - Fetch available bot templates (5 pre-configured)

### 3. **Frontend Components**

#### WhatsAppBotSection (`components/WhatsAppBotSection.tsx`)
Master component managing the entire WhatsApp bot workflow with states:
- **List View**: Shows all user's bots with status badges
- **Template Selection**: Browse available bot templates
- **Bot Creation**: Form to create new bot
- **Configuration**: Advanced bot settings panel
- **Deployment**: Deploy configuration interface

#### WhatsAppBotTemplateSelector (`components/WhatsAppBotTemplateSelector.tsx`)
Displays pre-configured bot templates:
- Customer Support Bot 🤖
- E-Commerce Bot 🛍️
- Lead Generation Bot 📊
- Notification Bot 🔔
- Custom Bot ⚙️

#### WhatsAppBotCreationForm (`components/WhatsAppBotCreationForm.tsx`)
Form to create new WhatsApp bot with fields:
- Bot Name
- WhatsApp Phone Number
- Deployment Method Selection

#### WhatsAppBotConfigPanel (`components/WhatsAppBotConfigPanel.tsx`)
Comprehensive configuration panel with 4 tabs:

**Basic Tab:**
- AI Prompt (system behavior definition)
- Company Name
- Primary Brand Color

**Messages Tab:**
- Welcome Message
- Goodbye Message

**Commands Tab:**
- Add custom commands (e.g., /help, /menu)
- Command descriptions
- Manage existing commands

**Advanced Tab:**
- **Business Hours**: Schedule bot availability
- **Access Control**: Phone number whitelist
- **Rate Limiting**: Message quotas per time period

#### WhatsAppBotDeploymentPanel (`components/WhatsAppBotDeploymentPanel.tsx`)
Deployment configuration and management:
- Deployment method selection (5 options)
- Platform-specific configuration fields
- Environment variables management
- Copy/edit/delete environment variables
- Deployment status indicator

### 4. **Dashboard Integration**
- New "WhatsApp" tab added to `/chatbots-ai/dashboard`
- Integrated into DashboardNavbar
- Full authentication with token-based access control

### 5. **Pre-configured Bot Templates**
Database includes 5 ready-to-use templates:
1. **Customer Support Bot** - FAQ, ticket creation, knowledge base
2. **E-Commerce Bot** - Product search, orders, payments, cart
3. **Lead Generation Bot** - Form filling, qualification, CRM integration
4. **Notification Bot** - Scheduled messages, events, reminders, broadcasts
5. **Custom Bot** - Build your own with custom logic

## Requirements & What You Need to Do

### 1. **Database Setup** ⚠️ REQUIRED
The system needs Supabase tables. You have two options:

**Option A: Run Setup Script** (Recommended)
```bash
npm run setup-whatsapp-bot-db
```
Or manually execute:
```bash
node scripts/setup-whatsapp-bot-db.js
```

**Option B: Manual Supabase Console**
Create these tables in your Supabase database:
- `whatsapp_bot_templates` - Bot templates
- `whatsapp_credentials` - User WhatsApp credentials
- `whatsapp_bots` - Created bots
- `whatsapp_bot_config` - Bot configurations
- `whatsapp_deployment_config` - Deployment settings
- `whatsapp_bot_sessions` - Baileys sessions
- `whatsapp_bot_logs` - Activity logs
- `whatsapp_bot_analytics` - Usage analytics

See `scripts/whatsapp-bot-schema.sql` for exact schema.

### 2. **Deployment Integration** 🚀 TO IMPLEMENT
Choose which deployment methods to support:

**Option 1: Direct Server**
- Users provide: Server host, port, auth key
- Action: Connect via SSH and start bot process
- Requires: Backend webhook to manage bot lifecycle

**Option 2: Heroku Deployment**
- Users provide: Heroku app name, API key
- Action: Trigger Heroku deployment via API
- Requires: Heroku auth & deployment scripts
- Cost: Users pay Heroku hosting

**Option 3: Railway.app Deployment**
- Users provide: Project ID, Railway token
- Action: Deploy to Railway via CLI
- Requires: Railway API integration
- Cost: Users pay Railway hosting

**Option 4: Render.com Deployment**
- Users provide: Service ID, API key
- Action: Deploy to Render service
- Requires: Render API integration
- Cost: Users pay Render hosting

**Option 5: Docker Containers**
- Users get: Docker image/compose files
- Action: User deploys container themselves
- Requires: Generate docker-compose.yml

### 3. **Baileys Integration** ⚠️ CRITICAL
WhatsApp Bot needs Baileys library for bot runtime:

**Backend Service** (Node.js)
- Install: `npm install @whiskeysockets/baileys`
- Session storage: Map to `whatsapp_bot_sessions` table
- Authentication: Multi-device flow
- Event handling: Message receive/send, connection status

**Session Management API** (Create route `/api/chatbots/whatsapp/bots/[id]/session`)
- QR Code generation endpoint
- Session persistence to database
- Connection status polling
- Message webhook handler

**Message Processing API** (Create route `/api/chatbots/whatsapp/bots/[id]/webhook`)
- Receives messages from bot
- Executes AI prompt (integrate with LLM)
- Sends responses back via Baileys

### 4. **LLM Integration** 🤖 TO CONFIGURE
The bot needs AI to generate responses. Two options:

**Option A: Use Vercel AI SDK**
```typescript
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const response = await generateText({
  model: openai('gpt-4'),
  prompt: botConfig.prompt + '\n\nUser: ' + userMessage,
})
```

**Option B: Use Your LLM**
- OpenAI API
- Anthropic Claude
- Local LLaMA server
- Any other LLM

### 5. **Environment Variables Required**
Add to your `.env.local`:

```env
# Existing
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

# New for WhatsApp Bots
WHATSAPP_BOT_WEBHOOK_URL=https://yourdomain.com/api/chatbots/whatsapp/webhook

# For LLM (choose based on LLM provider)
OPENAI_API_KEY=...  # or
ANTHROPIC_API_KEY=...

# For deployment platforms (optional, if supporting)
HEROKU_API_KEY=...  # if supporting Heroku
RAILWAY_API_TOKEN=...  # if supporting Railway
RENDER_API_KEY=...  # if supporting Render
```

### 6. **Missing Implementations** (TODO)

You need to create:

1. **Session Management API** (`/api/chatbots/whatsapp/bots/[id]/session/route.ts`)
   - QR code generation
   - Session state management
   - Connection status endpoint

2. **Message Webhook Handler** (`/api/chatbots/whatsapp/bots/[id]/webhook/route.ts`)
   - Receive messages from Baileys bot
   - Process through LLM
   - Send responses

3. **Bot Runtime Service** (`lib/whatsapp-bot-runner.ts`)
   - Initialize Baileys connection
   - Handle message events
   - Manage session lifecycle
   - Error handling and reconnection

4. **Deployment Executor** (`lib/deployment-executor.ts`)
   - Execute deployment based on method
   - Handle Heroku/Railway/Render/Docker deployments
   - Log deployment progress
   - Error handling

5. **LLM Integration** (`lib/whatsapp-bot-ai.ts`)
   - Initialize LLM client
   - Generate bot responses
   - Handle rate limiting
   - Context management

### 7. **Testing The System**

Once database is set up, you can:

1. Go to `/chatbots-ai/dashboard`
2. Click "WhatsApp" tab
3. Click "Create New Bot"
4. Select a template
5. Fill in bot details and phone number
6. Configure messages, commands, and settings
7. Deploy (currently shows success but doesn't actually deploy)

The UI is 100% functional for configuration. Deployment requires the implementations above.

## Architecture Overview

```
WhatsApp Bot System
├── Frontend Components
│   ├── WhatsAppBotSection (master component)
│   ├── WhatsAppBotTemplateSelector
│   ├── WhatsAppBotCreationForm
│   ├── WhatsAppBotConfigPanel
│   └── WhatsAppBotDeploymentPanel
├── API Layer
│   ├── /api/chatbots/whatsapp/bots (CRUD)
│   ├── /api/chatbots/whatsapp/bots/[id]/config (config)
│   ├── /api/chatbots/whatsapp/bots/[id]/deploy (deployment)
│   ├── /api/chatbots/whatsapp/templates (templates)
│   ├── /api/chatbots/whatsapp/bots/[id]/session (TODO - sessions)
│   └── /api/chatbots/whatsapp/bots/[id]/webhook (TODO - messages)
├── Service Layer
│   ├── lib/whatsapp-bot-service.ts (complete ✓)
│   ├── lib/whatsapp-bot-runner.ts (TODO - bot runtime)
│   ├── lib/whatsapp-bot-ai.ts (TODO - LLM integration)
│   ├── lib/deployment-executor.ts (TODO - deployment)
│   └── Database (Supabase - needs setup)
└── Database
    └── 8 tables with RLS policies
```

## Next Steps

### Immediate (1-2 hours)
1. Run database setup script
2. Test bot creation/configuration UI

### Short Term (1-2 days)
1. Implement session management API
2. Set up Baileys bot runner
3. Connect LLM for responses

### Medium Term (2-3 days)
1. Implement deployment executors
2. Add deployment status monitoring
3. Create logs viewer

### Long Term
1. Add bot analytics dashboard
2. Rate limiting enforcement
3. Multi-user management for bots
4. Advanced webhook integrations

## Support & Debugging

Check logs in: Database → `whatsapp_bot_logs` table
Test endpoints with bot token: `Authorization: Bearer {chatbot_token}`

## Notes

- All user data is isolated via Supabase RLS policies
- Passwords/tokens stored encrypted
- Bot sessions stored securely in database
- Environment variables kept separate per bot
- Webhook URLs validated before use
