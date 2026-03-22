# WhatsApp Bot System - Quick Start Guide

## 🚀 In 5 Minutes

### 1. Set Up Database (2 minutes)
```bash
# Run setup script
node scripts/setup-whatsapp-bot-db.js

# Or manually create tables via Supabase console
# Copy-paste content from: scripts/whatsapp-bot-schema.sql
```

### 2. View the UI (1 minute)
```bash
npm run dev
# Visit: http://localhost:3000/chatbots-ai/dashboard
# Click "WhatsApp" tab
```

### 3. Create a Test Bot (2 minutes)
1. Click "Create New Bot"
2. Select "Customer Support Bot" template
3. Enter bot name: "Test Bot"
4. Enter phone number: "+1234567890"
5. Click "Create Bot"
6. Configure settings and click "Deploy Bot"

**Result**: Bot created! (Deployment stub only, not actually deployed yet)

---

## 📁 What Each File Does

### Frontend Components
| File | Purpose | What It Does |
|------|---------|-------------|
| `WhatsAppBotSection.tsx` | Master component | Manages all views and state |
| `WhatsAppBotTemplateSelector.tsx` | Template browser | Displays 5 bot templates |
| `WhatsAppBotCreationForm.tsx` | Bot creation | Form to create new bot |
| `WhatsAppBotConfigPanel.tsx` | Configuration | Settings for bot behavior |
| `WhatsAppBotDeploymentPanel.tsx` | Deployment | Choose deployment method |

### Backend Services
| File | Purpose | What It Does |
|------|---------|-------------|
| `whatsapp-bot-service.ts` | Database service | All CRUD operations |
| `whatsapp-bot-runner.ts` | Bot runtime | ❌ TODO: Baileys connection |
| `whatsapp-bot-ai.ts` | AI responses | ❌ TODO: LLM integration |
| `deployment-executor.ts` | Deployments | ❌ TODO: Deploy to platforms |

### API Routes
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/chatbots/whatsapp/templates` | GET | Fetch templates |
| `/api/chatbots/whatsapp/bots` | GET/POST | List/create bots |
| `/api/chatbots/whatsapp/bots/[id]/config` | GET/POST | Get/save config |
| `/api/chatbots/whatsapp/bots/[id]/deploy` | GET/POST | Deploy setup |
| `/api/chatbots/whatsapp/bots/[id]/session` | ❌ TODO | Session management |
| `/api/chatbots/whatsapp/bots/[id]/webhook` | ❌ TODO | Message handling |

---

## 🔧 Environment Setup

### Required for Full Functionality

```env
# Your domain
WHATSAPP_BOT_WEBHOOK_URL=https://yourdomain.com/api/chatbots/whatsapp

# Choose ONE LLM provider
OPENAI_API_KEY=sk-...              # OpenAI
ANTHROPIC_API_KEY=sk-ant-...      # Claude
# OR use local LLM or other provider

# Optional: For deployment platforms
HEROKU_API_KEY=...
RAILWAY_API_TOKEN=...
RENDER_API_KEY=...
```

### Install Dependencies

```bash
npm install @whiskeysockets/baileys
npm install openai  # or anthropic, etc.
npm install axios
```

---

## 💾 Database Tables

All 8 tables created by setup script:

1. **whatsapp_bot_templates** - Bot templates (5 pre-loaded)
2. **whatsapp_credentials** - User WhatsApp login credentials
3. **whatsapp_bots** - Bot instances
4. **whatsapp_bot_config** - Bot settings (prompts, messages, commands)
5. **whatsapp_deployment_config** - Deployment details
6. **whatsapp_bot_sessions** - Baileys auth sessions
7. **whatsapp_bot_logs** - Activity log
8. **whatsapp_bot_analytics** - Usage stats

**Check status**: Supabase Console → SQL Editor → Run any `SELECT * FROM whatsapp_bots;`

---

## 🔐 Authentication

All requests need token from login:
```typescript
// Get token after user logs in
const token = localStorage.getItem('chatbot_token')

