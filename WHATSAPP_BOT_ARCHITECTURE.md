# WhatsApp Bot System - Architecture & Diagrams

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                      User Browser / Dashboard                        │
│  /chatbots-ai/dashboard?tab=whatsapp                                │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ HTTP/REST
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Next.js Frontend                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ WhatsAppBotSection (Master Component)                       │   │
│  │ - Bot List View                                             │   │
│  │ - Template Selection                                        │   │
│  │ - Bot Creation                                              │   │
│  │ - Configuration Panel                                       │   │
│  │ - Deployment Panel                                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
└──────────────┬──────────────────────────────────────────────────────┘
               │ API Calls (with auth token)
               ▼
┌─────────────────────────────────────────────────────────────────────┐
│              Next.js API Routes (Backend)                           │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ /api/chatbots/whatsapp/templates [GET] ✓                    │  │
│  │ - Fetch available bot templates                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ /api/chatbots/whatsapp/bots [GET/POST] ✓                    │  │
│  │ - Create new bot                                             │  │
│  │ - List user's bots                                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ /api/chatbots/whatsapp/bots/[id]/config [GET/POST] ✓        │  │
│  │ - Save bot configuration                                     │  │
│  │ - Get bot configuration                                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ /api/chatbots/whatsapp/bots/[id]/deploy [GET/POST] ✓        │  │
│  │ - Setup deployment configuration                             │  │
│  │ - Get deployment status                                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ /api/chatbots/whatsapp/bots/[id]/session [GET/POST] ❌      │  │
│  │ - Initialize session                                         │  │
│  │ - Get session status & QR code                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ /api/chatbots/whatsapp/bots/[id]/webhook [POST] ❌          │  │
│  │ - Receive messages from WhatsApp                             │  │
│  │ - Process and respond                                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────┬──────────────────────────┬──────────────────────┬────────┘
           │                          │                      │
           ▼                          ▼                      ▼
    ┌─────────────┐         ┌──────────────────┐    ┌──────────────┐
    │  Supabase   │         │  WhatsApp Bot    │    │ Deployment   │
    │  Database   │         │  Runner ❌       │    │ Executor ❌  │
    │  (Tables)   │         │  (Baileys)       │    │              │
    │             │         │                  │    │  - Heroku    │
    │ ✓ Complete  │         │ ❌ TODO          │    │  - Railway   │
    └─────────────┘         │                  │    │  - Render    │
                            │ - Sessions       │    │  - Docker    │
                            │ - Messages       │    │  - Direct    │
                            └──────────────────┘    └──────────────┘
                                    │
                                    ▼
                            ┌──────────────────┐
                            │  WhatsApp User   │
                            │  (Receives/sends │
                            │   messages)      │
                            └──────────────────┘
```

## Data Flow: Creating a Bot

```
User Action                 Frontend                Backend              Database
─────────────────────────────────────────────────────────────────────────────────

Select Template  ──────→  Templates Page  ────→  GET /templates  ────→  Bot Templates
                          Displays 5 options      Returns templates      Table
                          
Fill Bot Form    ──────→  Creation Form  ────────→  POST /bots  ────────→  Bots
                          Validates input         Creates bot            Table
                          
Configure Bot    ──────→  Config Panel  ──────────→  POST /config  ──────→  Bot Config
                          5 tabs                      Saves settings        Table
                          
Deploy Bot       ──────→  Deploy Panel  ──────────→  POST /deploy  ──────→  Deployment
                          Select method             Stores config          Config Table
                          
Done             ◀─────  Success Page  ◀─────────  Returns URL  ◀──────  Status Update
                         Shows bot ready
```

## Message Flow: User Sends Message to Bot

```
(After bot is deployed and connected)

WhatsApp User              Baileys Bot           API Webhook         LLM              Database
─────────────────────────────────────────────────────────────────────────────────────────

User sends message  ──────→  Receives via   ─────────→  /webhook  ──────→  Generate  ─────→  Log
  "Hello bot"               WebSocket              POST              response          Message
                            (Baileys)                                        
                                                                    ◀────────────────
                                                    Get bot config
                                                    from database
                                                    
                          ◀─────────────────────────────────────────────────
                          SendMessage()
                          "Hello! How can I help?"
                          
Shows response  ◀─────────────────────────────────────────────────────────────────────────────
  "Hello! How can
   I help?"
