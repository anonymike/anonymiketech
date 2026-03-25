# TRUTH-MD Architecture Analysis & Deployment Strategy

## Overview
TRUTH-MD is a WhatsApp Multi-Device bot relay that uses Baileys (WhatsApp Web scraper) to connect bots to WhatsApp. It's designed to run as a background worker process with session persistence.

---

## TRUTH-MD Core Architecture

### 1. **Entry Point: index.js**
- Obfuscated relay loader
- Connects to Vercel relay server: `https://techcourtney-relay-one.vercel.app/api/repo`
- Dynamically loads bot code from secure relay
- Installs dependencies on first run
- Applies Baileys patches automatically

### 2. **Authentication Flow**
```
User provides SESSION_ID (format: TRUTH-MD:~...)
    ↓
index.js loads from relay server
    ↓
Connects to PostgreSQL for session persistence
    ↓
Patches Baileys library (disable event buffering)
    ↓
Establishes WhatsApp connection
    ↓
Bot starts handling messages
```

### 3. **Key Dependencies**
| Package | Purpose |
|---------|---------|
| `@whiskeysockets/baileys` v6.7.9 or v7.0.0-rc.9 | WhatsApp client library |
| `pg` | PostgreSQL database |
| `express` | API framework (if needed) |
| `sharp`, `jimp` | Image processing |
| `ffmpeg`, `imagemagick` | Media conversion |
| `axios`, `node-fetch` | HTTP requests |
| `gtts`, `mumaker` | Text-to-speech, audio generation |
| `yt-search`, `ytdl-core` | YouTube integration |

### 4. **Baileys Patches** (patch-baileys.cjs)
Modifies Baileys library to:
- Disable event buffering on connection
- Skip AwaitingInitialSync state
- Silence mex newsletter warnings
- Silence libsignal decrypt errors
- Allows immediate message handling

### 5. **Session Format**
```
TRUTH-MD:~[BASE64_ENCODED_SESSION_DATA]
```
Contains:
- WhatsApp authentication tokens
- Device ID
- Encryption keys
- Connection state
- Message history metadata

---

## How TRUTH-MD Works in Production

### Deployment Model
1. **Relay Server** (Vercel): Hosts bot code and handles code loading
2. **Worker Process** (Replit/Heroku/Custom): Runs bot with `SESSION_ID`
3. **Databases**:
   - PostgreSQL: Session persistence, user data
   - SQLite (optional): Local caching
4. **Message Flow**:
   - WhatsApp sends message → Baileys receives → Bot processes → Response sent

### Environment Variables Needed
- `SESSION_ID`: WhatsApp session (TRUTH-MD:~...)
- `DATABASE_URL`: PostgreSQL connection string
- Optional: API keys for integrations (YouTube, etc.)

---

## Integration Strategy for Your Platform

### Architecture: Hybrid Approach

```
┌─────────────────────────────────────────────────┐
│         Your Dashboard (anonymiketech)          │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. Bot Creation Form                          │
│  2. Session Manager (Upload TRUTH-MD session)  │
│  3. Bot Configuration (settings, handlers)     │
│  4. Deploy Button                              │
│                                                 │
└────────────┬────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────┐
│        Bot Deployment Engine                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. Validate Session (must start with TRUTH-MD)│
│  2. Create bot runner (Docker/Node process)    │
│  3. Mount SESSION_ID as environment variable   │
│  4. Connect to PostgreSQL                      │
│  5. Start bot with index.js                    │
│  6. Monitor logs & health                      │
│                                                 │
└────────────┬────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────┐
│    TRUTH-MD Bot Instance (Node.js Process)     │
├─────────────────────────────────────────────────┤
│                                                 │
│  - Loads from relay server                     │
│  - Patches Baileys                             │
│  - Connects via SESSION_ID                     │
│  - Handles WhatsApp messages                   │
│  - Stores data in PostgreSQL                   │
│                                                 │
└────────────┬────────────────────────────────────┘
             │
             ▼
        WhatsApp API
```

### Implementation Options

#### Option 1: Docker Container Deployment (Recommended)
- Create Dockerfile that runs TRUTH-MD with SESSION_ID
- Deploy to your container platform (Railway, Render, etc.)
- Easy to scale, monitor, restart