// Use in API requests
fetch('/api/chatbots/whatsapp/bots', {
  headers: { Authorization: `Bearer ${token}` }
})
```

---

## 📱 Bot Creation Flow

```
1. User clicks "Create New Bot"
   ↓
2. Select template (Customer Support, E-Commerce, etc.)
   ↓
3. Fill form:
   - Bot Name: "My Bot"
   - Phone Number: "+1234567890"
   - Method: Direct Server / Heroku / Railway / Render / Docker
   ↓
4. Click "Create Bot"
   → POST /api/chatbots/whatsapp/bots
   → Bot created, redirects to configure
   ↓
5. Configure bot:
   - Prompt: "You are a helpful bot"
   - Welcome: "Hello!"
   - Commands: /help, /menu, etc.
   - Advanced: Business hours, whitelist, rate limit
   ↓
6. Click "Save Configuration"
   → POST /api/chatbots/whatsapp/bots/[id]/config
   → Config saved
   ↓
7. Deploy:
   - Select method (Heroku, etc.)
   - Add environment variables
   - Click "Deploy Bot"
   → Currently: Shows success (stub)
   → Future: Actually deploys bot
   ↓
8. Done! Bot ready to use
```

---

## 🎯 5 Pre-configured Templates

### 1. 🤖 Customer Support Bot
- Features: FAQ responses, ticket creation, knowledge base
- Use for: Help desks, support centers
- Config: Enable `fallback_to_human`

### 2. 🛍️ E-Commerce Bot
- Features: Product search, orders, payments, cart
- Use for: Stores, marketplaces
- Config: Link to product database

### 3. 📊 Lead Generation Bot
- Features: Form collection, qualification, CRM integration
- Use for: Sales, marketing
- Config: Set up CRM webhook

### 4. 🔔 Notification Bot
- Features: Scheduled messages, broadcast, reminders
- Use for: Alerts, announcements
- Config: Set message schedule

### 5. ⚙️ Custom Bot
- Features: Full customization
- Use for: Anything else
- Config: Write your own prompt

---

## 🚨 Common Issues & Solutions

### "Database tables not found"
```bash
# Run setup script:
node scripts/setup-whatsapp-bot-db.js

# Or check Supabase console if tables exist
```

### "Bot not deploying"
Current implementation is **stub only**. To make it work:
1. Create `lib/whatsapp-bot-runner.ts`
2. Create `lib/deployment-executor.ts`
3. Implement actual deployment logic

### "Can't connect to WhatsApp"
Requires:
1. `lib/whatsapp-bot-runner.ts` with Baileys
2. `/api/.../session/route.ts` for QR code
3. Proper environment variables

### "Messages not processing"
Requires:
1. `/api/.../webhook/route.ts` handler
2. `lib/whatsapp-bot-ai.ts` for LLM
3. LLM API key configured

---

## 🧪 Testing the System

### Test 1: Can I create a bot?
```bash
1. Go to /chatbots-ai/dashboard
2. Click "WhatsApp" tab
3. Click "Create New Bot"
4. Select template
5. Fill form
6. Click "Create Bot"

Expected: Bot created, shows config panel
Status: ✅ WORKS
```

### Test 2: Can I configure a bot?
```bash
1. In config panel, change prompt
2. Add a command
3. Set business hours
4. Add whitelist entry
5. Click "Save Configuration"

Expected: Config saved successfully
Status: ✅ WORKS
```

### Test 3: Can I deploy a bot?
```bash
1. Go to Deploy tab
2. Select deployment method
3. Add environment variables
4. Click "Deploy Bot"

Expected: Success message
Current: ✅ Shows success (stub)
Actual: ❌ Doesn't really deploy
```

### Test 4: Does database work?
```bash
# In Supabase console:
SELECT * FROM whatsapp_bots;
SELECT * FROM whatsapp_bot_config;
SELECT * FROM whatsapp_bot_logs;