```

## Component Hierarchy

```
Dashboard Page (/chatbots-ai/dashboard)
│
└─ WhatsAppBotSection (Master)
   │
   ├─ View: List
   │  └─ Bot Cards (map each bot)
   │     ├─ Status Badge
   │     ├─ Configure Button
   │     └─ Deploy Button
   │
   ├─ View: Select Template
   │  └─ WhatsAppBotTemplateSelector
   │     └─ Template Cards (map 5 templates)
   │
   ├─ View: Create Bot
   │  └─ WhatsAppBotCreationForm
   │     ├─ Bot Name Input
   │     ├─ Phone Number Input
   │     └─ Deployment Method Select
   │
   ├─ View: Configure
   │  └─ WhatsAppBotConfigPanel
   │     ├─ Tab: Basic
   │     │  ├─ AI Prompt
   │     │  ├─ Company Name
   │     │  └─ Brand Color
   │     │
   │     ├─ Tab: Messages
   │     │  ├─ Welcome Message
   │     │  └─ Goodbye Message
   │     │
   │     ├─ Tab: Commands
   │     │  ├─ Add Command Form
   │     │  └─ Commands List
   │     │
   │     └─ Tab: Advanced
   │        ├─ Business Hours Toggle + Time Inputs
   │        ├─ Whitelist Toggle + Phone List
   │        └─ Rate Limiting Inputs
   │
   └─ View: Deploy
      └─ WhatsAppBotDeploymentPanel
         ├─ Method Selector
         │  ├─ Direct Server Fields
         │  ├─ Heroku Fields
         │  ├─ Railway Fields
         │  ├─ Render Fields
         │  └─ Docker Image Field
         │
         ├─ Environment Variables
         │  ├─ Add Variable Form
         │  └─ Variables List
         │
         └─ Deploy Button
```

## Database Schema Relationships

```
┌─────────────────────────────┐
│  whatsapp_bot_templates     │
├─────────────────────────────┤
│ id (PK)                     │
│ name                        │
│ description                 │
│ category                    │
│ icon                        │
│ features (JSON)             │
│ default_config (JSON)       │
│ is_active                   │
└────────┬────────────────────┘
         │
         │ references
         │
         ▼
┌─────────────────────────────┐         ┌────────────────────────┐
│  whatsapp_bots              │         │  chatbot_users         │
├─────────────────────────────┤         ├────────────────────────┤
│ id (PK)                     │         │ id (PK)                │
│ user_id (FK) ──────────────────────→ │ auth_id                │
│ template_id (FK) ──────┐             │ email                  │
│ bot_name               │             │ username               │
│ phone_number           │             │ coin_balance           │
│ status                 │             └────────────────────────┘
│ deployment_method      │
│ environment_variables  │
│ created_at             │
│ updated_at             │
└──┬──────────────────────┘
   │
   ├─ has-many ─→ ┌──────────────────────────┐
   │              │ whatsapp_bot_config      │
   │              ├──────────────────────────┤
   │              │ id (PK)                  │
   │              │ bot_id (FK)              │
   │              │ prompt                   │
   │              │ welcome_message          │
   │              │ commands (JSON)          │
   │              │ business_hours (JSON)    │
   │              │ access_control (JSON)    │
   │              │ branding (JSON)          │
   │              └──────────────────────────┘
   │
   ├─ has-many ─→ ┌──────────────────────────┐
   │              │ whatsapp_deployment_config
   │              ├──────────────────────────┤
   │              │ id (PK)                  │
   │              │ bot_id (FK)              │
   │              │ method                   │
   │              │ docker_image             │
   │              │ heroku_app_name          │
   │              │ railway_project_id       │
   │              │ render_service_id        │
   │              │ server_host              │
   │              └──────────────────────────┘
   │
   ├─ has-many ─→ ┌──────────────────────────┐
   │              │ whatsapp_bot_sessions    │
   │              ├──────────────────────────┤
   │              │ id (PK)                  │
   │              │ bot_id (FK)              │
   │              │ session_id               │
   │              │ session_data (JSON)      │
   │              │ is_active                │
   │              │ connected_at             │
   │              └──────────────────────────┘
   │
   ├─ has-many ─→ ┌──────────────────────────┐
   │              │ whatsapp_bot_logs        │
   │              ├──────────────────────────┤
   │              │ id (PK)                  │
   │              │ bot_id (FK)              │
   │              │ log_type                 │
   │              │ message                  │
   │              │ metadata (JSON)          │
   │              │ created_at               │
   │              └──────────────────────────┘
   │
   └─ has-many ─→ ┌──────────────────────────┐
                  │ whatsapp_bot_analytics   │
                  ├──────────────────────────┤
                  │ id (PK)                  │
                  │ bot_id (FK)              │
                  │ date                     │
                  │ total_messages_sent      │
                  │ total_messages_received  │
                  │ unique_contacts          │
                  │ uptime_percentage        │
                  └──────────────────────────┘