#### Option 2: Vercel Functions
- Create serverless function wrapper
- Limitations: 60s timeout (won't work for long-running bot)
- Only viable for webhook-based updates

#### Option 3: Dedicated Worker Server
- Heroku, Railway, Render, or custom VPS
- Best for production with multiple bots
- Can manage process lifecycle

---

## What Your Platform Needs to Provide

### 1. **Session Management UI** (Already Added)
- Accept TRUTH-MD session string
- Validate format
- Store securely in database
- Auto-deploy after import

### 2. **Bot Deployment Engine**
- Create isolated bot process per bot
- Set environment variables (SESSION_ID, DATABASE_URL)
- Start Node.js process with index.js
- Monitor health and logs

### 3. **Database Integration**
- Each bot gets own PostgreSQL schema
- User sessions, messages, settings stored per bot

### 4. **Process Management**
- Start/stop bots
- Restart on crash
- View logs in dashboard
- Monitor CPU/memory

### 5. **Message Handler Interface**
- Define custom commands
- Set webhook for message processing
- Log all messages

---

## Deployment Flow on Your Platform

### User Perspective
```
1. User creates bot in dashboard
   ↓
2. Dashboard shows: "Ready to link WhatsApp"
   ↓
3. User visits TRUTH-MD site → Gets SESSION_ID
   ↓
4. User pastes SESSION_ID in dashboard
   ↓
5. System validates & auto-deploys
   ↓
6. Dashboard shows: "Bot is live on WhatsApp"
   ↓
7. User receives WhatsApp messages in dashboard
   ↓
8. User can set rules/handlers for responses
```

---

## Technical Implementation Tasks

### Phase 1: Session Management (Already Done)
- ✅ TruthMdSessionImporter component
- ✅ API endpoint to validate/store sessions
- ✅ Database schema for sessions

### Phase 2: Bot Deployment Engine (TODO)
1. Create bot runner script that:
   - Takes SESSION_ID from database
   - Creates isolated Node.js process
   - Sets environment variables
   - Runs index.js from TRUTH-MD
   - Forwards logs to dashboard

2. Create bot manager service that:
   - Starts bots on deployment
   - Monitors health
   - Restarts on failure
   - Kills old instances on redeploy

### Phase 3: Message Processing (TODO)
1. Create webhook handler in TRUTH-MD fork
   - Intercepts incoming messages
   - POSTs to dashboard API
   - Receives response from dashboard
   - Sends response via WhatsApp

2. Update dashboard to:
   - Show incoming messages in real-time
   - Allow user to reply
   - Set auto-reply rules

### Phase 4: Dashboard Integration (TODO)
1. Show bot status (online/offline)
2. Display message logs
3. Show WhatsApp connection status
4. Allow message history viewing

---

## Code Structure for Deployment

### Bot Runner Service
```javascript
// services/bot-runner.js
class BotRunner {
  async startBot(botId, sessionId, config) {
    // 1. Validate session
    // 2. Create .env file with SESSION_ID
    // 3. Download index.js from TRUTH-MD relay
    // 4. Start Node.js child process
    // 5. Capture logs and stream to database
    // 6. Monitor for crashes
  }
  
  async stopBot(botId) {
    // Kill process, cleanup resources
  }
  
  async getHealth(botId) {
    // Check if process is running
  }
}
```

### Message Handler
```javascript
// services/message-handler.js
class MessageHandler {
  async handleIncoming(botId, message) {
    // 1. Store in database
    // 2. POST to webhook if configured
    // 3. Return response
  }
  
  async sendMessage(botId, phoneNumber, text) {
    // Send via WhatsApp through bot instance
  }
}
```

---

## Database Schema Extensions Needed

### whatsapp_bot_instances
```sql
CREATE TABLE whatsapp_bot_instances (
  id UUID PRIMARY KEY,
  bot_id UUID REFERENCES chatbots(id),
  session_id TEXT ENCRYPTED, -- TRUTH-MD:~...
  process_id INT,            -- Node process PID
  status VARCHAR(20),        -- running|stopped|error
  last_started_at TIMESTAMP,
  logs TEXT,                 -- Recent logs
  whatsapp_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### whatsapp_messages
```sql
CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY,
  bot_id UUID REFERENCES chatbots(id),
  phone_number VARCHAR(20),
  message TEXT,
  is_incoming BOOLEAN,
  media_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Long-running processes on serverless | Use dedicated worker/container platform |
| Session expiry | Refresh session periodically, alert user to re-link |
| Multiple bots on same machine | Docker containers with isolation |
| Message rate limiting | Use queue system (Bull, RabbitMQ) |
| WhatsApp ban risk | Rotate accounts, add delays, monitor |
| Database connections | Connection pooling with PgBouncer |

---

## Next Steps

1. **Verify current TruthMdSessionImporter works** - Test session import
2. **Choose deployment platform** - Docker (Railway/Render) vs custom server
3. **Build bot runner service** - Execute Node.js with SESSION_ID
4. **Add message webhook** - Forward messages to dashboard
5. **Update dashboard UI** - Show bot status, messages, logs
6. **Test end-to-end** - Import session → Bot goes live → Messages appear in dashboard

---

## Resources

- **TRUTH-MD GitHub**: https://github.com/Courtney250/TRUTH-MD
- **Baileys GitHub**: https://github.com/WhiskeySockets/Baileys
- **WhatsApp API Limits**: Rate limiting, session expiry, device binding
- **Session Format**: Always starts with `TRUTH-MD:~` followed by base64 data

---

## Summary

TRUTH-MD is production-ready infrastructure for WhatsApp bots. Your platform can:
1. Accept TRUTH-MD sessions from users
2. Deploy each bot as isolated Node.js process
3. Forward messages to dashboard
4. Allow users to set handlers/rules
5. Show real-time message logs and bot status

The key is building a **bot runner service** that manages Node.js processes with SESSION_ID environment variables, monitors health, and forwards messages to your API.