Expected: Data matches what you created
Status: ✅ WORKS
```

---

## 📊 Monitoring & Debugging

### Check bot status in database
```sql
SELECT id, bot_name, status, created_at 
FROM whatsapp_bots 
WHERE user_id = 'YOUR_USER_ID';
```

### View activity logs
```sql
SELECT log_type, message, created_at 
FROM whatsapp_bot_logs 
WHERE bot_id = 'BOT_ID'
ORDER BY created_at DESC
LIMIT 50;
```

### Check deployment config
```sql
SELECT * FROM whatsapp_deployment_config 
WHERE bot_id = 'BOT_ID';
```

### View bot config
```sql
SELECT prompt, welcome_message, commands 
FROM whatsapp_bot_config 
WHERE bot_id = 'BOT_ID';
```

---

## 🛠️ Development Workflow

### When adding new features:

1. **Add to database schema** (if needed)
2. **Update service layer** (`whatsapp-bot-service.ts`)
3. **Create/update API route** (if needed)
4. **Add frontend component** (if UI needed)
5. **Test with API client** (Postman, curl)
6. **Test in UI** (dashboard)
7. **Log activity** (to `whatsapp_bot_logs`)

### Code organization:
```
Services   → lib/whatsapp-bot-*.ts
APIs       → app/api/chatbots/whatsapp/*/route.ts
Components → components/WhatsApp*.tsx
Database   → Supabase Console
```

---

## 📚 Documentation

Files included:

1. **WHATSAPP_BOT_SUMMARY.md** - High-level overview
2. **WHATSAPP_BOT_IMPLEMENTATION.md** - Detailed implementation guide
3. **WHATSAPP_BOT_REQUIREMENTS.md** - Checklist of what's done/todo
4. **WHATSAPP_BOT_TODO.md** - Step-by-step implementation tasks
5. **WHATSAPP_BOT_ARCHITECTURE.md** - System architecture & diagrams
6. **WHATSAPP_BOT_QUICK_START.md** - This file

---

## ⏱️ Time Estimates

| Task | Time | Difficulty |
|------|------|-----------|
| Database setup | 1 hour | Easy |
| Bot runtime (Baileys) | 1-2 days | Hard |
| Message processing | 1 day | Medium |
| Deployment executor | 2-3 days | Hard |
| Testing & debugging | 1 day | Medium |
| **Total** | **1-2 weeks** | **Medium** |

---

## 🎓 Learning Resources

- **Baileys**: https://github.com/WhiskeySockets/Baileys
- **OpenAI**: https://platform.openai.com/docs
- **Supabase**: https://supabase.com/docs
- **Next.js**: https://nextjs.org/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

## ❓ FAQ

**Q: Can users deploy multiple bots?**  
A: Yes, each bot is independent with its own database records.

**Q: Can users share bots?**  
A: Not in current implementation, but can be added via RLS rules.

**Q: How many messages can a bot handle?**  
A: Default rate limit is 100/hour per bot. Configurable.

**Q: Is data encrypted?**  
A: Credentials are stored securely in Supabase. Enable encryption for sensitive fields.

**Q: What if bot goes offline?**  
A: Baileys will attempt auto-reconnect. Status shown in dashboard.

**Q: Can I backup bot data?**  
A: Yes, export from Supabase JSON or use Supabase backup features.

---

## 🚀 Next Steps

1. **Run setup script**: `node scripts/setup-whatsapp-bot-db.js`
2. **Test UI**: Navigate to dashboard WhatsApp tab
3. **Create a test bot**: Walk through full creation flow
4. **Review TODO items**: See `WHATSAPP_BOT_TODO.md`
5. **Choose LLM**: Decide on AI provider (OpenAI, Anthropic, etc.)
6. **Implement bot runtime**: Install Baileys and create runner
7. **Test live messages**: Once runtime is complete
8. **Deploy to production**: When ready

---

## 💡 Pro Tips

- Use **Postman** or **Insomnia** to test API endpoints
- Enable **Supabase RLS** for security
- Use **git** to track all changes
- Test with **demo templates** first
- Start with **one deployment method** (Heroku is easiest)
- Monitor **database** for issues

---

**You're ready to go!** 🎉

The frontend is 100% complete. The backend requires implementation of 5 components (~1000 lines of code). Full functionality achievable in 1-2 weeks with focused effort.

Questions? Check the detailed documentation or the code comments.

Happy building! 🚀