```

## Authentication & Authorization Flow

```
User in Browser
│
├─ Signs in at /chatbots-ai
│  └─ Receives: chatbot_token (JWT)
│
├─ Stored in: localStorage.chatbot_token
│
└─ Each API Request
   ├─ Headers: Authorization: Bearer {token}
   │
   └─ Backend Verification
      ├─ Verify token with Supabase auth
      ├─ Get user ID from token
      ├─ Check user owns the resource
      └─ Allow operation if authorized

RLS (Row Level Security) on Database:
─ Users can only see their own bots
─ Users can only modify their own bots
─ Users can only access their own credentials
─ Bot activity logs only visible to bot owner
```

## Deployment Methods Architecture

```
User selects deployment method → System executes appropriate flow:

┌─ Direct Server ──────────┐
│ SSH to: server_host:server_port
│ Auth with: server_auth_key
│ Deploy: Start bot process via systemctl/supervisord
│ Result: Bot running on user's server
└──────────────────────────┘

┌─ Heroku ─────────────────┐
│ API: heroku.com/api/v1
│ App: user's heroku_app_name
│ Deploy: git push heroku main
│ Result: Bot on: {app_name}.herokuapp.com
└──────────────────────────┘

┌─ Railway ────────────────┐
│ API: railway.app
│ Token: user's railway_token
│ Deploy: railway deploy
│ Result: Bot on railway-provided URL
└──────────────────────────┘

┌─ Render ─────────────────┐
│ API: render.com/api/v1
│ Service: user's render_service_id
│ Deploy: Push to linked repo
│ Result: Bot on render-provided URL
└──────────────────────────┘

┌─ Docker ─────────────────┐
│ Generate: docker-compose.yml
│ Package: Dockerfile + compose file
│ User: Deploys with `docker-compose up`
│ Result: Bot in Docker container
└──────────────────────────┘
```

## Session Management Flow (For Baileys)

```
Bot Created & Deployed
│
├─ Initialize Baileys Connection
│  ├─ Check for existing session in DB
│  │  ├─ If exists: Load from whatsapp_bot_sessions
│  │  └─ If not: Generate new
│  │
│  └─ Baileys Handshake
│     ├─ Generate QR Code
│     ├─ Display to user (in dashboard)
│     ├─ User scans with WhatsApp
│     └─ Connection established
│
├─ Store Session
│  └─ Save to whatsapp_bot_sessions table
│     ├─ session_data: Auth tokens
│     ├─ session_id: Unique identifier
│     └─ is_active: true
│
├─ Connection Maintained
│  ├─ Listen for messages
│  ├─ Handle disconnections
│  ├─ Auto-reconnect on failure
│  └─ Keep session valid
│
└─ User Logout (Optional)
   └─ Clear session from database
      └─ is_active: false
```

## Error Handling Flow

```
User Action
│
└─ Validation
   ├─ Input validation (client-side)
   │  └─ Phone number, bot name, URL format
   │
   └─ API Validation (server-side)
      ├─ Token verification
      │  └─ If invalid: 401 Unauthorized
      │
      ├─ Resource ownership
      │  └─ If not owner: 403 Forbidden
      │
      ├─ Rate limiting
      │  └─ If exceeded: 429 Too Many Requests
      │
      ├─ Database constraints
      │  └─ If violated: 400 Bad Request
      │
      └─ External service errors
         ├─ LLM timeout: Return cached response
         ├─ Deployment failure: Log and notify
         └─ WhatsApp connection: Auto-retry

Error Response Format:
{
  "error": "Human readable error message",
  "code": "ERROR_CODE",
  "details": { ... },
  "timestamp": "2024-01-01T00:00:00Z"
}

Logging:
├─ Database: whatsapp_bot_logs
├─ Console: Development only
└─ Monitoring: Optional Sentry/DataDog integration
```

---

## Performance Considerations

```
Database Queries:
├─ Indexed columns: id, user_id, bot_id, status
├─ Connection pooling: Enabled by default
└─ Query optimization: Use specific SELECT columns

Caching Strategy:
├─ Templates: Cache in browser (static data)
├─ User bots: Cache with 30-second TTL
├─ Bot config: Cache with 1-minute TTL
└─ Session state: Real-time (no cache)

Rate Limiting (Per Bot):
├─ Messages: 100 per hour (configurable)
├─ API calls: 1000 per hour (server-side)
└─ Database writes: Batch where possible

Async Operations:
├─ Message processing: Queue system (optional)
├─ Deployment: Run in background job
└─ Analytics: Update asynchronously
```

---

This architecture supports:
- ✅ Multi-user isolation
- ✅ Secure authentication
- ✅ Scalable deployment
- ✅ Real-time messaging
- ✅ Activity tracking
- ✅ Error recovery
- ✅ Performance optimization
